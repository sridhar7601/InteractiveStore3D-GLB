import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function LEDLight({ position, rotation = [0, 0, 0], scale = [1, 1, 1], intensity = 5, color = '#FFA500', pulsate = true }) {
  const lightRef = useRef()
  const meshRef = useRef()

  useFrame((state) => {
    if (lightRef.current && pulsate) {
      lightRef.current.intensity = intensity + Math.sin(state.clock.elapsedTime * 2) * 0.5
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={1} />
      </mesh>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={10}
        decay={2}
      />
    </group>
  )
}

export default LEDLight