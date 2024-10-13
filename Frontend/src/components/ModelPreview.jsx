import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import OptimizedModel from '../models/OptimizedModel';
import Loader from '../utils/Loader';

function ModelPreview({ model }) {
  const BASE_URL = 'https://interactivestore3d-glb-1.onrender.com';

  const getModelUrl = (filename) => {
    return `${BASE_URL}/uploads/${encodeURIComponent(filename)}`;
  };

  return (
    <Canvas
      gl={{
        antialias: true,
        outputEncoding: THREE.sRGBEncoding,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1
      }}
      camera={{ position: [2, 2, 2], fov: 45 }}
      style={{ height: '200px' }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Suspense fallback={<Loader />}>
        <OptimizedModel 
          url={getModelUrl(model.filename)}
          position={[0, 0, 0]} 
          scale={model.scale} 
          isClickable={false} 
        />
        <Environment preset="apartment" background={false} />
      </Suspense>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

export default ModelPreview;