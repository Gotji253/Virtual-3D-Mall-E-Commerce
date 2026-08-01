"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  Float,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { Suspense, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  x: number;
  y: number;
  z: number;
  color: string;
  shape: "watch" | "earbuds" | "laptop" | "phone" | "headphones" | "tablet" | "speaker";
};

function ProductMesh({ shape, color, hovered }: { shape: Product["shape"]; color: string; hovered: boolean }) {
  const s = hovered ? 1.08 : 1;
  switch (shape) {
    case "watch":
      return (
        <group scale={s}>
          <mesh>
            <torusGeometry args={[0.22, 0.06, 16, 32]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      );
    case "earbuds":
      return (
        <group scale={s}>
          <mesh position={[-0.12, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.35, 0.08, 0.18]} />
            <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.4} />
          </mesh>
        </group>
      );
    case "laptop":
      return (
        <group scale={s}>
          <mesh position={[0, 0.02, 0]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.7, 0.03, 0.45]} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.22, -0.18]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.68, 0.4, 0.02]} />
            <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.5} />
          </mesh>
        </group>
      );
    case "phone":
      return (
        <group scale={s}>
          <RoundedBox args={[0.28, 0.55, 0.04]} radius={0.04} smoothness={4}>
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
          </RoundedBox>
          <mesh position={[0, 0.02, 0.025]}>
            <planeGeometry args={[0.22, 0.42]} />
            <meshStandardMaterial color="#0f172a" metalness={0.1} roughness={0.6} />
          </mesh>
        </group>
      );
    case "headphones":
      return (
        <group scale={s}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.28, 0.04, 12, 32, Math.PI]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[-0.28, -0.08, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.35} />
          </mesh>
          <mesh position={[0.28, -0.08, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.35} />
          </mesh>
        </group>
      );
    case "tablet":
      return (
        <group scale={s}>
          <RoundedBox args={[0.55, 0.4, 0.03]} radius={0.03} smoothness={4}>
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.25} />
          </RoundedBox>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.48, 0.34]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      );
    case "speaker":
      return (
        <group scale={s}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.2, 0.35, 24]} />
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.1, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.1, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh scale={s}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}

function ProductItem({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Float speed={hovered ? 2.5 : 1.2} floatIntensity={hovered ? 0.2 : 0.05} rotationIntensity={0.05}>
      <group
        position={[product.x, product.y, product.z]}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <ProductMesh shape={product.shape} color={product.color} hovered={hovered} />
        {hovered && (
          <Html position={[0, 0.7, 0]} center distanceFactor={8}>
            <div className="bg-black/85 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg border border-white/10">
              <div className="font-semibold">{product.name}</div>
              <div className="text-emerald-400">฿{product.price.toLocaleString()}</div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

function Shelf({ position, width = 8 }: { position: [number, number, number]; width?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.08, 1.2]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.82, 0.55]} castShadow>
        <boxGeometry args={[width, 0.12, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.5} />
      </mesh>
      {[-width / 2 + 0.15, width / 2 - 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0]} castShadow>
          <boxGeometry args={[0.1, 0.8, 1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 5, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.15} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function StoreFront({ position, label, accent }: { position: [number, number, number]; label: string; accent: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, -0.8]} receiveShadow>
        <boxGeometry args={[5.5, 4, 0.15]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.6, -0.7]}>
        <boxGeometry args={[5.5, 0.25, 0.05]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
      </mesh>
      <Text position={[0, 3.2, -0.65]} fontSize={0.35} color="#f8fafc" anchorX="center" anchorY="middle" maxWidth={4}>
        {label}
      </Text>
    </group>
  );
}

function MallEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.35} />
      </mesh>
      {[-6, -2, 2, 6].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z - 4]}>
          <planeGeometry args={[36, 0.04]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, -4]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#0c1222" roughness={0.9} />
      </mesh>
      {[-8, -3, 2, 7].map((x, i) => (
        <group key={i} position={[x, 5, -3]}>
          <mesh>
            <boxGeometry args={[2.2, 0.08, 0.6]} />
            <meshStandardMaterial color="#e2e8f0" emissive="#fef3c7" emissiveIntensity={0.8} />
          </mesh>
          <pointLight intensity={0.6} distance={12} color="#fff7ed" position={[0, -0.3, 0]} />
        </group>
      ))}
      <mesh position={[-12, 2.5, -4]} receiveShadow>
        <boxGeometry args={[0.3, 5, 28]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>
      <mesh position={[12, 2.5, -4]} receiveShadow>
        <boxGeometry args={[0.3, 5, 28]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.5, -14]} receiveShadow>
        <boxGeometry args={[24, 5, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>
      <Pillar position={[-8, 0, 2]} />
      <Pillar position={[8, 0, 2]} />
      <Pillar position={[-8, 0, -10]} />
      <Pillar position={[8, 0, -10]} />
      <StoreFront position={[0, 0, -1]} label="Tech Zone" accent="#3b82f6" />
      <StoreFront position={[0, 0, -5]} label="Audio Lab" accent="#f43f5e" />
      <Shelf position={[0, 0, -2]} width={9} />
      <Shelf position={[0, 0, -6]} width={8} />
      <ContactShadows position={[0, 0.02, -4]} opacity={0.45} scale={28} blur={2.5} far={8} />
    </group>
  );
}

export default function MallCanvas({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 3.5, 8], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
      style={{ background: "#020617" }}
      onCreated={({ gl }) => gl.setClearColor("#020617")}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#020617", 12, 32]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[8, 14, 6]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
        <hemisphereLight args={["#93c5fd", "#0f172a", 0.35]} />
        <Environment preset="warehouse" environmentIntensity={0.45} />
        <MallEnvironment />
        {products.map((p) => (
          <ProductItem key={p.id} product={p} onSelect={() => onSelect(p)} />
        ))}
        <OrbitControls
          enablePan
          enableZoom
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.2}
          minDistance={4}
          maxDistance={22}
          target={[0, 1, -3]}
          enableDamping
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  );
}
