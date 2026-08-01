"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  SoftShadows,
  Html,
  useGLTF,
  Center,
  Text,
  RoundedBox,
} from "@react-three/drei";
import { Suspense, useRef, useState, useMemo, Component, type ReactNode } from "react";
import type { Group } from "three";

type Product = {
  id: string;
  name: string;
  price: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  modelUrl: string;
};

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function FallbackBox() {
  return (
    <mesh castShadow>
      <boxGeometry args={[0.35, 0.35, 0.35]} />
      <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.35} />
    </mesh>
  );
}

function GlbModel({ url, scale = 1, hovered }: { url: string; scale?: number; hovered: boolean }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  const ref = useRef<Group>(null);

  useFrame((_, dt) => {
    if (ref.current && hovered) ref.current.rotation.y += dt * 0.85;
  });

  return (
    <group ref={ref} scale={hovered ? scale * 1.1 : scale}>
      <Center top>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

/** แท่นวางสินค้า — กระจก/หินอ่อน */
function Pedestal({ height = 0.85 }: { height?: number }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.38, height, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.25} />
      </mesh>
      <mesh position={[0, height + 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.55} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.04, 24]} />
        <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

function ProductItem({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[product.x, 0, product.z]}>
      <Pedestal height={0.82} />
      <group
        position={[0, 0.9, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <ModelErrorBoundary fallback={<FallbackBox />}>
          <Suspense fallback={<FallbackBox />}>
            <GlbModel url={product.modelUrl} scale={product.scale} hovered={hovered} />
          </Suspense>
        </ModelErrorBoundary>

        {/* spotlight ใต้สินค้าเมื่อ hover */}
        {hovered && (
          <spotLight
            position={[0, 2.2, 0.8]}
            angle={0.35}
            penumbra={0.6}
            intensity={2.5}
            color="#e0f2fe"
            castShadow={false}
          />
        )}

        <Html position={[0, 0.95, 0]} center distanceFactor={9}>
          <div
            className={`text-center whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[10px] leading-tight transition shadow-xl ${
              hovered
                ? "bg-blue-600 text-white scale-110"
                : "bg-slate-950/80 text-white/95 border border-white/10 backdrop-blur-sm"
            }`}
          >
            <div className="font-semibold tracking-wide">{product.name}</div>
            <div className={hovered ? "text-emerald-200" : "text-emerald-400 font-medium"}>
              ฿{product.price.toLocaleString()}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

/** เสาห้างแบบโมเดิร์น */
function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.24, 4.8, 20]} />
        <meshStandardMaterial color="#475569" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.12, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.72, 0]}>
        <cylinderGeometry args={[0.32, 0.28, 0.12, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* แถบไฟเสา */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.205, 0.245, 4.6, 20]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.15}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

/** หน้าร้าน + ป้ายไฟ + เคาน์เตอร์ */
function StoreBooth({
  position,
  label,
  accent,
  width = 8,
}: {
  position: [number, number, number];
  label: string;
  accent: string;
  width?: number;
}) {
  return (
    <group position={position}>
      {/* ผนังหลังร้าน */}
      <mesh position={[0, 2.2, -1.1]} receiveShadow>
        <boxGeometry args={[width, 4.4, 0.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.75} metalness={0.1} />
      </mesh>

      {/* กรอบกระจกซ้าย-ขวา */}
      {[-width / 2 + 0.08, width / 2 - 0.08].map((x, i) => (
        <mesh key={i} position={[x, 2.0, -0.55]} castShadow>
          <boxGeometry args={[0.12, 3.8, 0.9]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* แผงด้านบน (fascia) */}
      <mesh position={[0, 4.15, -0.5]} castShadow>
        <boxGeometry args={[width, 0.55, 1.0]} />
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* ป้ายไฟเรืองแสง */}
      <mesh position={[0, 4.15, 0.02]}>
        <boxGeometry args={[width - 0.6, 0.28, 0.06]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 3.9, 0.4]} intensity={1.1} distance={7} color={accent} />

      <Text
        position={[0, 4.15, 0.08]}
        fontSize={0.28}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        fontWeight={700}
      >
        {label}
      </Text>

      {/* เคาน์เตอร์หน้าร้าน */}
      <RoundedBox args={[width - 0.8, 0.7, 0.55]} radius={0.04} position={[0, 0.45, -0.35]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.82, -0.35]} receiveShadow>
        <boxGeometry args={[width - 0.9, 0.04, 0.58]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.12} />
      </mesh>

      {/* พื้นร้านยกระดับเล็กน้อย */}
      <mesh position={[0, 0.02, -0.7]} receiveShadow>
        <boxGeometry args={[width - 0.2, 0.04, 1.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}

function CeilingPanel({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[size[0], 0.04, size[1]]} />
        <meshStandardMaterial
          color="#fffbeb"
          emissive="#fef3c7"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[size[0] + 0.15, 0.03, size[1] + 0.15]} />
        <meshStandardMaterial color="#334155" metalness={0.45} roughness={0.35} />
      </mesh>
      <pointLight intensity={1.2} distance={14} decay={2} color="#fff7ed" position={[0, -0.6, 0]} />
    </group>
  );
}

/** ต้นไม้ประดับเรียบง่าย */
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 12]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>
      <mesh position={[0.2, 1.1, 0.1]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[-0.15, 1.15, -0.1]} castShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#14532d" roughness={0.7} />
      </mesh>
    </group>
  );
}

/** ม้านั่งกลางทางเดิน */
function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.6, 0.12, 0.5]} radius={0.03} position={[0, 0.42, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.5} />
      </RoundedBox>
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function FloorTile({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={[1.95, 1.95]} />
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.22} />
    </mesh>
  );
}

function MallEnvironment() {
  const tiles: ReactNode[] = [];
  for (let x = -5; x <= 5; x++) {
    for (let z = -6; z <= 2; z++) {
      const even = (x + z) % 2 === 0;
      tiles.push(
        <FloorTile
          key={`${x}-${z}`}
          position={[x * 2, 0.005, z * 2]}
          color={even ? "#0c1220" : "#0f172a"}
        />
      );
    }
  }

  return (
    <group>
      {/* พื้นหลัก */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color="#080d16" metalness={0.5} roughness={0.2} />
      </mesh>
      {tiles}

      {/* ทางเดินกลาง — หินอ่อนอ่อนกว่า */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3]} receiveShadow>
        <planeGeometry args={[3.2, 18]} />
        <meshStandardMaterial color="#1a2336" metalness={0.4} roughness={0.28} />
      </mesh>
      {/* เส้นขอบทางเดิน */}
      {[-1.7, 1.7].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, -3]}>
          <planeGeometry args={[0.08, 18]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {/* เพดาน */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.1, -3]}>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color="#060a12" roughness={0.95} />
      </mesh>

      {/* แผงไฟเพดาน */}
      <CeilingPanel position={[-4.5, 5.0, -1.5]} size={[3.2, 0.6]} />
      <CeilingPanel position={[0, 5.0, -1.5]} size={[3.2, 0.6]} />
      <CeilingPanel position={[4.5, 5.0, -1.5]} size={[3.2, 0.6]} />
      <CeilingPanel position={[-3, 5.0, -5.5]} size={[3.2, 0.6]} />
      <CeilingPanel position={[3, 5.0, -5.5]} size={[3.2, 0.6]} />
      <CeilingPanel position={[0, 5.0, -8]} size={[4, 0.5]} />

      {/* ผนังรอบ */}
      <mesh position={[-11, 2.5, -3]} receiveShadow>
        <boxGeometry args={[0.3, 5.2, 22]} />
        <meshStandardMaterial color="#0c1220" roughness={0.85} />
      </mesh>
      <mesh position={[11, 2.5, -3]} receiveShadow>
        <boxGeometry args={[0.3, 5.2, 22]} />
        <meshStandardMaterial color="#0c1220" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.5, -13]} receiveShadow>
        <boxGeometry args={[22.3, 5.2, 0.3]} />
        <meshStandardMaterial color="#0c1220" roughness={0.85} />
      </mesh>

      {/* กระจกด้านหลัง (สะท้อน environment) */}
      <mesh position={[0, 2.2, -12.8]}>
        <planeGeometry args={[10, 3.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.05} />
      </mesh>

      <Pillar position={[-6.5, 0, 1.5]} />
      <Pillar position={[6.5, 0, 1.5]} />
      <Pillar position={[-6.5, 0, -7]} />
      <Pillar position={[6.5, 0, -7]} />

      {/* ร้านซ้าย-ขวา แถวหน้า */}
      <StoreBooth position={[-5.2, 0, -1.2]} label="TECH" accent="#3b82f6" width={6.5} />
      <StoreBooth position={[5.2, 0, -1.2]} label="GADGET" accent="#8b5cf6" width={6.5} />

      {/* ร้านแถวหลัง */}
      <StoreBooth position={[-4.5, 0, -6.2]} label="LIFESTYLE" accent="#f43f5e" width={6} />
      <StoreBooth position={[4.5, 0, -6.2]} label="AUDIO" accent="#14b8a6" width={6} />

      {/* ป้ายกลางห้าง */}
      <group position={[0, 4.4, -3]}>
        <mesh>
          <boxGeometry args={[4.5, 0.5, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[4.2, 0.32, 0.05]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
        <Text position={[0, 0, 0.15]} fontSize={0.22} color="#f8fafc" anchorX="center" anchorY="middle" letterSpacing={0.08}>
          VIRTUAL 3D MALL
        </Text>
      </group>

      <Plant position={[-2.2, 0, 0.8]} />
      <Plant position={[2.2, 0, 0.8]} />
      <Plant position={[-2.0, 0, -9]} />
      <Plant position={[2.0, 0, -9]} />

      <Bench position={[0, 0, -3.8]} />

      <ContactShadows
        position={[0, 0.015, -3]}
        opacity={0.7}
        scale={26}
        blur={2.6}
        far={12}
        resolution={1024}
        color="#000000"
      />
    </group>
  );
}

function MallLighting() {
  return (
    <>
      <ambientLight intensity={0.22} color="#e2e8f0" />
      <hemisphereLight args={["#c7d2fe", "#0f172a", 0.4]} />
      <directionalLight
        position={[7, 11, 4]}
        intensity={1.25}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0003}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-6, 7, -3]} intensity={0.3} color="#bfdbfe" />
      <directionalLight position={[0, 5, -12]} intensity={0.2} color="#e0e7ff" />
      <SoftShadows size={16} samples={10} focus={0.9} />
    </>
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
      camera={{ position: [0, 3.2, 7.5], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
        toneMappingExposure: 1.12,
      }}
      style={{ background: "#05080f" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#05080f");
        gl.shadowMap.enabled = true;
      }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#05080f", 16, 32]} />
        <MallLighting />
        <Environment preset="city" environmentIntensity={0.55} />
        <MallEnvironment />

        {products.map((p) => (
          <ProductItem key={p.id} product={p} onSelect={() => onSelect(p)} />
        ))}

        <OrbitControls
          enablePan
          enableZoom
          maxPolarAngle={Math.PI / 2.08}
          minPolarAngle={0.2}
          minDistance={3.5}
          maxDistance={18}
          target={[0, 1.3, -3]}
          enableDamping
          dampingFactor={0.07}
        />
      </Suspense>
    </Canvas>
  );
}
