import React from 'react';
import './Projects.css';

const Projects = () => {
    const projects = [
        {
            id: 1,
            title: "Dashboard de Ventas Interactivo",
            description: "Visualización completa del funnel de ventas, análisis regional y KPIs de rendimiento comercial.",
            tech: ["Power BI", "DAX", "SQL"],
            link: "#"
        },
        {
            id: 2,
            title: "Segmentación de Clientes",
            description: "Análisis de clúster para identificar segmentos de usuarios y mejorar la efectividad de campañas publicitarias.",
            tech: ["Python", "Machine Learning", "Pandas"],
            link: "#"
        },
        {
            id: 3,
            title: "Reporte de Rendimiento SEO/SEM",
            description: "Dashboard analítico para evaluar el rendimiento de campañas, clics, CTR e impresiones.",
            tech: ["Looker Studio", "Google Analytics", "Google Ads"],
            link: "#"
        }
    ];

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <h2 className="section-title">Mis Proyectos</h2>
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map((t, index) => (
                                        <span key={index} className="tech-tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="project-links">
                                <a href={project.link} className="btn-link" target="_blank" rel="noreferrer">
                                    Ver Proyecto &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
