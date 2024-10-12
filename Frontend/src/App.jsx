import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import UserPage from './UserPage';
import AdminPage from './Adminpage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const navigate = useNavigate();

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

export default App;
