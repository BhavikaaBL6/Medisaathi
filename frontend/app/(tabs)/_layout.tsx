import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/context/LanguageContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { getText } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: 80,
          },
          default: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }
        }),
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={{ flex: 1 }} />
          ) : undefined
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: getText('home'),
          tabBarIcon: ({ color }) => <Feather size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: getText('scan'),
          tabBarIcon: ({ color }) => <Feather size={24} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cabinet"
        options={{
          title: getText('cabinet'),
          tabBarIcon: ({ color }) => <Feather size={24} name="package" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: getText('insights'),
          tabBarIcon: ({ color }) => <Feather size={24} name="bar-chart-2" color={color} />,
        }}
      />
    </Tabs>
  );
}
