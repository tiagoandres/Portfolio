import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Publications from './components/Publications';
import Contact from './components/Contact';

function App() {
  const { t } = useLanguage();

  return (
    <>
      <Analytics />
      <div className="portfolio-app">
        <Header />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Publications />
          <Contact />
        </main>
        <footer className="site-footer">
          <div className="container">
            <span className="meta">&copy; {new Date().getFullYear()} Santiago Cárdenas</span>
            <a href="#hero" className="meta">{t('footer_top')} ↑</a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
