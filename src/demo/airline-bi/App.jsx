import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Plane, Database, X, Info, CalendarDays, LayoutGrid, Route as RouteIcon, UserCircle2,
  Coins, Sparkles, Building2, Download, CheckCircle2,
} from 'lucide-react';
import { generateDataset, isoDay } from './data.js';
import { compute } from './metrics.js';
import { buildBlocks, makeFormatters } from './blocks.jsx';
import { STRINGS } from './i18n.js';

const DAY = 86400000;
const TABS = ['overview', 'routes', 'pax', 'loyalty', 'custom'];
const TAB_KEY = { overview: 'tabOverview', routes: 'tabRoutes', pax: 'tabPax', loyalty: 'tabLoyalty', custom: 'tabCustom' };
const PRESETS = ['p7', 'p30', 'p90', 'pytd', 'p365'];

const readStore = (k, fallback) => {
  try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; }
};
const writeStore = (k, v) => {
  try { localStorage.setItem(k, v); } catch { /* storage unavailable */ }
};

function presetRange(p, end) {
  const endMs = Date.parse(`${end}T00:00:00Z`);
  if (p === 'pytd') return { from: `${end.slice(0, 4)}-01-01`, to: end };
  const n = { p7: 7, p30: 30, p90: 90, p365: 365 }[p];
  return { from: isoDay(endMs - (n - 1) * DAY), to: end };
}

// Simulated sync panel: mirrors the shape of the real pipeline state table.
function SyncDialog({ t, f, ds, onClose }) {
  const counts = {
    airports: 14,
    routes: 15,
    users: ds.customers.length,
    reservations: ds.bookings.length,
    orders: ds.bookings.filter((b) => b.status !== 'pending').length,
  };
  const [now] = useState(() => Date.now());
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={t('syncTitle')} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <h2 className="dialog-title">{t('syncTitle')}</h2>
          <button className="icon-btn plain" onClick={onClose} autoFocus aria-label={t('close')}><X size={16} /></button>
        </div>
        <p className="dialog-note">{t('syncNote')}</p>
        <table className="data-table">
          <thead>
            <tr><th>{t('syncCollection')}</th><th className="num">{t('syncDocs')}</th><th>{t('syncLast')}</th><th>{t('syncStatus')}</th></tr>
          </thead>
          <tbody>
            {Object.entries(counts).map(([name, n], i) => (
              <tr key={name}>
                <td className="mono">{name}</td>
                <td className="num">{f.int(n)}</td>
                <td className="muted">{new Date(now - (i * 7 + 12) * 1000).toLocaleTimeString()}</td>
                <td><span className="status-pill"><CheckCircle2 size={12} /> {t('idle')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomView({ blocks, t, meta, lang }) {
  const selectable = blocks;
  const [picked, setPicked] = useState(() => ['kpi-overview', 'revenue-daily', 'top-routes', 'heatmap', 'flyers']);
  const [busy, setBusy] = useState(false);
  const chosen = selectable.filter((b) => picked.includes(b.id));
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const exportPdf = async () => {
    setBusy(true);
    try {
      const { exportReport } = await import('./pdf.js');
      exportReport({
        blocks: chosen.map((b) => ({ ...b, sectionName: t(TAB_KEY[b.tab]) })),
        t,
        meta,
        filename: `airline-bi-demo-${meta.from}_${meta.to}-${lang.toLowerCase()}.pdf`,
      });
    } finally {
      setBusy(false);
    }
  };

  const groups = TABS.filter((x) => x !== 'custom');
  return (
    <div className="custom">
      <aside className="custom-side">
        <p className="custom-intro">{t('customIntro')}</p>
        <button className="btn-solid" onClick={exportPdf} disabled={!chosen.length || busy}>
          <Download size={16} /> {busy ? t('exporting') : t('exportPdf')}
        </button>
        <p className="custom-meta">{chosen.length} / {selectable.length}</p>
        <div className="custom-actions">
          <button className="btn-text" onClick={() => setPicked(selectable.map((b) => b.id))}>{t('selectAll')}</button>
          <button className="btn-text" onClick={() => setPicked([])}>{t('selectNone')}</button>
        </div>
        {groups.map((g) => (
          <fieldset key={g} className="custom-group">
            <legend>{t(TAB_KEY[g])}</legend>
            {selectable.filter((b) => b.tab === g).map((b) => (
              <label key={b.id} className="check">
                <input type="checkbox" checked={picked.includes(b.id)} onChange={() => toggle(b.id)} />
                <span>{b.kind === 'kpis' ? `${b.title} · KPI` : b.title}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </aside>
      <div className="custom-canvas">
        {!chosen.length && <p className="empty">{t('customEmpty')}</p>}
        <div className="grid">
          {chosen.map((b) => <div key={b.id} className="cell span-full">{b.node}</div>)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => (readStore('portfolio_lang', 'ES') === 'EN' ? 'EN' : 'ES'));
  const t = useCallback((key) => STRINGS[lang][key] ?? STRINGS.ES[key] ?? key, [lang]);
  const f = useMemo(() => makeFormatters(lang), [lang]);

  const ds = useMemo(() => generateDataset(), []);
  const [preset, setPreset] = useState('p30');
  const [range, setRange] = useState(() => presetRange('p30', ds.end));
  const [channel, setChannel] = useState('all');
  const [tab, setTab] = useState(() => {
    const h = window.location.hash.replace('#', '');
    return TABS.includes(h) ? h : 'overview';
  });
  const [syncOpen, setSyncOpen] = useState(false);

  useEffect(() => {
    writeStore('portfolio_lang', lang);
    document.documentElement.lang = lang === 'EN' ? 'en' : 'es';
  }, [lang]);
  useEffect(() => {
    history.replaceState(null, '', `#${tab}`);
  }, [tab]);
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '');
      if (TABS.includes(h)) setTab(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const m = useMemo(() => compute(ds, { ...range, channel }), [ds, range, channel]);
  const blocks = useMemo(() => buildBlocks(m, t, f, channel), [m, t, f, channel]);

  const applyPreset = (p) => {
    setPreset(p);
    setRange(presetRange(p, ds.end));
  };
  const setFrom = (v) => {
    if (!v) return;
    setPreset('custom');
    setRange((r) => ({ from: v < ds.start ? ds.start : v, to: v > r.to ? v : r.to }));
  };
  const setTo = (v) => {
    if (!v) return;
    setPreset('custom');
    setRange((r) => ({ from: v < r.from ? v : r.from, to: v > ds.end ? ds.end : v }));
  };

  const periodText = `${f.longDay(range.from)} – ${f.longDay(range.to)}`;
  const meta = {
    period: periodText,
    channel: channel === 'all' ? t('all') : t(channel),
    generated: new Date().toLocaleString(lang === 'EN' ? 'en-US' : 'es-VE'),
    from: range.from,
    to: range.to,
  };

  const framed = window.self !== window.top;
  const TAB_ICON = { overview: LayoutGrid, routes: RouteIcon, pax: UserCircle2, loyalty: Coins, custom: Sparkles };

  return (
    <div className="app">
      <header className="appbar">
        <div className="appbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true"><Plane size={18} /></span>
            <div className="brand-text">
              <p className="brand-name">DEMO AIR <span>Insights</span></p>
              <p className="brand-sub">{t('liveBi')}</p>
            </div>
          </div>
          <div className="appbar-actions">
            <span className="live-pill"><span className="live-dot" aria-hidden="true" />{t('live')}</span>
            <button className="icon-btn" onClick={() => setSyncOpen(true)} title={t('sync')} aria-label={t('sync')}>
              <Database size={16} />
            </button>
            <button className="icon-btn lang" onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')} aria-label="Language">
              {lang === 'ES' ? 'EN' : 'ES'}
            </button>
            {!framed && (
              <a className="icon-btn back" href="/#projects" title={t('back')} aria-label={t('back')}>
                <X size={16} />
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="page">
        <div className="notice">
          <Info size={16} className="notice-icon" aria-hidden="true" />
          <p>{t('banner')}</p>
          {!framed && <a className="notice-link" href="/casos/airline-bi/">{t('caseStudy')} →</a>}
        </div>

        <section className="filterbar" aria-label="Filters">
          <div className="filter-group">
            <span className="filter-label"><Database size={15} />{t('channel')}</span>
            <div className="pills" role="group">
              {['all', 'web', 'app', 'agency'].map((c) => (
                <button key={c} className={channel === c ? 'on' : ''} aria-pressed={channel === c} onClick={() => setChannel(c)}>{t(c)}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label"><CalendarDays size={15} />{t('period')}</span>
            <div className="pills" role="group">
              {PRESETS.map((p) => (
                <button key={p} className={preset === p ? 'on' : ''} aria-pressed={preset === p} onClick={() => applyPreset(p)}>{t(p)}</button>
              ))}
            </div>
            <div className="dates">
              <label className="date">
                <span className="sr-only">{t('from')}</span>
                <input type="date" value={range.from} min={ds.start} max={ds.end} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <span className="muted">→</span>
              <label className="date">
                <span className="sr-only">{t('to')}</span>
                <input type="date" value={range.to} min={ds.start} max={ds.end} onChange={(e) => setTo(e.target.value)} />
              </label>
            </div>
          </div>
        </section>

        <nav className="tabs" role="tablist">
          {TABS.map((x) => {
            const Icon = TAB_ICON[x];
            return (
              <button key={x} role="tab" aria-selected={tab === x} className={tab === x ? 'on' : ''} onClick={() => setTab(x)}>
                <Icon size={16} />
                <span>{t(TAB_KEY[x])}</span>
              </button>
            );
          })}
        </nav>

        {tab === 'custom' ? (
          <CustomView blocks={blocks} t={t} meta={meta} lang={lang} />
        ) : (
          <div className="grid" role="tabpanel">
            {blocks.filter((b) => b.tab === tab).map((b) => (
              <div key={b.id} className={`cell span-${b.span}`}>{b.node}</div>
            ))}
          </div>
        )}

        <p className="page-foot"><Building2 size={13} /> {t('footNote')}</p>
      </main>

      {syncOpen && <SyncDialog t={t} f={f} ds={ds} onClose={() => setSyncOpen(false)} />}
    </div>
  );
}
