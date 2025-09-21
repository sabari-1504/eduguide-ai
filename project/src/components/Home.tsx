import React, { useEffect, useState } from 'react';
import { Brain, Users, TrendingUp, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import PsychometricTest from './PsychometricTest';
import { Link } from 'react-router-dom';

interface HomeProps {
  setActiveSection: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveSection }) => {
  const [user] = useAuthState(auth);
  const [assessmentDone] = useState<boolean | null>(null);
  const [profileDone, setProfileDone] = useState(false);
  const [psychometricDone, setPsychometricDone] = useState(false);
  const [showPsyIntro, setShowPsyIntro] = useState(false);
  const [showPsyTest, setShowPsyTest] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (user) {
        // Check profile details
        const profileRef = doc(db, 'users', user.uid, 'profileDetails', 'main');
        const profileSnap = await getDoc(profileRef);
        const isProfileDone = profileSnap.exists();
        setProfileDone(isProfileDone);
        // Only check psychometric test if profile is done
        if (isProfileDone) {
        setPsychometricDone(!!localStorage.getItem('psychometricDone'));
        } else {
          setPsychometricDone(false);
        }
      } else {
        setProfileDone(false);
        setPsychometricDone(false);
      }
    };
    checkProgress();

    // Listen for localStorage changes (e.g., from Exit button)
    const onStorage = () => {
      setPsychometricDone(!!localStorage.getItem('psychometricDone'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  useEffect(() => {
    if (profileDone) {
      // If user just completed profile, clear psychometricDone so they must take the test
      localStorage.removeItem('psychometricDone');
      setPsychometricDone(false);
    }
    // eslint-disable-next-line
  }, [profileDone]);

  const handleRetakeAssessment = () => {
    setActiveSection('academic-assessment');
  };

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

  // If not logged in, show a friendly welcome page
  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-950 flex flex-col items-center justify-center">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">EduGuide AI</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover your perfect career path with AI-powered educational guidance.<br/>
            Please log in or register to get started!
          </p>
        </div>
      </div>
    );
  }

  if (showPsyIntro && !showPsyTest) {
    // Only allow showing psychometric intro if profile is done
    if (!profileDone) return null;
    return <PsychometricTest showIntro setActiveSection={setActiveSection} onStartTest={() => { setShowPsyIntro(false); setShowPsyTest(true); }} />;
  }
  if (showPsyTest && !psychometricDone) {
    // Only allow showing psychometric test if profile is done
    if (!profileDone) return null;
    return <PsychometricTest setActiveSection={setActiveSection} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-950">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="container mx-auto mt-28">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Psychometric Test Box */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center hover:bg-white/15 transition-colors transform-gpu hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2 text-white">Psychometric Test</h3>
            <p className="text-slate-300 mb-4 text-center">Discover your strengths and get personalized recommendations.</p>
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all"
              onClick={() => { setShowPsyIntro(true); setShowPsyTest(false); }}
              disabled={!profileDone}
            >
              <span className="relative z-[1]">Start Test</span>
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
            </button>
            {!profileDone && <div className="text-xs text-fuchsia-400 mt-2">Complete your profile to start the test.</div>}
          </div>
          {/* Map Box */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center hover:bg-white/15 transition-colors transform-gpu hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2 text-white">Map</h3>
            <p className="text-slate-300 mb-4 text-center">Explore colleges and courses on the interactive map.</p>
            <a 
              href="https://engineeringmap.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all"
            >
              <span className="relative z-[1]">View in Map</span>
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
            </a>
          </div>
          {/* Report Box */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center hover:bg-white/15 transition-colors transform-gpu hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2 text-white">Report</h3>
            <p className="text-slate-300 mb-4 text-center">View your personalized report and recommendations.</p>
            <Link to="/filter" className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all">
              <span className="relative z-[1]">View</span>
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
            </Link>
          </div>
          {/* Compare Colleges Box */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center hover:bg-white/15 transition-colors transform-gpu hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2 text-white">Compare Colleges</h3>
            <p className="text-slate-300 mb-4 text-center">Compare two colleges side by side.</p>
            <Link to="/compare" className="group relative overflow-hidden bg-gradient-to-r from-amber-400 to-rose-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] transition-all">
              <span className="relative z-[1]">Compare</span>
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Checklist Sidebar */}
        <aside className="w-full lg:w-1/4 mb-8 lg:mb-0">
          <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-white">Getting Started</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-200">Register</span>
              </li>
              <li className={`flex items-center gap-2 ${user ? '' : 'opacity-50'}`}> 
                {user ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <span className="h-5 w-5 inline-block border-2 border-slate-500 rounded-full"></span>}
                <span className="text-slate-200">{user ? 'Login' : <button onClick={() => setActiveSection('about')} className="text-cyan-400 underline">Login</button>}</span>
              </li>
              <li className={`flex items-center gap-2 ${profileDone ? '' : 'opacity-50'}`}> 
                {profileDone ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <span className="h-5 w-5 inline-block border-2 border-slate-500 rounded-full"></span>}
                {profileDone ? (
                  <span className="text-slate-200">Profile Details</span>
                ) : (
                  <button onClick={() => setActiveSection('academic-assessment')} className="text-cyan-400 underline">Profile Details</button>
                )}
              </li>
              <li className={`flex items-center gap-2 ${psychometricDone ? '' : 'opacity-50'}`}> 
                {psychometricDone ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <span className="h-5 w-5 inline-block border-2 border-slate-500 rounded-full"></span>}
                {psychometricDone ? (
                  <span className="text-slate-200">Psychometric Test</span>
                ) : (
                  <button onClick={() => { setShowPsyIntro(true); setShowPsyTest(false); }} className="text-cyan-400 underline">Psychometric Test</button>
                )}
              </li>
            </ul>
            {/* View Results button, only if all checklist items are complete */}
            {user && profileDone && psychometricDone && (
              <button
                className="group relative overflow-hidden mt-8 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-[0_0_24px_rgba(5,150,105,0.7)] transition-all duration-300"
                onClick={() => setActiveSection('choose-location')}
              >
                <span className="relative z-[1]">View Results</span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
              </button>
            )}
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                  Your Journey to{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                    Success
                  </span>{' '}
                  Starts Here
                </h1>
                <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                  Discover your perfect career path with AI-powered educational guidance. 
                  Get personalized recommendations for courses and institutions based on your unique profile.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Show Complete Profile Details button only if not completed */}
                  {user && !profileDone && (
                    <motion.button
                      onClick={() => setActiveSection('academic-assessment')}
                      className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 hover:shadow-[0_0_28px_rgba(217,70,239,0.5)] transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-[1]">Complete Profile Details</span>
                      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  )}
                  {/* Show Take Psychometric Test button if profile is done but psychometric is not */}
                  {user && profileDone && !psychometricDone && (
                    <motion.button
                      onClick={() => { setShowPsyIntro(true); setShowPsyTest(false); }}
                      className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-[1]">Take Psychometric Test</span>
                      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  )}
                  {user && assessmentDone === true && (
                    <div className="text-emerald-300 font-semibold flex items-center gap-2 justify-center">
                      <span>Assessment Completed!</span>
                      <button
                        onClick={handleRetakeAssessment}
                        className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
                      >
                        <span className="relative z-[1]">Retake</span>
                        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
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
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_24px_rgba(217,70,239,0.35)]">
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

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Future?
                </h2>
                <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of students who have found their perfect career path with our AI-powered guidance system.
                </p>
                {/* Show Complete Profile Details button only if not completed */}
                {user && !profileDone && (
                  <motion.button
                    onClick={() => setActiveSection('academic-assessment')}
                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-200 to-fuchsia-200 text-slate-900 px-8 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 hover:shadow-[0_0_28px_rgba(255,255,255,0.6)] transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-[1]">Complete Profile Details</span>
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/40 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                )}
                {/* Show Take Psychometric Test button if profile is done but psychometric is not */}
                {user && profileDone && !psychometricDone && (
                  <motion.button
                    onClick={() => { setShowPsyIntro(true); setShowPsyTest(false); }}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-300 to-cyan-200 text-slate-900 px-8 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 hover:shadow-[0_0_28px_rgba(255,255,255,0.6)] transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-[1]">Take Psychometric Test</span>
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/40 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                )}
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;