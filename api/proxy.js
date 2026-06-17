export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const channelId = req.query.channelId || "";
  if (!channelId) {
    return res.status(400).json({ error: "Missing channelId" });
  }

  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(url, {
      headers: {
        "Accept": "application/xml, text/xml, */*",
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "YouTube fetch failed" });
    }

    const text = await response.text();
    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).send(text);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
