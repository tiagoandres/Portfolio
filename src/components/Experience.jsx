import React from 'react';
import './Experience.css';

const Experience = () => {
    const experiences = [
        {
            id: 1,
            role: "Analista de Inteligencia de Negocios",
            company: "Back9",
            period: "Nov. 2024 - Presente",
            description: "Diseño y desarrollo de dashboards interactivos en Power BI. Análisis de mercado y competencia con Semrush y Google Ads. Modelos predictivos en Python/R."
        },
        {
            id: 2,
            role: "Profesor por Concurso de Oposición",
            company: "Universidad Central de Venezuela",
            period: "Sep. 2022 - Ago. 2025",
            description: "Docencia en Psicometría y Estadística. Supervisión de investigaciones cuantitativas y talleres de SPSS/Excel."
        },
        {
            id: 3,
            role: "Tutor Privado",
            company: "Superprof.com",
            period: "Ago. 2022 - Presente",
            description: "Asesorías personalizadas en metodología y análisis de datos a más de 50 estudiantes en Europa y Latinoamérica."
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
