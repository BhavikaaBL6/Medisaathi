import { X, Check, XCircle } from 'lucide-react';
import { Medication } from '@/react-app/hooks/useMedications';
import { useAdherence } from '@/react-app/hooks/useAdherence';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
}

export default function QuickLogModal({ isOpen, onClose, medications }: QuickLogModalProps) {
  const { logMedication } = useAdherence();

  if (!isOpen) return null;

  const handleLog = (medication: Medication, taken: boolean) => {
    logMedication(medication.id, medication.name, taken);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 dark:from-purple-700 dark:via-blue-600 dark:to-green-600">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 -translate-x-32"></div>
          
          <div className="relative flex items-center justify-between p-6 text-white">
            <h2 className="text-3xl font-bold">Log Medication</h2>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-2xl transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6">
          {medications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No medications to log
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Add medications first to start tracking
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Did you take this medication?
              </p>
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="glass dark:bg-gray-800/80 border-2 border-white/50 dark:border-white/10 rounded-2xl p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {med.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {med.dosage}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleLog(med, true)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                      <span>Taken</span>
                    </button>
                    
                    <button
                      onClick={() => handleLog(med, false)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      <XCircle className="w-5 h-5" strokeWidth={2.5} />
                      <span>Missed</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
