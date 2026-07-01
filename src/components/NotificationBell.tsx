'use client';

// src/components/NotificationBell.tsx
// جرس الإشعارات — يُضاف في Navbar بجوار زر مستشار الأزياء

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Package, X, Check, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── الألوان — ثيم فاتح (مطابقة لـ tailwind.config.ts) ──────────
const C = {
  surf: '#F5F3EF',
  card: '#FFFFFF',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  t1:   '#1A1714',
  t2:   '#6B6560',
  t3:   '#A39E96',
  err:  '#C0504D',
  ok:   '#3D9960',
} as const;

interface Notification {
  id:        string;
  title:     string;
  message:   string;
  type:      string;
  orderId:   string | null;
  isRead:    boolean;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)    return 'الآن';
  if (mins < 60)   return `منذ ${mins} دقيقة`;
  if (hours < 24)  return `منذ ${hours} ساعة`;
  if (days < 7)    return `منذ ${days} يوم`;
  return new Date(dateStr).toLocaleDateString('ar-EG');
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [open,          setOpen]          = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [ringing,       setRinging]       = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── الجلب (مع polling كل 30 ثانية) ──────────────────────
  const fetchNotifications = async () => {
    if (!session?.user) return;
    try {
      const res  = await fetch('/api/notifications');
      const data = await res.json();
      const prev = unreadCount;
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
      // هز الجرس عند وصول إشعار جديد
      if (data.unreadCount > prev && prev !== undefined) {
        setRinging(true);
        setTimeout(() => setRinging(false), 1000);
      }
    } catch {}
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [session?.user]);

  // إغلاق عند الضغط خارج الـ dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── تعليم كمقروء ──────────────────────────────────────────
  const markRead = async (id?: string) => {
    setLoading(true);
    try {
      await fetch('/api/notifications', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id }),
      });
      await fetchNotifications();
    } finally {
      setLoading(false);
    }
  };

  // ── حذف المقروءة ──────────────────────────────────────────
  const clearRead = async () => {
    await fetch('/api/notifications', { method: 'DELETE' });
    await fetchNotifications();
  };

  // لا تُظهر الجرس لغير المسجلين
  if (!session?.user) return null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>

      {/* ── زر الجرس ── */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unreadCount > 0) markRead(); // تعليم كمقروء عند الفتح
        }}
        aria-label="الإشعارات"
        style={{
          position:     'relative',
          background:   'none',
          border:       'none',
          cursor:       'pointer',
          color:        unreadCount > 0 ? C.gold : C.t2,
          padding:      7,
          borderRadius: 7,
          display:      'flex',
          transition:   'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
        onMouseLeave={(e) => (e.currentTarget.style.color = unreadCount > 0 ? C.gold : C.t2)}
      >
        {/* الجرس مع حركة الهز */}
        <motion.div
          animate={ringing ? { rotate: [0, -20, 20, -15, 15, -8, 8, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          <Bell size={19} fill={unreadCount > 0 ? C.gold : 'none'} />
        </motion.div>

        {/* Badge عدد الإشعارات */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position:       'absolute',
              top:            2,
              right:          2,
              background:     C.err,
              color:          '#fff',
              borderRadius:   '50%',
              minWidth:       15,
              height:         15,
              fontSize:       9,
              fontWeight:     700,
              fontFamily:     'Tajawal, sans-serif',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              padding:        '0 3px',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* ── Dropdown الإشعارات ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -8, scale: 0.96  }}
            transition={{ duration: 0.18 }}
            style={{
              position:    'absolute',
              top:         '110%',
              right:       0,
              width:       340,
              maxWidth:    '92vw',
              background:  C.surf,
              border:      `1px solid ${C.b2}`,
              borderRadius: 14,
              boxShadow:   '0 16px 48px rgba(26,23,20,0.14)',
              zIndex:      300,
              overflow:    'hidden',
              transformOrigin: 'top right',
            }}
            dir="rtl"
          >
            {/* Header */}
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              padding:        '14px 16px',
              borderBottom:   `1px solid ${C.b1}`,
            }}>
              <h3 style={{
                fontSize:   13,
                fontWeight: 700,
                color:      C.t1,
                fontFamily: 'Tajawal, sans-serif',
                display:    'flex',
                alignItems: 'center',
                gap:        6,
              }}>
                <Bell size={13} color={C.gold} />
                الإشعارات
                {unreadCount > 0 && (
                  <span style={{
                    background:     C.err,
                    color:          '#fff',
                    borderRadius:   10,
                    padding:        '1px 6px',
                    fontSize:       9,
                    fontWeight:     700,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </h3>

              <div style={{ display: 'flex', gap: 6 }}>
                {notifications.some(n => n.isRead) && (
                  <button
                    onClick={clearRead}
                    title="حذف المقروءة"
                    style={{
                      background:   C.card,
                      border:       `1px solid ${C.b2}`,
                      borderRadius: 7,
                      padding:      5,
                      cursor:       'pointer',
                      color:        C.t3,
                      display:      'flex',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 7,
                    padding:      5,
                    cursor:       'pointer',
                    color:        C.t3,
                    display:      'flex',
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* قائمة الإشعارات */}
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                /* لا توجد إشعارات */
                <div style={{
                  padding:   '40px 20px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🔔</div>
                  <p style={{ fontSize: 13, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
                    لا توجد إشعارات حتى الآن
                  </p>
                  <p style={{ fontSize: 11, color: C.t3, fontFamily: 'Tajawal, sans-serif', marginTop: 4 }}>
                    ستصلك إشعارات عند تحديث حالة طلبك
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      display:     'flex',
                      gap:         12,
                      padding:     '13px 16px',
                      background:  notif.isRead ? 'none' : C.gold + '0D',
                      borderBottom: `1px solid ${C.b1}`,
                      position:   'relative',
                      transition:  'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.b1)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = notif.isRead ? 'none' : C.gold + '0D')}
                  >
                    {/* أيقونة النوع */}
                    <div style={{
                      width:          36,
                      height:         36,
                      borderRadius:   '50%',
                      background:     C.gold + '15',
                      border:         `1px solid ${C.gold}33`,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      flexShrink:     0,
                    }}>
                      <Package size={16} color={C.gold} />
                    </div>

                    {/* محتوى الإشعار */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize:     12,
                        fontWeight:   notif.isRead ? 400 : 700,
                        color:        notif.isRead ? C.t2 : C.t1,
                        fontFamily:   'Tajawal, sans-serif',
                        marginBottom: 2,
                      }}>
                        {notif.title}
                      </p>
                      <p style={{
                        fontSize:  11,
                        color:     C.t3,
                        fontFamily: 'Tajawal, sans-serif',
                        lineHeight: 1.5,
                      }}>
                        {notif.message}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ fontSize: 9, color: C.t3, fontFamily: 'Tajawal, sans-serif' }}>
                          {timeAgo(notif.createdAt)}
                        </span>
                        {notif.orderId && (
                          <Link
                            href={`/orders/${notif.orderId}`}
                            onClick={() => setOpen(false)}
                            style={{
                              fontSize:       9,
                              color:          C.gold,
                              textDecoration: 'none',
                              display:        'flex',
                              alignItems:     'center',
                              gap:            3,
                            }}
                          >
                            تتبع الطلب <ExternalLink size={8} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* نقطة غير مقروء */}
                    {!notif.isRead && (
                      <div style={{
                        position:     'absolute',
                        top:          12,
                        left:         12,
                        width:        7,
                        height:       7,
                        borderRadius: '50%',
                        background:   C.gold,
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer — رابط كل الطلبات */}
            {notifications.length > 0 && (
              <div style={{
                padding:     '10px 16px',
                borderTop:   `1px solid ${C.b1}`,
                textAlign:   'center',
              }}>
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  style={{
                    fontSize:       11,
                    color:          C.gold,
                    textDecoration: 'none',
                    fontFamily:     'Tajawal, sans-serif',
                    fontWeight:     600,
                  }}
                >
                  عرض كل طلباتي ←
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}