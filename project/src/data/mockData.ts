import { Course, Institution } from '../types';

export const courses: Course[] = [
  {
    id: '1',
    name: 'Computer Science Engineering',
    category: 'Engineering',
    duration: '4 years',
    eligibility: 'PCM with 60%+',
    averageFees: 400000,
    careerProspects: ['Software Engineer', 'Data Scientist', 'AI Specialist', 'Product Manager'],
    demandScore: 95,
    description: 'Comprehensive program covering programming, algorithms, and emerging technologies.'
  },
  {
    id: '2',
    name: 'Business Administration (MBA)',
    category: 'Management',
    duration: '2 years',
    eligibility: 'Graduate with 50%+',
    averageFees: 800000,
    careerProspects: ['Business Analyst', 'Operations Manager', 'Consultant', 'Entrepreneur'],
    demandScore: 88,
    description: 'Strategic business education with focus on leadership and management skills.'
  },
  {
    id: '3',
    name: 'Medicine (MBBS)',
    category: 'Medical',
    duration: '5.5 years',
    eligibility: 'PCB with 70%+',
    averageFees: 1500000,
    careerProspects: ['Doctor', 'Surgeon', 'Medical Researcher', 'Healthcare Administrator'],
    demandScore: 92,
    description: 'Comprehensive medical education with clinical training and research opportunities.'
  },
  {
    id: '4',
    name: 'Data Science',
    category: 'Technology',
    duration: '3 years',
    eligibility: 'PCM with 55%+',
    averageFees: 350000,
    careerProspects: ['Data Analyst', 'ML Engineer', 'Research Scientist', 'Business Intelligence'],
    demandScore: 90,
    description: 'Advanced analytics, machine learning, and statistical modeling program.'
  },
  {
    id: '5',
    name: 'Digital Marketing',
    category: 'Marketing',
    duration: '1 year',
    eligibility: 'Any Graduate',
    averageFees: 150000,
    careerProspects: ['Digital Marketer', 'SEO Specialist', 'Content Strategist', 'Social Media Manager'],
    demandScore: 85,
    description: 'Modern marketing strategies focused on digital platforms and analytics.'
  },
  {
    id: '6',
    name: 'Mechanical Engineering',
    category: 'Engineering',
    duration: '4 years',
    eligibility: 'PCM with 60%+',
    averageFees: 380000,
    careerProspects: ['Design Engineer', 'Manufacturing Engineer', 'Project Manager', 'Research Engineer'],
    demandScore: 82,
    description: 'Traditional engineering discipline with modern manufacturing and design focus.'
  }
];

export const institutions: Institution[] = [
  {
    id: '1',
    name: 'Indian Institute of Technology Delhi',
    type: 'Government',
    location: 'New Delhi',
    rating: 9.2,
    fees: 200000,
    courses: ['Computer Science Engineering', 'Mechanical Engineering'],
    admissionRate: 2.5,
    placementRate: 95,
    established: 1961,
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    name: 'Indian Institute of Management Bangalore',
    type: 'Government',
    location: 'Bangalore',
    rating: 9.5,
    fees: 2400000,
    courses: ['Business Administration (MBA)'],
    admissionRate: 1.8,
    placementRate: 98,
    established: 1973,
    image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    name: 'All India Institute of Medical Sciences',
    type: 'Government',
    location: 'New Delhi',
    rating: 9.8,
    fees: 80000,
    courses: ['Medicine (MBBS)'],
    admissionRate: 0.8,
    placementRate: 100,
    established: 1956,
    image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    name: 'Indian Statistical Institute',
    type: 'Government',
    location: 'Kolkata',
    rating: 8.9,
    fees: 150000,
    courses: ['Data Science'],
    admissionRate: 5.2,
    placementRate: 92,
    established: 1931,
    image: 'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    name: 'MICA Ahmedabad',
    type: 'Private',
    location: 'Ahmedabad',
    rating: 8.5,
    fees: 1800000,
    courses: ['Digital Marketing'],
    admissionRate: 8.5,
    placementRate: 88,
    established: 1991,
    image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '6',
    name: 'Birla Institute of Technology',
    type: 'Private',
    location: 'Pilani',
    rating: 8.7,
    fees: 450000,
    courses: ['Computer Science Engineering', 'Mechanical Engineering'],
    admissionRate: 12.5,
    placementRate: 85,
    established: 1964,
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];