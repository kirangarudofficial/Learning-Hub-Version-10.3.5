import React from 'react';
import { Play, Star, Users, Award } from 'lucide-react';

export default function InstructorSpotlight() {
  const instructors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'AI Research Scientist',
      company: 'Google DeepMind',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      students: '2.1M+',
      courses: 12,
      expertise: ['Machine Learning', 'Deep Learning', 'Python'],
      bio: 'Former Stanford professor with 15+ years in AI research. Led breakthrough projects in computer vision.',
      videoIntro: true
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Full Stack Developer',
      company: 'Meta',
      image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      students: '1.8M+',
      courses: 24,
      expertise: ['React', 'Node.js', 'AWS'],
      bio: 'Senior engineer at Meta with expertise in scalable web applications. Passionate about teaching.',
      videoIntro: true
    },
    {
      id: 3,
      name: 'Emma Thompson',
      title: 'UX Design Lead',
      company: 'Apple',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      students: '950K+',
      courses: 8,
      expertise: ['UI/UX Design', 'Figma', 'Design Systems'],
      bio: 'Design lead at Apple with 10+ years creating intuitive user experiences for millions of users.',
      videoIntro: true
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Learn from Industry Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our instructors are practitioners from leading companies who bring real-world experience 
            and cutting-edge knowledge to every lesson.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {instructors.map((instructor) => (
            <div 
              key={instructor.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Instructor Image & Video */}
              <div className="relative">
                <img 
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {instructor.videoIntro && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transform hover:scale-110 transition-all duration-200 shadow-lg">
                      <Play className="w-6 h-6 text-blue-600 ml-1" />
                    </button>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{instructor.name}</h3>
                  <p className="text-sm text-gray-200">{instructor.title}</p>
                </div>
              </div>

              {/* Instructor Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>{instructor.company}</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {instructor.bio}
                </p>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.map((skill) => (
                      <span 
                        key={skill}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">{instructor.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-800">{instructor.students}</span>
                    </div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-800 mb-1">{instructor.courses}</div>
                    <div className="text-xs text-gray-500">Courses</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Courses
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become Instructor CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Share Your Expertise</h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our community of expert instructors and help millions of students learn new skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-200">
              Start Teaching
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}