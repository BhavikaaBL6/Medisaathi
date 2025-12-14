import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedicationCard, { Medication } from '@/components/MedicationCard';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [medications, setMedications] = useState<any[]>([]);
  const { getText } = useLanguage();
  const { toggleTheme, colorScheme } = useTheme();

  const loadCabinet = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_cabinet');
      if (stored) {
        setMedications(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cabinet", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCabinet();
    }, [])
  );

  const removeMedication = async (name: string) => {
    const newList = medications.filter(m => m.drug_name !== name); // Using drug_name as ID for simple version
    setMedications(newList);
    await AsyncStorage.setItem('user_cabinet', JSON.stringify(newList));
  };

  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0f172a' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Background Gradients */}
      <LinearGradient
        colors={isDark ? ['#1e293b', '#0f172a', '#1e293b'] : ['#eff6ff', '#ffffff', '#f0fdf4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative background meshes (simulated with gradients) */}
      <LinearGradient
        colors={isDark ? ['rgba(59, 130, 246, 0.1)', 'transparent'] : ['rgba(59, 130, 246, 0.2)', 'transparent']}
        style={[styles.meshGradient, { top: -100, right: -100, width: 300, height: 300, borderRadius: 150 }]}
      />
      <LinearGradient
        colors={isDark ? ['rgba(34, 197, 94, 0.1)', 'transparent'] : ['rgba(34, 197, 94, 0.2)', 'transparent']}
        style={[styles.meshGradient, { bottom: -50, left: -50, width: 250, height: 250, borderRadius: 125 }]}
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}>

        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={isDark ? ['#1e3a8a', '#1d4ed8', '#15803d'] : ['#2563eb', '#3b82f6', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
          >
            {/* Header Content */}
            <View style={styles.headerContent}>
              <View style={styles.headerRow}>
                <View style={[styles.logoRow, { flex: 1 }]}>
                  <BlurView intensity={20} tint="light" style={styles.logoIconContainer}>
                    <Feather name="shield" size={28} color="white" />
                  </BlurView>
                  <View style={styles.appNameContainer}>
                    <Text style={styles.appName}>{getText('appName')}</Text>
                    <View style={styles.taglineRow}>
                      <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.tagline}>{getText('tagline')}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.settingsButton, { marginRight: 12 }]}
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                  >
                    <Feather name={colorScheme === 'dark' ? 'sun' : 'moon'} size={24} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => router.push('/modal')}
                    activeOpacity={0.7}
                  >
                    <Feather name="settings" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Decorative circles in header */}
          <View pointerEvents="none" style={[styles.headerCircle, { top: -20, right: -20, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && { color: '#f8fafc' }]}>{getText('myCabinet')}</Text>
            <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.countBadge}>
              <Text style={[styles.countText, isDark && { color: '#60a5fa' }]}>{medications.length} Meds</Text>
            </BlurView>
          </View>

          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <LinearGradient
                  colors={['#60a5fa', '#4ade80']}
                  style={styles.emptyIconGradient}
                >
                  <Feather name="plus" size={48} color="white" />
                </LinearGradient>
              </View>
              <Text style={styles.emptyTitle}>{getText('noMedications')}</Text>
              <Text style={styles.emptySubtitle}>{getText('scanFirst')}</Text>

              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => router.push('/scan')}
              >
                <LinearGradient
                  colors={['#2563eb', '#22c55e']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.scanButtonGradient}
                >
                  <Ionicons name="scan" size={24} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.scanButtonText}>{getText('scanMedication')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <TouchableOpacity style={styles.quickLogButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#16a34a', '#10b981']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.quickLogGradient}
                >
                  <Feather name="check-circle" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.quickLogText}>{getText('quickLog')}</Text>
                </LinearGradient>
              </TouchableOpacity>

              {medications.map((med, index) => (
                <MedicationCard key={med.id} medication={med} onRemove={removeMedication} />
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  meshGradient: {
    position: 'absolute',
    borderRadius: 999,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerWrapper: {
    marginBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerContent: {
    position: 'relative',
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  appNameContainer: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  tagline: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  mainContent: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b', // slate-800
  },
  countBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  countText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 280,
  },
  scanButton: {
    width: '100%',
    shadowColor: '#2563eb', // blue-600
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {},
  quickLogButton: {
    marginBottom: 24,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickLogGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
  },
  quickLogText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  }

});
