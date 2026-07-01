import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, Search, Zap, User, Truck, X, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import CartButton from '@/components/CartButton';
import NotificationBell from '@/components/NotificationBell';

const BANNER_ITEMS = [
  '✦ شحن مجاني للطلبات فوق 1200 ج.م',
  '✦ إرجاع مجاني خلال ٣٠ يوماً',
  '✦ ضمان جودة على جميع المنتجات',
  '✦ خصومات حصرية لأعضاء VŌGU',
];

const CATEGORIES = [
  { id: 'all',   label: 'الكل'     },
  { id: 'women', label: 'نساء'     },
  { id: 'men',   label: 'رجال'     },
  { id: 'kids',  label: 'أطفال'    },
  { id: 'sale',  label: 'تخفيضات' },
];

const C = {
  bg:   '#FAFAF8',
  surf: '#F5F3EF',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  t1:   '#1A1714',
  t2:   '#6B6560',
  t3:   '#A39E96',
  err:  '#C0504D',
} as const;

interface NavbarProps {
  onCartOpen: () => void;
  onAIOpen:   () => void;
}

const ORDER_SEEN_KEY = 'vogu_seen_order_status';

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING:    'في الانتظار',
  CONFIRMED:  'تم التأكيد',
  PROCESSING: 'جاري التجهيز',
  SHIPPED:    'تم الشحن',
  DELIVERED:  'تم التسليم',
  CANCELLED:  'ملغي',
};

function CategoryTabsInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const activeCat    = searchParams.get('cat') || 'all';

  const handleClick = (catId: string) => {
    if (catId === 'all') router.push('/shop');
    else router.push(`/shop?cat=${catId}`);
  };

  return (
    <div
      className="sticky z-[99] vogu-cat-tabs"
      style={{ top: 58, background: C.surf, borderBottom: `1px solid ${C.b1}`, overflowX: 'auto' }}
    >
      <div style={{ display: 'flex', width: 'fit-content', margin: '0 auto' }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              style={{
                background:   'none',
                border:       'none',
                borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
                color:        isActive ? C.gold : C.t2,
                fontFamily:   'Tajawal, sans-serif',
                fontSize:     13,
                fontWeight:   isActive ? 700 : 400,
                padding:      '10px 16px',
                cursor:       'pointer',
                whiteSpace:   'nowrap',
                transition:   'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = C.t1; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = C.t2; }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Navbar({ onCartOpen, onAIOpen }: NavbarProps) {
  const [scrolled,    setScrolled]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // ✅ جديد: نتأكد إننا بقينا على الكلاينت قبل ما نعرض بيانات محلية (localStorage/session)
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const router = useRouter();
  const { data: session } = useSession();

  const cartItems    = useCartStore((s) => s.items);
  const cartCount    = cartItems.reduce((sum, i: any) => sum + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, i: any) => {
    const price = i.product?.price ?? i.price ?? 0;
    return sum + price * i.quantity;
  }, 0);
  const wishCount = useWishlistStore((s) => s.ids.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [moreOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const [updatedCount, setUpdatedCount] = useState(0);
  const [lastOrders,   setLastOrders]   = useState<any[]>([]);
  const [toast,        setToast]        = useState<{ id: string; status: string } | null>(null);
  const prevUpdatedCountRef = useRef(0);

  const checkOrderUpdates = async () => {
    if (!session?.user) { setUpdatedCount(0); return; }
    try {
      const res  = await fetch('/api/orders?pageSize=20');
      const json = await res.json();
      const orders: any[] = json.data ?? json.orders ?? [];
      setLastOrders(orders);

      const seenRaw = localStorage.getItem(ORDER_SEEN_KEY);
      const seenMap: Record<string, string> = seenRaw ? JSON.parse(seenRaw) : {};

      const changed = orders.filter((o) => seenMap[o.id] !== o.status);
      setUpdatedCount(changed.length);

      if (changed.length > prevUpdatedCountRef.current && changed[0]) {
        setToast({ id: changed[0].id, status: changed[0].status });
      }
      prevUpdatedCountRef.current = changed.length;
    } catch {
      // تجاهل بصمت
    }
  };

  const markOrdersAsSeen = () => {
    if (lastOrders.length === 0) return;
    const seenMap: Record<string, string> = {};
    lastOrders.forEach((o) => { seenMap[o.id] = o.status; });
    localStorage.setItem(ORDER_SEEN_KEY, JSON.stringify(seenMap));
    setUpdatedCount(0);
    prevUpdatedCountRef.current = 0;
  };

  useEffect(() => {
    checkOrderUpdates();

    const onFocus = () => checkOrderUpdates();
    window.addEventListener('focus', onFocus);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') checkOrderUpdates();
    }, 60000);

    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const viewToastOrder = () => {
    setToast(null);
    markOrdersAsSeen();
    router.push('/orders');
  };

  // ✅ عدد "المزيد" بيتحسب بس بعد ما نبقى على الكلاينت
  const moreBadgeCount = mounted ? updatedCount + wishCount : 0;

  return (
    <>
      <style>{`
        .vogu-marquee-item { font-size: 11px; }
        .vogu-marquee { height: 34px; }
        .vogu-navbar { padding: 0 18px; height: 58px; }
        .vogu-navbar-right { gap: 4px; }
        .vogu-navbar-left { gap: 8px; }
        .vogu-account-info { display: flex; }
        .vogu-track-label,
        .vogu-ai-label { display: inline; }
        .vogu-design-btn-text { display: inline; }
        .vogu-search-input { width: 170px; }

        .vogu-extra-items { display: flex; align-items: center; gap: 4px; }
        .vogu-more-btn { display: none; }

        @media (max-width: 768px) {
          .vogu-marquee { height: 30px; }
          .vogu-marquee-item { font-size: 10px; }
          .vogu-navbar { padding: 0 12px; height: 52px; }
          .vogu-search-input { width: 140px !important; }
          .vogu-design-btn { padding: 6px 14px !important; font-size: 11px !important; }
          .vogu-cat-tabs button { padding: 9px 14px !important; font-size: 12px !important; }
        }

        @media (max-width: 640px) {
          .vogu-marquee { height: 26px; }
          .vogu-marquee-item { font-size: 9px; }
          .vogu-navbar { padding: 0 10px; height: 48px; }
          .vogu-navbar-right { gap: 2px; }
          .vogu-navbar-left { gap: 4px; }

          .vogu-account-info { display: none; }
          .vogu-account-link { padding: 6px !important; min-height: 36px; min-width: 36px; justify-content: center; }

          .vogu-extra-items { display: none !important; }
          .vogu-more-btn { display: flex !important; width: 36px !important; height: 36px !important; }

          .vogu-design-btn { padding: 6px 10px !important; font-size: 10px !important; gap: 4px !important; }
          .vogu-design-emoji { font-size: 12px !important; }
          .vogu-new-badge { font-size: 7px !important; padding: 1px 4px !important; top: -5px !important; left: -5px !important; }

          .vogu-search-input { width: 110px !important; }

          .vogu-notif-btn { min-width: 36px; min-height: 36px; }

          .vogu-cat-tabs button { padding: 8px 12px !important; font-size: 12px !important; }
        }

        @media (max-width: 380px) {
          .vogu-design-btn-text { display: none; }
          .vogu-design-btn { padding: 7px !important; border-radius: 50% !important; }
          .vogu-search-input { width: 90px !important; }
        }
      `}</style>

      <div
        role="marquee"
        className="vogu-marquee"
        style={{ background: C.gold, color: '#FFFFFF', display: 'flex', alignItems: 'center', overflow: 'hidden', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', gap: 90, whiteSpace: 'nowrap', animation: 'marquee 28s linear infinite' }}>
          {[...BANNER_ITEMS, ...BANNER_ITEMS].map((item, i) => (
            <span key={i} className="vogu-marquee-item" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <nav
        dir="rtl"
        className="sticky top-0 z-[100] transition-all duration-300 vogu-navbar"
        style={{
          background:     scrolled ? 'rgba(250,250,248,0.92)' : C.bg,
          backdropFilter: scrolled ? 'blur(20px)' : undefined,
          borderBottom:   `1px solid ${C.b1}`,
          display:        'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems:     'center',
        }}
      >
        <div className="vogu-navbar-right" style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', minWidth: 0 }}>

          <Link
            href={session ? '/account' : '/login'}
            aria-label="حسابي"
            className="vogu-account-link"
            style={{
              color: C.t2, padding: '5px 8px', display: 'flex',
              alignItems: 'center', gap: 6, transition: 'color 0.2s',
              borderRadius: 8, textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
          >
            {mounted && session?.user ? (
              <>
                <div
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.gold}33, ${C.gold}11)`,
                    border: `1px solid ${C.gold}55`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.gold, fontFamily: "'Cormorant Garant', serif", lineHeight: 1 }}>
                    {session.user.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="vogu-account-info" style={{ flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontSize: 9, color: C.t3, fontFamily: 'Tajawal, sans-serif', letterSpacing: '0.05em' }}>
                    أهلاً بعودتك
                  </span>
                  <span style={{ fontSize: 12, color: C.t1, fontFamily: 'Tajawal, sans-serif', fontWeight: 600, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.user.name?.split(' ')[0] || 'حسابي'}
                  </span>
                </div>
              </>
            ) : (
              <User size={17} />
            )}
          </Link>

          <NotificationBell />

          <div className="vogu-extra-items">
            <Link
              href="/orders"
              aria-label="تتبع طلبك"
              title="تتبع طلبك"
              onClick={markOrdersAsSeen}
              className="vogu-track-btn"
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: `1px solid ${C.b2}`,
                borderRadius: 20, padding: '5px 11px', color: C.t2,
                fontSize: 11, fontFamily: 'Tajawal, sans-serif', fontWeight: 600,
                transition: 'all 0.2s', textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color      = C.gold;
                e.currentTarget.style.borderColor = `${C.gold}55`;
                e.currentTarget.style.background  = `${C.gold}0D`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color      = C.t2;
                e.currentTarget.style.borderColor = C.b2;
                e.currentTarget.style.background  = 'none';
              }}
            >
              <Truck size={14} />
              <span className="vogu-track-label">تتبع طلبك</span>
              {mounted && updatedCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: C.err, color: '#fff', borderRadius: '50%',
                  minWidth: 16, height: 16, padding: '0 3px',
                  fontSize: 9, fontWeight: 700,
                  fontFamily: 'Tajawal, sans-serif', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${C.bg}`,
                }}>
                  {updatedCount}
                </span>
              )}
            </Link>

            <Link
              href="/wishlist"
              aria-label="قائمة المفضلة"
              className="vogu-wishlist-btn"
              style={{
                position: 'relative', color: C.t2, padding: 7,
                borderRadius: 7, display: 'flex', transition: 'color 0.2s', textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
            >
              <Heart size={19} />
              {mounted && wishCount > 0 && (
                <span style={{
                  position: 'absolute', top: 3, right: 3,
                  background: C.err, color: '#fff', borderRadius: '50%',
                  width: 15, height: 15, fontSize: 9, fontWeight: 700,
                  fontFamily: 'Tajawal, sans-serif', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {wishCount}
                </span>
              )}
            </Link>

            <button
              onClick={onAIOpen}
              className="vogu-ai-btn"
              style={{
                background: 'none', border: `1px solid ${C.b2}`,
                borderRadius: 20, padding: '5px 11px', color: C.gold,
                fontSize: 11, fontFamily: 'Tajawal, sans-serif', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 5, transition: 'background 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.b1)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <Zap size={12} />
              <span className="vogu-ai-label">مستشار الأزياء</span>
            </button>
          </div>

          <div ref={moreRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-label="المزيد"
              className="vogu-more-btn"
              style={{
                position: 'relative',
                background: moreOpen ? C.surf : 'none',
                border: `1px solid ${C.b2}`,
                borderRadius: '50%', width: 30, height: 30,
                alignItems: 'center', justifyContent: 'center',
                color: C.t2, cursor: 'pointer',
              }}
            >
              <MoreHorizontal size={17} />
              {moreBadgeCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: C.err, color: '#fff', borderRadius: '50%',
                  minWidth: 15, height: 15, padding: '0 3px',
                  fontSize: 8.5, fontWeight: 700,
                  fontFamily: 'Tajawal, sans-serif', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${C.bg}`,
                }}>
                  {moreBadgeCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  dir="rtl"
                  style={{
                    position: 'absolute', top: 38, right: 0, zIndex: 150,
                    background: '#FFFFFF', border: `1px solid ${C.b1}`,
                    borderRadius: 12, padding: 6, minWidth: 168,
                    boxShadow: '0 14px 32px rgba(26,23,20,0.14)',
                    display: 'flex', flexDirection: 'column', gap: 2,
                  }}
                >
                  <Link
                    href="/orders"
                    onClick={() => { markOrdersAsSeen(); setMoreOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 8, padding: '9px 10px', borderRadius: 8, color: C.t1,
                      fontSize: 13, fontFamily: 'Tajawal, sans-serif', fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Truck size={15} color={C.t2} /> تتبع طلبك
                    </span>
                    {mounted && updatedCount > 0 && (
                      <span style={{
                        background: C.err, color: '#fff', borderRadius: '50%',
                        minWidth: 16, height: 16, padding: '0 3px', fontSize: 9,
                        fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {updatedCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 8, padding: '9px 10px', borderRadius: 8, color: C.t1,
                      fontSize: 13, fontFamily: 'Tajawal, sans-serif', fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Heart size={15} color={C.t2} /> المفضلة
                    </span>
                    {mounted && wishCount > 0 && (
                      <span style={{
                        background: C.err, color: '#fff', borderRadius: '50%',
                        minWidth: 16, height: 16, padding: '0 3px', fontSize: 9,
                        fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {wishCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={() => { onAIOpen(); setMoreOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 10px', borderRadius: 8, color: C.gold,
                      fontSize: 13, fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right',
                    }}
                  >
                    <Zap size={15} /> مستشار الأزياء
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.06 }}
          animate={{
            boxShadow: [
              '0 4px 14px rgba(168,130,60,0.22)',
              '0 6px 26px rgba(168,130,60,0.45)',
              '0 4px 14px rgba(168,130,60,0.22)',
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', borderRadius: 50, justifySelf: 'center' }}
        >
          <Link
            href="/customize"
            className="vogu-design-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #C9A86E, #A8823C, #8A6830)',
              color: '#FFFFFF', padding: '7px 18px', borderRadius: 50,
              fontSize: 12, fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
              textDecoration: 'none', position: 'relative', overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <motion.span
              animate={{ left: ['-40%', '140%'] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.3, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: 0, bottom: 0, width: '35%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                transform: 'skewX(-20deg)', pointerEvents: 'none',
              }}
            />
            <motion.span
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
              className="vogu-design-emoji"
              style={{ display: 'inline-block', fontSize: 14, position: 'relative', zIndex: 1 }}
            >
              🎨
            </motion.span>
            <span className="vogu-design-btn-text" style={{ position: 'relative', zIndex: 1 }}>صمم على ذوقك</span>
          </Link>

          <span className="vogu-new-badge" style={{
            position: 'absolute', top: -7, left: -8,
            background: '#C0504D', color: '#fff',
            fontSize: 8, fontWeight: 800, padding: '2px 6px',
            borderRadius: 8, fontFamily: 'Tajawal, sans-serif',
            boxShadow: '0 2px 6px rgba(192,80,77,0.4)', zIndex: 2,
          }}>
            جديد
          </span>
        </motion.div>

        <div className="vogu-navbar-left" style={{ display: 'flex', alignItems: 'center', justifySelf: 'end', minWidth: 0 }}>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 170 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onSubmit={handleSearch}
                  style={{ overflow: 'hidden' }}
                >
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                    placeholder="ابحث..."
                    dir="rtl"
                    className="vogu-search-input"
                    style={{
                      background: C.surf, border: `1px solid ${C.b2}`,
                      borderRadius: 7, padding: '5px 9px 5px 26px',
                      color: C.t1, fontSize: 12, fontFamily: 'Tajawal, sans-serif',
                      outline: 'none',
                    }}
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.t2, padding: 6, display: 'flex',
                position: searchOpen ? 'absolute' : 'relative',
                left: searchOpen ? 3 : 'auto',
                zIndex: searchOpen ? 2 : 'auto',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
            >
              <Search size={17} />
            </button>
          </div>

          <div style={{ width: 1, height: 22, background: C.b1, flexShrink: 0 }} />

          <CartButton
            count={mounted ? cartCount : 0}
            subtotal={mounted ? cartSubtotal : 0}
            onClick={onCartOpen}
            showLabel={true}
          />
        </div>
      </nav>

      <Suspense
        fallback={
          <div style={{ position: 'sticky', top: 58, zIndex: 99, height: 44, background: C.surf, borderBottom: `1px solid ${C.b1}` }} />
        }
      >
        <CategoryTabsInner />
      </Suspense>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            dir="rtl"
            style={{
              position: 'fixed', bottom: 24, left: 24, zIndex: 9997,
              background: '#FFFFFF', border: `1px solid ${C.b2}`,
              borderRadius: 14, padding: '14px 14px', minWidth: 280, maxWidth: 340,
              boxShadow: '0 18px 44px rgba(26,23,20,0.16)',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: `${C.gold}1A`, color: C.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Truck size={17} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontFamily: 'Tajawal, sans-serif', margin: '0 0 3px' }}>
                تحديث جديد على طلبك
              </p>
              <p style={{ fontSize: 12, color: C.t2, fontFamily: 'Tajawal, sans-serif', margin: '0 0 8px' }}>
                الحالة الآن:{' '}
                <span style={{ color: C.gold, fontWeight: 700 }}>
                  {ORDER_STATUS_LABELS[toast.status] ?? toast.status}
                </span>
              </p>
              <button
                onClick={viewToastOrder}
                style={{
                  background: 'none', border: 'none', color: C.gold,
                  fontSize: 12, fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
                  cursor: 'pointer', padding: 0,
                }}
              >
                عرض الطلب ←
              </button>
            </div>

            <button
              onClick={() => setToast(null)}
              aria-label="إغلاق الإشعار"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.t3, flexShrink: 0, padding: 2, display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}