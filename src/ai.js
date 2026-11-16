export async function aiChat(query, env) {
  const apiKey = env.AI_API_KEY;
  if (!apiKey) {
    return { status: 503, error: 'AI is not configured yet' };
  }

  if (!query || query.length > 800) {
    return { status: 400, error: 'Query must be 1-800 characters' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant. Be concise and helpful.' },
          { role: 'user', content: query },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return { status: 502, error: `AI service error: ${res.status}` };
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return {
      status: 200,
      result: {
        reply,
        model: 'llama-3.3-70b-versatile',
        provider: 'groq',
      },
    };
  } catch (e) {
    if (e.name === 'AbortError') return { status: 504, error: 'AI request timed out' };
    return { status: 502, error: `AI service error: ${e.message}` };
  } finally {
    clearTimeout(timeout);
  }
}
