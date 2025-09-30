# EduGuide AI - Educational Guidance Platform

![EduGuide AI](https://img.shields.io/badge/EduGuide-AI-blue?style=for-the-badge&logo=graduation-cap)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Google-orange?style=for-the-badge&logo=firebase)

## 🎯 Overview

EduGuide AI is a comprehensive educational guidance platform that uses AI-powered recommendations to help students discover their ideal career paths and educational institutions. The platform combines psychometric testing, academic assessments, and personalized recommendations to provide tailored guidance for students.

## ✨ Key Features

### 🧠 AI-Powered Recommendations
- Personalized course and institution suggestions
- Brain dominance analysis (Left/Right/Balanced)
- Engineering domain recommendations based on psychometric results

### 📊 Comprehensive Assessment
- **Academic Assessment**: Profile details collection
- **Psychometric Test**: 15-question MCQ test
- **Memory Game**: Working memory evaluation
- **Attention Game**: Focus and reaction time testing
- **Logic Game**: Reasoning ability assessment

### 🗺️ Interactive Features
- **Map View**: Visual college exploration
- **College Comparison**: Side-by-side comparison tool
- **Search & Filter**: Advanced filtering options
- **AI Chat**: Conversational AI assistant

### 🔐 Secure Authentication
- Firebase Authentication
- Email verification via OTP
- Password reset functionality
- Secure user data storage

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend & Services
- **Firebase Authentication** - User management
- **Firebase Firestore** - NoSQL database
- **EmailJS** - Email services
- **Google Generative AI** - AI recommendations
- **ConvAI SDK** - Chat functionality

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Netlify** - Deployment and hosting

## 📁 Project Structure

```
eduguide-ai/
├── project/                 # Main React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── data/           # Static data files
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── dist/               # Built application
├── app.py                  # Python desktop component
└── README.md              # This file
```

## 🎮 User Flow

1. **Landing Page** - Introduction and authentication
2. **Registration/Login** - Account creation with OTP verification
3. **Academic Assessment** - Profile details collection
4. **Psychometric Test** - Comprehensive cognitive assessment
5. **Location Selection** - District preference setting
6. **Recommendations** - Personalized college suggestions
7. **Additional Features** - Map view, comparison, chat, etc.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- EmailJS account

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/sabari-1504/eduguide-ai.git
   cd eduguide-ai
   ```

2. **Install dependencies**
   ```bash
   cd project
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the project root
   - Add your Firebase configuration
   - Add EmailJS configuration
   - Add AI service API keys

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Add your configuration to `src/firebase.ts`

### EmailJS Setup
1. Create an EmailJS account
2. Configure email templates
3. Add service configuration to `src/utils/emailOTP.ts`

### AI Services
- Configure Google Generative AI API
- Set up ConvAI SDK for chat functionality
- Add DeepSeek API for additional AI features

## 📊 Features Breakdown

### Psychometric Assessment
- **Brain Dominance Analysis**: Determines thinking style (L/R/B)
- **Cognitive Games**: Memory, attention, and logic testing
- **Personalized Results**: Engineering domain recommendations

### College Recommendations
- **District-based Filtering**: Location-specific results
- **Preference Matching**: Based on user profile and test results
- **Scoring Algorithm**: Relevance-based ranking

### Interactive Tools
- **3D College Visualization**: Three.js integration
- **Interactive Maps**: Geographic college exploration
- **Comparison Matrix**: Side-by-side college analysis

## 🚀 Deployment

The application is configured for deployment on:
- **Netlify** (Primary hosting)
- **Firebase Hosting** (Alternative)
- **Vercel** (Compatible)

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy automatically on push to main branch

## 📈 Performance Features

- **Progressive Loading**: Optimized for fast initial load
- **Responsive Design**: Mobile-first approach
- **Caching Strategy**: Efficient data management
- **Code Splitting**: Optimized bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Sabari
- **Project**: EduGuide AI Educational Platform

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [Wiki](https://github.com/sabari-1504/eduguide-ai/wiki)
- **Issues**: [GitHub Issues](https://github.com/sabari-1504/eduguide-ai/issues)

## 📞 Support

For support, email support@eduguide-ai.com or create an issue on GitHub.

---

**Made with ❤️ for students seeking their perfect educational path**

