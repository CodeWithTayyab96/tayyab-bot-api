const VOICES = {
  en: 'en-US-AriaNeural',
  ur: 'ur-PK-AsadNeural',
  hi: 'hi-IN-MadhurNeural',
  ar: 'ar-SA-HamedNeural',
  es: 'es-ES-AlvaroNeural',
  fr: 'fr-FR-HenriNeural',
  de: 'de-DE-ConradNeural',
  pt: 'pt-BR-AntonioNeural',
  ja: 'ja-JP-KeitaNeural',
  ko: 'ko-KR-InJoonNeural',
  zh: 'zh-CN-YunxiNeural',
  ru: 'ru-RU-DmitryNeural',
  tr: 'tr-TR-AhmetNeural',
};

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function textToSpeech(text, lang) {
  if (!text || text.length > 200) {
    throw new Error('Text must be 1-200 characters');
  }

  lang = lang || 'en';
  const voice = VOICES[lang] || VOICES.en;

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'><voice name='${voice}'>${escapeXml(text)}</voice></speak>`;

  const tokenRes = await fetch(
    'https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ url: 'https://edge.microsoft.com', serverId: 'default' }),
    }
  );

  let ttsUrl = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
  let authToken;

  if (tokenRes.ok) {
    const tokenData = await tokenRes.json();
    if (tokenData.e) ttsUrl = `${tokenData.e}/cognitiveservices/v1`;
    authToken = tokenData.t;
  }

  const headers = {
    'Content-Type': 'application/ssml+xml',
    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(ttsUrl, {
    method: 'POST',
    headers,
    body: ssml,
  });

  if (!res.ok) {
    const fallbackRes = await fetch(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
    );
    if (!fallbackRes.ok) throw new Error('TTS failed');
    return new Response(fallbackRes.body, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  }

  return new Response(res.body, {
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
