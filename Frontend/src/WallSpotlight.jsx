import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WallSpotlight({ position, target = [0, 0, 0], color = '#FFFFFF', intensity = 1, angle = 0.6, penumbra = 0.5, distance = 15 }) {
  const lightRef = useRef();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(...target);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <group position={position}>
      <spotLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        castShadow
      />
      {/* Simple visual representation of the light source */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export default WallSpotlight;