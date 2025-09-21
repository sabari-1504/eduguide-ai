import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import collegesData from '../data/Detais of colleges.json';

const departmentMap = [
  { code: 'AD', name: 'Artificial Intelligence and Data Science' },
  { code: 'AE', name: 'Aeronautical Engineering' },
  // ... (same as in FilterPage, add all department codes/names)
  { code: 'XC', name: 'Cross-Disciplinary / Custom Programs' },
  { code: 'XM', name: 'Mathematical Computing / Data Analytics' },
  { code: 'XS', name: 'Special Category / Interdisciplinary Studies' },
];

const FilterResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filters = location.state || {};
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  const filteredColleges = useMemo(() => {
    let list = Array.isArray(collegesData) ? collegesData : [];
    if (filters.district) {
      list = list.filter((c: any) => c["District"] === filters.district);
    }
    if (filters.departments && Array.isArray(filters.departments) && filters.departments.length > 0) {
      list = list.filter((college: any) => {
        return filters.departments.some((dept: string) => {
          const branch = college[`Branch Code ${dept}`];
          return branch && branch.trim() !== '';
        });
      });
    }
    if (filters.accommodation) {
      list = list.filter((c: any) => {
        if (filters.accommodation === 'Yes') return c["Mess Type"] && c["Mess Type"].toLowerCase() !== 'no';
        if (filters.accommodation === 'No') return !c["Mess Type"] || c["Mess Type"].toLowerCase() === 'no';
        return true;
      });
    }
    if (filters.transport) {
      list = list.filter((c: any) => {
        if (filters.transport === 'Yes') return c["Transport Facility"] && c["Transport Facility"].toLowerCase() === 'yes';
        if (filters.transport === 'No') return !c["Transport Facility"] || c["Transport Facility"].toLowerCase() !== 'yes';
        return true;
      });
    }
    return list;
  }, [filters]);

  const handleChangeFilters = () => {
    navigate('/filter', { state: filters });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Filtered Colleges</h1>
        <div className="flex justify-end mb-6">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold"
            onClick={handleChangeFilters}
          >
            Change Filters
          </button>
        </div>
        {filteredColleges.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">No colleges found matching your filters.</div>
        ) : (
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
                <div className="text-xs mt-2">Departments: {Object.keys(college)
                  .filter(key => key.startsWith('Branch Code ') && college[key] && college[key].trim() !== '')
                  .map(key => {
                    const code = key.replace('Branch Code ', '');
                    const dep = departmentMap.find(d => d.code === code);
                    return dep ? dep.name : code;
                  })
                  .join(', ')}</div>
              </div>
            ))}
          </div>
        )}
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
                  {Object.keys(selectedCollege)
                    .filter(key => key.startsWith('Branch Code ') && selectedCollege[key] && selectedCollege[key].trim() !== '')
                    .map(key => {
                      const code = key.replace('Branch Code ', '');
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

export default FilterResultsPage; 