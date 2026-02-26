import React from 'react';
import { GlassCard } from 'glass-refraction';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="hero" className="hero-section">
            <GlassCard className="hero-content">
                <h1 className="hero-title">{t('hero_greeting')} <br /><span className="highlight">{t('hero_name_highlight')}</span></h1>
                <h2 className="hero-subtitle">{t('hero_role')}</h2>
                <p className="hero-description">
                    {t('hero_desc')}
                </p>
                <div className="hero-actions">
                    <a href="#projects" className="btn btn-primary">{t('hero_btn_projects')}</a>
                    <a href="#contact" className="btn btn-secondary">{t('hero_btn_contact')}</a>
                </div>
            </GlassCard>
        </section>
    );
};

export default Hero;
