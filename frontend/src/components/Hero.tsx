import React, { useState } from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const [quizStarted, setQuizStarted] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full translate-x-32 translate-y-32"></div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-200">
                <Sparkles size={20} />
                <span className="text-sm font-medium">AI-Powered Learning</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Master New Skills,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  Transform Your Career
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                Join millions of learners worldwide. Access expert-led courses, earn certificates, 
                and accelerate your professional growth with personalized learning paths.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl">
                <div className="flex items-center justify-center space-x-2">
                  <span>Explore Courses</span>
                  <ArrowRight size={20} />
                </div>
              </button>
              
              <button 
                onClick={() => setQuizStarted(true)}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles size={20} />
                  <span>Find My Path</span>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">12M+</div>
                <div className="text-blue-200 text-sm">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-200 text-sm">Expert Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-blue-200 text-sm">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Play className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">Complete React Developer Course</h3>
                    <p className="text-gray-600 text-sm">by Sarah Chen • 4.9★ (12,456 reviews)</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress: 68% complete</span>
                    <span>2h 34m remaining</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-2/3"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>12 modules completed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Certificate ready</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}