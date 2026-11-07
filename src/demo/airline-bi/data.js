// Synthetic data generator for the Airline BI demo.
// Everything here is invented: a fictional airline, deterministic random data
// (fixed seed), no real customers, bookings or prices.

const SEED = 20260907;

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86400000;

export const AIRPORTS = {
  CCS: 'Caracas',
  MAR: 'Maracaibo',
  PMV: 'Porlamar',
  BLA: 'Barcelona',
  VLN: 'Valencia',
  BRM: 'Barquisimeto',
  PZO: 'Puerto Ordaz',
  MRD: 'Mérida',
  BOG: 'Bogotá',
  PTY: 'Panamá',
  CUR: 'Curazao',
  MIA: 'Miami',
  MDE: 'Medellín',
  SDQ: 'Santo Domingo',
};

// demand weight, base fare per passenger (USD), distance (km), share of connecting pax
const ROUTE_DEFS = [
  ['CCS', 'PMV', 1.0, 95, 300, 0.04],
  ['CCS', 'MAR', 0.9, 110, 520, 0.05],
  ['VLN', 'PMV', 0.55, 105, 420, 0.08],
  ['CCS', 'PZO', 0.5, 100, 490, 0.06],
  ['MAR', 'PMV', 0.45, 130, 780, 0.22],
  ['CCS', 'BLA', 0.4, 85, 250, 0.05],
  ['CCS', 'BRM', 0.32, 90, 270, 0.04],
  ['CCS', 'MRD', 0.25, 115, 520, 0.07],
  ['CCS', 'BOG', 0.42, 280, 1030, 0.18],
  ['CCS', 'PTY', 0.38, 310, 1380, 0.24],
  ['VLN', 'BOG', 0.2, 290, 1000, 0.3],
  ['CCS', 'CUR', 0.22, 240, 280, 0.12],
  ['BLA', 'MIA', 0.3, 420, 2230, 0.46],
  ['CCS', 'MDE', 0.18, 300, 1090, 0.2],
  ['CCS', 'SDQ', 0.15, 330, 980, 0.26],
];

export const ROUTES = ROUTE_DEFS.map(([o, d, weight, fare, km, conn], i) => ({
  id: `R${i + 1}`,
  label: `${o} → ${d}`,
  origin: o,
  destination: d,
  weight,
  fare,
  km,
  conn,
  international: !['CCS', 'MAR', 'PMV', 'BLA', 'VLN', 'BRM', 'PZO', 'MRD'].includes(d),
}));

export const CHANNELS = ['web', 'app', 'agency'];
export const STATUSES = ['issued', 'pending', 'cancelled'];
export const PAYMENTS = ['card', 'mobile', 'transfer', 'wallet', 'cash'];
export const TIERS = ['bronze', 'silver', 'gold', 'platinum'];

const FIRST = ['Andrea', 'Luis', 'Valentina', 'José', 'Mariana', 'Carlos', 'Gabriela', 'Daniel', 'Camila', 'Miguel', 'Sofía', 'Alejandro', 'Isabella', 'Ricardo', 'Lucía', 'Fernando', 'Paula', 'Andrés', 'Daniela', 'Jorge', 'Elena', 'Rafael', 'Victoria', 'Diego', 'Natalia', 'Manuel', 'Carolina', 'Héctor', 'Patricia', 'Samuel'];
const LAST = ['Rivas', 'Méndez', 'Salazar', 'Ortega', 'Villalobos', 'Briceño', 'Pacheco', 'Quintero', 'Arellano', 'Montilla', 'Escalona', 'Figueroa', 'Guevara', 'Lugo', 'Nava', 'Palacios', 'Rondón', 'Sequera', 'Tovar', 'Urdaneta', 'Zambrano', 'Bastidas', 'Colmenares', 'Durán', 'Hurtado'];

function pickWeighted(r, items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let x = r() * total;
  for (let i = 0; i < items.length; i++) {
    x -= weights[i];
    if (x <= 0) return items[i];
  }
  return items[items.length - 1];
}

function gauss(r) {
  // Box–Muller
  const u = Math.max(r(), 1e-9);
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function seasonality(d) {
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  // Jul–Aug school holidays and December peak; soft February carnival bump
  const monthly = [0.9, 1.05, 0.95, 1.0, 0.92, 0.95, 1.18, 1.25, 0.9, 0.92, 1.0, 1.3][m];
  const christmas = m === 11 && day >= 15 ? 1.15 : 1;
  return monthly * christmas;
}

const WEEKDAY = [0.85, 1.12, 0.95, 0.92, 1.0, 1.18, 0.9]; // Sun..Sat booking intensity

export function isoDay(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Builds the full synthetic dataset for the 365 days ending today (UTC).
 * Deterministic: same seed → same shape (dates shift with the current day).
 */
export function generateDataset(now = Date.now()) {
  const r = mulberry32(SEED);
  const end = Math.floor(now / DAY) * DAY;
  const start = end - 729 * DAY; // two years so "previous period" comparisons work

  // Customer pool, with heavy-tailed repeat behaviour (a few frequent flyers)
  const N_CUSTOMERS = 9000;
  const customers = [];
  for (let i = 0; i < N_CUSTOMERS; i++) {
    const ageRaw = 38 + gauss(r) * 13;
    customers.push({
      id: i,
      name: `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]} ${LAST[Math.floor(r() * LAST.length)][0]}.`,
      age: Math.min(82, Math.max(18, Math.round(ageRaw))),
      gender: r() < 0.52 ? 'F' : 'M',
      registeredAt: start + Math.floor(Math.pow(r(), 0.7) * 730) * DAY,
      loyalty: r() < 0.62,
      tier: pickWeighted(r, TIERS, [62, 25, 10, 3]),
      propensity: Math.pow(r(), 7), // most low, a few very high (frequent flyers)
    });
  }
  // cumulative propensity for weighted customer draws
  const cum = [];
  let acc = 0;
  for (const c of customers) {
    acc += 0.004 + c.propensity;
    cum.push(acc);
  }
  const drawCustomer = () => {
    const x = r() * acc;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return customers[lo];
  };

  const routeWeights = ROUTES.map((rt) => rt.weight);
  const bookings = [];
  const redemptions = []; // {day, miles}
  let id = 0;

  for (let t = start; t <= end; t += DAY) {
    const d = new Date(t);
    const progress = (t - start) / (end - start);
    const trend = 0.78 + 0.42 * progress; // steady growth over two years
    const appShare = 0.18 + 0.2 * progress; // app adoption grows
    const expected = 62 * trend * seasonality(d) * WEEKDAY[d.getUTCDay()];
    const n = Math.max(0, Math.round(expected + gauss(r) * Math.sqrt(expected)));

    for (let k = 0; k < n; k++) {
      const route = pickWeighted(r, ROUTES, routeWeights);
      const channel = pickWeighted(r, CHANNELS, [0.82 - appShare, appShare, 0.18]);
      const party = pickWeighted(r, [1, 2, 3, 4, 5], [55, 25, 10, 7, 3]);
      const advMean = route.international ? 26 : 13;
      const advance = Math.min(150, Math.max(0, Math.round(Math.exp(Math.log(advMean) + gauss(r) * 0.85) - 1)));
      // last-minute fares are pricier; early fares cheaper
      const fareFactor = advance < 3 ? 1.35 : advance < 8 ? 1.15 : advance < 22 ? 1.0 : advance < 45 ? 0.9 : 0.82;
      const perPax = route.fare * fareFactor * (1 + gauss(r) * 0.08);
      const statusW = channel === 'agency' ? [86, 6, 8] : channel === 'app' ? [76, 10, 14] : [72, 12, 16];
      const status = pickWeighted(r, STATUSES, statusW);
      const payment = channel === 'agency'
        ? pickWeighted(r, PAYMENTS, [30, 10, 25, 5, 30])
        : pickWeighted(r, PAYMENTS, [38, 27, 18, 17, 0]);
      const lead = drawCustomer();
      const connecting = r() < route.conn;
      const pax = [lead];
      for (let p = 1; p < party; p++) pax.push(customers[Math.floor(r() * N_CUSTOMERS)]);

      bookings.push({
        id: id++,
        t,
        day: isoDay(t),
        weekday: d.getUTCDay(),
        route: route.id,
        channel,
        status,
        payment,
        party,
        advance,
        connecting,
        amount: Math.round(perPax * party * 100) / 100,
        lead: lead.id,
        paxAges: pax.map((c) => c.age),
        paxGenders: pax.map((c) => c.gender),
        // loyalty miles credited only for issued tickets of enrolled lead pax
        miles: status === 'issued' && lead.loyalty ? Math.round(route.km * party * (1 + TIERS.indexOf(lead.tier) * 0.25)) : 0,
      });
    }

    // Miles redemptions: proportional to the enrolled base, with weekly rhythm
    const redeemEvents = Math.round(2.3 * trend * seasonality(d) + gauss(r) * 1.4);
    let miles = 0;
    for (let k = 0; k < Math.max(0, redeemEvents); k++) miles += 4000 + Math.round(r() * 14000);
    redemptions.push({ day: isoDay(t), miles });
  }

  return {
    generatedAt: now,
    start: isoDay(start),
    end: isoDay(end),
    customers,
    bookings,
    redemptions,
  };
}
