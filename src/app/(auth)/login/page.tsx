'use client';

// src/app/(auth)/login/page.tsx

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// ── الألوان — ثيم فاتح (مطابقة لباقي الموقع) ──────────────
const C = {
  bg:    '#FAFAF8',
  surf:  '#F5F3EF',
  card:  '#FFFFFF',
  b1:    '#EAE7E1',
  b2:    '#DDD9D1',
  gold:  '#A8823C',
  goldD: '#8A6830',
  t1:    '#1A1714',
  t2:    '#6B6560',
  t3:    '#A39E96',
  ok:    '#3D9960',
  err:   '#C0504D',
};

// ══════════════════════════════════════════════════════════
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div dir="rtl" style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #EAE7E1', borderTopColor: '#A8823C', animation: 'spin 1s linear infinite' }} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') || '/';

  const [form,       setForm]       = useState({ email: '', password: '' });
  const [showPwd,    setShowPwd]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);
  const [error,      setError]      = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    setError('');

    // ════════════════════════════════════════════════════════
    // ✅ الخطوة 1: نجرّب الدخول كـ "تاجر" أولاً
    // عن طريق نظام المصادقة المستقل بتاعه (Vendor table + JWT cookie)
    // — مش له أي علاقة بـ NextAuth أو جدول User خالص
    // ════════════════════════════════════════════════════════
    try {
      const vendorRes = await fetch('/api/vendor/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });

      if (vendorRes.ok) {
        // كوكي التاجر اتسجّلت تلقائياً من جوه الـ API نفسه
        setLoading(false);
        router.push('/vendor/dashboard');
        router.refresh();
        return;
      }

      // ✅ لو الحساب تاجر فعلاً بس متوقّف (403) — نعرض الرسالة ونوقف هنا
      // (مفيش لازمة نكمل نتحقق من جدول User لأننا متأكدين إنه تاجر)
      if (vendorRes.status === 403) {
        const data = await vendorRes.json().catch(() => ({}));
        setLoading(false);
        setError(data.error || 'تم تعليق حسابك. تواصل مع الإدارة.');
        return;
      }

      // غير ذلك (401 = مش تاجر، أو باسورد غلط) → نكمل تحقق العميل تحت
    } catch {
      // تعذّر الاتصال بـ API التاجر — نتجاهل ونكمل تحقق العميل بأمان
    }

    // ════════════════════════════════════════════════════════
    // الخطوة 2: لو مش تاجر — نتحقق كعميل عادي (NextAuth)
    // ════════════════════════════════════════════════════════
    const res = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleGoogle = async () => {
    setGoogleLoad(true);
    await signIn('google', { callbackUrl });
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: C.bg,
        display:   'flex',
        alignItems:'stretch',
      }}
    >
      {/* ══ يمين: لوحة العلامة التجارية ══ */}
      <div
        className="hidden md:flex"
        style={{
          flex:           1,
          background:     `linear-gradient(160deg, #FFFFFF 0%, #F7F0E2 50%, #F2E9D8 100%)`,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        48,
          position:       'relative',
          overflow:       'hidden',
        }}
      >
        {/* دوائر زخرفية */}
        {[320, 220, 130].map((size, i) => (
          <div
            key={i}
            style={{
              position:     'absolute',
              width:        size,
              height:       size,
              borderRadius: '50%',
              border:       `1px solid ${C.gold}${['0E', '16', '20'][i]}`,
              top:          '50%',
              left:         '50%',
              transform:    'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* نقاط مضيئة */}
        {[
          { top: '20%', left: '25%' },
          { top: '70%', left: '15%' },
          { top: '40%', left: '75%' },
          { top: '80%', left: '65%' },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position:     'absolute',
              width:        3,
              height:       3,
              borderRadius: '50%',
              background:   C.gold,
              opacity:      0.45,
              ...pos,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          {/* الشعار */}
          <div
            style={{
              fontFamily:    "'Cormorant Garant', serif",
              fontSize:      68,
              fontWeight:    300,
              color:         C.t1,
              letterSpacing: '0.2em',
              lineHeight:    1,
              marginBottom:  8,
            }}
          >
            VŌGU
          </div>
          <div
            style={{
              fontSize:      11,
              color:         C.t3,
              letterSpacing: '0.3em',
              fontFamily:    'Tajawal, sans-serif',
              marginBottom:  24,
              textTransform: 'uppercase',
            }}
          >
            أزياء فاخرة
          </div>

          {/* خط فاصل ذهبي */}
          <div
            style={{
              width:      80,
              height:     1,
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
              margin:     '0 auto 28px',
            }}
          />

          <p
            style={{
              fontSize:   14,
              color:      C.t2,
              fontFamily: 'Tajawal, sans-serif',
              lineHeight: 1.9,
              maxWidth:   260,
              margin:     '0 auto 40px',
            }}
          >
            مرحباً بعودتك — عالمك من الأناقة والفخامة في انتظارك
          </p>

          {/* بطاقات صغيرة */}
          {[
            { icon: '✦', text: 'تشكيلات حصرية موسمية' },
            { icon: '◈', text: 'توصيات AI مخصصة لك'   },
            { icon: '◉', text: 'شحن سريع لباب منزلك'  },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12 }}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            10,
                marginBottom:   12,
                justifyContent: 'flex-end',
              }}
            >
              <span
                style={{
                  fontSize:   12,
                  color:      C.t2,
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                {item.text}
              </span>
              <span style={{ color: C.gold, fontSize: 14 }}>{item.icon}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ══ يسار: فورم تسجيل الدخول ══ */}
      <div
        style={{
          width:          '100%',
          maxWidth:       460,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          padding:        '48px 40px',
          background:     C.surf,
          borderRight:    `1px solid ${C.b1}`,
          position:       'relative',
        }}
      >
        {/* رابط الرجوع */}
        <Link
          href="/"
          style={{
            position:       'absolute',
            top:            24,
            left:           24,
            display:        'flex',
            alignItems:     'center',
            gap:            6,
            color:          C.t3,
            fontSize:       12,
            fontFamily:     'Tajawal, sans-serif',
            textDecoration: 'none',
            transition:     'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.t3)}
        >
          <ArrowLeft size={14} />
          رجوع للمتجر
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* العنوان */}
          <div style={{ marginBottom: 36 }}>
            <div
              style={{
                fontFamily:    "'Cormorant Garant', serif",
                fontSize:      13,
                color:         C.gold,
                letterSpacing: '0.2em',
                marginBottom:  10,
                textTransform: 'uppercase',
              }}
            >
              VŌGU
            </div>
            <h1
              style={{
                fontFamily:   'Tajawal, sans-serif',
                fontSize:     28,
                fontWeight:   700,
                color:        C.t1,
                marginBottom: 6,
                lineHeight:   1.2,
              }}
            >
              أهلاً بعودتك 👋
            </h1>
            <p style={{ fontSize: 13, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
              سجّل دخولك للوصول إلى حسابك وطلباتك
            </p>
          </div>

          {/* رسالة خطأ الـ URL (مثلاً إذا انتهت الجلسة) */}
          {searchParams.get('error') === 'SessionRequired' && (
            <div
              style={{
                background:   C.gold + '15',
                border:       `1px solid ${C.gold}44`,
                borderRadius: 8,
                padding:      '10px 14px',
                marginBottom: 20,
                fontSize:     12,
                color:        C.gold,
                fontFamily:   'Tajawal, sans-serif',
                display:      'flex',
                alignItems:   'center',
                gap:          8,
              }}
            >
              <Sparkles size={13} />
              يرجى تسجيل الدخول أولاً للمتابعة
            </div>
          )}

          {/* رسالة الخطأ */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background:   C.err + '15',
                border:       `1px solid ${C.err}44`,
                borderRadius: 8,
                padding:      '10px 14px',
                marginBottom: 20,
                fontSize:     12,
                color:        C.err,
                fontFamily:   'Tajawal, sans-serif',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* ── الفورم ── */}
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            {/* البريد الإلكتروني */}
            <div>
              <label
                style={{
                  fontSize:     12,
                  color:        C.t2,
                  fontFamily:   'Tajawal, sans-serif',
                  display:      'block',
                  marginBottom: 7,
                }}
              >
                البريد الإلكتروني
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  dir="ltr"
                  required
                  autoComplete="email"
                  style={{
                    width:        '100%',
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 10,
                    padding:      '13px 42px 13px 14px',
                    color:        C.t1,
                    fontSize:     13,
                    fontFamily:   'Tajawal, sans-serif',
                    outline:      'none',
                    transition:   'border-color 0.2s, box-shadow 0.2s',
                    boxSizing:    'border-box',
                    textAlign:    'right',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.goldD;
                    e.currentTarget.style.boxShadow   = `0 0 0 3px ${C.goldD}18`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.b2;
                    e.currentTarget.style.boxShadow   = 'none';
                  }}
                />
                <Mail
                  size={15}
                  color={C.t3}
                  style={{
                    position:      'absolute',
                    top:           '50%',
                    right:         14,
                    transform:     'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <div
                style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  marginBottom:   7,
                }}
              >
                <Link
                  href="/forgot-password"
                  style={{
                    fontSize:       11,
                    color:          C.gold,
                    textDecoration: 'none',
                    fontFamily:     'Tajawal, sans-serif',
                    transition:     'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  نسيت كلمة المرور؟
                </Link>
                <label
                  style={{
                    fontSize:   12,
                    color:      C.t2,
                    fontFamily: 'Tajawal, sans-serif',
                  }}
                >
                  كلمة المرور
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  dir="ltr"
                  required
                  autoComplete="current-password"
                  style={{
                    width:        '100%',
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 10,
                    padding:      '13px 42px 13px 42px',
                    color:        C.t1,
                    fontSize:     13,
                    fontFamily:   'Tajawal, sans-serif',
                    outline:      'none',
                    transition:   'border-color 0.2s, box-shadow 0.2s',
                    boxSizing:    'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.goldD;
                    e.currentTarget.style.boxShadow   = `0 0 0 3px ${C.goldD}18`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.b2;
                    e.currentTarget.style.boxShadow   = 'none';
                  }}
                />
                <Lock
                  size={15}
                  color={C.t3}
                  style={{
                    position:      'absolute',
                    top:           '50%',
                    right:         14,
                    transform:     'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position:   'absolute',
                    top:        '50%',
                    left:       14,
                    transform:  'translateY(-50%)',
                    background: 'none',
                    border:     'none',
                    cursor:     'pointer',
                    color:      C.t3,
                    display:    'flex',
                    padding:    0,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.t3)}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              style={{
                width:        '100%',
                background:   loading
                  ? C.b2
                  : `linear-gradient(135deg, ${C.gold}, ${C.goldD})`,
                color:        loading ? C.t3 : '#FFFFFF',
                border:       'none',
                borderRadius: 10,
                padding:      '14px',
                fontSize:     14,
                fontFamily:   'Tajawal, sans-serif',
                fontWeight:   700,
                cursor:       loading ? 'not-allowed' : 'pointer',
                transition:   'all 0.2s',
                letterSpacing:'0.02em',
              }}
            >
              {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </motion.button>
          </form>

          {/* ── فاصل ── */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        12,
              margin:     '22px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: C.b1 }} />
            <span
              style={{
                fontSize:   11,
                color:      C.t3,
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              أو
            </span>
            <div style={{ flex: 1, height: 1, background: C.b1 }} />
          </div>

          {/* ── Google ── */}
          <button
            onClick={handleGoogle}
            disabled={googleLoad}
            style={{
              width:          '100%',
              background:     C.card,
              border:         `1px solid ${C.b2}`,
              borderRadius:   10,
              padding:        '13px',
              color:          C.t1,
              fontSize:       13,
              fontFamily:     'Tajawal, sans-serif',
              fontWeight:     600,
              cursor:         googleLoad ? 'not-allowed' : 'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            10,
              transition:     'border-color 0.2s, background 0.2s',
              opacity:        googleLoad ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!googleLoad) (e.currentTarget as HTMLElement).style.borderColor = C.t3;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = C.b2;
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoad ? 'جارٍ التحويل...' : 'الدخول بحساب Google'}
          </button>

          {/* ── رابط إنشاء حساب ── */}
          <p
            style={{
              textAlign:  'center',
              marginTop:  24,
              fontSize:   13,
              color:      C.t2,
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            ليس لديك حساب؟{' '}
            <Link
              href="/register"
              style={{
                color:          C.gold,
                textDecoration: 'none',
                fontWeight:     600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}