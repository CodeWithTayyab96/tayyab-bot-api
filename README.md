# Tayyab Bot API

Free API for WhatsApp bots — downloads, AI chat, TTS, cards, image effects, tools & more. Built on Cloudflare Workers (free tier: 100K requests/day).

## Endpoints

### Downloads

| Endpoint | Description |
|---|---|
| `GET /api/download?url=&type=mp3\|mp4` | Universal downloader (YouTube, TikTok, Instagram, Facebook, X, Spotify) |
| `GET /api/download/ytaudio?url=` | YouTube audio (MP3) |
| `GET /api/download/ytmp4?url=` | YouTube video (MP4) |
| `GET /api/download/tiktok?url=` | TikTok video |
| `GET /api/download/spotify?url=` | Spotify track (via YouTube) |
| `GET /api/download/ytsearch?q=` | YouTube search (returns up to 10 results) |

### Cards

All card endpoints return SVG by default. Add `format=png` for PNG, `json=1` for hosted link.

| Endpoint | Description |
|---|---|
| `GET /api/card/welcome?name=&group=&pic=&count=` | Welcome card |
| `GET /api/card/goodbye?name=&group=&pic=&count=` | Goodbye card |
| `GET /api/card/rank?name=&level=&xp=&rank=` | Rank card with XP bar |
| `GET /api/card/quote?text=&author=` | Quote card |
| `GET /api/card/wanted?name=&pic=&reason=` | Wanted poster |
| `GET /api/card/jail?name=&pic=` | Jail card |

### Image Effects

All take `url=` (source image). Add `json=1` for hosted link.

| Endpoint | Description |
|---|---|
| `GET /api/img/blur?url=&amount=5` | Blur image |
| `GET /api/img/pixelate?url=&amount=8` | Pixelate image |
| `GET /api/img/grayscale?url=` | Grayscale image |
| `GET /api/img/circle?url=` | Circle crop (SVG clipPath) |
| `GET /api/img/upscale?url=&w=1024&h=` | Upscale / resize |
| `GET /api/img/meme?url=&top=&bottom=` | Meme text overlay |

### Tools

| Endpoint | Description |
|---|---|
| `GET /api/tools/calc?expr=2*(3+4)` | Safe arithmetic calculator |
| `GET /api/tools/country?name=Pakistan` | Country info (REST Countries) |
| `GET /api/tools/currency?from=USD&to=PKR&amount=1` | Currency converter (Frankfurter) |

### Fun & Social

| Endpoint | Description |
|---|---|
| `GET /api/fun/joke` | Random joke (JokeAPI, safe mode) |
| `GET /api/stalk/github?user=` | GitHub profile lookup |
| `GET /api/fake/tweet?name=&username=&text=` | Fake tweet card (SVG/PNG) |
| `GET /api/fake/ytcomment?name=&text=&likes=` | Fake YouTube comment card (SVG/PNG) |

### Religion

| Endpoint | Description |
|---|---|
| `GET /api/religion/bible?ref=John+3:16` | Bible verse (bible-api.com) |
| `GET /api/religion/quran?surah=1&ayah=1` | Quran ayah (AlQuran Cloud) |

### Lyrics

| Endpoint | Description |
|---|---|
| `GET /api/lyrics?artist=&title=` | Song lyrics (lyrics.ovh) |

### AI, TTS & QR

| Endpoint | Description |
|---|---|
| `GET /api/ai/chat?q=` | AI chat (Groq / llama-3.3-70b) |
| `GET /api/tts?text=&lang=` | Text to speech (Edge TTS, returns audio/mpeg) |
| `GET /api/qr?text=` | QR code (SVG/PNG, `json=1` for hosted link) |
| `GET /api/usage?apikey=` | Usage stats and limits |

All endpoints require `?apikey=KEY` or `X-API-Key` header.
Demo key: `tayyab`

## Run Locally

```bash
npm install
npx wrangler dev
```

Then test:
```bash
curl "http://localhost:8787/api/usage?apikey=tayyab"
curl "http://localhost:8787/api/qr?text=hello&apikey=tayyab" -o qr.svg
curl "http://localhost:8787/api/fun/joke?apikey=tayyab"
curl "http://localhost:8787/api/tools/calc?expr=2*(3%2B4)&apikey=tayyab"
```

## Deploy

```bash
npx wrangler deploy
```

## Secrets

Set these Worker secrets after deploying:

```bash
# Required for AI chat endpoint
echo "your-groq-api-key" | wrangler secret put AI_API_KEY

# Required for YouTube fallback (innertube) downloads
echo "your-po-token" | wrangler secret put PO_TOKEN
echo "your-visitor-data" | wrangler secret put VISITOR_DATA
```

## Rate Limits (Demo Key)

| Window | Limit |
|---|---|
| Per minute | 30 |
| Per hour | 300 |
| Per day | 3,000 |

## File Storage

Generated files (cards, QR codes, image effects) are stored in-memory per Worker instance and served from `/files/<id>.<ext>`. Files expire after 5 minutes (300 seconds). For the `json=1` mode, the response includes a `download` URL pointing to the temporary file. Without `json=1`, the binary is returned directly.

## PNG Rendering

Cards and QR endpoints support `format=png` for PNG output, powered by `@resvg/resvg-wasm`. SVG remains the default. If WASM initialization fails, the endpoint returns a 502 error.

## Free Tier Limits

- Cloudflare Workers: 100,000 requests/day
- YouTube: max 10 minutes, up to 720p
- TTS: max 200 characters
- AI chat: max 800 characters
