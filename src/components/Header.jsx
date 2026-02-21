import React, { useState, useEffect } from 'react';
import { Glass } from 'glass-refraction';
import './Header.css';

const Header = () => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['hero', 'about', 'experience', 'projects', 'contact'];
            let current = 'hero';
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        current = section;
                    }
                }
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
                <nav className="nav-links">
                    {['hero', 'about', 'experience', 'projects', 'contact'].map((id) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className={activeSection === id ? 'active' : ''}
                        >
                            {id === 'hero' ? 'Inicio' :
                                id === 'about' ? 'Sobre Mí' :
                                    id === 'experience' ? 'Experiencia' :
                                        id === 'projects' ? 'Proyectos' : 'Contacto'}
                        </a>
                    ))}
                </nav>
            </div>
        </Glass>
    );
};

export default Header;
