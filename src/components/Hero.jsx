import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();

    const facts = [
        { label: t('hero_fact_now'), value: `${t('exp1_role')}, ${t('exp1_company')}` },
        { label: t('hero_fact_teaching'), value: t('hero_fact_teaching_value') },
        { label: t('hero_fact_background'), value: t('hero_fact_background_value') },
    ];

    return (
        <section id="hero" className="hero-section">
            <div className="container">
                <p className="hero-eyebrow meta">
                    <span className="hero-dot" aria-hidden="true" />
                    {t('hero_role')}
                </p>

                <h1 className="hero-title">
                    {t('hero_title_a')} <em>{t('hero_title_em')}</em> {t('hero_title_b')}
                </h1>

                <div className="hero-bottom">
                    <div className="hero-intro">
                        <p className="hero-description">{t('hero_desc')}</p>
                        <div className="hero-actions">
                            <a href="#projects" className="btn btn-solid">{t('hero_btn_projects')}</a>
                            <a href="#contact" className="btn btn-ghost">{t('hero_btn_contact')}</a>
                        </div>
                    </div>

                    <dl className="hero-facts">
                        {facts.map(({ label, value }) => (
                            <div key={label} className="hero-fact">
                                <dt className="meta">{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
};

export default Hero;
