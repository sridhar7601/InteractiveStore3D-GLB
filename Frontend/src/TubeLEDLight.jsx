import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function TubeLEDLight({ position, rotation = [0, 0, 0], length = 2, radius = 0.05, intensity = 1, color = '#FFFFFF', pulsate = false }) {
  const lightRef = useRef()
  const meshRef = useRef()

  const tubeGeometry = useMemo(() => new THREE.CylinderGeometry(radius, radius, length, 32, 1, true), [radius, length])
  const capGeometry = useMemo(() => new THREE.CircleGeometry(radius, 32), [radius])

  useFrame((state) => {
    if (pulsate && lightRef.current && meshRef.current) {
      const pulseFactor = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2
      lightRef.current.intensity = intensity * (0.8 + pulseFactor * 0.4)
      meshRef.current.material.emissiveIntensity = 0.5 + pulseFactor * 0.5
    }
  })

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5}
          toneMapped={false}
          transparent={true}
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={capGeometry} position={[0, length/2, 0]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh geometry={capGeometry} position={[0, -length/2, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <meshStandardMaterial color={color} />
      </mesh>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={5}
        decay={2}
      />
    </group>
  )
}

export default TubeLEDLight