import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ViewerModal from './ViewerModal';
import './Publications.css';

const publications = [
    {
        id: 1,
        title: "CUBUS-I",
        fullTitle: "Diseño, Validez, Confiabilidad y Normas del Cuestionario de Búsqueda de Sensaciones I",
        descKey: 'pub1_desc',
        tags: ["Psicometría", "Validez", "Cuestionario"],
        pdf: "/cubus-i.pdf"
    },
    {
        id: 2,
        title: "E-SAMP",
        fullTitle: "Diseño, Validez, Confiabilidad y Normas de la Escala de Salud Mental Positiva",
        descKey: 'pub2_desc',
        tags: ["Salud Mental", "Psicometría", "Bienestar"],
        pdf: "/e-samp.pdf"
    }
];

const Publications = () => {
    const { t } = useLanguage();
    const [selectedPdf, setSelectedPdf] = useState(null);

    return (
        <section id="publications" className="section publications-section">
            <div className="container section-grid">
                <p className="section-label"><span className="num">04</span>{t('nav_publications')}</p>

                <div>
                    <h2 className="section-title">{t('pub_title')}</h2>
                    <p className="publications-subtitle">{t('pub_subtitle')}</p>

                    <div className="pub-list">
                        {publications.map((pub) => (
                            <article key={pub.id} className="pub-item">
                                <span className="pub-acronym meta">{pub.title}</span>
                                <h3 className="pub-title">{pub.fullTitle}</h3>
                                <p className="pub-desc">{t(pub.descKey)}</p>
                                <div className="pub-footer">
                                    <span className="meta">{pub.tags.join(' · ')}</span>
                                    <button className="text-link" onClick={() => setSelectedPdf(pub)}>
                                        {t('pub_btn_view')} <span className="arrow" aria-hidden="true">→</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {selectedPdf && (
                <ViewerModal
                    eyebrow={selectedPdf.title}
                    title={selectedPdf.fullTitle}
                    sources={[selectedPdf.pdf]}
                    onClose={() => setSelectedPdf(null)}
                />
            )}
        </section>
    );
};

export default Publications;
