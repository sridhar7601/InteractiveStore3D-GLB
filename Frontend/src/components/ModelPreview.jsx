import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import OptimizedModel from '../models/OptimizedModel';
import { CanvasLoader } from '../utils/Loader';  // Import CanvasLoader specifically

function ModelPreview({ model }) {
  const BASE_URL = 'https://interactivestore3d-glb-1.onrender.com';

  const getModelUrl = (filename) => {
    return `${BASE_URL}/uploads/${encodeURIComponent(filename)}`;
  };

  return (
    <div style={{ position: 'relative', height: '300px' }}>
      <Canvas
        gl={{
          antialias: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
        camera={{ position: [2, 2, 2], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Suspense fallback={<CanvasLoader />}>
          <OptimizedModel 
            url={getModelUrl(model.filename)}
            position={[0, 0, 0]} 
            scale={model.scale} 
            isClickable={false} 
          />
          <Environment preset="apartment" background={false} />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Html position={[0, 1.5, 0]}>
            {/* shadow in tag for users to see prise */}
          {/* <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {model.price ? `$${model.price.toFixed(2)}` : 'Price not available'}
          </div> */}
        </Html>
      </Canvas>
    </div>
  );
}

export default ModelPreview;