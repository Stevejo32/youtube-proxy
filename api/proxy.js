import https from "https";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const channelId = req.query.channelId || "";
  if (!channelId) return res.status(400).json({ error: "Missing channelId" });

  const options = {
    hostname: "www.youtube.com",
    path: `/feeds/videos.xml?channel_id=${channelId}`,
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Referer": "https://www.youtube.com/",
      "Cache-Control": "no-cache",
    },
  };

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => { data += chunk; });
    response.on("end", () => {
      if (response.statusCode !== 200) {
        return res.status(502).json({ error: `YouTube returned ${response.statusCode}` });
      }
      res.setHeader("Content-Type", "text/xml; charset=utf-8");
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
      res.status(200).send(data);
    });
  });

  request.on("error", (err) => {
    res.status(502).json({ error: err.message });
  });

  request.end();
}
