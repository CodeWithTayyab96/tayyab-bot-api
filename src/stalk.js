const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export async function githubStalk(user) {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('GitHub API failed: ' + res.status);
  const d = await res.json();
  return {
    login: d.login,
    name: d.name,
    bio: d.bio,
    followers: d.followers,
    following: d.following,
    public_repos: d.public_repos,
    avatar_url: d.avatar_url,
    html_url: d.html_url,
    created_at: d.created_at,
  };
}
