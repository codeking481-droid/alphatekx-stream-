export function getAuthUrl(origin) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const redirectUri = process.env.REDIRECT_URI || (origin ? `${origin}/api/auth/callback` : "");
  if (!clientId) throw new Error("GOOGLE_OAUTH_NOT_CONFIGURED: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
  if (!redirectUri) throw new Error("REDIRECT_URI not configured: Set REDIRECT_URI to https://your-domain.com/api/auth/callback and add it to Google Cloud Console > Credentials > Authorized redirect URIs");
  // PRODUCTION: Google Sign-Up only — no YouTube scopes
  const scopes = [
    'openid',
    'email',
    'profile'
  ];
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent'
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
  const redirectUri = process.env.REDIRECT_URI || "";
  if (!redirectUri) throw new Error("REDIRECT_URI not configured");
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || `Token exchange failed: HTTP ${res.status}`);
  }
  return data;
}

async function getChannelInfo(_accessToken) {
  // REMOVED: youtube.readonly channel fetch via Bearer (mine=true) — not needed for Google Sign-Up only
  // Keep stub for compatibility — always returns null, user profile comes from userinfo
  return null;
}

function generateSessionToken() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function handleCallback(code) {
  if (!code) throw new Error("Missing code");
  const tokens = await exchangeCodeForTokens(code);
  if (tokens.error) throw new Error(tokens.error_description || tokens.error);
  if (!tokens.access_token) throw new Error("No access_token from Google");

  // Fetch userinfo via OIDC — NO YouTube Bearer calls
  let fallbackName = "Alphatekx User";
  let fallbackAvatar = `https://ui-avatars.com/api/?name=Alphatekx&background=FFD700&color=000&size=200&bold=true`;
  let email = "";
  let sub = "";
  try {
    const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (userRes.ok) {
      const info = await userRes.json();
      fallbackName = info.name || fallbackName;
      if (info.picture) fallbackAvatar = info.picture;
      if (info.email) email = info.email;
      if (info.sub) sub = info.sub;
    }
  } catch (e) { console.warn("[auth] userinfo fetch failed", e); }

  const user = {
    channelId: sub || `google_${Date.now()}`,
    channelName: fallbackName,
    channelAvatar: fallbackAvatar,
    email,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || "",
    expiresAt: new Date(Date.now() + (tokens.expires_in || 3600) * 1000)
  };

  const sessionToken = generateSessionToken();
  await storeUser(user);
  await storeSession(user.channelId, sessionToken);
  // also keep copy for lookup
  const map = (globalThis).__authUsers || ((globalThis).__authUsers = new Map());
  map.set(sessionToken, user);
  return sessionToken;
}

async function storeUser(user) {
  const map = (globalThis).__authUsers || ((globalThis).__authUsers = new Map());
  map.set(user.channelId, user);
  return user;
}

async function storeSession(userId, token) {
  const map = (globalThis).__authSessions || ((globalThis).__authSessions = new Map());
  map.set(token, userId);
  return { userId, token };
}
