// AURAH — Node.js/Express Backend
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Paths ─────────────────────────────────────────────────
const DATA_DIR    = path.join(__dirname, "../data");
const PRODUCTS_FILE  = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE  = path.join(DATA_DIR, "settings.json");
const ORDERS_FILE    = path.join(DATA_DIR, "orders.json");
const CATEGORIES_FILE= path.join(DATA_DIR, "categories.json");
const HOMEPAGE_FILE  = path.join(DATA_DIR, "homepage.json");
const PUBLIC_DIR  = path.join(__dirname, "../public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");

// ── Ensure dirs & seed data ───────────────────────────────
if (!fs.existsSync(DATA_DIR))    fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function seedIfMissing(file, defaultData) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
  }
}

seedIfMissing(PRODUCTS_FILE,   require("./seed-products.js"));
seedIfMissing(CATEGORIES_FILE, [
  { id: "fashion", label: "Fashion", count: 6 },
  { id: "beauty",  label: "Beauty",  count: 5 },
  { id: "home",    label: "Home",    count: 5 },
]);
seedIfMissing(SETTINGS_FILE, {
  storeName: "AURAH", tagline: "Curated for the discerning few.",
  accentColor: "#c9a85c", theme: "dark", fontPair: "cormorant",
  heroLayout: "split", cardRadius: 0,
  email: "hello@aurahstudio.co", instagram: "@aurahstudio",
  currency: "USD", currencySymbol: "$",
  freeShippingThreshold: 150, shippingCost: 18,
});
seedIfMissing(ORDERS_FILE, []);
seedIfMissing(HOMEPAGE_FILE, {
  hero: {
    badge: "Spring Collection 2026",
    headline: "Dressed in Intention.",
    subtext: "Premium fashion, beauty, and home essentials — designed for those who choose quality over quantity.",
    ctaText: "Shop Collection", ctaSecondary: "Explore Lookbook",
  },
  marquee: ["Free Shipping on $150+","·","New Arrivals Weekly","·","30-Day Returns","·","Sustainably Sourced","·","Handcrafted Quality","·"],
  testimonials: [
    { quote: "The wrap coat has completely redefined my wardrobe.", author: "Margaux D.", role: "Fashion Editor, Paris", rating: 5, product: "Atelier Wrap Coat" },
    { quote: "The face oil is the only product I've repurchased more than three times.", author: "Charlotte H.", role: "Creative Director, London", rating: 5, product: "Radiance Face Oil" },
  ],
});

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Serve static files ────────────────────────────────────
app.use(express.static(PUBLIC_DIR));

// ── Image upload ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Helpers ───────────────────────────────────────────────
const readJSON  = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ── Admin Auth ────────────────────────────────────────────
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "aurah-admin-secret-2026";

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"] || req.query.token;
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// ═══════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════
app.get("/api/products", (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const { collection, featured } = req.query;
  let result = products;
  if (collection) result = result.filter(p => p.collection === collection);
  if (featured === "true") result = result.filter(p => p.featured);
  res.json(result);
});

app.get("/api/products/:id", (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

app.get("/api/categories", (req, res) => res.json(readJSON(CATEGORIES_FILE)));
app.get("/api/settings",   (req, res) => res.json(readJSON(SETTINGS_FILE)));
app.get("/api/homepage",   (req, res) => res.json(readJSON(HOMEPAGE_FILE)));

app.post("/api/orders", (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const newOrder = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    ...req.body,
  };
  orders.unshift(newOrder);
  writeJSON(ORDERS_FILE, orders);
  res.json({ success: true, orderId: newOrder.id });
});

// ═══════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════
app.post("/api/admin/login", (req, res) => {
  const { token } = req.body;
  if (token === ADMIN_TOKEN) res.json({ success: true });
  else res.status(401).json({ error: "Invalid token" });
});

// Products
app.get("/api/admin/products",    requireAdmin, (req, res) => res.json(readJSON(PRODUCTS_FILE)));
app.post("/api/admin/products",   requireAdmin, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
  const product = { id: maxId + 1, ...req.body };
  products.push(product);
  writeJSON(PRODUCTS_FILE, products);
  res.json(product);
});
app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  writeJSON(PRODUCTS_FILE, products);
  res.json(products[idx]);
});
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  writeJSON(PRODUCTS_FILE, products.filter(p => p.id !== parseInt(req.params.id)));
  res.json({ success: true });
});

// Image upload
app.post("/api/admin/upload", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Categories
app.get("/api/admin/categories",    requireAdmin, (req, res) => res.json(readJSON(CATEGORIES_FILE)));
app.post("/api/admin/categories",   requireAdmin, (req, res) => {
  const cats = readJSON(CATEGORIES_FILE);
  const cat = { id: (req.body.id || req.body.label.toLowerCase().replace(/\s+/g, "-")), ...req.body, count: 0 };
  cats.push(cat);
  writeJSON(CATEGORIES_FILE, cats);
  res.json(cat);
});
app.put("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const cats = readJSON(CATEGORIES_FILE);
  const idx = cats.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  cats[idx] = { ...cats[idx], ...req.body };
  writeJSON(CATEGORIES_FILE, cats);
  res.json(cats[idx]);
});
app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  writeJSON(CATEGORIES_FILE, readJSON(CATEGORIES_FILE).filter(c => c.id !== req.params.id));
  res.json({ success: true });
});

// Settings
app.put("/api/admin/settings", requireAdmin, (req, res) => {
  const updated = { ...readJSON(SETTINGS_FILE), ...req.body };
  writeJSON(SETTINGS_FILE, updated);
  res.json(updated);
});

// Homepage
app.put("/api/admin/homepage", requireAdmin, (req, res) => {
  const updated = { ...readJSON(HOMEPAGE_FILE), ...req.body };
  writeJSON(HOMEPAGE_FILE, updated);
  res.json(updated);
});

// Orders
app.get("/api/admin/orders",    requireAdmin, (req, res) => res.json(readJSON(ORDERS_FILE)));
app.put("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  orders[idx] = { ...orders[idx], ...req.body };
  writeJSON(ORDERS_FILE, orders);
  res.json(orders[idx]);
});

// ── Admin panel HTML ──────────────────────────────────────
app.get("/admin", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "admin", "index.html"));
});

// ── SPA fallback ──────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AURAH running on http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  console.log(`Token: ${ADMIN_TOKEN}`);
});
