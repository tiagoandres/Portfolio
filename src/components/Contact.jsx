import React, { useState } from 'react';
import { GlassCard } from 'glass-refraction';
import './Contact.css';

const Contact = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando mensaje...');

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("https://formsubmit.co/ajax/santiagoace1411@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setStatus('Mensaje enviado. ¡Gracias por contactarme!');
                form.reset();
            } else {
                setStatus('Hubo un problema al enviar el mensaje. Intenta de nuevo.');
            }
        } catch (error) {
            setStatus('Error de conexión. Por favor reintenta.');
        }

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
                            <div className="social-links"></div>
                            <a href="mailto:santiagoace1411@gmail.com">santiagoace1411@gmail.com</a>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Sociales</span>
                            <div className="social-links">
                                <a href="https://www.linkedin.com/in/santiagocardenasucv/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard as="form" className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id="name" name="name" required placeholder="Tu nombre" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required placeholder="tu@email.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Mensaje</label>
                            <textarea id="message" name="message" rows="5" required placeholder="¿En qué te puedo ayudar?"></textarea>
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
