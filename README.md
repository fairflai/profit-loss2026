# FAIRFLAI 2026 — Dashboard live su Vercel

Dashboard economica FAIRFLAI che legge Monday in tempo reale tramite una serverless function proxy
(il token Monday resta lato server, mai nel browser).

## Struttura
```
index.html        # la dashboard (chiama /api/monday)
api/monday.js     # serverless function: proxy verso https://api.monday.com/v2
```

## Deploy via GitHub (Vercel eredita dalla repo)
1. **Crea un token API Monday**: Monday → Avatar → *Developers* → *My Access Tokens* (o Admin → API).
   Serve accesso in lettura ai board 18393547205, 18392429015, 4719214179, 18393547203.
2. **Push su GitHub**: metti questi file nella root della repo collegata a Vercel
   (`index.html` in root, `api/monday.js` nella cartella `api/`) e fai commit/push.
3. **Env var su Vercel** (una volta sola): progetto Vercel → *Settings → Environment Variables* →
   `MONDAY_TOKEN` = *(il tuo token)* → Save. Al primo deploy con la variabile fai un Redeploy.

Da lì in poi ogni push su GitHub ridistribuisce in automatico. Zero-config: Vercel serve `index.html`
come statico e `api/monday.js` come funzione. Il proxy mette in cache la risposta ~30 min (modificabile in `api/monday.js`).

## Note
- Nessuna dipendenza npm: `api/monday.js` usa `fetch` nativo (Vercel Node 18+).
- Assunzioni fisse: sales fee 15%, costo lavoro 40% del netto ordini. Profit sharing = campi
  modificabili nella pagina (salvati nel browser del singolo utente, default €7.000/mese da agosto).
- Perimetro = Delivery Package con Micro Enterprise = FAIRFLAI. Se un DP nuovo in un progetto
  FAIRFLAI non ha la ME impostata, resta fuori: usare la skill `fairflai-check` per individuarli.
- Per limitare l'accesso puoi proteggere il deployment con Vercel Authentication (Settings → Deployment Protection).
