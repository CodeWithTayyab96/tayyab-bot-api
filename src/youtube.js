const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0];
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch { /* ignore */ }
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function isYouTubeUrl(url) {
  return extractVideoId(url) !== null;
}

async function innertubeDownload(videoId, type, env) {
  const visitorData = env.VISITOR_DATA;
  if (!visitorData) throw new Error('VISITOR_DATA not configured');

  const payload = {
    videoId,
    context: {
      client: {
        clientName: 'WEB',
        clientVersion: '2.20241120.00.00',
        hl: 'en',
        gl: 'US',
        visitorData,
      },
    },
    playbackContext: {
      contentPlaybackContext: {
        signatureTimestamp: 20073,
      },
    },
  };

  if (env.PO_TOKEN) {
    payload.serviceIntegrityDimensions = { poToken: env.PO_TOKEN };
  }

  const res = await fetch(
    'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': BROWSER_UA,
        'X-YouTube-Client-Name': '1',
        'X-YouTube-Client-Version': '2.20241120.00.00',
        'Origin': 'https://www.youtube.com',
        'Referer': 'https://www.youtube.com/',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error(`Innertube failed: ${res.status}`);
  const data = await res.json();

  if (data.playabilityStatus?.status !== 'OK') {
    throw new Error(data.playabilityStatus?.reason || 'Video not available');
  }

  const title = data.videoDetails?.title || 'Unknown';
  const thumbnail = data.videoDetails?.thumbnail?.thumbnails?.slice(-1)[0]?.url || '';
  const durationSec = parseInt(data.videoDetails?.lengthSeconds || '0', 10);
  if (durationSec > 600) throw new Error('Video exceeds 10-minute limit');
  const durationStr = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, '0')}`;

  const formats = [
    ...(data.streamingData?.formats || []),
    ...(data.streamingData?.adaptiveFormats || []),
  ];

  let chosen;
  if (type === 'mp3') {
    chosen = formats
      .filter(f => f.mimeType?.startsWith('audio/') && f.url)
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
  } else {
    chosen = formats
      .filter(f => f.mimeType?.startsWith('video/') && f.url && (f.height || 0) <= 720)
      .sort((a, b) => (b.height || 0) - (a.height || 0) || (b.bitrate || 0) - (a.bitrate || 0))[0];
  }

  if (!chosen?.url) throw new Error('No suitable format found via innertube');

  return {
    title,
    thumbnail,
    duration: durationStr,
    format: type === 'mp3' ? 'mp3' : 'mp4',
    download: chosen.url,
    site: 'youtube',
  };
}

async function saveTubeDownload(videoId, type) {
  const infoUrl = `https://cdn400.savetube.vip/info?url=https://www.youtube.com/watch?v=${videoId}`;
  const infoRes = await fetch(infoUrl, {
    headers: { 'User-Agent': BROWSER_UA, 'Accept': 'application/json' },
  });
  if (!infoRes.ok) throw new Error(`SaveTube info failed: ${infoRes.status}`);
  const info = await infoRes.json();

  const title = info.data?.title || 'Unknown';
  const thumbnail = info.data?.thumbnail || '';
  const rawDuration = info.data?.duration || 0;
  const duration = typeof rawDuration === 'string' ? parseInt(rawDuration, 10) || 0 : rawDuration;
  const durationStr = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;

  if (duration > 600) throw new Error('Video exceeds 10-minute limit');

  const format = type === 'mp3' ? 'mp3' : 'mp4';
  const quality = type === 'mp3' ? '128' : '720';

  const dlBody = JSON.stringify({
    url: `https://www.youtube.com/watch?v=${videoId}`,
    format,
    quality,
  });

  const dlRes = await fetch('https://cdn400.savetube.vip/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': BROWSER_UA,
      'Accept': 'application/json',
    },
    body: dlBody,
  });

  if (!dlRes.ok) throw new Error(`SaveTube download failed: ${dlRes.status}`);
  const dlData = await dlRes.json();
  const downloadUrl = dlData.data?.download_url || dlData.data?.url || dlData.url;
  if (!downloadUrl) throw new Error('SaveTube returned no download URL');

  return {
    title,
    thumbnail,
    duration: durationStr,
    format: type === 'mp3' ? 'mp3' : 'mp4',
    download: downloadUrl,
    site: 'youtube',
  };
}

export async function youtubeDownload(url, type, env) {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error('Invalid YouTube URL');

  try {
    return await innertubeDownload(videoId, type, env);
  } catch (e) {
    try {
      return await saveTubeDownload(videoId, type);
    } catch (e2) {
      throw new Error(`YouTube download failed. Innertube: ${e.message}; SaveTube: ${e2.message}`);
    }
  }
}
