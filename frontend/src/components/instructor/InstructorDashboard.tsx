import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Star,
  Plus,
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react';
import { InstructorProfile, CourseAnalytics, InstructorEarnings } from '../../types/instructor';
import { Course } from '../../types';
import CreateCourse from './CreateCourse';
import { coursesService } from '../../services/coursesService';

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'analytics' | 'earnings' | 'messages'>('overview');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);

  // Load instructor's courses
  React.useEffect(() => {
    const courses = coursesService.getCoursesByInstructor('instructor-current');
    setInstructorCourses(courses);
  }, []);

  // Mock data - in real app, this would come from API
  const instructorProfile: InstructorProfile = {
    id: '1',
    userId: '1',
    bio: 'Experienced software developer with 10+ years in web development',
    expertise: ['JavaScript', 'React', 'Node.js', 'Python'],
    experience: '10+ years',
    education: ['BS Computer Science - MIT', 'MS Software Engineering - Stanford'],
    socialLinks: {
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    },
    rating: 4.8,
    totalStudents: 15420,
    totalCourses: 8,
    totalRevenue: 125000,
    isVerified: true,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date()
  };

  const earnings: InstructorEarnings = {
    totalEarnings: 125000,
    pendingPayouts: 2500,
    thisMonthEarnings: 8500,
    lastMonthEarnings: 7200,
    payoutHistory: [
      {
        id: '1',
        amount: 7200,
        date: new Date('2024-11-01'),
        status: 'completed',
        method: 'PayPal'
      },
      {
        id: '2',
        amount: 6800,
        date: new Date('2024-10-01'),
        status: 'completed',
        method: 'Bank Transfer'
      }
    ]
  };

  const handleCourseCreated = (course: Course) => {
    setInstructorCourses(prev => [...prev, course]);
    alert(`Course "${course.title}" created successfully!`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img
                src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Instructor"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your teaching overview.</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{instructorProfile.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{instructorProfile.totalStudents.toLocaleString()} students</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{instructorProfile.totalCourses} courses</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateCourse(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Course</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
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
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {instructorProfile.totalStudents.toLocaleString()}
                        </div>
                        <div className="text-gray-600">Total Students</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{instructorProfile.totalCourses}</div>
                        <div className="text-gray-600">Published Courses</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          ${earnings.thisMonthEarnings.toLocaleString()}
                        </div>
                        <div className="text-gray-600">This Month</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{instructorProfile.rating}</div>
                        <div className="text-gray-600">Average Rating</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">New student enrolled</p>
                        <p className="text-sm text-gray-600">Sarah Johnson enrolled in "Complete React Course"</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Star className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">New 5-star review</p>
                        <p className="text-sm text-gray-600">"Excellent course! Very well explained."</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">New Q&A question</p>
                        <p className="text-sm text-gray-600">Student asked about React hooks in lesson 5</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                  <button 
                    onClick={() => setShowCreateCourse(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Create New Course
                  </button>
                </div>

                <div className="space-y-4">
                  {instructorCourses.length > 0 ? (
                    instructorCourses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                              <p className="text-gray-600 mb-2">{course.description.substring(0, 80)}...</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{course.students} students</span>
                                <span>{course.rating} ⭐</span>
                                <span>${course.price}</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Published</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                            <button className="text-gray-600 hover:text-gray-700 font-medium">Analytics</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses yet</h3>
                      <p className="text-gray-600 mb-4">Create your first course to get started!</p>
                      <button 
                        onClick={() => setShowCreateCourse(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Create Your First Course</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-8">
                {/* Earnings Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Earnings</h3>
                    <div className="text-3xl font-bold text-green-600">
                      ${earnings.totalEarnings.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">All time</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">This Month</h3>
                    <div className="text-3xl font-bold text-blue-600">
                      ${earnings.thisMonthEarnings.toLocaleString()}
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      +{Math.round(((earnings.thisMonthEarnings - earnings.lastMonthEarnings) / earnings.lastMonthEarnings) * 100)}% from last month
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Payouts</h3>
                    <div className="text-3xl font-bold text-orange-600">
                      ${earnings.pendingPayouts.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Next payout: Dec 1</p>
                  </div>
                </div>

                {/* Payout History */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payout History</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">Method</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {earnings.payoutHistory.map((payout) => (
                          <tr key={payout.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">{payout.date.toLocaleDateString()}</td>
                            <td className="py-3 px-4 font-semibold">${payout.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">{payout.method}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                                payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payout.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
          </div>
        </div>
      </div>
      
      {/* Create Course Modal */}
      {showCreateCourse && (
        <CreateCourse 
          onClose={() => setShowCreateCourse(false)}
          onCourseCreated={handleCourseCreated}
        />
      )}
    </div>
  );
}
