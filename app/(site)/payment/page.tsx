'use client';
import { useSearchParams } from 'next/navigation';

export default function PaymentPlaceholder() {
  const sp = useSearchParams();
  const params = Object.fromEntries(sp.entries());

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-4">Pembayaran (Placeholder)</h1>
      <p className="text-gray-600 mb-6">
        Payload dari pre-checkout di bawah ini. Nanti sambungkan ke Midtrans/Xendit dan teruskan data ini.
      </p>
      <pre className="rounded-xl bg-gray-100 dark:bg-gray-900 p-4 text-xs overflow-auto">
        {JSON.stringify(params, null, 2)}
      </pre>
    </main>
  );
}
