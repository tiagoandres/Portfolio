import React from 'react';
import './Projects.css';

const Projects = () => {
    const projects = [
        {
            id: 1,
            title: "E-Commerce App",
            description: "Plataforma de comercio electrónico completa con carrito de compras, pagos integrados y panel de administración.",
            tech: ["React", "Node.js", "Stripe"],
            link: "#"
        },
        {
            id: 2,
            title: "Task Management Board",
            description: "Aplicación tipo Kanban para gestión de proyectos con funcionalidad drag-and-drop en tiempo real.",
            tech: ["React", "Firebase", "Tailwind"],
            link: "#"
        },
        {
            id: 3,
            title: "Weather Dashboard",
            description: "Dashboard meteorológico que muestra pronósticos detallados consumiendo apis externas de clima.",
            tech: ["JavaScript", "HTML/CSS", "APIREST"],
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
