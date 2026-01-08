export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  maxAttempts: number;
  questions: QuizQuestion[];
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  timeSpent: number; // in seconds
  startedAt: Date;
  completedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface Assignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: Date;
  maxScore: number;
  submissionType: 'file' | 'text' | 'code' | 'peer_review';
  rubric?: AssignmentRubric[];
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentRubric {
  criteria: string;
  maxPoints: number;
  description: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  content?: string;
  fileUrl?: string;
  codeSubmission?: {
    language: string;
    code: string;
    testResults?: any;
  };
  score?: number;
  feedback?: string;
  gradedBy?: string;
  submittedAt: Date;
  gradedAt?: Date;
  status: 'submitted' | 'graded' | 'returned' | 'late';
}