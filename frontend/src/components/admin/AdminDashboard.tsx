import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Settings,
  AlertTriangle,
  FileText,
  BarChart3,
  UserCheck,
  Flag
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'content' | 'finances' | 'reports'>('overview');

  // Mock admin data
  const adminStats = {
    totalUsers: 125420,
    totalCourses: 8950,
    totalRevenue: 2450000,
    pendingReviews: 23,
    activeInstructors: 1250,
    monthlyGrowth: 12.5,
    flaggedContent: 8,
    supportTickets: 45
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'content', label: 'Content Moderation', icon: Shield },
    { id: 'finances', label: 'Financial Overview', icon: DollarSign },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Platform management and oversight</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{adminStats.pendingReviews} pending reviews</span>
              </div>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Flag className="w-4 h-4" />
                <span>{adminStats.flaggedContent} flagged items</span>
              </div>
            </div>
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
                  <span>Platform Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {adminStats.totalUsers.toLocaleString()}
                        </div>
                        <div className="text-gray-600">Total Users</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {adminStats.totalCourses.toLocaleString()}
                        </div>
                        <div className="text-gray-600">Total Courses</div>
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
                          ${(adminStats.totalRevenue / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-gray-600">Total Revenue</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          +{adminStats.monthlyGrowth}%
                        </div>
                        <div className="text-gray-600">Monthly Growth</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity & Alerts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 p-2 rounded-full">
                          <UserCheck className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">New instructor approved</p>
                          <p className="text-sm text-gray-600">Sarah Johnson's application approved</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Course published</p>
                          <p className="text-sm text-gray-600">"Advanced React Patterns" went live</p>
                          <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-red-100 p-2 rounded-full">
                          <Flag className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Content flagged</p>
                          <p className="text-sm text-gray-600">Course reported for inappropriate content</p>
                          <p className="text-xs text-gray-500">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Action Required</h2>
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-red-800">Content Reviews</h3>
                            <p className="text-sm text-red-600">{adminStats.pendingReviews} courses awaiting review</p>
                          </div>
                          <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                            Review
                          </button>
                        </div>
                      </div>

                      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-orange-800">Flagged Content</h3>
                            <p className="text-sm text-orange-600">{adminStats.flaggedContent} items need moderation</p>
                          </div>
                          <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
                            Moderate
                          </button>
                        </div>
                      </div>

                      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-blue-800">Support Tickets</h3>
                            <p className="text-sm text-blue-600">{adminStats.supportTickets} open tickets</p>
                          </div>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Search
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Joined</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50"
                              alt="User"
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-semibold">John Doe</div>
                              <div className="text-sm text-gray-600">john@example.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            Instructor
                          </span>
                        </td>
                        <td className="py-3 px-4">Jan 15, 2024</td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                            <button className="text-red-600 hover:text-red-700 text-sm">Suspend</button>
                          </div>
                        </td>
                      </tr>
                      {/* More user rows would be here */}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
          </div>
        </div>
      </div>
    </div>
  );
}