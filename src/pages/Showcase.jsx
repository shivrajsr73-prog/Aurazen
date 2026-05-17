import React, { Suspense, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  ContactShadows,
  Environment,
  PresentationControls,
} from '@react-three/drei';
import * as THREE from 'three';
import './Showcase.css';

// ─────────────────────────────────────────────────────────────
// Procedural T-Shirt Geometry (front + back panels + sleeves)
// ─────────────────────────────────────────────────────────────
function buildTshirtGeometry() {
  const shape = new THREE.Shape();

  // Draw the front silhouette of an oversized tee (in local units)
  // Starting at bottom-left, going counter-clockwise
  const W = 1.5;   // half-width of body
  const H = 2.2;   // body height
  const SW = 0.85; // sleeve width
  const SH = 0.55; // sleeve height (drop from shoulder)
  const NW = 0.38; // neck half-width
  const ND = 0.22; // neck depth

  shape.moveTo(-W, -H);               // bottom-left
  shape.lineTo(-W, 0.4);              // up left side
  shape.bezierCurveTo(-W, 0.5, -W - SW, 0.5 - SH, -W - SW, 0.5 - SH - 0.1); // left shoulder slope
  shape.lineTo(-W - SW, 0.5 - SH - 0.45); // sleeve bottom-left
  shape.lineTo(-W, 0.5 - SH - 0.6);  // sleeve bottom-right (armpit)
  shape.lineTo(-W, 0.42);             // back into body
  shape.lineTo(-W, H - 0.25);         // up to shoulder
  shape.bezierCurveTo(-W, H, -NW - 0.1, H + 0.05, -NW, H); // left neck curve
  shape.bezierCurveTo(-NW * 0.5, H - ND, NW * 0.5, H - ND, NW, H); // neck scoop
  shape.bezierCurveTo(NW + 0.1, H + 0.05, W, H, W, H - 0.25); // right neck curve
  shape.lineTo(W, 0.42);              // down right shoulder
  shape.lineTo(W, 0.5 - SH - 0.6);   // armpit right
  shape.lineTo(W + SW, 0.5 - SH - 0.45); // sleeve bottom-right
  shape.lineTo(W + SW, 0.5 - SH - 0.1);  // sleeve top-right
  shape.bezierCurveTo(W + SW, 0.5 - SH, W, 0.5, W, 0.4); // right shoulder slope
  shape.lineTo(W, -H);                // bottom-right
  shape.closePath();

  const extrudeSettings = {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 4,
    steps: 2,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// ─────────────────────────────────────────────────────────────
// Fabric-like cloth texture via canvas
// ─────────────────────────────────────────────────────────────
function useFabricTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, size, size);

    // Subtle vertical weave lines for fabric feel
    for (let i = 0; i < size; i += 4) {
      const alpha = Math.random() * 0.06 + 0.02;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(i, 0, 1, size);
    }
    // Subtle horizontal cross weave
    for (let i = 0; i < size; i += 8) {
      const alpha = Math.random() * 0.04 + 0.01;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(0, i, size, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 6);
    return texture;
  }, []);
}

// ─────────────────────────────────────────────────────────────
// AuraZen Logo — canvas texture mapped to a plane on the chest
// ─────────────────────────────────────────────────────────────
function useLogoTexture() {
  return useMemo(() => {
    const w = 512;
    const h = 200;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    // Brand name
    ctx.font = 'bold 90px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '12px';

    // Neon glow effect
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('AURAZEN', w / 2, h / 2 - 16);

    // Sub-tagline
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00ffcc';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillStyle = '#00ffcc';
    ctx.fillText('— OVERSIZED COLLECTION —', w / 2, h / 2 + 46);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
}

// ─────────────────────────────────────────────────────────────
// Neon Orbiting Rings
// ─────────────────────────────────────────────────────────────
function NeonRings() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.x -= delta * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Cyan ring — tight orbit */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[3.0, 0.018, 16, 120]} />
        <meshBasicMaterial color="#00ffcc" toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[3.0, 0.07, 16, 120]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.12} toneMapped={false} />
      </mesh>

      {/* Purple ring — wider orbit */}
      <mesh rotation={[-Math.PI / 3.5, Math.PI / 5, 0]}>
        <torusGeometry args={[3.6, 0.018, 16, 120]} />
        <meshBasicMaterial color="#b200ff" toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 3.5, Math.PI / 5, 0]}>
        <torusGeometry args={[3.6, 0.07, 16, 120]} />
        <meshBasicMaterial color="#b200ff" transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Fold crease detail planes (subtle shading sculpting)
// ─────────────────────────────────────────────────────────────
function ClothFolds() {
  const folds = useMemo(() => [
    { position: [0, -0.3, 0.13], rotation: [0, 0, 0.05], scale: [1.4, 0.04, 1] },
    { position: [0.2, -0.8, 0.13], rotation: [0, 0, -0.1], scale: [0.8, 0.03, 1] },
    { position: [-0.25, -1.1, 0.13], rotation: [0, 0, 0.08], scale: [1.0, 0.03, 1] },
    { position: [0, -1.5, 0.13], rotation: [0, 0, 0.0], scale: [1.5, 0.025, 1] },
  ], []);

  return (
    <group>
      {folds.map((f, i) => (
        <mesh key={i} position={f.position} rotation={f.rotation} scale={f.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Main T-Shirt Group
// ─────────────────────────────────────────────────────────────
function TShirt() {
  const groupRef = useRef();
  const fabricTex = useFabricTexture();
  const logoTex = useLogoTexture();
  const geo = useMemo(() => buildTshirtGeometry(), []);

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main T-Shirt Body */}
      <mesh
        geometry={geo}
        castShadow
        receiveShadow
        position={[-0.0, -1.1, -0.06]}
      >
        <meshStandardMaterial
          map={fabricTex}
          color="#111111"
          roughness={0.88}
          metalness={0.05}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Chest Logo Plane */}
      <mesh position={[0, 0.35, 0.09]}>
        <planeGeometry args={[1.4, 0.55]} />
        <meshBasicMaterial
          map={logoTex}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Cloth crease details */}
      <ClothFolds />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// Scene Lights
// ─────────────────────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      {/* Key light from top-left */}
      <directionalLight position={[-3, 5, 3]} intensity={1.8} color="#ffffff" castShadow />
      {/* Rim/back light */}
      <directionalLight position={[3, -2, -4]} intensity={1.2} color="#ccddff" />
      {/* Cyan fill from bottom */}
      <pointLight position={[-4, -2, 3]} intensity={2} color="#00ffcc" distance={12} />
      {/* Purple back fill */}
      <pointLight position={[4, 3, -5]} intensity={1.5} color="#b200ff" distance={12} />
      <Environment preset="city" />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────
const Showcase = () => {
  return (
    <div className="showcase-container">
      <div className="bg-glow-teal"></div>
      <div className="bg-glow-purple"></div>

      {/* UI Layer */}
      <div className="showcase-ui-layer">
        <Link to="/" className="back-btn">
          <ArrowLeft size={18} />
          <span>HOME</span>
        </Link>
        <div className="interaction-hint">
          <span>DRAG TO ROTATE</span>
        </div>
      </div>

      {/* Overlay Title — HTML, 100% reliable rendering */}
      <div className="scene-title-overlay">
        <div className="scene-title-brand">AURAZEN</div>
        <div className="scene-title-sub">Oversized Collection &mdash; 2025</div>
      </div>

      {/* 3D Canvas */}
      <div className="canvas-wrapper">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.5, 7], fov: 42 }}>
          <color attach="background" args={['#060609']} />
          <fog attach="fog" args={['#060609', 8, 20]} />

          <Suspense fallback={null}>
            <SceneLights />

            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              polar={[-Math.PI / 5, Math.PI / 5]}
              azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
            >
              <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.2} floatingRange={[-0.15, 0.15]}>
                <TShirt />
                <NeonRings />
              </Float>
            </PresentationControls>

            <ContactShadows
              position={[0, -3.2, 0]}
              opacity={0.7}
              scale={12}
              blur={3}
              far={5}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Showcase;
