import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, position, scale }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} />;
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
  const [details, setDetails] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/models');
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
    formData.append('position', JSON.stringify([position.x, position.y, position.z]));
    formData.append('scale', JSON.stringify([scale.x, scale.y, scale.z]));
    formData.append('details', details);

    try {
      await axios.post('http://localhost:3000/upload', formData, {
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
    setScale({ x: model.scale[0], y: model.scale[1], z: model.scale[2] });
    setDetails(model.details);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/models/${selectedModel.filename}`, {
        position: [position.x, position.y, position.z],
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
    setScale({ x: 1, y: 1, z: 1 });
    setDetails('');
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
              onChange={(e) => setPosition({ ...position, x: parseFloat(e.target.value) })}
              placeholder="X"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={position.y}
              onChange={(e) => setPosition({ ...position, y: parseFloat(e.target.value) })}
              placeholder="Y"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={position.z}
              onChange={(e) => setPosition({ ...position, z: parseFloat(e.target.value) })}
              placeholder="Z"
              style={{ width: '50px' }}
            />
          </div>
          <div>
            <label>Scale:</label>
            <input
              type="number"
              value={scale.x}
              onChange={(e) => setScale({ ...scale, x: parseFloat(e.target.value) })}
              placeholder="X"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={scale.y}
              onChange={(e) => setScale({ ...scale, y: parseFloat(e.target.value) })}
              placeholder="Y"
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="number"
              value={scale.z}
              onChange={(e) => setScale({ ...scale, z: parseFloat(e.target.value) })}
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
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedModel ? (
          <>
            <Canvas
              camera={{ position: [0, 0, 5] }}
              style={{ background: '#f0f0f0', flex: 1 }}
            >
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
              <Suspense fallback={<Loader />}>
                <Model 
                  url={`http://localhost:3000/uploads/${selectedModel.filename}`} 
                  position={[position.x, position.y, position.z]} 
                  scale={[scale.x, scale.y, scale.z]} 
                />
                <Environment preset="sunset" background />
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
            <div style={{ padding: '20px', background: '#f0f0f0', color:'grey'}}>
              <h3>Model Details</h3>
              <p><strong>Name:</strong> {selectedModel.name}</p>
              <p><strong>Position:</strong> X: {position.x}, Y: {position.y}, Z: {position.z}</p>
              <p><strong>Scale:</strong> X: {scale.x}, Y: {scale.y}, Z: {scale.z}</p>
              <p><strong>Details:</strong> {details}</p>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Select a model to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;