import React from 'react';
import { Star, Clock, Users, Play, ShoppingCart } from 'lucide-react';
import { Course } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface CourseCardProps {
  course: Course;
  onViewDetails: (courseId: string) => void;
}

export default function CourseCard({ course, onViewDetails }: CourseCardProps) {
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  
  const isInCart = items.some(item => item.courseId === course.id);
  const isEnrolled = user?.enrolledCourses.includes(course.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart && !isEnrolled) {
      addToCart(course);
    }
  };

  return (
    <div 
      className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100"
      onClick={() => onViewDetails(course.id)}
    >
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Badge */}
        {course.badge && (
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
              course.badge === 'Bestseller' ? 'bg-orange-500 text-white' :
              course.badge === 'Hot & New' ? 'bg-red-500 text-white' :
              'bg-green-500 text-white'
            }`}>
              {course.badge === 'Bestseller' ? '🏆 ' : course.badge === 'Hot & New' ? '🔥 ' : '🆓 '}
              {course.badge}
            </span>
          </div>
        )}
        
        {/* Level */}
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">by {course.instructor.name}</p>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-800">{course.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({course.reviews.toLocaleString()} reviews)</span>
        </div>
        
        {/* Course Meta */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{course.students}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Updated 2024</span>
          </div>
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {course.price === 0 ? (
              <span className="text-xl font-bold text-green-600">Free</span>
            ) : (
              <>
                <span className="text-xl font-bold text-gray-800">${course.price}</span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                )}
              </>
            )}
          </div>
          
          {isEnrolled ? (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Continue Learning
            </button>
          ) : (
            <button 
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                isInCart 
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
              }`}
              disabled={isInCart}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}