import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Experience.css';

const Experience = () => {
    const { t } = useLanguage();
    const experiences = [1, 2, 3].map(n => ({
        id: n,
        role: t(`exp${n}_role`),
        company: t(`exp${n}_company`),
        period: t(`exp${n}_period`),
        description: t(`exp${n}_desc`),
    }));

    return (
        <section id="experience" className="section experience-section">
            <div className="container section-grid">
                <p className="section-label"><span className="num">02</span>{t('nav_experience')}</p>

                <div>
                    <h2 className="section-title">{t('exp_title')}</h2>
                    <ol className="exp-list">
                        {experiences.map((exp) => (
                            <li key={exp.id} className="exp-item">
                                <span className="exp-period meta">{exp.period}</span>
                                <div className="exp-body">
                                    <h3 className="exp-role">{exp.role}</h3>
                                    <p className="exp-company">{exp.company}</p>
                                    <p className="exp-desc">{exp.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
};

export default Experience;
