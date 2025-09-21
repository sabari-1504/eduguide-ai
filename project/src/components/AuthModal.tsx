import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [view, setView] = useState<'choice' | 'login' | 'register'>('choice');
  const [justRegistered, setJustRegistered] = useState(false);

  if (!open) return null;

  const handleRegisterSuccess = () => {
    setJustRegistered(true);
    setView('login');
  };

  const handleLoginSection = (section: string) => {
    if (section === 'close') {
      onClose();
      setView('choice');
      setJustRegistered(false);
    } else if (section === 'register') {
      setView('register');
    }
  };

  const handleRegisterSection = (section: string) => {
    if (section === 'login') {
      handleRegisterSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-white">
          <button
            className="absolute top-3 right-3 text-slate-300 hover:text-white text-2xl transition-colors"
            onClick={() => {
              onClose();
              setView('choice');
              setJustRegistered(false);
            }}
            aria-label="Close"
          >
            &times;
          </button>
          {view === 'choice' && (
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-2xl font-extrabold mb-2">Welcome!</h2>
              <p className="mb-4 text-slate-300">Do you want to Login or Register?</p>
              <div className="flex gap-4">
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all"
                  onClick={() => setView('login')}
                >
                  <span className="relative z-[1]">Login</span>
                  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                </button>
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                  onClick={() => setView('register')}
                >
                  <span className="relative z-[1]">Register</span>
                  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                </button>
              </div>
            </div>
          )}
          {view === 'register' && (
            <Register setActiveSection={handleRegisterSection} />
          )}
          {view === 'login' && (
            <>
              {justRegistered && (
                <div className="mb-4 text-emerald-300 text-center font-semibold">Registration successful! Please login.</div>
              )}
              <Login setActiveSection={handleLoginSection} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 