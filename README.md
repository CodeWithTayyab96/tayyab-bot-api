# Tayyab Bot API

Free API for WhatsApp bots — downloads, AI chat, TTS, welcome cards, QR codes and more. Built on Cloudflare Workers (free tier: 100K requests/day).

## Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/download?url=&type=mp3\|mp4` | Universal downloader (YouTube, TikTok, Instagram, Facebook, X, Spotify) |
| `GET /api/download/ytaudio?url=` | YouTube audio (MP3) |
| `GET /api/download/ytmp4?url=` | YouTube video (MP4) |
| `GET /api/download/tiktok?url=` | TikTok video |
| `GET /api/card/welcome?name=&group=&pic=&count=` | Welcome card (SVG, or JSON with `json=1`) |
| `GET /api/ai/chat?q=` | AI chat (Groq / llama-3.3-70b) |
| `GET /api/tts?text=&lang=` | Text to speech (Edge TTS, returns audio/mpeg) |
| `GET /api/qr?text=` | QR code (SVG, or JSON with `json=1`) |
| `GET /api/usage?apikey=` | Usage stats and limits |

All endpoints require `?apikey=KEY` or `X-API-Key` header.
Demo key: `tayyab`

## YouTube Downloads

YouTube downloads use two paths:

1. **SaveTube (primary)** — Calls the SaveTube CDN for a direct download link. No API key needed.
2. **Innertube + PO Token (fallback)** — When SaveTube fails, calls YouTube's innertube player API directly with a PO (Proof of Origin) token. Requires `PO_TOKEN` and `VISITOR_DATA` Worker secrets.

## Run Locally

```bash
npm install
npx wrangler dev
```

Then test:
```bash
curl "http://localhost:8787/api/usage?apikey=tayyab"
curl "http://localhost:8787/api/qr?text=hello&apikey=tayyab" -o qr.png
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

To generate a fresh PO token:
```bash
node scripts/refresh-potoken.js
```

## Rate Limits (Demo Key)

| Window | Limit |
|---|---|
| Per minute | 30 |
| Per hour | 300 |
| Per day | 3,000 |

## File Storage

Generated files (welcome cards, QR codes) are stored in-memory per Worker instance and served from `/files/<id>.<ext>`. Files expire after 5 minutes (300 seconds). For the `json=1` mode, the response includes a `download` URL pointing to the temporary file. Without `json=1`, the binary is returned directly in the response.

## Free Tier Limits

- Cloudflare Workers: 100,000 requests/day
- YouTube: max 10 minutes, up to 720p
- TTS: max 200 characters
- AI chat: max 800 characters
