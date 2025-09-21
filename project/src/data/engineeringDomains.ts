export interface Course {
  name: string;
  description?: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  courses: Course[];
}

export const engineeringDomains: Domain[] = [
  {
    id: "core-engineering",
    name: "Core Engineering",
    description: "Fundamental engineering disciplines that form the backbone of engineering education",
    courses: [
      { name: "Civil Engineering" },
      { name: "Mechanical Engineering" },
      { name: "Electrical and Electronics Engineering" },
      { name: "Electronics and Communication Engineering" },
      { name: "Computer Science and Engineering" },
      { name: "Information Technology" }
    ]
  },
  {
    id: "electrical-electronics-instrumentation",
    name: "Electrical, Electronics & Instrumentation",
    description: "Specialized fields focusing on electrical systems, electronics, and measurement technologies",
    courses: [
      { name: "Electronics and Instrumentation Engineering" },
      { name: "Instrumentation and Control Engineering" },
      { name: "Medical Electronics Engineering" },
      { name: "Robotics and Automation" },
      { name: "Mechatronics Engineering" }
    ]
  },
  {
    id: "computer-science-emerging-tech",
    name: "Computer Science & Emerging Technologies",
    description: "Cutting-edge technology fields including AI, cybersecurity, and modern computing",
    courses: [
      { name: "Artificial Intelligence and Data Science" },
      { name: "Artificial Intelligence and Machine Learning" },
      { name: "Cyber Security" },
      { name: "Internet of Things (IoT)" },
      { name: "Computer Science and Business Systems" },
      { name: "Information and Communication Technology (ICT)" },
      { name: "Software Engineering" }
    ]
  },
  {
    id: "mechanical-manufacturing-industrial",
    name: "Mechanical, Manufacturing & Industrial Sciences",
    description: "Engineering disciplines focused on manufacturing, production, and industrial processes",
    courses: [
      { name: "Automobile Engineering" },
      { name: "Aeronautical Engineering" },
      { name: "Aerospace Engineering" },
      { name: "Marine Engineering" },
      { name: "Industrial Engineering" },
      { name: "Manufacturing Engineering" },
      { name: "Mining Engineering" },
      { name: "Petroleum Engineering" },
      { name: "Safety and Fire Engineering" },
      { name: "Material Science and Engineering" }
    ]
  },
  {
    id: "chemical-allied-sciences",
    name: "Chemical & Allied Sciences",
    description: "Engineering fields dealing with chemical processes, materials, and related technologies",
    courses: [
      { name: "Chemical Engineering" },
      { name: "Petrochemical Engineering" },
      { name: "Pharmaceutical Engineering / Pharmaceutical Technology" },
      { name: "Food Technology" },
      { name: "Plastic / Polymer Technology" },
      { name: "Textile Technology (incl. Handloom & Textile Technology)" },
      { name: "Fashion Technology" }
    ]
  },
  {
    id: "biological-life-sciences",
    name: "Biological & Life Sciences",
    description: "Interdisciplinary fields combining biology with engineering principles",
    courses: [
      { name: "Biomedical Engineering" },
      { name: "Biotechnology" },
      { name: "Genetic Engineering" },
      { name: "Agricultural Engineering" }
    ]
  },
  {
    id: "environmental-earth-sciences",
    name: "Environmental & Earth Sciences",
    description: "Engineering disciplines focused on environmental protection and earth sciences",
    courses: [
      { name: "Environmental Engineering" },
      { name: "Geo-Informatics Engineering" }
    ]
  }
];

// Mapping psychometric results to recommended domains
export const getRecommendedDomains = (psychometricType: 'L' | 'R' | 'B'): Domain[] => {
  switch (psychometricType) {
    case 'L': // Left-brain dominant - analytical, logical
      return [
        engineeringDomains[0], // Core Engineering
        engineeringDomains[1], // Electrical, Electronics & Instrumentation
        engineeringDomains[3], // Mechanical, Manufacturing & Industrial Sciences
        engineeringDomains[4], // Chemical & Allied Sciences
        engineeringDomains[6]  // Environmental & Earth Sciences
      ];
    case 'R': // Right-brain dominant - creative, intuitive
      return [
        engineeringDomains[2], // Computer Science & Emerging Technologies
        engineeringDomains[1], // Electrical, Electronics & Instrumentation
        engineeringDomains[5], // Biological & Life Sciences
        engineeringDomains[4]  // Chemical & Allied Sciences
      ];
    case 'B': // Balanced - both analytical and creative
      return engineeringDomains; // All domains
    default:
      return engineeringDomains;
  }
};
