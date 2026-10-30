import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const SECTION_IDS = ['about', 'experience', 'projects', 'publications', 'contact'];

const Header = () => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const NAV_ITEMS = SECTION_IDS.map(id => ({ id, label: t(`nav_${id}`) }));

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Active section + header border once the page has scrolled
    useEffect(() => {
        const handleScroll = () => {
            let current = '';
            for (const id of SECTION_IDS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 160) current = id;
            }
            setActiveSection(current);
            setScrolled(window.scrollY > 8);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }, [menuOpen]);

    const navLinks = (onClick) => NAV_ITEMS.map(({ id, label }, i) => (
        <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? 'active' : ''}
            aria-current={activeSection === id ? 'true' : undefined}
            onClick={onClick}
        >
            <span className="nav-num">{String(i + 1).padStart(2, '0')}</span>
            {label}
        </a>
    ));

    return (
        <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
            <div className="header-container">
                <a href="#hero" className="logo" onClick={() => setMenuOpen(false)}>
                    Santiago Cárdenas
                </a>

                <nav className="nav-links" aria-label="Principal">
                    {navLinks()}
                </nav>

                <div className="header-right">
                    <div className="lang-switch" role="group" aria-label={t('lang_label')}>
                        {['ES', 'EN'].map(code => (
                            <button
                                key={code}
                                className={language === code ? 'active' : ''}
                                aria-pressed={language === code}
                                onClick={() => setLanguage(code)}
                            >
                                {code}
                            </button>
                        ))}
                    </div>

                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? t('theme_to_light') : t('theme_to_dark')}
                        title={theme === 'dark' ? t('theme_to_light') : t('theme_to_dark')}
                    >
                        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                            <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
                        </svg>
                    </button>

                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(o => !o)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                    >
                        {menuOpen ? t('menu_close') : t('menu_open')}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav id="mobile-nav" className="mobile-nav" aria-label="Principal">
                    {navLinks(() => setMenuOpen(false))}
                </nav>
            )}
        </header>
    );
};

export default Header;
