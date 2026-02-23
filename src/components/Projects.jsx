import React, { useState } from 'react';
import { GlassCard } from 'glass-refraction';
import './Projects.css';

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const projects = [
        {
            id: 1,
            title: "Dashboards Interactivos",
            description: "Visualización completa del funnel de ventas, análisis regional y KPIs de rendimiento comercial.",
            tech: ["Power BI", "DAX", "SQL"],
            iframes: [
                "https://app.powerbi.com/view?r=eyJrIjoiN2E3NTAwNWUtZjMyMi00NjQ0LTgyMDEtMWM5ODE5ZTcyYmZiIiwidCI6IjE4OTdjYjgzLThhYWItNDY5MS1iMTRkLWJhNjFiYTk1OTg5MiIsImMiOjR9",
                "https://app.powerbi.com/view?r=eyJrIjoiOWNlMWRkMTgtYjlmZi00MmNhLWExNTItYjU5NzFhNTRhOGM5IiwidCI6IjE4OTdjYjgzLThhYWItNDY5MS1iMTRkLWJhNjFiYTk1OTg5MiIsImMiOjR9"
            ],
            link: "#" // Fallback link
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

    const handleProjectClick = (e, project) => {
        if (project.iframes && project.iframes.length > 0) {
            e.preventDefault();
            setSelectedProject(project);
            setIsModalOpen(true);
            document.body.style.overflow = 'hidden'; // Evitar scroll del body
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300); // Esperar animación de cierre
        document.body.style.overflow = 'auto'; // Restaurar scroll
    };

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <h2 className="section-title">Mis Proyectos</h2>
                <div className="projects-grid">
                    {projects.map((project) => (
                        <GlassCard key={project.id} className="project-card">
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
                                <a
                                    href={project.link}
                                    className="btn-link"
                                    target={project.iframes ? "_self" : "_blank"}
                                    rel={project.iframes ? "" : "noreferrer"}
                                    onClick={(e) => handleProjectClick(e, project)}
                                >
                                    Ver Proyecto &rarr;
                                </a>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Modal para Iframes */}
            {isModalOpen && selectedProject && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>&times;</button>
                        <h3 className="modal-title">{selectedProject.title}</h3>
                        <div className={`iframes-container ${selectedProject.iframes.length > 1 ? 'multi-iframe' : ''}`}>
                            {selectedProject.iframes.map((iframeUrl, index) => (
                                <iframe
                                    key={index}
                                    title={`Dashboard Power BI ${index + 1}`}
                                    src={iframeUrl}
                                    allowFullScreen="true"
                                ></iframe>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Projects;
