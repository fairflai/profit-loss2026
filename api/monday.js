// Vercel serverless function — proxy verso l'API Monday.
// Il token resta lato server (variabile d'ambiente MONDAY_TOKEN), mai nel browser.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Usa POST" });
    return;
  }
  const token = process.env.MONDAY_TOKEN;
  if (!token) {
    res.status(500).json({ error: "MONDAY_TOKEN non configurato su Vercel" });
    return;
  }
  try {
    const { query, variables } = req.body || {};
    if (!query) { res.status(400).json({ error: "query mancante" }); return; }
    const r = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
        "API-Version": "2024-10",
      },
      body: JSON.stringify({ query, variables: variables || {} }),
    });
    const j = await r.json();
    // cache leggera lato CDN (30 min) per non martellare Monday
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json(j);
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
}
