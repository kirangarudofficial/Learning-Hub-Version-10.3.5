import React from 'react';
import { Code, Briefcase, Palette, TrendingUp, Camera, Music, Languages, Heart } from 'lucide-react';

export default function CourseCategories() {
  const categories = [
    { icon: Code, name: 'Development', courses: '15,240', color: 'from-blue-500 to-cyan-500' },
    { icon: Briefcase, name: 'Business', courses: '8,960', color: 'from-green-500 to-emerald-500' },
    { icon: Palette, name: 'Design', courses: '6,780', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, name: 'Marketing', courses: '4,320', color: 'from-orange-500 to-red-500' },
    { icon: Camera, name: 'Photography', courses: '2,150', color: 'from-indigo-500 to-purple-500' },
    { icon: Music, name: 'Music', courses: '1,890', color: 'from-yellow-500 to-orange-500' },
    { icon: Languages, name: 'Languages', courses: '3,670', color: 'from-teal-500 to-green-500' },
    { icon: Heart, name: 'Health & Wellness', courses: '2,540', color: 'from-pink-500 to-red-500' },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Explore Courses by Topic
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our vast library of courses across multiple disciplines. 
            Start learning today and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.name}
                className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {category.courses} courses
                  </p>
                  
                  <button className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200">
                    <span>Browse</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div className={`h-1 bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}