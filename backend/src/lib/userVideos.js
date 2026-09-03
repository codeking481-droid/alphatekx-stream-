// REMOVED: Bearer token YouTube call (requires youtube.readonly). Use API KEY channel fetch instead.
export async function fetchUserVideos(channelId, _accessToken) {
  // No-op stub: personalization now via history + API KEY feed, not OAuth channel videos.
  // Keep for backward compat — returns empty so caller falls back to API KEY feed.
  return [];
}
