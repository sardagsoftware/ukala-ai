"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Model({ url="/hero/char.glb" }) {
  const group = useRef<THREE.Group>(null!);
  const gltf: any = useGLTF(url);
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.15; });
  return <primitive ref={group} object={gltf.scene} position={[0,-1.2,0]} />;
}
useGLTF.preload("/hero/char.glb");

export default function CharacterViewer() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0,1.6,3.8], fov: 45 }} gl={{ antialias: true, alpha: true }}
        onCreated={({gl})=> gl.setClearColor(0x000000, 0)}>
        <Suspense fallback={null}>
          <hemisphereLight intensity={0.6} />
          <directionalLight position={[3,5,2]} intensity={1.2} />
          <Model />
          <OrbitControls enablePan={false} minDistance={2.5} maxDistance={6} />
        </Suspense>
      </Canvas>
    </div>
  );
}
