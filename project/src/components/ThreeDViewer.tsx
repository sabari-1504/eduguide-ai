import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Cube: React.FC = () => (
  <mesh rotation={[0.4, 0.2, 0]} castShadow receiveShadow>
    <boxGeometry args={[1.5, 1.5, 1.5]} />
    <meshStandardMaterial color="orange" />
  </mesh>
);

const ThreeDViewer: React.FC = () => (
  <div style={{ width: '100%', height: '400px' }}>
    <Canvas camera={{ position: [0, 0, 5] }} shadows>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Cube />
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  </div>
);

export default ThreeDViewer; 