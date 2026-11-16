export async function generateQrSvg(text) {
  if (!text) throw new Error('Text is required');

  const size = 400;
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=svg&data=${encodeURIComponent(text)}`;

  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!res.ok) throw new Error('QR generation failed');

  return await res.text();
}
