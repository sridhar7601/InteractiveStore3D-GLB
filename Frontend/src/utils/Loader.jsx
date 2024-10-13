import React from 'react';
import { Html } from '@react-three/drei';

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: '1.5em' }}>Loading...</div>
    </Html>
  );
}

export default Loader;