import React from 'react';
import { Glass } from 'glass-refraction';
import './Header.css';

const Header = () => {
    return (
        <Glass as="header" className="header">
            <div className="header-container">
                <div className="logo">Portafolio</div>
                <nav className="nav-links">
                    <a href="#hero">Inicio</a>
                    <a href="#about">Sobre Mí</a>
                    <a href="#experience">Experiencia</a>
                    <a href="#projects">Proyectos</a>
                    <a href="#contact">Contacto</a>
                </nav>
            </div>
        </Glass>
    );
};

export default Header;
