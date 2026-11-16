const DEMO_KEY = 'tayyab';
const DEMO_LIMITS = { minute: 30, hour: 300, day: 3000 };

const usageStore = new Map();

function getKeyData(apikey) {
  if (apikey !== DEMO_KEY) return null;
  if (!usageStore.has(apikey)) {
    usageStore.set(apikey, {
      name: 'Demo Key',
      active: true,
      counters: { minute: 0, hour: 0, day: 0, total: 0 },
      windows: { minute: Date.now(), hour: Date.now(), day: Date.now() },
    });
  }
  return usageStore.get(apikey);
}

export function authenticate(request) {
  const url = new URL(request.url);
  const apikey = url.searchParams.get('apikey') || request.headers.get('X-API-Key');
  if (!apikey) return { ok: false, status: 401, error: 'Missing API key' };
  const data = getKeyData(apikey);
  if (!data) return { ok: false, status: 401, error: 'Invalid API key' };
  if (!data.active) return { ok: false, status: 403, error: 'API key is disabled' };

  const now = Date.now();
  if (now - data.windows.minute > 60_000) { data.counters.minute = 0; data.windows.minute = now; }
  if (now - data.windows.hour > 3_600_000) { data.counters.hour = 0; data.windows.hour = now; }
  if (now - data.windows.day > 86_400_000) { data.counters.day = 0; data.windows.day = now; }

  if (data.counters.minute >= DEMO_LIMITS.minute)
    return { ok: false, status: 429, error: 'Rate limit exceeded (per-minute)' };
  if (data.counters.hour >= DEMO_LIMITS.hour)
    return { ok: false, status: 429, error: 'Rate limit exceeded (per-hour)' };
  if (data.counters.day >= DEMO_LIMITS.day)
    return { ok: false, status: 429, error: 'Rate limit exceeded (per-day)' };

  data.counters.minute++;
  data.counters.hour++;
  data.counters.day++;
  data.counters.total++;

  return { ok: true, apikey };
}

export function getUsage(apikey) {
  const data = getKeyData(apikey);
  if (!data) return null;

  const now = Date.now();
  const minute = (now - data.windows.minute > 60_000) ? 0 : data.counters.minute;
  const hour = (now - data.windows.hour > 3_600_000) ? 0 : data.counters.hour;
  const day = (now - data.windows.day > 86_400_000) ? 0 : data.counters.day;

  return {
    name: data.name,
    active: data.active,
    usage: { minute, hour, day, total: data.counters.total },
    limits: DEMO_LIMITS,
  };
}
