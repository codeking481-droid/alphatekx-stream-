export function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ];
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=${scopes.join(' ')}`;
}

async function exchangeCodeForTokens(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });
  return res.json();
}

async function getChannelInfo(accessToken) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  return data.items?.[0];
}

function generateSessionToken() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export async function handleCallback(code) {
  const tokens = await exchangeCodeForTokens(code);
  const channel = await getChannelInfo(tokens.access_token);

  const user = {
    channelId: channel.id,
    channelName: channel.snippet.title,
    channelAvatar: channel.snippet.thumbnails?.default?.url || '',
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000)
  };

  const sessionToken = generateSessionToken();
  await storeUser(user);
  await storeSession(user.channelId, sessionToken);
  return sessionToken;
}

async function storeUser(user) {
  // D1 / DB placeholder
  return user;
}

async function storeSession(userId, token) {
  // D1 / DB placeholder
  return { userId, token };
}
