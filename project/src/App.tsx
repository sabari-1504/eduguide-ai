import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;