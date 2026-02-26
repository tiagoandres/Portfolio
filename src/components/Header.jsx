import React, { useState, useEffect } from 'react';
import { Glass } from 'glass-refraction';
import { useLanguage } from '../context/LanguageContext';
import './Header.css';

const Header = () => {
    const { language, setLanguage, t } = useLanguage();
    const [activeSection, setActiveSection] = useState('hero');
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    const NAV_ITEMS = [
        { id: 'hero', label: t('nav_start') },
        { id: 'about', label: t('nav_about') },
        { id: 'experience', label: t('nav_experience') },
        { id: 'projects', label: t('nav_projects') },
        { id: 'publications', label: t('nav_publications') },
        { id: 'contact', label: t('nav_contact') },
    ];

    // Close menu when clicking a nav link
    const handleNavClick = () => setMenuOpen(false);

    // Close menu on outside click / escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Active section tracker
    useEffect(() => {
        const handleScroll = () => {
            const ids = NAV_ITEMS.map(n => n.id);
            let current = 'hero';
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 150) current = id;
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Glass as="header" className="header">
            <div className="header-container">
                <div className="logo">Portafolio</div>

                {/* Desktop nav */}
                <nav className="nav-links">
                    {NAV_ITEMS.map(({ id, label }) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className={activeSection === id ? 'active' : ''}
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="header-right">
                    <div className="lang-selector" onMouseLeave={() => setLangMenuOpen(false)}>
                        <button
                            className="lang-toggle"
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            aria-label="Cambiar idioma"
                        >
                            🌍 {language}
                        </button>
                        {langMenuOpen && (
                            <div className="lang-dropdown">
                                <button
                                    className={`lang-option ${language === 'ES' ? 'active' : ''}`}
                                    onClick={() => { setLanguage('ES'); setLangMenuOpen(false); }}
                                >
                                    ES - Español
                                </button>
                                <button
                                    className={`lang-option ${language === 'EN' ? 'active' : ''}`}
                                    onClick={() => { setLanguage('EN'); setLangMenuOpen(false); }}
                                >
                                    EN - English
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger button (mobile only) */}
                    <button
                        className={`hamburger${menuOpen ? ' is-open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="mobile-overlay" onClick={() => setMenuOpen(false)}>
                    <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
                        {NAV_ITEMS.map(({ id, label }) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                className={activeSection === id ? 'active' : ''}
                                onClick={handleNavClick}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </Glass>
    );
};

export default Header;
