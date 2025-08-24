"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Particles({ palette, energy }: { palette: string[]; energy: number }) {
  const count = 60000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3 + 0] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.y += 0.18 * dt * (1 + energy * 1.8);
  });
  const base = new THREE.Color(palette[0] || "#8b5cf6");
  const color = base.lerp(new THREE.Color(palette[1] || "#06b6d4"), energy * 0.6);
  const mat = new THREE.PointsMaterial({
    size: 0.03,
    color,
    transparent: true,
    opacity: 0.9,
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

export default function HeroScene({ palette = ["#8b5cf6","#06b6d4","#10b981"], energy = 0 }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 1.2, 6], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <pointLight position={[2, 3, 1]} intensity={1.2} color={palette[1]} />
          <Particles palette={palette} energy={energy} />
        </Suspense>
      </Canvas>
    </div>
  );
}
