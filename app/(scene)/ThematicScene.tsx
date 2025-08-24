"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

function pickPalette(text: string): string[] {
  const t = text.toLowerCase();
  if (t.includes("ateş") || t.includes("fire")) return ["#FF3B0A","#FF8A00","#FFC300"];
  if (t.includes("deniz") || t.includes("ocean")) return ["#00E5FF","#0077FF","#00FFAA"];
  if (t.includes("orman") || t.includes("forest")) return ["#34D399","#10B981","#065F46"];
  if (t.includes("cyberpunk")) return ["#FF00C8","#00E5FF","#7DF9FF"];
  return ["#8B5CF6","#06B6D4","#10B981"];
}

function useParticleCount() {
  const [count, setCount] = useState(20000);
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cores = (navigator as any).hardwareConcurrency || 4;
    const base = isMobile ? 12000 : 20000;
    const scaled = Math.round(base * (1.5 / dpr) * Math.min(1.2, cores / 8));
    setCount(Math.max(8000, Math.min(40000, scaled)));
  }, []);
  return count;
}

function Particles({ palette, energy, count }: { palette: string[]; energy: number; count: number }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i*3+0] = (Math.random() - 0.5) * 20;
      p[i*3+1] = (Math.random() - 0.5) * 10;
      p[i*3+2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  const colorRef = useRef(new THREE.Color(palette[0]));
  useFrame((_, dt) => {
    ref.current.rotation.y += 0.1 * dt * (1 + energy * 2);
    colorRef.current.lerp(new THREE.Color(energy ? palette[1] : palette[0]), 0.12);
    (ref.current.material as THREE.PointsMaterial).color = colorRef.current;
  });

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <primitive object={mat} />
    </points>
  );
}

function Shockwave({ color = "#FFFFFF", energy }: { color?: string; energy: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const alphaRef = useRef(0);
  const scaleRef = useRef(0.1);
  const prevEnergy = useRef(0);

  useFrame((_, dt) => {
    if (energy > 0 && prevEnergy.current === 0) {
      alphaRef.current = 0.9;
      scaleRef.current = 0.2;
    }
    prevEnergy.current = energy;

    if (alphaRef.current > 0) {
      scaleRef.current += dt * 2.2;
      alphaRef.current -= dt * 1.2;
      if (meshRef.current) {
        meshRef.current.scale.setScalar(scaleRef.current);
        const m = meshRef.current.material as THREE.MeshBasicMaterial;
        m.opacity = Math.max(0, Math.min(1, alphaRef.current));
      }
    }
  });

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI/2, 0, 0]} position={[0, -1, 0]} material={material}>
      <ringGeometry args={[0.4, 0.45, 128]} />
    </mesh>
  );
}

export default function ThematicScene({ prompt = "", energy = 0 }: { prompt: string; energy: number }) {
  const palette = pickPalette(prompt);
  const count = useParticleCount();
  const group = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  // Mouse paralaks
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  useFrame((_, dt) => {
    if (!group.current) return;
    const targetX = THREE.MathUtils.degToRad(mouse.current.y * 4);
    const targetY = THREE.MathUtils.degToRad(mouse.current.x * 6);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, dt);
  });

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        camera={{ position: [0, 1.2, 6], fov: 60 }}
      >
        <Suspense fallback={null}>
          <group ref={group}>
            <ambientLight intensity={0.28} />
            <pointLight position={[2, 3, 1]} intensity={1.2} color={palette[2]} />
            <Particles palette={palette} energy={energy} count={count}/>
            <Shockwave color={palette[1]} energy={energy} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
