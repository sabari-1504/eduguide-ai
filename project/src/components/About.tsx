import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Brain, Users, TrendingUp, Award, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendOTP, verifyOTP } from '../utils/emailOTP';
import { useAuthState } from 'react-firebase-hooks/auth';

interface AboutProps {
  setActiveSection: (section: string) => void;
}

const About: React.FC<AboutProps> = ({ setActiveSection }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // OTP states
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [tempUser, setTempUser] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  const [user] = useAuthState(auth);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized course and institution suggestions based on your profile and aspirations.'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Access insights from education experts and successful alumni in your field of interest.'
    },
    {
      icon: TrendingUp,
      title: 'Market Trends',
      description: 'Stay updated with industry trends and future job market predictions.'
    },
    {
      icon: Award,
      title: 'Success Tracking',
      description: 'Monitor your academic progress and career development with our tracking tools.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Students Guided' },
    { number: '1,200+', label: 'Institutions' },
    { number: '500+', label: 'Courses Available' },
    { number: '95%', label: 'Success Rate' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill all required fields.');
      return false;
    }
    if (authMode === 'register') {
      if (!formData.name) {
        setError('Please fill all required fields.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setSuccess('Login successful!');
      setShowProfilePrompt(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      // First, send OTP via EmailJS
      const otpResult = await sendOTP(formData.email);
      
      if (!otpResult.success) {
        setError(otpResult.message);
        setLoading(false);
        return;
      }

      // Store temporary user data for OTP verification
      setTempUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      setOtpSent(true);
      setAuthMode('otp');
      setSuccess(otpResult.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Verify OTP using EmailJS
      const verificationResult = verifyOTP(otp);
      
      if (!verificationResult.success) {
        setError('❌ OTP is incorrect. Please try again.');
        setSuccess('');
        setOtp('');
        setLoading(false);
        return;
      }

      // OTP verified successfully, now create the user account
      if (tempUser) {
        const userCredential = await createUserWithEmailAndPassword(auth, tempUser.email, tempUser.password);
        await updateProfile(userCredential.user, { displayName: tempUser.name });
        
        // Store user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: tempUser.name,
          email: tempUser.email,
          createdAt: new Date(),
          emailVerified: true
        });

        // Show success message and redirect to login
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          setAuthMode('login');
          setError('');
          setSuccess('');
          setOtp('');
          setOtpSent(false);
          setTempUser(null);
          // Clear form data
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!tempUser?.email) return;
    try {
      const otpResult = await sendOTP(tempUser.email);
      if (otpResult.success) {
        setSuccess(otpResult.message);
        setError('');
      } else {
        setError(otpResult.message);
        setSuccess('');
      }
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
      setSuccess('');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('');
    if (!resetEmail) {
      setResetStatus('Please enter your email.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      console.log('Password reset error:', err);
      const errorCode = err.code || (err?.code);
      if (errorCode === 'auth/user-not-found') {
        setResetStatus('This email is not registered. Please register first or use another email.');
      } else {
        setResetStatus(err.message || 'Failed to send reset email.');
      }
    }
  };

  const renderAuthForm = () => {
    if (showResetPassword) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(217,70,239,0.35)]">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2">Reset Password</h2>
            <p className="text-slate-300">Enter your email to receive a password reset link.</p>
          </div>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <button type="submit" className="group relative overflow-hidden w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-3 rounded-full font-semibold hover:shadow-[0_0_24px_rgba(217,70,239,0.5)] transition-all duration-300">
              <span className="relative z-[1]">Send Reset Email</span>
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
            </button>
          </form>
          {resetStatus && <div className={`mt-4 text-center ${resetStatus.includes('sent') ? 'text-emerald-300' : 'text-fuchsia-300'}`}>{resetStatus}</div>}
          <button className="mt-4 text-cyan-300 underline w-full" type="button" onClick={() => { setShowResetPassword(false); setResetStatus(''); }}>Back to Login</button>
        </motion.div>
      );
    }

    if (authMode === 'otp') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white"
        >
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(16,185,129,0.35)]">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2">Verify Your Email</h2>
            <p className="text-slate-300">We've sent a 6-digit OTP to {formData.email}</p>
          </div>

          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !otp}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-3 rounded-full font-semibold hover:shadow-[0_0_24px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50"
            >
              <span className="relative z-[1]">{loading ? 'Verifying...' : 'Verify OTP'}</span>
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={resendOtp}
                className="text-cyan-300 hover:text-white text-sm"
              >
                Didn't receive OTP? Resend
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg flex items-center gap-3 text-fuchsia-300"
            >
              <XCircle className="h-5 w-5 text-fuchsia-300 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium">{error}</span>
                {error.includes('OTP is incorrect') && (
                  <p className="text-xs mt-1">Please check your email and try again.</p>
                )}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 text-emerald-300"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">{success}</span>
            </motion.div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white"
      >
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(217,70,239,0.35)]">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-300">
            {authMode === 'login' 
              ? 'Sign in to continue your educational journey' 
              : 'Join thousands of students finding their perfect path'
            }
          </p>
        </div>

        <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {authMode === 'login' && (
            <div className="text-right">
              <button type="button" className="text-cyan-300 text-sm underline" onClick={() => setShowResetPassword(true)}>
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative overflow-hidden w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-3 rounded-full font-semibold hover:shadow-[0_0_28px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50"
          >
            <span className="relative z-[1]">{loading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <span className="text-red-700 text-sm font-medium">{error}</span>
              {error.includes('OTP is incorrect') && (
                <p className="text-red-600 text-xs mt-1">Please check your email and try again.</p>
              )}
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700 text-sm">{success}</span>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-300">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setError('');
                setSuccess('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              className="text-cyan-300 hover:text-white font-semibold"
            >
              {authMode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-950">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Your Journey to{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                  Success
                </span>{' '}
                Starts Here
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Discover your perfect career path with AI-powered educational guidance. 
                Get personalized recommendations for courses and institutions based on your unique profile.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.slice(0, 4).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_18px_rgba(217,70,239,0.35)]">
                      <feature.icon className="h-4 w-4 text-white drop-shadow" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{feature.title}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => {
                  if (user) {
                    setActiveSection('home');
                  } else {
                    setShowLoginPrompt(true);
                  }
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-[0_0_28px_rgba(217,70,239,0.5)] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-[1]">Explore Platform</span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              {showLoginPrompt && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
                  <div className="bg-white/10 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center text-white">
                    <h2 className="text-xl font-extrabold mb-4">Please log in to explore the platform</h2>
                    <button
                      className="group relative overflow-hidden mt-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-full font-semibold hover:shadow-[0_0_24px_rgba(217,70,239,0.5)]"
                      onClick={() => setShowLoginPrompt(false)}
                    >
                      <span className="relative z-[1]">Close</span>
                      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              {renderAuthForm()}
              {showProfilePrompt && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
                  <div className="bg-white/10 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center text-white">
                    <h2 className="text-xl font-extrabold mb-2">Welcome!</h2>
                    <p className="mb-4 text-slate-300">Please complete your profile to continue.</p>
                    <button
                      className="group relative overflow-hidden mt-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-[0_0_24px_rgba(16,185,129,0.5)]"
                      onClick={() => setActiveSection('profile')}
                    >
                      <span className="relative z-[1]">Complete Profile</span>
                      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Why Choose EduGuide AI?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Our platform combines artificial intelligence with educational expertise to provide you with the best guidance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-md hover:bg-white/15 transform-gpu hover:-translate-y-1 hover:scale-[1.01]"
                whileHover={{ y: -5 }}
              >
                <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(217,70,239,0.35)]">
                  <feature.icon className="h-6 w-6 text-white drop-shadow" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Popup Modal */}
      <SuccessPopup isOpen={showSuccessPopup} />
    </div>
  );
};

// Success Popup Modal
const SuccessPopup: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
      >
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h3>
        <p className="text-gray-600 mb-6">
          Your account has been created successfully. You can now log in with your email and password.
        </p>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-blue-600">Redirecting to login...</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About; 