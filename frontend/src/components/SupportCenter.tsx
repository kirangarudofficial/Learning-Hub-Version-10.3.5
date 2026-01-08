import React, { useState } from 'react';
import { MessageCircle, HelpCircle, Phone, Mail, Search, Book, Video, Users } from 'lucide-react';

export default function SupportCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 24/7",
      action: "Start Chat",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Browse our comprehensive knowledge base",
      availability: "1000+ articles",
      action: "Browse Articles",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24h",
      action: "Send Email",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const quickLinks = [
    { icon: Book, title: "Getting Started Guide", category: "Basics" },
    { icon: Video, title: "How to Download Courses", category: "Mobile" },
    { icon: Users, title: "Account & Billing", category: "Account" },
    { icon: MessageCircle, title: "Technical Issues", category: "Technical" }
  ];

  const popularArticles = [
    "How to reset your password",
    "Downloading courses for offline viewing",
    "Getting certificates after course completion",
    "Refund and cancellation policy",
    "System requirements for courses"
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How Can We Help You?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get the support you need to make the most of your learning experience
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, tutorials, or common issues..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white mb-4 ${option.color.split(' ')[0]}`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-3 text-sm">{option.description}</p>
                <p className="text-xs text-gray-500 mb-4">{option.availability}</p>
                
                <button className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${option.color}`}>
                  {option.action}
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Links</h3>
            <div className="space-y-4">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{link.title}</h4>
                      <p className="text-sm text-gray-500">{link.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Articles</h3>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-1">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 hover:text-blue-600 transition-colors">
                    {article}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Technical Issue</option>
                  <option>Billing Question</option>
                  <option>Course Content</option>
                  <option>Account Help</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue or question..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Status & Community */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">System Status</h3>
            <p className="text-green-600 font-semibold mb-2">All Systems Operational</p>
            <p className="text-sm text-gray-600">Last updated: 2 minutes ago</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              View Status Page
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Community Forum</h3>
            <p className="text-gray-600 mb-4">Connect with other learners and get help from the community</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}