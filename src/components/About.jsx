import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="container">
                <h2 className="section-title">Sobre Mí & Formación</h2>
                <div className="about-content">
                    <div className="about-text">
                        <p>
                            Soy un profesional híbrido con una combinación única: Licenciado en Psicología Clínica y Especialista en Análisis de Datos. Esto me permite no solo procesar información técnica, sino también entender el comportamiento humano detrás de los números.
                        </p>
                        <p>
                            Me enfoco en el análisis de mercado, la inteligencia de negocios y la creación de dashboards interactivos. Mi objetivo es transformar datos sin procesar en decisiones estratégicas claras.
                        </p>
                    </div>
                    <div className="skills-container">
                        <h3>Habilidades Destacadas</h3>
                        <ul className="skills-list">
                            <li>Power BI & Looker Studio</li>
                            <li>Python & R</li>
                            <li>SQL & Bases de Datos</li>
                            <li>Machine Learning</li>
                            <li>Google Ads, Meta Ads & Semrush</li>
                            <li>Psicometría & Estadística Aplicada</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
