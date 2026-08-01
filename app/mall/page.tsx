"use client";

import { useState, useEffect, Component, ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || "Unknown error" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-white">
          <h2 className="text-xl font-bold mb-2">เกิดข้อผิดพลาดในการโหลดฉาก 3D</h2>
          <p className="text-slate-400 mb-2">{this.state.message}</p>
          <p className="text-slate-500 text-sm mb-4">อุปกรณ์นี้อาจไม่รองรับ WebGL</p>
          <Link href="/" className="text-blue-400 hover:underline">← กลับหน้าหลัก</Link>
        </div>
      );
    }
    return this.props.children;
  }
}

const MallCanvas = dynamic(() => import("@/components/MallCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>กำลังโหลดฉาก 3D...</p>
      </div>
    </div>
  ),
});

const products = [
  { id: "1", name: "Smart Watch", price: 4990, x: -2, y: 0.5, z: -3 },
  { id: "2", name: "Wireless Earbuds", price: 2990, x: 2, y: 0.5, z: -3 },
  { id: "3", name: "Laptop Pro", price: 45900, x: 0, y: 0.5, z: -6 },
];

export default function MallPage() {
  const [selected, setSelected] = useState<(typeof products)[0] | null>(null);
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const addToCart = (p: (typeof products)[0]) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === p.id);
      if (exist) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    setSelected(null);
    setCartOpen(true);
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        กำลังเตรียม...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900">
      <header className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 z-20">
        <Link href="/" className="text-slate-300 hover:text-white text-sm">← กลับ</Link>
        <h1 className="text-white font-semibold text-sm">Virtual 3D Mall</h1>
        <button
          onClick={() => setCartOpen(true)}
          className="relative px-3 py-1.5 bg-blue-600 rounded-lg text-sm"
        >
          🛒 ตะกร้า
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
              {cart.reduce((s, i) => s + i.qty, 0)}
            </span>
          )}
        </button>
      </header>

      <div className="flex-1 relative">
        <ErrorBoundary>
          <MallCanvas products={products} onSelect={setSelected} />
        </ErrorBoundary>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative bg-white text-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-slate-400 text-xl">×</button>
            <div className="h-28 bg-slate-100 rounded-xl flex items-center justify-center text-4xl mb-4">📦</div>
            <h2 className="text-xl font-bold">{selected.name}</h2>
            <p className="text-2xl font-bold text-emerald-600 my-3">฿{selected.price.toLocaleString()}</p>
            <button
              onClick={() => addToCart(selected)}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-white text-slate-900 h-full flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold">ตะกร้าสินค้า</h2>
              <button onClick={() => setCartOpen(false)} className="text-xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-slate-400 text-center mt-10">ตะกร้าว่าง</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">x{item.qty}</p>
                    </div>
                    <p className="font-semibold text-emerald-600">฿{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between font-bold text-lg mb-3">
                  <span>รวม</span>
                  <span className="text-emerald-600">฿{total.toLocaleString()}</span>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold">ชำระเงิน</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
