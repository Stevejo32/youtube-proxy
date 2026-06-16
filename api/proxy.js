export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const channelId = req.query.channelId;
  if (!channelId) {
    return res.status(400).json({ error: 'Missing channelId' });
  }

  const rssUrl =
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error(`YouTube returned ${response.status}`);
    const xml = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
