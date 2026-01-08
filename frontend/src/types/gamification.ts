export interface UserXP {
  userId: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streak: number;
  lastActivityDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'engagement' | 'achievement' | 'social' | 'special';
  requirements: BadgeRequirement[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
}

export interface BadgeRequirement {
  type: 'course_completion' | 'quiz_score' | 'streak_days' | 'total_hours' | 'social_interaction';
  value: number;
  description: string;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
  isDisplayed: boolean;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'global' | 'course' | 'category' | 'monthly';
  period: 'all_time' | 'monthly' | 'weekly' | 'daily';
  metric: 'xp' | 'courses_completed' | 'streak' | 'quiz_score';
  entries: LeaderboardEntry[];
  updatedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  rank: number;
  change: number; // position change from last period
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'first_course' | 'perfect_quiz' | 'week_streak' | 'course_creator' | 'helpful_reviewer';
  title: string;
  description: string;
  xpEarned: number;
  unlockedAt: Date;
  isNotified: boolean;
}