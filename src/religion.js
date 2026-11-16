const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export async function bibleVerse(ref) {
  const res = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}`, {
    headers: { 'User-Agent': BROWSER_UA },
  });
  if (!res.ok) throw new Error('Bible API failed: ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return {
    reference: data.reference,
    text: data.text?.trim(),
    translation_name: data.translation_name,
  };
}

export async function quranAyah(surah, ayah) {
  const s = parseInt(surah) || 1;
  const a = parseInt(ayah) || 1;
  const res = await fetch(`https://api.alquran.cloud/v1/ayah/${s}:${a}/en.asad`, {
    headers: { 'User-Agent': BROWSER_UA },
  });
  if (!res.ok) throw new Error('Quran API failed: ' + res.status);
  const data = await res.json();
  if (data.code !== 200) throw new Error('Quran API error');
  const d = data.data;
  return {
    surah: d.surah?.number,
    ayah: d.numberInSurah,
    text: d.text,
    surah_name: d.surah?.englishName,
  };
}
