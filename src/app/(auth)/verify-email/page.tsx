'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

const C = {
  bg:   '#070707',
  surf: '#0D0D0D',
  b1:   '#1A1A1A',
  gold: '#C9A86E',
  t1:   '#EDE8DF',
  t2:   '#8A8480',
  t3:   '#484542',
  ok:   '#5CB87A',
  err:  '#D07070',
};

function VerifyEmailContent() {
  const params  = useSearchParams();
  const success = params.get('success') === 'true';
  const error   = params.get('error');
  const email   = params.get('email') ?? '';

  // ── نجاح التحقق ──
  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: C.ok + '20', border: `1px solid ${C.ok}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <CheckCircle size={28} color={C.ok} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, fontFamily: 'Tajawal', marginBottom: 8 }}>
          تم تأكيد حسابك! 🎉
        </h1>
        <p style={{ fontSize: 14, color: C.t2, fontFamily: 'Tajawal', marginBottom: 28, lineHeight: 1.7 }}>
          مرحباً بك في عائلة VŌGU. حسابك الآن نشط ويمكنك تسجيل الدخول.
        </p>
        <Link href="/login" style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${C.gold}, #9A7848)`,
          color: '#060606', textDecoration: 'none',
          fontFamily: 'Tajawal', fontSize: 14, fontWeight: 700,
          padding: '12px 32px', borderRadius: 10,
        }}>
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  // ── خطأ ──
  if (error) {
    const messages: Record<string, string> = {
      'invalid-token': 'رابط التحقق غير صالح أو تم استخدامه مسبقاً.',
      'expired-token': 'انتهت صلاحية رابط التحقق. يرجى طلب رابط جديد.',
      'missing-token': 'رابط التحقق غير مكتمل.',
      'server-error':  'حدث خطأ في الخادم. يرجى المحاولة مجدداً.',
    };

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: C.err + '20', border: `1px solid ${C.err}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <XCircle size={28} color={C.err} />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.t1, fontFamily: 'Tajawal', marginBottom: 8 }}>
          فشل التحقق
        </h1>
        <p style={{ fontSize: 14, color: C.t2, fontFamily: 'Tajawal', marginBottom: 28, lineHeight: 1.7 }}>
          {messages[error] ?? 'حدث خطأ غير متوقع.'}
        </p>
        <Link href="/register" style={{
          display: 'inline-block',
          background: C.gold,
          color: '#060606', textDecoration: 'none',
          fontFamily: 'Tajawal', fontSize: 14, fontWeight: 700,
          padding: '12px 32px', borderRadius: 10,
        }}>
          العودة للتسجيل
        </Link>
      </div>
    );
  }

  // ── في انتظار التحقق (بعد التسجيل مباشرة) ──
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: C.gold + '20', border: `1px solid ${C.gold}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Mail size={28} color={C.gold} />
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, fontFamily: 'Tajawal', marginBottom: 8 }}>
        تحقق من بريدك الإلكتروني ✉️
      </h1>
      {email && (
        <p style={{ fontSize: 14, color: C.gold, fontFamily: 'Tajawal', marginBottom: 6 }}>
          {email}
        </p>
      )}
      <p style={{ fontSize: 13, color: C.t2, fontFamily: 'Tajawal', marginBottom: 28, lineHeight: 1.8, maxWidth: 340, margin: '0 auto 28px' }}>
        أرسلنا إليك رابط تأكيد. تحقق من صندوق الوارد أو Spam.
        الرابط صالح لـ 24 ساعة.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
        <Clock size={13} color={C.t3} />
        <span style={{ fontSize: 12, color: C.t3, fontFamily: 'Tajawal' }}>
          لم يصلك الإيميل؟ تحقق من Spam أو أعد التسجيل.
        </span>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: C.surf,
        border: `1px solid ${C.b1}`,
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 440,
      }}>
        <div style={{
          fontFamily: "'Cormorant Garant', serif",
          fontSize: 24,
          color: C.gold,
          letterSpacing: '0.15em',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          VŌGU
        </div>
        <Suspense fallback={<div style={{ height: 200 }} />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}