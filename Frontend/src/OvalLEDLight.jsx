import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function OvalLEDLight({ position, rotation = [0, 0, 0], scale = [1, 1, 1], intensity = 2, color = '#FFA500' }) {
  const lightRef = useRef()
  const meshRef = useRef()

  const geometry = useMemo(() => new THREE.TorusGeometry(1, 0.1, 16, 100), [])

  useFrame((state) => {
    if (lightRef.current) {
      const pulseFactor = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2
      lightRef.current.intensity = intensity * (0.8 + pulseFactor * 0.4)
      if (meshRef.current) {
        meshRef.current.material.emissiveIntensity = 0.5 + pulseFactor * 0.5
      }
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5}
          toneMapped={false}
        />
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

export default OvalLEDLight