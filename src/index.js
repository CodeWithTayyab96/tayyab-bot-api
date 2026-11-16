import { authenticate, getUsage } from './auth.js';
import { ok, fail } from './response.js';
import { getFile, putFile, cleanup } from './filestore.js';
import { youtubeDownload, isYouTubeUrl } from './youtube.js';
import { tiktokDownload } from './tiktok.js';
import { socialDownload, detectSite } from './social.js';
import { aiChat } from './ai.js';
import { textToSpeech } from './tts.js';
import { generateQrSvg } from './qr.js';
import { generateWelcomeCard } from './welcome.js';
import { landingPage, docsPage } from './pages.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const baseUrl = url.origin;

    cleanup();

    if (path === '/') return landingPage(baseUrl);
    if (path === '/docs') return docsPage(baseUrl);

    if (path.startsWith('/files/')) {
      const key = path.slice(7);
      const file = getFile(key);
      if (!file) return fail(404, 'File not found or expired');
      return new Response(file.data, { headers: { 'Content-Type': file.contentType } });
    }

    if (path === '/api/usage') {
      const apikey = url.searchParams.get('apikey') || request.headers.get('X-API-Key');
      if (!apikey) return fail(401, 'Missing API key');
      const usage = getUsage(apikey);
      if (!usage) return fail(401, 'Invalid API key');
      return ok(usage);
    }

    if (!path.startsWith('/api/')) return fail(404, 'Not found');

    const auth = authenticate(request);
    if (!auth.ok) return fail(auth.status, auth.error);

    try {
      if (path === '/api/download') return await handleDownload(url, env);
      if (path === '/api/download/ytaudio') return await handleYtAudio(url, env);
      if (path === '/api/download/ytmp4') return await handleYtMp4(url, env);
      if (path === '/api/download/tiktok') return await handleTikTok(url);
      if (path === '/api/card/welcome') return await handleWelcome(url, baseUrl);
      if (path === '/api/ai/chat') return await handleAiChat(url, env);
      if (path === '/api/tts') return await handleTts(url);
      if (path === '/api/qr') return await handleQr(url, baseUrl);
      return fail(404, 'Endpoint not found');
    } catch (e) {
      return fail(500, e.message || 'Internal server error');
    }
  },
};

async function handleDownload(url, env) {
  const link = url.searchParams.get('url');
  if (!link) return fail(400, 'Missing url parameter');
  const type = url.searchParams.get('type') || 'mp4';

  if (isYouTubeUrl(link)) {
    const result = await youtubeDownload(link, type, env);
    return ok(result);
  }

  const host = (() => { try { return new URL(link).hostname.toLowerCase(); } catch { return ''; } })();

  if (host.includes('tiktok.com')) {
    const result = await tiktokDownload(link);
    return ok(result);
  }

  if (host.includes('spotify.com')) {
    const m = link.match(/track\/([a-zA-Z0-9]+)/);
    if (!m) return fail(400, 'Invalid Spotify URL — only tracks are supported');
    const spotifyResult = await spotifyToYoutube(link, type, env);
    return ok(spotifyResult);
  }


  const site = detectSite(link);
  if (site) {
    const result = await socialDownload(link, site);
    result.type = result.type || type;
    return ok(result);
  }

  return fail(400, 'Unsupported URL. Supported: YouTube, TikTok, Instagram, Facebook, X, Spotify');
}

async function spotifyToYoutube(spotifyUrl, type, env) {
  const pageRes = await fetch(spotifyUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    redirect: 'follow',
  });
  const html = await pageRes.text();

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  let query = titleMatch ? titleMatch[1].replace(/\s*[-|]?\s*Spotify\s*$/i, '').trim() : '';

  if (!query) throw new Error('Could not extract Spotify track info');

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const searchRes = await fetch(searchUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const searchHtml = await searchRes.text();
  const vidMatch = searchHtml.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
  if (!vidMatch) throw new Error('Could not find YouTube match for Spotify track');

  const result = await youtubeDownload(`https://www.youtube.com/watch?v=${vidMatch[1]}`, 'mp3', env);
  result.site = 'spotify';
  return result;
}

async function handleYtAudio(url, env) {
  const link = url.searchParams.get('url');
  if (!link) return fail(400, 'Missing url parameter');
  const result = await youtubeDownload(link, 'mp3', env);
  return ok(result);
}

async function handleYtMp4(url, env) {
  const link = url.searchParams.get('url');
  if (!link) return fail(400, 'Missing url parameter');
  const result = await youtubeDownload(link, 'mp4', env);
  return ok(result);
}

async function handleTikTok(url) {
  const link = url.searchParams.get('url');
  if (!link) return fail(400, 'Missing url parameter');
  const result = await tiktokDownload(link);
  return ok(result);
}

async function handleWelcome(url, baseUrl) {
  const name = url.searchParams.get('name');
  const group = url.searchParams.get('group');
  const pic = url.searchParams.get('pic');
  const count = url.searchParams.get('count');
  const jsonMode = url.searchParams.get('json') === '1';

  if (!name) return fail(400, 'Missing name parameter');

  const svg = generateWelcomeCard(name, group, pic, count);
  const svgBytes = new TextEncoder().encode(svg);

  if (jsonMode) {
    const id = crypto.randomUUID().slice(0, 8);
    const key = putFile(id, 'svg', svgBytes, 'image/svg+xml');
    return ok({ download: `${baseUrl}/files/${key}` });
  }

  return new Response(svgBytes, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}

async function handleAiChat(url, env) {
  const q = url.searchParams.get('q');
  if (!q) return fail(400, 'Missing q parameter');
  const result = await aiChat(q, env);
  if (result.error) return fail(result.status, result.error);
  return ok(result.result);
}

async function handleTts(url) {
  const text = url.searchParams.get('text');
  const lang = url.searchParams.get('lang') || 'en';
  if (!text) return fail(400, 'Missing text parameter');
  if (text.length > 200) return fail(400, 'Text must be 200 characters or less');

  try {
    return await textToSpeech(text, lang);
  } catch (e) {
    return fail(502, 'TTS failed');
  }
}

async function handleQr(url, baseUrl) {
  const text = url.searchParams.get('text');
  const jsonMode = url.searchParams.get('json') === '1';
  if (!text) return fail(400, 'Missing text parameter');

  const svg = await generateQrSvg(text);
  const svgBytes = new TextEncoder().encode(svg);

  if (jsonMode) {
    const id = crypto.randomUUID().slice(0, 8);
    const key = putFile(id, 'svg', svgBytes, 'image/svg+xml');
    return ok({ download: `${baseUrl}/files/${key}` });
  }

  return new Response(svgBytes, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
