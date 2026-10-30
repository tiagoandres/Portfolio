import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const EMAIL = 'santiagoace1411@gmail.com';

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
            const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
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
        } catch {
            setStatus(t('contact_status_err_net'));
        }

        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <section id="contact" className="section contact-section">
            <div className="container section-grid">
                <p className="section-label"><span className="num">05</span>{t('nav_contact')}</p>

                <div>
                    <h2 className="section-title contact-title">{t('contact_subtitle')}</h2>

                    <div className="contact-wrapper">
                        <div className="contact-info">
                            <p className="contact-text">{t('contact_text')}</p>
                            <dl className="contact-channels">
                                <div>
                                    <dt className="meta">Email</dt>
                                    <dd><a className="text-link" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
                                </div>
                                <div>
                                    <dt className="meta">LinkedIn</dt>
                                    <dd>
                                        <a className="text-link" href="https://www.linkedin.com/in/santiagocardenasucv/" target="_blank" rel="noopener noreferrer">
                                            santiagocardenasucv <span className="arrow" aria-hidden="true">↗</span>
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name" className="meta">{t('contact_form_name')}</label>
                                <input type="text" id="name" name="name" required placeholder={t('contact_form_name_ph')} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="meta">{t('contact_form_email')}</label>
                                <input type="email" id="email" name="email" required placeholder={t('contact_form_email_ph')} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message" className="meta">{t('contact_form_msg')}</label>
                                <textarea id="message" name="message" rows="4" required placeholder={t('contact_form_msg_ph')}></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-solid">{t('contact_btn_send')}</button>
                                <p className="status-message" role="status" aria-live="polite">{status}</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
