import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  // Keep ref in sync
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width, height;
    let dpr = window.devicePixelRatio || 1;

    // ─── Nodes (Network Graph) ─────────────────────────────────
    const nodes = [];
    const NODE_COUNT = 65;
    const CONNECTION_DIST = 180;

    // ─── Bell Curves ───────────────────────────────────────────
    const bellCurves = [];
    const BELL_COUNT = 3;

    // ─── Code Rain Particles ───────────────────────────────────
    const codeParticles = [];
    const CODE_PARTICLE_COUNT = 40;
    const codeSnippets = [
      'def', 'import', 'return', 'class', 'for', 'if', 'else',
      'np.', 'pd.', 'fit()', 'predict()', 'model', 'data',
      'train', 'test', 'loss', 'accuracy', 'epoch', 'batch',
      'x =', 'y =', 'lambda', 'map()', 'filter', 'reduce',
      '0101', '1010', '>>>', '...', '===', '!=', '()', '{}',
      'σ', 'μ', 'Σ', 'Δ', 'θ', 'α', 'β', 'π', '∫', '∂',
      'p(x)', 'E[X]', 'Var', 'R²', 'log', 'exp', 'sin',
    ];

    // ─── Grid Lines ────────────────────────────────────────────
    const GRID_SPACING = 80;

    // ─── Floating Symbols ──────────────────────────────────────
    const floatingSymbols = [];
    const SYMBOL_COUNT = 12;
    const symbols = ['σ', 'μ', 'Σ', '∫', 'Δ', 'θ', 'π', '∂', 'α', 'β', 'ε', 'λ'];

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2.5 + 1,
          colorIdx: Math.floor(Math.random() * 4),
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const initBellCurves = () => {
      bellCurves.length = 0;
      for (let i = 0; i < BELL_COUNT; i++) {
        bellCurves.push({
          centerX: width * (0.2 + i * 0.3) + (Math.random() - 0.5) * 100,
          centerY: height * (0.55 + Math.random() * 0.3),
          sigma: 60 + Math.random() * 80,
          amplitude: 80 + Math.random() * 60,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.4,
          colorIdx: i % 3,
          drift: (Math.random() - 0.5) * 0.15,
        });
      }
    };

    const initCodeParticles = () => {
      codeParticles.length = 0;
      for (let i = 0; i < CODE_PARTICLE_COUNT; i++) {
        codeParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          opacity: Math.random() * 0.12 + 0.03,
          speed: Math.random() * 0.3 + 0.1,
          size: Math.random() * 6 + 9,
        });
      }
    };

    const initFloatingSymbols = () => {
      floatingSymbols.length = 0;
      for (let i = 0; i < SYMBOL_COUNT; i++) {
        floatingSymbols.push({
          x: Math.random() * width,
          y: Math.random() * height,
          symbol: symbols[i % symbols.length],
          size: 18 + Math.random() * 30,
          opacity: 0.04 + Math.random() * 0.06,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.15,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.005,
        });
      }
    };

    // ─── Theme-aware colors ─────────────────────────────────────
    const darkNodeColors = [
      [0, 200, 255],    // Cyan
      [80, 255, 160],   // Green
      [255, 160, 50],   // Orange
      [140, 100, 255],  // Purple
    ];

    const lightNodeColors = [
      [8, 145, 178],    // Teal
      [5, 150, 105],    // Green
      [217, 119, 6],    // Amber
      [124, 58, 237],   // Purple
    ];

    const darkCurveColors = [
      { r: 80, g: 210, b: 255 },
      { r: 100, g: 255, b: 170 },
      { r: 255, g: 180, b: 60 },
    ];

    const lightCurveColors = [
      { r: 8, g: 145, b: 178 },
      { r: 5, g: 150, b: 105 },
      { r: 217, g: 119, b: 6 },
    ];

    const getNodeColors = () => themeRef.current === 'dark' ? darkNodeColors : lightNodeColors;
    const getCurveColors = () => themeRef.current === 'dark' ? darkCurveColors : lightCurveColors;

    const gaussian = (x, mu, sigma) => {
      return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    };

    const drawGrid = (time) => {
      ctx.save();
      const offset = (time * 8) % GRID_SPACING;
      const isLight = themeRef.current === 'light';
      ctx.strokeStyle = isLight
        ? 'rgba(8, 145, 178, 0.06)'
        : 'rgba(30, 80, 120, 0.06)';
      ctx.lineWidth = 0.5;

      for (let x = -offset; x < width + GRID_SPACING; x += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = -offset; y < height + GRID_SPACING; y += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawNodes = (time) => {
      const nodeColors = getNodeColors();
      const isLight = themeRef.current === 'light';

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * (isLight ? 0.12 : 0.15);
            const c = nodeColors[nodes[i].colorIdx];
            ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw node dots
      for (const node of nodes) {
        const c = nodeColors[node.colorIdx];
        const pulseScale = 1 + Math.sin(node.pulse) * 0.3;
        const r = node.radius * pulseScale;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
        gradient.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${isLight ? 0.2 : 0.3})`);
        gradient.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${isLight ? 0.5 : 0.7})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawBellCurves = (time) => {
      const curveColors = getCurveColors();
      const isLight = themeRef.current === 'light';

      for (const curve of bellCurves) {
        const c = curveColors[curve.colorIdx];
        const phaseOffset = time * curve.speed + curve.phase;
        const currentCenterX = curve.centerX + Math.sin(phaseOffset) * 60;
        const currentSigma = curve.sigma + Math.sin(phaseOffset * 0.7) * 15;

        ctx.save();
        ctx.globalAlpha = isLight ? 0.08 : 0.12;

        ctx.beginPath();
        ctx.moveTo(currentCenterX - currentSigma * 4, curve.centerY);
        for (let x = -currentSigma * 4; x <= currentSigma * 4; x += 2) {
          const g = gaussian(x, 0, currentSigma);
          const px = currentCenterX + x;
          const py = curve.centerY - g * curve.amplitude;
          ctx.lineTo(px, py);
        }
        ctx.lineTo(currentCenterX + currentSigma * 4, curve.centerY);
        ctx.closePath();

        const fillGrad = ctx.createLinearGradient(
          currentCenterX, curve.centerY - curve.amplitude,
          currentCenterX, curve.centerY
        );
        fillGrad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${isLight ? 0.1 : 0.15})`);
        fillGrad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0.02)`);
        ctx.fillStyle = fillGrad;
        ctx.fill();

        ctx.globalAlpha = isLight ? 0.18 : 0.25;
        ctx.beginPath();
        for (let x = -currentSigma * 4; x <= currentSigma * 4; x += 2) {
          const g = gaussian(x, 0, currentSigma);
          const px = currentCenterX + x;
          const py = curve.centerY - g * curve.amplitude;
          if (x === -currentSigma * 4) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${isLight ? 0.4 : 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();

        curve.centerX += curve.drift;
        if (curve.centerX < -200) curve.centerX = width + 200;
        if (curve.centerX > width + 200) curve.centerX = -200;
      }
    };

    const drawCodeParticles = (time) => {
      const isLight = themeRef.current === 'light';
      ctx.save();
      ctx.font = '12px "Fira Code", "Courier New", monospace';

      for (const p of codeParticles) {
        p.y -= p.speed;
        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
          p.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = isLight
          ? 'rgba(8, 145, 178, 1)'
          : 'rgba(100, 200, 255, 1)';
        ctx.font = `${p.size}px "Fira Code", "Courier New", monospace`;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.restore();
    };

    const drawFloatingSymbols = (time) => {
      const isLight = themeRef.current === 'light';
      ctx.save();
      for (const s of floatingSymbols) {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        if (s.x < -50) s.x = width + 50;
        if (s.x > width + 50) s.x = -50;
        if (s.y < -50) s.y = height + 50;
        if (s.y > height + 50) s.y = -50;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.opacity;
        ctx.font = `${s.size}px "Inter", serif`;
        ctx.fillStyle = isLight
          ? 'rgba(8, 100, 160, 0.8)'
          : 'rgba(150, 200, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.symbol, 0, 0);
        ctx.restore();
      }
      ctx.restore();
    };

    const drawVignette = () => {
      const isLight = themeRef.current === 'light';
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, height * 0.2,
        width / 2, height / 2, height * 0.9
      );
      if (isLight) {
        gradient.addColorStop(0, 'rgba(240, 244, 248, 0)');
        gradient.addColorStop(1, 'rgba(228, 234, 241, 0.5)');
      } else {
        gradient.addColorStop(0, 'rgba(6, 12, 24, 0)');
        gradient.addColorStop(1, 'rgba(4, 8, 16, 0.7)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    // ─── Initialize ────────────────────────────────────────────
    resize();
    initNodes();
    initBellCurves();
    initCodeParticles();
    initFloatingSymbols();

    const handleResize = () => {
      resize();
      initNodes();
      initBellCurves();
      initCodeParticles();
      initFloatingSymbols();
    };

    window.addEventListener('resize', handleResize);

    // ─── Render Loop ───────────────────────────────────────────
    const render = (timestamp) => {
      const time = timestamp * 0.001;
      const isLight = themeRef.current === 'light';

      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width * 0.3, height);
      if (isLight) {
        bgGrad.addColorStop(0, '#f0f4f8');
        bgGrad.addColorStop(0.4, '#e8eef5');
        bgGrad.addColorStop(0.7, '#edf2f7');
        bgGrad.addColorStop(1, '#e4eaf1');
      } else {
        bgGrad.addColorStop(0, '#060c1a');
        bgGrad.addColorStop(0.4, '#0a1628');
        bgGrad.addColorStop(0.7, '#081420');
        bgGrad.addColorStop(1, '#050b15');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw layers
      drawGrid(time);
      drawBellCurves(time);
      drawFloatingSymbols(time);
      drawCodeParticles(time);
      drawNodes(time);
      drawVignette();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="animated-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="webgl-canvas" />
    </div>
  );
};

export default AnimatedBackground;
