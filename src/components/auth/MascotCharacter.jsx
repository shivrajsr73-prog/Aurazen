import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MascotCharacter = ({ onSequenceComplete }) => {
  const group = useRef();
  
  // Model state logic
  const [modelError, setModelError] = useState(false);
  const [sequenceState, setSequenceState] = useState('walking'); // walking -> dropping -> idle

  // Load assets - We wrap in try/catch equivalent logic using Suspense boundary in AuthScene, 
  // but if files are missing, useGLTF will throw. 
  // The user MUST place these files in public/models/
  let gltf, walk, drop, idle, think;
  try {
    gltf = useGLTF('/models/character.glb');
    walk = useFBX('/models/walk.fbx');
    drop = useFBX('/models/drop.fbx');
    idle = useFBX('/models/idle.fbx');
    think = useFBX('/models/think.fbx');
  } catch (err) {
    // If files are completely missing, this will fail up to the ErrorBoundary.
    // Drei's hooks throw promises for suspense, so error handling is done via ErrorBoundary higher up.
  }

  // Combine animations
  const animations = [];
  if (walk && walk.animations.length) {
    walk.animations[0].name = 'Walk';
    animations.push(walk.animations[0]);
  }
  if (drop && drop.animations.length) {
    drop.animations[0].name = 'Drop';
    animations.push(drop.animations[0]);
  }
  if (idle && idle.animations.length) {
    idle.animations[0].name = 'Idle';
    animations.push(idle.animations[0]);
  }
  if (think && think.animations.length) {
    think.animations[0].name = 'Think';
    animations.push(think.animations[0]);
  }

  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;

    // Timeline implementation using basic timeouts for precise control
    // Step 1: Walk
    if (actions['Walk']) {
      actions['Walk'].reset().fadeIn(0.5).play();
    }

    // Step 2: Stop walking, Drop bag
    const dropTimer = setTimeout(() => {
      setSequenceState('dropping');
      if (actions['Walk'] && actions['Drop']) {
        actions['Walk'].fadeOut(0.5);
        actions['Drop'].reset().fadeIn(0.5).setLoop(THREE.LoopOnce, 1).play();
        actions['Drop'].clampWhenFinished = true;
      }
    }, 3000); // Walk for 3 seconds

    // Step 3: Switch to Think/Idle and reveal UI
    const thinkTimer = setTimeout(() => {
      setSequenceState('thinking');
      if (actions['Drop'] && actions['Think']) {
        actions['Drop'].fadeOut(0.5);
        actions['Think'].reset().fadeIn(0.5).play();
      } else if (actions['Idle']) {
        actions['Idle'].reset().fadeIn(0.5).play();
      }
      onSequenceComplete(); // Triggers the UI overlay
    }, 5500); // Allow drop animation to finish

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(thinkTimer);
    };
  }, [actions, onSequenceComplete]);

  // Movement Logic
  useFrame((state, delta) => {
    if (!group.current) return;

    if (sequenceState === 'walking') {
      // Move from left (-8) to center (-2)
      if (group.current.position.x < -2) {
        group.current.position.x += 2 * delta; 
      }
    } else if (sequenceState === 'thinking') {
      // Step slightly to the left to balance the composition when form appears
      if (group.current.position.x > -4) {
        group.current.position.x -= 1.5 * delta;
      }
      // Slowly rotate to face the camera more directly
      if (group.current.rotation.y < 0.3) {
        group.current.rotation.y += 0.5 * delta;
      }
    }
  });

  if (!gltf) return null;

  return (
    <group ref={group} position={[-8, -3, 0]} rotation={[0, Math.PI / 8, 0]} dispose={null}>
      {/* 
        Inject materials/shadows dynamically to ensure cinematic quality 
        Traverse the loaded model and enable shadows and realistic materials
      */}
      <primitive 
        object={gltf.scene} 
        scale={2.5} 
        castShadow 
        receiveShadow 
        onUpdate={(self) => {
          self.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.envMapIntensity = 1.5;
                child.material.roughness = 0.4;
              }
            }
          });
        }}
      />
    </group>
  );
};

// Preload the model structure if possible
// useGLTF.preload('/models/character.glb');

export default MascotCharacter;
