export async function getUser() {
  try {
    const res = await fetch('/api/auth/user', { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAuthUrl() {
  const res = await fetch('/api/auth/url');
  const data = await res.json();
  return data.url;
}

export function logout() {
  window.location.href = '/api/auth/logout';
}
