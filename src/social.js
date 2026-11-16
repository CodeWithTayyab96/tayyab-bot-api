const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export function detectSite(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes('instagram.com')) return 'instagram';
    if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) return 'facebook';
    if (host.includes('twitter.com') || host.includes('x.com')) return 'x';
  } catch { /* ignore */ }
  return null;
}

async function instagramDownload(url) {
  const apiUrl = `https://api.saveig.app/api/convert`;
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': BROWSER_UA,
    },
    body: `url=${encodeURIComponent(url)}`,
  });

  if (!res.ok) throw new Error(`Instagram API failed: ${res.status}`);
  const html = await res.text();

  const m = html.match(/href="(https?:\/\/[^"]+\.mp4[^"]*)"/i)
    || html.match(/href="(https?:\/\/[^"]+\.jpg[^"]*)"/i);
  if (!m) throw new Error('Could not extract Instagram media URL');

  return {
    title: 'Instagram Media',
    thumbnail: '',
    type: m[0].includes('.mp4') ? 'video' : 'image',
    download: m[1],
    site: 'instagram',
  };
}

async function facebookDownload(url) {
  const apiUrl = `https://www.getfvid.com/downloader`;
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': BROWSER_UA,
    },
    body: `url=${encodeURIComponent(url)}`,
  });

  if (!res.ok) throw new Error(`Facebook API failed: ${res.status}`);
  const html = await res.text();

  const m = html.match(/href="(https?:\/\/[^"]*fbcdn[^"]*\.mp4[^"]*)"/i)
    || html.match(/href="(https?:\/\/[^"]*video[^"]*)"/i);
  if (!m) throw new Error('Could not extract Facebook video URL');

  return {
    title: 'Facebook Video',
    thumbnail: '',
    type: 'video',
    download: m[1],
    site: 'facebook',
  };
}

async function xDownload(url) {
  const apiUrl = `https://twitsave.com/info?url=${encodeURIComponent(url)}`;
  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': BROWSER_UA },
  });

  if (!res.ok) throw new Error(`X/Twitter API failed: ${res.status}`);
  const html = await res.text();

  const m = html.match(/href="(https?:\/\/[^"]*video\.twimg\.com[^"]*)"/i)
    || html.match(/class="[^"]*download[^"]*"[^>]*href="(https?:\/\/[^"]+)"/i);
  if (!m) throw new Error('Could not extract X/Twitter video URL');

  return {
    title: 'X Post Video',
    thumbnail: '',
    type: 'video',
    download: m[1],
    site: 'x',
  };
}

export async function socialDownload(url, site) {
  switch (site) {
    case 'instagram': return instagramDownload(url);
    case 'facebook': return facebookDownload(url);
    case 'x': return xDownload(url);
    default: throw new Error(`Unsupported site: ${site}`);
  }
}
