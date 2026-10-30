import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
    const { t } = useLanguage();

    const education = [
        {
            degree: t('about_edu1_degree'),
            school: t('about_edu1_school'),
            date: t('about_edu1_date'),
            noteLabel: t('about_edu1_relevant'),
            note: t('about_edu1_desc'),
        },
        {
            degree: t('about_edu2_degree'),
            school: t('about_edu2_school'),
            date: t('about_edu2_date'),
            noteLabel: t('about_edu2_honors'),
            note: t('about_edu2_desc'),
        },
    ];

    return (
        <section id="about" className="section about-section">
            <div className="container section-grid">
                <p className="section-label"><span className="num">01</span>{t('nav_about')}</p>

                <div>
                    <h2 className="section-title">{t('about_title')}</h2>

                    <div className="about-text">
                        <p className="about-lead">{t('about_p1')}</p>
                        <p>{t('about_p2')}</p>
                    </div>

                    <div className="about-columns">
                        <div>
                            <h3 className="sub-heading meta">{t('about_skills_title')}</h3>
                            <ul className="skills-list">
                                {t('about_skills').map(skill => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="sub-heading meta">{t('about_edu_title')}</h3>
                            <ol className="edu-list">
                                {education.map(edu => (
                                    <li key={edu.degree} className="edu-item">
                                        <span className="meta">{edu.date}</span>
                                        <h4 className="edu-degree">{edu.degree}</h4>
                                        <p className="edu-school">{edu.school}</p>
                                        <p className="edu-details">
                                            <span>{edu.noteLabel}</span> {edu.note}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
