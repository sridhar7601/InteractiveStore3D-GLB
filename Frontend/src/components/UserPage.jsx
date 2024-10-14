import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import StoreScene from '../scenes/StoreScene';
import GlassModal from './GlassModal';
import ModelPreview from './ModelPreview';
import VoiceNavigation from './VoiceNavigation';
import { CanvasLoader, DOMLoader } from '../utils/Loader';  // Use named imports


function UserPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = 'https://interactivestore3d-glb-1.onrender.com';

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/models`);
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const addToCart = (model) => {
    setCart(prevCart => [...prevCart, model]);
    alert(`${model.name} added to cart!`);
  };

  const handleVoiceNavigation = (destination) => {
    console.log(`Navigating to ${destination}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#f0f0f0' }}>
      <VoiceNavigation onNavigate={handleVoiceNavigation} />
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
        <Suspense fallback={<CanvasLoader />}>
          {!isLoading && <StoreScene onModelClick={handleModelClick} models={models} />}
        </Suspense>
        <OrbitControls
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          panSpeed={0.5}
          minDistance={2}
          maxDistance={35}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      {isLoading && <DOMLoader />}
      {showModal && selectedModel && (
        <GlassModal onClose={() => setShowModal(false)} model={selectedModel} onAddToCart={addToCart}>
          <h2 style={{ color: '#086C62', textAlign: 'center' }}>{selectedModel.name}</h2>
          <ModelPreview model={selectedModel} />
          <div style={{ marginTop: '20px', color: 'black' }}>
            <h3>Model Details</h3>
            {selectedModel.price ? (
              <p><strong>Price:</strong> ${selectedModel.price.toFixed(2)}</p>
            ) : null}
            {/* <p><strong>Position:</strong> X: {selectedModel.position[0]}, Y: {selectedModel.position[1]}, Z: {selectedModel.position[2]}</p> */}
            {/* <p><strong>Scale:</strong> X: {selectedModel.scale[0]}, Y: {selectedModel.scale[1]}, Z: {selectedModel.scale[2]}</p> */}
            {selectedModel.details && <p><strong>Details:</strong> {selectedModel.details}</p>}
          </div>
        </GlassModal>
      )}
      {/* <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '50%',
        zIndex: 1000,
      }}>
        🛒 {cart.length}
      </div> */}
    </div>
  );
}

export default UserPage;