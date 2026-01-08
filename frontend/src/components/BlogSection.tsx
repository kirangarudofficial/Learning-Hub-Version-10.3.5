import React from 'react';
import { Calendar, User, ArrowRight, TrendingUp, BookOpen, Award } from 'lucide-react';

export default function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: "10 High-Paying Tech Jobs You Can Land in 2024",
      excerpt: "Discover the most in-demand tech roles and the skills you need to get hired.",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Career Advice",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true
    },
    {
      id: 2,
      title: "From Barista to Data Scientist: Maria's Success Story",
      excerpt: "How Maria transformed her career in 8 months with our Data Science program.",
      author: "Mike Chen",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      category: "Success Stories",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 3,
      title: "Teaching Online: 5 Tips from Top Instructors",
      excerpt: "Learn from our highest-rated instructors on creating engaging online courses.",
      author: "Emma Davis",
      date: "Dec 10, 2024",
      readTime: "4 min read",
      category: "Instructor Tips",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    }
  ];

  const categories = [
    { name: "Career Advice", icon: TrendingUp, count: 45, color: "text-blue-600 bg-blue-100" },
    { name: "Success Stories", icon: Award, count: 32, color: "text-green-600 bg-green-100" },
    { name: "Instructor Tips", icon: BookOpen, count: 28, color: "text-purple-600 bg-purple-100" }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Career insights, success stories, and learning tips from our community
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <div className="mb-12">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {blogPosts[0].category}
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors cursor-pointer">
                      {blogPosts[0].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{blogPosts[0].author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{blogPosts[0].date}</span>
                        </div>
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                      
                      <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 group">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Posts */}
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.slice(1).map((post) => (
                <div 
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.category === 'Success Stories' ? 'bg-green-100 text-green-800' :
                        post.category === 'Instructor Tips' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div 
                      key={category.name}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get the latest career tips and success stories delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Popular This Week</h3>
              <div className="space-y-4">
                {[
                  "Complete Guide to Remote Work",
                  "AI Skills Every Professional Needs",
                  "Building Your Personal Brand"
                ].map((title, index) => (
                  <div key={index} className="flex items-start space-x-3 cursor-pointer group">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
            View All Articles
          </button>
        </div>
      </div>
    </div>
  );
}