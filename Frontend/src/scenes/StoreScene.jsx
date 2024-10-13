import React, { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import OptimizedModel from '../models/OptimizedModel';
import OvalLEDLight from '../lights/OvalLEDLight';
import TubeLEDLight from '../lights/TubeLEDLight';
import StoreSign from '../models/StoreSign';
import SnowGround from '../models/SnowGround';
import SnowEffect from './SnowEffect';
import { CanvasLoader } from '../utils/Loader';  // Use named import

function StoreScene({ onModelClick, models }) {
  const BASE_URL = 'https://interactivestore3d-glb-1.onrender.com';

  const getModelUrl = (filename) => {
    return `${BASE_URL}/uploads/${encodeURIComponent(filename)}`;
  };

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 10, 50]} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      
      <ambientLight intensity={0.2} />

      <Suspense fallback={<CanvasLoader />}>
        <OptimizedModel 
          url="/store.glb" 
          position={[0, 0, 0]} 
          scale={[1, 1, 1]} 
          onClick={() => {}} 
          isClickable={true} 
        />
        {models.map((model) => (
          <OptimizedModel
            key={model.name}
            url={getModelUrl(model.filename)}
            position={model.position}
            rotation={model.rotation.map((deg) => deg * (Math.PI / 180))}
            scale={model.scale}
            onClick={() => onModelClick(model)}
            isClickable={true}
            isApiProduct={true}
          />
        ))}
        <OvalLEDLight 
          position={[-2.7, 2.96, 0]} 
          scale={[1.5, 1, 1]} 
          rotation={[Math.PI / 2, 0, 0]}
          intensity={8}
          color="#FFA500" 
        />
        <TubeLEDLight 
          position={[2, 1.55, 0.040]} 
          rotation={[0, 0, 0]} 
          length={2.92} 
          intensity={1.5} 
          color="#FFA500" 
        />
        <TubeLEDLight 
          position={[-9, 1.55, 0.040]} 
          rotation={[0, 0, 0]} 
          length={2.92} 
          intensity={1.5} 
          color="#FFA500" 
        />
<StoreSign 
        text="One For All" 
        position={[0, 3.7, 4.9]} 
        rotation={[0, 0, 0]}  // Adjust this if needed
        width={4}  // Adjust the width as needed
        height={1}  // Adjust the height as needed
      />        <SnowGround />
        <SnowEffect count={10000} />
      </Suspense>
    </>
  );
}

export default StoreScene;