export function demoPage(baseUrl) {
  return new Response(buildHtml(baseUrl), {
    headers: { 'Content-Type': 'text/html;charset=utf-8' },
  });
}

function buildHtml(baseUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tayyab Bot API — Playground</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;padding:1.5rem 1rem}
.container{max-width:820px;margin:0 auto}
h1{font-size:2rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.25rem}
.nav{margin-bottom:1.5rem;color:#94a3b8;font-size:.9rem}
.nav a{color:#7c3aed;text-decoration:none}
.nav a:hover{text-decoration:underline}
.info-bar{background:#1e293b;border-radius:8px;padding:1rem 1.25rem;margin-bottom:1.5rem;font-size:.85rem;color:#94a3b8;border-left:3px solid #7c3aed;line-height:1.6}
.info-bar strong{color:#e2e8f0}
.info-bar code{background:#334155;padding:.1rem .35rem;border-radius:3px;color:#06b6d4;font-size:.8rem}
.section{background:#1e293b;border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1rem}
.section-title{font-size:.75rem;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem;font-weight:600}
label{display:block;font-size:.85rem;color:#94a3b8;margin-bottom:.25rem}
label .req{color:#f87171;margin-left:.2rem}
select,input[type=text]{width:100%;padding:.55rem .75rem;background:#0f172a;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:.9rem;font-family:inherit;margin-bottom:.75rem;transition:border-color .15s}
select:focus,input[type=text]:focus{outline:none;border-color:#7c3aed}
select option{background:#0f172a}
select optgroup{color:#06b6d4;font-style:normal}
.param-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}
@media(max-width:600px){.param-grid{grid-template-columns:1fr}}
.no-params{color:#64748b;font-size:.85rem;font-style:italic;margin-bottom:.75rem}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1.5rem;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:8px;font-size:.9rem;font-weight:500;cursor:pointer;font-family:inherit;transition:opacity .15s}
.btn:hover{opacity:.9}
.btn:disabled{opacity:.45;cursor:not-allowed}
.url-bar{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.78rem;color:#06b6d4;word-break:break-all;background:#0f172a;padding:.75rem;border-radius:6px;margin-top:.5rem;line-height:1.5}
.url-bar .method{color:#a78bfa;font-weight:600}
pre.response{background:#0f172a;padding:1rem;border-radius:8px;overflow-x:auto;font-size:.8rem;color:#94a3b8;max-height:420px;overflow-y:auto;white-space:pre-wrap;word-break:break-word;line-height:1.5;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.preview{margin-top:.75rem;text-align:center}
.preview img{max-width:100%;max-height:400px;border-radius:8px;background:#0f172a;border:1px solid #334155}
.preview audio{width:100%;margin-top:.5rem}
.preview a{display:inline-block;margin-top:.5rem;color:#7c3aed;font-size:.85rem}
.hidden{display:none}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle}
@keyframes spin{to{transform:rotate(360deg)}}
.error-text{color:#f87171}
.footer{margin-top:2rem;color:#475569;font-size:.8rem;text-align:center;padding-bottom:1rem}
.status-badge{display:inline-block;padding:.15rem .5rem;border-radius:4px;font-size:.75rem;font-weight:600;margin-right:.5rem;vertical-align:middle}
.status-ok{background:#065f4620;color:#34d399}
.status-err{background:#7f1d1d20;color:#f87171}
</style>
</head>
<body>
<div class="container">
<h1>API Playground</h1>
<div class="nav"><a href="/">&larr; Home</a> &middot; <a href="/docs">Docs</a></div>

<div class="info-bar">
<strong>Rate limits:</strong> 30 req/min &middot; 300 req/hour &middot; 3,000 req/day<br>
The demo key <code>tayyab</code> is shared by all visitors &mdash; please be considerate with usage.
</div>

<div class="section">
<div class="section-title">Endpoint</div>
<select id="ep-select">
<option value="" disabled selected>Select an endpoint&hellip;</option>
<optgroup label="Downloads">
<option value="download">Universal Download</option>
<option value="ytaudio">YouTube Audio (MP3)</option>
<option value="ytmp4">YouTube Video (MP4)</option>
<option value="tiktok">TikTok Video</option>
<option value="spotify">Spotify Track</option>
<option value="ytsearch">YouTube Search</option>
</optgroup>
<optgroup label="Cards">
<option value="welcome">Welcome Card</option>
<option value="goodbye">Goodbye Card</option>
<option value="rank">Rank Card</option>
<option value="quote">Quote Card</option>
<option value="wanted">Wanted Poster</option>
<option value="jail">Jail Card</option>
</optgroup>
<optgroup label="Image Effects">
<option value="blur">Blur</option>
<option value="pixelate">Pixelate</option>
<option value="grayscale">Grayscale</option>
<option value="circle">Circle Crop</option>
<option value="upscale">Upscale / Resize</option>
<option value="meme">Meme Text Overlay</option>
</optgroup>
<optgroup label="Tools">
<option value="calc">Calculator</option>
<option value="country">Country Info</option>
<option value="currency">Currency Converter</option>
</optgroup>
<optgroup label="Fun &amp; Social">
<option value="joke">Random Joke</option>
<option value="github">GitHub Profile</option>
<option value="faketweet">Fake Tweet Card</option>
<option value="fakeyt">Fake YT Comment Card</option>
</optgroup>
<optgroup label="Religion">
<option value="bible">Bible Verse</option>
<option value="quran">Quran Ayah</option>
</optgroup>
<optgroup label="AI, TTS, QR &amp; More">
<option value="lyrics">Song Lyrics</option>
<option value="aichat">AI Chat</option>
<option value="tts">Text to Speech</option>
<option value="qr">QR Code</option>
</optgroup>
<optgroup label="Utility">
<option value="usage">API Usage Info</option>
</optgroup>
</select>
</div>

<div class="section hidden" id="params-section">
<div class="section-title">Parameters</div>
<div class="param-grid" id="params-grid"></div>
<div class="no-params hidden" id="no-params">No parameters needed &mdash; just hit Run.</div>
<button class="btn" id="run-btn" disabled>
<span id="btn-label">Run</span>
<span id="btn-spin" class="spinner hidden"></span>
</button>
</div>

<div class="section hidden" id="req-section">
<div class="section-title">Request</div>
<div class="url-bar" id="req-url"></div>
</div>

<div class="section hidden" id="res-section">
<div class="section-title">
Response <span id="res-badge" class="status-badge hidden"></span>
</div>
<pre class="response" id="res-body"></pre>
<div class="preview hidden" id="preview"></div>
</div>
</div>

<div class="footer">Tayyab Bot API &mdash; Free for WhatsApp bots</div>

<script>
(function() {
  var APIKEY = 'tayyab';

  var EP = {
    download:  { path: '/api/download', rtype: 'json', params: [
      { n:'url', req:1, ph:'https://youtube.com/watch?v=dQw4w9WgXcQ', lb:'URL' },
      { n:'type', req:0, ph:'mp3 or mp4 (default mp4)', lb:'Type' }
    ]},
    ytaudio:   { path: '/api/download/ytaudio', rtype: 'json', params: [
      { n:'url', req:1, ph:'https://youtube.com/watch?v=dQw4w9WgXcQ', lb:'YouTube URL' }
    ]},
    ytmp4:     { path: '/api/download/ytmp4', rtype: 'json', params: [
      { n:'url', req:1, ph:'https://youtube.com/watch?v=dQw4w9WgXcQ', lb:'YouTube URL' }
    ]},
    tiktok:    { path: '/api/download/tiktok', rtype: 'json', params: [
      { n:'url', req:1, ph:'https://www.tiktok.com/@user/video/123456', lb:'TikTok URL' }
    ]},
    spotify:   { path: '/api/download/spotify', rtype: 'json', params: [
      { n:'url', req:1, ph:'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC', lb:'Spotify URL' },
      { n:'type', req:0, ph:'mp3 (default)', lb:'Type' }
    ]},
    ytsearch:  { path: '/api/download/ytsearch', rtype: 'json', params: [
      { n:'q', req:1, ph:'ncs music', lb:'Search query' }
    ]},

    welcome:   { path: '/api/card/welcome', rtype: 'image', params: [
      { n:'name',  req:1, ph:'Tayyab', lb:'Name' },
      { n:'group', req:0, ph:'Optimus Chat', lb:'Group' },
      { n:'pic',   req:0, ph:'https://i.pravatar.cc/150', lb:'Avatar URL' },
      { n:'count', req:0, ph:'42', lb:'Member #' }
    ]},
    goodbye:   { path: '/api/card/goodbye', rtype: 'image', params: [
      { n:'name',  req:1, ph:'Tayyab', lb:'Name' },
      { n:'group', req:0, ph:'Optimus Chat', lb:'Group' },
      { n:'pic',   req:0, ph:'https://i.pravatar.cc/150', lb:'Avatar URL' },
      { n:'count', req:0, ph:'42', lb:'Member #' }
    ]},
    rank:      { path: '/api/card/rank', rtype: 'image', params: [
      { n:'name',  req:1, ph:'Tayyab', lb:'Name' },
      { n:'level', req:0, ph:'5', lb:'Level' },
      { n:'xp',    req:0, ph:'2500', lb:'XP' },
      { n:'rank',  req:0, ph:'3', lb:'Rank' }
    ]},
    quote:     { path: '/api/card/quote', rtype: 'image', params: [
      { n:'text',   req:1, ph:'Be the change you wish to see.', lb:'Quote text' },
      { n:'author', req:0, ph:'Gandhi', lb:'Author' }
    ]},
    wanted:    { path: '/api/card/wanted', rtype: 'image', params: [
      { n:'name',   req:1, ph:'Tayyab', lb:'Name' },
      { n:'pic',    req:0, ph:'https://i.pravatar.cc/150', lb:'Photo URL' },
      { n:'reason', req:0, ph:'Too awesome', lb:'Reason' }
    ]},
    jail:      { path: '/api/card/jail', rtype: 'image', params: [
      { n:'name', req:1, ph:'Tayyab', lb:'Name' },
      { n:'pic',  req:0, ph:'https://i.pravatar.cc/150', lb:'Photo URL' }
    ]},

    blur:      { path: '/api/img/blur', rtype: 'image', params: [
      { n:'url',    req:1, ph:'https://picsum.photos/400', lb:'Image URL' },
      { n:'amount', req:0, ph:'5', lb:'Blur amount' }
    ]},
    pixelate:  { path: '/api/img/pixelate', rtype: 'image', params: [
      { n:'url',    req:1, ph:'https://picsum.photos/400', lb:'Image URL' },
      { n:'amount', req:0, ph:'8', lb:'Pixel size' }
    ]},
    grayscale: { path: '/api/img/grayscale', rtype: 'image', params: [
      { n:'url', req:1, ph:'https://picsum.photos/400', lb:'Image URL' }
    ]},
    circle:    { path: '/api/img/circle', rtype: 'image', params: [
      { n:'url', req:1, ph:'https://picsum.photos/400', lb:'Image URL' }
    ]},
    upscale:   { path: '/api/img/upscale', rtype: 'image', params: [
      { n:'url', req:1, ph:'https://picsum.photos/200', lb:'Image URL' },
      { n:'w',   req:0, ph:'1024', lb:'Width' },
      { n:'h',   req:0, ph:'', lb:'Height' }
    ]},
    meme:      { path: '/api/img/meme', rtype: 'image', params: [
      { n:'url',    req:1, ph:'https://picsum.photos/400', lb:'Image URL' },
      { n:'top',    req:0, ph:'TOP TEXT', lb:'Top text' },
      { n:'bottom', req:0, ph:'BOTTOM TEXT', lb:'Bottom text' }
    ]},

    calc:      { path: '/api/tools/calc', rtype: 'json', params: [
      { n:'expr', req:1, ph:'2*(3+4)', lb:'Expression' }
    ]},
    country:   { path: '/api/tools/country', rtype: 'json', params: [
      { n:'name', req:1, ph:'Pakistan', lb:'Country name' }
    ]},
    currency:  { path: '/api/tools/currency', rtype: 'json', params: [
      { n:'from',   req:1, ph:'USD', lb:'From' },
      { n:'to',     req:1, ph:'PKR', lb:'To' },
      { n:'amount', req:0, ph:'100', lb:'Amount' }
    ]},

    joke:      { path: '/api/fun/joke', rtype: 'json', params: [] },
    github:    { path: '/api/stalk/github', rtype: 'json', params: [
      { n:'user', req:1, ph:'tayyab03417', lb:'GitHub username' }
    ]},
    faketweet: { path: '/api/fake/tweet', rtype: 'image', params: [
      { n:'name',     req:1, ph:'Elon Musk', lb:'Display name' },
      { n:'username', req:0, ph:'elonmusk', lb:'Handle' },
      { n:'text',     req:1, ph:'Just mass bought a bot API.', lb:'Tweet text' }
    ]},
    fakeyt:    { path: '/api/fake/ytcomment', rtype: 'image', params: [
      { n:'name',  req:1, ph:'John Doe', lb:'Name' },
      { n:'text',  req:1, ph:'First!', lb:'Comment text' },
      { n:'likes', req:0, ph:'42', lb:'Likes' }
    ]},

    bible:     { path: '/api/religion/bible', rtype: 'json', params: [
      { n:'ref', req:1, ph:'John 3:16', lb:'Reference' }
    ]},
    quran:     { path: '/api/religion/quran', rtype: 'json', params: [
      { n:'surah', req:0, ph:'1', lb:'Surah' },
      { n:'ayah',  req:0, ph:'1', lb:'Ayah' }
    ]},

    lyrics:    { path: '/api/lyrics', rtype: 'json', params: [
      { n:'artist', req:1, ph:'Ed Sheeran', lb:'Artist' },
      { n:'title',  req:1, ph:'Shape of You', lb:'Song title' }
    ]},
    aichat:    { path: '/api/ai/chat', rtype: 'json', params: [
      { n:'q', req:1, ph:'What is the capital of France?', lb:'Prompt (max 800 chars)' }
    ]},
    tts:       { path: '/api/tts', rtype: 'audio', params: [
      { n:'text', req:1, ph:'Hello, world!', lb:'Text (max 200 chars)' },
      { n:'lang', req:0, ph:'en', lb:'Language code' }
    ]},
    qr:        { path: '/api/qr', rtype: 'image', params: [
      { n:'text', req:1, ph:'https://example.com', lb:'Text or URL' }
    ]},

    usage:     { path: '/api/usage', rtype: 'json', params: [] }
  };

  var sel       = document.getElementById('ep-select');
  var pSec      = document.getElementById('params-section');
  var pGrid     = document.getElementById('params-grid');
  var noParams  = document.getElementById('no-params');
  var runBtn    = document.getElementById('run-btn');
  var btnLabel  = document.getElementById('btn-label');
  var btnSpin   = document.getElementById('btn-spin');
  var reqSec    = document.getElementById('req-section');
  var reqUrl    = document.getElementById('req-url');
  var resSec    = document.getElementById('res-section');
  var resBadge  = document.getElementById('res-badge');
  var resBody   = document.getElementById('res-body');
  var previewEl = document.getElementById('preview');

  var cur = null;

  sel.addEventListener('change', function() {
    cur = EP[sel.value];
    if (!cur) return;
    pSec.classList.remove('hidden');
    reqSec.classList.add('hidden');
    resSec.classList.add('hidden');
    pGrid.innerHTML = '';

    if (cur.params.length === 0) {
      noParams.classList.remove('hidden');
    } else {
      noParams.classList.add('hidden');
      cur.params.forEach(function(p) {
        var wrap = document.createElement('div');
        var lbl = document.createElement('label');
        lbl.textContent = p.lb;
        if (p.req) {
          var star = document.createElement('span');
          star.className = 'req';
          star.textContent = '*';
          lbl.appendChild(star);
        }
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.name = p.n;
        inp.placeholder = p.ph;
        inp.setAttribute('data-req', p.req ? '1' : '0');
        wrap.appendChild(lbl);
        wrap.appendChild(inp);
        pGrid.appendChild(wrap);
      });
    }
    runBtn.disabled = false;
  });

  runBtn.addEventListener('click', function() {
    if (!cur) return;
    var inputs = pGrid.querySelectorAll('input');
    var qs = new URLSearchParams();
    qs.set('apikey', APIKEY);

    var ok = true;
    for (var i = 0; i < inputs.length; i++) {
      var inp = inputs[i];
      var v = inp.value.trim();
      if (inp.getAttribute('data-req') === '1' && !v) {
        inp.style.borderColor = '#f87171';
        ok = false;
      } else {
        inp.style.borderColor = '#334155';
        if (v) qs.set(inp.name, v);
      }
    }
    if (!ok) return;

    if (cur.rtype === 'image') qs.set('json', '1');

    var fetchPath = cur.path + '?' + qs.toString();
    var fullUrl = location.origin + fetchPath;

    reqSec.classList.remove('hidden');
    reqUrl.innerHTML = '<span class="method">GET</span> ' + escHtml(fullUrl);

    resSec.classList.remove('hidden');
    resBody.textContent = 'Loading…';
    resBody.className = 'response';
    resBadge.classList.add('hidden');
    previewEl.innerHTML = '';
    previewEl.classList.add('hidden');

    setLoading(true);

    if (cur.rtype === 'audio') {
      fetchAudio(fetchPath);
    } else {
      fetchJson(fetchPath);
    }
  });

  function setLoading(on) {
    runBtn.disabled = on;
    btnLabel.textContent = on ? 'Running…' : 'Run';
    if (on) btnSpin.classList.remove('hidden');
    else btnSpin.classList.add('hidden');
  }

  function showBadge(status) {
    resBadge.textContent = status;
    resBadge.className = 'status-badge ' + (status >= 200 && status < 300 ? 'status-ok' : 'status-err');
    resBadge.classList.remove('hidden');
  }

  function fetchJson(path) {
    fetch(path).then(function(r) {
      showBadge(r.status);
      return r.json();
    }).then(function(json) {
      resBody.textContent = JSON.stringify(json, null, 2);
      if (json.success === false) resBody.classList.add('error-text');
      renderPreview(json);
    }).catch(function(e) {
      resBody.textContent = 'Network error: ' + e.message;
      resBody.classList.add('error-text');
    }).finally(function() { setLoading(false); });
  }

  function fetchAudio(path) {
    fetch(path).then(function(r) {
      showBadge(r.status);
      var ct = r.headers.get('content-type') || '';
      if (ct.indexOf('audio') !== -1) {
        return r.blob().then(function(blob) {
          resBody.textContent = r.status + ' OK — audio/' + ct.split('/').pop().split(';')[0];
          var url = URL.createObjectURL(blob);
          var audio = document.createElement('audio');
          audio.controls = true;
          audio.src = url;
          previewEl.innerHTML = '';
          previewEl.appendChild(audio);
          previewEl.classList.remove('hidden');
        });
      }
      return r.json().then(function(json) {
        resBody.textContent = JSON.stringify(json, null, 2);
        if (json.success === false) resBody.classList.add('error-text');
      });
    }).catch(function(e) {
      resBody.textContent = 'Network error: ' + e.message;
      resBody.classList.add('error-text');
    }).finally(function() { setLoading(false); });
  }

  function renderPreview(json) {
    if (!json || !json.success || !json.result) return;
    var r = json.result;

    if (cur.rtype === 'image' && r.download) {
      var img = document.createElement('img');
      img.src = r.download;
      img.alt = 'Preview';
      img.onerror = function() {
        var obj = document.createElement('object');
        obj.data = r.download;
        obj.type = 'image/svg+xml';
        obj.style.maxWidth = '100%';
        previewEl.innerHTML = '';
        previewEl.appendChild(obj);
      };
      previewEl.innerHTML = '';
      previewEl.appendChild(img);
      previewEl.classList.remove('hidden');
      return;
    }

    if (r.download) {
      var a = document.createElement('a');
      a.href = r.download;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Open download link →';
      previewEl.innerHTML = '';
      previewEl.appendChild(a);
      previewEl.classList.remove('hidden');
    }

    if (r.avatar_url) {
      var av = document.createElement('img');
      av.src = r.avatar_url;
      av.alt = 'Avatar';
      av.style.width = '80px';
      av.style.height = '80px';
      av.style.borderRadius = '50%';
      av.style.marginTop = '.5rem';
      previewEl.innerHTML = '';
      previewEl.appendChild(av);
      previewEl.classList.remove('hidden');
    }
  }

  function escHtml(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }
})();
</script>
</body>
</html>`;
}
