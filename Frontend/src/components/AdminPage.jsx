import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import OptimizedModel from '../models/OptimizedModel';
import Loader from '../utils/Loader';

function AdminPage() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelName, setModelName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [details, setDetails] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showStorePreview, setShowStorePreview] = useState(false);
  const [price, setPrice] = useState(0);
  const BASE_URL = 'https://interactivestore3d-glb-1.onrender.com';

  useEffect(() => {
    fetchModels();
  }, []);

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
    formData.append('rotation', JSON.stringify([rotation.x, rotation.y, rotation.z]));
    formData.append('position', JSON.stringify([position.x, position.y, position.z]));
    formData.append('scale', JSON.stringify([scale.x, scale.y, scale.z]));
    formData.append('price', price);
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
    setRotation({ x: model.rotation[0], y: model.rotation[1], z: model.rotation[2] });
    setScale({ x: model.scale[0], y: model.scale[1], z: model.scale[2] });
    setDetails(model.details);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/models/${selectedModel.filename}`, {
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z],
        price: price ,// Add price to update
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
    setRotation({ x: 0, y: 0, z: 0 });
    setScale({ x: 1, y: 1, z: 1 });
    setDetails('');
  };

  const handleChange = (setter) => (e) => {
    setter(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h2>Admin Panel</h2>
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
        <input
        type="number"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        placeholder="Price"
        style={{ marginBottom: '10px', width: '100%' }}
      />
        {['position', 'rotation', 'scale'].map(prop => (
          <div key={prop}>
            <label>{prop.charAt(0).toUpperCase() + prop.slice(1)}:</label>
            {['x', 'y', 'z'].map(axis => (
              <input
                key={axis}
                type="number"
                name={axis}
                value={eval(prop)[axis]}
                onChange={handleChange(eval(`set${prop.charAt(0).toUpperCase() + prop.slice(1)}`))}
                placeholder={axis.toUpperCase()}
                style={{ width: '50px', marginRight: '5px' }}
              />
            ))}
          </div>
        ))}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Enter model details"
          style={{ width: '100%', height: '100px', marginBottom: '10px' }}
        />
        {!selectedModel && (
          <button onClick={handleUpload} disabled={!modelName.trim() || !selectedFile}>
            Upload Model
          </button>
        )}
        {selectedModel && !isEditing && (
          <button onClick={handleEdit}>
            Edit Model
          </button>
        )}
        {selectedModel && isEditing && (
          <button onClick={handleUpdate}>
            Update Model
          </button>
        )}
        <h3>Uploaded Models</h3>
        <ul>
          {models.map((model) => (
            <li key={model.filename}>
              <button onClick={() => handleModelSelect(model)}>
                {model.name || model.filename}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => setShowStorePreview(!showStorePreview)}>
          {showStorePreview ? 'Hide Store Preview' : 'Show Store Preview'}
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 60 }}
          style={{ background: '#f0f0f0' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <Suspense fallback={<Loader />}>
            {showStorePreview ? (
              <>
                <OptimizedModel url="/store.glb" position={[0, 0, 0]} scale={[1, 1, 1]} />
                {models.map((model) => (
                  <OptimizedModel
                    key={model.filename}
                    url={`${BASE_URL}/uploads/${model.filename}`}
                    position={model.position}
                    rotation={model.rotation.map(deg => deg * (Math.PI / 180))}
                    scale={model.scale}
                  />
                ))}
              </>
            ) : selectedModel && (
              <OptimizedModel
                url={`${BASE_URL}/uploads/${selectedModel.filename}`}
                position={[position.x, position.y, position.z]}
                rotation={[rotation.x, rotation.y, rotation.z].map(deg => deg * (Math.PI / 180))}
                scale={[scale.x, scale.y, scale.z]}
              />
            )}
            <Environment preset="warehouse" />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default AdminPage;