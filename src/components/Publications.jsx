import React, { useState, useEffect } from 'react';
import { GlassCard } from 'glass-refraction';
import './Publications.css';

const publications = [
    {
        id: 1,
        title: "CUBUS-I",
        fullTitle: "Diseño, Validez, Confiabilidad y Normas del Cuestionario de Búsqueda de Sensaciones I",
        description: "Desarrollo y validación psicométrica de un instrumento para medir la búsqueda de sensaciones en población hispanohablante.",
        tags: ["Psicometría", "Validez", "Cuestionario"],
        pdf: "/cubus-i.pdf"
    },
    {
        id: 2,
        title: "E-SAMP",
        fullTitle: "Diseño, Validez, Confiabilidad y Normas de la Escala de Salud Mental Positiva",
        description: "Construcción y validación de una escala para evaluar el bienestar psicológico y la salud mental desde una perspectiva positiva.",
        tags: ["Salud Mental", "Psicometría", "Bienestar"],
        pdf: "/e-samp.pdf"
    }
];

const Publications = () => {
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedPdf(null);
        };
        if (selectedPdf) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [selectedPdf]);

    return (
        <>
            <section id="publications" className="publications-section">
                <div className="container">
                    <h2 className="section-title">Publicaciones</h2>
                    <p className="publications-subtitle">
                        Artículos académicos publicados en el área de psicometría y salud mental.
                    </p>
                    <div className="publications-grid">
                        {publications.map((pub) => (
                            <GlassCard key={pub.id} className="pub-card">
                                <div className="pub-content">
                                    <div className="pub-icon">📄</div>
                                    <span className="pub-acronym">{pub.title}</span>
                                    <h3 className="pub-title">{pub.fullTitle}</h3>
                                    <p className="pub-desc">{pub.description}</p>
                                    <div className="pub-tags">
                                        {pub.tags.map((tag, i) => (
                                            <span key={i} className="pub-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pub-footer">
                                    <button
                                        className="btn-view"
                                        onClick={() => setSelectedPdf(pub)}
                                    >
                                        Ver publicación →
                                    </button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {selectedPdf && (
                <div className="pdf-overlay" onClick={() => setSelectedPdf(null)}>
                    <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="pdf-modal-header">
                            <div className="pdf-modal-title">
                                <span className="pdf-modal-acronym">{selectedPdf.title}</span>
                                <span className="pdf-modal-subtitle">{selectedPdf.fullTitle}</span>
                            </div>
                            <button className="pdf-close-btn" onClick={() => setSelectedPdf(null)}>✕</button>
                        </div>
                        <div className="pdf-viewer-wrapper">
                            <iframe
                                src={selectedPdf.pdf}
                                title={selectedPdf.fullTitle}
                                className="pdf-iframe"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Publications;
