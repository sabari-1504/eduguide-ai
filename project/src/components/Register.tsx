import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface RegisterProps {
  setActiveSection: (section: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setActiveSection }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [education, setEducation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !username || !password || !education) {
      setError('Please fill all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      await updateProfile(userCredential.user, { displayName: name });
      // Store extra user info in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email: username,
        highestQualification: education
      });
      setLoading(false);
      setActiveSection('login');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-extrabold mb-4 text-white">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 backdrop-blur-md"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 backdrop-blur-md"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30 backdrop-blur-md"
          required
        />
        <select
          value={education}
          onChange={e => setEducation(e.target.value)}
          className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 backdrop-blur-md"
          required
        >
          <option value="" className="text-slate-700">Select Highest Education Completed</option>
          <option value="12th" className="text-slate-900">12th</option>
          <option value="10th" className="text-slate-900">10th</option>
        </select>
        <button type="submit" className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-3 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all" disabled={loading}>
          <span className="relative z-[1]">{loading ? 'Registering...' : 'Register'}</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
        </button>
      </form>
      {error && <div className="mt-2 text-fuchsia-300 text-sm">{error}</div>}
      <button
        className="mt-4 text-cyan-300 underline"
        type="button"
        onClick={() => setActiveSection('login')}
      >
        Already have an account? Login
      </button>
    </div>
  );
};

export default Register; 