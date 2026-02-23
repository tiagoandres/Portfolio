import React, { useState } from 'react';
import { GlassCard } from 'glass-refraction';
import './Contact.css';

const Contact = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Mensaje enviado. ¡Gracias por contactarme!');
        e.target.reset();
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2 className="section-title">Contáctame</h2>
                <div className="contact-wrapper">
                    <GlassCard className="contact-info">
                        <h3>Hablemos de tu próximo proyecto</h3>
                        <p className="contact-text">
                            Estoy disponible para oportunidades como Analista de Datos, consultorías en BI o simplemente para charlar sobre visualización de datos.
                        </p>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <a href="mailto:santiagoace1411@gmail.com">santiagoace1411@gmail.com</a>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Sociales</span>
                            <div className="social-links">
                                <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href="https://www.linkedin.com/in/santiagocardenasucv/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard as="form" className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id="name" required placeholder="Tu nombre" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required placeholder="tu@email.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Mensaje</label>
                            <textarea id="message" rows="5" required placeholder="¿En qué te puedo ayudar?"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Enviar Mensaje</button>
                        {status && <div className="status-message">{status}</div>}
                    </GlassCard>
                </div>
            </div>
        </section>
    );
};

export default Contact;
