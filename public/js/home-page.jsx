// AURA — Homepage

function HomePage({ onNavigate, onAddToCart, onToggleWishlist, wishlistIds, theme }) {
  const isDark = theme === "dark";
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
  const [heroParallax, setHeroParallax] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handler = (e) => {
      setHeroParallax({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        position: "relative", height: "100vh", minHeight: "640px",
        display: "flex", alignItems: "center", overflow: "hidden",
        background: isDark ? "#0c0b09" : "#f7f3ec",
      }}>
        {/* BG depth layers */}
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        }}>
          {/* Far layer — gradient blob */}
          <div style={{
            position: "absolute", width: "80vw", height: "80vw", borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(201,168,92,0.04) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(201,168,92,0.12) 0%, transparent 70%)",
            top: "50%", left: "50%", transform: `translate(-50%, -50%) translate(${heroParallax.x * 0.3}px, ${heroParallax.y * 0.3}px)`,
            transition: "transform 0.8s ease",
          }} />
          {/* Mid layer — product placeholder */}
          <div style={{
            position: "absolute", right: "0", top: "0", bottom: "0", width: "52%",
            transform: `translate(${heroParallax.x * 0.5}px, ${heroParallax.y * 0.3}px)`,
            transition: "transform 0.6s ease",
          }}>
            <ProductImage type="coat" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* Glass overlay on image */}
            <div style={{
              position: "absolute", inset: 0,
              background: isDark
                ? "linear-gradient(to right, #0c0b09 0%, transparent 30%)"
                : "linear-gradient(to right, #f7f3ec 0%, transparent 30%)",
            }} />
          </div>
          {/* Near layer — floating accent card */}
          <div style={{
            position: "absolute", bottom: "15%", right: "6%",
            transform: `translate(${heroParallax.x * 0.8}px, ${heroParallax.y * 0.6}px)`,
            transition: "transform 0.4s ease",
          }}>
            <div style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${isDark ? "rgba(201,168,92,0.2)" : "rgba(0,0,0,0.08)"}`,
              padding: "20px 24px", minWidth: "200px",
              boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
            }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.5, marginBottom: "8px" }}>Now Available</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", marginBottom: "4px" }}>Atelier Wrap Coat</p>
              <p style={{ fontSize: "14px", color: "#c9a85c", fontWeight: 600 }}>$890</p>
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1280px", margin: "0 auto", padding: "0 32px", width: "100%" }}>
          <div style={{ maxWidth: "540px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              marginBottom: "24px", opacity: 0.6,
            }}>
              <div style={{ width: "32px", height: "1px", background: "#c9a85c" }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Spring Collection 2026</span>
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(52px, 7vw, 92px)",
              fontWeight: 400, lineHeight: "1.05",
              letterSpacing: "-0.01em",
              marginBottom: "28px",
            }}>
              Dressed<br />in<br /><em style={{ color: "#c9a85c" }}>Intention.</em>
            </h1>
            <p style={{ fontSize: "15px", lineHeight: "1.8", opacity: 0.55, marginBottom: "40px", maxWidth: "380px" }}>
              Premium fashion, beauty, and home essentials — designed for those who choose quality over quantity.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Button variant="primary" size="lg" onClick={() => onNavigate("collection")}>
                Shop Collection <Icons.ArrowRight />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => onNavigate("collection", { filter: "fashion" })}>
                Explore Lookbook
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.35,
        }}>
          <div style={{ width: "1px", height: "40px", background: "currentColor", animation: "scrollPulse 2s ease infinite" }} />
          <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ── FEATURED CATEGORIES ── */}
      <section style={{ padding: "100px 32px", maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
            <div>
              <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "12px" }}>Curated by Category</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400 }}>Shop by World</h2>
            </div>
            <Button variant="ghost" onClick={() => onNavigate("collection")}>View All <Icons.ArrowRight /></Button>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="category-grid">
          {[
            { id: "fashion", label: "Fashion", subtitle: "6 pieces", img: "blazer", h: "460px" },
            { id: "beauty", label: "Beauty", subtitle: "5 essentials", img: "face-oil", h: "460px" },
            { id: "home", label: "Home", subtitle: "5 objects", img: "candles", h: "460px" },
          ].map((cat, i) => (
            <Reveal key={cat.id} delay={i * 100}>
              <CategoryCard cat={cat} onNavigate={onNavigate} isDark={isDark} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: "0 32px 100px", maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
            <div>
              <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "12px" }}>Handpicked</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400 }}>Editor's Selection</h2>
            </div>
            <Button variant="ghost" onClick={() => onNavigate("collection")}>All Products <Icons.ArrowRight /></Button>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }} className="product-grid-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} onNavigate={onNavigate} onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} theme={theme} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MARQUEE BAND ── */}
      <MarqueeBand />

      {/* ── EDITORIAL SPLIT ── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "600px" }} className="editorial-split">
        <div style={{ position: "relative", overflow: "hidden" }}>
          <ProductImage type="dress" style={{ width: "100%", height: "100%", minHeight: "500px", objectFit: "cover" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }} />
          <div style={{ position: "absolute", bottom: "40px", left: "40px", color: "#f7f3ec" }}>
            <Badge label="New" />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400, marginTop: "12px", marginBottom: "8px" }}>The Soie Edit</h3>
            <p style={{ fontSize: "13px", opacity: 0.7, marginBottom: "20px" }}>Pure silk for considered living</p>
            <Button variant="primary" size="sm" onClick={() => onNavigate("product", { productId: 2 })}>Discover</Button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr" }}>
          {[
            { type: "face-oil", title: "Skin Ritual", sub: "The Radiance Oil", id: 7 },
            { type: "candles", title: "At Home", sub: "Noir Candle Trio", id: 13 },
          ].map((item, i) => (
            <div key={item.type} style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
              onClick={() => onNavigate("product", { productId: item.id })}>
              <ProductImage type={item.type} style={{ width: "100%", height: "100%", minHeight: "250px", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
              }} />
              <div style={{ position: "absolute", bottom: "24px", left: "28px", color: "#f7f3ec" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, marginBottom: "4px" }}>{item.title}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400 }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <div style={{ padding: "0 0" }}>
        <TrustBadges />
      </div>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "100px 32px", maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "12px" }}>What They Say</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400 }}>Worn & Loved</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="testimonial-grid">
          {[
            { quote: "The wrap coat has completely redefined my wardrobe. I wear it every day and still get stopped on the street.", author: "Margaux D.", role: "Fashion Editor, Paris", rating: 5, product: "Atelier Wrap Coat" },
            { quote: "The face oil is the only product I've repurchased more than three times. It genuinely transformed my skin.", author: "Charlotte H.", role: "Creative Director, London", rating: 5, product: "Radiance Face Oil" },
            { quote: "Everything about these candles is considered — the vessels, the scent, the burn. Genuinely luxurious.", author: "Elena V.", role: "Interior Stylist, Milan", rating: 5, product: "Noir Candle Trio" },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{
                padding: "32px",
                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}>
                <StarRating rating={t.rating} reviews={null} />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", lineHeight: "1.6", margin: "20px 0", fontStyle: "italic" }}>"{t.quote}"</p>
                <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: "2px" }}>{t.product}</p>
                <p style={{ fontSize: "13px", fontWeight: 500 }}>{t.author}</p>
                <p style={{ fontSize: "11px", opacity: 0.45 }}>{t.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section style={{
        padding: "80px 32px",
        background: isDark ? "#100f0d" : "#f0ece4",
        textAlign: "center",
      }}>
        <Reveal>
          <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "16px" }}>Join the Circle</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, marginBottom: "16px" }}>First access to new arrivals</h2>
          <p style={{ fontSize: "13px", opacity: 0.5, marginBottom: "32px" }}>Curated drops, exclusive offers, and the occasional beautiful thing.</p>
          <div style={{ display: "flex", maxWidth: "420px", margin: "0 auto", gap: "0" }}>
            <input placeholder="your@email.com"
              style={{
                flex: 1, padding: "14px 20px",
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                borderRight: "none", color: "inherit", fontFamily: "inherit", fontSize: "13px", outline: "none",
              }} />
            <Button variant="primary" size="md" style={{ borderRadius: 0, whiteSpace: "nowrap" }}>Subscribe</Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ── Category Card ──
function CategoryCard({ cat, onNavigate, isDark }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={() => onNavigate("collection", { filter: cat.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", cursor: "pointer", overflow: "hidden",
        height: cat.h,
        transform: hovered ? "scale(1.01)" : "scale(1)",
        transition: "transform 0.5s ease",
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.15)",
      }}
    >
      <ProductImage type={cat.img} style={{ width: "100%", height: "100%", objectFit: "cover",
        transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.7s ease" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)",
      }} />
      <div style={{ position: "absolute", bottom: "32px", left: "28px", color: "#f7f3ec" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: "6px" }}>{cat.subtitle}</p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, marginBottom: "16px" }}>{cat.label}</h3>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
          opacity: hovered ? 1 : 0.7, transition: "opacity 0.3s",
        }}>
          <span>Shop Now</span>
          <div style={{ transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s" }}>
            <Icons.ArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Marquee Band ──
function MarqueeBand() {
  const items = ["Free Shipping on $150+", "·", "New Arrivals Weekly", "·", "30-Day Returns", "·", "Sustainably Sourced", "·", "Handcrafted Quality", "·"];
  const repeated = [...items, ...items];
  return (
    <div style={{
      overflow: "hidden", padding: "18px 0", background: "#c9a85c",
      color: "#0c0b09",
    }}>
      <div style={{
        display: "flex", gap: "32px", width: "max-content",
        animation: "marquee 24s linear infinite",
      }}>
        {repeated.map((item, i) => (
          <span key={i} style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, whiteSpace: "nowrap" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomePage, CategoryCard, MarqueeBand });
