import React, { useState } from 'react';
import { Search, ShoppingCart, Bell, User, Globe, ChevronDown, Menu, BookOpen, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import CartSidebar from './cart/CartSidebar';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { name: 'Development', subcategories: ['Web Development', 'Mobile Apps', 'Programming Languages', 'Game Development'] },
    { name: 'Business', subcategories: ['Entrepreneurship', 'Finance', 'Marketing', 'Management'] },
    { name: 'Design', subcategories: ['UX/UI Design', 'Graphic Design', '3D Animation', 'Fashion Design'] },
    { name: 'Marketing', subcategories: ['Digital Marketing', 'Social Media', 'SEO', 'Content Marketing'] },
  ];

  const searchSuggestions = [
    { type: 'course', title: 'Complete React Developer Course', instructor: 'by Sarah Chen' },
    { type: 'topic', title: 'JavaScript Fundamentals', count: '1,234 courses' },
    { type: 'instructor', title: 'Dr. Angela Yu', courses: '12 courses' },
    { type: 'skill', title: 'Machine Learning', trending: true }
  ];
  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">LearnHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  <span className="font-medium">Categories</span>
                  <ChevronDown size={16} />
                </button>
                
                {/* Mega Dropdown */}
                {isCategoryOpen && (
                  <div 
                    className="absolute top-full left-0 w-96 bg-white shadow-xl border border-gray-200 rounded-lg mt-2 p-6"
                    onMouseEnter={() => setIsCategoryOpen(true)}
                    onMouseLeave={() => setIsCategoryOpen(false)}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {categories.map((category) => (
                        <div key={category.name}>
                          <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                          <ul className="space-y-1">
                            {category.subcategories.map((sub) => (
                              <li key={sub}>
                                <button 
                                  onClick={() => navigate(`/courses?category=${encodeURIComponent(sub)}`)}
                                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors text-left w-full"
                                >
                                  {sub}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                placeholder="Search for courses, instructors, or topics..."
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={() => searchQuery && navigate(`/courses?search=${encodeURIComponent(searchQuery)}`)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 flex items-center space-x-1"
              >
                <Search size={20} />
                <Sparkles size={16} className="text-blue-500" />
              </button>
              
              {/* Search Suggestions */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-3">Popular searches</div>
                    {searchSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        onClick={() => {
                          setShowSearchSuggestions(false);
                          if (suggestion.type === 'course') {
                            navigate(`/courses?search=${encodeURIComponent(suggestion.title)}`);
                          } else if (suggestion.type === 'topic') {
                            navigate(`/courses?topic=${encodeURIComponent(suggestion.title)}`);
                          } else if (suggestion.type === 'instructor') {
                            navigate(`/courses?instructor=${encodeURIComponent(suggestion.title)}`);
                          } else {
                            navigate(`/courses?skill=${encodeURIComponent(suggestion.title)}`);
                          }
                        }}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          suggestion.type === 'course' ? 'bg-blue-100 text-blue-600' :
                          suggestion.type === 'topic' ? 'bg-green-100 text-green-600' :
                          suggestion.type === 'instructor' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {suggestion.type === 'course' ? '📚' :
                           suggestion.type === 'topic' ? '🎯' :
                           suggestion.type === 'instructor' ? '👨‍🏫' : '⚡'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 flex items-center">
                            {suggestion.title}
                            {suggestion.trending && (
                              <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">Trending</span>
                            )}
                          </div>
                          {(suggestion.instructor || suggestion.count || suggestion.courses) && (
                            <div className="text-sm text-gray-500">
                              {suggestion.instructor || suggestion.count || suggestion.courses}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => console.log('Language selector clicked - implement language menu')}
              className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm">EN</span>
            </button>

            <div className="hidden md:flex items-center space-x-2">
              <button 
                onClick={() => {
                  console.log('For Learners clicked!');
                  navigate('/courses?target=individuals');
                }}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                For Learners
              </button>
              <button 
                onClick={() => navigate('/courses?target=teams')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                For Teams
              </button>
              <button 
                onClick={() => navigate('/instructor')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Teach on LearnHub
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowCart(true)}
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => console.log('Notifications clicked - implement notifications panel')}
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </button>

              {user ? (
                <div className="hidden md:flex items-center space-x-2 relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My Learning</Link>
                      {user.role === 'instructor' && (
                        <Link to="/instructor" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Instructor Dashboard</Link>
                      )}
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                      )}
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</Link>
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</Link>
                      <hr className="my-2" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => setShowSignup(true)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}

              <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Search size={16} className="text-gray-500" />
                  <Sparkles size={14} className="text-blue-500" />
                </div>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/courses');
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Categories
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/courses?target=individuals');
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  For Learners
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/courses?target=teams');
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  For Teams
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/instructor');
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Teach on LearnHub
                </button>
              </div>
              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                {user ? (
                  <div className="w-full space-y-2">
                    <div className="flex items-center space-x-2 px-2 py-2">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full py-2 text-red-600 border border-red-600 rounded-lg font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowLogin(true)}
                      className="flex-1 py-2 text-blue-600 border border-blue-600 rounded-lg font-medium"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={() => setShowSignup(true)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          navigate('/checkout');
        }}
      />
      
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </header>
  );
}