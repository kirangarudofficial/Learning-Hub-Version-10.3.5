export interface InstructorProfile {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string[];
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  rating: number;
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  engagementRate: number;
  monthlyData: {
    month: string;
    enrollments: number;
    revenue: number;
    completions: number;
  }[];
}

export interface InstructorEarnings {
  totalEarnings: number;
  pendingPayouts: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  payoutHistory: {
    id: string;
    amount: number;
    date: Date;
    status: 'pending' | 'completed' | 'failed';
    method: string;
  }[];
}

export interface StudentMessage {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}