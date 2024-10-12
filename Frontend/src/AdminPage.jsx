import React, { useState, useEffect, Suspense, useRef } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, position, scale }) {
  const group = useRef();
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          if (child.material.map) {
            child.material.map.anisotropy = 16;
          }
          child.material.roughness = 0.5;
          child.material.metalness = 0.5;
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (group.current) {
      group.current.position.set(position[0], position[1], position[2]);
      group.current.scale.set(scale[0], scale[1], scale[2]);
    }
  });

  return <primitive ref={group} object={scene} />;
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: '1.5em' }}>Loading...</div>
    </Html>
  );
}

function AdminPage() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelName, setModelName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 }); // New state for rotation
  const [details, setDetails] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showStorePreview, setShowStorePreview] = useState(false);
  const BASE_URL = 'http://localhost:3000'; // Update this if your backend URL changes

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    if (showStorePreview) {
      fetchModels();
    }
  }, [showStorePreview]);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/models`);
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!modelName.trim() || !selectedFile) {
      alert('Please enter a model name and select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('model', selectedFile);
    formData.append('modelName', modelName.trim());
    formData.append('rotation', JSON.stringify([rotation.x, rotation.y, rotation.z])); // Add rotation
    formData.append('position', JSON.stringify([position.x, position.y, position.z]));
    formData.append('scale', JSON.stringify([scale.x, scale.y, scale.z]));
    formData.append('details', details);

    try {
      await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchModels();
      resetForm();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setPosition({ x: model.position[0], y: model.position[1], z: model.position[2] });
    setRotation({ x: model.rotation[0], y: model.rotation[1], z: model.rotation[2] }); // Set rotation
    setScale({ x: model.scale[0], y: model.scale[1], z: model.scale[2] });
    setDetails(model.details);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
// Add handler for rotation change
const handleRotationChange = (axis, value) => {
  const newRotation = { ...rotation, [axis]: parseFloat(value) };
  setRotation(newRotation);
  if (selectedModel) {
    const updatedModel = { 
      ...selectedModel, 
      rotation: [newRotation.x, newRotation.y, newRotation.z] 
    };
    handleRealTimeUpdate(updatedModel);
  }
};
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/models/${selectedModel.filename}`, {
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z], // Include rotation
        scale: [scale.x, scale.y, scale.z],
        details: details
      });
      setSelectedModel(response.data.model);
      setIsEditing(false);
      fetchModels();
      alert('Model updated successfully!');
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Error updating model. Please try again.');
    }
  };

  const resetForm = () => {
    setModelName('');
    setSelectedFile(null);
    setPosition({ x: 0, y: 0, z: 0 });
    setRotation({ x: 0, y: 0, z: 0 }); // Reset rotation
    setScale({ x: 1, y: 1, z: 1 });
    setDetails('');
  };

  const handleRealTimeUpdate = (updatedModel) => {
    setModels(prevModels => prevModels.map(model => 
      model.filename === updatedModel.filename ? updatedModel : model
    ));
  };

  const getModelUrl = (filename) => {
    return `${BASE_URL}/uploads/${encodeURIComponent(filename)}`;
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: parseFloat(value) };
    setPosition(newPosition);
    if (selectedModel) {
      const updatedModel = { 
        ...selectedModel, 
        position: [newPosition.x, newPosition.y, newPosition.z] 
      };
      handleRealTimeUpdate(updatedModel);
    }
  };

  const handleScaleChange = (axis, value) => {
    const newScale = { ...scale, [axis]: parseFloat(value) };
    setScale(newScale);
    if (selectedModel) {
      const updatedModel = { 
        ...selectedModel, 
        scale: [newScale.x, newScale.y, newScale.z] 
      };
      handleRealTimeUpdate(updatedModel);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h2>Admin Panel</h2>
        <div>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Model Name"
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <input 
            type="file" 
            onChange={handleFileSelect} 
            accept=".glb" 
            style={{ marginBottom: '10px' }} 
          />
          <div>
            <label>Position:</label>
            <input
              type="number"
              value={position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              placeholder="X"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              placeholder="Y"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={position.z}
              onChange={(e) => handlePositionChange('z', e.target.value)}
              placeholder="Z"
              style={{ width: '50px' }}
            />
          </div>
          <div>
            <label>Scale:</label>
            <input
              type="number"
              value={scale.x}
              onChange={(e) => handleScaleChange('x', e.target.value)}
              placeholder="X"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={scale.y}
              onChange={(e) => handleScaleChange('y', e.target.value)}
              placeholder="Y"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={scale.z}
              onChange={(e) => handleScaleChange('z', e.target.value)}
              placeholder="Z"
              style={{ width: '50px' }}
            />
          </div>
          <div>
            <label>Details:</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter model details"
              style={{ width: '100%', height: '100px', marginBottom: '10px' }}
            />
          </div>
          {!selectedModel && (
            <button 
              onClick={handleUpload} 
              disabled={!modelName.trim() || !selectedFile}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: (!modelName.trim() || !selectedFile) ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: (!modelName.trim() || !selectedFile) ? 'not-allowed' : 'pointer'
              }}
            >
              Upload Model
            </button>
          )}
          {selectedModel && !isEditing && (
            <button 
              onClick={handleEdit}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Edit Model
            </button>
          )}
          {selectedModel && isEditing && (
            <button 
              onClick={handleUpdate}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Update Model
            </button>
          )}
        </div>
        <h3>Uploaded Models</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {models.map((model) => (
            <li key={model.filename} style={{ marginBottom: '10px' }}>
              <button onClick={() => handleModelSelect(model)}>
                {model.name || model.filename}
              </button>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => setShowStorePreview(!showStorePreview)}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          {showStorePreview ? 'Hide Store Preview' : 'Show Store Preview'}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {showStorePreview ? (
          <Canvas
            shadows
            camera={{ position: [0, 5, 10], fov: 60 }}
            style={{ background: '#f0f0f0', flex: 1 }}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={['#f0f0f0']} />
            <fog attach="fog" args={['#f0f0f0', 0, 40]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Suspense fallback={<Loader />}>
              <Model url="/store.glb" position={[0, 0, 0]} scale={[1, 1, 1]} />
              {models.map((model) => (
                <Model
                  key={model.filename}
                  url={getModelUrl(model.filename)}
                  position={model.position}
                  scale={model.scale}
                />
              ))}
              <Environment preset="warehouse" />
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
        ) : selectedModel ? (
          <>
            <Canvas
              shadows
              camera={{ position: [0, 0, 5] }}
              style={{ background: '#f0f0f0', flex: 1 }}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={['#f0f0f0']} />
              <fog attach="fog" args={['#f0f0f0', 0, 20]} />
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
              <Suspense fallback={<Loader />}>
                <Model
                  url={selectedModel ? getModelUrl(selectedModel.filename) : null}
                  position={[position.x, position.y, position.z]}
                  scale={[scale.x, scale.y, scale.z]}
                />
                <Environment preset="warehouse" />
              </Suspense>
              <OrbitControls
                rotateSpeed={0.5}
                zoomSpeed={0.5}
                panSpeed={0.5}
                minDistance={2}
                maxDistance={20}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
            <div style={{ padding: '20px', background: '#f0f0f0', color: 'grey' }}>
              <h3>Model Details</h3>
              <p><strong>Name:</strong> {selectedModel.name}</p>
              <p><strong>Position:</strong> X: {position.x}, Y: {position.y}, Z: {position.z}</p>
              <p><strong>Scale:</strong> X: {scale.x}, Y: {scale.y}, Z: {scale.z}</p>
              <p><strong>Details:</strong> {details}</p>
            </div>
          </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>Select a model to preview or show store preview</p>
        </div>
      )}
    </div>
    <div>
          <label>Rotation:</label>
          <input
            type="number"
            value={rotation.x}
            onChange={(e) => handleRotationChange('x', e.target.value)}
            placeholder="X"
            style={{ width: '50px', marginRight: '5px' }}
          />
          <input
            type="number"
            value={rotation.y}
            onChange={(e) => handleRotationChange('y', e.target.value)}
            placeholder="Y"
            style={{ width: '50px', marginRight: '5px' }}
          />
          <input
            type="number"
            value={rotation.z}
            onChange={(e) => handleRotationChange('z', e.target.value)}
            placeholder="Z"
            style={{ width: '50px' }}
          />
        </div>
  </div>
);
}

export default AdminPage;