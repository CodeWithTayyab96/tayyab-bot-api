const store = new Map();
const TTL = 300_000;

export function putFile(id, ext, data, contentType) {
  const key = `${id}.${ext}`;
  store.set(key, { data, contentType, expires: Date.now() + TTL });
  return key;
}

export function getFile(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry;
}

export function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expires) store.delete(key);
  }
}
