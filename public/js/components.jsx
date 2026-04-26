// AURA — Shared UI Components

// ── Icons ────────────────────────────────────────────────
const Icons = {
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Bag: ({count}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  Heart: ({filled}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  ArrowRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  ArrowLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6"/></svg>,
  Star: ({filled}) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Gift: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
  Truck: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  Tag: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Instagram: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
};

// ── Button ────────────────────────────────────────────────
function Button({ children, variant = "primary", size = "md", onClick, style, className, disabled }) {
  const { tweaks } = window.__appContext || {};
  const accent = tweaks?.accentColor || "#c9a85c";

  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "8px", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", letterSpacing: "0.08em", textTransform: "uppercase",
    transition: "all 0.25s ease", border: "none", opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { padding: "10px 20px", fontSize: "10px" },
    md: { padding: "14px 32px", fontSize: "11px" },
    lg: { padding: "18px 48px", fontSize: "12px" },
  };
  const variants = {
    primary: { background: accent, color: "#0c0b09", fontWeight: 600 },
    secondary: { background: "transparent", color: "inherit", border: `1px solid currentColor`, fontWeight: 500 },
    ghost: { background: "transparent", color: "inherit", fontWeight: 500, padding: sizes[size]?.padding, letterSpacing: "0.08em" },
    dark: { background: "#0c0b09", color: "#f7f3ec", fontWeight: 500 },
  };

  const [hovered, setHovered] = React.useState(false);
  const hoverStyles = variant === "primary"
    ? { filter: "brightness(1.1)", transform: "translateY(-1px)" }
    : variant === "secondary"
    ? { background: "rgba(201,168,92,0.08)" }
    : {};

  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...(hovered && !disabled ? hoverStyles : {}), ...style }}
      className={className}
    >{children}</button>
  );
}

// ── Back Button ───────────────────────────────────────────
function BackButton({ onNavigate, to = "home", label = "Back", theme }) {
  const isDark = theme === "dark";
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={() => onNavigate(to)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "none", border: "none", cursor: "pointer",
        color: "inherit", fontFamily: "inherit",
        fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
        opacity: hovered ? 1 : 0.5,
        transition: "opacity 0.2s, transform 0.2s",
        transform: hovered ? "translateX(-3px)" : "translateX(0)",
        padding: "0",
      }}
    >
      <Icons.ArrowLeft />
      {label}
    </button>
  );
}


function StarRating({ rating, reviews }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ display: "flex", gap: "2px", color: "#c9a85c" }}>
        {[1,2,3,4,5].map(i => <Icons.Star key={i} filled={i <= Math.round(rating)} />)}
      </div>
      <span style={{ fontSize: "12px", opacity: 0.5 }}>({reviews})</span>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────
function Badge({ label }) {
  if (!label) return null;
  const colors = {
    "Bestseller": { bg: "#c9a85c", color: "#0c0b09" },
    "New": { bg: "#2a3a2a", color: "#8bc98b" },
    "Low Stock": { bg: "#3a1a1a", color: "#c98b8b" },
    "Editor's Pick": { bg: "#1a1a3a", color: "#8b9bc9" },
    "Gift Ready": { bg: "#3a2a1a", color: "#c9a85c" },
    "Handcrafted": { bg: "#2a2a1a", color: "#c9c08b" },
    "Sale": { bg: "#3a1a1a", color: "#e87070" },
  };
  const c = colors[label] || { bg: "#2a2a2a", color: "#f7f3ec" };
  return (
    <span style={{
      display: "inline-block", padding: "4px 10px", fontSize: "9px",
      letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
      background: c.bg, color: c.color, borderRadius: "2px",
    }}>{label}</span>
  );
}

// ── 3D Product Card ───────────────────────────────────────
function ProductCard({ product, onNavigate, onAddToCart, onToggleWishlist, wishlistIds, theme }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = React.useState(false);
  const cardRef = React.useRef();
  const isDark = theme === "dark";
  const isWished = wishlistIds?.includes(product.id);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        cursor: "pointer", position: "relative",
        transform: hovered ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-4px)` : "perspective(800px) rotateX(0) rotateY(0)",
        transition: hovered ? "transform 0.1s ease" : "transform 0.5s ease",
        filter: hovered ? "drop-shadow(0 20px 40px rgba(0,0,0,0.25))" : "drop-shadow(0 4px 12px rgba(0,0,0,0.12))",
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", background: isDark ? "#161410" : "#f0ece4" }}
        onClick={() => onNavigate("product", { productId: product.id })}>
        <ProductImage type={product.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* Badge */}
        {product.badge && (
          <div style={{ position: "absolute", top: "12px", left: "12px" }}>
            <Badge label={product.badge} />
          </div>
        )}
        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          style={{
            position: "absolute", top: "12px", right: "12px",
            width: "36px", height: "36px", borderRadius: "50%",
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isWished ? "#c9a85c" : "#fff", transition: "all 0.2s",
          }}
        ><Icons.Heart filled={isWished} /></button>
        {/* Quick add overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease",
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product, product.sizes[0], product.colors[0]?.name); }}
            style={{
              width: "100%", padding: "11px", background: "#c9a85c", color: "#0c0b09",
              border: "none", cursor: "pointer", fontSize: "10px", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600, fontFamily: "inherit",
            }}
          >Quick Add</button>
        </div>
      </div>
      {/* Info */}
      <div style={{ paddingTop: "14px" }} onClick={() => onNavigate("product", { productId: product.id })}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, marginBottom: "3px" }}>{product.name}</p>
            <p style={{ fontSize: "11px", opacity: 0.45, marginBottom: "8px" }}>{product.subtitle}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#c9a85c" }}>${product.price}</p>
            {product.originalPrice && (
              <p style={{ fontSize: "11px", opacity: 0.4, textDecoration: "line-through" }}>${product.originalPrice}</p>
            )}
          </div>
        </div>
        {/* Color dots */}
        {product.colors.length > 0 && (
          <div style={{ display: "flex", gap: "6px" }}>
            {product.colors.map(c => (
              <div key={c.name} title={c.name} style={{
                width: "10px", height: "10px", borderRadius: "50%", background: c.hex,
                border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────
function Nav({ page, onNavigate, cartCount, wishlistCount, theme, onToggleTheme, onOpenCart }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const isDark = theme === "dark";

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navBg = scrolled || page !== "home"
    ? isDark ? "rgba(12,11,9,0.95)" : "rgba(247,243,236,0.95)"
    : "transparent";

  const links = [
    { label: "Shop All", page: "collection" },
    { label: "Fashion", page: "collection", params: { filter: "fashion" } },
    { label: "Beauty", page: "collection", params: { filter: "beauty" } },
    { label: "Home", page: "collection", params: { filter: "home" } },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg, backdropFilter: scrolled || page !== "home" ? "blur(20px)" : "none",
        borderBottom: scrolled || page !== "home" ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` : "none",
        transition: "all 0.35s ease",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(16px,4vw,32px)", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", letterSpacing: "0.18em", fontWeight: 500 }}>AURAH</span>
          </button>
          {/* Desktop Links */}
          <div style={{ display: "flex", gap: "36px" }} className="hide-mobile">
            {links.map(l => (
              <button key={l.label} onClick={() => onNavigate(l.page, l.params)}
                style={{
                  background: "none", border: "none", cursor: "pointer", color: "inherit",
                  fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                  opacity: 0.7, fontFamily: "inherit", transition: "opacity 0.2s",
                  padding: "4px 0",
                }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.7}
              >{l.label}</button>
            ))}
          </div>
          {/* Right Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button onClick={onToggleTheme} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7, display: "flex", alignItems: "center" }}>
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button onClick={() => onNavigate("wishlist")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7, position: "relative", display: "flex", alignItems: "center" }}>
              <Icons.Heart />
              {wishlistCount > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#c9a85c", color: "#0c0b09", fontSize: "9px", fontWeight: 700, width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{wishlistCount}</span>}
            </button>
            <button onClick={onOpenCart} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7, position: "relative", display: "flex", alignItems: "center" }}>
              <Icons.Bag />
              {cartCount > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#c9a85c", color: "#0c0b09", fontSize: "9px", fontWeight: 700, width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
            <button className="show-mobile" onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "none" }}>
              <Icons.Menu />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: isDark ? "#0c0b09" : "#f7f3ec",
          display: "flex", flexDirection: "column", padding: "24px 32px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", letterSpacing: "0.18em" }}>AURAH</span>
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}><Icons.X /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {links.map(l => (
              <button key={l.label} onClick={() => { onNavigate(l.page, l.params); setMenuOpen(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", textAlign: "left", fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400, letterSpacing: "0.05em" }}
              >{l.label}</button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Footer ────────────────────────────────────────────────
function Footer({ theme, onNavigate }) {
  const isDark = theme === "dark";
  return (
    <footer style={{
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      padding: "80px 32px 40px",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "64px" }} className="footer-grid">
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", letterSpacing: "0.18em", marginBottom: "16px" }}>AURAH</div>
            <p style={{ fontSize: "13px", lineHeight: "1.8", opacity: 0.5, maxWidth: "260px" }}>Curated essentials for a considered life. Each piece selected for quality, longevity, and quiet beauty.</p>
            <div style={{ marginTop: "24px", opacity: 0.5 }}><Icons.Instagram /></div>
          </div>
          {[
            { title: "Shop", links: ["Fashion", "Beauty", "Home", "New Arrivals", "Sale"] },
            { title: "Help", links: ["Sizing Guide", "Shipping & Returns", "Track Order", "Contact Us", "FAQs"] },
            { title: "Brand", links: ["About Aurah", "Sustainability", "Press", "Careers", "Stockists"] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, marginBottom: "20px", color: "#c9a85c" }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.links.map(l => (
                  <button key={l} onClick={() => onNavigate("collection")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", textAlign: "left", fontSize: "12px", opacity: 0.5, letterSpacing: "0.04em", fontFamily: "inherit", transition: "opacity 0.2s", padding: 0 }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.5}
                  >{l}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "11px", opacity: 0.35 }}>© 2026 Aurah Studio. All rights reserved.</p>
          <p style={{ fontSize: "11px", opacity: 0.35 }}>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  );
}

// ── Trust Badges ──────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: <Icons.Truck />, label: "Free Shipping", sub: "on orders over $150" },
    { icon: <Icons.Shield />, label: "Secure Checkout", sub: "256-bit encryption" },
    { icon: <Icons.Refresh />, label: "30-Day Returns", sub: "no questions asked" },
    { icon: <Icons.Gift />, label: "Gift Wrapping", sub: "complimentary" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(201,168,92,0.1)" }} className="trust-grid">
      {badges.map(b => (
        <div key={b.label} style={{ padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "inherit" }}>
          <div style={{ color: "#c9a85c" }}>{b.icon}</div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "4px" }}>{b.label}</p>
            <p style={{ fontSize: "11px", opacity: 0.45 }}>{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section Reveal (scroll animation) ────────────────────
function Reveal({ children, delay = 0, style }) {
  const ref = React.useRef();
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

// ── Email Popup ───────────────────────────────────────────
function EmailPopup({ theme, onDismiss }) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const isDark = theme === "dark";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }} onClick={onDismiss}>
      <div onClick={e => e.stopPropagation()} style={{
        background: isDark ? "#141210" : "#f7f3ec",
        border: `1px solid ${isDark ? "rgba(201,168,92,0.2)" : "rgba(0,0,0,0.1)"}`,
        padding: "48px", maxWidth: "480px", width: "100%", position: "relative",
        boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
      }}>
        <button onClick={onDismiss} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.5 }}><Icons.X /></button>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#c9a85c", marginBottom: "16px", display: "flex", justifyContent: "center" }}><Icons.Sparkle /></div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, marginBottom: "12px", letterSpacing: "0.05em" }}>First Access & Offers</h3>
          <p style={{ fontSize: "13px", opacity: 0.55, lineHeight: "1.7", marginBottom: "32px" }}>Join the Aurah circle. Receive early access to new arrivals, exclusive offers, and curated edits.</p>
          {!submitted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: "100%", padding: "14px 16px", background: "transparent",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                  color: "inherit", fontFamily: "inherit", fontSize: "13px", outline: "none", boxSizing: "border-box",
                }} />
              <Button variant="primary" size="md" onClick={() => setSubmitted(true)} style={{ width: "100%" }}>Join the Circle</Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(201,168,92,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a85c" }}><Icons.Check /></div>
              <p style={{ fontSize: "14px" }}>Welcome to Aurah. Check your inbox.</p>
            </div>
          )}
          <button onClick={onDismiss} style={{ marginTop: "16px", background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.4, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "inherit" }}>No thanks</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icons, Button, BackButton, Badge, StarRating, ProductCard, Nav, Footer, TrustBadges, Reveal, EmailPopup });
