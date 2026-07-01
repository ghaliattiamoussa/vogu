'use client';

// src/app/(auth)/register/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// ── الألوان ─────────────────────────────────────────────
const C = {
  bg:    '#070707',
  surf:  '#0D0D0D',
  card:  '#111111',
  b1:    '#1A1A1A',
  b2:    '#262626',
  gold:  '#C9A86E',
  goldD: '#9A7848',
  t1:    '#EDE8DF',
  t2:    '#8A8480',
  t3:    '#484542',
  ok:    '#5CB87A',
  err:   '#D07070',
};

// ── مؤشر قوة كلمة المرور ────────────────────────────────
function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;

  const map = [
    { label: '',        color: C.b2  },
    { label: 'ضعيفة',  color: C.err },
    { label: 'متوسطة', color: '#E8A838' },
    { label: 'جيدة',   color: C.gold },
    { label: 'قوية',   color: C.ok  },
  ];
  return { score, ...map[score] };
}

// ══════════════════════════════════════════════════════════
export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd,   setShowPwd]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [googleLoad,setGoogleLoad]= useState(false);

  const strength = getStrength(form.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (strength.score < 2) {
      setError('كلمة المرور ضعيفة جداً');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ، حاول مجدداً');
        return;
      }

      // تسجيل الدخول تلقائياً بعد التسجيل
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch {
      setError('خطأ في الاتصال، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoad(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight:       '100vh',
        background:      C.bg,
        display:         'flex',
        alignItems:      'stretch',
      }}
    >
      {/* ══ يمين: لوحة العلامة التجارية ══ */}
      <div
        style={{
          flex:            1,
          background:      `linear-gradient(160deg, #0D0D0D 0%, #1A1000 50%, #0D0A00 100%)`,
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          padding:         48,
          position:        'relative',
          overflow:        'hidden',
        }}
        className="hidden md:flex"
      >
        {/* دوائر زخرفية خلفية */}
        {[300, 200, 120].map((size, i) => (
          <div
            key={i}
            style={{
              position:     'absolute',
              width:        size,
              height:       size,
              borderRadius: '50%',
              border:       `1px solid ${C.gold}${['11', '18', '22'][i]}`,
              top:          '50%',
              left:         '50%',
              transform:    'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* المحتوى */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          {/* الشعار */}
          <div
            style={{
              fontFamily:    "'Cormorant Garant', serif",
              fontSize:      64,
              fontWeight:    300,
              color:         C.t1,
              letterSpacing: '0.2em',
              lineHeight:    1,
              marginBottom:  16,
            }}
          >
            VŌGU
          </div>
          <div
            style={{
              width:        60,
              height:       1,
              background:   `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
              margin:       '0 auto 20px',
            }}
          />
          <p
            style={{
              fontSize:      14,
              color:         C.t3,
              fontFamily:    'Tajawal, sans-serif',
              letterSpacing: '0.1em',
              lineHeight:    1.8,
              maxWidth:      260,
            }}
          >
            انضم إلى مجتمع VŌGU واستمتع بتجربة تسوق فاخرة لا مثيل لها
          </p>

          {/* مميزات العضوية */}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end' }}>
            {[
              'وصول حصري لأحدث التشكيلات',
              'خصومات خاصة لأعضاء VŌGU',
              'شحن مجاني على جميع طلباتك',
              'مستشار أزياء AI شخصي',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span
                  style={{
                    fontSize:   12,
                    color:      C.t2,
                    fontFamily: 'Tajawal, sans-serif',
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    width:          18,
                    height:         18,
                    borderRadius:   '50%',
                    background:     C.gold + '22',
                    border:         `1px solid ${C.gold}44`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flexShrink:     0,
                  }}
                >
                  <Check size={10} color={C.gold} />
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══ يسار: فورم التسجيل ══ */}
      <div
        style={{
          width:           '100%',
          maxWidth:        480,
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
          padding:         '48px 40px',
          background:      C.surf,
          borderRight:     `1px solid ${C.b1}`,
          position:        'relative',
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
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily:    "'Cormorant Garant', serif",
                fontSize:      13,
                color:         C.gold,
                letterSpacing: '0.2em',
                marginBottom:  8,
                textTransform: 'uppercase',
              }}
            >
              VŌGU
            </div>
            <h1
              style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize:   28,
                fontWeight: 700,
                color:      C.t1,
                marginBottom: 6,
              }}
            >
              إنشاء حساب جديد
            </h1>
            <p style={{ fontSize: 13, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
              أهلاً بك في عائلة VŌGU
            </p>
          </div>

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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* الاسم الكامل */}
            <div>
              <label style={{ fontSize: 12, color: C.t2, fontFamily: 'Tajawal, sans-serif', display: 'block', marginBottom: 7 }}>
                الاسم الكامل
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="محمد أحمد"
                  dir="rtl"
                  required
                  style={{
                    width:        '100%',
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 10,
                    padding:      '12px 42px 12px 14px',
                    color:        C.t1,
                    fontSize:     13,
                    fontFamily:   'Tajawal, sans-serif',
                    outline:      'none',
                    transition:   'border-color 0.2s',
                    boxSizing:    'border-box',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.goldD)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.b2)}
                />
                <User size={15} color={C.t3} style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label style={{ fontSize: 12, color: C.t2, fontFamily: 'Tajawal, sans-serif', display: 'block', marginBottom: 7 }}>
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
                  style={{
                    width:        '100%',
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 10,
                    padding:      '12px 42px 12px 14px',
                    color:        C.t1,
                    fontSize:     13,
                    fontFamily:   'Tajawal, sans-serif',
                    outline:      'none',
                    transition:   'border-color 0.2s',
                    boxSizing:    'border-box',
                    textAlign:    'right',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.goldD)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.b2)}
                />
                <Mail size={15} color={C.t3} style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label style={{ fontSize: 12, color: C.t2, fontFamily: 'Tajawal, sans-serif', display: 'block', marginBottom: 7 }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="٨ أحرف على الأقل"
                  dir="ltr"
                  required
                  style={{
                    width:        '100%',
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 10,
                    padding:      '12px 42px 12px 42px',
                    color:        C.t1,
                    fontSize:     13,
                    fontFamily:   'Tajawal, sans-serif',
                    outline:      'none',
                    transition:   'border-color 0.2s',
                    boxSizing:    'border-box',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.goldD)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.b2)}
                />
                <Lock size={15} color={C.t3} style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{ position: 'absolute', top: '50%', left: 14, transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.t3, display: 'flex', padding: 0 }}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* مؤشر القوة */}
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex:         1,
                          height:       3,
                          borderRadius: 2,
                          background:   strength.score >= i ? strength.color : C.b2,
                          transition:   'background 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p style={{ fontSize: 10, color: strength.color, fontFamily: 'Tajawal, sans-serif' }}>
                      قوة كلمة المرور: {strength.label}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* زر التسجيل */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              style={{
                width:        '100%',
                background:   loading ? C.b2 : `linear-gradient(135deg, ${C.gold}, ${C.goldD})`,
                color:        loading ? C.t3 : '#060606',
                border:       'none',
                borderRadius: 10,
                padding:      '13px',
                fontSize:     14,
                fontFamily:   'Tajawal, sans-serif',
                fontWeight:   700,
                cursor:       loading ? 'not-allowed' : 'pointer',
                transition:   'all 0.2s',
                marginTop:    4,
              }}
            >
              {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
            </motion.button>
          </form>

          {/* ── فاصل ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: C.b1 }} />
            <span style={{ fontSize: 11, color: C.t3, fontFamily: 'Tajawal, sans-serif' }}>أو</span>
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
              padding:        '12px',
              color:          C.t1,
              fontSize:       13,
              fontFamily:     'Tajawal, sans-serif',
              fontWeight:     600,
              cursor:         googleLoad ? 'not-allowed' : 'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            10,
              transition:     'border-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.b2 + 'AA')}
          >
            {/* Google Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoad ? 'جارٍ التحويل...' : 'التسجيل بحساب Google'}
          </button>

          {/* ── رابط تسجيل الدخول ── */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
            لديك حساب بالفعل؟{' '}
            <Link
              href="/login"
              style={{ color: C.gold, textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              تسجيل الدخول
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
