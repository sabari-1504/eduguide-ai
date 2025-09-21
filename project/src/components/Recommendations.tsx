import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import detailsOfColleges from "../data/Detais of colleges.json";

interface RecommendationsProps {
  profileDetails: any;
  chosenLocation?: string;
  setActiveSection: (section: string, state?: any) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ profileDetails, chosenLocation, setActiveSection }) => {
  const [sortedColleges, setSortedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileDetails || !chosenLocation) return;
    setLoading(true);
    const districtKey = chosenLocation.toUpperCase();
    // Filter the flat array for colleges in the chosen district
    const colleges = (detailsOfColleges as any[]).filter(
      (c: any) => c["District"] && c["District"].trim().toUpperCase() === districtKey
    );
    // Build keyword list from preferred course and psychometric result
    const keywords: string[] = [];
    if (profileDetails.preferredCourse) {
      keywords.push(...profileDetails.preferredCourse.toLowerCase().split(/\s|,|-/g).filter(Boolean));
    }
    if (profileDetails.psychometricType) {
      // Example: map L/R/B to keywords (customize as needed)
      if (profileDetails.psychometricType === 'L') keywords.push('mechanical', 'civil', 'electrical');
      if (profileDetails.psychometricType === 'R') keywords.push('computer', 'it', 'electronics');
      if (profileDetails.psychometricType === 'B') keywords.push('engineering', 'technology');
    }
    // Always add 'engineering' as a fallback keyword
    keywords.push('engineering');
    // Score each college by keyword matches
    const scored = colleges.map((college: any) => {
      const name = college.CollegeName.toLowerCase();
      let score = 0;
      keywords.forEach(kw => {
        if (name.includes(kw)) score++;
      });
      return { ...college, _score: score };
    });
    // Sort by score (descending)
    scored.sort((a: any, b: any) => b._score - a._score);
    setSortedColleges(scored);
    setTimeout(() => setLoading(false), 1000);
  }, [profileDetails, chosenLocation]);

  if (!profileDetails || !chosenLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Missing Data</h2>
          <p>Please complete your profile and select a district to see recommendations.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <h2 className="text-2xl font-bold mb-2">Finding Colleges in {chosenLocation}</h2>
          <p className="text-gray-600">Searching for the best matches for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Best Engineering Colleges in {chosenLocation}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {sortedColleges.length > 0
              ? `Here are the best matches for your profile in ${chosenLocation}`
              : `No colleges found in ${chosenLocation}.`}
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedColleges.map((college, idx) => (
            <motion.div
              key={college.CodeTag || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-6 ${college._score > 0 ? 'border-2 border-green-400' : ''}`}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-blue-700">{college.CollegeName}</h3>
                {college._score > 0 && <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold ml-2">Top Match</span>}
              </div>
              <div className="mb-2 text-gray-700">Principal: {college.Principal}</div>
              <div className="mb-2 text-gray-700">Address: {college.Address}</div>
              <div className="mb-2 text-gray-700">District: {college.District}</div>
              <div className="mb-2 text-gray-700">Pincode: {college.Pincode}</div>
              <div className="mb-2 text-gray-700">Phone: {college.Phone}</div>
              <div className="mb-2 text-gray-700">Email: {college.Email}</div>
              <div className="mb-2 text-gray-700">Website: <a href={college.Website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{college.Website}</a></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;