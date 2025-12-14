import { useState, useEffect } from 'react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  addedAt: Date;
}

export interface Interaction {
  drug1: string;
  drug2: string;
  severity: 'critical' | 'caution';
  message: string;
}

const INTERACTION_RULES: Array<{
  drugs: [string, string];
  severity: 'critical' | 'caution';
  messageKey: 'warfarinAspirinWarning' | 'ibuprofenAspirinWarning';
}> = [
  {
    drugs: ['Warfarin', 'Aspirin'],
    severity: 'critical',
    messageKey: 'warfarinAspirinWarning',
  },
  {
    drugs: ['Ibuprofen', 'Aspirin'],
    severity: 'caution',
    messageKey: 'ibuprofenAspirinWarning',
  },
];

export function useMedications() {
  const { t } = useLanguage();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [detectedInteraction, setDetectedInteraction] = useState<Interaction | null>(null);

  // Load medications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('polyrx_medications');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMedications(parsed.map((m: any) => ({
        ...m,
        addedAt: new Date(m.addedAt)
      })));
    }
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('polyrx_medications', JSON.stringify(medications));
  }, [medications]);

  const checkInteractions = (medList: Medication[]): Interaction | null => {
    const medNames = medList.map(m => m.name.toLowerCase());
    
    for (const rule of INTERACTION_RULES) {
      const [drug1, drug2] = rule.drugs.map(d => d.toLowerCase());
      if (medNames.includes(drug1) && medNames.includes(drug2)) {
        return {
          drug1: rule.drugs[0],
          drug2: rule.drugs[1],
          severity: rule.severity,
          message: t[rule.messageKey],
        };
      }
    }
    
    return null;
  };

  const addMedication = (name: string, dosage: string) => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name,
      dosage,
      addedAt: new Date(),
    };
    
    const updatedMeds = [...medications, newMed];
    setMedications(updatedMeds);
    
    // Check for interactions
    const interaction = checkInteractions(updatedMeds);
    if (interaction) {
      setDetectedInteraction(interaction);
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const clearInteraction = () => {
    setDetectedInteraction(null);
  };

  return {
    medications,
    addMedication,
    removeMedication,
    detectedInteraction,
    clearInteraction,
  };
}
