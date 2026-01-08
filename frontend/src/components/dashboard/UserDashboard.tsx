import React, { useState } from 'react';
import { User, BookOpen, Award, Clock, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCourses } from '../../data/mockCourses';
import GamificationDashboard from '../gamification/GamificationDashboard';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'learning' | 'profile' | 'certificates' | 'achievements'>('learning');

  // Mock enrolled courses (in real app, this would come from API)
  const enrolledCourses = mockCourses.slice(0, 2);

  const tabs = [
    { id: 'learning', label: 'My Learning', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'learning' && (
              <div className="space-y-8">
                {/* Gamification Section */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Level 8 Learner 🎯</h3>
                      <p className="text-purple-100">2,450 XP • 12-day streak 🔥</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">89%</div>
                      <div className="text-purple-100 text-sm">to next level</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-purple-700 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-[89%]"></div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{enrolledCourses.length}</div>
                        <div className="text-gray-600">Enrolled Courses</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Award className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">0</div>
                        <div className="text-gray-600">Certificates</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">24h</div>
                        <div className="text-gray-600">Learning Time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrolled Courses */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Continue Learning</h2>
                  
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No courses yet</h3>
                      <p className="text-gray-500">Start learning by enrolling in a course!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">by {course.instructor.name}</p>
                              
                              {/* Progress Bar */}
                              <div className="mb-3">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span>25%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
                                </div>
                              </div>
                              
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Continue Learning
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name?.split(' ')[0] || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name?.split(' ')[1] || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Certificates</h2>
                
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No certificates yet</h3>
                  <p className="text-gray-500">Complete courses to earn certificates!</p>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <GamificationDashboard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}