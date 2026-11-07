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

// Manuscripts under review or in preparation (APA reference style).
const manuscripts = [
    {
        id: 'm1',
        authors: "Camacho, C., Cárdenas, S. y Mora, C.",
        year: 2026,
        title: "Exposición a noticias y prejuicio implícito racial: un estudio cuasi-experimental en estudiantes universitarios",
        status: 'review'
    },
    {
        id: 'm2',
        authors: "Cárdenas, S.",
        year: 2026,
        title: "Implicaciones en la construcción de pruebas de papel y lápiz vs. pruebas computarizadas: una revisión sistemática",
        status: 'prep'
    },
    {
        id: 'm3',
        authors: "Cárdenas, S.",
        year: 2025,
        title: "El análisis factorial exploratorio y confirmatorio en la construcción de instrumentos psicológicos estandarizados",
        status: 'prep'
    },
    {
        id: 'm4',
        authors: "Abello, A., Camacho, J., Martinez, Y., Silva, M. y Cárdenas, S.",
        year: 2025,
        title: "Construcción y propiedades psicométricas de la Escala de Salud Mental en Estudiantes Universitarios (ESMEU)",
        status: 'review'
    }
];

const ME = "Cárdenas, S.";

// Highlights the author's own name inside the author list.
const Authors = ({ text }) => {
    const parts = text.split(ME);
    return parts.map((part, i) => (
        <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && <strong className="ms-me">{ME}</strong>}
        </React.Fragment>
    ));
};

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

                    <div className="manuscripts">
                        <h3 className="manuscripts-title">{t('pub_ms_title')}</h3>
                        <ol className="ms-list">
                            {manuscripts.map((ms) => (
                                <li key={ms.id} className="ms-item">
                                    <p className="ms-ref">
                                        <Authors text={ms.authors} /> ({ms.year}). <em>{ms.title}</em>.
                                    </p>
                                    <span className={`ms-status meta is-${ms.status}`}>
                                        {t(ms.status === 'review' ? 'pub_ms_review' : 'pub_ms_prep')}
                                    </span>
                                </li>
                            ))}
                        </ol>
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
