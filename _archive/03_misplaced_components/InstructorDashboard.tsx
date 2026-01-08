import React from 'react';
import { InstructorNav } from '../components/InstructorNav';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { MyCourses } from '../components/MyCourses';

export const InstructorDashboard: React.FC = () => {
  // Mock data - to be replaced with API calls
  const stats = {
    totalRevenue: 5430.55,
    totalStudents: 834,
    courseCount: 12,
    averageRating: 4.7,
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <InstructorNav />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Instructor Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, let's see how your courses are doing!</p>
        </header>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change="+5.2% this month"
          />
          <AnalyticsCard
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            change="+21 new students"
          />
          <AnalyticsCard
            title="Courses Published"
            value={stats.courseCount.toString()}
            change="2 new this year"
          />
          <AnalyticsCard
            title="Average Rating"
            value={stats.averageRating.toString()}
            change="from 1,200 reviews"
          />
        </section>

        {/* My Courses Section */}
        <MyCourses />
      </main>
    </div>
  );
};