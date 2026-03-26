"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/** Decorative meshes must not win pointer rays or OrbitControls won’t drag */
const noopRaycast: THREE.Object3D["raycast"] = (raycaster, intersects) => {
  void raycaster;
  void intersects;
};

const BRAND_LIGHT = new THREE.Color("#A78BFA");
const BRAND = new THREE.Color("#8B5CF6");

const HtmlPortalContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

/** All industries from the previous grid + teaser row (order preserved) */
const INDUSTRIES = [
  "Landscaping",
  "Roofing",
  "Solar",
  "Snowplowing",
  "Med Spas",
  "Dental Clinics",
  "E-Commerce",
  "Plumbing",
  "Electricians",
  "Painters",
  "Car Detailers",
  "Barbers",
  "HVAC",
  "Moving",
  "Locksmiths",
  "Pest Control",
  "Auto Repair",
  "Dry Cleaning",
  "Gyms",
  "Cleaning",
  "Pool Service",
  "Flooring",
  "Handyman",
  "Photography",
  "Catering",
  "Event Planning",
  "Pet Grooming",
  "Tutoring",
  "Real Estate",
  "Legal",
];

function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  if (samples < 2) {
    return [new THREE.Vector3(0, radius, 0)];
  }
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }
  return points;
}

function IndustryLabel({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const htmlPortalRef = useContext(HtmlPortalContext);

  useLayoutEffect(() => {
    const g = groupRef.current;
    if (g) g.raycast = noopRaycast;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        transform
        sprite
        portal={
          htmlPortalRef
            ? (htmlPortalRef as unknown as RefObject<HTMLElement>)
            : undefined
        }
        distanceFactor={6.5}
        pointerEvents="none"
        zIndexRange={[100, 0]}
        className="select-none whitespace-nowrap font-sora text-[6px] font-bold leading-none tracking-wide text-white sm:text-[7px]"
        style={{
          textShadow:
            "0 0 6px rgba(167, 139, 250, 0.65), 0 0 14px rgba(139, 92, 246, 0.4)",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

function ParticleSphere() {
  const meshRef = useRef<THREE.Group>(null);
  const [particleCount, setParticleCount] = useState(180);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setParticleCount(mq.matches ? 120 : 180);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const radius = 3;
  const connectionDistance = 0.75;

  const particles = useMemo(
    () => fibonacciSphere(particleCount, radius),
    [particleCount, radius],
  );

  const connections = useMemo(() => {
    const lines: {
      start: THREE.Vector3;
      end: THREE.Vector3;
      distance: number;
    }[] = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].distanceTo(particles[j]);
        if (distance < connectionDistance) {
          lines.push({ start: particles[i], end: particles[j], distance });
        }
      }
    }
    return lines;
  }, [particles, connectionDistance]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(connections.length * 6);
    const colors = new Float32Array(connections.length * 6);
    let k = 0;
    let c = 0;
    for (const conn of connections) {
      const fade = Math.max(
        0.2,
        Math.min(1, 1 - conn.distance / connectionDistance),
      );
      const r = BRAND_LIGHT.r * fade;
      const g = BRAND_LIGHT.g * fade;
      const b = BRAND_LIGHT.b * fade;
      positions[k++] = conn.start.x;
      positions[k++] = conn.start.y;
      positions[k++] = conn.start.z;
      positions[k++] = conn.end.x;
      positions[k++] = conn.end.y;
      positions[k++] = conn.end.z;
      colors[c++] = r;
      colors[c++] = g;
      colors[c++] = b;
      colors[c++] = r;
      colors[c++] = g;
      colors[c++] = b;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [connections, connectionDistance]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const labelPositions = useMemo(() => {
    const n = INDUSTRIES.length;
    return INDUSTRIES.map((_, i) => {
      const idx = Math.min(
        particles.length - 1,
        Math.round(((i + 0.5) / n) * (particles.length - 1)),
      );
      const p = particles[idx].clone().multiplyScalar(1.22);
      return [p.x, p.y, p.z] as [number, number, number];
    });
  }, [particles]);

  return (
    <group ref={meshRef}>
      {particles.map((pos, i) => (
        <mesh key={i} position={pos} raycast={noopRaycast}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial
            color="#A78BFA"
            emissive={BRAND}
            emissiveIntensity={0.55}
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>
      ))}

      <lineSegments geometry={lineGeometry} raycast={noopRaycast}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </lineSegments>

      {INDUSTRIES.map((industry, i) => (
        <IndustryLabel
          key={`${industry}-${i}`}
          position={labelPositions[i]}
          label={industry}
        />
      ))}
    </group>
  );
}

export default function IndustrySphere() {
  const htmlPortalRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-[min(68vh,500px)] min-h-[360px] w-full md:h-[min(72vh,640px)] md:min-h-[480px] lg:h-[min(75vh,720px)] lg:min-h-[520px]">
      <HtmlPortalContext.Provider value={htmlPortalRef}>
        <div
          ref={htmlPortalRef}
          className="pointer-events-none absolute inset-0 z-[5]"
          aria-hidden
        />
        <Canvas
          className="absolute inset-0 !h-full !w-full touch-none z-0"
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.32} />
          <pointLight position={[10, 10, 10]} intensity={0.55} color="#FFFFFF" />
          <pointLight position={[-10, -8, -6]} intensity={0.35} color="#8B5CF6" />
          <pointLight
            position={[0, 12, 4]}
            intensity={0.42}
            color="#A78BFA"
            decay={2}
            distance={36}
          />

          <ParticleSphere />

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.65}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
          />
        </Canvas>
      </HtmlPortalContext.Provider>
    </div>
  );
}
