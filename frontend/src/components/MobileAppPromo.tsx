import React from 'react';
import { Smartphone, Download, Wifi, Play, Star } from 'lucide-react';

export default function MobileAppPromo() {
  return (
    <div className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -translate-x-32 translate-y-32"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Smartphone className="w-5 h-5" />
                <span className="font-semibold">Mobile Learning</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Learn Anywhere,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  Anytime
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 max-w-lg">
                Download our mobile app and take your learning on the go. 
                Access courses offline, sync your progress, and never miss a lesson.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Download className="w-5 h-5" />
                </div>
                <span>Offline Downloads</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Wifi className="w-5 h-5" />
                </div>
                <span>Progress Sync</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Play className="w-5 h-5" />
                </div>
                <span>Video Streaming</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Star className="w-5 h-5" />
                </div>
                <span>4.8★ App Rating</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3">
                <div className="text-2xl">📱</div>
                <div className="text-left">
                  <div className="text-xs text-gray-300">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              
              <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3">
                <div className="text-2xl">🤖</div>
                <div className="text-left">
                  <div className="text-xs text-gray-300">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">5M+</div>
                <div className="text-blue-200 text-sm">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8★</div>
                <div className="text-blue-200 text-sm">App Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-blue-200 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup & QR Code */}
          <div className="relative">
            <div className="flex items-center justify-center space-x-8">
              {/* Phone Mockup */}
              <div className="relative">
                <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-20 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">LearnHub</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg"></div>
                          <div>
                            <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg"></div>
                          <div>
                            <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg"></div>
                          <div>
                            <div className="h-3 bg-gray-300 rounded w-28 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-14"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                  <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 font-medium text-sm">Scan to Download</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}