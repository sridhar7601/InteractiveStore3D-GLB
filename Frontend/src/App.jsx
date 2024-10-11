import React, { useState } from 'react';
import UserPage from './UserPage';
import AdminPage from './Adminpage';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsAdmin(!isAdmin)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '10px',
          background: '#086C62',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Switch to {isAdmin ? 'User' : 'Admin'} View
      </button>
      {isAdmin ? <AdminPage /> : <UserPage />}
    </div>
  );
}

export default App;