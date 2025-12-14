import { TrendingUp, Award, Activity, Target, Sparkles, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useAdherence } from '@/react-app/hooks/useAdherence';

export default function Insights() {
  const { calculateStats, getWeeklyData } = useAdherence();
  const stats = calculateStats();
  const weeklyData = getWeeklyData();

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24 relative overflow-hidden transition-colors duration-300">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-mesh opacity-30 dark:opacity-20 animate-pulse-slow pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 dark:from-purple-700 dark:via-purple-600 dark:to-blue-600 text-white px-6 py-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 animate-float">
              <TrendingUp className="w-12 h-12" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-1">Health Insights</h1>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <p className="text-xl opacity-95">AI-powered adherence analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 relative z-10 space-y-6">
        {/* Health Score Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative glass dark:bg-gray-800/80 dark:backdrop-blur-xl border-2 border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Health Score</h2>
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-2xl">
                <Activity className="w-6 h-6" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#healthGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(stats.healthScore / 100) * 552.92} 552.92`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className="text-purple-500" stopColor="currentColor" />
                      <stop offset="100%" className="text-blue-500" stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {stats.healthScore}
                  </span>
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">out of 100</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${getHealthScoreColor(stats.healthScore)} text-white font-bold text-xl shadow-lg`}>
                {getHealthScoreText(stats.healthScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Streak */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative glass dark:bg-gray-800/80 border-2 border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-3 rounded-2xl">
                  <Award className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Streak</h3>
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                {stats.currentStreak}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">days in a row</p>
            </div>
          </div>

          {/* Adherence Rate */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative glass dark:bg-gray-800/80 border-2 border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-2xl">
                  <Target className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Rate</h3>
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {Math.round(stats.adherenceRate)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">adherence</p>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative glass dark:bg-gray-800/80 border-2 border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-2xl">
                <Calendar className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Weekly Progress</h3>
            </div>

            {weeklyData.every(d => d.total === 0) ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  No medication logs yet
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  Start tracking to see your progress
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <XAxis 
                    dataKey="day" 
                    stroke="#9ca3af"
                    style={{ fontSize: '14px', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '14px', fontWeight: '600' }}
                    domain={[0, 100]}
                  />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.rate >= 80 ? '#10b981' : entry.rate >= 60 ? '#f59e0b' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative glass dark:bg-gray-800/80 border-2 border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Smart Insights</h3>
            
            <div className="space-y-4">
              {stats.adherenceRate >= 90 && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-700">
                  <div className="bg-green-500 text-white rounded-full p-2 mt-1">
                    <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white mb-1">Outstanding!</p>
                    <p className="text-gray-700 dark:text-gray-300">You're maintaining excellent medication adherence. Keep up the great work!</p>
                  </div>
                </div>
              )}
              
              {stats.currentStreak >= 7 && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-700">
                  <div className="bg-orange-500 text-white rounded-full p-2 mt-1">
                    <Award className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white mb-1">Week Streak!</p>
                    <p className="text-gray-700 dark:text-gray-300">You've maintained a perfect streak for a full week. Amazing dedication!</p>
                  </div>
                </div>
              )}
              
              {stats.adherenceRate < 70 && stats.totalDoses > 0 && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700">
                  <div className="bg-blue-500 text-white rounded-full p-2 mt-1">
                    <Target className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white mb-1">Room for Improvement</p>
                    <p className="text-gray-700 dark:text-gray-300">Try setting reminders to help improve your medication adherence rate.</p>
                  </div>
                </div>
              )}

              {stats.totalDoses === 0 && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-700">
                  <div className="bg-purple-500 text-white rounded-full p-2 mt-1">
                    <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white mb-1">Get Started</p>
                    <p className="text-gray-700 dark:text-gray-300">Add your medications and start tracking to unlock personalized health insights.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
