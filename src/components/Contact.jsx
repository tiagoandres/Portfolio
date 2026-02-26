import React, { useState } from 'react';
import { GlassCard } from 'glass-refraction';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(t('contact_status_sending'));

        const form = e.target;
        const formData = new FormData(form);

        // Configuraciones de FormSubmit para evitar bloqueos
        formData.append('_captcha', 'false'); // Desactiva el captcha para peticiones AJAX

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
                setStatus(t('contact_status_success'));
                form.reset();
            } else {
                setStatus(t('contact_status_err_send'));
            }
        } catch (error) {
            setStatus(t('contact_status_err_net'));
        }

        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2 className="section-title">{t('contact_title')}</h2>
                <div className="contact-wrapper">
                    <GlassCard className="contact-info">
                        <h3>{t('contact_subtitle')}</h3>
                        <p className="contact-text">
                            {t('contact_text')}
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
                            <label htmlFor="name">{t('contact_form_name')}</label>
                            <input type="text" id="name" name="name" required placeholder={t('contact_form_name_ph')} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{t('contact_form_email')}</label>
                            <input type="email" id="email" name="email" required placeholder={t('contact_form_email_ph')} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">{t('contact_form_msg')}</label>
                            <textarea id="message" name="message" rows="5" required placeholder={t('contact_form_msg_ph')}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">{t('contact_btn_send')}</button>
                        {status && <div className="status-message">{status}</div>}
                    </GlassCard>
                </div>
            </div>
        </section>
    );
};

export default Contact;
