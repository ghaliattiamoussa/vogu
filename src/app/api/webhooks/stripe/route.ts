import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/mail'

// ─── يجب أن يعمل على Node runtime لأن Stripe يحتاج raw body ───────────────
export const runtime = 'nodejs'

// ─────────────────────────────────────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { orderId, userId } = session.metadata ?? {}

  if (!orderId) {
    console.error('[Webhook] checkout.session.completed: orderId missing from metadata')
    return
  }

  // 1. تحديث حالة الطلب إلى PROCESSING
  const order = await db.order.update({
    where: { id: orderId },
    data: {
      status:                 'PROCESSING',
      paymentStatus:          'PAID',
      stripePaymentIntentId:  session.payment_intent as string,
      paidAt:                 new Date(),
    },
    include: {
      user:  { select: { email: true, name: true } },
      items: {
        include: {
          product: { select: { name: true, images: true, price: true } },
        },
      },
    },
  })

  // 2. مسح سلة التسوق الخاصة بالمستخدم
  if (userId) {
    await db.cartItem
      .deleteMany({ where: { cart: { userId } } })
      .catch((err) => console.error('[Webhook] Failed to clear cart:', err))
  }

  // 3. إرسال إيميل تأكيد الطلب (لا يوقف العملية إذا فشل)
  if (order.user?.email) {
    await sendOrderConfirmationEmail({
      to:         order.user.email,
      userName:   order.user.name ?? 'عزيزنا العميل',
      orderId:    order.id,
      orderItems: order.items.map((item) => ({
        name:     item.product.name,
        image:    item.product.images[0] ?? '',
        price:    item.product.price,
        quantity: item.quantity,
        size:     item.size ?? undefined,
        color:    item.color ?? undefined,
      })),
      total:          order.total,
      shippingAddress: order.shippingAddress as string,
    }).catch((err) => console.error('[Webhook] Failed to send email:', err))
  }

  console.log(`[Webhook] ✅ Order ${orderId} marked as PROCESSING`)
}


async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { orderId } = paymentIntent.metadata ?? {}
  if (!orderId) return

  await db.order
    .update({
      where: { id: orderId },
      data:  {
        paymentStatus:         'PAID',
        stripePaymentIntentId: paymentIntent.id,
        paidAt:                new Date(),
      },
    })
    .catch((err) => console.error('[Webhook] payment_intent.succeeded error:', err))

  console.log(`[Webhook] ✅ PaymentIntent ${paymentIntent.id} succeeded for order ${orderId}`)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { orderId } = paymentIntent.metadata ?? {}
  if (!orderId) return

  await db.order
    .update({
      where: { id: orderId },
      data:  {
        status:        'CANCELLED',
        paymentStatus: 'FAILED',
      },
    })
    .catch((err) => console.error('[Webhook] payment_intent.payment_failed error:', err))

  console.log(`[Webhook] ❌ Payment failed for order ${orderId}`)
}

async function handleRefundCreated(charge: Stripe.Charge) {
  if (!charge.payment_intent) return

  const order = await db.order.findFirst({
    where: { stripePaymentIntentId: charge.payment_intent as string },
  })

  if (!order) return

  await db.order.update({
    where: { id: order.id },
    data:  { paymentStatus: 'REFUNDED', status: 'REFUNDED' },
  })

  console.log(`[Webhook] 🔄 Order ${order.id} marked as REFUNDED`)
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN POST HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. قراءة الـ body كنص خام (ضروري لـ Stripe signature)
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    )
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set in environment')
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 },
    )
  }

  // 2. التحقق من صحة التوقيع
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed'
    console.error('[Webhook] ⚠️  Signature error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  console.log(`[Webhook] Received: ${event.type}`)

  // 3. معالجة الأحداث
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await handleRefundCreated(event.data.object as Stripe.Charge)
        break

      default:
        // الأحداث الأخرى يتم تجاهلها بصمت
        break
    }
  } catch (err) {
    // نُعيد 200 حتى لا يُعيد Stripe الإرسال — لكن نسجّل الخطأ
    const message = err instanceof Error ? err.message : 'Handler error'
    console.error(`[Webhook] ❌ Error handling ${event.type}:`, message)
    return NextResponse.json({ received: true, warning: message }, { status: 200 })
  }

  return NextResponse.json({ received: true })
}