# AURAH Store — Setup Guide

## 🔑 Quick Access

| | URL | Token |
|---|---|---|
| **Store** | `your-site.vercel.app` | — |
| **Admin Panel** | `your-site.vercel.app/admin` | `202553` |

---

## ⚠️ IMPORTANT — Read This First

Your admin panel changes (products, orders, settings) need a place to be **saved**. There are two modes:

### Mode 1: Temporary Storage (default, no setup)
Works immediately but **resets every ~30 minutes of inactivity** (Vercel cold starts wipe it). Good for testing only.

### Mode 2: Persistent Storage (recommended — 2 minute setup)
Your changes save **permanently**. Do this once:

1. Go to your **Vercel Dashboard** → your project
2. Click the **Storage** tab
3. Click **Create Database** → choose **KV** (powered by Redis)
4. Give it a name, click **Create**
5. Click **Connect to Project** → select this project → **Connect**
6. Vercel automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` env variables
7. Go to **Deployments** → redeploy your latest deployment

That's it. Open `/admin` — the top bar will show a **green "✓ Persistent" badge** once it's working.

---

## 📁 Project Structure

```
aurah/
├── api/
│   ├── server.js          ← Express backend (KV + file storage)
│   └── seed-products.js   ← Initial product catalog
├── data/                   ← Seed JSON files (used only as fallback)
├── public/
│   ├── index.html          ← Storefront
│   ├── admin/index.html    ← Admin panel
│   ├── js/                 ← React store modules
│   └── uploads/
├── vercel.json
└── package.json
```

---

## 🚀 Deploy Steps

```bash
git add .
git commit -m "update store"
git push
```

In Vercel → Settings → Environment Variables, make sure you have:

| Key | Value |
|---|---|
| `ADMIN_TOKEN` | `202553` (or your own secret) |

(KV variables are auto-added when you connect a KV database — see above.)

Then: Vercel → Deployments → latest → **⋯** → **Redeploy**

---

## 💻 Local Development

```bash
npm install
npm start
```
- Store: http://localhost:3001
- Admin: http://localhost:3001/admin (token: `202553`)

Locally, data is always saved to `data/*.json` files directly — no KV needed for local testing.

---

## 🛠️ Admin Panel Features

- **Dashboard** — revenue, profit, recent orders
- **Revenue & Profit** — cost price vs sell price margin analysis, monthly charts
- **Products** — add/edit/delete, image upload, sizes, colors, cost & sell price
- **Categories** — add/edit/delete collections
- **Orders** — view, filter by status, update status, see profit per order
- **Homepage Editor** — hero text, marquee, testimonials
- **Settings** — store name, colors, theme, shipping — plus the storage status indicator

---

## 🆘 Troubleshooting

**"Invalid token"** → Check `ADMIN_TOKEN` in Vercel matches what you type in `/admin`

**Changes disappear after a while** → You're on Temporary Storage. Follow the KV setup above.

**500 error / function crashed** → Check Vercel → your project → Logs for the exact error message

**Admin panel shows blank page** → Hard refresh (Ctrl+Shift+R), check browser console for errors
