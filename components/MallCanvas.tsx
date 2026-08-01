"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, Float } from "@react-three/drei";
import { Suspense, useState } from "react";

type Product = { id: string; name: string; price: number; x: number; y: number; z: number };

function ProductBox({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Float speed={hovered ? 2 : 1} floatIntensity={hovered ? 0.25 : 0.06}>
      <mesh
        position={[product.x, product.y, product.z]}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.12 : 1}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "#3b82f6" : "#6366f1"} roughness={0.4} metalness={0.15} />
      </mesh>
      {hovered && (
        <Html position={[product.x, product.y + 1.25, product.z]} center>
          <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none">
            {product.name}<br />
            <span className="text-emerald-400">฿{product.price.toLocaleString()}</span>
          </div>
        </Html>
      )}
    </Float>
  );
}

export default function MallCanvas({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.2, 9], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
      style={{ background: "#0f172a" }}
      onCreated={({ gl }) => gl.setClearColor("#0f172a")}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 12, 4]} intensity={1} castShadow />
        <Environment preset="warehouse" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={25} blur={2} />
        {products.map((p) => (
          <ProductBox key={p.id} product={p} onSelect={() => onSelect(p)} />
        ))}
        <OrbitControls
          enablePan
          enableZoom
          maxPolarAngle={Math.PI / 2.05}
          minDistance={3}
          maxDistance={20}
          target={[0, 0.5, -2]}
        />
      </Suspense>
    </Canvas>
  );
}
