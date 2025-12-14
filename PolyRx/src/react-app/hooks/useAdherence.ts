import { useState, useEffect } from 'react';

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: Date;
  taken: boolean;
}

export interface AdherenceStats {
  currentStreak: number;
  longestStreak: number;
  adherenceRate: number;
  totalDoses: number;
  takenDoses: number;
  healthScore: number;
}

export function useAdherence() {
  const [logs, setLogs] = useState<MedicationLog[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('polyrx_adherence_logs');
    if (stored) {
      const parsed = JSON.parse(stored);
      setLogs(parsed.map((l: any) => ({
        ...l,
        timestamp: new Date(l.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('polyrx_adherence_logs', JSON.stringify(logs));
  }, [logs]);

  const logMedication = (medicationId: string, medicationName: string, taken: boolean) => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      medicationName,
      timestamp: new Date(),
      taken,
    };
    setLogs([...logs, newLog]);
  };

  const calculateStats = (): AdherenceStats => {
    if (logs.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        adherenceRate: 0,
        totalDoses: 0,
        takenDoses: 0,
        healthScore: 0,
      };
    }

    const takenDoses = logs.filter(l => l.taken).length;
    const totalDoses = logs.length;
    const adherenceRate = (takenDoses / totalDoses) * 100;

    // Calculate streaks
    const sortedLogs = [...logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (const log of sortedLogs) {
      if (log.taken) {
        tempStreak++;
        if (currentStreak === 0) currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (currentStreak === 0) currentStreak = 0;
        tempStreak = 0;
      }
    }

    // Calculate health score (0-100)
    const healthScore = Math.min(100, Math.round(
      adherenceRate * 0.7 + // 70% weight on adherence rate
      (currentStreak / 7) * 30 // 30% weight on current streak (7 days = max contribution)
    ));

    return {
      currentStreak,
      longestStreak,
      adherenceRate,
      totalDoses,
      takenDoses,
      healthScore,
    };
  };

  const getWeeklyData = () => {
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= date && logDate < nextDate;
      });

      const taken = dayLogs.filter(l => l.taken).length;
      const total = dayLogs.length;
      const rate = total > 0 ? (taken / total) * 100 : 0;

      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        rate: Math.round(rate),
        taken,
        total,
      });
    }

    return weekData;
  };

  return {
    logs,
    logMedication,
    calculateStats,
    getWeeklyData,
  };
}
