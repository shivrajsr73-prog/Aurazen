import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows, Text } from '@react-three/drei';
import { useRef, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

/* ─── Premium 3D Core Model ──────────────────────────────────── */
function AuraCore() {
  const meshRef = useRef();

  useFrame((_, dt) => {
    meshRef.current.rotation.x += dt * 0.3;
    meshRef.current.rotation.y += dt * 0.4;
  });

  return (
    <group position={[0, 0.3, 0]}>
      {/* Outer Premium Metallic Knot */}
      <mesh ref={meshRef} scale={0.85}>
        <torusKnotGeometry args={[1.2, 0.35, 256, 64]} />
        <meshStandardMaterial
          color="#050505"
          metalness={1}
          roughness={0.05}
          envMapIntensity={2.5}
        />
      </mesh>
    </group>
  );
}



/* ─── Pedestal ───────────────────────────────────────────────── */
function Pedestal() {
  return (
    <group position={[0, -1.7, 0]}>
      {/* Base Cylinder */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[2.2, 2.3, 0.3, 64]} />
        <meshStandardMaterial color="#020202" metalness={0.8} roughness={0.4} />
      </mesh>
      
      {/* Glowing Edge - Cyan */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 128]} />
        <meshStandardMaterial 
          color="#00F3FF" 
          emissive="#00F3FF" 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </mesh>

      {/* Subtle Purple Glow Ring slightly below */}
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.22, 0.02, 16, 128]} />
        <meshStandardMaterial 
          color="#B026FF" 
          emissive="#B026FF" 
          emissiveIntensity={1} 
          toneMapped={false} 
        />
      </mesh>
    </group>
  );
}

/* ─── Fallback: simple rings shown while image loads ─────────── */
function LoadingRings() {
  return (
    <mesh>
      <torusGeometry args={[1.5, 0.05, 16, 64]} />
      <meshBasicMaterial color="#00E8FF" transparent opacity={0.3} toneMapped={false} />
    </mesh>
  );
}

/* ─── Canvas ─────────────────────────────────────────────────── */
const ThreeCanvas = () => (
  <div className="absolute inset-0 z-0 h-full w-full pointer-events-none md:pointer-events-auto">
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 7.5], fov: 44 }}
      className="w-full h-full lg:translate-x-[25%]"
    >

      <Suspense fallback={<LoadingRings />}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, -5, 3]} intensity={2.0} color="#00E8FF" distance={18} />
        <pointLight position={[5, 5, -5]} intensity={1.5} color="#9B30FF" distance={18} />

        <PresentationControls
          global
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 8, Math.PI / 8]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Float speed={1.4} rotationIntensity={0.06} floatIntensity={0.75} floatingRange={[-0.10, 0.10]}>
            <group position={[0, 0.6, 0]}>
              <AuraCore />
              <Pedestal />
            </group>
          </Float>
        </PresentationControls>

        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.50}
          scale={10}
          blur={3}
          far={4}
          color="#00aaaa"
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  </div>
);

export default ThreeCanvas;
