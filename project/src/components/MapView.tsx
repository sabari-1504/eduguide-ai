
import React from 'react';

const MapView: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/map-explorer/index.html"
        title="TNEA Map Explorer"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default MapView; 