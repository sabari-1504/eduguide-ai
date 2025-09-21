import React, { useState } from 'react';

interface AcademicDetailsFormData {
  stream: 'PCM' | 'PCB' | 'Commerce';
  marks: number;
  board: 'CBSE' | 'Tamil Nadu State Board' | 'ICSE' | 'Other';
  year: number;
  district: string;
}

const districts = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

const AcademicDetailsForm: React.FC = () => {
  const [form, setForm] = useState<AcademicDetailsFormData>({
    stream: 'PCM',
    marks: 0,
    board: 'CBSE',
    year: 2023,
    district: ''
  });

  const handleChange = <K extends keyof AcademicDetailsFormData>(key: K, value: AcademicDetailsFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md space-y-4">
      <div>
        <label className="block mb-1 font-medium">Academic Stream</label>
        <select
          value={form.stream}
          onChange={e => handleChange('stream', e.target.value as AcademicDetailsFormData['stream'])}
          className="border p-2 rounded w-full"
          required
        >
          <option value="PCM">PCM</option>
          <option value="PCB">PCB</option>
          <option value="Commerce">Commerce</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Actual Marks (%)</label>
        <input
          type="number"
          value={form.marks}
          min={0}
          max={100}
          onChange={e => handleChange('marks', Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Board of Education</label>
        <select
          value={form.board}
          onChange={e => handleChange('board', e.target.value as AcademicDetailsFormData['board'])}
          className="border p-2 rounded w-full"
          required
        >
          <option value="CBSE">CBSE</option>
          <option value="Tamil Nadu State Board">Tamil Nadu State Board</option>
          <option value="ICSE">ICSE</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Year of Passing</label>
        <input
          type="number"
          value={form.year}
          min={2000}
          max={2025}
          onChange={e => handleChange('year', Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">District</label>
        <select
          value={form.district}
          onChange={e => handleChange('district', e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold">Submit</button>
    </form>
  );
};

export default AcademicDetailsForm; 