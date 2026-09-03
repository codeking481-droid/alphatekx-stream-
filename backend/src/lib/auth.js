export function getAuthUrl(origin) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const redirectUri = process.env.REDIRECT_URI || (origin ? `${origin}/api/auth/callback` : "");
  if (!clientId) throw new Error("GOOGLE_OAUTH_NOT_CONFIGURED: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
  if (!redirectUri) throw new Error("REDIRECT_URI not configured: Set REDIRECT_URI to https://your-domain.com/api/auth/callback and add it to Google Cloud Console > Credentials > Authorized redirect URIs");
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl',
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

async function getChannelInfo(accessToken) {
  if (!accessToken) return null;
  try {
    const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) {
      console.warn("[auth] channel fetch non-ok:", res.status, await res.text().catch(()=> ""));
      return null;
    }
    const data = await res.json();
    return data.items?.[0] || null;
  } catch (e) {
    console.warn("[auth] channel fetch exception:", e?.message || e);
    return null;
  }
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

  const channel = await getChannelInfo(tokens.access_token);

  // Also fetch userinfo for fallback name/avatar when user has no YouTube channel
  let fallbackName = "Alphatekx User";
  let fallbackAvatar = `https://ui-avatars.com/api/?name=Alphatekx&background=FFD700&color=000&size=200&bold=true`;
  try {
    const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (userRes.ok) {
      const info = await userRes.json();
      fallbackName = info.name || fallbackName;
      if (info.picture) fallbackAvatar = info.picture;
    }
  } catch {}

  const user = {
    channelId: channel?.id || `yt_${Date.now()}`,
    channelName: channel?.snippet?.title || fallbackName,
    channelAvatar: channel?.snippet?.thumbnails?.default?.url || channel?.snippet?.thumbnails?.high?.url || fallbackAvatar,
    email: "",
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || "",
    expiresAt: new Date(Date.now() + (tokens.expires_in || 3600) * 1000)
  };
  // Try to get email from userinfo if available
  try {
    const r = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (r.ok) { const j = await r.json(); if (j.email) user.email = j.email; }
  } catch {}

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
