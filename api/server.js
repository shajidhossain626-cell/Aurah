// AURAH Store — Express Server (Vercel Serverless Compatible)
// Uses Vercel KV for persistent storage when available, JSON files locally.
"use strict";
const express = require("express");
const cors    = require("cors");
const fs      = require("fs");
const path    = require("path");
const multer  = require("multer");

const app = express();

// ─────────────────────────────────────────────────────────
// STORAGE LAYER — abstracts KV (persistent) vs files (local/fallback)
// ─────────────────────────────────────────────────────────
const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
let kv = null;
if (HAS_KV) {
  try { kv = require("@vercel/kv").kv; }
  catch (e) { console.warn("KV package not available, falling back to files"); }
}

const IS_VERCEL  = !!process.env.VERCEL;
const ROOT       = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const SEED_DIR   = path.join(ROOT, "data");
const DATA_DIR   = IS_VERCEL ? "/tmp/aurah" : SEED_DIR;
const UPLOAD_DIR = IS_VERCEL ? "/tmp/aurah-up" : path.join(PUBLIC_DIR, "uploads");

[DATA_DIR, UPLOAD_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const FILES = ["products.json","categories.json","settings.json","homepage.json","orders.json"];
const DEFAULTS = {
  "orders.json": [],
  "categories.json": [
    {id:"fashion",label:"Fashion",count:6},
    {id:"beauty",label:"Beauty",count:5},
    {id:"home",label:"Home",count:5}
  ],
  "settings.json": {
    storeName:"AURAH",tagline:"Curated for the discerning few.",
    accentColor:"#c9a85c",theme:"dark",fontPair:"cormorant",
    heroLayout:"split",cardRadius:0,
    email:"hello@aurahstudio.co",instagram:"@aurahstudio",
    currencySymbol:"$",freeShippingThreshold:150,shippingCost:18
  },
  "homepage.json": {
    hero:{badge:"Spring Collection 2026",headline:"Dressed in Intention.",
      subtext:"Premium fashion, beauty, and home essentials — designed for those who choose quality over quantity.",
      ctaText:"Shop Collection",ctaSecondary:"Explore Lookbook"},
    marquee:["Free Shipping on $150+","·","New Arrivals Weekly","·","30-Day Returns","·"],
    testimonials:[]
  },
  "products.json": [],
};

// Seed local file fallback (used when no KV)
FILES.forEach(name => {
  const dest = path.join(DATA_DIR, name);
  if (fs.existsSync(dest)) return;
  const src = path.join(SEED_DIR, name);
  if (fs.existsSync(src)) fs.writeFileSync(dest, fs.readFileSync(src));
  else fs.writeFileSync(dest, JSON.stringify(DEFAULTS[name], null, 2));
});
try {
  const existing = JSON.parse(fs.readFileSync(path.join(DATA_DIR,"products.json"),"utf8"));
  if (existing.length === 0) {
    const seeds = require("./seed-products.js");
    fs.writeFileSync(path.join(DATA_DIR,"products.json"), JSON.stringify(seeds,null,2));
  }
} catch(e) {}

// ── Unified read/write: KV when available, else local file ──
async function readData(name) {
  const key = "aurah:" + name;
  if (kv) {
    try {
      const v = await kv.get(key);
      if (v !== null && v !== undefined) return v;
      let seedVal;
      if (name === "products.json") {
        try { seedVal = require("./seed-products.js"); } catch(e) { seedVal = []; }
      } else {
        seedVal = DEFAULTS[name];
      }
      await kv.set(key, seedVal);
      return seedVal;
    } catch(e) {
      console.error("KV read error, falling back to file:", e.message);
    }
  }
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), "utf8")); }
  catch(e) { return DEFAULTS[name] || []; }
}

async function writeData(name, data) {
  const key = "aurah:" + name;
  if (kv) {
    try { await kv.set(key, data); return; }
    catch(e) { console.error("KV write error, falling back to file:", e.message); }
  }
  fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "202553";
const auth = (req, res, next) => {
  const t = req.headers["x-admin-token"] || req.query.token;
  if (t !== ADMIN_TOKEN) return res.status(401).json({ error: "Unauthorized" });
  next();
};

// ─────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ─────────────────────────────────────────────────────────
// IMAGE UPLOAD — returns base64 data URL (works regardless of storage backend)
// ─────────────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// ─────────────────────────────────────────────────────────
// MIME TYPES & STATIC FILE SENDER
// ─────────────────────────────────────────────────────────
const MIME = {
  ".html":"text/html;charset=utf-8",".css":"text/css",
  ".js":"application/javascript",".jsx":"application/javascript",
  ".json":"application/json",".png":"image/png",
  ".jpg":"image/jpeg",".jpeg":"image/jpeg",".gif":"image/gif",
  ".svg":"image/svg+xml",".ico":"image/x-icon",".webp":"image/webp",
  ".woff":"font/woff",".woff2":"font/woff2",
};
function sendStatic(res, filePath) {
  if (!fs.existsSync(filePath)) return false;
  const mime = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  res.setHeader("Content-Type", mime);
  res.setHeader("Cache-Control", "public,max-age=3600");
  res.send(fs.readFileSync(filePath));
  return true;
}

// ═════════════════════════════════════════════════════════
// PUBLIC API
// ═════════════════════════════════════════════════════════
app.get("/api/storage-status", async (_, res) => {
  res.json({ persistent: !!kv, backend: kv ? "Vercel KV" : "Local file (resets on cold start)" });
});

app.get("/api/products", async (req, res) => {
  try {
    let p = await readData("products.json");
    if (!Array.isArray(p)) p = [];
    if (req.query.collection) p = p.filter(x => x.collection === req.query.collection);
    if (req.query.featured === "true") p = p.filter(x => x.featured);
    res.json(p);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const list = await readData("products.json");
    const p = list.find(x => x.id === parseInt(req.params.id));
    p ? res.json(p) : res.status(404).json({ error: "Not found" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/categories", async (_, res) => { try { res.json(await readData("categories.json")); } catch(e) { res.json([]); } });
app.get("/api/settings",   async (_, res) => { try { res.json(await readData("settings.json")); }   catch(e) { res.json({}); } });
app.get("/api/homepage",   async (_, res) => { try { res.json(await readData("homepage.json")); }   catch(e) { res.json({}); } });

app.post("/api/orders", async (req, res) => {
  try {
    const orders = (await readData("orders.json")) || [];
    const products = (await readData("products.json")) || [];
    let totalCost = 0;
    (req.body.items || []).forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod && prod.costPrice) totalCost += prod.costPrice * item.qty;
    });
    const order = { id:`ORD-${Date.now()}`, createdAt:new Date().toISOString(), status:"pending", totalCost: totalCost||null, ...req.body };
    orders.unshift(order);
    await writeData("orders.json", orders);
    res.json({ success: true, orderId: order.id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ═════════════════════════════════════════════════════════
// ADMIN API
// ═════════════════════════════════════════════════════════
app.post("/api/admin/login", (req, res) => {
  req.body.token === ADMIN_TOKEN ? res.json({ success: true }) : res.status(401).json({ error: "Invalid token" });
});

// ── Products ──
app.get("/api/admin/products", auth, async (_, res) => {
  try { res.json(await readData("products.json")); } catch(e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/admin/products", auth, async (req, res) => {
  try {
    const list = (await readData("products.json")) || [];
    const newId = list.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
    const item = { id: newId, ...req.body };
    list.push(item);
    await writeData("products.json", list);
    res.json(item);
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/admin/products/:id", auth, async (req, res) => {
  try {
    const list = (await readData("products.json")) || [];
    const id = parseInt(req.params.id);
    const i = list.findIndex(p => p.id === id);
    if (i < 0) return res.status(404).json({ error: "Not found" });
    list[i] = { ...list[i], ...req.body, id: list[i].id };
    await writeData("products.json", list);
    res.json(list[i]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/admin/products/:id", auth, async (req, res) => {
  try {
    const list = (await readData("products.json")) || [];
    await writeData("products.json", list.filter(p => p.id !== parseInt(req.params.id)));
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Image upload (base64, storage-backend agnostic) ──
app.post("/api/admin/upload", auth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const b64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    res.json({ url: `data:${mime};base64,${b64}` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Categories ──
app.get("/api/admin/categories", auth, async (_, res) => { try { res.json(await readData("categories.json")); } catch(e) { res.json([]); } });
app.post("/api/admin/categories", auth, async (req, res) => {
  try {
    const list = (await readData("categories.json")) || [];
    const item = { id: req.body.id || req.body.label.toLowerCase().replace(/\s+/g, "-"), label: req.body.label, count: 0 };
    list.push(item);
    await writeData("categories.json", list);
    res.json(item);
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/admin/categories/:id", auth, async (req, res) => {
  try {
    const list = (await readData("categories.json")) || [];
    const i = list.findIndex(c => c.id === req.params.id);
    if (i < 0) return res.status(404).json({ error: "Not found" });
    list[i] = { ...list[i], ...req.body };
    await writeData("categories.json", list);
    res.json(list[i]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/admin/categories/:id", auth, async (req, res) => {
  try {
    const list = (await readData("categories.json")) || [];
    await writeData("categories.json", list.filter(c => c.id !== req.params.id));
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Settings ──
app.put("/api/admin/settings", auth, async (req, res) => {
  try {
    const updated = { ...((await readData("settings.json"))||{}), ...req.body };
    await writeData("settings.json", updated);
    res.json(updated);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Homepage ──
app.put("/api/admin/homepage", auth, async (req, res) => {
  try {
    const updated = { ...((await readData("homepage.json"))||{}), ...req.body };
    await writeData("homepage.json", updated);
    res.json(updated);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Orders ──
app.get("/api/admin/orders", auth, async (_, res) => { try { res.json((await readData("orders.json"))||[]); } catch(e) { res.json([]); } });
app.put("/api/admin/orders/:id", auth, async (req, res) => {
  try {
    const list = (await readData("orders.json")) || [];
    const i = list.findIndex(o => o.id === req.params.id);
    if (i < 0) return res.status(404).json({ error: "Not found" });
    list[i] = { ...list[i], ...req.body };
    await writeData("orders.json", list);
    res.json(list[i]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ═════════════════════════════════════════════════════════
// STATIC FILES
// ═════════════════════════════════════════════════════════
app.get("/admin", (_, res) => {
  if (!sendStatic(res, path.join(PUBLIC_DIR, "admin", "index.html"))) res.status(404).send("Admin panel not found");
});
app.get("/js/:file", (req, res) => {
  const safe = path.basename(req.params.file);
  if (!sendStatic(res, path.join(PUBLIC_DIR, "js", safe))) res.status(404).send("JS file not found: " + safe);
});
app.get("/uploads/:file", (req, res) => {
  const safe = path.basename(req.params.file);
  if (!sendStatic(res, path.join(UPLOAD_DIR, safe))) res.status(404).send("File not found");
});
app.get("*", (_, res) => {
  if (!sendStatic(res, path.join(PUBLIC_DIR, "index.html"))) res.status(500).send("Store index not found");
});

// ─────────────────────────────────────────────────────────
if (!IS_VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`\n🟡 AURAH running → http://localhost:${PORT}`);
    console.log(`🔐 Admin panel  → http://localhost:${PORT}/admin`);
    console.log(`🔑 Admin token  → ${ADMIN_TOKEN}`);
    console.log(`💾 Storage      → ${kv ? "Vercel KV (persistent)" : "Local files (data/*.json)"}\n`);
  });
}

module.exports = app;
