import React from 'react';
import { SpotLight } from '@react-three/drei';

function ProfileLight({ position, target, intensity, color }) {
  return (
    <SpotLight
      castShadow
      position={position}
      intensity={intensity}
      angle={Math.PI / 6}
      penumbra={0.5}
      color={color}
      target={target}
    />
  );
}

export default ProfileLight;