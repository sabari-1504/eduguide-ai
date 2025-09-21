import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, User, BookOpen, Target, MapPin, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '../types';
import EngineeringStreams from './EngineeringStreams';

interface AssessmentProps {
  setActiveSection: (section: string) => void;
  setStudentData: (data: Student) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ setActiveSection, setStudentData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    academicStage: '',
    stream: '',
    engineeringStream: '',
    marks: '',
    interests: [] as string[],
    location: '',
    budget: ''
  });

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      fields: ['name', 'age']
    },
    {
      id: 'academic',
      title: 'Academic Background',
      icon: BookOpen,
      fields: ['academicStage', 'stream', 'marks']
    },
    {
      id: 'interests',
      title: 'Interests & Goals',
      icon: Target,
      fields: ['interests']
    },
    {
      id: 'engineering',
      title: 'Engineering Stream',
      icon: BookOpen,
      fields: ['engineeringStream'],
      condition: () => formData.interests.some(interest => 
        interest === 'Technology' || interest === 'Engineering'
      )
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: MapPin,
      fields: ['location', 'budget']
    }
  ];

  const academicStages = [
    '10th Grade',
    '12th Grade',
    'Graduate',
    'Post Graduate',
    'Working Professional'
  ];

  const streams = [
    'Science (PCM)',
    'Science (PCB)',
    'Commerce',
    'Arts/Humanities',
    'Engineering',
    'Medical',
    'Management',
    'Other'
  ];

  const interestOptions = [
    'Technology',
    'Healthcare',
    'Business',
    'Arts & Design',
    'Engineering',
    'Research',
    'Education',
    'Finance',
    'Marketing',
    'Entrepreneurship'
  ];

  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Other'
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests;
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    handleInputChange('interests', newInterests);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const studentData: Student = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      academicStage: formData.academicStage,
      stream: formData.stream,
      marks: parseInt(formData.marks),
      interests: formData.interests,
      location: formData.location,
      budget: parseInt(formData.budget),
      createdAt: new Date()
    };
    
    setStudentData(studentData);
    localStorage.setItem('studentData', JSON.stringify(studentData));
    setActiveSection('recommendations');
  };

  const isStepValid = () => {
    const currentStepData = steps[currentStep];
    return currentStepData.fields.every(field => {
      if (field === 'interests') return formData.interests.length > 0;
      return formData[field as keyof typeof formData];
    });
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
                min="15"
                max="50"
              />
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Academic Stage
              </label>
              <select
                value={formData.academicStage}
                onChange={(e) => handleInputChange('academicStage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your current stage</option>
                {academicStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Stream
              </label>
              <select
                value={formData.stream}
                onChange={(e) => handleInputChange('stream', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your stream</option>
                {streams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Performance (%)
              </label>
              <input
                type="number"
                value={formData.marks}
                onChange={(e) => handleInputChange('marks', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your percentage/CGPA"
                min="40"
                max="100"
              />
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Your Areas of Interest (Choose multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map(interest => (
                  <motion.button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.interests.includes(interest)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'engineering':
        return (
          <EngineeringStreams
            onSelect={(stream) => {
              handleInputChange('engineeringStream', stream);
              handleNext();
            }}
          />
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select preferred location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget for Education (Annual in ₹)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your budget"
                min="50000"
                max="5000000"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      index <= currentStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <step.icon className="h-5 w-5" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 mt-2">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </motion.button>

              {currentStep < steps.length - 1 ? (
                <motion.button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isStepValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={isStepValid() ? { scale: 1.05 } : {}}
                  whileTap={isStepValid() ? { scale: 0.95 } : {}}
                >
                  <span>Next</span>
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isStepValid()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={isStepValid() ? { scale: 1.05 } : {}}
                  whileTap={isStepValid() ? { scale: 0.95 } : {}}
                >
                  <span>Get Recommendations</span>
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;