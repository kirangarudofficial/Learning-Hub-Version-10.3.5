import React from 'react';
import { Trophy, Star, Zap, Target, Award, TrendingUp, Users, Calendar } from 'lucide-react';
import { UserXP, Badge, UserBadge, Leaderboard, Achievement } from '../../types/gamification';

export default function GamificationDashboard() {
  // Mock data - in real app, this would come from API
  const userXP: UserXP = {
    userId: '1',
    totalXP: 2450,
    level: 8,
    currentLevelXP: 450,
    nextLevelXP: 1000,
    streak: 12,
    lastActivityDate: new Date()
  };

  const userBadges: (Badge & { earnedAt: Date })[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first course',
      icon: '🎯',
      category: 'completion',
      requirements: [],
      rarity: 'common',
      xpReward: 100,
      isActive: true,
      createdAt: new Date(),
      earnedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Quiz Master',
      description: 'Score 100% on 5 quizzes',
      icon: '🧠',
      category: 'achievement',
      requirements: [],
      rarity: 'rare',
      xpReward: 250,
      isActive: true,
      createdAt: new Date(),
      earnedAt: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'Streak Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'engagement',
      requirements: [],
      rarity: 'epic',
      xpReward: 500,
      isActive: true,
      createdAt: new Date(),
      earnedAt: new Date('2024-03-10')
    }
  ];

  const leaderboard: Leaderboard = {
    id: '1',
    name: 'Weekly XP Leaders',
    type: 'global',
    period: 'weekly',
    metric: 'xp',
    entries: [
      {
        userId: '2',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50',
        score: 1250,
        rank: 1,
        change: 2
      },
      {
        userId: '1',
        userName: 'You',
        userAvatar: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=50',
        score: 890,
        rank: 2,
        change: -1
      },
      {
        userId: '3',
        userName: 'Mike Johnson',
        userAvatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=50',
        score: 750,
        rank: 3,
        change: 1
      }
    ],
    updatedAt: new Date()
  };

  const recentAchievements: Achievement[] = [
    {
      id: '1',
      userId: '1',
      type: 'week_streak',
      title: 'Week Warrior!',
      description: 'You maintained a 7-day learning streak',
      xpEarned: 200,
      unlockedAt: new Date(),
      isNotified: false
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* XP and Level Progress */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{userXP.level}</div>
            <div className="text-blue-100">Current Level</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{userXP.totalXP.toLocaleString()}</div>
            <div className="text-blue-100">Total XP</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 flex items-center justify-center space-x-1">
              <span>{userXP.streak}</span>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-blue-100">Day Streak</div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {userXP.level}</span>
            <span>Level {userXP.level + 1}</span>
          </div>
          <div className="w-full bg-blue-700 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${(userXP.currentLevelXP / userXP.nextLevelXP) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-sm mt-2 text-blue-100">
            {userXP.currentLevelXP} / {userXP.nextLevelXP} XP to next level
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Badges */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Award className="w-6 h-6" />
            <span>Your Badges ({userBadges.length})</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {userBadges.map((badge) => (
              <div key={badge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-gray-800">{badge.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>+{badge.xpReward} XP</span>
                      <span>Earned {badge.earnedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Trophy className="w-6 h-6" />
            <span>Leaderboard</span>
          </h2>
          
          <div className="space-y-4">
            {leaderboard.entries.map((entry) => (
              <div key={entry.userId} className={`flex items-center space-x-4 p-3 rounded-lg ${
                entry.userName === 'You' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  entry.rank === 1 ? 'bg-yellow-500 text-white' :
                  entry.rank === 2 ? 'bg-gray-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {entry.rank}
                </div>
                
                <img
                  src={entry.userAvatar}
                  alt={entry.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{entry.userName}</div>
                  <div className="text-sm text-gray-600">{entry.score} XP</div>
                </div>
                
                <div className={`text-xs font-medium ${
                  entry.change > 0 ? 'text-green-600' :
                  entry.change < 0 ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {entry.change > 0 ? '↗' : entry.change < 0 ? '↘' : '→'} {Math.abs(entry.change)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Star className="w-6 h-6" />
            <span>Recent Achievements</span>
          </h2>
          
          <div className="space-y-4">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                  <p className="text-gray-600">{achievement.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>+{achievement.xpEarned} XP</span>
                    <span>{achievement.unlockedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">15</div>
          <div className="text-gray-600">Courses Completed</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">89%</div>
          <div className="text-gray-600">Avg Quiz Score</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">45h</div>
          <div className="text-gray-600">Learning Time</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">23</div>
          <div className="text-gray-600">Study Buddies</div>
        </div>
      </div>
    </div>
  );
}