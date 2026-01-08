import React from 'react';
import { Target, TrendingUp, Award, CheckCircle, Clock, Star } from 'lucide-react';

export default function SkillTracker() {
  const skillPaths = [
    {
      title: "Full Stack Developer",
      progress: 68,
      completedCourses: 8,
      totalCourses: 12,
      skills: [
        { name: "JavaScript", level: 85, status: "mastered" },
        { name: "React", level: 70, status: "intermediate" },
        { name: "Node.js", level: 45, status: "learning" },
        { name: "Databases", level: 30, status: "beginner" }
      ],
      nextMilestone: "Complete Node.js Fundamentals",
      estimatedTime: "2 weeks"
    }
  ];

  const achievements = [
    { icon: Award, title: "First Certificate", description: "Completed your first course", earned: true },
    { icon: Target, title: "Skill Master", description: "Mastered 5 skills", earned: true },
    { icon: TrendingUp, title: "Learning Streak", description: "7 days in a row", earned: false },
    { icon: Star, title: "Top Performer", description: "Top 10% in course", earned: false }
  ];

  const getSkillColor = (level: number) => {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-blue-500";
    if (level >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getSkillTextColor = (level: number) => {
    if (level >= 80) return "text-green-600";
    if (level >= 60) return "text-blue-600";
    if (level >= 40) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Track Your Learning Progress
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize your skill development and stay motivated with detailed progress tracking
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Progress */}
          <div className="lg:col-span-2 space-y-8">
            {skillPaths.map((path, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{path.title}</h3>
                    <p className="text-gray-600">Learning Path Progress</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{path.progress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{path.completedCourses}/{path.totalCourses} courses completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-semibold text-gray-800">Skill Breakdown</h4>
                  {path.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-semibold ${getSkillTextColor(skill.level)}`}>
                            {skill.status}
                          </span>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Milestone */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">Next Milestone</h5>
                      <p className="text-gray-600">{path.nextMilestone}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Est. {path.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        achievement.earned ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          achievement.earned ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Learning Time</span>
                  <span className="font-semibold text-gray-800">12h 30m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Courses Completed</span>
                  <span className="font-semibold text-gray-800">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Skills Improved</span>
                  <span className="font-semibold text-gray-800">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Streak</span>
                  <span className="font-semibold text-orange-600">7 days 🔥</span>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Keep Going! 💪</h3>
              <p className="text-purple-100 text-sm mb-4">
                You're 32% ahead of learners who started the same time as you!
              </p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors">
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}