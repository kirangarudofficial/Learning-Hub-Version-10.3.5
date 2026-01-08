import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Topbar from './components/Topbar';
import Header from './components/Header';
import Hero from './components/Hero';
import CareerFinder from './components/CareerFinder';
import TrustedBy from './components/TrustedBy';
import CourseCategories from './components/CourseCategories';
import TrendingCourses from './components/TrendingCourses';
import ProfessionalCertificates from './components/ProfessionalCertificates';
import InstructorSpotlight from './components/InstructorSpotlight';
import Testimonials from './components/Testimonials';
import MobileAppPromo from './components/MobileAppPromo';
import BlogSection from './components/BlogSection';
import NewsletterSignup from './components/NewsletterSignup';
import PricingPlans from './components/PricingPlans';
import SupportCenter from './components/SupportCenter';
import ResumeBuilder from './components/ResumeBuilder';
import SkillTracker from './components/SkillTracker';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/checkout" element={<CheckoutPage onBack={() => window.history.back()} onComplete={() => window.location.href = '/dashboard'} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;