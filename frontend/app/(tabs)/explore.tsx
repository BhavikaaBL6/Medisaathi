import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/LanguageContext';

const { width } = Dimensions.get('window');

// Mock Data & Logic (Simulating useAdherence)
const getMockStats = () => ({
  healthScore: 85,
  currentStreak: 5,
  adherenceRate: 92,
  totalDoses: 42,
});

const getMockWeeklyData = () => [
  { day: 'Sun', rate: 100 },
  { day: 'Mon', rate: 80 },
  { day: 'Tue', rate: 100 },
  { day: 'Wed', rate: 60 },
  { day: 'Thu', rate: 90 },
  { day: 'Fri', rate: 100 },
  { day: 'Sat', rate: 100 },
];

const stats = getMockStats();
const weeklyData = getMockWeeklyData();

import { useTheme } from '@/context/ThemeContext';

// ...

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { getText } = useLanguage();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return ['#22c55e', '#16a34a']; // green
    if (score >= 60) return ['#f59e0b', '#d97706']; // orange
    return ['#ef4444', '#dc2626']; // red
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return getText('excellent');
    if (score >= 60) return getText('good');
    if (score >= 40) return getText('fair');
    return getText('needsWork');
  };

  // Circular Progress Config
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = stats.healthScore / 100;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0f172a' }]}>
      {/* Background */}
      <LinearGradient
        colors={isDark ? ['#1e293b', '#0f172a', '#1e293b'] : ['#f3e8ff', '#ffffff', '#eff6ff']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs */}
      <View style={[styles.blob, { top: -50, right: -50, backgroundColor: isDark ? 'rgba(168, 85, 247, 0.05)' : 'rgba(168, 85, 247, 0.1)' }]} />
      <View style={[styles.blob, { top: 200, left: -50, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)' }]} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}>

        {/* Header */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={isDark ? ['#6b21a8', '#581c87', '#1e3a8a'] : ['#9333ea', '#7e22ce', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
          >
            <View style={styles.headerContent}>
              <View style={[styles.iconBox, isDark && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <Feather name="trending-up" size={28} color="white" />
              </View>
              <View>
                <Text style={styles.headerTitle}>{getText('insights')}</Text>
                <View style={styles.headerSubtitleRow}>
                  <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.headerSubtitle}>{getText('aiAnalytics')}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={[styles.headerCircle, { top: -20, right: -20, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
        </View>

        <View style={styles.mainContent}>

          {/* Health Score Card */}
          <View style={[styles.card, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }, styles.scoreCard]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, isDark && { color: '#f8fafc' }]}>{getText('healthScore')}</Text>
              <View style={[styles.iconContainerPurple, isDark && { backgroundColor: 'rgba(147, 51, 234, 0.2)' }]}>
                <Feather name="activity" size={20} color="#9333ea" />
              </View>
            </View>

            <View style={styles.circleContainer}>
              <Svg width={size} height={size} style={styles.svg}>
                <Defs>
                  <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#a855f7" stopOpacity="1" />
                    <Stop offset="1" stopColor="#3b82f6" stopOpacity="1" />
                  </SvgLinearGradient>
                </Defs>
                {/* Background Circle */}
                <Circle
                  stroke={isDark ? '#334155' : '#e5e7eb'}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress Circle */}
                <Circle
                  stroke="url(#grad)"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${size / 2}, ${size / 2}`}
                />
              </Svg>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreValue}>{stats.healthScore}</Text>
                <Text style={styles.scoreLabel}>/ 100</Text>
              </View>
            </View>

            <View style={[styles.badge, { backgroundColor: getHealthScoreColor(stats.healthScore)[0] }]}>
              <Text style={styles.badgeText}>{getHealthScoreText(stats.healthScore)}</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.grid}>
            {/* Streak Item */}
            <View style={[styles.card, styles.gridItem, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainerOrange, isDark && { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
                  <Ionicons name="trophy-outline" size={20} color="#f97316" />
                </View>
                <Text style={[styles.gridTitle, isDark && { color: '#cbd5e1' }]}>{getText('streak')}</Text>
              </View>
              <Text style={styles.gridValueOrange}>{stats.currentStreak}</Text>
              <Text style={styles.gridLabel}>{getText('days')}</Text>
            </View>

            {/* Rate Item */}
            <View style={[styles.card, styles.gridItem, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainerGreen, isDark && { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                  <MaterialCommunityIcons name="target" size={20} color="#16a34a" />
                </View>
                <Text style={[styles.gridTitle, isDark && { color: '#cbd5e1' }]}>{getText('rate')}</Text>
              </View>
              <Text style={styles.gridValueGreen}>{Math.round(stats.adherenceRate)}%</Text>
              <Text style={styles.gridLabel}>{getText('adherence')}</Text>
            </View>
          </View>

          {/* Weekly Progress (Bar Chart) */}
          <View style={[styles.card, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainerBlue, isDark && { backgroundColor: 'rgba(37, 99, 235, 0.2)' }]}>
                <Feather name="calendar" size={20} color="#2563eb" />
              </View>
              <Text style={[styles.cardTitle, isDark && { color: '#f8fafc' }]}>{getText('weeklyProgress')}</Text>
            </View>

            <View style={styles.chartContainer}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.chartCol}>
                  <View style={[styles.barContainer, isDark && { backgroundColor: '#334155' }]}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${data.rate}%`,
                          backgroundColor: data.rate >= 80 ? '#10b981' : data.rate >= 60 ? '#f59e0b' : '#ef4444'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.dayText}>{data.day.charAt(0)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* AI Insights List */}
          <View style={[styles.card, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
            <Text style={[styles.cardTitle, { marginBottom: 16 }, isDark && { color: '#f8fafc' }]}>{getText('smartInsights')}</Text>

            {/* Item 1 */}
            <View style={[styles.insightItem, styles.insightItemGreen, isDark && { backgroundColor: 'rgba(22, 163, 74, 0.1)', borderColor: '#166534' }]}>
              <View style={styles.insightIconGreen}>
                <Ionicons name="sparkles" size={16} color="white" />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, isDark && { color: '#f0fdf4' }]}>{getText('outstanding')}</Text>
                <Text style={[styles.insightText, isDark && { color: '#bbf7d0' }]}>{getText('outstandingMsg')}</Text>
              </View>
            </View>

            {/* Item 2 */}
            <View style={[styles.insightItem, styles.insightItemOrange, isDark && { backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: '#9a3412' }]}>
              <View style={styles.insightIconOrange}>
                <Ionicons name="trophy" size={16} color="white" />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, isDark && { color: '#fff7ed' }]}>{getText('weekStreak')}</Text>
                <Text style={[styles.insightText, isDark && { color: '#fed7aa' }]}>{getText('weekStreakMsg')}</Text>
              </View>
            </View>

          </View>

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
    flexGrow: 1,
  },
  blob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
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
    elevation: 8,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  headerCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  scoreCard: {
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  iconContainerPurple: {
    backgroundColor: '#f3e8ff',
    padding: 10,
    borderRadius: 12,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  svg: {
    transform: [{ rotate: '0deg' }], // already rotated in circle
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#3b82f6', // blue-500 roughly matches gradient center
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  iconContainerOrange: {
    backgroundColor: '#ffedd5',
    padding: 8,
    borderRadius: 12,
  },
  iconContainerGreen: {
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 12,
  },
  iconContainerBlue: {
    backgroundColor: '#dbeafe',
    padding: 10,
    borderRadius: 12,
    marginRight: 12, // For header
  },
  gridValueOrange: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f97316',
    marginTop: 8,
  },
  gridValueGreen: {
    fontSize: 32,
    fontWeight: '900',
    color: '#16a34a',
    marginTop: 8,
  },
  gridLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  chartCol: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  barContainer: {
    height: 120,
    width: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  insightItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  insightItemGreen: {
    backgroundColor: '#f0fdf4',
    borderColor: '#dcfce7',
  },
  insightItemOrange: {
    backgroundColor: '#fff7ed',
    borderColor: '#ffedd5',
  },
  insightIconGreen: {
    backgroundColor: '#22c55e',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  insightIconOrange: {
    backgroundColor: '#f97316',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  insightText: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  }
});
