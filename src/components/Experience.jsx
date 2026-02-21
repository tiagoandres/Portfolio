import React from 'react';
import './Experience.css';

const Experience = () => {
    const experiences = [
        {
            id: 1,
            role: "Desarrollador Frontend",
            company: "Tech Solutions Inc.",
            period: "2023 - Presente",
            description: "Desarrollo y mantenimiento de interfaces de usuario utilizando React. Colaboración con equipos de diseño para implementar sistemas de diseño escalables."
        },
        {
            id: 2,
            role: "Desarrollador Web Junior",
            company: "Agencia Creativa",
            period: "2021 - 2023",
            description: "Creación de sitios web interactivos para clientes. Optimización de rendimiento web y SEO."
        }
    ];

    return (
        <section id="experience" className="experience-section">
            <div className="container">
                <h2 className="section-title">Experiencia Profesional</h2>
                <div className="timeline">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <span className="period">{exp.period}</span>
                                <h3 className="role">{exp.role}</h3>
                                <h4 className="company">{exp.company}</h4>
                                <p className="description">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
