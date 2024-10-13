import React from 'react';

function SnowGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#ffffff" roughness={0.8} />
    </mesh>
  );
}

export default SnowGround;