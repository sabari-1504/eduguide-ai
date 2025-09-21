// User Profile Types
export interface UserProfile {
  id: string;
  personalDetails: PersonalDetails;
  academicBackground: AcademicBackground;
  interests: Interests;
  financialInfo: FinancialInfo;
  institutionalPreferences: InstitutionalPreferences;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: Date;
  gender?: 'Male' | 'Female' | 'Other';
  email: string;
  mobile: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
}

export interface AcademicBackground {
  currentStage: '10th' | '12th' | 'Diploma' | 'UG' | 'PG';
  stream: 'Science' | 'Commerce' | 'Arts' | 'Other';
  board: string;
  marks: {
    overall: number;
    subjects: {
      [subject: string]: number;
    };
  };
  entranceExams?: {
    name: string;
    score: number;
    year: number;
  }[];
  achievements?: string[];
}

export interface Interests {
  areasOfInterest: string[];
  favoriteSubjects: string[];
  hobbies: string[];
  careerAspirations: string[];
  willingToRelocate: boolean;
}

export interface FinancialInfo {
  familyIncomeRange: string;
  educationBudget: number;
  needsScholarship: boolean;
  institutionTypePreference: 'Government' | 'Private' | 'Both';
}

export interface InstitutionalPreferences {
  preferredType: ('Government' | 'Private' | 'Deemed' | 'Autonomous')[];
  learningMode: ('Online' | 'Offline' | 'Hybrid')[];
  campusType: ('Urban' | 'Rural' | 'Residential')[];
  interestedInInternational: boolean;
}

export interface ApplicationStatus {
  readyToApply: boolean;
  appliedInstitutions: string[];
  documentsReady: {
    marksheet: boolean;
    id: boolean;
    transferCertificate: boolean;
    otherDocuments: string[];
  };
}

// Course and Institution Types
export interface Course {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  duration: string;
  level: 'UG' | 'PG' | 'Diploma' | 'Certificate';
  eligibility: {
    academicRequirements: string;
    entranceExams?: string[];
    minimumMarks: number;
  };
  fees: {
    tuition: number;
    other: number;
    total: number;
  };
  careerProspects: {
    roles: string[];
    averageSalary: number;
    demandScore: number;
  };
  skills: string[];
  description: string;
  isEmerging: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Institution {
  id: string;
  name: string;
  type: 'Government' | 'Private' | 'Deemed' | 'Autonomous';
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
  };
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  academic: {
    rating: number;
    accreditation: string[];
    established: number;
    courses: string[]; // Course IDs
    admissionRate: number;
    placementRate: number;
  };
  infrastructure: {
    campusSize: string;
    campusType: 'Urban' | 'Rural' | 'Residential';
    facilities: string[];
    hostels: boolean;
    sports: boolean;
  };
  financial: {
    fees: {
      tuition: number;
      hostel: number;
      other: number;
    };
    scholarships: {
      name: string;
      description: string;
      amount: number;
    }[];
  };
  admission: {
    process: string;
    cutoffTrends: {
      year: number;
      score: number;
    }[];
    documents: string[];
  };
  placement: {
    averagePackage: number;
    highestPackage: number;
    companies: string[];
    sectors: string[];
  };
  reviews: {
    rating: number;
    count: number;
    feedback: {
      id: string;
      userId: string;
      rating: number;
      comment: string;
      date: Date;
    }[];
  };
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Recommendation Types
export interface CourseRecommendation {
  id: string;
  userId: string;
  courseId: string;
  matchScore: number;
  reasons: string[];
  careerProspects: string[];
  skillsToDevelop: string[];
  createdAt: Date;
}

export interface InstitutionRecommendation {
  id: string;
  userId: string;
  institutionId: string;
  courseId: string;
  matchScore: number;
  admissionProbability: 'High' | 'Medium' | 'Low';
  reasons: string[];
  financialFeasibility: {
    totalCost: number;
    suggestedScholarships: string[];
    loanOptions: string[];
  };
  createdAt: Date;
}

// Financial Aid Types
export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: 'Merit' | 'Need' | 'Sports' | 'Other';
  amount: number;
  eligibility: {
    academicRequirements: string;
    incomeLimit?: number;
    otherCriteria: string[];
  };
  applicationProcess: string;
  deadline: Date;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationLoan {
  id: string;
  provider: string;
  type: string;
  interestRate: number;
  maxAmount: number;
  tenure: number;
  eligibility: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  recommendations: {
    courses: CourseRecommendation[];
    institutions: InstitutionRecommendation[];
  };
  interactions: {
    viewedCourses: string[];
    viewedInstitutions: string[];
    savedItems: string[];
    appliedInstitutions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
} 