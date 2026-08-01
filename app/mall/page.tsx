"use client";

import { useState, useEffect, Component, type ReactNode } from "react";
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
          <p className="text-slate-400 mb-2 text-sm">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="text-blue-400 hover:underline mr-4"
          >
            ลองใหม่
          </button>
          <Link href="/" className="text-blue-400 hover:underline">
            ← กลับหน้าหลัก
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}

const MallCanvas = dynamic(() => import("@/components/MallCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300">กำลังโหลดห้าง 3D...</p>
      </div>
    </div>
  ),
});

const CDN = "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0";

/** จัดวางรอบทางเดินกลาง — ซ้าย/ขวา หน้า/หลัง */
const products = [
  {
    id: "1",
    name: "Damaged Helmet",
    price: 12900,
    x: -4.2,
    y: 0,
    z: -0.8,
    scale: 0.32,
    modelUrl: `${CDN}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`,
  },
  {
    id: "2",
    name: "Duck Classic",
    price: 990,
    x: -5.8,
    y: 0,
    z: -0.8,
    scale: 0.7,
    modelUrl: `${CDN}/Duck/glTF-Binary/Duck.glb`,
  },
  {
    id: "3",
    name: "Water Bottle",
    price: 450,
    x: 4.2,
    y: 0,
    z: -0.8,
    scale: 1.35,
    modelUrl: `${CDN}/WaterBottle/glTF-Binary/WaterBottle.glb`,
  },
  {
    id: "4",
    name: "Avocado",
    price: 120,
    x: 5.8,
    y: 0,
    z: -0.8,
    scale: 7.5,
    modelUrl: `${CDN}/Avocado/glTF-Binary/Avocado.glb`,
  },
  {
    id: "5",
    name: "Boom Box",
    price: 3490,
    x: -5.2,
    y: 0,
    z: -5.8,
    scale: 12,
    modelUrl: `${CDN}/BoomBox/glTF-Binary/BoomBox.glb`,
  },
  {
    id: "6",
    name: "Flight Helmet",
    price: 8900,
    x: -3.6,
    y: 0,
    z: -5.8,
    scale: 0.95,
    modelUrl: `${CDN}/FlightHelmet/glTF/FlightHelmet.gltf`,
  },
  {
    id: "7",
    name: "Toy Car",
    price: 1590,
    x: 4.5,
    y: 0,
    z: -5.8,
    scale: 0.075,
    modelUrl: `${CDN}/ToyCar/glTF-Binary/ToyCar.glb`,
  },
];

export type MallProduct = (typeof products)[number];

export default function MallPage() {
  const [selected, setSelected] = useState<MallProduct | null>(null);
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToCart = (p: MallProduct) => {
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
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">กำลังเตรียม...</div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950">
      <header className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800/80 z-20 backdrop-blur-md">
        <Link href="/" className="text-slate-300 hover:text-white text-sm">
          ← กลับ
        </Link>
        <h1 className="text-white font-semibold text-sm tracking-wide">Virtual 3D Mall</h1>
        <button
          onClick={() => setCartOpen(true)}
          className="relative px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-sm transition"
        >
          🛒 ตะกร้า
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-xs rounded-full flex items-center justify-center">
              {cart.reduce((s, i) => s + i.qty, 0)}
            </span>
          )}
        </button>
      </header>

      <div className="flex-1 relative">
        <ErrorBoundary>
          <MallCanvas products={products} onSelect={setSelected} />
        </ErrorBoundary>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/55 text-white/90 text-xs px-4 py-2 rounded-full pointer-events-none border border-white/10 backdrop-blur-sm">
          ลากหมุน · เลื่อนซูม · คลิกสินค้าบนแท่น
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white text-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-slate-400 text-xl">
              ×
            </button>
            <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-4xl mb-4">
              📦
            </div>
            <h2 className="text-xl font-bold">{selected.name}</h2>
            <p className="text-sm text-slate-500 mb-1">โมเดล 3D · จัดแสดงบนแท่น</p>
            <p className="text-2xl font-bold text-emerald-600 my-3">฿{selected.price.toLocaleString()}</p>
            <button
              onClick={() => addToCart(selected)}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition"
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
              <button onClick={() => setCartOpen(false)} className="text-xl">
                ×
              </button>
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
                    <p className="font-semibold text-emerald-600">
                      ฿{(item.price * item.qty).toLocaleString()}
                    </p>
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
                <button className="w-full py-3 bg-sky-600 text-white rounded-xl font-semibold">ชำระเงิน</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
