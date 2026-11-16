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
<p class="sub">Free API for WhatsApp bots — downloads, AI, TTS, cards & more.</p>

<div class="card">
<h2>Endpoints</h2>
<div class="ep"><span class="path">GET /api/download</span><span class="desc">Universal downloader</span></div>
<div class="ep"><span class="path">GET /api/download/ytaudio</span><span class="desc">YouTube audio (MP3)</span></div>
<div class="ep"><span class="path">GET /api/download/ytmp4</span><span class="desc">YouTube video (MP4)</span></div>
<div class="ep"><span class="path">GET /api/download/tiktok</span><span class="desc">TikTok video</span></div>
<div class="ep"><span class="path">GET /api/card/welcome</span><span class="desc">Welcome card (SVG)</span></div>
<div class="ep"><span class="path">GET /api/ai/chat</span><span class="desc">AI chat</span></div>
<div class="ep"><span class="path">GET /api/tts</span><span class="desc">Text to speech</span></div>
<div class="ep"><span class="path">GET /api/qr</span><span class="desc">QR code (SVG)</span></div>
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

<h2>Endpoints</h2>

<h3>1. Universal Download</h3>
<pre>GET /api/download?url=LINK&amp;type=mp3|mp4&amp;apikey=KEY</pre>
<p>Downloads from YouTube, TikTok, Instagram, Facebook, X, and Spotify.</p>
<p>Params: <span class="param">url</span> (required), <span class="param">type</span> (mp3 or mp4, default mp4)</p>
<p>Limits: max 10 min, 100 MB, up to 720p.</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/download?url=https://youtube.com/watch?v=dQw4w9WgXcQ&amp;type=mp4&amp;apikey=tayyab</pre>
<p>Response:</p>
<pre>{ "status": 200, "success": true, "result": { "title": "...", "thumbnail": "...", "duration": "3:32", "type": "mp4", "download": "https://...", "site": "youtube" } }</pre>

<h3>2. YouTube Audio (MP3)</h3>
<pre>GET /api/download/ytaudio?url=YOUTUBE_LINK&amp;apikey=KEY</pre>
<p>Example:</p>
<pre>GET ${baseUrl}/api/download/ytaudio?url=https://youtube.com/watch?v=dQw4w9WgXcQ&amp;apikey=tayyab</pre>

<h3>3. YouTube Video (MP4)</h3>
<pre>GET /api/download/ytmp4?url=YOUTUBE_LINK&amp;apikey=KEY</pre>
<p>Example:</p>
<pre>GET ${baseUrl}/api/download/ytmp4?url=https://youtube.com/watch?v=dQw4w9WgXcQ&amp;apikey=tayyab</pre>

<h3>4. TikTok Video</h3>
<pre>GET /api/download/tiktok?url=TIKTOK_LINK&amp;apikey=KEY</pre>
<p>Example:</p>
<pre>GET ${baseUrl}/api/download/tiktok?url=https://www.tiktok.com/@user/video/123&amp;apikey=tayyab</pre>

<h3>5. Welcome Card</h3>
<pre>GET /api/card/welcome?name=NAME&amp;group=GROUP&amp;pic=PHOTO_URL&amp;count=N&amp;apikey=KEY</pre>
<p>Returns an SVG image. Add <code>json=1</code> for JSON with a hosted download link.</p>
<p>Params: <span class="param">name</span> (required), <span class="param">group</span>, <span class="param">pic</span> (avatar URL), <span class="param">count</span> (member number)</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/card/welcome?name=Tayyab&amp;group=Optimus+Chat&amp;count=42&amp;apikey=tayyab</pre>

<h3>6. AI Chat</h3>
<pre>GET /api/ai/chat?q=PROMPT&amp;apikey=KEY</pre>
<p>Uses Groq (llama-3.3-70b). Max 800 chars. Returns 503 if AI is not configured.</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/ai/chat?q=What+is+JavaScript?&amp;apikey=tayyab</pre>

<h3>7. Text to Speech</h3>
<pre>GET /api/tts?text=TEXT&amp;lang=CODE&amp;apikey=KEY</pre>
<p>Returns audio/mpeg directly. Max 200 chars. Default lang: <code>en</code>.</p>
<p>Supported languages: en, ur, hi, ar, es, fr, de, pt, ja, ko, zh, ru, tr</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/tts?text=Hello+world&amp;lang=en&amp;apikey=tayyab</pre>

<h3>8. QR Code</h3>
<pre>GET /api/qr?text=TEXT&amp;apikey=KEY</pre>
<p>Returns an SVG QR code. Add <code>json=1</code> for JSON with download link.</p>
<p>Example:</p>
<pre>GET ${baseUrl}/api/qr?text=https://example.com&amp;apikey=tayyab</pre>

<h3>Usage Info</h3>
<pre>GET /api/usage?apikey=KEY</pre>
<p>Returns current usage counters and limits for the given key.</p>

<h2>Status Codes</h2>
<table>
<tr><th>Code</th><th>Meaning</th></tr>
<tr><td>200</td><td>Success</td></tr>
<tr><td>400</td><td>Bad request (missing/invalid params)</td></tr>
<tr><td>401</td><td>Invalid or missing API key</td></tr>
<tr><td>429</td><td>Rate limit exceeded</td></tr>
<tr><td>502</td><td>Upstream service error</td></tr>
<tr><td>503</td><td>Service not configured</td></tr>
<tr><td>504</td><td>Upstream timeout</td></tr>
</table>
</div>
</body>
</html>`, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}
