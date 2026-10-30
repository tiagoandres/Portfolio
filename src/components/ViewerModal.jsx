import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ViewerModal.css';

// Full-screen viewer for embedded documents (PDFs, Power BI, HTML reports).
const ViewerModal = ({ eyebrow, title, sources, onClose }) => {
    const { t } = useLanguage();
    const closeRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className="viewer-overlay" onClick={onClose}>
            <div
                className="viewer"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="viewer-header">
                    <div className="viewer-heading">
                        {eyebrow && <span className="meta">{eyebrow}</span>}
                        <h3 className="viewer-title">{title}</h3>
                    </div>
                    <button ref={closeRef} className="viewer-close meta" onClick={onClose}>
                        {t('viewer_close')} <span aria-hidden="true">✕</span>
                    </button>
                </div>
                <div className="viewer-body">
                    {sources.map((src, index) => (
                        <iframe
                            key={src}
                            title={`${title} — ${index + 1}`}
                            src={src}
                            allowFullScreen
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewerModal;
