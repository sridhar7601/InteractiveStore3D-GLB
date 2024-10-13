import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const buttonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    padding: '10px',
    background: '#086C62',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px'
  };

  return (
    <div>
      <button
        onClick={() => navigate('/user')}
        style={buttonStyle}
      >
        Go to User View
      </button>

      <button
        onClick={() => navigate('/admin')}
        style={buttonStyle}
      >
        Go to Admin View
      </button>
    </div>
  );
}

export default Home;