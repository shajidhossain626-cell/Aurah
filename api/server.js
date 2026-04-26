// AURAH — Vercel Serverless Compatible Server
const express = require("express");
const cors    = require("cors");
const fs      = require("fs");
const path    = require("path");
const multer  = require("multer");

const app = express();

// ── Paths ─────────────────────────────────────────────────
// On Vercel: write data to /tmp (only writable directory)
// Locally: write to /data folder
const IS_VERCEL  = !!process.env.VERCEL;
const DATA_DIR   = IS_VERCEL ? "/tmp/aurah-data" : path.join(__dirname, "../data");
const PUBLIC_DIR = path.join(__dirname, "../public");
const UPLOADS_DIR= IS_VERCEL ? "/tmp/aurah-uploads" : path.join(PUBLIC_DIR, "uploads");

// ── Ensure dirs exist ─────────────────────────────────────
[DATA_DIR, UPLOADS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ── Seed files into /tmp on first cold start ──────────────
const SEEDS = {
  "products.json":   path.join(__dirname, "../data/products.json"),
  "categories.json": path.join(__dirname, "../data/categories.json"),
  "settings.json":   path.join(__dirname, "../data/settings.json"),
  "homepage.json":   path.join(__dirname, "../data/homepage.json"),
  "orders.json":     path.join(__dirname, "../data/orders.json"),
};

// Copy seed files to /tmp if they don't exist yet
Object.entries(SEEDS).forEach(([name, src]) => {
  const dest = path.join(DATA_DIR, name);
  if (!fs.existsSync(dest)) {
    if (fs.existsSync(src)) {
      fs.writeFileSync(dest, fs.readFileSync(src));
    } else {
      // Fallback minimal data
      const defaults = {
        "orders.json": "[]",
        "categories.json": JSON.stringify([
          {id:"fashion",label:"Fashion",count:6},
          {id:"beauty",label:"Beauty",count:5},
          {id:"home",label:"Home",count:5}
        ]),
        "settings.json": JSON.stringify({
          storeName:"AURAH",tagline:"Curated for the discerning few.",
          accentColor:"#c9a85c",theme:"dark",fontPair:"cormorant",
          heroLayout:"split",cardRadius:0,
          email:"hello@aurahstudio.co",instagram:"@aurahstudio",
          currency:"USD",currencySymbol:"$",
          freeShippingThreshold:150,shippingCost:18
        }),
        "homepage.json": JSON.stringify({
          hero:{badge:"Spring Collection 2026",headline:"Dressed in Intention.",
            subtext:"Premium fashion, beauty, and home essentials.",
            ctaText:"Shop Collection",ctaSecondary:"Explore Lookbook"},
          marquee:["Free Shipping on $150+","·","New Arrivals Weekly","·","30-Day Returns","·"],
          testimonials:[]
        }),
      };
      if (defaults[name]) fs.writeFileSync(dest, defaults[name]);
    }
  }
});

// Seed products separately (uses seed-products.js)
const prodDest = path.join(DATA_DIR, "products.json");
if (!fs.existsSync(prodDest)) {
  try {
    const seedProds = require("./seed-products.js");
    fs.writeFileSync(prodDest, JSON.stringify(seedProds, null, 2));
  } catch(e) { fs.writeFileSync(prodDest, "[]"); }
}

// ── File helpers ──────────────────────────────────────────
const readJ  = f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8"));
const writeJ = (f, d) => fs.writeFileSync(path.join(DATA_DIR, f), JSON.stringify(d, null, 2));

// ── Auth ──────────────────────────────────────────────────
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "202553";
const auth = (req, res, next) => {
  const t = req.headers["x-admin-token"] || req.query.token;
  if (t !== ADMIN_TOKEN) return res.status(401).json({ error:"Unauthorized" });
  next();
};

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Image upload → /tmp ───────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOADS_DIR),
    filename:    (_, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ════════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════════
app.get("/api/products", (req, res) => {
  try {
    let p = readJ("products.json");
    if (req.query.collection) p = p.filter(x => x.collection === req.query.collection);
    if (req.query.featured === "true") p = p.filter(x => x.featured);
    res.json(p);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/products/:id", (req, res) => {
  try {
    const p = readJ("products.json").find(x => x.id === parseInt(req.params.id));
    p ? res.json(p) : res.status(404).json({ error:"Not found" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/categories", (_, res) => { try { res.json(readJ("categories.json")); } catch(e) { res.json([]); } });
app.get("/api/settings",   (_, res) => { try { res.json(readJ("settings.json")); }   catch(e) { res.json({}); } });
app.get("/api/homepage",   (_, res) => { try { res.json(readJ("homepage.json")); }   catch(e) { res.json({}); } });

app.post("/api/orders", (req, res) => {
  try {
    const orders = readJ("orders.json");
    const order  = { id:`ORD-${Date.now()}`, createdAt:new Date().toISOString(), status:"pending", ...req.body };
    orders.unshift(order);
    writeJ("orders.json", orders);
    res.json({ success:true, orderId:order.id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════
// ADMIN API
// ════════════════════════════════════════════════════════
app.post("/api/admin/login", (req, res) => {
  req.body.token === ADMIN_TOKEN
    ? res.json({ success:true })
    : res.status(401).json({ error:"Invalid token" });
});

// Products
app.get("/api/admin/products",     auth, (_, res) => { try { res.json(readJ("products.json")); } catch(e) { res.status(500).json({error:e.message}); } });
app.post("/api/admin/products",    auth, (req, res) => {
  try {
    const list = readJ("products.json");
    const item = { id: list.reduce((m,p) => Math.max(m, p.id||0), 0) + 1, ...req.body };
    list.push(item); writeJ("products.json", list); res.json(item);
  } catch(e) { res.status(500).json({error:e.message}); }
});
app.put("/api/admin/products/:id", auth, (req, res) => {
  try {
    const list = readJ("products.json");
    const i = list.findIndex(p => p.id === parseInt(req.params.id));
    if (i < 0) return res.status(404).json({error:"Not found"});
    list[i] = { ...list[i], ...req.body, id:list[i].id };
    writeJ("products.json", list); res.json(list[i]);
  } catch(e) { res.status(500).json({error:e.message}); }
});
app.delete("/api/admin/products/:id", auth, (req, res) => {
  try {
    writeJ("products.json", readJ("products.json").filter(p => p.id !== parseInt(req.params.id)));
    res.json({success:true});
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Upload — store in /tmp, return base64 data URL as fallback on Vercel
app.post("/api/admin/upload", auth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({error:"No file"});
    // Return as data URL so it works even on Vercel's ephemeral FS
    const data = fs.readFileSync(req.file.path);
    const base64 = data.toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    res.json({ url: `data:${mime};base64,${base64}` });
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Categories
app.get("/api/admin/categories",     auth, (_, res) => { try { res.json(readJ("categories.json")); } catch(e) { res.json([]); } });
app.post("/api/admin/categories",    auth, (req, res) => {
  try {
    const list = readJ("categories.json");
    const item = { id: req.body.id || req.body.label.toLowerCase().replace(/\s+/g,"-"), ...req.body, count:0 };
    list.push(item); writeJ("categories.json", list); res.json(item);
  } catch(e) { res.status(500).json({error:e.message}); }
});
app.put("/api/admin/categories/:id", auth, (req, res) => {
  try {
    const list = readJ("categories.json");
    const i = list.findIndex(c => c.id === req.params.id);
    if (i < 0) return res.status(404).json({error:"Not found"});
    list[i] = { ...list[i], ...req.body }; writeJ("categories.json", list); res.json(list[i]);
  } catch(e) { res.status(500).json({error:e.message}); }
});
app.delete("/api/admin/categories/:id", auth, (req, res) => {
  try {
    writeJ("categories.json", readJ("categories.json").filter(c => c.id !== req.params.id));
    res.json({success:true});
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Settings & Homepage
app.put("/api/admin/settings", auth, (req, res) => {
  try { const u={...readJ("settings.json"),...req.body}; writeJ("settings.json",u); res.json(u); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.put("/api/admin/homepage", auth, (req, res) => {
  try { const u={...readJ("homepage.json"),...req.body}; writeJ("homepage.json",u); res.json(u); }
  catch(e) { res.status(500).json({error:e.message}); }
});

// Orders
app.get("/api/admin/orders",     auth, (_, res) => { try { res.json(readJ("orders.json")); } catch(e) { res.json([]); } });
app.put("/api/admin/orders/:id", auth, (req, res) => {
  try {
    const list = readJ("orders.json");
    const i = list.findIndex(o => o.id === req.params.id);
    if (i < 0) return res.status(404).json({error:"Not found"});
    list[i] = { ...list[i], ...req.body }; writeJ("orders.json", list); res.json(list[i]);
  } catch(e) { res.status(500).json({error:e.message}); }
});

// ════════════════════════════════════════════════════════
// SERVE STATIC FILES
// ════════════════════════════════════════════════════════
const MIME = {
  ".html":"text/html;charset=utf-8",
  ".css":"text/css",
  ".js":"application/javascript",
  ".jsx":"application/javascript",
  ".json":"application/json",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".gif":"image/gif",
  ".svg":"image/svg+xml",
  ".ico":"image/x-icon",
  ".webp":"image/webp",
  ".woff":"font/woff",
  ".woff2":"font/woff2",
};

function sendFile(res, filePath) {
  if (!fs.existsSync(filePath)) return false;
  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  res.setHeader("Content-Type", mime);
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(fs.readFileSync(filePath));
  return true;
}

// Admin panel
app.get("/admin", (_, res) => {
  const f = path.join(PUBLIC_DIR, "admin", "index.html");
  if (!sendFile(res, f)) res.status(404).send("Admin panel not found");
});

// JS modules
app.get("/js/:file", (req, res) => {
  const f = path.join(PUBLIC_DIR, "js", path.basename(req.params.file));
  if (!sendFile(res, f)) res.status(404).send("Not found");
});

// Uploaded images (from /tmp on Vercel)
app.get("/uploads/:file", (req, res) => {
  const f = path.join(UPLOADS_DIR, path.basename(req.params.file));
  if (!sendFile(res, f)) res.status(404).send("Not found");
});

// Store index — everything else
app.get("*", (_, res) => {
  const f = path.join(PUBLIC_DIR, "index.html");
  if (!sendFile(res, f)) res.status(404).send("Store not found");
});

// ════════════════════════════════════════════════════════
// EXPORT for Vercel (no app.listen needed)
// For local dev, listen on PORT
// ════════════════════════════════════════════════════════
if (!IS_VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`AURAH running on http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin  token: ${ADMIN_TOKEN}`);
  });
}

module.exports = app;
