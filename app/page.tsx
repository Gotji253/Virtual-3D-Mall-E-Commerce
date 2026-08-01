import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/20 mb-6 text-3xl">
          🏬
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
          Virtual 3D Mall
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
          เดินชมห้างสรรพสินค้าเสมือนจริงในโลก 3 มิติ
          <br />
          สัมผัสสินค้า เลือกซื้อได้ทันที
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/mall"
            className="px-7 py-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold text-center transition shadow-lg shadow-sky-500/25"
          >
            เข้าชมห้าง 3D
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold text-center transition"
          >
            ร้านค้า (Merchant)
          </Link>
        </div>
      </div>
    </main>
  );
}
