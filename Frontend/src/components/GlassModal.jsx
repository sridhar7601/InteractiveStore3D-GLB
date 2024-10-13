import React from 'react';

function GlassModal({ onClose, children, model, onAddToCart }) {
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
      <button
        onClick={() => onAddToCart(model)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#086C62',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default GlassModal;