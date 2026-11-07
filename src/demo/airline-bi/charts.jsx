import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Table2, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, BarChart, LineChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, LabelList,
} from 'recharts';

// ── Shared chart chrome (hairline grid, recessive axes) ───────────────
const axis = { stroke: 'var(--viz-axis)', tick: { fill: 'var(--viz-muted)', fontSize: 11 }, tickLine: false };
const grid = { stroke: 'var(--viz-grid)', strokeDasharray: '0' };

function TooltipBox({ active, payload, label, fmtLabel, fmtValue }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="viz-tooltip">
      {label !== undefined && <div className="viz-tooltip-label">{fmtLabel ? fmtLabel(label) : label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey} className="viz-tooltip-row">
          <span className="viz-swatch" style={{ background: p.color || p.fill || p.stroke }} />
          <span>{p.name}</span>
          <strong>{fmtValue ? fmtValue(p.value, p.dataKey) : p.value}</strong>
        </div>
      ))}
    </div>
  );
}

const cursorFill = { fill: 'var(--viz-hover)' };

// Legend in series order (never re-sorted), line or square swatches.
function LegendRow({ items, line }) {
  return (
    <ul className="viz-legend">
      {items.map((it) => (
        <li key={it.name}>
          <span className={line ? 'viz-swatch-line' : 'viz-swatch'} style={{ background: it.color }} />
          {it.name}
        </li>
      ))}
    </ul>
  );
}

// ── Panel with chart/table toggle (table view = accessibility relief) ──
export function Panel({ title, sub, children, table, className = '', note, t }) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section className={`panel ${className}`}>
      <header className="panel-head">
        <div>
          <h3 className="panel-title">{title}</h3>
          {sub && <p className="panel-sub">{sub}</p>}
        </div>
        {table && (
          <button className="panel-toggle" onClick={() => setShowTable((s) => !s)} aria-pressed={showTable}>
            {showTable ? <BarChart3 size={14} /> : <Table2 size={14} />}
            <span>{showTable ? t('chart') : t('table')}</span>
          </button>
        )}
      </header>
      <div className="panel-body">{showTable && table ? <DataTable {...table} /> : children}</div>
      {note && <p className="panel-note">{note}</p>}
    </section>
  );
}

export function DataTable({ head, rows, align = [] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>{head.map((h, i) => <th key={h} className={align[i] === 'r' ? 'num' : ''}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>{r.map((c, ci) => <td key={ci} className={align[ci] === 'r' ? 'num' : ''}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── KPI tile ──────────────────────────────────────────────────────────
export function KpiTile({ label, value, delta, hint, icon, fmtDelta, goodWhenUp = true }) {
  const has = delta !== null && delta !== undefined && Number.isFinite(delta);
  const up = has && delta >= 0;
  const good = has && (up === goodWhenUp);
  return (
    <div className="kpi">
      <div className="kpi-main">
        <p className="kpi-label">{label}</p>
        <p className="kpi-value">{value}</p>
        <p className="kpi-foot">
          {has && (
            <span className={`kpi-delta ${good ? 'is-good' : 'is-bad'}`}>
              {up ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
              {fmtDelta(Math.abs(delta))}
            </span>
          )}
          {hint && <span className="kpi-hint">{hint}</span>}
        </p>
      </div>
      {icon && <span className="kpi-icon" aria-hidden="true">{icon}</span>}
    </div>
  );
}

// ── Daily bars + moving-average line (one unit, one axis) ─────────────
export function DailyRevenue({ data, fmtDay, fmtMoney, fmtCompact, t }) {
  return (
    <div className="chart h-lg">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} {...grid} />
          <XAxis dataKey="day" tickFormatter={fmtDay} minTickGap={24} {...axis} />
          <YAxis tickFormatter={fmtCompact} width={56} {...axis} axisLine={false} />
          <Tooltip cursor={cursorFill} content={<TooltipBox fmtLabel={fmtDay} fmtValue={(v) => fmtMoney(v)} />} />
          <Legend content={() => <LegendRow items={[{ name: t('revenue'), color: 'var(--series-1)' }, { name: t('ma7'), color: 'var(--series-2)' }]} />} />
          <Bar isAnimationActive={false} dataKey="revenue" name={t('revenue')} fill="var(--series-1)" fillOpacity={0.55} radius={[4, 4, 0, 0]} maxBarSize={18} />
          <Line isAnimationActive={false} dataKey="revenueMA" name={t('ma7')} stroke="var(--series-2)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--viz-surface)' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Multi-line time series ────────────────────────────────────────────
export function MultiLine({ data, series, fmtDay, fmtValue, fmtCompact, height = 'h-md' }) {
  return (
    <div className={`chart ${height}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} {...grid} />
          <XAxis dataKey="day" tickFormatter={fmtDay} minTickGap={24} {...axis} />
          <YAxis tickFormatter={fmtCompact} width={56} {...axis} axisLine={false} />
          <Tooltip cursor={{ stroke: 'var(--viz-axis)' }} content={<TooltipBox fmtLabel={fmtDay} fmtValue={fmtValue} />} />
          {series.length > 1 && <Legend content={() => <LegendRow line items={series.map((x) => ({ name: x.name, color: x.color }))} />} />}
          {series.map((s) => (
            <Line isAnimationActive={false} key={s.key} dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--viz-surface)' }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Horizontal ranked bars with direct value labels ───────────────────
export function HBars({ data, fmtValue, color = 'var(--series-1)', labelWidth = 92, height }) {
  const h = height ?? Math.max(160, data.length * 30 + 16);
  return (
    <div className="chart" style={{ height: h }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 96, left: 0, bottom: 0 }} barCategoryGap={6}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={labelWidth} {...axis} axisLine={false}
            tick={{ fill: 'var(--viz-secondary)', fontSize: 12 }} />
          <Tooltip cursor={cursorFill} content={<TooltipBox fmtValue={fmtValue} />} />
          <Bar isAnimationActive={false} dataKey="value" name={data.name} fill={color} radius={[0, 4, 4, 0]} maxBarSize={18}>
            <LabelList dataKey="value" position="right" formatter={fmtValue} className="bar-label" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Ordered columns (ordinal ramp: order is meaningful) ───────────────
export function OrdinalColumns({ data, fmtValue, fmtCompact, ramp, unitName, height = 'h-md' }) {
  return (
    <div className={`chart ${height}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 0 }} barCategoryGap="22%">
          <CartesianGrid vertical={false} {...grid} />
          <XAxis dataKey="key" {...axis} />
          <YAxis tickFormatter={fmtCompact} width={48} {...axis} axisLine={false} />
          <Tooltip cursor={cursorFill} content={<TooltipBox fmtValue={fmtValue} />} />
          <Bar isAnimationActive={false} dataKey="value" name={unitName} radius={[4, 4, 0, 0]} maxBarSize={44}
            shape={(p) => <rect x={p.x} y={p.y} width={p.width} height={Math.max(0, p.height)} rx={4} fill={ramp[p.index % ramp.length]} />}>
            <LabelList dataKey="value" position="top" formatter={fmtCompact} className="bar-label" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Grouped columns (two series, e.g. women/men per age band) ─────────
export function GroupedColumns({ data, series, fmtValue, fmtCompact, height = 'h-md' }) {
  return (
    <div className={`chart ${height}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2} barCategoryGap="22%">
          <CartesianGrid vertical={false} {...grid} />
          <XAxis dataKey="key" {...axis} />
          <YAxis tickFormatter={fmtCompact} width={48} {...axis} axisLine={false} />
          <Tooltip cursor={cursorFill} content={<TooltipBox fmtValue={fmtValue} />} />
          <Legend content={() => <LegendRow items={series.map((x) => ({ name: x.name, color: x.color }))} />} />
          {series.map((s) => (
            <Bar isAnimationActive={false} key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={22} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Segmented bar: part-to-whole, few segments, labelled ──────────────
export function SegmentedBar({ items, fmtValue, fmtPct = (v) => `${v.toFixed(1)}%` }) {
  const total = items.reduce((a, x) => a + x.value, 0) || 1;
  return (
    <div className="segbar">
      <div className="segbar-track" role="img" aria-label={items.map((x) => `${x.label} ${((x.value / total) * 100).toFixed(1)}%`).join(', ')}>
        {items.map((x) => (
          <div key={x.key} className="segbar-seg" style={{ flexGrow: x.value, background: x.color }}
            title={`${x.label}: ${fmtValue(x.value)} (${((x.value / total) * 100).toFixed(1)}%)`} />
        ))}
      </div>
      <ul className="segbar-legend">
        {items.map((x) => (
          <li key={x.key}>
            <span className="viz-swatch" style={{ background: x.color }} />
            {x.icon && <span className="seg-icon" aria-hidden="true">{x.icon}</span>}
            <span className="seg-label">{x.label}</span>
            <span className="seg-pct">{fmtPct((x.value / total) * 100)}</span>
            <span className="seg-val">{fmtValue(x.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Heatmap (sequential, one hue) ─────────────────────────────────────
export function Heatmap({ rows, cols, matrix, ramp, fmtValue, unit }) {
  const max = Math.max(1, ...matrix.flat());
  const step = (v) => ramp[Math.min(ramp.length - 1, Math.floor((v / max) * (ramp.length - 1) + 0.0001))];
  return (
    <div className="heatmap">
      <div className="heat-grid" style={{ gridTemplateColumns: `86px repeat(${cols.length}, minmax(0, 1fr))` }}>
        <span />
        {cols.map((c) => <span key={c} className="heat-col">{c}</span>)}
        {rows.map((r, i) => (
          <React.Fragment key={r}>
            <span className="heat-row">{r}</span>
            {matrix[i].map((v, j) => {
              const bg = step(v);
              const dark = ramp.indexOf(bg) >= Math.ceil(ramp.length / 2);
              return (
                <span key={j} className="heat-cell" style={{ background: bg, color: dark ? '#fff' : '#232838' }}
                  title={`${r} · ${cols[j]}: ${fmtValue(v)} ${unit}`}>
                  {fmtValue(v)}
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="heat-scale">
        <span>0</span>
        <div className="heat-scale-bar" style={{ background: `linear-gradient(90deg, ${ramp.join(',')})` }} />
        <span>{fmtValue(max)}</span>
      </div>
    </div>
  );
}
