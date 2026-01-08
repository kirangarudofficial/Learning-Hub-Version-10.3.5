import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/course/CourseCard';
import CourseDetail from '../components/course/CourseDetail';
import CartSidebar from '../components/cart/CartSidebar';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';
import CoursePlayer from '../components/course/CoursePlayer';
import { mockCourses } from '../data/mockCourses';
import { Course, Lesson } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const { user } = useAuth();

  const handleViewDetails = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setShowPlayer(false);
    setCurrentLesson(null);
  };

  const handleStartLearning = (course: Course) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    const firstLesson = course.curriculum[0]?.lessons[0];
    if (firstLesson) {
      setCurrentLesson(firstLesson);
      setShowPlayer(true);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    console.log('Lesson completed:', lessonId);
    // In real app, update progress in backend
  };

  if (showPlayer && selectedCourse && currentLesson) {
    return (
      <CoursePlayer
        course={selectedCourse}
        currentLesson={currentLesson}
        onBack={handleBackToCourses}
        onLessonComplete={handleLessonComplete}
      />
    );
  }

  if (selectedCourse) {
    return (
      <>
        <Header />
        <CourseDetail
          course={selectedCourse}
          onBack={handleBackToCourses}
        />
        <Footer />
        
        <CartSidebar
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            window.location.href = '/checkout';
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
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              All Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive collection of courses designed to help you master new skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
      
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          window.location.href = '/checkout';
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
    </>
  );
}