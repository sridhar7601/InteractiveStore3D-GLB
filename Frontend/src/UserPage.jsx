import React, { Suspense, useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'

function CursorManager({ isHovering }) {
  useEffect(() => {
    document.body.style.cursor = isHovering ? 'pointer' : 'default'
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [isHovering])
  return null
}

function OptimizedModel({ url, position, rotation = [0, 0, 0], scale, onClick, isClickable = true }) {
  const group = useRef()
  const { scene, materials } = useGLTF(url)
  const [isHovered, setIsHovered] = useState(false)
  const { gl } = useThree()

  const hoverColor = new THREE.Color('#B7E0FF')

  useEffect(() => {
    const clonedScene = scene.clone(true)
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.userData.originalColor = child.material.color.clone()
        child.material.needsUpdate = true
      }
    })
    if (group.current) {
      group.current.add(clonedScene)
    }

    return () => {
      if (group.current && group.current.children.length > 0) {
        const sceneToRemove = group.current.children[0]
        group.current.remove(sceneToRemove)
        sceneToRemove.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              if (child.material.map) child.material.map.dispose()
              child.material.dispose()
            }
            if (child.geometry) child.geometry.dispose()
          }
        })
      }
    }
  }, [scene, materials])

  const handlePointerOver = (event) => {
    if (!isClickable) return
    event.stopPropagation()
    setIsHovered(true)
    gl.domElement.style.cursor = 'pointer'
  }

  const handlePointerOut = (event) => {
    if (!isClickable) return
    event.stopPropagation()
    setIsHovered(false)
    gl.domElement.style.cursor = 'default'
  }

  const handleClick = (event) => {
    if (!isClickable) return
    event.stopPropagation()
    onClick(url)
  }

  useFrame(() => {
    if (group.current) {
      group.current.position.set(...position)
      group.current.rotation.set(...rotation)
      group.current.scale.set(scale[0], scale[1], scale[2])  // Updated to use separate x, y, z scales
    }

    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) {
          if (isHovered && isClickable) {
            child.material.emissive.copy(hoverColor)
            child.material.emissiveIntensity = 0.5
          } else {
            child.material.emissive.set(0, 0, 0)
            child.material.emissiveIntensity = 0
          }
        }
      })
    }
  })

  return (
    <group 
      ref={group}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: '1.5em' }}>Loading...</div>
    </Html>
  )
}

function StoreScene({ onModelClick, models }) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <>
      <CursorManager isHovering={isHovering} />
      <Canvas
        gl={{
          antialias: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={<Loader />}>
          <OptimizedModel 
            url="/store.glb" 
            position={[0, 0, 0]} 
            scale={[1, 1, 1]} 
            onClick={() => {}} 
            isClickable={false} 
          />
          {models.map((model) => (
            <OptimizedModel
              key={model.name}
              url={`http://localhost:3000/uploads/${model.filename}`}
              position={model.position}
              rotation={[0, Math.PI / 4, 0]}
              scale={model.scale}
              onClick={() => onModelClick(model)}
              isClickable={true}
            />
          ))}
          <Environment preset="apartment" background />
        </Suspense>

        <OrbitControls
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          panSpeed={0.5}
          minDistance={2}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          onChange={() => setIsHovering(false)}
        />
      </Canvas>
    </>
  )
}

function ModelPreview({ model }) {
  return (
    <Canvas
      gl={{
        antialias: true,
        outputEncoding: THREE.sRGBEncoding,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1
      }}
      camera={{ position: [2, 2, 2], fov: 45 }}
      style={{ height: '200px' }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Suspense fallback={null}>
        <OptimizedModel 
          url={`http://localhost:3000/uploads/${model.filename}`} 
          position={[0, 0, 0]} 
          scale={model.scale} 
          isClickable={false} 
        />
        <Environment preset="apartment" background={false} />
      </Suspense>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  )
}

function GlassModal({ onClose, children }) {
  return (
    <div style={{
      position: 'fixed',
      top: '10%',
      right: '10%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
      padding: '20px',
      zIndex: 1000,
      width: '300px',
      maxHeight: '80vh',
      overflowY: 'auto',
      transition: 'all 0.3s ease-in-out',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '25px',
          color: '#086C62',
          cursor: 'pointer',
        }}
      >
        ×
      </button>
      {children}
    </div>
  )
}

function UserPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [models, setModels] = useState([])

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/models')
      setModels(response.data)
    } catch (error) {
      console.error('Error fetching models:', error)
    }
  }

  const handleModelClick = (model) => {
    setSelectedModel(model)
    setShowModal(true)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#f0f0f0' }}>
      <StoreScene onModelClick={handleModelClick} models={models} />
      {showModal && selectedModel && (
        <GlassModal onClose={() => setShowModal(false)}>
          <h2 style={{ color: '#086C62', textAlign: 'center' }}>{selectedModel.name}</h2>
          <ModelPreview model={selectedModel} />
          <div style={{ marginTop: '20px',color:'black'}}>
            <h3>Model Details</h3>
            <p><strong>Position:</strong> X: {selectedModel.position[0]}, Y: {selectedModel.position[1]}, Z: {selectedModel.position[2]}</p>
            <p><strong>Scale:</strong> X: {selectedModel.scale[0]}, Y: {selectedModel.scale[1]}, Z: {selectedModel.scale[2]}</p>
            {selectedModel.details && <p><strong>Details:</strong> {selectedModel.details}</p>}
          </div>
        </GlassModal>
      )}
    </div>
  )
}

useGLTF.preload('/store.glb')

export default UserPage