import React, { useState } from 'react';
import { Mail, CheckCircle, Gift, TrendingUp, Users } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const benefits = [
    { icon: Gift, text: "Exclusive course discounts & early access" },
    { icon: TrendingUp, text: "Weekly career tips from industry experts" },
    { icon: Users, text: "Success stories from our community" }
  ];

  if (isSubscribed) {
    return (
      <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Our Community! 🎉
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for subscribing! Check your inbox for a welcome email with exclusive offers.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  🎁 Special Welcome Gift: 25% off your first course purchase!
                </p>
              </div>
              <button 
                onClick={() => setIsSubscribed(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Subscribe another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left Side - Content */}
              <div className="p-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold">Weekly Newsletter</span>
                  </div>
                  
                  <h2 className="text-4xl font-bold leading-tight">
                    Stay Ahead in Your Career Journey
                  </h2>
                  
                  <p className="text-xl text-blue-100">
                    Join 500K+ professionals getting weekly insights, course updates, 
                    and exclusive offers delivered to their inbox.
                  </p>

                  <div className="space-y-4">
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-blue-100">{benefit.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Join our community:</span>
                      <div className="flex items-center space-x-4">
                        <span>500K+ subscribers</span>
                        <span>4.9★ rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Get Started Today
                    </h3>
                    <p className="text-gray-600">
                      No spam, unsubscribe anytime. We respect your privacy.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Subscribe & Get 25% Off
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      By subscribing, you agree to our{' '}
                      <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    </p>
                  </div>

                  {/* Social Proof */}
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-600 mb-4">Trusted by professionals at:</p>
                    <div className="flex items-center justify-between text-2xl">
                      <span>🔵</span>
                      <span>🟦</span>
                      <span>🟠</span>
                      <span>⚪</span>
                      <span>🔷</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 