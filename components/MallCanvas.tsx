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
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
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
    if (ref.current && hovered) {
      ref.current.rotation.y += dt * 0.9;
    }
  });

  return (
    <group ref={ref} scale={hovered ? scale * 1.08 : scale}>
      <Center top>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

function ProductItem({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[product.x, product.y, product.z]}
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

      <Html position={[0, -0.15, 0.55]} center distanceFactor={10}>
        <div
          className={`text-center whitespace-nowrap rounded-md px-2 py-1 text-[10px] leading-tight transition ${
            hovered ? "bg-blue-600 text-white shadow-lg scale-110" : "bg-black/70 text-white/90"
          }`}
        >
          <div className="font-semibold">{product.name}</div>
          <div className={hovered ? "text-emerald-200" : "text-emerald-400"}>
            ฿{product.price.toLocaleString()}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Shelf({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.1, 1.4]} />
        <meshStandardMaterial color="#3b4558" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.88, 0.65]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.14, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.5} />
      </mesh>
      {[-width / 2 + 0.15, width / 2 - 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.85, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.65} />
        </mesh>
      ))}
      {[-width / 4, 0, width / 4].map((x, i) => (
        <mesh key={`div-${i}`} position={[x, 1.05, 0]} castShadow>
          <boxGeometry args={[0.03, 0.12, 1.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
}

function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.25, 5, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function StoreFront({
  position,
  label,
  accent,
}: {
  position: [number, number, number];
  label: string;
  accent: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 2.2, -0.9]} receiveShadow>
        <boxGeometry args={[10, 4.2, 0.12]} />
        <meshStandardMaterial color="#1a2332" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.9, -0.8]}>
        <boxGeometry args={[10, 0.2, 0.06]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 3.5, -0.3]} intensity={0.8} distance={8} color={accent} />
      <Text
        position={[0, 3.5, -0.75]}
        fontSize={0.38}
        color="#f1f5f9"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        {label}
      </Text>
    </group>
  );
}

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.8, 0.05, 0.55]} />
        <meshStandardMaterial
          color="#fffbeb"
          emissive="#fef3c7"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[3, 0.03, 0.7]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.4} />
      </mesh>
      <pointLight
        intensity={1.4}
        distance={16}
        decay={2}
        color="#fff7ed"
        position={[0, -0.5, 0]}
      />
    </group>
  );
}

function MallEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3.5]} receiveShadow>
        <planeGeometry args={[28, 20]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.4} roughness={0.25} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, -3.5]} receiveShadow>
        <planeGeometry args={[2.2, 16]} />
        <meshStandardMaterial color="#1a2332" metalness={0.3} roughness={0.4} />
      </mesh>
      {[-6, -3.5, -1, 1.5].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, z]}>
          <planeGeometry args={[0.22, 1.1]} />
          <meshStandardMaterial color="#2d3a4f" />
        </mesh>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, -3.5]}>
        <planeGeometry args={[28, 20]} />
        <meshStandardMaterial color="#070b14" roughness={0.95} />
      </mesh>

      <CeilingLight position={[-5, 4.9, -2]} />
      <CeilingLight position={[0, 4.9, -3.5]} />
      <CeilingLight position={[5, 4.9, -2]} />
      <CeilingLight position={[-3, 4.9, -6]} />
      <CeilingLight position={[3, 4.9, -6]} />

      <mesh position={[-10, 2.5, -3.5]} receiveShadow>
        <boxGeometry args={[0.25, 5, 18]} />
        <meshStandardMaterial color="#121826" roughness={0.85} />
      </mesh>
      <mesh position={[10, 2.5, -3.5]} receiveShadow>
        <boxGeometry args={[0.25, 5, 18]} />
        <meshStandardMaterial color="#121826" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.5, -12]} receiveShadow>
        <boxGeometry args={[20, 5, 0.25]} />
        <meshStandardMaterial color="#121826" roughness={0.85} />
      </mesh>

      <Pillar position={[-7, 0, 1]} />
      <Pillar position={[7, 0, 1]} />
      <Pillar position={[-7, 0, -8]} />
      <Pillar position={[7, 0, -8]} />

      <StoreFront position={[0, 0, -1.2]} label="FLAGSHIP" accent="#3b82f6" />
      <StoreFront position={[0, 0, -4.7]} label="LIFESTYLE" accent="#f43f5e" />

      <Shelf position={[0, 0, -2]} width={9.5} />
      <Shelf position={[0, 0, -5.5]} width={8} />

      <ContactShadows
        position={[0, 0.01, -3.5]}
        opacity={0.65}
        scale={24}
        blur={2.8}
        far={10}
        resolution={1024}
        color="#000000"
      />
    </group>
  );
}

function MallLighting() {
  return (
    <>
      <ambientLight intensity={0.25} color="#e2e8f0" />
      <hemisphereLight args={["#c7d2fe", "#1e293b", 0.45]} />

      {/* Key light — เงาทิศทางชัด */}
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.35}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      {/* Fill light */}
      <directionalLight position={[-5, 6, -2]} intensity={0.35} color="#bfdbfe" />

      {/* Rim / backlight */}
      <directionalLight position={[0, 4, -10]} intensity={0.25} color="#e0e7ff" />

      <SoftShadows size={18} samples={12} focus={0.85} />
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
      camera={{ position: [0, 2.8, 5.5], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
        toneMappingExposure: 1.15,
      }}
      style={{ background: "#060a14" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#060a14");
        gl.shadowMap.enabled = true;
      }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#060a14", 14, 30]} />
        <MallLighting />
        <Environment preset="warehouse" environmentIntensity={0.65} />
        <MallEnvironment />
        {products.map((p) => (
          <ProductItem key={p.id} product={p} onSelect={() => onSelect(p)} />
        ))}
        <OrbitControls
          enablePan
          enableZoom
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={0.25}
          minDistance={3}
          maxDistance={16}
          target={[0, 1.2, -3.5]}
          enableDamping
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  );
}
