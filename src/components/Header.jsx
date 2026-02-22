import React, { useState, useEffect } from 'react';
import { Glass } from 'glass-refraction';
import './Header.css';

const NAV_ITEMS = [
    { id: 'hero', label: 'Inicio' },
    { id: 'about', label: 'Sobre Mí' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'publications', label: 'Publicaciones' },
    { id: 'contact', label: 'Contacto' },
];

const Header = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [menuOpen, setMenuOpen] = useState(false);

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

                {/* Hamburger button (mobile only) */}
                <button
                    className={`hamburger${menuOpen ? ' is-open' : ''}`}
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
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
