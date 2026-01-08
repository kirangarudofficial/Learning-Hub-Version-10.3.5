import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Users, Star, Award, CheckCircle, Globe, Smartphone, Download, ShoppingCart } from 'lucide-react';
import { Course, Review } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export default function CourseDetail({ course, onBack }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  
  const isInCart = items.some(item => item.courseId === course.id);
  const isEnrolled = user?.enrolledCourses.includes(course.id);

  const mockReviews: Review[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100',
      courseId: course.id,
      rating: 5,
      comment: 'Excellent course! The instructor explains everything clearly and the projects are very practical.',
      createdAt: new Date('2024-11-01')
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Mike Chen',
      userAvatar: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100',
      courseId: course.id,
      rating: 4,
      comment: 'Great content and well-structured. Helped me land my first developer job!',
      createdAt: new Date('2024-10-15')
    }
  ];

  const handleAddToCart = () => {
    if (!isInCart && !isEnrolled) {
      addToCart(course);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                {course.badge && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    course.badge === 'Bestseller' ? 'bg-orange-500' :
                    course.badge === 'Hot & New' ? 'bg-red-500' :
                    'bg-green-500'
                  }`}>
                    {course.badge}
                  </span>
                )}
                <span className="text-blue-400 text-sm">{course.category}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-400">({course.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">Created by {course.instructor.name}</p>
                  <p className="text-gray-400 text-sm">Updated {course.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-8">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="bg-white rounded-full p-4 hover:bg-gray-100 transition-colors">
                      <Play className="w-8 h-8 text-blue-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    {course.price === 0 ? (
                      <div className="text-3xl font-bold text-green-600">Free</div>
                    ) : (
                      <div>
                        <div className="text-3xl font-bold text-gray-800">${course.price}</div>
                        {course.originalPrice && (
                          <div className="text-lg text-gray-500 line-through">${course.originalPrice}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mb-4">
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={isInCart}
                      className={`w-full py-3 rounded-lg font-semibold mb-4 flex items-center justify-center space-x-2 ${
                        isInCart
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>{isInCart ? 'Added to Cart' : 'Add to Cart'}</span>
                    </button>
                  )}

                  <div className="text-center text-sm text-gray-600 mb-6">
                    30-Day Money-Back Guarantee
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4 text-gray-600" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-gray-600" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-600" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <span>Full lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Content</h3>
                <div className="space-y-4">
                  {course.curriculum.map((module, moduleIndex) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">
                            {moduleIndex + 1}. {module.title}
                          </h4>
                          <span className="text-sm text-gray-600">{module.duration}</span>
                        </div>
                      </div>
                      <div className="px-6 py-4">
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Play className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{lesson.title}</span>
                                {lesson.isFree && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Instructor</h3>
                <div className="flex items-start space-x-6">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{course.instructor.name}</h4>
                    <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{course.instructor.rating} Instructor Rating</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span>{course.instructor.students.toLocaleString()} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Student Reviews</h3>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-semibold text-gray-800">{review.userName}</h5>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}