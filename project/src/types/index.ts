export interface Student {
  id: string;
  name: string;
  age: number;
  academicStage: string;
  stream: string;
  engineeringStream?: string;
  marks: number;
  interests: string[];
  location: string;
  budget: number;
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  category: string;
  duration: string;
  eligibility: string;
  averageFees: number;
  careerProspects: string[];
  demandScore: number;
  description: string;
}

export interface Institution {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  fees: number;
  courses: string[];
  admissionRate: number;
  placementRate: number;
  established: number;
  image: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Recommendation {
  course: Course;
  institution: Institution;
  matchScore: number;
  reasons: string[];
}