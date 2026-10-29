import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "visits.json");

async function loadVisits() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const visits = await loadVisits();
    return res.status(200).json(visits);
  }

  const h = req.headers;
  const decode = (v) => (v ? decodeURIComponent(v) : "unknown");
  let referrer = "direct";
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    referrer = body.referrer || "direct";
  } catch {}

  const entry = {
    time: new Date().toISOString(),
    country: decode(h["x-vercel-ip-country"]),
    region: decode(h["x-vercel-ip-country-region"]),
    city: decode(h["x-vercel-ip-city"]),
    lat: body.lat ?? null,
    lng: body.lng ?? null,
    referrer,
    device: /mobile/i.test(h["user-agent"] || "") ? "mobile" : "desktop",
  };

  console.log(JSON.stringify({ event: "visit", ...entry }));

  const visits = await loadVisits();
  visits.push(entry);
  await writeFile(DATA_FILE, JSON.stringify(visits, null, 2)).catch(() => {});

  res.status(204).end();
}
