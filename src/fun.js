const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export async function fetchJoke() {
  const res = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode', {
    headers: { 'User-Agent': BROWSER_UA },
  });
  if (!res.ok) throw new Error('Joke API failed');
  const data = await res.json();
  if (data.error) throw new Error('Joke API error');
  return {
    category: data.category,
    type: data.type,
    joke: data.type === 'twopart' ? `${data.setup}\n\n${data.delivery}` : data.joke,
    ...(data.type === 'twopart' ? { setup: data.setup, delivery: data.delivery } : {}),
  };
}
