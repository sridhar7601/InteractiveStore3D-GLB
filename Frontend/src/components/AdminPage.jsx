import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import OptimizedModel from '../models/OptimizedModel';
import { CanvasLoader, DOMLoader } from '../utils/Loader';

const BASE_URL = 'https://interactivestore3d-glb-1.onrender.com';

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #bdc3c7',
  fontSize: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  transition: 'border-color 0.3s ease',
};

const buttonStyle = {
  padding: '10px 15px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background-color 0.3s ease',
  width: '100%',
  marginBottom: '10px',
};

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
  const [showStorePreview, setShowStorePreview] = useState(true);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/models`);
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoading(false);
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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setPosition({ x: model.position[0], y: model.position[1], z: model.position[2] });
    setRotation({ x: model.rotation[0], y: model.rotation[1], z: model.rotation[2] });
    setScale({ x: model.scale[0], y: model.scale[1], z: model.scale[2] });
    setDetails(model.details);
    setPrice(model.price || 0);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/models/${selectedModel.filename}`, {
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z],
        price: price,
        details: details
      });
      setSelectedModel(response.data.model);
      setIsEditing(false);
      fetchModels();
      alert('Model updated successfully!');
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Error updating model. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedModel(null);
    setModelName('');
    setSelectedFile(null);
    setPosition({ x: 0, y: 0, z: 0 });
    setRotation({ x: 0, y: 0, z: 0 });
    setScale({ x: 1, y: 1, z: 1 });
    setDetails('');
    setPrice(0);
    setIsEditing(false);
    setShowStorePreview(false);
  };

  const resetForm = () => {
    setModelName('');
    setSelectedFile(null);
    setPosition({ x: 0, y: 0, z: 0 });
    setRotation({ x: 0, y: 0, z: 0 });
    setScale({ x: 1, y: 1, z: 1 });
    setDetails('');
    setPrice(0);
  };

  const handleChange = (setter) => (e) => {
    setter(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) }));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ background: '#f0f0f0', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={<CanvasLoader />}>
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

      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        top: '20px',
        left: '20px',
        width: '300px',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '20px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ marginBottom: '20px', color: '#3498db' }}>Admin Panel</h2>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Model Name"
          style={inputStyle}
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          placeholder="Price"
          style={inputStyle}
        />
        <input 
          type="file" 
          onChange={handleFileSelect} 
          accept=".glb" 
          style={{ ...inputStyle, padding: '10px 0' }} 
        />
        {['position', 'rotation', 'scale'].map(prop => (
          <div key={prop} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#bdc3c7' }}>
              {prop.charAt(0).toUpperCase() + prop.slice(1)}:
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {['x', 'y', 'z'].map(axis => (
                <input
                  key={axis}
                  type="number"
                  name={axis}
                  value={eval(prop)[axis]}
                  onChange={handleChange(eval(`set${prop.charAt(0).toUpperCase() + prop.slice(1)}`))}
                  placeholder={axis.toUpperCase()}
                  style={{ ...inputStyle, width: '30%', marginBottom: 0 }}
                />
              ))}
            </div>
          </div>
        ))}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Enter model details"
          style={{
            ...inputStyle,
            height: '120px',
            resize: 'vertical',
            padding: '20px',
            width: '90%',         
            marginBottom: '20px',
          }}
        />
        {!selectedModel ? (
          <button onClick={handleUpload} disabled={!modelName.trim() || !selectedFile} style={buttonStyle}>
            Upload Model
          </button>
        ) : (
          <button onClick={handleUpdate} style={buttonStyle}>
            Update Model
          </button>
        )}
        <button 
          onClick={clearForm}
          style={{
            ...buttonStyle,
            backgroundColor: '#e74c3c',
          }}
        >
          Clear
        </button>
        <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#3498db' }}>Uploaded Models</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
          {models.map((model) => (
            <li key={model.filename} style={{ marginBottom: '5px' }}>
              <button 
                onClick={() => handleModelSelect(model)}
                style={{
                  ...buttonStyle,
                  backgroundColor: selectedModel && selectedModel.filename === model.filename ? '#27ae60' : '#2980b9',
                  marginBottom: '5px',
                }}
              >
                {model.name || model.filename}
              </button>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => setShowStorePreview(!showStorePreview)}
          style={{
            ...buttonStyle,
            backgroundColor: '#f39c12',
          }}
        >
          {showStorePreview ? 'Hide Store Preview' : 'Show Store Preview'}
        </button>
      </div>
      {isLoading && <DOMLoader />}
    </div>
  );
}

export default AdminPage;