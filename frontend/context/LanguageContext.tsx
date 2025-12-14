
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, LanguageCode, TranslationKey } from '@/constants/Translations';

type LanguageContextType = {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    getText: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const stored = await AsyncStorage.getItem('app_language');
            if (stored && Object.keys(TRANSLATIONS).includes(stored)) {
                setLanguageState(stored as LanguageCode);
            }
        } catch (e) {
            console.error("Failed to load language", e);
        }
    };

    const setLanguage = async (lang: LanguageCode) => {
        setLanguageState(lang);
        await AsyncStorage.setItem('app_language', lang);
    };

    const getText = (key: TranslationKey) => {
        return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, getText }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
