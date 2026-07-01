// src/lib/createNotification.ts
// يُستدعى هذا الملف عند كل تحديث لحالة الطلب

import { prisma } from '@/lib/db';

// خريطة حالات الطلب → رسالة عربية
const STATUS_MESSAGES: Record<string, { title: string; message: string; emoji: string }> = {
  CONFIRMED: {
    emoji:   '✅',
    title:   'تم تأكيد طلبك',
    message: 'رقم الطلب تم قبوله وجاري التجهيز',
  },
  PROCESSING: {
    emoji:   '📦',
    title:   'جاري تجهيز طلبك',
    message: 'فريقنا يجهّز طلبك بعناية الآن',
  },
  SHIPPED: {
    emoji:   '🚚',
    title:   'طلبك في الطريق إليك!',
    message: 'تم شحن طلبك وسيصلك قريباً',
  },
  DELIVERED: {
    emoji:   '🎉',
    title:   'وصل طلبك!',
    message: 'تم توصيل طلبك بنجاح. نتمنى أن يعجبك',
  },
  CANCELLED: {
    emoji:   '❌',
    title:   'تم إلغاء الطلب',
    message: 'تم إلغاء طلبك. تواصل معنا لأي استفسار',
  },
  RETURNED: {
    emoji:   '↩️',
    title:   'تم استلام المرتجع',
    message: 'تم استلام المنتج المُرجَع وسيتم معالجة الاسترداد',
  },
};

export async function createOrderNotification(
  userId:  string,
  orderId: string,
  status:  string,
) {
  const info = STATUS_MESSAGES[status];
  if (!info) return; // لا نرسل إشعاراً لحالات غير معرّفة

  await prisma.notification.create({
    data: {
      userId,
      orderId,
      type:    'ORDER_UPDATE',
      title:   `${info.emoji} ${info.title}`,
      message: info.message,
      isRead:  false,
    },
  });
}

// إشعار عند إنشاء طلب جديد (يُستدعى من /api/checkout)
export async function createNewOrderNotification(
  userId:  string,
  orderId: string,
) {
  await prisma.notification.create({
    data: {
      userId,
      orderId,
      type:    'ORDER_UPDATE',
      title:   '🛍️ تم استلام طلبك',
      message: 'شكراً لطلبك! سيتم مراجعته والتأكيد قريباً',
      isRead:  false,
    },
  });
}