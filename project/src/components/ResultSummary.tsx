import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ResultSummary: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center text-white">
      <h2 className="text-3xl font-extrabold mb-4">Your Results Are Ready</h2>
      <p className="text-slate-300 mb-6">
        This is your result based on the test. You can also explore our app and search colleges based on your preferences.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          to="/"
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold"
        >
          <span className="relative z-[1]">Home</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
        </Link>
        <button
          className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold"
          onClick={() => navigate(-1)}
        >
          <span className="relative z-[1]">Back</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
        </button>
      </div>
    </div>
  );
};

export default ResultSummary;





