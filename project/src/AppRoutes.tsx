import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Recommendations from './components/Recommendations';
import Institutions from './components/Institutions';
import Chat from './components/Chat';
import AcademicAssessment from './components/AcademicAssessment';
import PsychometricTest from './components/PsychometricTest';
import DistrictColleges from './components/DistrictColleges';
import ChooseLocation from './components/ChooseLocation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import CollegeDetails from './components/CollegeDetails';
import SearchReport from './components/searchreport';
import FilterPage from './components/FilterPage';
import FilterResultsPage from './components/FilterResultsPage';
import Login from './components/Login';
import MapView from './components/MapView';
import CompareColleges from './components/CompareColleges';
import ResultSummary from './components/ResultSummary';

function AppRoutes() {
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [user] = useAuthState(auth);
  const [sectionState, setSectionState] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Debug: Check if API key is loaded
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    console.log('DeepSeek API Key loaded:', apiKey ? 'Yes' : 'No');
    if (apiKey) {
      console.log('API Key length:', apiKey.length);
      console.log('API Key starts with:', apiKey.substring(0, 10) + '...');
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch profile details from Firestore
      const fetchProfile = async () => {
        const docRef = doc(db, 'users', user.uid, 'profileDetails', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileDetails(docSnap.data());
        } else {
          setProfileDetails(null);
        }
      };
      fetchProfile();
      // Redirect to home if logged in and on about page
      if (activeSection === 'about') {
        setActiveSection('home');
      }
    } else {
      setProfileDetails(null);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setActiveSection('about');
    } else if (location.pathname === '/') {
      setActiveSection('home');
    }
    // Add more mappings if needed
  }, [location.pathname, user]);

  // Debug activeSection changes
  useEffect(() => {
    console.log('ActiveSection changed to:', activeSection);
  }, [activeSection]);

  const handleLogout = async () => {
    try {
      setActiveSection('about');
      setProfileDetails(null);
      setSectionState(null);
      setIsMobileMenuOpen(false);
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSetActiveSection = (section: string, state?: any) => {
    setActiveSection(section);
    setSectionState(state || null);
  };

  // Add a Back button to each main page except home/about
  const withBackButton = (Component: React.ReactNode) => (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-50 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow font-semibold"
      >
        &#8592; Back
      </button>
      {Component}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <About setActiveSection={handleSetActiveSection} />;
      case 'home':
        return <Home setActiveSection={handleSetActiveSection} />;
      case 'academic-assessment':
        return withBackButton(<AcademicAssessment setActiveSection={handleSetActiveSection} />);
      case 'psychometric-test':
        return withBackButton(<PsychometricTest setActiveSection={handleSetActiveSection} />);
      case 'choose-location':
        return withBackButton(<ChooseLocation profileDetails={profileDetails} setActiveSection={handleSetActiveSection} />);
      case 'district-colleges':
        return withBackButton(<DistrictColleges district={sectionState?.district || ''} />);
      case 'recommendations':
        return withBackButton(
          <Recommendations 
            profileDetails={profileDetails}
            chosenLocation={sectionState?.chosenLocation}
            setActiveSection={handleSetActiveSection}
          />
        );
      case 'institutions':
        return withBackButton(<Institutions />);
      case 'chat':
        return withBackButton(<Chat />);
      default:
        return <About setActiveSection={handleSetActiveSection} />;
    }
  };

  return (
    <>
      {activeSection !== 'about' && (
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <Routes>
        <Route path="/college/:collegeName" element={<CollegeDetails />} />
        <Route path="/searchreport" element={<SearchReport />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/filter-results" element={<FilterResultsPage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/compare" element={<CompareColleges />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/edit-profile" element={withBackButton(<AcademicAssessment setActiveSection={handleSetActiveSection} />)} />
        <Route path="/result-summary" element={<ResultSummary />} />
        {/* Optionally add a register page if you have a Register component */}
        {/* <Route path="/register" element={<Register setActiveSection={() => {}} />} /> */}
        <Route path="*" element={renderSection()} />
      </Routes>
    </>
  );
}

export default AppRoutes; 