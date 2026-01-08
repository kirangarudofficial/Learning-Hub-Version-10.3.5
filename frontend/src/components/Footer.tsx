import React from 'react';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const footerSections = [
    {
      title: 'For Learners',
      links: [
        'Browse Courses',
        'Professional Certificates',
        'Free Courses',
        'Mobile Learning',
        'Student Discounts',
        'Learning Paths'
      ]
    },
    {
      title: 'For Instructors',
      links: [
        'Teach on LearnHub',
        'Instructor Hub',
        'Teaching Resources',
        'Success Stories',
        'Community Guidelines',
        'Instructor Support'
      ]
    },
    {
      title: 'Company',
      links: [
        'About Us',
        'Careers',
        'Press',
        'Blog',
        'Investors',
        'Leadership'
      ]
    },
    {
      title: 'Support',
      links: [
        'Help Center',
        'Contact Us',
        'System Status',
        'Learning FAQ',
        'Accessibility',
        'Report Issues'
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Latest Courses</h3>
            <p className="text-gray-300 mb-8">
              Get weekly updates on new courses, career tips, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No spam, unsubscribe anytime. Read our Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-2 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold">LearnHub</span>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-sm">
              Empowering millions of learners worldwide to master new skills, 
              advance their careers, and transform their lives through quality education.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>support@learnhub.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href}
                    className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 group"
                  >
                    <Icon className="w-5 h-5 text-gray-300 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile App Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Download Our Mobile App</h4>
            <p className="text-gray-300 mb-6">
              Learn on the go with offline downloads and progress sync
            </p>
            
            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 rounded-lg">
                <div className="w-24 h-24 bg-gray-900 rounded flex items-center justify-center">
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-800 text-xs mt-2 font-medium">Scan to Download</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>📱</span>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>🤖</span>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 LearnHub, Inc. All rights reserved.</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <select className="bg-transparent border-0 text-gray-400 focus:outline-none cursor-pointer hover:text-white transition-colors">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                </select>
              </div>
              <select className="bg-transparent border-0 text-gray-400 focus:outline-none cursor-pointer hover:text-white transition-colors text-sm">
                <option>USD $</option>
                <option>EUR €</option>
                <option>GBP £</option>
                <option>JPY ¥</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}