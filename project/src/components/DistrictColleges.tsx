import React from 'react';
import detailsOfColleges from "../data/Detais of colleges.json";
import { Link } from 'react-router-dom';

interface College {
  CollegeName: string;
  Principal?: string;
  Address?: string;
  Website?: string;
  District?: string;
  Pincode?: string;
  DepartmentsOffered?: string;
  [key: string]: any;
}

interface DistrictCollegesProps {
  district: string;
}

const placeholderImg = 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80';

const DistrictColleges: React.FC<DistrictCollegesProps> = ({ district }) => {
  const colleges: College[] = (detailsOfColleges as any[]).filter(
    (c: any) => c["District"] && c["District"].trim().toLowerCase() === district.trim().toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Engineering Colleges in {district}
          </h1>
          <p className="text-xl text-gray-600">
            Explore top engineering colleges in your district
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {colleges.length > 0 ? colleges.map((college, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow border border-gray-100"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                <Link
                  to={`/college/${encodeURIComponent(college.CollegeName)}`}
                  className="hover:underline cursor-pointer"
                >
                  {college.CollegeName}
                </Link>
              </h3>
              {college.Address && (
                <div className="text-gray-700 mb-1">{college.Address}</div>
              )}
              {college.District && (
                <div className="text-gray-500 text-sm mb-1">District: {college.District}</div>
              )}
              {college.Pincode && (
                <div className="text-gray-500 text-sm mb-1">Pincode: {college.Pincode}</div>
              )}
              {college.DepartmentsOffered && (
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-semibold">Departments:</span> {college.DepartmentsOffered}
                </div>
              )}
              {college.Website && (
                <a
                  href={college.Website.startsWith('http') ? college.Website : `https://${college.Website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm mt-2"
                >
                  {college.Website}
                </a>
              )}
            </div>
          )) : (
            <div className="col-span-full text-center text-gray-500">No colleges found for this district.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistrictColleges; 