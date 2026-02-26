import React from 'react';
import { GlassCard } from 'glass-refraction';
import { useLanguage } from '../context/LanguageContext';
import './Experience.css';

const Experience = () => {
    const { t } = useLanguage();
    const experiences = [
        {
            id: 1,
            role: t('exp1_role'),
            company: t('exp1_company'),
            period: t('exp1_period'),
            description: t('exp1_desc')
        },
        {
            id: 2,
            role: t('exp2_role'),
            company: t('exp2_company'),
            period: t('exp2_period'),
            description: t('exp2_desc')
        },
        {
            id: 3,
            role: t('exp3_role'),
            company: t('exp3_company'),
            period: t('exp3_period'),
            description: t('exp3_desc')
        }
    ];

    return (
        <section id="experience" className="experience-section">
            <div className="container">
                <h2 className="section-title">{t('exp_title')}</h2>
                <div className="timeline">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <GlassCard className="timeline-content">
                                <span className="period">{exp.period}</span>
                                <h3 className="role">{exp.role}</h3>
                                <h4 className="company">{exp.company}</h4>
                                <p className="description">{exp.description}</p>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
