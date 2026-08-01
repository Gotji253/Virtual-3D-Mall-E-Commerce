import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virtual 3D Mall",
  description: "ห้างสรรพสินค้าเสมือนจริง 3 มิติ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-slate-900 text-white antialiased">{children}</body>
    </html>
  );
}
