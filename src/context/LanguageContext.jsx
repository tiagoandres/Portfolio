import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';

// Create the context
const LanguageContext = createContext();

// Custom hook for consuming the context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider = ({ children }) => {
    // Determine initial language from localStorage or default to ES
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('portfolio_lang');
        return savedLang ? savedLang : 'ES';
    });

    // Update localStorage when language changes
    useEffect(() => {
        localStorage.setItem('portfolio_lang', language);
    }, [language]);

    // The translation function
    const t = (key) => {
        // Fallback to Spanish if key doesn't exist in English, or return key if missing completely
        if (translations[language] && translations[language][key]) {
            return translations[language][key];
        }
        if (translations['ES'] && translations['ES'][key]) {
            return translations['ES'][key];
        }
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
