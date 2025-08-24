"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { useGLTF, Environment, ContactShadows, AccumulativeShadows, RandomizedLight, OrbitControls, PerformanceMonitor, Html } from "@react-three/drei";
import * as THREE from "three";

async function exists(path: string): Promise<boolean> {
  try { const r = await fetch(path, { method: "HEAD", cache: "no-store" }); return r.ok; } catch { return false; }
}

function CameraRig() {
  const group = useRef<THREE.Group>(null!);
  const t = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  useFrame((state, dt) => {
    if (!group.current) return;
    t.current += dt;
    const targetX = THREE.MathUtils.degToRad(mouse.current.y * 5);
    const targetY = THREE.MathUtils.degToRad(mouse.current.x * 7);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, dt);
    const cam = state.camera;
    const baseZ = 3.8;
    cam.position.z = THREE.MathUtils.damp(cam.position.z, baseZ + Math.sin(t.current * 0.6) * 0.06, 2, dt);
  });
  return <group ref={group} position={[0,0,0]} />;
}

function FallbackNoChar() {
  return (
    <Html center>
      <div style={{padding:'10px 14px',borderRadius:12,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',backdropFilter:'blur(10px)',fontSize:12}}>
        No character: <code>/public/hero/char.glb</code>
      </div>
    </Html>
  );
}

function Model({ url="/hero/char.glb" }) {
  const group = useRef<THREE.Group>(null!);
  const gltf: any = useGLTF(url);
  useMemo(() => {
    gltf.scene.traverse((o: any) => {
      if (o.isMesh) {
        o.receiveShadow = true;
        o.castShadow = true;
        if (o.material) {
          o.material.roughness = Math.min(0.9, o.material.roughness ?? 0.6);
          o.material.metalness = Math.max(0.0, o.material.metalness ?? 0.15);
        }
      }
    });
  }, [gltf]);
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.15; });
  return <primitive ref={group} object={gltf.scene} position={[0,-1.2,0]} />;
}
useGLTF.preload("/hero/char.glb");

export default function CharacterViewer() {
  const [ready, setReady] = useState<null | boolean>(null);
  useEffect(() => { exists("/hero/char.glb").then(setReady); }, []);
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap; }}
        camera={{ position: [0,1.6,3.8], fov: 45 }}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor>
            <Environment preset="sunset" ground={{ radius: 30, height: 6 }} />
            <hemisphereLight intensity={0.6} />
            <directionalLight position={[3,5,2]} intensity={1.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
            <CameraRig />
            {ready === false ? <FallbackNoChar /> : <Model />}
            <ContactShadows position={[0,-1.1,0]} opacity={0.42} scale={12} blur={2.6} far={6} />
            <AccumulativeShadows temporal frames={40} alphaTest={0.9} scale={12} position={[0,-1.1,0]}>
              <RandomizedLight amount={8} radius={6} intensity={1} ambient={0.2} position={[5,5,-5]} />
            </AccumulativeShadows>
            <OrbitControls enablePan={false} minDistance={2.8} maxDistance={6} />
          </PerformanceMonitor>
        </Suspense>
      </Canvas>
    </div>
  );
}
