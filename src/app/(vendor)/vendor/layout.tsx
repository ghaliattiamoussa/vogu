'use client';

// src/app/(vendor)/vendor/layout.tsx
// هيكل لوحة تحكم التاجر — sidebar + header (منفصل تماماً عن موقع العملاء)

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingBag,
  LogOut, Menu, X, ChevronLeft, Store,
} from 'lucide-react';

// ── الألوان — ثيم فاتح ───────────────────────────────────────
const C = {
  bg:   '#FAFAF8',
  surf: '#F5F3EF',
  card: '#FFFFFF',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  goldL:'#C9A86E',
  t1:   '#1A1714',
  t2:   '#6B6560',
  t3:   '#A39E96',
  err:  '#C0504D',
} as const;

// ── روابط الـ Sidebar ─────────────────────────────────────────
const NAV_LINKS = [
  { href: '/vendor/dashboard', label: 'الرئيسية',    icon: LayoutDashboard },
  { href: '/vendor/products',  label: 'منتجاتي',     icon: Package         },
  { href: '/vendor/orders',    label: 'طلباتي',      icon: ShoppingBag     },
];

// ── مكوّن Sidebar ─────────────────────────────────────────────
function Sidebar({
  vendorName,
  businessName,
  mobile,
  onClose,
}: {
  vendorName:   string;
  businessName: string;
  mobile?:      boolean;
  onClose?:     () => void;
}) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/vendor/auth/logout', { method: 'POST' });
    router.push('/vendor/login');
  };

  return (
    <div
      style={{
        width:         260,
        height:        '100vh',
        background:    C.card,
        borderLeft:    `1px solid ${C.b1}`,
        display:       'flex',
        flexDirection: 'column',
        flexShrink:    0,
        position:      mobile ? 'relative' : 'sticky',
        top:           0,
      }}
    >
      {/* ── Header الـ Sidebar ── */}
      <div style={{
        padding:      '24px 20px 20px',
        borderBottom: `1px solid ${C.b1}`,
        position:     'relative',
      }}>
        {mobile && (
          <button
            onClick={onClose}
            style={{
              position:   'absolute',
              left:       12,
              top:        12,
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      C.t3,
              display:    'flex',
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* الشعار */}
        <div style={{
          fontFamily:    "'Cormorant Garant', serif",
          fontSize:      22,
          fontWeight:    400,
          color:         C.t1,
          letterSpacing: '0.12em',
          marginBottom:  4,
        }}>
          VŌGU
        </div>
        <div style={{
          fontSize:   10,
          color:      C.gold,
          fontFamily: 'Tajawal, sans-serif',
          letterSpacing: '0.08em',
        }}>
          بوابة التجار
        </div>

        {/* معلومات التاجر */}
        <div style={{
          marginTop:    14,
          padding:      '10px 12px',
          background:   C.surf,
          borderRadius: 10,
          border:       `1px solid ${C.b1}`,
        }}>
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        8,
          }}>
            <div style={{
              width:          34,
              height:         34,
              borderRadius:   '50%',
              background:     `linear-gradient(135deg, ${C.goldL}33, ${C.gold}22)`,
              border:         `1px solid ${C.gold}44`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
            }}>
              <Store size={15} color={C.gold} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                fontSize:     12,
                fontWeight:   700,
                color:        C.t1,
                fontFamily:   'Tajawal, sans-serif',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
              }}>
                {businessName}
              </p>
              <p style={{
                fontSize:   10,
                color:      C.t3,
                fontFamily: 'Tajawal, sans-serif',
              }}>
                {vendorName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── روابط التنقل ── */}
      <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto' }}>
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          10,
                padding:      '10px 12px',
                borderRadius: 10,
                marginBottom: 4,
                background:   isActive ? `${C.gold}15` : 'none',
                color:        isActive ? C.gold : C.t2,
                textDecoration: 'none',
                fontSize:     13,
                fontFamily:   'Tajawal, sans-serif',
                fontWeight:   isActive ? 700 : 400,
                transition:   'all 0.15s',
                border:       isActive ? `1px solid ${C.gold}30` : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = C.surf;
                  (e.currentTarget as HTMLElement).style.color = C.t1;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'none';
                  (e.currentTarget as HTMLElement).style.color = C.t2;
                }
              }}
            >
              <Icon size={16} />
              {label}
              {isActive && (
                <ChevronLeft size={13} style={{ marginRight: 'auto', opacity: 0.5 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── زر تسجيل الخروج ── */}
      <div style={{ padding: '12px', borderTop: `1px solid ${C.b1}` }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width:        '100%',
            display:      'flex',
            alignItems:   'center',
            gap:          8,
            padding:      '10px 12px',
            borderRadius: 10,
            background:   'none',
            border:       `1px solid ${C.b2}`,
            color:        C.t2,
            fontSize:     13,
            fontFamily:   'Tajawal, sans-serif',
            cursor:       loggingOut ? 'not-allowed' : 'pointer',
            transition:   'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = `${C.err}10`;
            (e.currentTarget as HTMLElement).style.color      = C.err;
            (e.currentTarget as HTMLElement).style.borderColor = `${C.err}40`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background  = 'none';
            (e.currentTarget as HTMLElement).style.color       = C.t2;
            (e.currentTarget as HTMLElement).style.borderColor = C.b2;
          }}
        >
          <LogOut size={15} />
          {loggingOut ? 'جارٍ الخروج...' : 'تسجيل الخروج'}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Layout الرئيسي
// ══════════════════════════════════════════════════════════════
export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vendorName,    setVendorName]    = useState('');
  const [businessName,  setBusinessName]  = useState('');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [loading,       setLoading]       = useState(true);
  const router = useRouter();

  // ── جلب بيانات التاجر ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/vendor/me');
        if (!res.ok) { router.push('/vendor/login'); return; }
        const data = await res.json();
        setVendorName(data.vendor.name);
        setBusinessName(data.vendor.businessName);
      } catch {
        router.push('/vendor/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div style={{
        minHeight:      '100vh',
        background:     C.bg,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width:        40,
          height:       40,
          borderRadius: '50%',
          border:       `3px solid ${C.b2}`,
          borderTop:    `3px solid ${C.gold}`,
          animation:    'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        display:        'flex',
        minHeight:      '100vh',
        background:     C.bg,
        fontFamily:     'Tajawal, sans-serif',
      }}
    >
      {/* ── Sidebar — ديسكتوب ── */}
      <div className="hidden lg:flex">
        <Sidebar vendorName={vendorName} businessName={businessName} />
      </div>

      {/* ── Sidebar — موبايل (drawer) ── */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position:   'fixed',
              inset:      0,
              background: 'rgba(26,23,20,0.4)',
              zIndex:     200,
              backdropFilter: 'blur(4px)',
            }}
          />
          <div style={{
            position: 'fixed',
            right:    0,
            top:      0,
            bottom:   0,
            zIndex:   201,
          }}>
            <Sidebar
              vendorName={vendorName}
              businessName={businessName}
              mobile
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* ── المحتوى الرئيسي ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top Bar للموبايل */}
        <div
          className="flex lg:hidden"
          style={{
            alignItems:   'center',
            justifyContent: 'space-between',
            padding:      '14px 16px',
            background:   C.card,
            borderBottom: `1px solid ${C.b1}`,
            position:     'sticky',
            top:          0,
            zIndex:       100,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      C.t2,
              display:    'flex',
            }}
          >
            <Menu size={22} />
          </button>
          <span style={{
            fontFamily:    "'Cormorant Garant', serif",
            fontSize:      18,
            color:         C.t1,
            letterSpacing: '0.12em',
          }}>
            VŌGU
          </span>
          <span style={{
            fontSize:   10,
            color:      C.gold,
            fontFamily: 'Tajawal, sans-serif',
          }}>
            بوابة التجار
          </span>
        </div>

        {/* محتوى الصفحة */}
        <main style={{ flex: 1, padding: '28px 24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}