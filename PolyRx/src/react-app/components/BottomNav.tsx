import { Pill, Camera, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const tabs = [
    { path: '/', icon: Pill, label: t.myCabinet },
    { path: '/scan', icon: Camera, label: t.scanNew },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glass morphism background */}
      <div className="glass dark:bg-gray-900/80 dark:backdrop-blur-xl border-t-2 border-white/30 dark:border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 scale-110' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-105'
                }`}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 dark:from-blue-900/30 to-transparent rounded-t-2xl"></div>
                )}
                
                {/* Icon container with gradient background when active */}
                <div className={`relative mb-1 transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/50 dark:to-green-900/50 rounded-2xl p-2' : ''
                }`}>
                  <Icon 
                    className={`${isActive ? 'w-10 h-10' : 'w-8 h-8'} transition-all duration-300`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                </div>
                
                <span className={`font-semibold transition-all duration-300 ${
                  isActive ? 'text-lg' : 'text-base'
                }`}>
                  {tab.label}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-lg"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
