'use client';

import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Package,
  Plus,
  Search,
  MoreVertical,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useVendorSession } from '@/hooks/useVendorSession';

const C = {
  bg: '#FAFAF8',
  surf: '#F5F3EF',
  card: '#FFFFFF',
  b1: '#EAE7E1',
  b2: '#DDD9D1',
  gold: '#A8823C',
  t1: '#1A1714',
  t2: '#6B6560',
  t3: '#A39E96',
  err: '#C0504D',
} as const;

type Product = {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: string;
  price: number;
  origPrice: number | null;
  isActive: boolean;
  approvalStatus: string;
  createdAt: string;
  totalStock: number;
};

export default function VendorProductsPage() {
  const { loading: authLoading } = useVendorSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (authLoading) return;
    fetch('/api/vendor/products')
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authLoading]);

  const filtered = products.filter(
    (p) =>
      p.nameAr.includes(search) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || authLoading) {
    return (
      <div style={{ padding: 32 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `3px solid ${C.b2}`,
            borderTop: `3px solid ${C.gold}`,
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 24px', minHeight: '100%' }} dir="rtl">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              color: C.gold,
              letterSpacing: '0.05em',
              marginBottom: 4,
            }}
          >
            بوابة التجار
          </p>
          <h1
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 24,
              fontWeight: 700,
              color: C.t1,
            }}
          >
            منتجاتي
          </h1>
        </div>
        <Link
          href="/vendor/products/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: C.card,
            border: `1px solid ${C.b1}`,
            borderRadius: 12,
            padding: '10px 18px',
            textDecoration: 'none',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Plus size={16} color={C.gold} />
          <span style={{ fontSize: 13, color: C.t1 }}>منتج جديد</span>
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: C.card,
          border: `1px solid ${C.b1}`,
          borderRadius: 12,
          padding: '10px 14px',
          marginBottom: 20,
          maxWidth: 400,
        }}
      >
        <Search size={16} color={C.t3} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث في المنتجات..."
          dir="rtl"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: 13,
            color: C.t1,
            fontFamily: 'Tajawal, sans-serif',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 60,
            color: C.t3,
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Package size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 15, color: C.t2, marginBottom: 8 }}>
            لا توجد منتجات
          </p>
          <p style={{ fontSize: 13 }}>
            ابدأ بإضافة منتج جديد لعرضه في المتجر
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const statusColors: Record<string, string> = {
    APPROVED: 'bg-[#001A08] text-[#5CB87A]',
    PENDING: 'bg-[#1A1200] text-[#C9A86E]',
    REJECTED: 'bg-[#1A0808] text-[#D07070]',
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: C.card,
        border: `1px solid ${C.b1}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: C.t1,
            fontFamily: 'Tajawal, sans-serif',
            marginBottom: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.nameAr}
        </p>
        <p
          style={{
            fontSize: 11,
            color: C.t2,
            fontFamily: 'Tajawal, sans-serif',
            marginBottom: 6,
          }}
        >
          {product.brand}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.gold,
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            {product.price.toLocaleString('ar-EG')} ج.م
          </span>
          <span
            style={{
              fontSize: 11,
              color: C.t3,
              padding: '2px 8px',
              borderRadius: 6,
              background: `${C.gold}12`,
            }}
          >
            {product.totalStock} قطعة
          </span>
        </div>
      </div>

      <div
        style={{
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 11,
          fontFamily: 'Tajawal, sans-serif',
          ...(() => {
            const c = statusColors[product.approvalStatus] || '';
            return {
              background: product.approvalStatus === 'APPROVED' ? '#001A08' : product.approvalStatus === 'PENDING' ? '#1A1200' : '#1A0808',
              color: product.approvalStatus === 'APPROVED' ? '#5CB87A' : product.approvalStatus === 'PENDING' ? '#C9A86E' : '#D07070',
            };
          })(),
        }}
      >
        {product.approvalStatus === 'APPROVED'
          ? 'موافق'
          : product.approvalStatus === 'PENDING'
          ? 'انتظار'
          : 'مرفوض'}
      </div>

      <Link
        href={`/vendor/products/${product.id}/edit`}
        style={{
          padding: 8,
          borderRadius: 8,
          color: C.t2,
          display: 'flex',
        }}
      >
        <ChevronLeft size={16} />
      </Link>
    </motion.div>
  );
}