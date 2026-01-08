import React, { useState } from 'react';
import { Brain, ArrowRight, CheckCircle, Target, TrendingUp, Code, Briefcase, Palette } from 'lucide-react';

// --- Data moved outside the component ---
// This data is constant and doesn't need to be redefined on every render, which improves performance.
const QUESTIONS = [
  {
    question: "What's your current experience level?",
    options: ["Complete beginner", "Some experience", "Intermediate", "Advanced"]
  },
  {
    question: "Which area interests you most?",
    options: ["Technology & Programming", "Business & Marketing", "Design & Creative", "Data & Analytics"]
  },
  {
    question: "What's your primary goal?",
    options: ["Career change", "Skill advancement", "Promotion", "Start a business"]
  },
  {
    question: "How much time can you dedicate weekly?",
    options: ["1-3 hours", "4-6 hours", "7-10 hours", "10+ hours"]
  }
];

const CAREER_PATHS = {
  "Technology & Programming": {
    title: "Full Stack Developer",
    icon: Code,
    duration: "6-8 months",
    courses: 12,
    skills: ["JavaScript", "React", "Node.js", "Databases"],
    salary: "$75,000 - $120,000",
    color: "from-blue-500 to-cyan-500"
  },
  "Business & Marketing": {
    title: "Digital Marketing Specialist",
    icon: Briefcase,
    duration: "4-6 months",
    courses: 8,
    skills: ["SEO", "Social Media", "Analytics", "Content Strategy"],
    salary: "$50,000 - $85,000",
    color: "from-green-500 to-emerald-500"
  },
  "Design & Creative": {
    title: "UX/UI Designer",
    icon: Palette,
    duration: "5-7 months",
    courses: 10,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    salary: "$60,000 - $100,000",
    color: "from-purple-500 to-pink-500"
  },
  "Data & Analytics": {
    title: "Data Analyst",
    icon: TrendingUp,
    duration: "4-6 months",
    courses: 9,
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    salary: "$65,000 - $95,000",
    color: "from-orange-500 to-red-500"
  }
};

// Define a type for the keys of CAREER_PATHS for better type safety
type CareerPathKey = keyof typeof CAREER_PATHS;

export default function CareerFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  const getRecommendedPath = () => {
    // A more robust recommendation logic based on a simple scoring system.
    const scores: Record<CareerPathKey, number> = {
      "Technology & Programming": 0,
      "Business & Marketing": 0,
      "Design & Creative": 0,
      "Data & Analytics": 0,
    };

    // Q1: Experience level
    const experience = answers[0];
    if (experience === "Complete beginner" || experience === "Some experience") {
      scores["Technology & Programming"] += 1;
      scores["Design & Creative"] += 1;
    }

    // Q2: Interest (most important)
    const interest = answers[1] as CareerPathKey;
    if (scores[interest] !== undefined) {
      scores[interest] += 5; // Heavily weight the direct interest
    }

    // Q3: Goal
    const goal = answers[2];
    if (goal === "Career change" || goal === "Skill advancement") {
      scores["Technology & Programming"] += 2;
      scores["Data & Analytics"] += 2;
    }
    if (goal === "Start a business") {
      scores["Business & Marketing"] += 2;
    }

    // Find the path with the highest score
    let recommendedPathKey = "Technology & Programming" as CareerPathKey;
    let maxScore = -1;
    for (const path in scores) {
      if (scores[path as CareerPathKey] > maxScore) {
        maxScore = scores[path as CareerPathKey];
        recommendedPathKey = path as CareerPathKey;
      }
    }
    return CAREER_PATHS[recommendedPathKey];
  };

  if (showResults) {
    const recommendedPath = getRecommendedPath();
    const Icon = recommendedPath.icon;

    return (
      <div className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Career Path Recommended!</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Your Personalized Learning Path
              </h2>
            </div>

            <div className={`bg-gradient-to-r ${recommendedPath.color} rounded-2xl p-8 text-white mb-8`}>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">{recommendedPath.title}</h3>
                      <p className="text-white/80">Based on your preferences</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold">{recommendedPath.duration}</div>
                      <div className="text-white/80 text-sm">Estimated time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{recommendedPath.courses}</div>
                      <div className="text-white/80 text-sm">Courses included</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Skills you'll master:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendedPath.skills.map((skill) => (
                        <span key={skill} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-lg font-semibold mb-6">
                    💰 Expected Salary: {recommendedPath.salary}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <Target className="w-16 h-16 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Perfect Match!</h4>
                    <p className="text-white/80">This path aligns with your goals and experience level</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Start Learning Path
              </button>
              <div>
                <button 
                  onClick={resetQuiz}
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  Take quiz again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-4">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">AI-Powered Career Finder</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Find Your Perfect Learning Path
            </h2>
            <p className="text-xl text-gray-600">
              Answer a few questions and get personalized course recommendations
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {QUESTIONS[currentStep].question}
              </h3>
              
              <div className="space-y-3">
                {QUESTIONS[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 group-hover:text-indigo-600">
                        {option}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {currentStep > 0 && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  ← Previous Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}