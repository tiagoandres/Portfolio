import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ViewerModal from './ViewerModal';
import './Projects.css';

const Projects = () => {
    const { t } = useLanguage();
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        {
            id: 4,
            title: t('proj4_title'),
            description: t('proj4_desc'),
            tech: ["Supabase", "PostgreSQL", "Next.js", "React", "Tailwind CSS"],
            iframes: ["/resumen-ucv.pdf"],
            link: "https://evaluacion-curricular.vercel.app/"
        },
        {
            id: 2,
            title: t('proj3_title'),
            description: t('proj3_desc'),
            tech: ["Python", "Machine Learning", "Pandas", "Data Science"],
            iframes: [
                "/Segmentación_campañas.html"
            ]
        },
        {
            id: 1,
            title: t('proj1_title'),
            description: t('proj1_desc'),
            tech: ["Power BI", "DAX", "SQL"],
            iframes: [
                "https://app.powerbi.com/view?r=eyJrIjoiN2E3NTAwNWUtZjMyMi00NjQ0LTgyMDEtMWM5ODE5ZTcyYmZiIiwidCI6IjE4OTdjYjgzLThhYWItNDY5MS1iMTRkLWJhNjFiYTk1OTg5MiIsImMiOjR9",
                "https://app.powerbi.com/view?r=eyJrIjoiOWNlMWRkMTgtYjlmZi00MmNhLWExNTItYjU5NzFhNTRhOGM5IiwidCI6IjE4OTdjYjgzLThhYWItNDY5MS1iMTRkLWJhNjFiYTk1OTg5MiIsImMiOjR9"
            ]
        },
        {
            id: 3,
            title: t('proj2_title'),
            description: t('proj2_desc'),
            tech: ["R", "Quarto", "Data Science", "Estadística"],
            iframes: [
                "/analisis-inferencial.html"
            ]
        }
    ];

    return (
        <section id="projects" className="section projects-section">
            <div className="container section-grid">
                <p className="section-label"><span className="num">03</span>{t('nav_projects')}</p>

                <div>
                    <h2 className="section-title">{t('proj_title')}</h2>
                    <ol className="project-list">
                        {projects.map((project, i) => (
                            <li key={project.id} className="project-item">
                                <span className="project-index meta">{String(i + 1).padStart(2, '0')}</span>
                                <div className="project-body">
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-desc">{project.description}</p>
                                    <p className="project-tech meta">{project.tech.join(' · ')}</p>
                                </div>
                                <div className="project-links">
                                    {project.link ? (
                                        <>
                                            <a href={project.link} className="text-link" target="_blank" rel="noreferrer">
                                                {t('proj_btn_project')} <span className="arrow" aria-hidden="true">↗</span>
                                            </a>
                                            <button className="text-link" onClick={() => setSelectedProject(project)}>
                                                {t('proj_btn_summary')}
                                            </button>
                                        </>
                                    ) : (
                                        <button className="text-link" onClick={() => setSelectedProject(project)}>
                                            {t('proj_btn_view')} <span className="arrow" aria-hidden="true">→</span>
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {selectedProject && (
                <ViewerModal
                    eyebrow={t('nav_projects')}
                    title={selectedProject.title}
                    sources={selectedProject.iframes}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
};

export default Projects;
