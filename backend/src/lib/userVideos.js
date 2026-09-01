export async function fetchUserVideos(channelId, accessToken) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet,id&channelId=${channelId}&maxResults=20&order=date&type=video`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  return (data.items || []).map(item => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt
  }));
}
