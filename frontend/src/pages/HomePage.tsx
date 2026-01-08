import React from 'react';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CareerFinder from '../components/CareerFinder';
import TrustedBy from '../components/TrustedBy';
import CourseCategories from '../components/CourseCategories';
import TrendingCourses from '../components/TrendingCourses';
import ProfessionalCertificates from '../components/ProfessionalCertificates';
import InstructorSpotlight from '../components/InstructorSpotlight';
import Testimonials from '../components/Testimonials';
import SkillTracker from '../components/SkillTracker';
import ResumeBuilder from '../components/ResumeBuilder';
import MobileAppPromo from '../components/MobileAppPromo';
import BlogSection from '../components/BlogSection';
import NewsletterSignup from '../components/NewsletterSignup';
import PricingPlans from '../components/PricingPlans';
import SupportCenter from '../components/SupportCenter';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

export default function HomePage() {
  return (
    <>
      <Topbar />
      <Header />
      <Hero />
      <CareerFinder />
      <TrustedBy />
      <CourseCategories />
      <TrendingCourses />
      <ProfessionalCertificates />
      <InstructorSpotlight />
      <Testimonials />
      <SkillTracker />
      <ResumeBuilder />
      <MobileAppPromo />
      <BlogSection />
      <NewsletterSignup />
      <PricingPlans />
      <SupportCenter />
      <Footer />
      <ChatBot />
    </>
  );
}