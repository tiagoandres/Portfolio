// Aggregations over the synthetic dataset. Mirrors the analytical layer of the
// production dashboards (there it lives in SQL functions over Postgres).
import { ROUTES, CHANNELS, STATUSES, PAYMENTS, TIERS, isoDay } from './data.js';

const DAY = 86400000;
const toMs = (iso) => Date.parse(`${iso}T00:00:00Z`);

export function previousRange(from, to) {
  const len = (toMs(to) - toMs(from)) / DAY + 1;
  const pTo = toMs(from) - DAY;
  return { from: isoDay(pTo - (len - 1) * DAY), to: isoDay(pTo) };
}

function inRange(b, from, to, channel) {
  return b.day >= from && b.day <= to && (channel === 'all' || b.channel === channel);
}

function kpisOf(list) {
  let revenue = 0, issuedPax = 0, issued = 0, created = list.length, miles = 0;
  for (const b of list) {
    if (b.status === 'issued') {
      revenue += b.amount;
      issuedPax += b.party;
      issued += 1;
      miles += b.miles;
    }
  }
  return {
    revenue,
    tickets: issuedPax,
    avgTicket: issuedPax ? revenue / issuedPax : 0,
    conversion: created ? (issued / created) * 100 : 0,
    bookings: created,
    issued,
    miles,
  };
}

export const ADVANCE_BUCKETS = [
  ['0–2', 0, 2], ['3–7', 3, 7], ['8–14', 8, 14], ['15–30', 15, 30], ['31–60', 31, 60], ['61+', 61, Infinity],
];
export const AGE_BUCKETS = [
  ['18–24', 18, 24], ['25–34', 25, 34], ['35–44', 35, 44], ['45–54', 45, 54], ['55–64', 55, 64], ['65+', 65, 200],
];
const bucketOf = (buckets, v) => buckets.findIndex(([, lo, hi]) => v >= lo && v <= hi);

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function compute(ds, { from, to, channel }) {
  const cur = ds.bookings.filter((b) => inRange(b, from, to, channel));
  const prevR = previousRange(from, to);
  const prev = ds.bookings.filter((b) => inRange(b, prevR.from, prevR.to, channel));
  const issued = cur.filter((b) => b.status === 'issued');

  // ── Daily series ───────────────────────────────────────
  const days = [];
  for (let t = toMs(from); t <= toMs(to); t += DAY) days.push(isoDay(t));
  const dayIdx = new Map(days.map((d, i) => [d, i]));
  const byDay = days.map((day) => ({ day, revenue: 0, web: 0, app: 0, agency: 0, awarded: 0, redeemed: 0 }));
  for (const b of cur) {
    const row = byDay[dayIdx.get(b.day)];
    row[b.channel] += 1;
    if (b.status === 'issued') {
      row.revenue += b.amount;
      row.awarded += b.miles;
    }
  }
  for (const rd of ds.redemptions) {
    const i = dayIdx.get(rd.day);
    if (i !== undefined) byDay[i].redeemed = channel === 'all' ? rd.miles : 0;
  }
  // 7-day moving average of revenue (same unit, same axis)
  byDay.forEach((row, i) => {
    const w = byDay.slice(Math.max(0, i - 6), i + 1);
    row.revenueMA = w.reduce((a, x) => a + x.revenue, 0) / w.length;
  });

  // ── Distributions ──────────────────────────────────────
  const statusCounts = STATUSES.map((s) => ({ key: s, value: cur.filter((b) => b.status === s).length }));
  const payRevenue = PAYMENTS.map((p) => ({
    key: p,
    value: issued.filter((b) => b.payment === p).reduce((a, b) => a + b.amount, 0),
    count: issued.filter((b) => b.payment === p).length,
  })).filter((x) => x.count > 0).sort((a, b) => b.value - a.value);
  const channelRevenue = CHANNELS.map((c) => ({
    key: c,
    value: issued.filter((b) => b.channel === c).reduce((a, b) => a + b.amount, 0),
  }));

  // ── Routes ─────────────────────────────────────────────
  const routeStats = ROUTES.map((rt) => {
    const rows = issued.filter((b) => b.route === rt.id);
    const ages = rows.flatMap((b) => b.paxAges);
    return {
      id: rt.id,
      label: rt.label,
      international: rt.international,
      revenue: rows.reduce((a, b) => a + b.amount, 0),
      pax: rows.reduce((a, b) => a + b.party, 0),
      medianAge: median(ages),
      medianAdvance: median(rows.map((b) => b.advance)),
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const advance = ADVANCE_BUCKETS.map(([label]) => ({ key: label, value: 0 }));
  const heat = ADVANCE_BUCKETS.map(() => Array(7).fill(0));
  let directPax = 0, connectingPax = 0;
  for (const b of issued) {
    const i = bucketOf(ADVANCE_BUCKETS, b.advance);
    advance[i].value += b.party;
    heat[i][b.weekday] += 1;
    if (b.connecting) connectingPax += b.party;
    else directPax += b.party;
  }

  // ── Passengers ─────────────────────────────────────────
  const age = AGE_BUCKETS.map(([label]) => ({ key: label, F: 0, M: 0 }));
  const party = [1, 2, 3, 4, 5].map((n) => ({ key: String(n), value: 0 }));
  let female = 0, male = 0;
  const flyerMap = new Map();
  for (const b of issued) {
    b.paxAges.forEach((a, i) => {
      const g = b.paxGenders[i];
      age[bucketOf(AGE_BUCKETS, a)][g] += 1;
      if (g === 'F') female += 1;
      else male += 1;
    });
    party[b.party - 1].value += 1;
    const f = flyerMap.get(b.lead) ?? { trips: 0, revenue: 0, routes: new Map() };
    f.trips += 1;
    f.revenue += b.amount;
    f.routes.set(b.route, (f.routes.get(b.route) ?? 0) + 1);
    flyerMap.set(b.lead, f);
  }
  const routeLabel = new Map(ROUTES.map((rt) => [rt.id, rt.label]));
  const topFlyers = [...flyerMap.entries()]
    .sort((a, b) => b[1].trips - a[1].trips || b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .map(([cid, f]) => {
      const c = ds.customers[cid];
      const fav = [...f.routes.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return { name: c.name, tier: c.loyalty ? c.tier : null, trips: f.trips, revenue: f.revenue, favRoute: routeLabel.get(fav) };
    });

  // ── Loyalty ────────────────────────────────────────────
  const enrolled = ds.customers.filter((c) => c.loyalty);
  const tiers = TIERS.map((tier) => ({ key: tier, value: enrolled.filter((c) => c.tier === tier).length }));
  const regByDay = days.map((day) => ({ day, value: 0 }));
  for (const c of enrolled) {
    const i = dayIdx.get(isoDay(c.registeredAt));
    if (i !== undefined) regByDay[i].value += 1;
  }
  const awarded = byDay.reduce((a, x) => a + x.awarded, 0);
  const redeemed = byDay.reduce((a, x) => a + x.redeemed, 0);
  const prevRedeemed = channel === 'all'
    ? ds.redemptions.filter((x) => x.day >= prevR.from && x.day <= prevR.to).reduce((a, x) => a + x.miles, 0)
    : 0;

  const k = kpisOf(cur);
  const pk = kpisOf(prev);
  const paxTotal = female + male;

  return {
    range: { from, to },
    prevRange: prevR,
    kpis: {
      ...k,
      routesActive: routeStats.filter((r) => r.pax > 0).length,
      directPax,
      connectingPax,
      paxTotal,
      avgParty: issued.length ? issued.reduce((a, b) => a + b.party, 0) / issued.length : 0,
      uniqueCustomers: flyerMap.size,
      awarded,
      redeemed,
      enrolled: enrolled.length,
    },
    prevKpis: { ...pk, redeemed: prevRedeemed, awarded: pk.miles },
    byDay,
    statusCounts,
    payRevenue,
    channelRevenue,
    routeStats,
    advance,
    heat,
    age,
    gender: [{ key: 'F', value: female }, { key: 'M', value: male }],
    party,
    topFlyers,
    tiers,
    regByDay,
  };
}

export function delta(cur, prev) {
  if (!prev) return null;
  return ((cur - prev) / prev) * 100;
}
