import React, { useState, useMemo } from 'react';
import collegesData from '../data/Detais of colleges.json';

const branchCodes = [
  'AD','AE','AG','AL','AM','AO','AP','AR','AS','AT','AU','BA','BC','BM','BP','BS','BT','BY','CB','CD','CE','CG','CH','CI','CJ','CL','CM','CN','CO','CS','CY','CZ','EA','EC','EE','EF','EI','EM','EN','ES','ET','EV','EY','FD','FT','FS','FY','GI','IB','IC','IE','IM','IN','IS','IT','IY','LE','MA','MC','MD','ME','MF','MG','MI','MN','MO','MR','MS','MT','MU','MY','MZ','PA','PC','PE','PH','PM','PN','PP','PR','PS','RA','RM','RP','SB','SC','SE','SF','TC','TS','TX','TT','XC','XM','XS'
];

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

const generalFields = [
  { label: 'Address', key: 'Address' },
  { label: 'Principal', key: 'Principal' },
  { label: 'District', key: 'District' },
  { label: 'Pincode', key: 'Pincode' },
  { label: 'Email', key: 'Email ID' },
  { label: 'Website', key: 'Website' },
  { label: 'Phone', key: 'Phone' },
  { label: 'Mobile', key: 'Mobile' },
  { label: 'CodeTag', key: 'CodeTag' },
];

const SearchReport: React.FC = () => {
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<any | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Ensure collegesData is always an array
  const safeCollegesData = Array.isArray(collegesData) ? collegesData : [];
  const allColleges = useMemo(() => safeCollegesData, []);

  // For district dropdown, get unique districts from the new data
  const districts = useMemo(() => {
    const set = new Set<string>();
    safeCollegesData.forEach((c: any) => {
      if (c["District"]) set.add(c["District"]);
    });
    return Array.from(set).sort();
  }, []);

  const filteredColleges = useMemo(() => {
    let list = allColleges;
    if (district) {
      list = list.filter((c: any) => c["District"] === district);
    }
    if (search.trim()) {
      list = list.filter((c: any) => c["College Name"]?.toLowerCase().includes(search.trim().toLowerCase()));
    }
    if (selectedDepartments.length > 0) {
      list = list.filter((college: any) =>
        selectedDepartments.some(code => {
          const branch = college[`Branch Code ${code}`];
          return branch && branch.trim() !== '';
        })
      );
    }
    return list;
  }, [search, district, allColleges, selectedDepartments]);

  const handleDepartmentChange = (code: string) => {
    setSelectedDepartments(prev =>
      prev.includes(code) ? prev.filter(d => d !== code) : [...prev, code]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Search Colleges</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="text"
            placeholder="Search by college name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          />
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          >
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        {/* Department Filter */}
        <div className="bg-white rounded-xl shadow p-4 mb-8">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">Filter by Departments</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {departmentMap.map(dep => (
              <label key={dep.code} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(dep.code)}
                  onChange={() => handleDepartmentChange(dep.code)}
                  className="accent-blue-600"
                />
                <span className="font-mono font-bold">[{dep.code}]</span> <span>{dep.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college: any, idx: number) => (
            <div
              key={college["College Name"] + idx}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              onClick={() => setSelectedCollege(college)}
            >
              <h3 className="text-lg font-bold text-blue-800 mb-2">{college["College Name"]}</h3>
              <div className="text-gray-600 text-sm mb-1">{college["Address"]}</div>
              <div className="text-gray-500 text-xs mb-1">District: {college["District"]}</div>
              <div className="text-gray-500 text-xs mb-1">Pincode: {college["Pincode"]}</div>
              <div className="text-blue-600 text-xs truncate">{college["Website"]}</div>
            </div>
          ))}
        </div>
        {/* Modal for college details */}
        {selectedCollege && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                onClick={() => setSelectedCollege(null)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{selectedCollege["College Name"]}</h2>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div className="text-gray-700 font-semibold flex items-center gap-2 mb-2 md:mb-0">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">{selectedCollege["District"]}</span>
                </div>
                <div className="flex flex-col md:items-end text-sm text-gray-600">
                  <div><span className="font-semibold">Address:</span> {selectedCollege["Address"]}</div>
                  <div><span className="font-semibold">Website:</span> <a href={`https://${selectedCollege["Website"]}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Visit Website</a></div>
                </div>
              </div>
              {/* College Info & Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">College Information</h3>
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg mb-2">
                    <tbody>
                      <tr><td className="font-semibold p-2 border-b w-1/3">Type:</td><td className="p-2 border-b">-</td></tr>
                      <tr><td className="font-semibold p-2 border-b w-1/3">Ao University:</td><td className="p-2 border-b">-</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg mb-2">
                    <tbody>
                      <tr><td className="font-semibold p-2 border-b w-1/3">Address:</td><td className="p-2 border-b">{selectedCollege["Address"]}</td></tr>
                      <tr><td className="font-semibold p-2 border-b w-1/3">Website:</td><td className="p-2 border-b"><a href={`https://${selectedCollege["Website"]}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedCollege["Website"]}</a></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Departments Table */}
              <h3 className="font-semibold mb-2">Departments</h3>
              <table className="w-full text-xs md:text-sm text-left text-gray-700 border border-gray-200 rounded-lg mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border-b">Branch Code</th>
                    <th className="p-2 border-b">Department Name</th>
                    <th className="p-2 border-b">Approved Intake</th>
                    <th className="p-2 border-b">Year of Starting</th>
                    <th className="p-2 border-b">NBA Accredited</th>
                    <th className="p-2 border-b">Accreditation Valid Upto</th>
                  </tr>
                </thead>
                <tbody>
                  {branchCodes.map(code => {
                    const branch = selectedCollege[`Branch Code ${code}`];
                    if (!branch || branch.trim() === "") return null;
                    const depName = (departmentMap.find(d => d.code === code)?.name) || code;
                    return (
                      <tr key={code}>
                        <td className="p-2 border-b">{code}</td>
                        <td className="p-2 border-b">{depName}</td>
                        <td className="p-2 border-b">{selectedCollege[`Approved Intake ${code}`] || '-'}</td>
                        <td className="p-2 border-b">{selectedCollege[`Year of Starting of Course ${code}`] || '-'}</td>
                        <td className="p-2 border-b">{selectedCollege[`NBA Accredited ${code}`] || '-'}</td>
                        <td className="p-2 border-b">{selectedCollege[`Accreditation Valid Upto ${code}`] || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Additional Information Table */}
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <table className="w-full text-xs md:text-sm text-left text-gray-700 border border-gray-200 rounded-lg mb-2">
                <tbody>
                  {[
                    { label: 'Rental Type', key: 'Rental Type' },
                    { label: 'Mess Type', key: 'Mess Type' },
                    { label: 'Mess Bill', key: 'Mess Bill' },
                    { label: 'Room Rent', key: 'Room Rent' },
                    { label: 'Electricity Charges', key: 'Electricity Charges' },
                    { label: 'Caution Deposit', key: 'Caution Deposit' },
                    { label: 'Establishment Charges', key: 'Establishment Charges' },
                    { label: 'Admission Fees', key: 'Admission Fees' },
                    { label: 'Transport Facility', key: 'Transport Facility' },
                    { label: 'Min Transport Charges', key: 'Min Transport Charges' },
                    { label: 'Max Transport Charges', key: 'Max Transport Charges' },
                    { label: 'Branch Code', key: 'Branch Code' },
                    { label: 'Nearest Railway Station', key: 'Nearest Railway Station' },
                    { label: 'Distance from Station', key: 'Distance from Station' },
                  ].map(field => (
                    <tr key={field.key}>
                      <td className="font-semibold p-2 border-b w-1/3">{field.label}</td>
                      <td className="p-2 border-b">{selectedCollege[field.key] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchReport; 