const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function cleanTikTokUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('tiktok.com')) return url;
  } catch { /* ignore */ }
  throw new Error('Invalid TikTok URL');
}

export async function tiktokDownload(url) {
  cleanTikTokUrl(url);

  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
  const res = await fetch(apiUrl, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) throw new Error(`TikTok API failed: ${res.status}`);
  const json = await res.json();

  if (json.code !== 0 && json.code !== undefined) {
    throw new Error(json.msg || 'TikTok download failed');
  }

  const data = json.data;
  if (!data) throw new Error('No data from TikTok API');

  const raw = data.play || data.hdplay || null;
  const download = raw
    ? (raw.startsWith('http') ? raw : `https://www.tikwm.com${raw}`)
    : null;

  if (!download) throw new Error('No download URL from TikTok API');

  return {
    title: data.title || 'TikTok Video',
    thumbnail: data.cover || data.origin_cover || '',
    type: 'video',
    download,
    site: 'tiktok',
  };
}
