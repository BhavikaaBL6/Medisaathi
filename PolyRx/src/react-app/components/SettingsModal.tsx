import { X, Globe, Moon, Sun, Check } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Language } from '@/react-app/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 dark:from-blue-700 dark:via-blue-600 dark:to-green-600">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 -translate-x-32"></div>
          
          {/* Header */}
          <div className="relative flex items-center justify-between p-6 text-white">
            <h2 className="text-3xl font-bold">{t.settings}</h2>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-2xl transition-colors"
              aria-label="Close settings"
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 space-y-6">
          {/* Language Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-2xl">
                <Globe className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t.language}</h3>
            </div>
            
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    language === lang.code
                      ? 'bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 border-2 border-blue-300 dark:border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold text-lg text-gray-800 dark:text-white">{lang.nativeName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lang.name}</p>
                  </div>
                  {language === lang.code && (
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 p-3 rounded-2xl">
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6" strokeWidth={2.5} />
                ) : (
                  <Sun className="w-6 h-6" strokeWidth={2.5} />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t.theme}</h3>
            </div>
            
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 border-2 border-purple-300 dark:border-purple-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md">
                  {theme === 'dark' ? (
                    <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
                  ) : (
                    <Sun className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg text-gray-800 dark:text-white">
                    {theme === 'dark' ? t.darkMode : t.lightMode}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {theme === 'dark' ? 'Currently active' : 'Currently active'}
                  </p>
                </div>
              </div>
              <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold">
                Toggle
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
