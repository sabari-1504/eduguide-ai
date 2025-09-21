import React from 'react';
import { motion } from 'framer-motion';

interface EngineeringStreamsProps {
  onSelect: (stream: string) => void;
}

const EngineeringStreams: React.FC<EngineeringStreamsProps> = ({ onSelect }) => {
  const streams = [
    {
      id: 'cse',
      name: 'Computer Science Engineering',
      description: 'Learn about software development, algorithms, and computer systems',
      videoPath: '/videos/1.mp4'
    },
    {
      id: 'ece',
      name: 'Electronics & Communication Engineering',
      description: 'Explore electronics, communication systems, and signal processing',
      videoPath: '/videos/2.mp4'
    },
    {
      id: 'mechanical',
      name: 'Mechanical Engineering',
      description: 'Learn about machines, manufacturing, and mechanical systems',
      videoPath: '/videos/3.mp4'
    },
    {
      id: 'eee',
      name: 'Electrical & Electronics Engineering',
      description: 'Study electrical systems, power electronics, and control systems',
      videoPath: '/videos/4.mp4'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Engineering Stream</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {streams.map((stream) => (
          <motion.div
            key={stream.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="aspect-video">
              <video
                src={stream.videoPath}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{stream.name}</h3>
              <p className="text-gray-600 mb-4">{stream.description}</p>
              <button
                onClick={() => onSelect(stream.id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select {stream.name}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EngineeringStreams; 