import React from 'react';
import { Star, Quote, Play, Briefcase, TrendingUp } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Software Engineer',
      company: 'Microsoft',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      story: 'I transitioned from marketing to software development in just 8 months thanks to LearnHub. The hands-on projects and mentor support made all the difference.',
      outcome: 'Career Switch',
      salaryIncrease: '+150%',
      rating: 5,
      coursesCompleted: 12,
      hasVideo: true
    },
    {
      id: 2,
      name: 'Maria Garcia',
      role: 'Data Scientist',
      company: 'Google',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      story: 'The machine learning specialization gave me the confidence to apply for my dream job at Google. The practical approach to complex topics was incredible.',
      outcome: 'Promotion',
      salaryIncrease: '+75%',
      rating: 5,
      coursesCompleted: 8,
      hasVideo: true
    },
    {
      id: 3,
      name: 'David Kim',
      role: 'Startup Founder',
      company: 'TechStart Inc.',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      story: 'LearnHub business courses taught me everything I needed to launch my startup. From product development to marketing strategy - it was my MBA alternative.',
      outcome: 'Started Business',
      salaryIncrease: 'Founded $2M startup',
      rating: 5,
      coursesCompleted: 15,
      hasVideo: false
    }
  ];

  const stats = [
    { label: 'Career Transitions', value: '87%', description: 'of learners advance their career within 6 months' },
    { label: 'Salary Increase', value: '65%', description: 'average salary increase after completion' },
    { label: 'Job Placement', value: '92%', description: 'of certificate graduates get hired within 6 months' }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Real Stories, Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our learners have transformed their careers and achieved their goals
          </p>
        </div>

        {/* Success Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
              <div className="text-gray-600 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-blue-200">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Story */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.story}"
              </p>

              {/* Profile */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  {testimonial.hasVideo && (
                    <button className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </button>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <p className="text-blue-600 text-sm font-medium">{testimonial.company}</p>
                </div>
              </div>

              {/* Outcome Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {testimonial.outcome === 'Career Switch' && <Briefcase className="w-4 h-4 text-green-600" />}
                    {testimonial.outcome === 'Promotion' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                    {testimonial.outcome === 'Started Business' && <Star className="w-4 h-4 text-purple-600" />}
                    <span className="text-sm font-semibold text-gray-800">{testimonial.outcome}</span>
                  </div>
                  <span className="text-sm text-green-600 font-bold">{testimonial.salaryIncrease}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Completed {testimonial.coursesCompleted} courses
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonial Feature */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Watch More Success Stories</h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Hear directly from learners who transformed their careers with our courses
            </p>
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 mx-auto">
              <Play className="w-5 h-5" />
              <span>Watch Video Stories</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}