# Virtual 3D Mall E-Commerce

ห้างสรรพสินค้าเสมือนจริง 3 มิติ บนเว็บ — Next.js 15 + React Three Fiber + Supabase

## Features

- ฉาก 3D interactive (OrbitControls)
- คลิกสินค้า → Modal + Add to Cart
- ระบบตะกร้า
- Merchant Dashboard
- Supabase schema + RLS พร้อมใช้

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + TypeScript |
| 3D | @react-three/fiber + drei + Three.js |
| UI | Tailwind CSS |
| Backend | Supabase |
| Deploy | Vercel |

## Getting Started

```bash
npm install
cp .env.example .env.local
# ใส่ NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

เปิด http://localhost:3000

## Database

รัน SQL จาก `supabase/migrations/001_initial_schema.sql` ใน Supabase SQL Editor

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript check |

## CI

GitHub Actions รัน type-check + build อัตโนมัติเมื่อ push / PR

## Live Demo

https://virtual-3d-mall.vercel.app
