import React, { useMemo } from 'react';
import * as THREE from 'three';

function StoreSign({ text, position, rotation, width = 5, height = 1 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Fill background
    context.fillStyle = '#4a4a4a';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = 'bold 100px Arial';
    context.fillStyle = '#FFA500';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
  }, [text]);

  const rotationInRadians = rotation.map(deg => deg * (Math.PI / 180));

  return (
    <mesh position={position} rotation={rotationInRadians}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent={true} />
      {/* <pointLight position={[0, 0, 0]} intensity={3} /> */}
    </mesh>
  );
}

export default StoreSign;