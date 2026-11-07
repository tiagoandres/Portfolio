// Vector PDF report engine. Each block is drawn from its data spec (text,
// shapes, native tables) instead of screenshotting the DOM, so the report is
// crisp, selectable and never captures UI chrome.
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const INK = '#1b1a17';
const MUTED = '#5c584f';
const FAINT = '#8a857a';
const RULE = '#d5cfc2';
const GRID = '#e6e1d6';
const ACCENT = '#b0401b';
const GOOD = '#006300';
const BAD = '#d03b3b';

const PAGE = { w: 210, h: 297, m: 16 };
const CONTENT_TOP = 26;
const CONTENT_BOTTOM = PAGE.h - 18;

// Helvetica in jsPDF only covers WinAnsi: swap the few glyphs it lacks.
const clean = (s) => String(s ?? '')
  .replace(/→/g, '-')
  .replace(/[▲▼✓✕…]/g, '')
  .replace(/[\u202f\u00a0]/g, ' ');

function rgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
const fill = (doc, hex) => doc.setFillColor(...rgb(hex));
const stroke = (doc, hex) => doc.setDrawColor(...rgb(hex));
const ink = (doc, hex) => doc.setTextColor(...rgb(hex));

function niceMax(v) {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * exp;
}

class Report {
  constructor({ t, meta }) {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4' });
    this.t = t;
    this.meta = meta;
    this.y = CONTENT_TOP;
    this.section = '';
  }

  header() {
    const { doc } = this;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    ink(doc, INK);
    doc.text('AIRLINE BI', PAGE.m, 14);
    doc.setFont('helvetica', 'normal');
    ink(doc, FAINT);
    doc.text(clean(`${this.section}  ·  ${this.meta.period}  ·  ${this.meta.channel}`), PAGE.w - PAGE.m, 14, { align: 'right' });
    stroke(doc, RULE);
    doc.setLineWidth(0.2);
    doc.line(PAGE.m, 18, PAGE.w - PAGE.m, 18);
  }

  footer(n) {
    const { doc } = this;
    stroke(doc, RULE);
    doc.line(PAGE.m, PAGE.h - 12, PAGE.w - PAGE.m, PAGE.h - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    ink(doc, FAINT);
    doc.text(clean(this.t('pdfFooter')), PAGE.m, PAGE.h - 7);
    doc.text(`${this.t('pdfPage')} ${n}`, PAGE.w - PAGE.m, PAGE.h - 7, { align: 'right' });
  }

  newPage() {
    this.doc.addPage();
    this.header();
    this.y = CONTENT_TOP;
  }

  ensure(h) {
    if (this.y + h > CONTENT_BOTTOM) this.newPage();
  }

  cover(blockTitles) {
    const { doc, t, meta } = this;
    fill(doc, INK);
    doc.rect(0, 0, PAGE.w, 118, 'F');
    ink(doc, '#f4f1ea');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('AIRLINE BI  ·  DEMO', PAGE.m, 30);
    doc.setFont('times', 'normal');
    doc.setFontSize(34);
    doc.text(clean(t('pdfTitle')), PAGE.m, 62);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    ink(doc, '#c9c3b6');
    doc.text(clean(t('banner')), PAGE.m, 76, { maxWidth: PAGE.w - PAGE.m * 2 });
    fill(doc, ACCENT);
    doc.rect(PAGE.m, 104, 24, 1.2, 'F');

    // metadata strip
    const items = [
      [t('period'), meta.period],
      [t('channel'), meta.channel],
      [t('pdfGenerated'), meta.generated],
      [t('customPick'), String(blockTitles.length)],
    ];
    const xs = [PAGE.m, PAGE.m + 78, PAGE.m + 108, PAGE.m + 158];
    items.forEach(([label, value], i) => {
      const x = xs[i];
      doc.setFontSize(8);
      ink(doc, FAINT);
      doc.text(clean(label).toUpperCase(), x, 136);
      doc.setFontSize(10.5);
      ink(doc, INK);
      doc.text(clean(value), x, 143);
    });
    stroke(doc, RULE);
    doc.line(PAGE.m, 150, PAGE.w - PAGE.m, 150);

    // contents
    doc.setFontSize(8);
    ink(doc, FAINT);
    doc.text(clean(t('customPick')).toUpperCase(), PAGE.m, 162);
    doc.setFontSize(9.5);
    const perCol = Math.ceil(blockTitles.length / 2);
    const colW = (PAGE.w - PAGE.m * 2) / 2;
    blockTitles.forEach((title, i) => {
      const col = Math.floor(i / perCol);
      const yy = 170 + (i % perCol) * 6.2;
      const x = PAGE.m + col * colW;
      ink(doc, ACCENT);
      doc.text(String(i + 1).padStart(2, '0'), x, yy);
      ink(doc, INK);
      doc.text(clean(title), x + 9, yy, { maxWidth: colW - 14 });
    });
    this.footer(1);
  }

  title(text, sub) {
    const { doc } = this;
    this.ensure(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    ink(doc, INK);
    doc.text(clean(text), PAGE.m, this.y + 4);
    if (sub) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      ink(doc, FAINT);
      doc.text(clean(sub), PAGE.w - PAGE.m, this.y + 4, { align: 'right' });
    }
    this.y += 9;
  }

  // ── Block renderers ────────────────────────────────────
  kpis(spec, sectionTitle) {
    const { doc } = this;
    this.title(sectionTitle);
    const n = spec.tiles.length;
    const gap = 4;
    const w = (PAGE.w - PAGE.m * 2 - gap * (n - 1)) / n;
    const h = 26;
    this.ensure(h + 6);
    spec.tiles.forEach((tile, i) => {
      const x = PAGE.m + i * (w + gap);
      const y = this.y;
      stroke(doc, RULE);
      doc.setLineWidth(0.25);
      doc.rect(x, y, w, h);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      ink(doc, MUTED);
      doc.text(clean(tile.label).toUpperCase(), x + 3, y + 6, { maxWidth: w - 6 });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      ink(doc, INK);
      doc.text(clean(tile.value), x + 3, y + 15.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      let tx = x + 3;
      if (tile.delta !== null && tile.delta !== undefined && Number.isFinite(tile.delta)) {
        const up = tile.delta >= 0;
        const good = up === tile.goodWhenUp;
        const col = good ? GOOD : BAD;
        fill(doc, col);
        const ty = y + 21.2;
        if (up) doc.triangle(tx, ty, tx + 2.6, ty, tx + 1.3, ty - 2.2, 'F');
        else doc.triangle(tx, ty - 2.2, tx + 2.6, ty - 2.2, tx + 1.3, ty, 'F');
        ink(doc, col);
        const txt = `${Math.abs(tile.delta).toFixed(1)}%`;
        doc.text(txt, tx + 3.6, y + 21.2);
        tx += 4.6 + doc.getTextWidth(txt);
      }
      if (tile.hint) {
        ink(doc, FAINT);
        doc.text(clean(tile.hint), tx + 1, y + 21.2, { maxWidth: x + w - tx - 3 });
      }
    });
    this.y += h + 8;
  }

  axesY(x0, y0, w, h, max, fmt) {
    const { doc } = this;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    for (let i = 0; i <= 4; i++) {
      const v = (max / 4) * i;
      const yy = y0 + h - (h * i) / 4;
      stroke(doc, i === 0 ? RULE : GRID);
      doc.setLineWidth(i === 0 ? 0.3 : 0.15);
      doc.line(x0, yy, x0 + w, yy);
      ink(doc, FAINT);
      doc.text(clean(fmt(v)), x0 - 2, yy + 1, { align: 'right' });
    }
  }

  xLabels(x0, y0, w, labels) {
    const { doc } = this;
    const every = Math.max(1, Math.ceil(labels.length / 8));
    doc.setFontSize(7);
    ink(doc, FAINT);
    labels.forEach((l, i) => {
      if (i % every !== 0) return;
      const x = x0 + (w * (i + 0.5)) / labels.length;
      doc.text(clean(l), x, y0 + 4.5, { align: 'center' });
    });
  }

  legend(items, y) {
    const { doc } = this;
    let x = PAGE.m;
    doc.setFontSize(7.5);
    items.forEach(({ name, color, line }) => {
      fill(doc, color);
      stroke(doc, color);
      if (line) {
        doc.setLineWidth(0.6);
        doc.line(x, y - 1, x + 4, y - 1);
      } else doc.rect(x, y - 2.4, 2.6, 2.6, 'F');
      ink(doc, MUTED);
      doc.text(clean(name), x + 5.5, y);
      x += 9 + doc.getTextWidth(clean(name));
    });
  }

  columns(spec) {
    const { doc } = this;
    const H = 58;
    this.ensure(H + 18);
    this.title(spec.title);
    this.legend([{ name: spec.legend[0], color: '#8cb4e6' }, { name: spec.legend[1], color: '#eb6834', line: true }], this.y + 1);
    this.y += 5;
    const x0 = PAGE.m + 16;
    const w = PAGE.w - PAGE.m - x0;
    const max = niceMax(Math.max(...spec.values, ...spec.line));
    this.axesY(x0, this.y, w, H, max, spec.fmt);
    const bw = w / spec.values.length;
    fill(doc, '#8cb4e6');
    spec.values.forEach((v, i) => {
      const bh = (v / max) * H;
      doc.rect(x0 + i * bw + bw * 0.15, this.y + H - bh, bw * 0.7, bh, 'F');
    });
    stroke(doc, '#eb6834');
    doc.setLineWidth(0.6);
    const pts = spec.line.map((v, i) => [x0 + bw * (i + 0.5), this.y + H - (v / max) * H]);
    for (let i = 1; i < pts.length; i++) doc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    this.xLabels(x0, this.y + H, w, spec.labels);
    this.y += H + 12;
  }

  lines(spec) {
    const { doc } = this;
    const H = 52;
    this.ensure(H + 18);
    this.title(spec.title);
    this.legend(spec.series.map((s) => ({ name: s.name, color: s.color, line: true })), this.y + 1);
    this.y += 5;
    const x0 = PAGE.m + 16;
    const w = PAGE.w - PAGE.m - x0;
    const max = niceMax(Math.max(1, ...spec.series.flatMap((s) => s.values)));
    this.axesY(x0, this.y, w, H, max, spec.fmt);
    const n = spec.labels.length;
    spec.series.forEach((s) => {
      stroke(doc, s.color);
      doc.setLineWidth(0.55);
      const pts = s.values.map((v, i) => [x0 + (w * (i + 0.5)) / n, this.y + H - (v / max) * H]);
      for (let i = 1; i < pts.length; i++) doc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    });
    this.xLabels(x0, this.y + H, w, spec.labels);
    this.y += H + 12;
  }

  hbars(spec) {
    const { doc } = this;
    const row = 6.2;
    const H = spec.items.length * row;
    this.ensure(H + 14);
    this.title(spec.title);
    const labelW = 30;
    const x0 = PAGE.m + labelW;
    const w = PAGE.w - PAGE.m - x0 - 26;
    const max = Math.max(1, ...spec.items.map((x) => x.value));
    doc.setFontSize(8);
    spec.items.forEach((it, i) => {
      const yy = this.y + i * row;
      ink(doc, MUTED);
      doc.text(clean(it.label), PAGE.m, yy + 3.9);
      fill(doc, '#2a78d6');
      const bw = Math.max(0.6, (it.value / max) * w);
      doc.roundedRect(x0, yy + 0.9, bw, row - 2.2, 0.8, 0.8, 'F');
      ink(doc, INK);
      doc.text(clean(spec.fmt(it.value)), x0 + bw + 2, yy + 3.9);
    });
    this.y += H + 7;
  }

  vbars(spec) {
    const { doc } = this;
    const H = 44;
    this.ensure(H + 18);
    this.title(spec.title);
    this.y += 3;
    const x0 = PAGE.m + 16;
    const w = PAGE.w - PAGE.m - x0;
    const max = niceMax(Math.max(1, ...spec.items.map((x) => x.value)));
    this.axesY(x0, this.y, w, H, max, spec.fmt);
    const bw = w / spec.items.length;
    doc.setFontSize(7.5);
    spec.items.forEach((it, i) => {
      const bh = (it.value / max) * H;
      fill(doc, spec.ramp[i % spec.ramp.length]);
      doc.rect(x0 + i * bw + bw * 0.22, this.y + H - bh, bw * 0.56, bh, 'F');
      ink(doc, INK);
      doc.text(clean(spec.fmt(it.value)), x0 + i * bw + bw / 2, this.y + H - bh - 1.5, { align: 'center' });
    });
    this.xLabels(x0, this.y + H, w, spec.items.map((x) => x.label));
    this.y += H + 12;
  }

  grouped(spec) {
    const { doc } = this;
    const H = 46;
    this.ensure(H + 18);
    this.title(spec.title);
    this.legend(spec.series.map((s) => ({ name: s.name, color: s.color })), this.y + 1);
    this.y += 5;
    const x0 = PAGE.m + 16;
    const w = PAGE.w - PAGE.m - x0;
    const max = niceMax(Math.max(1, ...spec.series.flatMap((s) => s.values)));
    this.axesY(x0, this.y, w, H, max, spec.fmt);
    const gw = w / spec.labels.length;
    const bw = (gw * 0.6) / spec.series.length;
    spec.series.forEach((s, si) => {
      fill(doc, s.color);
      s.values.forEach((v, i) => {
        const bh = (v / max) * H;
        doc.rect(x0 + i * gw + gw * 0.2 + si * (bw + 0.6), this.y + H - bh, bw, bh, 'F');
      });
    });
    this.xLabels(x0, this.y + H, w, spec.labels);
    this.y += H + 12;
  }

  segments(spec) {
    const { doc } = this;
    const H = 8 + spec.items.length * 6 + 4;
    this.ensure(H + 12);
    this.title(spec.title);
    const total = spec.items.reduce((a, x) => a + x.value, 0) || 1;
    const w = PAGE.w - PAGE.m * 2;
    let x = PAGE.m;
    spec.items.forEach((it) => {
      const sw = (it.value / total) * w;
      fill(doc, it.color.startsWith('#') ? it.color : '#2a78d6');
      doc.rect(x, this.y, Math.max(0, sw - 0.6), 6, 'F');
      x += sw;
    });
    this.y += 11;
    doc.setFontSize(8.5);
    spec.items.forEach((it) => {
      fill(doc, it.color.startsWith('#') ? it.color : '#2a78d6');
      doc.rect(PAGE.m, this.y - 2.6, 2.8, 2.8, 'F');
      ink(doc, INK);
      doc.text(clean(it.label), PAGE.m + 5, this.y);
      doc.text(clean(spec.fmtPct ? spec.fmtPct((it.value / total) * 100) : `${((it.value / total) * 100).toFixed(1)}%`), PAGE.m + 70, this.y, { align: 'right' });
      ink(doc, MUTED);
      doc.text(clean(spec.fmt(it.value)), PAGE.m + 100, this.y, { align: 'right' });
      this.y += 6;
    });
    this.y += 5;
  }

  heatmap(spec) {
    const { doc } = this;
    const cellH = 7.5;
    const H = (spec.rows.length + 1) * cellH;
    this.ensure(H + 14);
    this.title(spec.title);
    const labelW = 26;
    const w = (PAGE.w - PAGE.m * 2 - labelW) / spec.cols.length;
    const max = Math.max(1, ...spec.matrix.flat());
    doc.setFontSize(7.5);
    spec.cols.forEach((c, j) => {
      ink(doc, FAINT);
      doc.text(clean(c), PAGE.m + labelW + w * (j + 0.5), this.y + 4.5, { align: 'center' });
    });
    spec.rows.forEach((r, i) => {
      const yy = this.y + cellH * (i + 1);
      ink(doc, MUTED);
      doc.text(clean(r), PAGE.m, yy + 4.8);
      spec.matrix[i].forEach((v, j) => {
        const idx = Math.min(spec.ramp.length - 1, Math.floor((v / max) * (spec.ramp.length - 1) + 0.0001));
        fill(doc, spec.ramp[idx]);
        doc.rect(PAGE.m + labelW + w * j + 0.3, yy + 0.3, w - 0.6, cellH - 0.6, 'F');
        ink(doc, idx >= Math.ceil(spec.ramp.length / 2) ? '#ffffff' : INK);
        doc.text(String(v), PAGE.m + labelW + w * (j + 0.5), yy + 4.8, { align: 'center' });
      });
    });
    this.y += H + 8;
  }

  table(spec) {
    this.ensure(24);
    this.title(spec.title);
    const columnStyles = {};
    (spec.align || []).forEach((a, i) => { if (a === 'r') columnStyles[i] = { halign: 'right' }; });
    const self = this;
    autoTable(this.doc, {
      startY: this.y,
      head: [spec.head.map(clean)],
      body: spec.rows.map((r) => r.map(clean)),
      margin: { left: PAGE.m, right: PAGE.m, top: CONTENT_TOP, bottom: PAGE.h - CONTENT_BOTTOM },
      theme: 'plain',
      styles: { font: 'helvetica', fontSize: 8, cellPadding: { top: 1.6, bottom: 1.6, left: 2, right: 2 }, textColor: rgb(INK) },
      headStyles: { fillColor: rgb(INK), textColor: rgb('#f4f1ea'), fontStyle: 'bold', fontSize: 7.5 },
      alternateRowStyles: { fillColor: rgb('#f1ede5') },
      columnStyles,
      didDrawPage: (data) => {
        if (data.pageNumber > 1 || self.doc.getNumberOfPages() > 1) self.header();
      },
    });
    this.y = this.doc.lastAutoTable.finalY + 9;
  }

  render(blocks) {
    const titles = blocks.map((b) => b.title);
    this.cover(titles);
    this.newPage();
    for (const b of blocks) {
      this.section = b.sectionName;
      const s = b.pdf;
      if (s.type === 'kpis') this.kpis(s, b.title);
      else this[s.type](s);
    }
    const total = this.doc.getNumberOfPages();
    for (let p = 2; p <= total; p++) {
      this.doc.setPage(p);
      this.footer(p);
    }
    return this.doc;
  }
}

export function exportReport({ blocks, t, meta, filename }) {
  const doc = new Report({ t, meta }).render(blocks);
  doc.save(filename);
  return doc;
}

export function buildReport({ blocks, t, meta }) {
  return new Report({ t, meta }).render(blocks);
}
