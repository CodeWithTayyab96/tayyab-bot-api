const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function validateTikTokUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('tiktok.com')) return;
  } catch { /* ignore */ }
  throw new Error('Invalid TikTok URL');
}

async function resolveUrl(url) {
  const u = new URL(url);
  if (u.hostname === 'vt.tiktok.com' || u.hostname === 'vm.tiktok.com' || !url.includes('/video/')) {
    const res = await fetch(url, {
      headers: { 'User-Agent': BROWSER_UA },
      redirect: 'follow',
    });
    return res.url;
  }
  return url;
}

async function directExtract(url) {
  const resolved = await resolveUrl(url);

  const res = await fetch(resolved, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!res.ok) throw new Error(`TikTok page fetch failed: ${res.status}`);
  const html = await res.text();

  const scriptMatch = html.match(/<script[^>]*id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([^<]+)<\/script>/);
  if (!scriptMatch) throw new Error('Could not find rehydration data on TikTok page');

  const json = JSON.parse(scriptMatch[1]);

  const defaultScope = json['__DEFAULT_SCOPE__'];
  if (!defaultScope) throw new Error('No default scope in rehydration data');

  const videoModule = defaultScope['webapp.video-detail'] || defaultScope['webapp.video.detail'];
  if (!videoModule) throw new Error('No video detail module in rehydration data');

  const videoData = videoModule.itemInfo?.itemStruct || videoModule.itemStruct;
  if (!videoData) throw new Error('No video data in rehydration data');

  const video = videoData.video;
  if (!video) throw new Error('No video object in data');

  const downloadUrl = video.downloadAddr || video.playAddr;
  if (!downloadUrl) throw new Error('No video URL in TikTok data');

  return {
    title: videoData.desc || 'TikTok Video',
    thumbnail: video.cover || video.originCover || '',
    type: 'video',
    download: downloadUrl,
    site: 'tiktok',
  };
}

async function tikwmDownload(url) {
  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
  const res = await fetch(apiUrl, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) throw new Error(`TikWM API failed: ${res.status}`);
  const json = await res.json();

  if (json.code !== 0 && json.code !== undefined) {
    throw new Error(json.msg || 'TikWM download failed');
  }

  const data = json.data;
  if (!data) throw new Error('No data from TikWM API');

  const raw = data.play || data.hdplay || null;
  const download = raw
    ? (raw.startsWith('http') ? raw : `https://www.tikwm.com${raw}`)
    : null;

  if (!download) throw new Error('No download URL from TikWM API');

  return {
    title: data.title || 'TikTok Video',
    thumbnail: data.cover || data.origin_cover || '',
    type: 'video',
    download,
    site: 'tiktok',
  };
}

export async function tiktokDownload(url) {
  validateTikTokUrl(url);

  try {
    return await directExtract(url);
  } catch (e) {
    try {
      return await tikwmDownload(url);
    } catch (e2) {
      throw new Error(`TikTok download failed. Direct: ${e.message}; TikWM: ${e2.message}`);
    }
  }
}
