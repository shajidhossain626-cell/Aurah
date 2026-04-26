// AURAH — Express Server (Vercel compatible)
const express = require("express");
const cors    = require("cors");
const fs      = require("fs");
const path    = require("path");
const multer  = require("multer");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Paths ─────────────────────────────────────────────────
const ROOT       = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR   = path.join(ROOT, "data");
const UPLOADS_DIR= path.join(PUBLIC_DIR, "uploads");

const F = {
  products:   path.join(DATA_DIR, "products.json"),
  settings:   path.join(DATA_DIR, "settings.json"),
  orders:     path.join(DATA_DIR, "orders.json"),
  categories: path.join(DATA_DIR, "categories.json"),
  homepage:   path.join(DATA_DIR, "homepage.json"),
};

// ── Ensure dirs exist ────────────────────────────────────
[DATA_DIR, UPLOADS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ── Seed data ────────────────────────────────────────────
function seed(file, data) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

seed(F.products,   require("./seed-products.js"));
seed(F.categories, [
  { id:"fashion", label:"Fashion", count:6 },
  { id:"beauty",  label:"Beauty",  count:5 },
  { id:"home",    label:"Home",    count:5 },
]);
seed(F.settings, {
  storeName:"AURAH", tagline:"Curated for the discerning few.",
  accentColor:"#c9a85c", theme:"dark", fontPair:"cormorant",
  heroLayout:"split", cardRadius:0,
  email:"hello@aurahstudio.co", instagram:"@aurahstudio",
  currency:"USD", currencySymbol:"$",
  freeShippingThreshold:150, shippingCost:18,
});
seed(F.orders, []);
seed(F.homepage, {
  hero:{
    badge:"Spring Collection 2026",
    headline:"Dressed in Intention.",
    subtext:"Premium fashion, beauty, and home essentials — designed for those who choose quality over quantity.",
    ctaText:"Shop Collection", ctaSecondary:"Explore Lookbook",
  },
  marquee:["Free Shipping on $150+","·","New Arrivals Weekly","·","30-Day Returns","·","Sustainably Sourced","·"],
  testimonials:[
    {quote:"The wrap coat has completely redefined my wardrobe.",author:"Margaux D.",role:"Fashion Editor, Paris",rating:5,product:"Atelier Wrap Coat"},
    {quote:"The face oil is the only product I have repurchased more than three times.",author:"Charlotte H.",role:"Creative Director, London",rating:5,product:"Radiance Face Oil"},
  ],
});

// ── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── File helpers ─────────────────────────────────────────
const readJ  = f => JSON.parse(fs.readFileSync(f, "utf8"));
const writeJ = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// ── Auth ─────────────────────────────────────────────────
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "202553";
const auth = (req, res, next) => {
  const t = req.headers["x-admin-token"] || req.query.token;
  if (t !== ADMIN_TOKEN) return res.status(401).json({ error:"Unauthorized" });
  next();
};

// ── Image upload ─────────────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOADS_DIR),
    filename:    (_, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ════════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════════
app.get("/api/products", (req, res) => {
  let p = readJ(F.products);
  if (req.query.collection) p = p.filter(x => x.collection === req.query.collection);
  if (req.query.featured === "true") p = p.filter(x => x.featured);
  res.json(p);
});
app.get("/api/products/:id", (req, res) => {
  const p = readJ(F.products).find(x => x.id === parseInt(req.params.id));
  p ? res.json(p) : res.status(404).json({ error:"Not found" });
});
app.get("/api/categories", (_, res) => res.json(readJ(F.categories)));
app.get("/api/settings",   (_, res) => res.json(readJ(F.settings)));
app.get("/api/homepage",   (_, res) => res.json(readJ(F.homepage)));

app.post("/api/orders", (req, res) => {
  const orders = readJ(F.orders);
  const order  = { id:`ORD-${Date.now()}`, createdAt:new Date().toISOString(), status:"pending", ...req.body };
  orders.unshift(order);
  writeJ(F.orders, orders);
  res.json({ success:true, orderId:order.id });
});

// ════════════════════════════════════════════════════════
// ADMIN API
// ════════════════════════════════════════════════════════
app.post("/api/admin/login", (req, res) => {
  req.body.token === ADMIN_TOKEN
    ? res.json({ success:true })
    : res.status(401).json({ error:"Invalid token" });
});

// Products CRUD
app.get   ("/api/admin/products",     auth, (_, res) => res.json(readJ(F.products)));
app.post  ("/api/admin/products",     auth, (req, res) => {
  const list = readJ(F.products);
  const item = { id: list.reduce((m,p) => Math.max(m,p.id), 0) + 1, ...req.body };
  list.push(item); writeJ(F.products, list); res.json(item);
});
app.put   ("/api/admin/products/:id", auth, (req, res) => {
  const list = readJ(F.products);
  const i = list.findIndex(p => p.id === parseInt(req.params.id));
  if (i < 0) return res.status(404).json({ error:"Not found" });
  list[i] = { ...list[i], ...req.body, id:list[i].id };
  writeJ(F.products, list); res.json(list[i]);
});
app.delete("/api/admin/products/:id", auth, (req, res) => {
  writeJ(F.products, readJ(F.products).filter(p => p.id !== parseInt(req.params.id)));
  res.json({ success:true });
});

// Image upload
app.post("/api/admin/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error:"No file" });
  res.json({ url:`/uploads/${req.file.filename}` });
});

// Categories CRUD
app.get   ("/api/admin/categories",     auth, (_, res) => res.json(readJ(F.categories)));
app.post  ("/api/admin/categories",     auth, (req, res) => {
  const list = readJ(F.categories);
  const item = { id: req.body.id || req.body.label.toLowerCase().replace(/\s+/g,"-"), ...req.body, count:0 };
  list.push(item); writeJ(F.categories, list); res.json(item);
});
app.put   ("/api/admin/categories/:id", auth, (req, res) => {
  const list = readJ(F.categories);
  const i = list.findIndex(c => c.id === req.params.id);
  if (i < 0) return res.status(404).json({ error:"Not found" });
  list[i] = { ...list[i], ...req.body }; writeJ(F.categories, list); res.json(list[i]);
});
app.delete("/api/admin/categories/:id", auth, (req, res) => {
  writeJ(F.categories, readJ(F.categories).filter(c => c.id !== req.params.id));
  res.json({ success:true });
});

// Settings & Homepage
app.put("/api/admin/settings", auth, (req, res) => {
  const u = { ...readJ(F.settings), ...req.body }; writeJ(F.settings, u); res.json(u);
});
app.put("/api/admin/homepage", auth, (req, res) => {
  const u = { ...readJ(F.homepage), ...req.body }; writeJ(F.homepage, u); res.json(u);
});

// Orders
app.get("/api/admin/orders",     auth, (_, res) => res.json(readJ(F.orders)));
app.put("/api/admin/orders/:id", auth, (req, res) => {
  const list = readJ(F.orders);
  const i = list.findIndex(o => o.id === req.params.id);
  if (i < 0) return res.status(404).json({ error:"Not found" });
  list[i] = { ...list[i], ...req.body }; writeJ(F.orders, list); res.json(list[i]);
});

// ════════════════════════════════════════════════════════
// SERVE STATIC FILES — admin panel, JS modules, uploads
// ════════════════════════════════════════════════════════
// Mime types
const MIME = {
  ".html":"text/html", ".css":"text/css", ".js":"application/javascript",
  ".jsx":"application/javascript", ".json":"application/json",
  ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg",
  ".gif":"image/gif", ".svg":"image/svg+xml", ".ico":"image/x-icon",
  ".webp":"image/webp", ".woff":"font/woff", ".woff2":"font/woff2",
};

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath)) return false;
  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  res.setHeader("Content-Type", mime);
  res.send(fs.readFileSync(filePath));
  return true;
}

// Admin panel
app.get("/admin", (_, res) => {
  serveFile(res, path.join(PUBLIC_DIR, "admin", "index.html"));
});

// Static assets (JS modules, uploads, etc.)
app.get("/js/:file", (req, res) => {
  if (!serveFile(res, path.join(PUBLIC_DIR, "js", req.params.file))) {
    res.status(404).send("Not found");
  }
});
app.get("/uploads/:file", (req, res) => {
  if (!serveFile(res, path.join(UPLOADS_DIR, req.params.file))) {
    res.status(404).send("Not found");
  }
});

// Store — catch all → index.html
app.get("*", (_, res) => {
  serveFile(res, path.join(PUBLIC_DIR, "index.html"));
});

// ════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`AURAH running on http://localhost:${PORT}`);
  console.log(`Admin:  http://localhost:${PORT}/admin  token: ${ADMIN_TOKEN}`);
});

module.exports = app;
