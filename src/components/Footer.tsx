// src/components/Footer.tsx
// مكوّن Footer — Server Component (لا يحتاج 'use client')

import Link from 'next/link';

// ── الألوان ─────────────────────────────────────────────
const C = {
  surf: '#0D0D0D',
  card: '#121212',
  b1:   '#1A1A1A',
  b2:   '#262626',
  gold: '#C9A86E',
  t1:   '#EDE8DF',
  t2:   '#8A8480',
  t3:   '#484542',
} as const;

// ── بيانات روابط الفوتر ─────────────────────────────────
const FOOTER_LINKS = [
  {
    title: 'تسوق',
    links: [
      { label: 'نساء',        href: '/shop?cat=women'  },
      { label: 'رجال',        href: '/shop?cat=men'    },
      { label: 'أطفال',       href: '/shop?cat=kids'   },
      { label: 'تخفيضات',     href: '/shop?cat=sale'   },
      { label: 'وصل حديثاً',  href: '/shop?sort=new'   },
    ],
  },
  {
    title: 'المساعدة',
    links: [
      { label: 'تواصل معنا',      href: '/contact'  },
      { label: 'الشحن والتوصيل', href: '/shipping'  },
      { label: 'سياسة الإرجاع',  href: '/returns'   },
      { label: 'تتبع الطلب',     href: '/track'     },
    ],
  },
  {
    title: 'الشركة',
    links: [
      { label: 'من نحن',      href: '/about'        },
      { label: 'المدونة',     href: '/blog'         },
      { label: 'الاستدامة',   href: '/sustainability'},
      { label: 'العمل معنا',  href: '/careers'      },
    ],
  },
] as const;

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay'];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: '◈' },
  { label: 'TikTok',    href: 'https://tiktok.com',    icon: '◉' },
  { label: 'Pinterest', href: 'https://pinterest.com', icon: '◍' },
];

// ══════════════════════════════════════════════════════════
export default function Footer() {
  return (
    <footer
      dir="rtl"
      style={{
        background:  C.surf,
        borderTop:   `1px solid ${C.b1}`,
        padding:     '48px 20px 24px',
        marginTop:   32,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ═══ الصف الأول: الشعار + الأعمدة ═══ */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap:                 32,
            marginBottom:        40,
          }}
        >
          {/* ── عمود الشعار والوصف ── */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily:     "'Cormorant Garant', serif",
                fontSize:       26,
                fontWeight:     600,
                color:          C.t1,
                letterSpacing:  '0.1em',
                display:        'block',
                marginBottom:   8,
                textDecoration: 'none',
              }}
            >
              VŌGU
            </Link>

            <p
              style={{
                fontSize:   12,
                color:      C.t3,
                fontFamily: 'Tajawal, sans-serif',
                lineHeight: 1.9,
                maxWidth:   200,
                marginBottom: 20,
              }}
            >
              تجربة تسوق فاخرة تجمع الأناقة والجودة الاستثنائية في كل قطعة.
            </p>

            {/* ── أيقونات السوشيال ── */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width:          34,
                    height:         34,
                    background:     C.card,
                    border:         `1px solid ${C.b2}`,
                    borderRadius:   8,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    color:          C.t2,
                    fontSize:       16,
                    textDecoration: 'none',
                    transition:     'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color       = C.gold;
                    (e.currentTarget as HTMLElement).style.borderColor = C.gold + '55';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color       = C.t2;
                    (e.currentTarget as HTMLElement).style.borderColor = C.b2;
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── أعمدة الروابط ── */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4
                style={{
                  fontSize:      12,
                  color:         C.t1,
                  fontFamily:    'Tajawal, sans-serif',
                  fontWeight:    700,
                  marginBottom:  14,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {section.title}
              </h4>

              <ul
                style={{
                  listStyle:     'none',
                  padding:       0,
                  margin:        0,
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           10,
                }}
              >
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize:       11,
                        color:          C.t3,
                        fontFamily:     'Tajawal, sans-serif',
                        textDecoration: 'none',
                        transition:     'color 0.2s',
                        display:        'inline-block',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = C.t1)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = C.t3)
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── عمود النشرة البريدية ── */}
          <div>
            <h4
              style={{
                fontSize:      12,
                color:         C.t1,
                fontFamily:    'Tajawal, sans-serif',
                fontWeight:    700,
                marginBottom:  8,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              النشرة الإخبارية
            </h4>

            <p
              style={{
                fontSize:     11,
                color:        C.t3,
                fontFamily:   'Tajawal, sans-serif',
                lineHeight:   1.7,
                marginBottom: 14,
              }}
            >
              اشترك للحصول على أحدث العروض والتشكيلات الجديدة.
            </p>

            {/* حقل الإيميل — يُفعَّل لاحقاً بـ Server Action */}
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                dir="rtl"
                style={{
                  flex:         1,
                  background:   C.card,
                  border:       `1px solid ${C.b2}`,
                  borderRadius: 7,
                  padding:      '8px 11px',
                  color:        C.t1,
                  fontSize:     11,
                  fontFamily:   'Tajawal, sans-serif',
                  outline:      'none',
                  minWidth:     0,
                }}
              />
              <button
                type="submit"
                style={{
                  background:   C.gold,
                  color:        '#060606',
                  border:       'none',
                  borderRadius: 7,
                  padding:      '8px 13px',
                  fontSize:     11,
                  fontFamily:   'Tajawal, sans-serif',
                  fontWeight:   700,
                  cursor:       'pointer',
                  whiteSpace:   'nowrap',
                  flexShrink:   0,
                  transition:   'filter 0.2s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.filter = 'none')
                }
              >
                اشتراك
              </button>
            </div>
          </div>
        </div>

        {/* ═══ الصف الأخير: الحقوق + وسائل الدفع ═══ */}
        <div
          style={{
            borderTop:      `1px solid ${C.b1}`,
            paddingTop:     20,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            flexWrap:       'wrap',
            gap:            12,
          }}
        >
          <p
            style={{
              fontSize:   10,
              color:      C.t3,
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            © ٢٠٢٥ VŌGU. جميع الحقوق محفوظة.
          </p>

          {/* وسائل الدفع */}
          <div style={{ display: 'flex', gap: 6 }}>
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                style={{
                  fontSize:     10,
                  color:        C.t2,
                  fontFamily:   'Tajawal, sans-serif',
                  background:   C.card,
                  padding:      '3px 9px',
                  borderRadius: 5,
                  border:       `1px solid ${C.b2}`,
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
