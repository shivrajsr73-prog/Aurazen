import { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls, Text } from '@react-three/drei';
import MascotCharacter from './MascotCharacter';
import { AlertCircle } from 'lucide-react';

// Error Boundary specifically for missing 3D models
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Model Loading Error:", error);
    this.props.onErrorFallback(); // Trigger the UI immediately if 3D fails
  }

  render() {
    if (this.state.hasError) {
      return (
        <group position={[0, 0, 0]}>
          <Text position={[0, 1, 0]} fontSize={0.5} color="#FF00FF" maxWidth={10} textAlign="center">
            MISSING 3D ASSETS
          </Text>
          <Text position={[0, 0, 0]} fontSize={0.2} color="#ffffff" maxWidth={10} textAlign="center">
            Please place character.glb, walk.fbx, drop.fbx, and think.fbx in public/models/
          </Text>
        </group>
      );
    }
    return this.props.children;
  }
}

const AuthScene = ({ onSequenceComplete }) => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#050505]">
      <Canvas 
        camera={{ position: [0, 2, 12], fov: 45 }} 
        shadows 
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#050505']} />
        
        <Suspense fallback={null}>
          {/* Cinematic Lighting Setup */}
          <ambientLight intensity={0.2} />
          
          {/* Main Key Light - Cyan/White */}
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={2.5} 
            color="#00F3FF" 
            castShadow 
            shadow-bias={-0.0001}
            shadow-mapSize={[2048, 2048]}
          />
          
          {/* Rim Light - Deep Purple */}
          <spotLight 
            position={[-10, 5, -10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={4} 
            color="#B026FF" 
          />
          
          {/* Fill Light */}
          <directionalLight position={[0, 2, 5]} intensity={0.5} color="#ffffff" />
          
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, 0, 0]} 
            polar={[-0.1, 0.1]} 
            azimuth={[-0.2, 0.2]}
          >
            <ModelErrorBoundary onErrorFallback={onSequenceComplete}>
              <MascotCharacter onSequenceComplete={onSequenceComplete} />
            </ModelErrorBoundary>
          </PresentationControls>
          
          {/* Realistic Floor Shadows */}
          <ContactShadows 
            position={[0, -3, 0]} 
            opacity={0.7} 
            scale={20} 
            blur={2} 
            far={4} 
            color="#000000" 
          />
          
          {/* High-end Reflection Environment */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      {/* CSS Overlay Gradients to blend edges */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>
    </div>
  );
};

export default AuthScene;
