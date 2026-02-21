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
                            Soy un apasionado del desarrollo de software, con un enfoque particular en crear interfaces de usuario limpias e intuitivas. Mi objetivo es convertir ideas complejas en productos digitales accesibles y eficientes.
                        </p>
                        <p>
                            Constantemente estoy aprendiendo nuevas tecnologías y mejores prácticas para mejorar la calidad del software que produzco.
                        </p>
                    </div>
                    <div className="skills-container">
                        <h3>Habilidades Destacadas</h3>
                        <ul className="skills-list">
                            <li>React & Redux</li>
                            <li>JavaScript (ES6+)</li>
                            <li>HTML5 & CSS3</li>
                            <li>Node.js (Básico)</li>
                            <li>Git & GitHub</li>
                            <li>UI/UX Design UI</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
