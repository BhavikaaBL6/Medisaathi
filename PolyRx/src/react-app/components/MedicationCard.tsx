import { Pill, Trash2 } from 'lucide-react';
import { Medication } from '@/react-app/hooks/useMedications';

interface MedicationCardProps {
  medication: Medication;
  onRemove: (id: string) => void;
}

export default function MedicationCard({ medication, onRemove }: MedicationCardProps) {
  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
      
      <div className="relative glass dark:bg-gray-800/80 dark:backdrop-blur-xl border-2 border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-green-100/50 dark:from-blue-900/30 dark:to-green-900/30 rounded-full blur-2xl"></div>
        
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg">
                  <Pill className="w-8 h-8" strokeWidth={2.5} />
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {medication.name}
                </h3>
              </div>
            </div>
            
            <div className="ml-20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-400"></div>
                <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                  {medication.dosage}
                </p>
              </div>
              
              <p className="text-base text-gray-500 dark:text-gray-400">
                Added {medication.addedAt.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRemove(medication.id)}
            className="group/btn relative bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-2xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
            aria-label="Remove medication"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 to-red-600/0 group-hover/btn:from-red-400/20 group-hover/btn:to-red-600/20 rounded-2xl transition-all"></div>
            <Trash2 className="w-6 h-6 relative z-10" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
