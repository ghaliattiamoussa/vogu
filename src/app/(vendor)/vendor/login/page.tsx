'use client';

// src/app/(vendor)/vendor/login/page.tsx
// صفحة دخول التاجر — منفصلة تماماً عن صفحة العميل

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// ── الألوان — ثيم فاتح مطابق لباقي الموقع ───────────────────
const C = {
  bg:    '#FAFAF8',
  surf:  '#F5F3EF',
  card:  '#FFFFFF',
  b1:    '#EAE7E1',
  b2:    '#DDD9D1',
  gold:  '#A8823C',
  goldL: '#C9A86E',
  t1:    '#1A1714',
  t2:    '#6B6560',
  t3:    '#A39E96',
  err:   '#C0504D',
} as const;

export default function VendorLoginPage() {
  const router = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res  = await fetch('/api/vendor/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'حدث خطأ، حاول مجدداً');
        return;
      }

      // نجاح — انتقل للوحة التاجر
      router.push('/vendor/dashboard');

    } catch {
      setError('تعذر الاتصال بالخادم، تحقق من الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight:       '100vh',
        background:      C.bg,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         20,
        fontFamily:      'Tajawal, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width:        '100%',
          maxWidth:     420,
          background:   C.card,
          border:       `1px solid ${C.b1}`,
          borderRadius: 20,
          padding:      '40px 36px',
          boxShadow:    '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* ── الشعار والعنوان ── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontFamily:    "'Cormorant Garant', serif",
            fontSize:      32,
            fontWeight:    400,
            color:         C.t1,
            letterSpacing: '0.15em',
            marginBottom:  6,
          }}>
            VŌGU
          </div>
          <div style={{
            width:      40,
            height:     1,
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            margin:     '0 auto 14px',
          }} />
          <p style={{
            fontSize:      13,
            color:         C.t2,
            letterSpacing: '0.05em',
          }}>
            بوابة التجار
          </p>
        </div>

        {/* ── رسالة الخطأ ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              background:   `${C.err}12`,
              border:       `1px solid ${C.err}30`,
              borderRadius: 10,
              padding:      '10px 14px',
              marginBottom: 20,
              fontSize:     12,
              color:        C.err,
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
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
            <label style={{
              display:      'flex',
              alignItems:   'center',
              gap:          6,
              fontSize:     11,
              color:        C.t2,
              marginBottom: 7,
            }}>
              <Mail size={12} style={{ color: C.gold }} />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="vendor@example.com"
              dir="ltr"
              required
              style={{
                width:        '100%',
                background:   C.surf,
                border:       `1px solid ${C.b2}`,
                borderRadius: 11,
                padding:      '11px 14px',
                fontSize:     13,
                color:        C.t1,
                outline:      'none',
                fontFamily:   'Tajawal, sans-serif',
                boxSizing:    'border-box',
                transition:   'border-color 0.2s',
              }}
              onFocus={(e)  => (e.target.style.borderColor = C.gold)}
              onBlur={(e)   => (e.target.style.borderColor = C.b2)}
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label style={{
              display:      'flex',
              alignItems:   'center',
              gap:          6,
              fontSize:     11,
              color:        C.t2,
              marginBottom: 7,
            }}>
              <Lock size={12} style={{ color: C.gold }} />
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                dir="ltr"
                required
                style={{
                  width:        '100%',
                  background:   C.surf,
                  border:       `1px solid ${C.b2}`,
                  borderRadius: 11,
                  padding:      '11px 40px 11px 14px',
                  fontSize:     13,
                  color:        C.t1,
                  outline:      'none',
                  fontFamily:   'Tajawal, sans-serif',
                  boxSizing:    'border-box',
                  transition:   'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e)  => (e.target.style.borderColor = C.b2)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                style={{
                  position:   'absolute',
                  left:       12,
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  color:      C.t3,
                  display:    'flex',
                  padding:    0,
                }}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* زر الدخول */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            style={{
              width:        '100%',
              background:   loading
                ? C.b1
                : `linear-gradient(135deg, ${C.goldL}, ${C.gold}, #8A6830)`,
              color:        loading ? C.t3 : '#fff',
              border:       'none',
              borderRadius: 11,
              padding:      '13px',
              fontSize:     14,
              fontFamily:   'Tajawal, sans-serif',
              fontWeight:   700,
              cursor:       loading ? 'not-allowed' : 'pointer',
              marginTop:    4,
              boxShadow:    loading ? 'none' : `0 6px 20px ${C.gold}35`,
              transition:   'all 0.2s',
            }}
          >
            {loading ? 'جارٍ التحقق...' : 'دخول لوحة التحكم'}
          </motion.button>
        </form>

        {/* ── فاصل ── */}
        <div style={{
          marginTop:  28,
          paddingTop: 20,
          borderTop:  `1px solid ${C.b1}`,
          textAlign:  'center',
        }}>
          <p style={{ fontSize: 11, color: C.t3 }}>
            هذه البوابة مخصصة للتجار المعتمدين فقط
          </p>
          <p style={{ fontSize: 11, color: C.t3, marginTop: 4 }}>
            للتسجيل كتاجر تواصل مع الإدارة
          </p>
        </div>
      </motion.div>
    </div>
  );
}