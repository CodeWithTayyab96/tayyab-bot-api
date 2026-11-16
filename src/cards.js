function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && (line.length + 1 + word.length) > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function renderLines(lines, x, startY, lineHeight, attrs) {
  return lines.map((line, i) =>
    `<text x="${x}" y="${startY + i * lineHeight}" ${attrs}>${escapeXml(line)}</text>`
  ).join('\n  ');
}

export function generateGoodbyeCard(name, group, pic, count) {
  const safeName = escapeXml(name);
  const safeGroup = escapeXml(group || 'the group');
  const memberText = count ? `Only ${escapeXml(count)} members remain` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="50%" style="stop-color:#3d1f5c"/>
      <stop offset="100%" style="stop-color:#2d1b4e"/>
    </linearGradient>
    ${pic ? '<clipPath id="clip"><circle cx="400" cy="100" r="60"/></clipPath>' : ''}
  </defs>
  <rect width="800" height="400" fill="url(#bg)" rx="16"/>
  <circle cx="400" cy="100" r="64" fill="none" stroke="#ef4444" stroke-width="4"/>
  ${pic
    ? `<image href="${escapeXml(pic)}" x="340" y="40" width="120" height="120" clip-path="url(#clip)"/>`
    : `<circle cx="400" cy="100" r="60" fill="#ef4444"/>
       <text x="400" y="118" text-anchor="middle" fill="#fff" font-size="44" font-family="Arial,sans-serif" font-weight="bold">${safeName.charAt(0).toUpperCase()}</text>`}
  <text x="400" y="210" text-anchor="middle" fill="#ffffff" font-size="32" font-family="Arial,sans-serif" font-weight="bold">Goodbye, ${safeName}!</text>
  <text x="400" y="250" text-anchor="middle" fill="#f87171" font-size="20" font-family="Arial,sans-serif">We will miss you in ${safeGroup}</text>
  <text x="400" y="290" text-anchor="middle" fill="#9ca3af" font-size="16" font-family="Arial,sans-serif">${memberText}</text>
</svg>`;
}

export function generateRankCard(name, level, xp, rank) {
  const safeName = escapeXml(name);
  const safeLevel = escapeXml(level || '1');
  const safeRank = escapeXml(rank || '?');
  const xpNum = parseInt(xp) || 0;
  const xpMax = Math.ceil((xpNum + 100) / 500) * 500;
  const progress = Math.min(xpNum / xpMax, 1);
  const barWidth = 500;
  const filledWidth = Math.round(barWidth * progress);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0c29"/>
      <stop offset="50%" style="stop-color:#1a1a4e"/>
      <stop offset="100%" style="stop-color:#24243e"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)" rx="16"/>
  <circle cx="120" cy="130" r="64" fill="none" stroke="#3b82f6" stroke-width="4"/>
  <circle cx="120" cy="130" r="60" fill="#3b82f6" opacity="0.3"/>
  <text x="120" y="148" text-anchor="middle" fill="#fff" font-size="44" font-family="Arial,sans-serif" font-weight="bold">${safeName.charAt(0).toUpperCase()}</text>
  <text x="220" y="100" fill="#ffffff" font-size="28" font-family="Arial,sans-serif" font-weight="bold">${safeName}</text>
  <text x="220" y="135" fill="#94a3b8" font-size="18" font-family="Arial,sans-serif">Level ${safeLevel}</text>
  <text x="700" y="100" text-anchor="end" fill="#fbbf24" font-size="22" font-family="Arial,sans-serif" font-weight="bold">Rank #${safeRank}</text>
  <rect x="150" y="220" width="${barWidth}" height="30" rx="15" fill="#1e293b"/>
  <rect x="150" y="220" width="${filledWidth}" height="30" rx="15" fill="url(#bar)"/>
  <text x="400" y="242" text-anchor="middle" fill="#fff" font-size="14" font-family="Arial,sans-serif" font-weight="bold">${xpNum} / ${xpMax} XP</text>
  <text x="400" y="310" text-anchor="middle" fill="#64748b" font-size="16" font-family="Arial,sans-serif">Keep chatting to level up!</text>
</svg>`;
}

export function generateQuoteCard(text, author) {
  const lines = wrapText(text || '', 40);
  const safeAuthor = escapeXml(author || 'Unknown');
  const textStartY = 140;
  const lineHeight = 34;
  const textContent = renderLines(lines, 400, textStartY, lineHeight,
    'text-anchor="middle" fill="#ffffff" font-size="26" font-family="Georgia,serif" font-style="italic"');
  const authorY = textStartY + lines.length * lineHeight + 40;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#064e3b"/>
      <stop offset="50%" style="stop-color:#065f46"/>
      <stop offset="100%" style="stop-color:#0f3d2e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)" rx="16"/>
  <text x="80" y="110" fill="#10b981" font-size="80" font-family="Georgia,serif" opacity="0.4">“</text>
  ${textContent}
  <text x="400" y="${Math.min(authorY, 360)}" text-anchor="middle" fill="#6ee7b7" font-size="20" font-family="Arial,sans-serif">— ${safeAuthor}</text>
</svg>`;
}

export function generateWantedCard(name, pic, reason) {
  const safeName = escapeXml(name || 'Unknown');
  const safeReason = escapeXml(reason || 'Being too awesome');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#78350f"/>
      <stop offset="100%" style="stop-color:#451a03"/>
    </linearGradient>
    ${pic ? '<clipPath id="clip"><circle cx="400" cy="175" r="60"/></clipPath>' : ''}
  </defs>
  <rect width="800" height="400" fill="url(#bg)" rx="16"/>
  <rect x="30" y="10" width="740" height="380" fill="none" stroke="#92400e" stroke-width="4" stroke-dasharray="12,6" rx="12"/>
  <text x="400" y="60" text-anchor="middle" fill="#fbbf24" font-size="48" font-family="Impact,Arial Black,sans-serif" font-weight="bold" letter-spacing="8">WANTED</text>
  <text x="400" y="90" text-anchor="middle" fill="#d97706" font-size="16" font-family="Arial,sans-serif">DEAD OR ALIVE</text>
  <circle cx="400" cy="175" r="64" fill="none" stroke="#f59e0b" stroke-width="3"/>
  ${pic
    ? `<image href="${escapeXml(pic)}" x="340" y="115" width="120" height="120" clip-path="url(#clip)"/>`
    : `<circle cx="400" cy="175" r="60" fill="#92400e"/>
       <text x="400" y="193" text-anchor="middle" fill="#fbbf24" font-size="44" font-family="Arial,sans-serif" font-weight="bold">${safeName.charAt(0).toUpperCase()}</text>`}
  <text x="400" y="280" text-anchor="middle" fill="#ffffff" font-size="28" font-family="Arial,sans-serif" font-weight="bold">${safeName}</text>
  <text x="400" y="320" text-anchor="middle" fill="#fcd34d" font-size="18" font-family="Arial,sans-serif">Reason: ${safeReason}</text>
  <text x="400" y="365" text-anchor="middle" fill="#d97706" font-size="22" font-family="Impact,Arial Black,sans-serif" letter-spacing="2">REWARD: $1,000,000</text>
</svg>`;
}

export function generateJailCard(name, pic) {
  const safeName = escapeXml(name || 'Unknown');

  const bars = Array.from({ length: 9 }, (_, i) => {
    const x = 60 + i * 85;
    return `<rect x="${x}" y="0" width="8" height="400" fill="#6b7280" opacity="0.85" rx="4"/>`;
  }).join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111827"/>
      <stop offset="100%" style="stop-color:#1f2937"/>
    </linearGradient>
    ${pic ? '<clipPath id="clip"><circle cx="400" cy="150" r="70"/></clipPath>' : ''}
  </defs>
  <rect width="800" height="400" fill="url(#bg)" rx="16"/>
  <circle cx="400" cy="150" r="74" fill="none" stroke="#4b5563" stroke-width="4"/>
  ${pic
    ? `<image href="${escapeXml(pic)}" x="330" y="80" width="140" height="140" clip-path="url(#clip)"/>`
    : `<circle cx="400" cy="150" r="70" fill="#374151"/>
       <text x="400" y="170" text-anchor="middle" fill="#9ca3af" font-size="50" font-family="Arial,sans-serif" font-weight="bold">${safeName.charAt(0).toUpperCase()}</text>`}
  <text x="400" y="280" text-anchor="middle" fill="#ffffff" font-size="28" font-family="Arial,sans-serif" font-weight="bold">${safeName}</text>
  <text x="400" y="320" text-anchor="middle" fill="#ef4444" font-size="24" font-family="Impact,Arial Black,sans-serif" letter-spacing="6">JAILED</text>
  ${bars}
  <rect x="0" y="180" width="800" height="8" fill="#6b7280" opacity="0.85" rx="4"/>
</svg>`;
}

export function generateFakeTweetCard(name, username, text) {
  const safeName = escapeXml(name || 'User');
  const safeUsername = escapeXml(username || 'user');
  const lines = wrapText(text || '', 50);
  const lineHeight = 24;
  const textContent = renderLines(lines, 90, 140, lineHeight,
    'fill="#e7e9ea" font-size="18" font-family="Arial,sans-serif"');
  const cardHeight = Math.max(250, 160 + lines.length * lineHeight + 60);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${cardHeight}" viewBox="0 0 800 ${cardHeight}">
  <rect width="800" height="${cardHeight}" fill="#15202b" rx="16"/>
  <circle cx="55" cy="70" r="25" fill="#1d9bf0"/>
  <text x="55" y="78" text-anchor="middle" fill="#fff" font-size="22" font-family="Arial,sans-serif" font-weight="bold">${safeName.charAt(0).toUpperCase()}</text>
  <text x="90" y="62" fill="#e7e9ea" font-size="18" font-family="Arial,sans-serif" font-weight="bold">${safeName}</text>
  <text x="90" y="85" fill="#71767b" font-size="16" font-family="Arial,sans-serif">@${safeUsername}</text>
  ${textContent}
  <line x1="30" y1="${cardHeight - 50}" x2="770" y2="${cardHeight - 50}" stroke="#2f3336" stroke-width="1"/>
  <text x="90" y="${cardHeight - 22}" fill="#71767b" font-size="14" font-family="Arial,sans-serif">❤️ 0  🔁 0  💬 0</text>
</svg>`;
}

export function generateFakeYtCommentCard(name, text, likes) {
  const safeName = escapeXml(name || 'User');
  const safeLikes = escapeXml(likes || '0');
  const lines = wrapText(text || '', 55);
  const lineHeight = 22;
  const textContent = renderLines(lines, 80, 110, lineHeight,
    'fill="#f1f1f1" font-size="16" font-family="Arial,sans-serif"');
  const cardHeight = Math.max(200, 120 + lines.length * lineHeight + 50);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${cardHeight}" viewBox="0 0 800 ${cardHeight}">
  <rect width="800" height="${cardHeight}" fill="#0f0f0f" rx="16"/>
  <circle cx="45" cy="65" r="20" fill="#cc0000"/>
  <text x="45" y="73" text-anchor="middle" fill="#fff" font-size="18" font-family="Arial,sans-serif" font-weight="bold">${safeName.charAt(0).toUpperCase()}</text>
  <text x="80" y="60" fill="#aaaaaa" font-size="15" font-family="Arial,sans-serif" font-weight="bold">${safeName}</text>
  <text x="80" y="80" fill="#717171" font-size="13" font-family="Arial,sans-serif">just now</text>
  ${textContent}
  <text x="80" y="${cardHeight - 20}" fill="#aaaaaa" font-size="14" font-family="Arial,sans-serif">👍 ${safeLikes}   👎</text>
</svg>`;
}
