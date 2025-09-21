import React, { useState } from 'react';

interface ChooseLocationProps {
  profileDetails: any;
  setActiveSection: (section: string, state?: any) => void;
}

const districts = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Other'
];

const ChooseLocation: React.FC<ChooseLocationProps> = ({ profileDetails, setActiveSection }) => {
  const [location, setLocation] = useState(profileDetails?.district || '');
  const [customLocation, setCustomLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = location === 'Other' ? customLocation : location;
    if (!chosen) return;
    setActiveSection('recommendations', { chosenLocation: chosen });
  };

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Choose Your Preferred Location</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Select District/City</label>
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        {location === 'Other' && (
          <div>
            <label className="block mb-1 font-medium">Enter Preferred Location</label>
            <input
              type="text"
              value={customLocation}
              onChange={e => setCustomLocation(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter city, town, or region"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          See Recommendations
        </button>
      </form>
    </div>
  );
};

export default ChooseLocation; 