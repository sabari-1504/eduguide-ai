import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-all text-lg font-semibold"
    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
  >
    Login / Register
  </button>
);

export default FloatingButton; 