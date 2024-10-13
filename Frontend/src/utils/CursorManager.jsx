import { useEffect } from 'react';

function CursorManager({ isHovering }) {
  useEffect(() => {
    document.body.style.cursor = isHovering ? 'pointer' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isHovering]);
  return null;
}

export default CursorManager;