import { AlertTriangle, X, Phone } from 'lucide-react';
import { Interaction } from '@/react-app/hooks/useMedications';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

interface InteractionAlertProps {
  interaction: Interaction;
  onClose: () => void;
}

export default function InteractionAlert({ interaction, onClose }: InteractionAlertProps) {
  const { t } = useLanguage();
  const isCritical = interaction.severity === 'critical';

  const handleNotifyCaregiver = () => {
    // Simulated action - in production, this would send a notification
    alert('Caregiver has been notified of this drug interaction.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 ${
          isCritical 
            ? 'glow-red' 
            : 'shadow-orange-500/50'
        }`}
      >
        <div className={`relative overflow-hidden ${
          isCritical 
            ? 'bg-gradient-to-br from-red-600 via-red-600 to-red-700' 
            : 'bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600'
        }`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] animate-pulse-slow"></div>
          </div>
          
          {/* Close button */}
          <div className="relative flex justify-end p-5">
            <button
              onClick={onClose}
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/90 hover:text-white transition-all rounded-2xl p-3"
              aria-label="Close alert"
            >
              <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
            </button>
          </div>

          {/* Content */}
          <div className="relative px-10 pb-10 text-center text-white">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-8 shadow-2xl">
                  <AlertTriangle className="w-24 h-24 animate-pulse" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              {isCritical ? t.danger : t.caution}
            </h1>

            <h2 className="text-3xl font-bold mb-6 opacity-95">
              {t.interactionDetected}
            </h2>

            <div className="glass-dark border-2 border-white/30 rounded-3xl p-8 mb-8 shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-3xl font-black">{interaction.drug1}</span>
                <span className="text-4xl font-black opacity-50">+</span>
                <span className="text-3xl font-black">{interaction.drug2}</span>
              </div>
              
              <div className="w-24 h-1 bg-white/50 rounded-full mx-auto mb-6"></div>
              
              <p className="text-xl leading-relaxed font-medium">
                {interaction.message}
              </p>
            </div>

            <button
              onClick={handleNotifyCaregiver}
              className="group w-full relative overflow-hidden bg-white text-red-600 py-6 px-8 rounded-2xl font-bold text-2xl shadow-2xl transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3">
                <Phone className="w-8 h-8" strokeWidth={2.5} />
                <span>{t.notifyCaregiver}</span>
              </div>
            </button>

            <p className="mt-8 text-lg opacity-90 leading-relaxed">
              {t.doNotTakeTogether}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
