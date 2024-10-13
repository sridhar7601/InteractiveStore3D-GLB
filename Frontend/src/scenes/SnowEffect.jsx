import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SnowEffect({ count = 5000 }) {
  const mesh = useRef();

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      // Generate snow particles in specific areas outside the store
      let x, z;
      do {
        x = Math.random() * 60 - 30; // Range: -30 to 30
        z = Math.random() * 60 - 30; // Range: -30 to 30
      } while (Math.abs(x) < 5 && z > -5 && z < 5); // Avoid the store area

      positions[i] = x;
      positions[i + 1] = Math.random() * 20; // y: 0 to 20
      positions[i + 2] = z;

      velocities[i] = Math.random() * 0.02 - 0.01; // x velocity
      velocities[i + 1] = -(Math.random() * 0.1 + 0.1); // y velocity (falling)
      velocities[i + 2] = Math.random() * 0.02 - 0.01; // z velocity
    }

    return [positions, velocities];
  }, [count]);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  useFrame(() => {
    if (mesh.current) {
      const positionArray = mesh.current.geometry.attributes.position.array;

      for (let i = 0; i < count * 3; i += 3) {
        positionArray[i] += velocities[i];
        positionArray[i + 1] += velocities[i + 1];
        positionArray[i + 2] += velocities[i + 2];

        // Reset snowflake if it falls below the ground
        if (positionArray[i + 1] < 0) {
          // Reset to a new position outside the store area
          let x, z;
          do {
            x = Math.random() * 60 - 30; // Range: -30 to 30
            z = Math.random() * 60 - 30; // Range: -30 to 30
          } while (Math.abs(x) < 5 && z > -5 && z < 5); // Avoid the store area

          positionArray[i] = x;
          positionArray[i + 1] = 20; // Reset to top
          positionArray[i + 2] = z;
        }
      }

      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.8}
        fog={true}
      />
    </points>
  );
}

export default SnowEffect;