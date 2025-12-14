import { useState } from 'react';
import { ShieldCheck, Plus, Sparkles, Settings, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import MedicationCard from '@/react-app/components/MedicationCard';
import InteractionAlert from '@/react-app/components/InteractionAlert';
import SettingsModal from '@/react-app/components/SettingsModal';
import QuickLogModal from '@/react-app/components/QuickLogModal';
import { useMedications } from '@/react-app/hooks/useMedications';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { medications, removeMedication, detectedInteraction, clearInteraction } = useMedications();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24 relative overflow-hidden transition-colors duration-300">
        {/* Animated background elements */}
        <div className="absolute inset-0 gradient-mesh opacity-40 dark:opacity-20 animate-pulse-slow pointer-events-none"></div>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 dark:from-blue-700 dark:via-blue-600 dark:to-green-600 text-white px-6 py-10 shadow-2xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
          
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 animate-float">
                  <ShieldCheck className="w-12 h-12" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight mb-1">{t.appName}</h1>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <p className="text-xl opacity-95">{t.tagline}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSettingsOpen(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-2xl transition-all hover:scale-110"
                aria-label="Settings"
              >
                <Settings className="w-8 h-8" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-10 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
              {t.myCabinet}
            </h2>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-lg opacity-50"></div>
              <span className="relative glass dark:glass-dark border-2 border-white/50 dark:border-white/20 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-xl font-bold shadow-lg">
                {medications.length} {medications.length === 1 ? t.meds : t.meds}
              </span>
            </div>
          </div>

          {medications.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative glass dark:glass-dark border-4 border-white/50 dark:border-white/20 rounded-full w-32 h-32 flex items-center justify-center shadow-2xl">
                  <Plus className="w-16 h-16 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {t.noMedicationsYet}
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto leading-relaxed">
                {t.scanFirstMedication}
              </p>
              
              <button
                onClick={() => navigate('/scan')}
                className="group relative inline-flex items-center gap-3 px-12 py-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-700 dark:to-green-600 text-white text-2xl font-bold shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Sparkles className="w-7 h-7 relative z-10" strokeWidth={2.5} />
                <span className="relative z-10">{t.scanMedication}</span>
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setQuickLogOpen(true)}
                  className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-700 dark:to-emerald-600 text-white text-xl font-bold shadow-xl transition-all hover:shadow-2xl hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CheckCircle className="w-7 h-7 relative z-10" strokeWidth={2.5} />
                  <span className="relative z-10">Quick Log Medication</span>
                </button>
              </div>
              
              <div className="space-y-5">
                {medications.map((med, index) => (
                  <div
                    key={med.id}
                    className="animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <MedicationCard
                      medication={med}
                      onRemove={removeMedication}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Quick Log Modal */}
      <QuickLogModal 
        isOpen={quickLogOpen} 
        onClose={() => setQuickLogOpen(false)}
        medications={medications}
      />

      {/* Interaction Alert Modal */}
      {detectedInteraction && (
        <InteractionAlert
          interaction={detectedInteraction}
          onClose={clearInteraction}
        />
      )}
    </>
  );
}
