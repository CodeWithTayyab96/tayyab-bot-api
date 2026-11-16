const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function fetchWeserv(imageUrl, params) {
  const u = new URL('https://images.weserv.nl/');
  u.searchParams.set('url', imageUrl);
  for (const [k, v] of Object.entries(params)) {
    u.searchParams.set(k, v);
  }
  const res = await fetch(u.toString(), { headers: { 'User-Agent': BROWSER_UA } });
  if (!res.ok) throw new Error('Image processing failed: ' + res.status);
  const data = new Uint8Array(await res.arrayBuffer());
  const contentType = res.headers.get('Content-Type') || 'image/png';
  const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg'
    : contentType.includes('webp') ? 'webp'
    : contentType.includes('gif') ? 'gif'
    : 'png';
  return { data, contentType, ext };
}

export async function imgBlur(imageUrl, amount) {
  return fetchWeserv(imageUrl, { blur: String(amount || 5) });
}

export async function imgPixelate(imageUrl, amount) {
  return fetchWeserv(imageUrl, { pixel: String(amount || 8) });
}

export async function imgGrayscale(imageUrl) {
  return fetchWeserv(imageUrl, { filt: 'greyscale' });
}

export async function imgUpscale(imageUrl, w, h) {
  const params = { w: String(w || 1024), fit: 'cover' };
  if (h) params.h = String(h);
  return fetchWeserv(imageUrl, params);
}

export function imgCircle(imageUrl) {
  const safe = escapeXml(imageUrl);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <clipPath id="circle-clip">
      <circle cx="250" cy="250" r="250"/>
    </clipPath>
  </defs>
  <image href="${safe}" x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid slice" clip-path="url(#circle-clip)"/>
</svg>`;
  const data = new TextEncoder().encode(svg);
  return { data, contentType: 'image/svg+xml', ext: 'svg' };
}

export function imgMeme(imageUrl, top, bottom) {
  const safeUrl = escapeXml(imageUrl);
  const safeTop = escapeXml((top || '').toUpperCase());
  const safeBottom = escapeXml((bottom || '').toUpperCase());
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="600" viewBox="0 0 600 600">
  <image href="${safeUrl}" x="0" y="0" width="600" height="600" preserveAspectRatio="xMidYMid slice"/>
  ${safeTop ? `<text x="300" y="56" text-anchor="middle" fill="#fff" font-size="48" font-family="Impact,Arial Black,sans-serif" font-weight="bold" stroke="#000" stroke-width="3" paint-order="stroke">${safeTop}</text>` : ''}
  ${safeBottom ? `<text x="300" y="574" text-anchor="middle" fill="#fff" font-size="48" font-family="Impact,Arial Black,sans-serif" font-weight="bold" stroke="#000" stroke-width="3" paint-order="stroke">${safeBottom}</text>` : ''}
</svg>`;
  const data = new TextEncoder().encode(svg);
  return { data, contentType: 'image/svg+xml', ext: 'svg' };
}
