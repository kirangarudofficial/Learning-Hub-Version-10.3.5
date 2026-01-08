import React from 'react';
import { Award, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProfessionalCertificates() {
  const certificates = [
    {
      id: 1,
      title: 'Google Data Analytics Professional Certificate',
      provider: 'Google',
      logo: '🔵',
      duration: '6 months',
      courses: 8,
      skills: ['Data Analysis', 'R Programming', 'SQL', 'Tableau'],
      learners: '2.1M+',
      jobReady: true,
      level: 'Beginner',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'IBM Full Stack Software Developer',
      provider: 'IBM',
      logo: '🔷',
      duration: '4 months',
      courses: 12,
      skills: ['JavaScript', 'React', 'Node.js', 'Docker'],
      learners: '1.8M+',
      jobReady: true,
      level: 'Intermediate',
      image: 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'Meta Social Media Marketing',
      provider: 'Meta',
      logo: '🔷',
      duration: '5 months',
      courses: 6,
      skills: ['Facebook Ads', 'Instagram Marketing', 'Analytics', 'Strategy'],
      learners: '950K+',
      jobReady: true,
      level: 'Beginner',
      image: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Professional Certificates & Specializations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry-aligned programs designed by leading companies. 
            Build job-ready skills and earn credentials that matter to employers.
          </p>
        </div>

        <div className="space-y-8">
          {certificates.map((cert, index) => (
            <div 
              key={cert.id}
              className={`bg-gradient-to-r ${
                index === 0 ? 'from-blue-50 to-cyan-50' :
                index === 1 ? 'from-purple-50 to-pink-50' :
                'from-green-50 to-teal-50'
              } rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100`}
            >
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  {/* Left Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{cert.logo}</div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                          {cert.title}
                        </h3>
                        <p className="text-gray-600 font-medium">by {cert.provider}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{cert.duration} to complete</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{cert.courses} courses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700">{cert.learners} enrolled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                        <span className="text-gray-700">{cert.level} level</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Skills you'll gain:</h4>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill) => (
                          <span 
                            key={skill}
                            className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {cert.jobReady && (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">🎯 Industry-aligned & Job-ready</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                        <span>Start Specialization</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative">
                    <img 
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to advance your career?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of learners who have transformed their careers with our professional certificates
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200">
              Browse All Certificates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}