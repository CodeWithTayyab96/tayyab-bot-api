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
import { generateGoodbyeCard, generateRankCard, generateQuoteCard, generateWantedCard, generateJailCard, generateFakeTweetCard, generateFakeYtCommentCard } from './cards.js';
import { imgBlur, imgPixelate, imgGrayscale, imgCircle, imgUpscale, imgMeme } from './imgfx.js';
import { calculate, lookupCountry, convertCurrency } from './tools.js';
import { fetchJoke } from './fun.js';
import { githubStalk } from './stalk.js';
import { bibleVerse, quranAyah } from './religion.js';
import { fetchLyrics } from './lyrics.js';
import { youtubeSearch } from './ytsearch.js';
import { svgToPng } from './png.js';

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
      // Downloads
      if (path === '/api/download') return await handleDownload(url, env);
      if (path === '/api/download/ytaudio') return await handleYtAudio(url, env);
      if (path === '/api/download/ytmp4') return await handleYtMp4(url, env);
      if (path === '/api/download/tiktok') return await handleTikTok(url);
      if (path === '/api/download/spotify') return await handleSpotify(url, env);
      if (path === '/api/download/ytsearch') return await handleYtSearch(url);

      // Cards
      if (path === '/api/card/welcome') return await handleWelcome(url, baseUrl);
      if (path === '/api/card/goodbye') return await handleGoodbye(url, baseUrl);
      if (path === '/api/card/rank') return await handleRank(url, baseUrl);
      if (path === '/api/card/quote') return await handleQuote(url, baseUrl);
      if (path === '/api/card/wanted') return await handleWanted(url, baseUrl);
      if (path === '/api/card/jail') return await handleJail(url, baseUrl);

      // Image effects
      if (path === '/api/img/blur') return await handleImgBlur(url, baseUrl);
      if (path === '/api/img/pixelate') return await handleImgPixelate(url, baseUrl);
      if (path === '/api/img/grayscale') return await handleImgGrayscale(url, baseUrl);
      if (path === '/api/img/circle') return handleImgCircle(url, baseUrl);
      if (path === '/api/img/upscale') return await handleImgUpscale(url, baseUrl);
      if (path === '/api/img/meme') return handleImgMeme(url, baseUrl);

      // Tools
      if (path === '/api/tools/calc') return handleCalc(url);
      if (path === '/api/tools/country') return await handleCountry(url);
      if (path === '/api/tools/currency') return await handleCurrency(url);

      // Fun
      if (path === '/api/fun/joke') return await handleJoke();

      // Stalk
      if (path === '/api/stalk/github') return await handleGithubStalk(url);

      // Religion
      if (path === '/api/religion/bible') return await handleBible(url);
      if (path === '/api/religion/quran') return await handleQuran(url);

      // Lyrics
      if (path === '/api/lyrics') return await handleLyrics(url);

      // Fake cards
      if (path === '/api/fake/tweet') return await handleFakeTweet(url, baseUrl);
      if (path === '/api/fake/ytcomment') return await handleFakeYtComment(url, baseUrl);

      // AI, TTS, QR
      if (path === '/api/ai/chat') return await handleAiChat(url, env);
      if (path === '/api/tts') return await handleTts(url);
      if (path === '/api/qr') return await handleQr(url, baseUrl);

      return fail(404, 'Endpoint not found');
    } catch (e) {
      return fail(500, e.message || 'Internal server error');
    }
  },
};

// --- Shared helpers ---

async function respondWithSvg(svg, url, baseUrl) {
  const jsonMode = url.searchParams.get('json') === '1';
  const format = url.searchParams.get('format') || 'svg';

  if (format === 'png') {
    try {
      const pngBytes = await svgToPng(svg);
      if (jsonMode) {
        const id = crypto.randomUUID().slice(0, 8);
        const key = putFile(id, 'png', pngBytes, 'image/png');
        return ok({ download: `${baseUrl}/files/${key}` });
      }
      return new Response(pngBytes, { headers: { 'Content-Type': 'image/png' } });
    } catch {
      return fail(502, 'PNG rendering unavailable');
    }
  }

  const svgBytes = new TextEncoder().encode(svg);
  if (jsonMode) {
    const id = crypto.randomUUID().slice(0, 8);
    const key = putFile(id, 'svg', svgBytes, 'image/svg+xml');
    return ok({ download: `${baseUrl}/files/${key}` });
  }
  return new Response(svgBytes, { headers: { 'Content-Type': 'image/svg+xml' } });
}

function respondWithImage(result, url, baseUrl) {
  const jsonMode = url.searchParams.get('json') === '1';
  if (jsonMode) {
    const id = crypto.randomUUID().slice(0, 8);
    const key = putFile(id, result.ext, result.data, result.contentType);
    return ok({ download: `${baseUrl}/files/${key}` });
  }
  return new Response(result.data, { headers: { 'Content-Type': result.contentType } });
}

// --- Download handlers ---

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

async function handleSpotify(url, env) {
  const link = url.searchParams.get('url');
  if (!link) return fail(400, 'Missing url parameter');
  const m = link.match(/track\/([a-zA-Z0-9]+)/);
  if (!m) return fail(400, 'Invalid Spotify URL — only tracks are supported');
  const type = url.searchParams.get('type') || 'mp3';
  const result = await spotifyToYoutube(link, type, env);
  return ok(result);
}

async function handleYtSearch(url) {
  const q = url.searchParams.get('q');
  if (!q) return fail(400, 'Missing q parameter');
  const results = await youtubeSearch(q);
  if (!results.length) return fail(404, 'No results');
  return ok({ results });
}

// --- Card handlers ---

async function handleWelcome(url, baseUrl) {
  const name = url.searchParams.get('name');
  if (!name) return fail(400, 'Missing name parameter');
  const svg = generateWelcomeCard(name, url.searchParams.get('group'), url.searchParams.get('pic'), url.searchParams.get('count'));
  return respondWithSvg(svg, url, baseUrl);
}

async function handleGoodbye(url, baseUrl) {
  const name = url.searchParams.get('name');
  if (!name) return fail(400, 'Missing name parameter');
  const svg = generateGoodbyeCard(name, url.searchParams.get('group'), url.searchParams.get('pic'), url.searchParams.get('count'));
  return respondWithSvg(svg, url, baseUrl);
}

async function handleRank(url, baseUrl) {
  const name = url.searchParams.get('name');
  if (!name) return fail(400, 'Missing name parameter');
  const svg = generateRankCard(name, url.searchParams.get('level'), url.searchParams.get('xp'), url.searchParams.get('rank'));
  return respondWithSvg(svg, url, baseUrl);
}

async function handleQuote(url, baseUrl) {
  const text = url.searchParams.get('text');
  if (!text) return fail(400, 'Missing text parameter');
  const svg = generateQuoteCard(text, url.searchParams.get('author'));
  return respondWithSvg(svg, url, baseUrl);
}

async function handleWanted(url, baseUrl) {
  const name = url.searchParams.get('name');
  if (!name) return fail(400, 'Missing name parameter');
  const svg = generateWantedCard(name, url.searchParams.get('pic'), url.searchParams.get('reason'));
  return respondWithSvg(svg, url, baseUrl);
}

async function handleJail(url, baseUrl) {
  const name = url.searchParams.get('name');
  if (!name) return fail(400, 'Missing name parameter');
  const svg = generateJailCard(name, url.searchParams.get('pic'));
  return respondWithSvg(svg, url, baseUrl);
}

// --- Image effect handlers ---

async function handleImgBlur(url, baseUrl) {
  const imgUrl = url.searchParams.get('url');
  if (!imgUrl) return fail(400, 'Missing url parameter');
  const result = await imgBlur(imgUrl, url.searchParams.get('amount') || '5');
  return respondWithImage(result, url, baseUrl);
}

async function handleImgPixelate(url, baseUrl) {
  const imgUrl = url.searchParams.get('url');
  if (!imgUrl) return fail(400, 'Missing url parameter');
  const result = await imgPixelate(imgUrl, url.searchParams.get('amount') || '8');
  return respondWithImage(result, url, baseUrl);
}

async function handleImgGrayscale(url, baseUrl) {
  const imgUrl = url.searchParams.get('url');
  if (!imgUrl) return fail(400, 'Missing url parameter');
  const result = await imgGrayscale(imgUrl);
  return respondWithImage(result, url, baseUrl);
}

function handleImgCircle(url, baseUrl) {
  const imgUrl = url.searchParams.get('url');
  if (!imgUrl) return fail(400, 'Missing url parameter');
  const result = imgCircle(imgUrl);
  return respondWithImage(result, url, baseUrl);
}

async function handleImgUpscale(url, baseUrl) {
  const imgUrl = url.searchParams.get('url');
  if (!imgUrl) return fail(400, 'Missing url parameter');
  const result = await imgUpscale(imgUrl, url.searchParams.get('w') || '1024', url.searchParams.get('h'));
  return respondWithImage(result, url, baseUrl);
}

function handleImgMeme(url, baseUrl) {
  const imgUrl = url.searchParams.get('url');
  if (!imgUrl) return fail(400, 'Missing url parameter');
  const result = imgMeme(imgUrl, url.searchParams.get('top'), url.searchParams.get('bottom'));
  return respondWithImage(result, url, baseUrl);
}

// --- Tool handlers ---

function handleCalc(url) {
  const expr = url.searchParams.get('expr');
  if (!expr) return fail(400, 'Missing expr parameter');
  try {
    const result = calculate(expr);
    return ok({ result });
  } catch (e) {
    return fail(400, e.message);
  }
}

async function handleCountry(url) {
  const name = url.searchParams.get('name');
  if (!name) return fail(400, 'Missing name parameter');
  const result = await lookupCountry(name);
  if (!result) return fail(404, 'Country not found');
  return ok(result);
}

async function handleCurrency(url) {
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const amount = url.searchParams.get('amount') || '1';
  if (!from || !to) return fail(400, 'Missing from or to parameter');
  try {
    const result = await convertCurrency(from, to, amount);
    return ok(result);
  } catch (e) {
    if (e.message && e.message.startsWith('Unsupported currency')) return fail(400, e.message);
    return fail(502, 'Currency conversion failed');
  }
}

// --- Fun handler ---

async function handleJoke() {
  const result = await fetchJoke();
  return ok(result);
}

// --- Stalk handler ---

async function handleGithubStalk(url) {
  const user = url.searchParams.get('user');
  if (!user) return fail(400, 'Missing user parameter');
  const result = await githubStalk(user);
  if (!result) return fail(404, 'GitHub user not found');
  return ok(result);
}

// --- Religion handlers ---

async function handleBible(url) {
  const ref = url.searchParams.get('ref');
  if (!ref) return fail(400, 'Missing ref parameter');
  const result = await bibleVerse(ref);
  return ok(result);
}

async function handleQuran(url) {
  const surah = url.searchParams.get('surah') || '1';
  const ayah = url.searchParams.get('ayah') || '1';
  const result = await quranAyah(surah, ayah);
  return ok(result);
}

// --- Lyrics handler ---

async function handleLyrics(url) {
  const artist = url.searchParams.get('artist');
  const title = url.searchParams.get('title');
  if (!artist || !title) return fail(400, 'Missing artist or title parameter');
  const result = await fetchLyrics(artist, title);
  if (!result) return fail(404, 'Lyrics not found');
  return ok(result);
}

// --- Fake card handlers ---

async function handleFakeTweet(url, baseUrl) {
  const name = url.searchParams.get('name');
  const text = url.searchParams.get('text');
  if (!name || !text) return fail(400, 'Missing name or text parameter');
  const svg = generateFakeTweetCard(name, url.searchParams.get('username'), text);
  return respondWithSvg(svg, url, baseUrl);
}

async function handleFakeYtComment(url, baseUrl) {
  const name = url.searchParams.get('name');
  const text = url.searchParams.get('text');
  if (!name || !text) return fail(400, 'Missing name or text parameter');
  const svg = generateFakeYtCommentCard(name, text, url.searchParams.get('likes'));
  return respondWithSvg(svg, url, baseUrl);
}

// --- Existing handlers ---

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
  if (!text) return fail(400, 'Missing text parameter');
  const svg = await generateQrSvg(text);
  return respondWithSvg(svg, url, baseUrl);
}
