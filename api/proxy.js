export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const id = req.query.channelId || "";
  const url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + id;
  const r = await fetch(url);
  const text = await r.text();
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=300");
  res.status(200).send(text);
}
