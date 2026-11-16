export function landingPage(baseUrl) {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tayyab Bot API</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:2rem}
.container{max-width:700px;width:100%}
h1{font-size:2.5rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem}
.sub{color:#94a3b8;font-size:1.1rem;margin-bottom:2rem}
.card{background:#1e293b;border-radius:12px;padding:1.5rem;margin-bottom:1rem}
.card h2{font-size:1.2rem;color:#7c3aed;margin-bottom:.75rem}
.ep{display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid #334155;font-size:.9rem}
.ep:last-child{border:none}
.ep .path{color:#06b6d4;font-family:monospace}
.ep .desc{color:#94a3b8}
a{color:#7c3aed;text-decoration:none}
a:hover{text-decoration:underline}
.footer{margin-top:2rem;color:#64748b;font-size:.85rem;text-align:center}
</style>
</head>
<body>
<div class="container">
<h1>Tayyab Bot API</h1>
<p class="sub">Free API for WhatsApp bots — downloads, AI, TTS, cards, image effects, tools & more.</p>

<div class="card">
<h2>Downloads</h2>
<div class="ep"><span class="path">GET /api/download</span><span class="desc">Universal downloader</span></div>
<div class="ep"><span class="path">GET /api/download/ytaudio</span><span class="desc">YouTube audio (MP3)</span></div>
<div class="ep"><span class="path">GET /api/download/ytmp4</span><span class="desc">YouTube video (MP4)</span></div>
<div class="ep"><span class="path">GET /api/download/tiktok</span><span class="desc">TikTok video</span></div>
<div class="ep"><span class="path">GET /api/download/spotify</span><span class="desc">Spotify track (via YouTube)</span></div>
<div class="ep"><span class="path">GET /api/download/ytsearch</span><span class="desc">YouTube search</span></div>
</div>

<div class="card">
<h2>Cards</h2>
<div class="ep"><span class="path">GET /api/card/welcome</span><span class="desc">Welcome card</span></div>
<div class="ep"><span class="path">GET /api/card/goodbye</span><span class="desc">Goodbye card</span></div>
<div class="ep"><span class="path">GET /api/card/rank</span><span class="desc">Rank card</span></div>
<div class="ep"><span class="path">GET /api/card/quote</span><span class="desc">Quote card</span></div>
<div class="ep"><span class="path">GET /api/card/wanted</span><span class="desc">Wanted poster</span></div>
<div class="ep"><span class="path">GET /api/card/jail</span><span class="desc">Jail card</span></div>
</div>

<div class="card">
<h2>Image Effects</h2>
<div class="ep"><span class="path">GET /api/img/blur</span><span class="desc">Blur image</span></div>
<div class="ep"><span class="path">GET /api/img/pixelate</span><span class="desc">Pixelate image</span></div>
<div class="ep"><span class="path">GET /api/img/grayscale</span><span class="desc">Grayscale image</span></div>
<div class="ep"><span class="path">GET /api/img/circle</span><span class="desc">Circle crop</span></div>
<div class="ep"><span class="path">GET /api/img/upscale</span><span class="desc">Upscale / resize</span></div>
<div class="ep"><span class="path">GET /api/img/meme</span><span class="desc">Meme text overlay</span></div>
</div>

<div class="card">
<h2>Tools</h2>
<div class="ep"><span class="path">GET /api/tools/calc</span><span class="desc">Calculator</span></div>
<div class="ep"><span class="path">GET /api/tools/country</span><span class="desc">Country info</span></div>
<div class="ep"><span class="path">GET /api/tools/currency</span><span class="desc">Currency converter</span></div>
</div>

<div class="card">
<h2>Fun &amp; Social</h2>
<div class="ep"><span class="path">GET /api/fun/joke</span><span class="desc">Random joke</span></div>
<div class="ep"><span class="path">GET /api/stalk/github</span><span class="desc">GitHub profile</span></div>
<div class="ep"><span class="path">GET /api/fake/tweet</span><span class="desc">Fake tweet card</span></div>
<div class="ep"><span class="path">GET /api/fake/ytcomment</span><span class="desc">Fake YT comment</span></div>
</div>

<div class="card">
<h2>Religion</h2>
<div class="ep"><span class="path">GET /api/religion/bible</span><span class="desc">Bible verse</span></div>
<div class="ep"><span class="path">GET /api/religion/quran</span><span class="desc">Quran ayah</span></div>
</div>

<div class="card">
<h2>AI, TTS, QR &amp; More</h2>
<div class="ep"><span class="path">GET /api/lyrics</span><span class="desc">Song lyrics</span></div>
<div class="ep"><span class="path">GET /api/ai/chat</span><span class="desc">AI chat</span></div>
<div class="ep"><span class="path">GET /api/tts</span><span class="desc">Text to speech</span></div>
<div class="ep"><span class="path">GET /api/qr</span><span class="desc">QR code</span></div>
</div>

<div class="card">
<h2>Quick Start</h2>
<p style="font-family:monospace;font-size:.85rem;color:#94a3b8;word-break:break-all">
GET ${baseUrl}/api/download?url=https://youtube.com/watch?v=dQw4w9WgXcQ&amp;type=mp4&amp;apikey=tayyab
</p>
</div>

<p style="text-align:center;margin-top:1rem">
<a href="/docs">Full Documentation &rarr;</a>
</p>
</div>
<div class="footer">
<p>Free tier: 30 req/min &middot; 300 req/hour &middot; 3,000 req/day</p>
</div>
</body>
</html>`, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}

export function docsPage(baseUrl) {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tayyab Bot API — Docs</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;padding:2rem;line-height:1.6}
.container{max-width:800px;margin:0 auto}
h1{font-size:2rem;color:#7c3aed;margin-bottom:1rem}
h2{font-size:1.3rem;color:#06b6d4;margin:2rem 0 .75rem;border-bottom:1px solid #334155;padding-bottom:.5rem}
h3{font-size:1.1rem;color:#a78bfa;margin:1.5rem 0 .5rem}
code{background:#1e293b;padding:.2rem .4rem;border-radius:4px;font-size:.9rem;color:#06b6d4}
pre{background:#1e293b;padding:1rem;border-radius:8px;overflow-x:auto;font-size:.85rem;margin:.75rem 0;color:#94a3b8}
p{margin:.5rem 0;color:#cbd5e1}
.param{color:#f59e0b}
a{color:#7c3aed}
table{width:100%;border-collapse:collapse;margin:.75rem 0}
th,td{text-align:left;padding:.5rem;border-bottom:1px solid #334155;font-size:.9rem}
th{color:#94a3b8}
</style>
</head>
<body>
<div class="container">
<h1>Tayyab Bot API — Documentation</h1>
<p><a href="/">&larr; Home</a></p>

<h2>Authentication</h2>
<p>Every request requires an API key, passed as:</p>
<ul>
<li>Query parameter: <code>?apikey=YOUR_KEY</code></li>
<li>Header: <code>X-API-Key: YOUR_KEY</code></li>
</ul>
<p>Demo key: <code>tayyab</code></p>
<p>Invalid or missing key returns <code>401</code>:</p>
<pre>{ "status": 401, "success": false, "result": { "error": "Invalid API key" } }</pre>

<h2>Rate Limits (Demo Key)</h2>
<table>
<tr><th>Window</th><th>Limit</th></tr>
<tr><td>Per minute</td><td>30</td></tr>
<tr><td>Per hour</td><td>300</td></tr>
<tr><td>Per day</td><td>3,000</td></tr>
</table>
<p>Exceeding a limit returns <code>429</code>.</p>

<h2>Response Format</h2>
<p>Success:</p>
<pre>{ "status": 200, "success": true, "result": { ... } }</pre>
<p>Error:</p>
<pre>{ "status": 4xx, "success": false, "result": { "error": "..." } }</pre>

<h2>Downloads</h2>

<h3>Universal Download</h3>
<pre>GET /api/download?url=LINK&amp;type=mp3|mp4&amp;apikey=KEY</pre>
<p>Downloads from YouTube, TikTok, Instagram, Facebook, X, and Spotify.</p>
<p>Params: <span class="param">url</span> (required), <span class="param">type</span> (mp3 or mp4, default mp4)</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/download?url=https://youtube.com/watch?v=dQw4w9WgXcQ&amp;type=mp4&amp;apikey=tayyab</pre>

<h3>YouTube Audio (MP3)</h3>
<pre>GET /api/download/ytaudio?url=YOUTUBE_LINK&amp;apikey=KEY</pre>

<h3>YouTube Video (MP4)</h3>
<pre>GET /api/download/ytmp4?url=YOUTUBE_LINK&amp;apikey=KEY</pre>

<h3>TikTok Video</h3>
<pre>GET /api/download/tiktok?url=TIKTOK_LINK&amp;apikey=KEY</pre>

<h3>Spotify Track</h3>
<pre>GET /api/download/spotify?url=SPOTIFY_TRACK_URL&amp;type=mp3&amp;apikey=KEY</pre>
<p>Finds the track on YouTube and returns an audio download.</p>
<p>Params: <span class="param">url</span> (required, Spotify track URL), <span class="param">type</span> (default mp3)</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/download/spotify?url=https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC&amp;apikey=tayyab</pre>

<h3>YouTube Search</h3>
<pre>GET /api/download/ytsearch?q=SEARCH_QUERY&amp;apikey=KEY</pre>
<p>Searches YouTube and returns up to 10 video results.</p>
<p>Params: <span class="param">q</span> (required)</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/download/ytsearch?q=ncs+music&amp;apikey=tayyab</pre>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "results": [{ "videoId": "...", "title": "...", "url": "..." }] } }</pre>

<h2>Cards</h2>
<p>All card endpoints return SVG by default. Add <code>format=png</code> for PNG output. Add <code>json=1</code> for a JSON response with a hosted download link.</p>

<h3>Welcome Card</h3>
<pre>GET /api/card/welcome?name=NAME&amp;group=GROUP&amp;pic=PHOTO_URL&amp;count=N&amp;apikey=KEY</pre>
<p>Params: <span class="param">name</span> (required), <span class="param">group</span>, <span class="param">pic</span> (avatar URL), <span class="param">count</span> (member number)</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/card/welcome?name=Tayyab&amp;group=Optimus+Chat&amp;count=42&amp;apikey=tayyab</pre>

<h3>Goodbye Card</h3>
<pre>GET /api/card/goodbye?name=NAME&amp;group=GROUP&amp;pic=PHOTO_URL&amp;count=N&amp;apikey=KEY</pre>
<p>Params: <span class="param">name</span> (required), <span class="param">group</span>, <span class="param">pic</span>, <span class="param">count</span></p>

<h3>Rank Card</h3>
<pre>GET /api/card/rank?name=NAME&amp;level=5&amp;xp=2500&amp;rank=3&amp;apikey=KEY</pre>
<p>Params: <span class="param">name</span> (required), <span class="param">level</span>, <span class="param">xp</span>, <span class="param">rank</span></p>

<h3>Quote Card</h3>
<pre>GET /api/card/quote?text=QUOTE_TEXT&amp;author=AUTHOR&amp;apikey=KEY</pre>
<p>Params: <span class="param">text</span> (required), <span class="param">author</span></p>

<h3>Wanted Poster</h3>
<pre>GET /api/card/wanted?name=NAME&amp;pic=PHOTO_URL&amp;reason=REASON&amp;apikey=KEY</pre>
<p>Params: <span class="param">name</span> (required), <span class="param">pic</span>, <span class="param">reason</span></p>

<h3>Jail Card</h3>
<pre>GET /api/card/jail?name=NAME&amp;pic=PHOTO_URL&amp;apikey=KEY</pre>
<p>Params: <span class="param">name</span> (required), <span class="param">pic</span></p>

<h2>Image Effects</h2>
<p>All image endpoints take a <span class="param">url</span> parameter (source image URL). Add <code>json=1</code> for a JSON response with a hosted download link.</p>

<h3>Blur</h3>
<pre>GET /api/img/blur?url=IMAGE_URL&amp;amount=5&amp;apikey=KEY</pre>
<p>Params: <span class="param">url</span> (required), <span class="param">amount</span> (blur strength, default 5)</p>

<h3>Pixelate</h3>
<pre>GET /api/img/pixelate?url=IMAGE_URL&amp;amount=8&amp;apikey=KEY</pre>
<p>Params: <span class="param">url</span> (required), <span class="param">amount</span> (pixel size, default 8)</p>

<h3>Grayscale</h3>
<pre>GET /api/img/grayscale?url=IMAGE_URL&amp;apikey=KEY</pre>
<p>Params: <span class="param">url</span> (required)</p>

<h3>Circle Crop</h3>
<pre>GET /api/img/circle?url=IMAGE_URL&amp;apikey=KEY</pre>
<p>Returns the image cropped in a circle (SVG with clipPath).</p>
<p>Params: <span class="param">url</span> (required)</p>

<h3>Upscale / Resize</h3>
<pre>GET /api/img/upscale?url=IMAGE_URL&amp;w=1024&amp;h=768&amp;apikey=KEY</pre>
<p>Params: <span class="param">url</span> (required), <span class="param">w</span> (width, default 1024), <span class="param">h</span> (height, optional)</p>

<h3>Meme</h3>
<pre>GET /api/img/meme?url=IMAGE_URL&amp;top=TOP+TEXT&amp;bottom=BOTTOM+TEXT&amp;apikey=KEY</pre>
<p>Returns the image with bold top/bottom meme text overlay (SVG).</p>
<p>Params: <span class="param">url</span> (required), <span class="param">top</span>, <span class="param">bottom</span></p>

<h2>Tools</h2>

<h3>Calculator</h3>
<pre>GET /api/tools/calc?expr=2*(3+4)&amp;apikey=KEY</pre>
<p>Evaluates arithmetic expressions safely. Supports: + - * / % ( ) and decimal numbers.</p>
<p>Params: <span class="param">expr</span> (required)</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "result": 14 } }</pre>

<h3>Country Info</h3>
<pre>GET /api/tools/country?name=Pakistan&amp;apikey=KEY</pre>
<p>Params: <span class="param">name</span> (required)</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "name": "Pakistan", "capital": "Islamabad", "region": "Asia", "population": 220892340, "flag": "🇵🇰", "currencies": "Pakistani rupee", "languages": "English, Urdu" } }</pre>

<h3>Currency Converter</h3>
<pre>GET /api/tools/currency?from=USD&amp;to=PKR&amp;amount=100&amp;apikey=KEY</pre>
<p>Params: <span class="param">from</span> (required), <span class="param">to</span> (required), <span class="param">amount</span> (default 1)</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "from": "USD", "to": "PKR", "amount": 100, "rate": 278.5, "converted": 27850 } }</pre>

<h2>Fun &amp; Social</h2>

<h3>Random Joke</h3>
<pre>GET /api/fun/joke?apikey=KEY</pre>
<p>Returns a random joke (safe mode).</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "category": "Programming", "type": "single", "joke": "..." } }</pre>

<h3>GitHub Profile</h3>
<pre>GET /api/stalk/github?user=USERNAME&amp;apikey=KEY</pre>
<p>Params: <span class="param">user</span> (required)</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "login": "...", "name": "...", "bio": "...", "followers": 100, "public_repos": 50, "avatar_url": "...", "html_url": "..." } }</pre>

<h3>Fake Tweet</h3>
<pre>GET /api/fake/tweet?name=NAME&amp;username=HANDLE&amp;text=TWEET_TEXT&amp;apikey=KEY</pre>
<p>Returns a fake tweet card as SVG/PNG. Add <code>json=1</code> for hosted link.</p>
<p>Params: <span class="param">name</span> (required), <span class="param">username</span>, <span class="param">text</span> (required)</p>

<h3>Fake YouTube Comment</h3>
<pre>GET /api/fake/ytcomment?name=NAME&amp;text=COMMENT_TEXT&amp;likes=42&amp;apikey=KEY</pre>
<p>Returns a fake YouTube comment card as SVG/PNG. Add <code>json=1</code> for hosted link.</p>
<p>Params: <span class="param">name</span> (required), <span class="param">text</span> (required), <span class="param">likes</span></p>

<h2>Religion</h2>

<h3>Bible Verse</h3>
<pre>GET /api/religion/bible?ref=John+3:16&amp;apikey=KEY</pre>
<p>Params: <span class="param">ref</span> (required, e.g. "John 3:16", "Genesis 1:1-3")</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "reference": "John 3:16", "text": "...", "translation_name": "World English Bible" } }</pre>

<h3>Quran Ayah</h3>
<pre>GET /api/religion/quran?surah=1&amp;ayah=1&amp;apikey=KEY</pre>
<p>Params: <span class="param">surah</span> (default 1), <span class="param">ayah</span> (default 1)</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "surah": 1, "ayah": 1, "text": "...", "surah_name": "Al-Faatiha" } }</pre>

<h2>Lyrics</h2>

<h3>Song Lyrics</h3>
<pre>GET /api/lyrics?artist=ARTIST&amp;title=SONG_TITLE&amp;apikey=KEY</pre>
<p>Params: <span class="param">artist</span> (required), <span class="param">title</span> (required)</p>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "artist": "...", "title": "...", "lyrics": "..." } }</pre>

<h2>AI Chat</h2>
<pre>GET /api/ai/chat?q=PROMPT&amp;apikey=KEY</pre>
<p>Uses Groq (llama-3.3-70b). Max 800 chars. Returns 503 if AI is not configured.</p>

<h2>Text to Speech</h2>
<pre>GET /api/tts?text=TEXT&amp;lang=CODE&amp;apikey=KEY</pre>
<p>Returns audio/mpeg directly. Max 200 chars. Default lang: <code>en</code>.</p>
<p>Supported languages: en, ur, hi, ar, es, fr, de, pt, ja, ko, zh, ru, tr</p>

<h2>QR Code</h2>
<pre>GET /api/qr?text=TEXT&amp;apikey=KEY</pre>
<p>Returns an SVG QR code. Add <code>format=png</code> for PNG. Add <code>json=1</code> for JSON with download link.</p>

<h2>Usage Info</h2>
<pre>GET /api/usage?apikey=KEY</pre>
<p>Returns current usage counters and limits for the given key.</p>

<h2>Status Codes</h2>
<table>
<tr><th>Code</th><th>Meaning</th></tr>
<tr><td>200</td><td>Success</td></tr>
<tr><td>400</td><td>Bad request (missing/invalid params)</td></tr>
<tr><td>401</td><td>Invalid or missing API key</td></tr>
<tr><td>404</td><td>Not found</td></tr>
<tr><td>429</td><td>Rate limit exceeded</td></tr>
<tr><td>502</td><td>Upstream service error</td></tr>
<tr><td>503</td><td>Service not configured</td></tr>
<tr><td>504</td><td>Upstream timeout</td></tr>
</table>
</div>
</body>
</html>`, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}
