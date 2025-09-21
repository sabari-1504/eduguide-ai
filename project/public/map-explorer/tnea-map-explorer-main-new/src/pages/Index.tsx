import React from 'react';
import SimpleMapComponent from '@/components/SimpleMapComponent';
import { colleges, districts } from '@/data';

const getTypeCounts = (colleges) => {
  const counts = { Autonomous: 0, Private: 0, Government: 0, Aided: 0 };
  colleges.forEach(college => {
    const type = (college.type || '').toLowerCase();
    if (type.includes('autonomous')) counts.Autonomous++;
    else if (type.includes('government')) counts.Government++;
    else if (type.includes('aided')) counts.Aided++;
    else counts.Private++;
  });
  return counts;
};

const Index = () => {
  const typeCounts = getTypeCounts(colleges);
  console.log('Index: Rendering with', colleges.length, 'colleges');
  
  return (
    <div className="w-full h-screen overflow-hidden">
      <SimpleMapComponent colleges={colleges} />
    </div>
  );
};

export default Index;
