import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">
                    Hola, soy <span className="highlight">Santiago</span>
                </h1>
                <h2 className="hero-subtitle">Desarrollador Web</h2>
                <p className="hero-description">
                    Construyendo experiencias digitales modernas, rápidas y escalables con React y tecnologías web de vanguardia.
                </p>
                <div className="hero-actions">
                    <a href="#projects" className="btn btn-primary">Ver mis proyectos</a>
                    <a href="#contact" className="btn btn-secondary">Contactar</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
