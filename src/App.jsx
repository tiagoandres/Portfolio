import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { GlassFilters } from "glass-refraction";
import "glass-refraction/css";
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Publications from './components/Publications';
import Contact from './components/Contact';

function App() {
  return (
    <>
      <Analytics />
      <AnimatedBackground />
      <div className="portfolio-app">
        <GlassFilters />
        <Header />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Publications />
          <Contact />
        </main>
        <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--footer-color)', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Santiago. Diseñado en React.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
