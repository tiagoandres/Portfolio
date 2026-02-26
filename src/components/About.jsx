import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
    const { t } = useLanguage();
    return (
        <section id="about" className="about-section">
            <div className="container">
                <h2 className="section-title">{t('about_title')}</h2>
                <div className="about-content">
                    <div className="about-text">
                        <p>{t('about_p1')}</p>
                        <p>{t('about_p2')}</p>
                    </div>
                    <div className="skills-container">
                        <h3>{t('about_skills_title')}</h3>
                        <ul className="skills-list">
                            <li>Power BI & Looker Studio</li>
                            <li>Python & R</li>
                            <li>SQL & Bases de Datos</li>
                            <li>Machine Learning</li>
                            <li>Google Ads, Meta Ads & Semrush</li>
                            <li>Psicometría & Estadística Aplicada</li>
                            <li>Inteligencia artificial</li>
                        </ul>
                    </div>
                </div>

                <div className="education-container">
                    <h3>{t('about_edu_title')}</h3>

                    <div className="edu-grid">
                        <div className="edu-item">
                            <h4 className="edu-degree">{t('about_edu1_degree')}</h4>
                            <div className="edu-meta">
                                <span className="edu-school">{t('about_edu1_school')}</span>
                                <span className="edu-date">{t('about_edu1_date')}</span>
                            </div>
                            <p className="edu-details">
                                <strong>{t('about_edu1_relevant')}</strong> {t('about_edu1_desc')}
                            </p>
                        </div>

                        <div className="edu-item">
                            <h4 className="edu-degree">{t('about_edu2_degree')}</h4>
                            <div className="edu-meta">
                                <span className="edu-school">{t('about_edu2_school')}</span>
                                <span className="edu-date">{t('about_edu2_date')}</span>
                            </div>
                            <p className="edu-details">
                                <strong>{t('about_edu2_honors')}</strong> {t('about_edu2_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
