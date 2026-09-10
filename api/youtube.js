const YOUTUBE_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return res.status(503).json({
      error: 'YouTube API is not configured.',
      setup: 'Add YOUTUBE_API_KEY in Vercel Project Settings → Environment Variables, then redeploy.'
    });
  }

  const q = String(req.query?.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Search query is required.' });
  if (q.length > 120) return res.status(400).json({ error: 'Search query is too long.' });

  const params = new URLSearchParams({
    part: 'snippet',
    q,
    type: 'video',
    videoCategoryId: '10',
    maxResults: '12',
    regionCode: 'IN',
    relevanceLanguage: 'en',
    safeSearch: 'moderate',
    key
  });

  try {
    const response = await fetch(`${YOUTUBE_ENDPOINT}?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'YouTube API request failed.',
        details: data?.error?.errors || undefined
      });
    }

    const items = (data.items || []).map(item => ({
      id: item.id?.videoId,
      title: item.snippet?.title || 'Untitled',
      channel: item.snippet?.channelTitle || 'YouTube',
      description: item.snippet?.description || '',
      publishedAt: item.snippet?.publishedAt || null,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || null,
      url: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : null
    })).filter(item => item.id);

    return res.status(200).json({
      query: q,
      count: items.length,
      items
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to reach YouTube.', message: error.message });
  }
};
