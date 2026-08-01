"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  SoftShadows,
  MeshReflectorMaterial,
  Html,
  useGLTF,
  Center,
  Text,
  RoundedBox,
  Sparkles,
  Float,
} from "@react-three/drei";
import { Suspense, useRef, useState, useMemo, Component, type ReactNode } from "react";
import type { Group } from "three";
import * as THREE from "three";

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
      <boxGeometry args={[0.32, 0.32, 0.32]} />
      <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.28} />
    </mesh>
  );
}

function GlbModel({ url, scale = 1, hovered }: { url: string; scale?: number; hovered: boolean }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  const ref = useRef<Group>(null);

  useFrame((_, dt) => {
    if (ref.current && hovered) ref.current.rotation.y += dt * 0.9;
  });

  return (
    <group ref={ref} scale={hovered ? scale * 1.12 : scale}>
      <Center top>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

function Pedestal() {
  return (
    <group>
      {/* base ring glow */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 48]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.55}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.41, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.36, 0.82, 48]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 48]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.85} roughness={0.06} />
      </mesh>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 48]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.25} />
      </mesh>
    </group>
  );
}

function ProductItem({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[product.x, 0, product.z]}>
      <Pedestal />
      <Float
        speed={hovered ? 2.5 : 1.2}
        floatIntensity={hovered ? 0.15 : 0.04}
        rotationIntensity={0}
      >
        <group
          position={[0, 0.92, 0]}
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

          {hovered && (
            <>
              <spotLight
                position={[0, 2.5, 1.1]}
                angle={0.3}
                penumbra={0.5}
                intensity={3.5}
                color="#e0f2fe"
                castShadow
                shadow-mapSize={[512, 512]}
              />
              <Sparkles
                count={18}
                scale={1.4}
                size={2.5}
                speed={0.4}
                opacity={0.6}
                color="#7dd3fc"
              />
            </>
          )}

          <Html position={[0, 1.05, 0]} center distanceFactor={8.5}>
            <div
              className={`text-center whitespace-nowrap rounded-xl px-3 py-1.5 text-[10px] leading-tight transition-all duration-200 shadow-2xl ${
                hovered
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white scale-110"
                  : "bg-slate-950/75 text-white/95 border border-white/15 backdrop-blur-md"
              }`}
            >
              <div className="font-semibold tracking-wide">{product.name}</div>
              <div className={`font-medium ${hovered ? "text-sky-100" : "text-emerald-400"}`}>
                ฿{product.price.toLocaleString()}
              </div>
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
}

function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 4.8, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 4.75, 0]}>
        <cylinderGeometry args={[0.3, 0.26, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* vertical light strip */}
      <mesh position={[0.2, 2.4, 0]}>
        <boxGeometry args={[0.03, 3.8, 0.03]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function StoreBooth({
  position,
  label,
  accent,
  width = 6.5,
}: {
  position: [number, number, number];
  label: string;
  accent: string;
  width?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 2.2, -1.15]} receiveShadow>
        <boxGeometry args={[width, 4.4, 0.1]} />
        <meshStandardMaterial color="#020617" roughness={0.65} metalness={0.2} />
      </mesh>

      {/* reflective back panel */}
      <mesh position={[0, 2.05, -1.0]}>
        <planeGeometry args={[width - 0.6, 3.0]} />
        <meshStandardMaterial color="#0f172a" metalness={0.94} roughness={0.05} envMapIntensity={1.5} />
      </mesh>

      {/* side frames */}
      {[-width / 2 + 0.06, width / 2 - 0.06].map((x, i) => (
        <mesh key={i} position={[x, 2.0, -0.55]} castShadow>
          <boxGeometry args={[0.1, 3.9, 0.95]} />
          <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.22} />
        </mesh>
      ))}

      {/* fascia */}
      <mesh position={[0, 4.2, -0.45]} castShadow>
        <boxGeometry args={[width, 0.5, 1.05]} />
        <meshStandardMaterial color="#020617" metalness={0.45} roughness={0.3} />
      </mesh>

      {/* neon sign board */}
      <mesh position={[0, 4.2, 0.08]}>
        <boxGeometry args={[width - 0.5, 0.26, 0.05]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 3.95, 0.6]} intensity={1.4} distance={9} color={accent} />

      <Text
        position={[0, 4.2, 0.14]}
        fontSize={0.26}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {label}
      </Text>

      {/* counter */}
      <RoundedBox
        args={[width - 0.7, 0.65, 0.5]}
        radius={0.05}
        position={[0, 0.42, -0.3]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0.76, -0.3]} receiveShadow>
        <boxGeometry args={[width - 0.8, 0.035, 0.52]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.88} roughness={0.06} />
      </mesh>

      {/* accent line under counter */}
      <mesh position={[0, 0.12, -0.05]}>
        <boxGeometry args={[width - 1, 0.02, 0.02]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CeilingLight({ position, w = 3 }: { position: [number, number, number]; w?: number }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[w, 0.035, 0.5]} />
        <meshStandardMaterial
          color="#fffef5"
          emissive="#fef9c3"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[w + 0.12, 0.025, 0.62]} />
        <meshStandardMaterial color="#1e293b" metalness={0.55} roughness={0.3} />
      </mesh>
      <pointLight intensity={1.5} distance={16} decay={2} color="#fff7ed" position={[0, -0.5, 0]} />
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.44, 16]} />
        <meshStandardMaterial color="#44403c" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshStandardMaterial color="#166534" roughness={0.6} />
      </mesh>
      <mesh position={[0.18, 1.05, 0.08]} castShadow>
        <sphereGeometry args={[0.26, 14, 14]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
      <mesh position={[-0.14, 1.08, -0.08]} castShadow>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#14532d" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.7, 0.1, 0.48]} radius={0.04} position={[0, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.35} />
      </RoundedBox>
      {[-0.7, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.36, 0.38]} />
          <meshStandardMaterial color="#0f172a" metalness={0.45} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function MallSign() {
  return (
    <Float speed={0.8} floatIntensity={0.08} rotationIntensity={0.02}>
      <group position={[0, 4.35, -3]}>
        <mesh castShadow>
          <boxGeometry args={[5.2, 0.55, 0.18]} />
          <meshStandardMaterial color="#020617" metalness={0.55} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[4.9, 0.36, 0.04]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 0, 0.18]}
          fontSize={0.24}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          VIRTUAL 3D MALL
        </Text>
        <pointLight position={[0, -0.3, 0.8]} intensity={0.8} distance={6} color="#38bdf8" />
      </group>
    </Float>
  );
}

function ReflectiveFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3]} receiveShadow>
        <planeGeometry args={[28, 22]} />
        <MeshReflectorMaterial
          blur={[350, 100]}
          resolution={1024}
          mixBlur={0.9}
          mixStrength={0.95}
          roughness={0.32}
          depthScale={0.55}
          minDepthThreshold={0.28}
          maxDepthThreshold={1.35}
          color="#0a101c"
          metalness={0.7}
          mirror={0.4}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -3]} receiveShadow>
        <planeGeometry args={[3.0, 18]} />
        <MeshReflectorMaterial
          blur={[180, 40]}
          resolution={512}
          mixBlur={0.65}
          mixStrength={1.15}
          roughness={0.18}
          depthScale={0.35}
          color="#121c30"
          metalness={0.8}
          mirror={0.5}
        />
      </mesh>
      {[-1.58, 1.58].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.018, -3]}>
          <planeGeometry args={[0.06, 18]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={0.65}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

function MallEnvironment() {
  return (
    <group>
      <ReflectiveFloor />

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.15, -3]}>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color="#04070e" roughness={1} />
      </mesh>

      <CeilingLight position={[-4.5, 5.05, -1.2]} w={3.2} />
      <CeilingLight position={[0, 5.05, -1.2]} w={3.2} />
      <CeilingLight position={[4.5, 5.05, -1.2]} w={3.2} />
      <CeilingLight position={[-3, 5.05, -5.2]} w={3} />
      <CeilingLight position={[3, 5.05, -5.2]} w={3} />
      <CeilingLight position={[0, 5.05, -8]} w={4} />

      {/* walls */}
      <mesh position={[-11, 2.55, -3]} receiveShadow>
        <boxGeometry args={[0.25, 5.2, 22]} />
        <meshStandardMaterial color="#080d16" roughness={0.85} metalness={0.08} />
      </mesh>
      <mesh position={[11, 2.55, -3]} receiveShadow>
        <boxGeometry args={[0.25, 5.2, 22]} />
        <meshStandardMaterial color="#080d16" roughness={0.85} metalness={0.08} />
      </mesh>
      <mesh position={[0, 2.55, -13]} receiveShadow>
        <boxGeometry args={[22.3, 5.2, 0.25]} />
        <meshStandardMaterial color="#080d16" roughness={0.85} metalness={0.08} />
      </mesh>

      {/* mirror wall */}
      <mesh position={[0, 2.25, -12.8]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#0a1220" metalness={0.96} roughness={0.03} envMapIntensity={1.8} />
      </mesh>

      <Pillar position={[-6.5, 0, 1.5]} />
      <Pillar position={[6.5, 0, 1.5]} />
      <Pillar position={[-6.5, 0, -7]} />
      <Pillar position={[6.5, 0, -7]} />

      <StoreBooth position={[-5.2, 0, -1.2]} label="TECH" accent="#3b82f6" width={6.5} />
      <StoreBooth position={[5.2, 0, -1.2]} label="GADGET" accent="#a78bfa" width={6.5} />
      <StoreBooth position={[-4.5, 0, -6.2]} label="LIFESTYLE" accent="#fb7185" width={6} />
      <StoreBooth position={[4.5, 0, -6.2]} label="AUDIO" accent="#2dd4bf" width={6} />

      <MallSign />

      <Plant position={[-2.15, 0, 0.9]} />
      <Plant position={[2.15, 0, 0.9]} />
      <Plant position={[-2.0, 0, -9]} />
      <Plant position={[2.0, 0, -9]} />
      <Bench position={[0, 0, -3.8]} />

      {/* ambient sparkles in atrium */}
      <Sparkles
        count={40}
        scale={[12, 4, 14]}
        position={[0, 2.5, -3]}
        size={1.8}
        speed={0.25}
        opacity={0.35}
        color="#bae6fd"
      />

      <ContactShadows
        position={[0, 0.02, -3]}
        opacity={0.88}
        scale={28}
        blur={2.0}
        far={14}
        resolution={2048}
        color="#000000"
        frames={1}
      />
    </group>
  );
}

function MallLighting() {
  return (
    <>
      <ambientLight intensity={0.16} color="#e2e8f0" />
      <hemisphereLight args={["#c4b5fd", "#0f172a", 0.32]} />
      <directionalLight
        position={[7, 12, 5]}
        intensity={1.5}
        color="#fffaf0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-radius={4}
      />
      <directionalLight position={[-6, 8, -2]} intensity={0.25} color="#c4b5fd" />
      <directionalLight position={[0, 5, -14]} intensity={0.2} color="#e0e7ff" />
      <SoftShadows size={20} samples={14} focus={0.82} />
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
      camera={{ position: [0, 3.0, 7.2], fov: 36 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        toneMappingExposure: 1.08,
      }}
      style={{ background: "#030712" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#030712");
        gl.shadowMap.enabled = true;
      }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#030712", 16, 32]} />
        <MallLighting />
        <Environment preset="city" environmentIntensity={0.9} />
        <MallEnvironment />

        {products.map((p) => (
          <ProductItem key={p.id} product={p} onSelect={() => onSelect(p)} />
        ))}

        <OrbitControls
          enablePan
          enableZoom
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.18}
          minDistance={3.2}
          maxDistance={16}
          target={[0, 1.35, -3]}
          enableDamping
          dampingFactor={0.06}
        />
      </Suspense>
    </Canvas>
  );
}
