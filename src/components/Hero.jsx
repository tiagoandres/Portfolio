import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">
                    Hola, soy <span className="highlight">Santiago Cárdenas</span>
                </h1>
                <h2 className="hero-subtitle">Analista de Datos / BI Analyst</h2>
                <p className="hero-description">
                    Especialista en análisis de datos y psicometría. Transformo datos complejos en insights accionables y dashboards interactivos para potenciar la toma de decisiones.
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
