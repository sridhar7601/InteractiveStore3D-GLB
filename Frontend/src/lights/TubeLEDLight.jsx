import React from 'react';
import { SpotLight } from '@react-three/drei';

function TubeLEDLight({ position, rotation, length, intensity, color }) {
  return (
    <group position={position} rotation={rotation}>
      <SpotLight
        castShadow
        intensity={intensity}
        angle={Math.PI / 2}
        penumbra={0.5}
        position={[0, 0, 0]}
        color={color}
      />
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, length, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default TubeLEDLight;