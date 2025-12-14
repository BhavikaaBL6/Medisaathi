import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedColorScheme = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemePreference;
    setTheme: (theme: ThemePreference) => void;
    colorScheme: ResolvedColorScheme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useSystemColorScheme();
    const [theme, setThemeState] = useState<ThemePreference>('system');

    // Load saved theme on mount
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('user_theme');
            if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                setThemeState(savedTheme);
            }
        } catch (e) {
            console.error('Failed to load theme preference', e);
        }
    };

    const setTheme = async (newTheme: ThemePreference) => {
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem('user_theme', newTheme);
        } catch (e) {
            console.error('Failed to save theme preference', e);
        }
    };

    const toggleTheme = () => {
        // If current preference is 'system', we switch to the opposite of the resolved scheme
        // Otherwise we just flip light/dark
        const currentResolved = theme === 'system' ? (systemColorScheme ?? 'light') : theme;
        const nextTheme = currentResolved === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    };

    // Resolve the effective color scheme
    const colorScheme: ResolvedColorScheme =
        theme === 'system' ? (systemColorScheme ?? 'light') : theme;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colorScheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
