function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function generateWelcomeCard(name, group, pic, count) {
  if (!name) throw new Error('Name is required');

  const safeName = escapeXml(name);
  const safeGroup = escapeXml(group || 'the group');
  const memberText = count ? `You are member #${escapeXml(count)}` : '';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0c29"/>
      <stop offset="50%" style="stop-color:#302b63"/>
      <stop offset="100%" style="stop-color:#24243e"/>
    </linearGradient>
    ${pic ? '<clipPath id="clip"><circle cx="400" cy="100" r="60"/></clipPath>' : ''}
  </defs>
  <rect width="800" height="400" fill="url(#bg)" rx="16"/>
  <circle cx="400" cy="100" r="64" fill="none" stroke="#7c3aed" stroke-width="4"/>
  ${pic
    ? `<image href="${escapeXml(pic)}" x="340" y="40" width="120" height="120" clip-path="url(#clip)"/>`
    : `<circle cx="400" cy="100" r="60" fill="#7c3aed"/>
       <text x="400" y="118" text-anchor="middle" fill="#fff" font-size="44" font-family="Arial,sans-serif" font-weight="bold">${safeName.charAt(0).toUpperCase()}</text>`}
  <text x="400" y="210" text-anchor="middle" fill="#ffffff" font-size="32" font-family="Arial,sans-serif" font-weight="bold">Welcome, ${safeName}!</text>
  <text x="400" y="250" text-anchor="middle" fill="#a78bfa" font-size="20" font-family="Arial,sans-serif">${safeGroup}</text>
  <text x="400" y="290" text-anchor="middle" fill="#9ca3af" font-size="16" font-family="Arial,sans-serif">${memberText}</text>
</svg>`;

  return svg;
}
