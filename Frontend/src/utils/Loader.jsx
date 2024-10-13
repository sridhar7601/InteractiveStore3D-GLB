import React from 'react';
import { Html } from '@react-three/drei';

const LoaderContent = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '20px',
    borderRadius: '10px',
  }}>
    <div style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
    }} />
    <div style={{ color: 'white', fontSize: '1.2em', marginTop: '10px' }}>Loading...</div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export const CanvasLoader = () => (
  <Html center>
    <LoaderContent />
  </Html>
);

export const DOMLoader = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }}>
    <LoaderContent />
  </div>
);

// Add a default export that includes both loaders
export default {
  CanvasLoader,
  DOMLoader
};