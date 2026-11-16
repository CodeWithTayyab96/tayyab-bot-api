const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export async function fetchLyrics(artist, title) {
  const res = await fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
    { headers: { 'User-Agent': BROWSER_UA } }
  );
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.lyrics) return null;
  return {
    artist,
    title,
    lyrics: data.lyrics.trim(),
  };
}
