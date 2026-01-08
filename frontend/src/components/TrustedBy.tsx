import React from 'react';

export default function TrustedBy() {
  const companies = [
    { name: 'Google', logo: '🔵' },
    { name: 'Microsoft', logo: '🟦' },
    { name: 'Amazon', logo: '🟠' },
    { name: 'Apple', logo: '⚪' },
    { name: 'Meta', logo: '🔷' },
    { name: 'Netflix', logo: '🔴' },
    { name: 'Tesla', logo: '⚡' },
    { name: 'IBM', logo: '🔷' },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Trusted by learners from leading companies worldwide
          </h2>
          <p className="text-gray-600">Join professionals from 190+ countries advancing their careers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {companies.map((company) => (
            <div 
              key={company.name}
              className="flex flex-col items-center space-y-2 group cursor-pointer"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {company.logo}
              </div>
              <span className="text-sm text-gray-600 font-medium">{company.name}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-md">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-gray-700 font-semibold">12M+ learners from 190+ countries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}