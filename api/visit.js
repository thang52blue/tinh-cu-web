module.exports = function handler(req, res) {
  const h = req.headers;
  const decode = (v) => (v ? decodeURIComponent(v) : "unknown");
  let referrer = "direct";
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    referrer = body.referrer || "direct";
  } catch {}

  console.log(
    JSON.stringify({
      event: "visit",
      time: new Date().toISOString(),
      country: decode(h["x-vercel-ip-country"]),
      region: decode(h["x-vercel-ip-country-region"]),
      city: decode(h["x-vercel-ip-city"]),
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      referrer,
      device: /mobile/i.test(h["user-agent"] || "") ? "mobile" : "desktop",
    }),
  );
  res.status(204).end();
}
