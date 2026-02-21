import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { GlassFilters } from 'glass-refraction';
import 'glass-refraction/css';

function App() {
  return (
    <div className="portfolio-app">
      <GlassFilters />
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-color)', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} Santiago. Diseñado en React.</p>
      </footer>
    </div>
  );
}

export default App;
