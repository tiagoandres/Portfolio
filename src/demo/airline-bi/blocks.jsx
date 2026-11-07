import React from 'react';
import {
  CircleDollarSign, Ticket, Receipt, Gauge, Route as RouteIcon, PlaneTakeoff, ArrowLeftRight,
  Users, UsersRound, UserCheck, Coins, Flame, Percent, BadgeCheck,
} from 'lucide-react';
import { ROUTES } from './data.js';
import { delta } from './metrics.js';
import {
  Panel, KpiTile, DailyRevenue, MultiLine, HBars, OrdinalColumns, GroupedColumns,
  SegmentedBar, Heatmap, DataTable,
} from './charts.jsx';

// Sequential / ordinal ramp (one hue, light → dark). Ordinal starts at a step
// that still clears 2:1 against the surface.
export const SEQ_RAMP = ['#ebe8fc', '#d3cdf7', '#b1a8ef', '#8f82e4', '#6250d6', '#4a3aa7', '#33287a'];
export const ORDINAL_RAMP = ['#86b6ef', '#5598e7', '#3987e5', '#6250d6', '#1c5cab', '#104281'];
const STATUS = { issued: '#0ca30c', pending: '#fab219', cancelled: '#d03b3b' };
const STATUS_ICON = { issued: '✓', pending: '…', cancelled: '✕' };

export function makeFormatters(lang) {
  const locale = lang === 'EN' ? 'en-US' : 'es-VE';
  const int = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const one = new Intl.NumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const usd = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const compact = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 });
  const dayFmt = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', timeZone: 'UTC' });
  const longDay = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return {
    int: (v) => int.format(v ?? 0),
    one: (v) => one.format(v ?? 0),
    money: (v) => usd.format(v ?? 0),
    compact: (v) => compact.format(v ?? 0),
    moneyCompact: (v) => `$${compact.format(v ?? 0)}`,
    pct: (v) => `${one.format(v ?? 0)}%`,
    day: (iso) => dayFmt.format(new Date(`${iso}T00:00:00Z`)),
    longDay: (iso) => longDay.format(new Date(`${iso}T00:00:00Z`)),
  };
}

/**
 * Block registry: every block knows how to render on screen (node) and how to
 * be drawn in the PDF (pdf spec). The custom view and the PDF engine both read
 * from here, so the report always matches the dashboard.
 */
export function buildBlocks(m, t, f, channel) {
  const k = m.kpis;
  const pk = m.prevKpis;
  const vs = t('vsPrev');
  const series = { web: 'var(--series-1)', app: 'var(--series-2)', agency: 'var(--series-3)' };
  const seriesHex = { web: '#6250d6', app: '#eb6834', agency: '#1baf7a' };

  const kpiBlock = (id, tab, title, tiles) => ({
    id, tab, title, kind: 'kpis', span: 'full',
    node: <div className="kpi-row">{tiles.map((x) => <KpiTile key={x.label} fmtDelta={f.pct} {...x} />)}</div>,
    pdf: { type: 'kpis', tiles: tiles.map((x) => ({ label: x.label, value: x.value, delta: x.delta, hint: x.hint, goodWhenUp: x.goodWhenUp ?? true })) },
  });

  const statusItems = m.statusCounts.map((s) => ({ key: s.key, label: t(s.key), value: s.value, color: STATUS[s.key], icon: STATUS_ICON[s.key] }));
  const genderItems = [
    { key: 'F', label: t('female'), value: m.gender[0].value, color: 'var(--series-1)', hex: '#6250d6' },
    { key: 'M', label: t('male'), value: m.gender[1].value, color: 'var(--series-2)', hex: '#eb6834' },
  ];
  const connItems = [
    { key: 'd', label: t('direct'), value: k.directPax, color: 'var(--series-1)', hex: '#6250d6' },
    { key: 'c', label: t('connecting'), value: k.connectingPax, color: 'var(--series-2)', hex: '#eb6834' },
  ];
  const payTotal = m.payRevenue.reduce((a, x) => a + x.value, 0) || 1;
  const routeData = m.routeStats.map((r) => ({ label: r.label, value: r.revenue }));
  const channelData = m.channelRevenue.map((c) => ({ label: t(c.key), value: c.value }));
  const tierData = m.tiers.map((x) => ({ key: t(x.key), value: x.value }));
  const advanceRows = m.advance.map((x) => ({ key: x.key, value: x.value }));
  const ageData = m.age.map((x) => ({ key: x.key, F: x.F, M: x.M }));
  const partyData = m.party.map((x) => ({ key: x.key, value: x.value }));
  const redemptionRatio = k.awarded ? (k.redeemed / k.awarded) * 100 : 0;

  return [
    // ── Overview ──
    kpiBlock('kpi-overview', 'overview', t('tabOverview'), [
      { icon: <CircleDollarSign size={16} />, label: t('kRevenue'), value: f.money(k.revenue), delta: delta(k.revenue, pk.revenue), hint: vs },
      { icon: <Ticket size={16} />, label: t('kTickets'), value: f.int(k.tickets), delta: delta(k.tickets, pk.tickets), hint: vs },
      { icon: <Receipt size={16} />, label: t('kAvgTicket'), value: f.money(k.avgTicket), delta: delta(k.avgTicket, pk.avgTicket), hint: vs },
      { icon: <Gauge size={16} />, label: t('kConversion'), value: f.pct(k.conversion), delta: delta(k.conversion, pk.conversion), hint: t('kConversionHint') },
    ]),
    {
      id: 'revenue-daily', tab: 'overview', title: t('cRevenueDaily'), span: 'full',
      node: (
        <Panel t={t} title={t('cRevenueDaily')} sub={t('cRevenueDailySub')}
          table={{ head: [t('day'), t('revenue'), t('ma7')], align: ['', 'r', 'r'], rows: m.byDay.map((d) => [f.day(d.day), f.money(d.revenue), f.money(d.revenueMA)]) }}>
          <DailyRevenue data={m.byDay} fmtDay={f.day} fmtMoney={f.money} fmtCompact={f.moneyCompact} t={t} />
        </Panel>
      ),
      pdf: { type: 'columns', title: t('cRevenueDaily'), labels: m.byDay.map((d) => f.day(d.day)), values: m.byDay.map((d) => d.revenue), line: m.byDay.map((d) => d.revenueMA), fmt: f.moneyCompact, legend: [t('revenue'), t('ma7')] },
    },
    {
      id: 'status', tab: 'overview', title: t('cStatus'), span: 'narrow',
      node: (
        <Panel t={t} title={t('cStatus')}>
          <SegmentedBar items={statusItems} fmtValue={f.int} fmtPct={f.pct} />
        </Panel>
      ),
      pdf: { type: 'segments', title: t('cStatus'), items: statusItems.map((x) => ({ label: x.label, value: x.value, color: x.color })), fmt: f.int, fmtPct: f.pct },
    },
    {
      id: 'payments', tab: 'overview', title: t('cPayments'), span: 'wide',
      node: (
        <Panel t={t} title={t('cPayments')}>
          <div className="pay-list">
            {m.payRevenue.map((p) => (
              <div key={p.key} className="pay-row">
                <span className="pay-name">{t(p.key)}</span>
                <span className="pay-bar"><span style={{ width: `${(p.value / payTotal) * 100}%` }} /></span>
                <span className="pay-pct">{f.pct((p.value / payTotal) * 100)}</span>
                <span className="pay-val">{f.money(p.value)}</span>
              </div>
            ))}
          </div>
        </Panel>
      ),
      pdf: { type: 'table', title: t('cPayments'), head: [t('method'), t('ops'), t('share'), t('revenue')], align: ['', 'r', 'r', 'r'], rows: m.payRevenue.map((p) => [t(p.key), f.int(p.count), f.pct((p.value / payTotal) * 100), f.money(p.value)]) },
    },
    {
      id: 'channel-revenue', tab: 'overview', title: t('cChannelRevenue'), span: 'narrow',
      node: (
        <Panel t={t} title={t('cChannelRevenue')}>
          <HBars data={channelData} fmtValue={f.money} labelWidth={80} />
        </Panel>
      ),
      pdf: { type: 'hbars', title: t('cChannelRevenue'), items: channelData, fmt: f.money },
    },
    {
      id: 'bookings-channel', tab: 'overview', title: t('cBookingsChannel'), span: 'wide',
      node: (
        <Panel t={t} title={t('cBookingsChannel')}
          table={{ head: [t('day'), t('web'), t('app'), t('agency')], align: ['', 'r', 'r', 'r'], rows: m.byDay.map((d) => [f.day(d.day), d.web, d.app, d.agency]) }}>
          <MultiLine data={m.byDay} fmtDay={f.day} fmtValue={f.int} fmtCompact={f.compact}
            series={(channel === 'all' ? ['web', 'app', 'agency'] : [channel]).map((c) => ({ key: c, name: t(c), color: series[c] }))} />
        </Panel>
      ),
      pdf: {
        type: 'lines', title: t('cBookingsChannel'), labels: m.byDay.map((d) => f.day(d.day)), fmt: f.compact,
        series: (channel === 'all' ? ['web', 'app', 'agency'] : [channel]).map((c) => ({ name: t(c), color: seriesHex[c], values: m.byDay.map((d) => d[c]) })),
      },
    },

    // ── Routes ──
    kpiBlock('kpi-routes', 'routes', t('tabRoutes'), [
      { icon: <RouteIcon size={16} />, label: t('kRoutes'), value: f.int(k.routesActive), hint: `${ROUTES.length} ${t('route').toLowerCase()}s` },
      { icon: <PlaneTakeoff size={16} />, label: t('kDirect'), value: f.int(k.directPax), hint: f.pct((k.directPax / Math.max(1, k.tickets)) * 100) },
      { icon: <ArrowLeftRight size={16} />, label: t('kConnecting'), value: f.int(k.connectingPax), hint: f.pct((k.connectingPax / Math.max(1, k.tickets)) * 100) },
    ]),
    {
      id: 'top-routes', tab: 'routes', title: t('cTopRoutes'), span: 'full',
      node: (
        <Panel t={t} title={t('cTopRoutes')} sub={t('cTopRoutesSub')}>
          <HBars data={routeData} fmtValue={f.money} labelWidth={96} />
        </Panel>
      ),
      pdf: { type: 'hbars', title: t('cTopRoutes'), items: routeData, fmt: f.money },
    },
    {
      id: 'advance', tab: 'routes', title: t('cAdvance'), span: 'wide',
      node: (
        <Panel t={t} title={t('cAdvance')} sub={t('cAdvanceSub')}
          table={{ head: [t('days'), t('pax')], align: ['', 'r'], rows: advanceRows.map((x) => [x.key, f.int(x.value)]) }}>
          <OrdinalColumns data={advanceRows} fmtValue={f.int} fmtCompact={f.compact} ramp={ORDINAL_RAMP} unitName={t('kPax')} />
        </Panel>
      ),
      pdf: { type: 'vbars', title: t('cAdvance'), items: advanceRows.map((x) => ({ label: x.key, value: x.value })), ramp: ORDINAL_RAMP, fmt: f.compact },
    },
    {
      id: 'connectivity', tab: 'routes', title: t('cConnectivity'), span: 'narrow',
      node: (
        <Panel t={t} title={t('cConnectivity')}>
          <SegmentedBar items={connItems} fmtValue={f.int} fmtPct={f.pct} />
        </Panel>
      ),
      pdf: { type: 'segments', title: t('cConnectivity'), items: connItems.map((x) => ({ label: x.label, value: x.value, color: x.hex })), fmt: f.int, fmtPct: f.pct },
    },
    {
      id: 'heatmap', tab: 'routes', title: t('cHeat'), span: 'full',
      node: (
        <Panel t={t} title={t('cHeat')} sub={t('cHeatSub')}>
          <Heatmap rows={m.advance.map((x) => `${x.key} ${t('days')}`)} cols={t('weekdays')} matrix={m.heat} ramp={SEQ_RAMP} fmtValue={f.int} unit="" />
        </Panel>
      ),
      pdf: { type: 'heatmap', title: t('cHeat'), rows: m.advance.map((x) => `${x.key} ${t('days')}`), cols: t('weekdays'), matrix: m.heat, ramp: SEQ_RAMP },
    },
    {
      id: 'route-profile', tab: 'routes', title: t('cAgeRoute'), span: 'full',
      node: (
        <Panel t={t} title={t('cAgeRoute')}>
          <DataTable head={[t('route'), t('kPax'), t('revenue'), t('medianAge'), t('medianAdvance')]} align={['', 'r', 'r', 'r', 'r']}
            rows={m.routeStats.map((r) => [r.label, f.int(r.pax), f.money(r.revenue), f.one(r.medianAge), `${f.int(r.medianAdvance)} ${t('days')}`])} />
        </Panel>
      ),
      pdf: { type: 'table', title: t('cAgeRoute'), head: [t('route'), t('kPax'), t('revenue'), t('medianAge'), t('medianAdvance')], align: ['', 'r', 'r', 'r', 'r'], rows: m.routeStats.map((r) => [r.label, f.int(r.pax), f.money(r.revenue), f.one(r.medianAge), `${f.int(r.medianAdvance)} ${t('days')}`]) },
    },

    // ── Passengers ──
    kpiBlock('kpi-pax', 'pax', t('tabPax'), [
      { icon: <Users size={16} />, label: t('kPax'), value: f.int(k.paxTotal), delta: delta(k.tickets, pk.tickets), hint: vs },
      { icon: <UsersRound size={16} />, label: t('kParty'), value: f.one(k.avgParty), hint: t('kParty_hint') },
      { icon: <Receipt size={16} />, label: t('kAvgTicket'), value: f.money(k.avgTicket), delta: delta(k.avgTicket, pk.avgTicket), hint: vs },
      { icon: <UserCheck size={16} />, label: t('kCustomers'), value: f.int(k.uniqueCustomers) },
    ]),
    {
      id: 'age', tab: 'pax', title: t('cAge'), span: 'wide',
      node: (
        <Panel t={t} title={t('cAge')}
          table={{ head: ['', t('female'), t('male')], align: ['', 'r', 'r'], rows: ageData.map((x) => [x.key, f.int(x.F), f.int(x.M)]) }}>
          <GroupedColumns data={ageData} fmtValue={f.int} fmtCompact={f.compact}
            series={[{ key: 'F', name: t('female'), color: 'var(--series-1)' }, { key: 'M', name: t('male'), color: 'var(--series-2)' }]} />
        </Panel>
      ),
      pdf: { type: 'grouped', title: t('cAge'), labels: ageData.map((x) => x.key), series: [{ name: t('female'), color: '#6250d6', values: ageData.map((x) => x.F) }, { name: t('male'), color: '#eb6834', values: ageData.map((x) => x.M) }], fmt: f.compact },
    },
    {
      id: 'gender', tab: 'pax', title: t('cGender'), span: 'narrow',
      node: (
        <Panel t={t} title={t('cGender')}>
          <SegmentedBar items={genderItems} fmtValue={f.int} fmtPct={f.pct} />
        </Panel>
      ),
      pdf: { type: 'segments', title: t('cGender'), items: genderItems.map((x) => ({ label: x.label, value: x.value, color: x.hex })), fmt: f.int, fmtPct: f.pct },
    },
    {
      id: 'flyers', tab: 'pax', title: t('cFlyers'), span: 'wide',
      node: (
        <Panel t={t} title={t('cFlyers')} sub={t('cFlyersSub')}>
          <DataTable head={[t('name'), t('tier'), t('trips'), t('revenue'), t('favRoute')]} align={['', '', 'r', 'r', '']}
            rows={m.topFlyers.map((x) => [x.name, x.tier ? t(x.tier) : t('noTier'), x.trips, f.money(x.revenue), x.favRoute])} />
        </Panel>
      ),
      pdf: { type: 'table', title: t('cFlyers'), head: [t('name'), t('tier'), t('trips'), t('revenue'), t('favRoute')], align: ['', '', 'r', 'r', ''], rows: m.topFlyers.map((x) => [x.name, x.tier ? t(x.tier) : t('noTier'), String(x.trips), f.money(x.revenue), x.favRoute]) },
    },
    {
      id: 'party', tab: 'pax', title: t('cParty'), span: 'narrow',
      node: (
        <Panel t={t} title={t('cParty')} sub={t('cPartySub')}>
          <OrdinalColumns data={partyData} fmtValue={f.int} fmtCompact={f.compact} ramp={ORDINAL_RAMP} unitName={t('ops')} />
        </Panel>
      ),
      pdf: { type: 'vbars', title: t('cParty'), items: partyData.map((x) => ({ label: x.key, value: x.value })), ramp: ORDINAL_RAMP, fmt: f.compact },
    },

    // ── Loyalty ──
    kpiBlock('kpi-loyalty', 'loyalty', t('tabLoyalty'), [
      { icon: <Coins size={16} />, label: t('kAwarded'), value: f.int(k.awarded), delta: delta(k.awarded, pk.awarded), hint: vs },
      { icon: <Flame size={16} />, label: t('kRedeemed'), value: f.int(k.redeemed), delta: delta(k.redeemed, pk.redeemed), hint: vs },
      { icon: <Percent size={16} />, label: t('kRedemptionRatio'), value: f.pct(redemptionRatio) },
      { icon: <BadgeCheck size={16} />, label: t('kEnrolled'), value: f.int(k.enrolled), hint: t('kEnrolledHint') },
    ]),
    {
      id: 'miles', tab: 'loyalty', title: t('cMiles'), span: 'full',
      node: (
        <Panel t={t} title={t('cMiles')} note={channel !== 'all' ? t('loyaltyChannelNote') : null}
          table={{ head: [t('day'), t('awarded'), t('redeemed')], align: ['', 'r', 'r'], rows: m.byDay.map((d) => [f.day(d.day), f.int(d.awarded), f.int(d.redeemed)]) }}>
          <MultiLine data={m.byDay} fmtDay={f.day} fmtValue={f.int} fmtCompact={f.compact}
            series={[{ key: 'awarded', name: t('awarded'), color: 'var(--series-1)' }, { key: 'redeemed', name: t('redeemed'), color: 'var(--series-2)' }]} />
        </Panel>
      ),
      pdf: { type: 'lines', title: t('cMiles'), labels: m.byDay.map((d) => f.day(d.day)), fmt: f.compact, series: [{ name: t('awarded'), color: '#6250d6', values: m.byDay.map((d) => d.awarded) }, { name: t('redeemed'), color: '#eb6834', values: m.byDay.map((d) => d.redeemed) }] },
    },
    {
      id: 'tiers', tab: 'loyalty', title: t('cTiers'), span: 'half',
      node: (
        <Panel t={t} title={t('cTiers')}>
          <OrdinalColumns data={tierData} fmtValue={f.int} fmtCompact={f.compact} ramp={ORDINAL_RAMP.slice(0, 4).map((_, i) => ORDINAL_RAMP[i + 1])} unitName={t('affiliates')} />
        </Panel>
      ),
      pdf: { type: 'vbars', title: t('cTiers'), items: tierData.map((x) => ({ label: x.key, value: x.value })), ramp: ORDINAL_RAMP.slice(1, 5), fmt: f.compact },
    },
    {
      id: 'registrations', tab: 'loyalty', title: t('cRegistrations'), span: 'half',
      node: (
        <Panel t={t} title={t('cRegistrations')}>
          <MultiLine data={m.regByDay} fmtDay={f.day} fmtValue={f.int} fmtCompact={f.compact}
            series={[{ key: 'value', name: t('affiliates'), color: 'var(--series-1)' }]} />
        </Panel>
      ),
      pdf: { type: 'lines', title: t('cRegistrations'), labels: m.regByDay.map((d) => f.day(d.day)), fmt: f.compact, series: [{ name: t('affiliates'), color: '#6250d6', values: m.regByDay.map((d) => d.value) }] },
    },
  ];
}
