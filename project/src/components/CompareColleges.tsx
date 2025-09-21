import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import collegesData from '../data/Detais of colleges.json';
import { MapPin, Globe, Building2, Train, Users, Home, ListChecks } from 'lucide-react';

const getCollegeOptions = () => {
  if (!Array.isArray(collegesData)) return [];
  return collegesData.map((c: any) => c["College Name"]).filter(Boolean).sort();
};

const getCollegeByName = (name: string) => {
  if (!Array.isArray(collegesData)) return null;
  return collegesData.find((c: any) => c["College Name"] === name) || null;
};

const fields = [
  { label: 'College Name', key: 'College Name', icon: <Building2 className="inline w-4 h-4 mr-1 text-cyan-400" /> },
  { label: 'Address', key: 'Address', icon: <MapPin className="inline w-4 h-4 mr-1 text-emerald-400" /> },
  { label: 'District', key: 'District', icon: <Home className="inline w-4 h-4 mr-1 text-violet-400" /> },
  { label: 'Pincode', key: 'Pincode', icon: <ListChecks className="inline w-4 h-4 mr-1 text-slate-300" /> },
  { label: 'Website', key: 'Website', icon: <Globe className="inline w-4 h-4 mr-1 text-cyan-300" /> },
  { label: 'Mess Type', key: 'Mess Type', icon: <Users className="inline w-4 h-4 mr-1 text-amber-300" /> },
  { label: 'Transport Facility', key: 'Transport Facility', icon: <Train className="inline w-4 h-4 mr-1 text-fuchsia-400" /> },
  { label: 'Nearest Railway Station', key: 'Nearest Railway Station', icon: <Train className="inline w-4 h-4 mr-1 text-fuchsia-400" /> },
  { label: 'Departments', key: 'departments', icon: <ListChecks className="inline w-4 h-4 mr-1 text-indigo-300" /> },
];

const CompareColleges: React.FC = () => {
  const options = useMemo(getCollegeOptions, []);
  const [college1, setCollege1] = useState('');
  const [college2, setCollege2] = useState('');

  const data1 = college1 ? getCollegeByName(college1) : null;
  const data2 = college2 ? getCollegeByName(college2) : null;

  const getDepartments = (college: any) => {
    if (!college) return '';
    return Object.keys(college)
      .filter(key => key.startsWith('Branch Code ') && college[key] && college[key].trim() !== '')
      .map(key => key.replace('Branch Code ', ''))
      .join(', ');
  };

  // Highlight differences
  const isDifferent = (field: any) => {
    if (!data1 || !data2) return false;
    if (field.key === 'departments') return getDepartments(data1) !== getDepartments(data2);
    return (data1[field.key] || '-') !== (data2[field.key] || '-');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-950 p-8">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-6xl mx-auto bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-extrabold mb-8 text-center">
          <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Compare Colleges</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-slate-300">Select College 1</label>
            <div className="relative">
              <select value={college1} onChange={e => setCollege1(e.target.value)} className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30">
                <option value="" className="text-slate-800">Choose a college</option>
                {options.map(name => (
                  <option key={name} value={name} className="text-slate-900">{name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-slate-300">Select College 2</label>
            <div className="relative">
              <select value={college2} onChange={e => setCollege2(e.target.value)} className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30">
                <option value="" className="text-slate-800">Choose a college</option>
                {options.map(name => (
                  <option key={name} value={name} className="text-slate-900">{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {(data1 || data2) && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-white/10 rounded-lg bg-white/5 backdrop-blur-md">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white">
                  <th className="p-4 border-b border-white/10 text-left text-lg font-bold">Field</th>
                  <th className="p-4 border-b border-white/10 text-left text-lg font-bold">{data1 ? data1["College Name"] : '-'}</th>
                  <th className="p-4 border-b border-white/10 text-left text-lg font-bold">{data2 ? data2["College Name"] : '-'}</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, idx) => {
                  const val1 = field.key === 'departments' ? getDepartments(data1) : data1 ? data1[field.key] || '-' : '-';
                  const val2 = field.key === 'departments' ? getDepartments(data2) : data2 ? data2[field.key] || '-' : '-';
                  const diff = isDifferent(field);
                  return (
                    <tr key={field.key} className={`transition-colors ${idx % 2 === 0 ? 'bg-white/0' : 'bg-white/5'} hover:bg-white/10`}>
                      <td className="p-4 border-b border-white/10 font-semibold text-slate-200 flex items-center gap-2">{field.icon}{field.label}</td>
                      <td className={`p-4 border-b border-white/10 ${diff ? 'bg-amber-400/10 text-amber-200 font-bold' : 'text-slate-200'}`}>{field.key === 'Website' && val1 && val1 !== '-' ? <a href={`https://${val1}`} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline hover:text-white transition-colors">{val1}</a> : val1}</td>
                      <td className={`p-4 border-b border-white/10 ${diff ? 'bg-amber-400/10 text-amber-200 font-bold' : 'text-slate-200'}`}>{field.key === 'Website' && val2 && val2 !== '-' ? <a href={`https://${val2}`} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline hover:text-white transition-colors">{val2}</a> : val2}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompareColleges; 