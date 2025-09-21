import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import collegesData from '../data/Detais of colleges.json';

const departmentMap = [
  { code: 'AD', name: 'Artificial Intelligence and Data Science' },
  { code: 'AE', name: 'Aeronautical Engineering' },
  { code: 'AG', name: 'Agriculture Engineering' },
  { code: 'AL', name: 'Artificial Intelligence and Machine Learning' },
  { code: 'AM', name: 'Applied Mathematics' },
  { code: 'AO', name: 'Apparel Technology' },
  { code: 'AP', name: 'Automobile Engineering' },
  { code: 'AR', name: 'Architecture' },
  { code: 'AS', name: 'Applied Sciences' },
  { code: 'AT', name: 'Artificial Intelligence and Machine Learning' },
  { code: 'AU', name: 'Automobile Engineering' },
  { code: 'BA', name: 'Bioinformatics' },
  { code: 'BC', name: 'Bioelectronics' },
  { code: 'BM', name: 'Biomedical Engineering' },
  { code: 'BP', name: 'Bioprocess Engineering' },
  { code: 'BS', name: 'Basic Sciences' },
  { code: 'BT', name: 'Biotechnology' },
  { code: 'BY', name: 'Bioscience and Engineering' },
  { code: 'CB', name: 'Computer and Business Systems' },
  { code: 'CD', name: 'Computer Design' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'CG', name: 'Computer Graphics and Multimedia' },
  { code: 'CH', name: 'Chemical Engineering' },
  { code: 'CI', name: 'Communication and Information Engineering' },
  { code: 'CJ', name: 'Cybersecurity and Digital Forensics' },
  { code: 'CL', name: 'Chemical Engineering' },
  { code: 'CM', name: 'Ceramic Engineering' },
  { code: 'CN', name: 'Communication Engineering' },
  { code: 'CO', name: 'Computer Engineering' },
  { code: 'CS', name: 'Computer Science and Engineering' },
  { code: 'CY', name: 'Chemistry' },
  { code: 'CZ', name: 'Computational Engineering' },
  { code: 'EA', name: 'Electronics and Automation' },
  { code: 'EC', name: 'Electronics and Communication Engineering' },
  { code: 'EE', name: 'Electrical and Electronics Engineering' },
  { code: 'EF', name: 'Electrical Engineering (Power Systems)' },
  { code: 'EI', name: 'Electronics and Instrumentation Engineering' },
  { code: 'EM', name: 'Embedded Systems' },
  { code: 'EN', name: 'Environmental Engineering' },
  { code: 'ES', name: 'Environmental Science' },
  { code: 'ET', name: 'Electronics and Telecommunication Engineering' },
  { code: 'EV', name: 'Electric Vehicle Technology' },
  { code: 'EY', name: 'Energy Engineering' },
  { code: 'FD', name: 'Food Technology' },
  { code: 'FT', name: 'Fashion Technology' },
  { code: 'FS', name: 'Forensic Science' },
  { code: 'FY', name: 'Fisheries Science' },
  { code: 'GI', name: 'Geoinformatics' },
  { code: 'IB', name: 'Industrial Biotechnology' },
  { code: 'IC', name: 'Instrumentation and Control Engineering' },
  { code: 'IE', name: 'Industrial Engineering' },
  { code: 'IM', name: 'Information Management' },
  { code: 'IN', name: 'Information Technology' },
  { code: 'IS', name: 'Information Science' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'IY', name: 'Industrial Safety Engineering' },
  { code: 'LE', name: 'Leather Technology' },
  { code: 'MA', name: 'Mathematics' },
  { code: 'MC', name: 'Mechatronics Engineering' },
  { code: 'MD', name: 'Medical Electronics' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'MF', name: 'Manufacturing Engineering' },
  { code: 'MG', name: 'Marine Engineering' },
  { code: 'MI', name: 'Mining Engineering' },
  { code: 'MN', name: 'Material Science' },
  { code: 'MO', name: 'Mobility Engineering' },
  { code: 'MR', name: 'Metallurgical Engineering' },
  { code: 'MS', name: 'Material Science and Engineering' },
  { code: 'MT', name: 'Mechatronics' },
  { code: 'MU', name: 'Multimedia Technology' },
  { code: 'MY', name: 'Medical Instrumentation' },
  { code: 'MZ', name: 'Metallurgy' },
  { code: 'PA', name: 'Petroleum Engineering' },
  { code: 'PC', name: 'Polymer Technology' },
  { code: 'PE', name: 'Power Electronics' },
  { code: 'PH', name: 'Physics' },
  { code: 'PM', name: 'Printing Technology' },
  { code: 'PN', name: 'Production Engineering' },
  { code: 'PP', name: 'Plastic and Polymer Engineering' },
  { code: 'PR', name: 'Production Engineering' },
  { code: 'PS', name: 'Pharmaceutical Science' },
  { code: 'RA', name: 'Robotics and Automation' },
  { code: 'RM', name: 'Rubber and Plastics Technology' },
  { code: 'RP', name: 'Robotics and Product Design' },
  { code: 'SB', name: 'Software and Business Systems' },
  { code: 'SC', name: 'Software Engineering' },
  { code: 'SE', name: 'Structural Engineering' },
  { code: 'SF', name: 'Safety and Fire Engineering' },
  { code: 'TC', name: 'Textile Chemistry' },
  { code: 'TS', name: 'Textile Science' },
  { code: 'TX', name: 'Textile Technology' },
  { code: 'TT', name: 'Textile Engineering' },
  { code: 'XC', name: 'Cross-Disciplinary / Custom Programs' },
  { code: 'XM', name: 'Mathematical Computing / Data Analytics' },
  { code: 'XS', name: 'Special Category / Interdisciplinary Studies' },
];

const FilterPage: React.FC = () => {
  const navigate = useNavigate();
  const [district, setDistrict] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentError, setDepartmentError] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [transport, setTransport] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDepartmentCheckbox = (code: string) => {
    if (departments.includes(code)) {
      setDepartments(departments.filter(dep => dep !== code));
      setDepartmentError('');
    } else {
      if (departments.length >= 3) {
        setDepartmentError('You can select up to 3 departments only.');
        return;
      }
      setDepartments([...departments, code]);
      setDepartmentError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (departments.length > 3) {
      setDepartmentError('You can select up to 3 departments only.');
      return;
    }
    navigate('/filter-results', {
      state: {
        district,
        departments,
        accommodation,
        transport,
      },
    });
  };

  const districts = useMemo(() => {
    const set = new Set<string>();
    (Array.isArray(collegesData) ? collegesData : []).forEach((c: any) => {
      if (c["District"]) set.add(c["District"]);
    });
    return Array.from(set).sort();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} onSubmit={handleSubmit} className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-lg text-white">
        <h2 className="text-2xl font-extrabold mb-6 text-center"><span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Filter Colleges</span></h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-slate-300">District</label>
          <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30">
            <option value="" className="text-slate-800">Select District</option>
            {districts.map(d => (
              <option key={d} value={d} className="text-slate-900">{d}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 relative" ref={dropdownRef}>
          <label className="block mb-1 font-semibold text-slate-300">Department (max 3)</label>
          <button
            type="button"
            className="group relative overflow-hidden w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="relative z-[1]">{departments.length === 0 ? 'Select Departments' : departments.map(code => departmentMap.find(dep => dep.code === code)?.name).join(', ')}</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 bg-white/10 text-white border border-white/10 rounded-xl shadow-2xl mt-2 w-full max-h-60 overflow-y-auto backdrop-blur-md">
              {departmentMap.map(dep => (
                <label key={dep.code} className="flex items-center px-4 py-2 hover:bg-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={departments.includes(dep.code)}
                    onChange={() => handleDepartmentCheckbox(dep.code)}
                    disabled={!departments.includes(dep.code) && departments.length >= 3}
                    className="mr-2 accent-fuchsia-500"
                  />
                  {dep.name}
                </label>
              ))}
            </div>
          )}
          {departmentError && <div className="text-fuchsia-300 text-xs mt-1">{departmentError}</div>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-slate-300">Accommodation Available</label>
          <select value={accommodation} onChange={e => setAccommodation(e.target.value)} className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30">
            <option value="" className="text-slate-800">Select</option>
            <option value="Yes" className="text-slate-900">Yes</option>
            <option value="No" className="text-slate-900">No</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-slate-300">Transport Facility</label>
          <select value={transport} onChange={e => setTransport(e.target.value)} className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30">
            <option value="" className="text-slate-800">Select</option>
            <option value="Yes" className="text-slate-900">Yes</option>
            <option value="No" className="text-slate-900">No</option>
          </select>
        </div>
        <button type="submit" className="group relative overflow-hidden w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-3 rounded-full font-semibold hover:shadow-[0_0_24px_rgba(217,70,239,0.5)] transition-all">
          <span className="relative z-[1]">Next</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
        </button>
      </motion.form>
    </div>
  );
};

export default FilterPage; 