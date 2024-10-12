import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ProfileLight({ position, color = '#FFA500', intensity = 1, distance = 10, decay = 2, pulsate = false }) {
  const lightRef = useRef();

  useFrame((state) => {
    if (pulsate && lightRef.current) {
      const pulseFactor = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2;
      lightRef.current.intensity = intensity * (0.8 + pulseFactor * 0.4);
    }
  });

  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={distance}
        decay={decay}
      />
      {/* Visualizer for the light (optional, can be removed in production) */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export default ProfileLight;