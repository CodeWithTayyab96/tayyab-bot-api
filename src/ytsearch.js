const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export async function youtubeSearch(query) {
  const res = await fetch(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    { headers: { 'User-Agent': BROWSER_UA } }
  );
  if (!res.ok) throw new Error('YouTube search failed');
  const html = await res.text();

  const results = [];
  const seen = new Set();

  const pattern = /"videoRenderer":\{"videoId":"([a-zA-Z0-9_-]{11})"[\s\S]{0,3000}?"title":\{"runs":\[\{"text":"([^"]*)"/g;
  let m;
  while ((m = pattern.exec(html)) !== null && results.length < 10) {
    const [, videoId, rawTitle] = m;
    if (seen.has(videoId)) continue;
    seen.add(videoId);
    const title = rawTitle.replace(/\\u([\da-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    results.push({
      videoId,
      title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }

  if (results.length === 0) {
    const fallback = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    let fm;
    while ((fm = fallback.exec(html)) !== null && results.length < 10) {
      const videoId = fm[1];
      if (seen.has(videoId)) continue;
      seen.add(videoId);
      results.push({
        videoId,
        title: 'Unknown',
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  }

  return results;
}
