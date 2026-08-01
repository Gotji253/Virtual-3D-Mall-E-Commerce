import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-center">
      <div className="text-5xl mb-4">🏬</div>
      <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">Virtual 3D Mall</h1>
      <p className="text-slate-300 text-lg mb-10 max-w-md">
        เดินชมห้างสรรพสินค้าเสมือนจริงในโลก 3 มิติ<br />
        เลือกซื้อสินค้าได้ทันที
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link href="/mall" className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-center transition">
          เข้าชมห้าง 3D
        </Link>
        <Link href="/dashboard" className="px-6 py-3.5 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-center transition">
          ร้านค้า (Merchant)
        </Link>
      </div>
    </main>
  );
}
