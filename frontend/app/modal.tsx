import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageCode } from '@/constants/Translations';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

const LANGUAGES: { code: LanguageCode; name: string; native: string }[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
];

export default function SettingsScreen() {
  const { language, setLanguage, getText } = useLanguage();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0f172a' }]}>
      <LinearGradient
        colors={isDark ? ['#1e293b', '#0f172a'] : ['#f8fafc', '#ffffff']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainerBlue, isDark && { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
            <Ionicons name="language" size={24} color="#3b82f6" />
          </View>
          <ThemedText type="subtitle" style={[styles.sectionTitle, isDark && { color: '#f1f5f9' }]}>{getText('selectLanguage')}</ThemedText>
        </View>

        <View style={[styles.card, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
          {LANGUAGES.map((lang, index) => {
            const isSelected = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  isDark && { backgroundColor: '#1e293b' },
                  index !== LANGUAGES.length - 1 && (isDark ? { borderBottomColor: '#334155' } : styles.borderBottom),
                  isSelected && (isDark ? { backgroundColor: 'rgba(59, 130, 246, 0.2)' } : styles.selectedOption)
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageNative, isDark && { color: '#f1f5f9' }, isSelected && styles.selectedText]}>{lang.native}</Text>
                  <Text style={[styles.languageName, isDark && { color: '#94a3b8' }, isSelected && styles.selectedSubText]}>{lang.name}</Text>
                </View>

                {isSelected && (
                  <View style={[styles.checkIcon, isDark && { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    <Feather name="check" size={20} color="#3b82f6" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>MediSaathi v1.0.0</Text>
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
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainerBlue: {
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#1e293b',
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  selectedOption: {
    backgroundColor: '#eff6ff', // blue-50
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  languageInfo: {
    gap: 4,
  },
  languageNative: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  languageName: {
    fontSize: 14,
    color: '#94a3b8',
  },
  selectedText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  selectedSubText: {
    color: '#60a5fa',
  },
  checkIcon: {
    backgroundColor: '#dbeafe',
    padding: 6,
    borderRadius: 20,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    color: '#cbd5e1',
    fontSize: 12,
  }
});
