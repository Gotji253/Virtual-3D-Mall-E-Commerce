import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Merchant Dashboard</h1>
        <p className="text-slate-500 mb-8">จัดการสินค้าและร้านค้าของคุณ</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/mall" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium">ดูห้าง 3D</Link>
          <Link href="/" className="px-5 py-2.5 border border-slate-300 rounded-lg">หน้าหลัก</Link>
        </div>
        <div className="mt-10 p-6 bg-white rounded-xl border">
          <p className="text-slate-500 text-sm">ระบบจัดการสินค้าเต็มรูปแบบพร้อมใช้เมื่อเชื่อมต่อ Supabase</p>
        </div>
      </div>
    </main>
  );
}
