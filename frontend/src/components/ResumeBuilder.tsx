import React from 'react';
import { FileText, Download, Star, Award, TrendingUp, CheckCircle } from 'lucide-react';

export default function ResumeBuilder() {
  const features = [
    {
      icon: Award,
      title: "Showcase Certificates",
      description: "Automatically add your completed courses and certificates"
    },
    {
      icon: TrendingUp,
      title: "Skills Tracking",
      description: "Display your mastered skills with proficiency levels"
    },
    {
      icon: Star,
      title: "Professional Templates",
      description: "Choose from ATS-friendly, industry-specific templates"
    },
    {
      icon: CheckCircle,
      title: "AI Optimization",
      description: "Get AI-powered suggestions to improve your resume"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Resume Builder</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                Turn Your Learning Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Career Success
                </span>
              </h2>
              
              <p className="text-xl text-gray-600">
                Create a professional resume that highlights your newly acquired skills 
                and certifications. Stand out to employers with our AI-powered resume builder.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Build My Resume</span>
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors">
                View Templates
              </button>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Join 250K+ professionals</p>
                  <p className="text-sm text-gray-600">who built their resume with us</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Resume Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-800">Sarah Johnson</h3>
                  <p className="text-gray-600">Full Stack Developer</p>
                  <p className="text-sm text-gray-500">sarah.johnson@email.com • (555) 123-4567</p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
                      <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Certifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Complete React Developer - LearnHub</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Google Data Analytics Certificate</span>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Experience</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800">Junior Developer</h5>
                      <p className="text-sm text-gray-600">TechStart Inc. • 2023 - Present</p>
                      <p className="text-xs text-gray-500 mt-1">Built responsive web applications using React and Node.js</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-full shadow-lg">
              <Download className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}