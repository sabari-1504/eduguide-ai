import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginProps {
  setActiveSection: (section: string) => void;
}

const Login: React.FC<LoginProps> = ({ setActiveSection }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, username, password);
      setLoading(false);
      setActiveSection('close'); // signal to close modal
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-extrabold mb-4 text-white">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 backdrop-blur-md"
            required
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30 backdrop-blur-md"
            required
          />
        </div>
        <button type="submit" className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white p-3 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all" disabled={loading}>
          <span className="relative z-[1]">{loading ? 'Logging in...' : 'Login'}</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
        </button>
      </form>
      {error && <div className="mt-2 text-fuchsia-300 text-sm">{error}</div>}
      <button
        className="mt-4 text-cyan-300 underline"
        type="button"
        onClick={() => setActiveSection('register')}
      >
        Don't have an account? Register
      </button>
    </div>
  );
};

export default Login; 