import { useEffect, useState } from 'react';
import { VendorPayload } from '@/lib/vendorAuth';

export function useVendorSession() {
  const [vendor, setVendor] = useState<VendorPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vendor/me')
      .then((r) => {
        if (!r.ok) throw new Error('Unauthorized');
        return r.json();
      })
      .then((d) => {
        setVendor(d.vendor);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { vendor, loading };
}