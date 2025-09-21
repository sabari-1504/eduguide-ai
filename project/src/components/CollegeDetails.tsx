import React from 'react';
import { useParams } from 'react-router-dom';
import collegeData from '../data/Detais of colleges.json';

const branchCodes = [
  'AD','AE','AG','AL','AM','AO','AP','AR','AS','AT','AU','BA','BC','BM','BP','BS','BT','BY','CB','CD','CE','CG','CH','CI','CJ','CL','CM','CN','CO','CS','CY','CZ','EA','EC','EE','EF','EI','EM','EN','ES','ET','EV','EY','FD','FT','FS','FY','GI','IB','IC','IE','IM','IN','IS','IT','IY','LE','MA','MC','MD','ME','MF','MG','MI','MN','MO','MR','MS','MT','MU','MY','MZ','PA','PC','PE','PH','PM','PN','PP','PR','PS','RA','RM','RP','SB','SC','SE','SF','TC','TS','TX','TT','XC','XM','XS'
];

const generalFields = [
  { label: 'Total Intake', key: 'Total Intake' },
  { label: 'Address', key: 'Address' },
  { label: 'Taluk', key: 'Taluk' },
  { label: 'District', key: 'District' },
  { label: 'Pincode', key: 'Pincode' },
  { label: 'Email ID', key: 'Email ID' },
  { label: 'Website', key: 'Website' },
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
];

const CollegeDetails: React.FC = () => {
  const { collegeName } = useParams<{ collegeName: string }>();
  const decodedName = collegeName ? decodeURIComponent(collegeName) : '';
  // @ts-ignore
  const college = Array.isArray(collegeData)
    ? collegeData.find((c) => c['College Name'] === decodedName)
    : null;

  if (!college) return <div className="p-8 text-center text-red-600">College not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-4">{college['College Name']}</h1>
      <div className="mb-8">
        <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg mb-4">
          <tbody>
            {generalFields.map(field => (
              <tr key={field.key}>
                <td className="font-semibold p-2 border-b w-1/3">{field.label}</td>
                <td className="p-2 border-b">{college[field.key] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Departments</h2>
      <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="p-2 border-b">Branch Code</th>
            <th className="p-2 border-b">Approved Intake</th>
            <th className="p-2 border-b">Year of Starting</th>
            <th className="p-2 border-b">NBA Accredited</th>
            <th className="p-2 border-b">Accreditation Valid Upto</th>
          </tr>
        </thead>
        <tbody>
          {branchCodes.map(code => {
            const intake = Number(college[`Approved Intake ${code}`] || 0);
            if (!intake || intake <= 0) return null;
            const branch = college[`Branch Code ${code}`] || code;
            const year = college[`Year of Starting of Course ${code}`] || '';
            const nba = college[`NBA Accredited ${code}`] || '';
            const validUpto = college[`Accreditation Valid Upto ${code}`] || '';
            return (
              <tr key={code}>
                <td className="p-2 border-b">{branch}</td>
                <td className="p-2 border-b">{intake}</td>
                <td className="p-2 border-b">{year}</td>
                <td className="p-2 border-b">{nba}</td>
                <td className="p-2 border-b">{validUpto}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeDetails; 