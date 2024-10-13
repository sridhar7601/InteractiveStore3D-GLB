import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';

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

export default App;