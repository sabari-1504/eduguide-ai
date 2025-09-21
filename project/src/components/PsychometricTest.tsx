import React, { useState, useEffect } from 'react';
import questions from '../psychometric_questions.json';
import detailsOfColleges from '../data/Detais of colleges.json';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import MemoryGame from './MemoryGame';
import AttentionGame from './AttentionGame';
import LogicGame from './LogicGame';
import { Link } from 'react-router-dom';
import { getRecommendedDomains, Domain } from '../data/engineeringDomains';

interface Option {
  label: string;
  text: string;
  tag: 'L' | 'R' | 'B';
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

const recommendations: Record<string, string[]> = {
  L: ['Engineering', 'Data Science', 'Law'],
  R: ['Design', 'Fine Arts', 'Journalism'],
  B: ['Management', 'Psychology', 'Teaching'],
};

// Mapping of engineering departments by brain dominance type
const engineeringDepartments: Record<string, { code: string; name: string }[]> = {
  L: [
    { code: 'AD', name: 'Artificial Intelligence and Data Science' },
    { code: 'AE', name: 'Aeronautical Engineering' },
    { code: 'AM', name: 'Applied Mathematics' },
    { code: 'AP', name: 'Automobile Engineering' },
    { code: 'AU', name: 'Automobile Engineering' },
    { code: 'CH', name: 'Chemical Engineering' },
    { code: 'CL', name: 'Chemical Engineering' },
    { code: 'CE', name: 'Civil Engineering' },
    { code: 'CO', name: 'Computer Engineering' },
    { code: 'CS', name: 'Computer Science and Engineering' },
    { code: 'CZ', name: 'Computational Engineering' },
    { code: 'EE', name: 'Electrical and Electronics Engineering' },
    { code: 'EF', name: 'Electrical Engineering (Power Systems)' },
    { code: 'EC', name: 'Electronics and Communication Engineering' },
    { code: 'EI', name: 'Electronics and Instrumentation Engineering' },
    { code: 'EM', name: 'Embedded Systems' },
    { code: 'IN', name: 'Information Technology' },
    { code: 'IT', name: 'Information Technology' },
    { code: 'IC', name: 'Instrumentation and Control Engineering' },
    { code: 'MF', name: 'Manufacturing Engineering' },
    { code: 'MG', name: 'Marine Engineering' },
    { code: 'MN', name: 'Material Science' },
    { code: 'MS', name: 'Material Science and Engineering' },
    { code: 'MA', name: 'Mathematics' },
    { code: 'ME', name: 'Mechanical Engineering' },
    { code: 'MC', name: 'Mechatronics Engineering' },
    { code: 'MT', name: 'Mechatronics' },
    { code: 'MR', name: 'Metallurgical Engineering' },
    { code: 'MZ', name: 'Metallurgy' },
    { code: 'MI', name: 'Mining Engineering' },
    { code: 'PA', name: 'Petroleum Engineering' },
    { code: 'PC', name: 'Polymer Technology' },
    { code: 'PE', name: 'Power Electronics' },
    { code: 'PM', name: 'Printing Technology' },
    { code: 'PN', name: 'Production Engineering' },
    { code: 'PR', name: 'Production Engineering' },
    { code: 'RA', name: 'Robotics and Automation' },
    { code: 'RP', name: 'Robotics and Product Design' },
    { code: 'SC', name: 'Software Engineering' },
    { code: 'SE', name: 'Structural Engineering' },
    { code: 'XM', name: 'Mathematical Computing / Data Analytics' },
  ],
  R: [
    { code: 'AR', name: 'Architecture' },
    { code: 'AO', name: 'Apparel Technology' },
    { code: 'AS', name: 'Applied Sciences' },
    { code: 'BA', name: 'Bioinformatics' },
    { code: 'BC', name: 'Bioelectronics' },
    { code: 'BM', name: 'Biomedical Engineering' },
    { code: 'BP', name: 'Bioprocess Engineering' },
    { code: 'BS', name: 'Basic Sciences' },
    { code: 'BT', name: 'Biotechnology' },
    { code: 'BY', name: 'Bioscience and Engineering' },
    { code: 'CB', name: 'Computer and Business Systems' },
    { code: 'CD', name: 'Computer Design' },
    { code: 'CG', name: 'Computer Graphics and Multimedia' },
    { code: 'CI', name: 'Communication and Information Engineering' },
    { code: 'CN', name: 'Communication Engineering' },
    { code: 'CJ', name: 'Cybersecurity and Digital Forensics' },
    { code: 'EN', name: 'Environmental Engineering' },
    { code: 'ES', name: 'Environmental Science' },
    { code: 'FT', name: 'Fashion Technology' },
    { code: 'FY', name: 'Fisheries Science' },
    { code: 'FD', name: 'Food Technology' },
    { code: 'FS', name: 'Forensic Science' },
    { code: 'GI', name: 'Geoinformatics' },
    { code: 'IB', name: 'Industrial Biotechnology' },
    { code: 'LE', name: 'Leather Technology' },
    { code: 'MG', name: 'Marine Engineering' },
    { code: 'MD', name: 'Medical Electronics' },
    { code: 'MY', name: 'Medical Instrumentation' },
    { code: 'MO', name: 'Mobility Engineering' },
    { code: 'MU', name: 'Multimedia Technology' },
    { code: 'PS', name: 'Pharmaceutical Science' },
    { code: 'PH', name: 'Physics' },
    { code: 'PP', name: 'Plastic and Polymer Engineering' },
    { code: 'RM', name: 'Rubber and Plastics Technology' },
    { code: 'SF', name: 'Safety and Fire Engineering' },
    { code: 'TC', name: 'Textile Chemistry' },
    { code: 'TS', name: 'Textile Science' },
    { code: 'TX', name: 'Textile Technology' },
    { code: 'TT', name: 'Textile Engineering' },
    { code: 'XC', name: 'Cross-Disciplinary / Custom Programs' },
    { code: 'XS', name: 'Special Category / Interdisciplinary Studies' },
  ],
  B: [
    { code: 'AL', name: 'Artificial Intelligence and Machine Learning' },
    { code: 'AT', name: 'Artificial Intelligence and Machine Learning' },
    { code: 'BC', name: 'Bioelectronics' },
    { code: 'CB', name: 'Computer and Business Systems' },
    { code: 'EA', name: 'Electronics and Automation' },
    { code: 'EY', name: 'Energy Engineering' },
    { code: 'IE', name: 'Industrial Engineering' },
    { code: 'IY', name: 'Industrial Safety Engineering' },
    { code: 'IM', name: 'Information Management' },
    { code: 'SB', name: 'Software and Business Systems' },
    { code: 'IS', name: 'Information Science' },
    { code: 'MC', name: 'Mechatronics Engineering' },
    { code: 'MT', name: 'Mechatronics' },
    { code: 'PN', name: 'Production Engineering' },
    { code: 'PR', name: 'Production Engineering' },
    { code: 'RA', name: 'Robotics and Automation' },
    { code: 'RP', name: 'Robotics and Product Design' },
    { code: 'SC', name: 'Software Engineering' },
    { code: 'XM', name: 'Mathematical Computing / Data Analytics' },
    { code: 'XC', name: 'Cross-Disciplinary / Custom Programs' },
    { code: 'XS', name: 'Special Category / Interdisciplinary Studies' },
  ],
};

interface PsychometricTestProps {
  setActiveSection?: (section: string, state?: any) => void;
  showIntro?: boolean;
  onStartTest?: () => void;
}

// Function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to get 15 unique random questions with shuffled options
const getRandomQuestions = (allQuestions: Question[]): Question[] => {
  // Remove duplicate questions by ID
  const uniqueQuestionsMap = new Map<number, Question>();
  allQuestions.forEach(q => {
    if (!uniqueQuestionsMap.has(q.id)) {
      uniqueQuestionsMap.set(q.id, q);
    }
  });
  const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
  // Randomly select 15 unique questions
  const shuffledQuestions = shuffleArray(uniqueQuestions);
  const selectedQuestions = shuffledQuestions.slice(0, 15);
  // For each question, shuffle the options and reassign labels A, B, C
  return selectedQuestions.map(question => {
    // Shuffle the options
    const shuffledOptions = shuffleArray(question.options);
    // Assign new labels
    const labels = ['A', 'B', 'C'];
    const relabeledOptions = shuffledOptions.map((opt, idx) => ({
      ...opt,
      label: labels[idx]
    }));
    return {
      ...question,
      options: relabeledOptions
    };
  });
};

const PsychometricTest: React.FC<PsychometricTestProps> = ({ setActiveSection, showIntro = false, onStartTest }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [scores, setScores] = useState({ L: 0, R: 0, B: 0 });
  const [showResult, setShowResult] = useState(false);
  const [showColleges, setShowColleges] = useState(false);
  const [engineeringColleges, setEngineeringColleges] = useState<string[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [user] = useAuthState(auth);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const [memoryGameResult, setMemoryGameResult] = useState<{score: number, rounds: number} | null>(null);
  const [showAttentionGame, setShowAttentionGame] = useState(false);
  const [attentionGameResult, setAttentionGameResult] = useState<{avgTime: number, correct: number, total: number} | null>(null);
  const [showLogicGame, setShowLogicGame] = useState(false);
  const [logicGameResult, setLogicGameResult] = useState<{correct: number, total: number} | null>(null);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]); // ms per question
  const [questionStart, setQuestionStart] = useState<number | null>(null);
  const [showCollegeResults, setShowCollegeResults] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  const allQuestions = questions as Question[];

  // Initialize random questions on component mount
  useEffect(() => {
    setSelectedQuestions(getRandomQuestions(allQuestions));
  }, [allQuestions]);

  useEffect(() => {
    if (step < 15) {
      setQuestionStart(Date.now());
    }
    // eslint-disable-next-line
  }, [step]);

  // Prevent multiple attempts
  useEffect(() => {
    if (localStorage.getItem('psychometricDone')) {
      setShowResult(false);
      setStep(0);
    }
  }, []);
  if (localStorage.getItem('psychometricDone')) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-extrabold mb-4">Psychometric Test Already Attempted</h2>
        <p className="text-slate-300 mb-6">You have already completed the psychometric test. You cannot attempt it again.</p>
        {setActiveSection && (
          <button
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold"
            onClick={() => setActiveSection('home')}
          >
            <span className="relative z-[1]">Go to Home</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
        )}
      </div>
    );
  }

  // Show intro page if requested
  if (showIntro) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-6"><span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">What is a Psychometric Test?</span></h2>
        <p className="text-lg text-slate-300 mb-4">
          A psychometric test is a standardized assessment designed to measure a person's mental capabilities, cognitive abilities, personality traits, and behavioral style. These tests are widely used in education and career guidance to help individuals understand their strengths, preferences, and aptitudes.
        </p>
        <h3 className="text-2xl font-extrabold text-white mb-2">Why do we use it?</h3>
        <p className="text-slate-300 mb-4">
          On our platform, the psychometric test helps us provide you with personalized recommendations for courses and career paths that best match your unique profile. By understanding your thinking style, interests, and aptitudes, we can guide you toward educational and career options where you are most likely to succeed and feel fulfilled.
        </p>
        <h3 className="text-2xl font-extrabold text-white mb-2">How does it work?</h3>
        <p className="text-slate-300 mb-4">
          You will answer a series of carefully designed questions. There are no right or wrong answers—just choose the option that best describes you. Your responses will help us analyze your brain dominance and suggest suitable fields and courses.
        </p>
        <ul className="text-left text-slate-300 mb-6 list-disc pl-6">
          <li>There are 15 questions in total.</li>
          <li>Each question has multiple options—pick the one that fits you best.</li>
          <li>Your answers are confidential and used only to improve your guidance experience.</li>
        </ul>
        <div className="mt-8">
          <button
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-[0_0_28px_rgba(217,70,239,0.5)] transition-all duration-300"
            onClick={onStartTest}
          >
            <span className="relative z-[1]">Start Test</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/4 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (tag: 'L' | 'R' | 'B') => {
    // Only track time for the first 15 questions
    if (step < 15 && questionStart !== null) {
      setQuestionTimes(prev => [...prev, Date.now() - questionStart]);
    }
    setAnswers(prev => [...prev, tag]);
    setScores(prev => ({ ...prev, [tag]: prev[tag] + 1 }));
    if (step < selectedQuestions.length - 1) {
      setStep(s => s + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    const prevTag = answers[answers.length - 1] as 'L' | 'R' | 'B';
    setScores(prev => ({ ...prev, [prevTag]: prev[prevTag] - 1 }));
    setAnswers(prev => prev.slice(0, -1));
    setStep(s => s - 1);
    setShowResult(false);
  };

  const getResult = () => {
    const max = Math.max(scores.L, scores.R, scores.B);
    if (scores.L === max && scores.L !== scores.R && scores.L !== scores.B) return 'L';
    if (scores.R === max && scores.R !== scores.L && scores.R !== scores.B) return 'R';
    if (scores.B === max && scores.B !== scores.L && scores.B !== scores.R) return 'B';
    // If tie, prefer B > L > R
    if (scores.B === max) return 'B';
    if (scores.L === max) return 'L';
    return 'R';
  };

  const toggleDomainExpansion = (domainId: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  };

  const handleFieldClick = async (field: string) => {
    if (field !== 'Engineering') return;
    setLoadingColleges(true);
    setShowColleges(false);
    if (!user) return;
    // Fetch user's district from Firestore
    const docRef = doc(db, 'users', user.uid, 'academicDetails', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as { district?: string };
      const district = data.district;
      if (district && setActiveSection) {
        setActiveSection('district-colleges', { district });
        return;
      }
      // fallback: show inline if no navigation
      if (district) {
        const keys = Object.keys(detailsOfColleges as any);
        const matchKey = keys.find(
          k => k.trim().toLowerCase() === district.trim().toLowerCase()
        );
        if (matchKey) {
          const colleges: string[] = (detailsOfColleges as any)[matchKey].map((c: any) => c.CollegeName || '');
          setEngineeringColleges(colleges);
          setShowColleges(true);
        } else {
          setEngineeringColleges([]);
          setShowColleges(true);
        }
      } else {
        setEngineeringColleges([]);
        setShowColleges(true);
      }
    }
    setLoadingColleges(false);
  };

  async function fetchCollegesForUser() {
    setCollegeLoading(true);
    setFilteredColleges([]);
    if (!user) return;
    // Fetch user's district from Firestore
    const docRef = doc(db, 'users', user.uid, 'profileDetails', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as { district?: string };
      const district = data.district;
      if (district) {
        // Get recommended department codes
        const type = getResult();
        const deptCodes = engineeringDepartments[type].map(d => d.code);
        // Filter colleges by district and at least one matching department
        const colleges = (detailsOfColleges as any[]).filter(college => {
          // Some districts may have inconsistent casing/spacing
          if (!college.District) return false;
          if (college.District.trim().toLowerCase() !== district.trim().toLowerCase()) return false;
          // Check if any recommended department is present (by Branch Code)
          return deptCodes.some(code => college[`Branch Code ${code}`] && college[`Branch Code ${code}`].trim() !== '');
        });
        setFilteredColleges(colleges);
      }
    }
    setCollegeLoading(false);
  }

  if (showResult && !showMemoryGame && !memoryGameResult) {
    // Immediately start memory game after MCQ, do not show recommendations here
    setShowMemoryGame(true);
    return null;
  }

  if (showMemoryGame && !memoryGameResult) {
    return <MemoryGame onComplete={result => setMemoryGameResult(result)} />;
  }

  if (showMemoryGame && memoryGameResult && !showAttentionGame) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-extrabold mb-4">Memory Game Complete!</h2>
        <div className="mb-2">Your Score: {memoryGameResult.score}</div>
        <button
          className="group relative overflow-hidden mt-8 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold"
          onClick={() => setShowAttentionGame(true)}
        >
          <span className="relative z-[1]">Continue to Attention Game</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
        </button>
      </div>
    );
  }

  if (showAttentionGame && !attentionGameResult) {
    return <AttentionGame onComplete={result => setAttentionGameResult(result)} />;
  }

  if (showAttentionGame && attentionGameResult && !showLogicGame) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-extrabold mb-4">Attention Game Complete!</h2>
        <div className="mb-2">Correct: {attentionGameResult.correct} / 5</div>
        <div className="mb-2">Average Time: {Math.round(attentionGameResult.avgTime)} ms</div>
        <button
          className="group relative overflow-hidden mt-8 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold"
          onClick={() => setShowLogicGame(true)}
        >
          <span className="relative z-[1]">Continue to Logic Game</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
        </button>
      </div>
    );
  }

  if (showLogicGame && !logicGameResult) {
    return <LogicGame onComplete={result => setLogicGameResult(result)} />;
  }

  if (logicGameResult && !showCollegeResults) {
    const type = getResult();
    const suggestedDepartments = engineeringDepartments[type];
    const handleExit = () => {
      localStorage.setItem('psychometricDone', 'true');
      window.dispatchEvent(new Event('storage'));
      if (setActiveSection) setActiveSection('home');
    };
    // Reason text for each type
    const reasonMap = {
      L: 'You have a strong left-brain dominance, which means you excel at logical reasoning, analytical thinking, and structured problem-solving. Careers in engineering and related analytical fields often require these skills and may be a great fit for you.',
      R: 'You have a strong right-brain dominance, which means you are creative, intuitive, and excel at visual and artistic tasks. Fields like design, architecture, and creative engineering value these abilities and may suit your strengths.',
      B: 'You have a balanced brain dominance, combining both analytical and creative skills. This makes you well-suited for interdisciplinary and management-oriented engineering careers, where both logic and creativity are important.',
    };
    // Bar graph for question times
    const maxTime = Math.max(...questionTimes, 1);
    return (
      <div className="max-w-6xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 text-white">
        {/* Left: Assessment Summary */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-extrabold mb-4 text-center">Assessment Summary</h2>
          <div className="mb-4">Brain Dominance: <span className="text-cyan-300 font-semibold">{type}</span></div>
          <div className="mb-2">MCQ Scores: L: {scores.L} | R: {scores.R} | B: {scores.B}</div>
          {memoryGameResult && <div className="mb-2">Memory Game Score: {memoryGameResult.score}</div>}
          {attentionGameResult && <div className="mb-2">Attention Game: {attentionGameResult.correct} correct, Avg Time: {Math.round(attentionGameResult.avgTime)} ms</div>}
          {logicGameResult && <div className="mb-2">Logic Game: {logicGameResult.correct} / {logicGameResult.total}</div>}
          {/* Bar graph for MCQ times */}
          {questionTimes.length === 15 && (
            <div className="mt-6 mb-4">
              <div className="font-semibold mb-2">Time Taken Per Question (ms)</div>
              <div className="flex items-end gap-1 h-32 bg-white/5 p-2 rounded">
                {questionTimes.map((t, i) => (
                  <div key={i} className="flex flex-col items-center justify-end h-full">
                    <div
                      className="bg-gradient-to-b from-cyan-500 to-fuchsia-500 w-4 rounded-t"
                      style={{ height: `${(t / maxTime) * 100}%`, minHeight: 4 }}
                      title={`Q${i + 1}: ${t} ms`}
                    ></div>
                    <span className="text-xs mt-1">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 text-left bg-white/5 border border-white/10 p-4 rounded">
            <div className="font-semibold mb-4">Recommended Engineering Domains Based on Your Test Results:</div>
            <div className="mb-4 text-slate-200">{reasonMap[type]}</div>
            
            <div className="space-y-3">
              {getRecommendedDomains(type).map((domain) => (
                <div key={domain.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors duration-200 p-2 rounded"
                    onClick={() => toggleDomainExpansion(domain.id)}
                  >
                    <div>
                      <div className="text-cyan-300 font-bold text-lg">{domain.name}</div>
                      <div className="text-slate-300 text-sm mt-1">{domain.description}</div>
                    </div>
                    <div className="text-cyan-300 text-xl">
                      {expandedDomains.has(domain.id) ? '▼' : '▶'}
                    </div>
                  </div>
                  
                  {expandedDomains.has(domain.id) && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="text-slate-200 font-medium mb-2">Available Courses:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {domain.courses.map((course, index) => (
                          <div key={index} className="bg-white/5 border border-white/10 rounded p-2 text-slate-200">
                            {course.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-emerald-300 font-medium">
              This recommendation is based on your psychometric assessment results. You can use this result to guide your educational and career choices, or you are free to continue with your own interests and passions. The best path is the one that feels right for you!
            </div>
          </div>
          <button
            className="group relative overflow-hidden mt-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold"
            onClick={() => { fetchCollegesForUser(); setShowCollegeResults(true); }}
          >
            <span className="relative z-[1]">Next</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
          <button
            className="group relative overflow-hidden mt-4 ml-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-6 py-2 rounded-full font-semibold"
            onClick={() => { window.location.assign('/'); }}
          >
            <span className="relative z-[1]">Home</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
          <button
            className="mt-4 bg-white/10 border border-white/10 text-white px-6 py-2 rounded-full font-semibold hover:bg-white/20"
            onClick={handleExit}
          >
            Exit
          </button>
          <div className="mt-6 text-emerald-300 font-semibold">Thank you for completing the assessment!</div>
        </div>
      </div>
    );
  }

  if (logicGameResult && showCollegeResults) {
    const type = getResult();
    const suggestedDepartments = engineeringDepartments[type];
    return (
      <div className="max-w-6xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 text-white">
        {/* Left: College List */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-extrabold mb-4">Colleges in Your District Offering Recommended Departments</h2>
          {collegeLoading ? (
            <div className="text-cyan-300">Loading colleges...</div>
          ) : filteredColleges.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
              {filteredColleges.map((college, idx) => (
                <Link
                  to={`/college/${encodeURIComponent(college["College Name"])}`}
                  key={idx}
                  className="bg-white/10 border border-white/10 rounded-xl shadow-xl p-6 mb-4 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:bg-white/15"
                >
                  <div className="font-bold text-lg text-white mb-2">{college["College Name"]}</div>
                  <div className="text-slate-300 text-sm mb-1">{college.Address}</div>
                  <div className="text-slate-400 text-xs mb-1">District: {college.District}</div>
                  <div className="text-slate-400 text-xs mb-1">Pincode: {college.Pincode}</div>
                  <div className="text-gray-600 text-xs mb-1">Departments Offered: {Object.keys(college)
                    .filter(key => key.startsWith('Branch Code ') && college[key] && college[key].trim() !== '')
                    .map(key => key.replace('Branch Code ', ''))
                    .join(', ')}</div>
                  {college.Website && (
                    <a
                      href={college.Website && college.Website.startsWith('http') ? college.Website : `https://${college.Website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 underline text-xs mt-2 hover:text-white"
                      onClick={e => e.stopPropagation()}
                    >
                      {college.Website}
                    </a>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-slate-400">No colleges found in your district for the recommended departments.</div>
          )}
          <button
            className="group relative overflow-hidden mt-8 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-6 py-2 rounded-full font-semibold"
            onClick={() => { localStorage.setItem('psychometricDone', 'true'); window.location.assign('/result-summary'); }}
          >
            <span className="relative z-[1]">Finish</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
          <button
            className="group relative overflow-hidden mt-4 ml-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold"
            onClick={() => { window.location.assign('/'); }}
          >
            <span className="relative z-[1]">Home</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/30 blur-md skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
          </button>
        </div>
      </div>
    );
  }

  // Show loading while questions are being initialized
  if (selectedQuestions.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-slate-300">Preparing your personalized test...</p>
      </div>
    );
  }

  const q = selectedQuestions[step];

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-semibold text-cyan-300">Question {step + 1} of {selectedQuestions.length}</span>
        <div className="w-1/2 bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-2 rounded-full transition-all"
            style={{ width: `${((step + 1) / selectedQuestions.length) * 100}%` }}
          />
        </div>
      </div>
      <h2 className="text-xl font-extrabold mb-6">{q.question}</h2>
      <div className="space-y-4">
        {q.options.map(opt => (
          <button
            key={opt.label}
            className="w-full text-left bg-white/5 border border-white/10 p-4 rounded-lg hover:bg-white/10 transition-all font-medium text-slate-200"
            onClick={() => handleSelect(opt.tag)}
          >
            <span className="font-bold mr-2 text-cyan-300">{opt.label}.</span> {opt.text}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-white font-semibold"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default PsychometricTest; 