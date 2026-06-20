// AURAH — Shop Pages (Collection + Product Detail)

// ── Collection Page ───────────────────────────────────────
function CollectionPage({ params, onNavigate, onAddToCart, onToggleWishlist, wishlistIds, theme }) {
  const isDark = theme === "dark";
  const [activeFilter, setActiveFilter] = React.useState(params?.filter || "all");
  const [sort, setSort] = React.useState("featured");
  const [viewMode, setViewMode] = React.useState("grid"); // grid | list

  React.useEffect(() => {
    if (params?.filter) setActiveFilter(params.filter);
  }, [params?.filter]);

  const filtered = PRODUCTS.filter(p => activeFilter === "all" ? true : p.collection === activeFilter);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        padding: "60px 32px 40px",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        background: isDark ? "#0e0d0b" : "#f5f1ea",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "12px" }}>
            The Collection
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, marginBottom: "8px" }}>
            {activeFilter === "all" ? "Everything" : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
          </h1>
          <p style={{ fontSize: "13px", opacity: 0.45 }}>{sorted.length} pieces</p>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
        {/* Filter + Sort Bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 0", flexWrap: "wrap", gap: "16px",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          marginBottom: "40px",
        }}>
          {/* Category Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {COLLECTIONS.map(c => (
              <button key={c.id} onClick={() => setActiveFilter(c.id)}
                style={{
                  padding: "8px 18px", fontSize: "10px", letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
                  border: `1px solid ${activeFilter === c.id ? "#c9a85c" : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                  background: activeFilter === c.id ? "#c9a85c" : "transparent",
                  color: activeFilter === c.id ? "#0c0b09" : "inherit",
                  transition: "all 0.2s", fontWeight: activeFilter === c.id ? 600 : 400,
                }}
              >{c.label}</button>
            ))}
          </div>
          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{
                padding: "8px 32px 8px 12px", fontSize: "11px", letterSpacing: "0.06em",
                background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                color: "inherit", cursor: "pointer", fontFamily: "inherit", outline: "none",
                appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c9a85c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            {/* View Toggle */}
            <div style={{ display: "flex", gap: "4px" }}>
              {["grid", "list"].map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  style={{
                    padding: "8px 10px", background: viewMode === v ? "#c9a85c" : "transparent",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                    cursor: "pointer", color: viewMode === v ? "#0c0b09" : "inherit",
                    fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase",
                    fontFamily: "inherit", transition: "all 0.2s",
                  }}
                >{v === "grid" ? "⊞" : "☰"}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid / List */}
        {viewMode === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "80px" }} className="product-grid-4">
            {sorted.map((p, i) => (
              <Reveal key={p.id} delay={i * 40}>
                <ProductCard product={p} onNavigate={onNavigate} onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} theme={theme} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "80px" }}>
            {sorted.map(p => (
              <ListProductRow key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListProductRow({ product, onNavigate, onAddToCart, onToggleWishlist, wishlistIds, isDark }) {
  const [hovered, setHovered] = React.useState(false);
  const isWished = wishlistIds?.includes(product.id);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: "120px 1fr auto",
        gap: "24px", alignItems: "center", padding: "20px 0",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        cursor: "pointer",
        background: hovered ? isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" : "transparent",
        transition: "background 0.2s",
      }}
    >
      <div onClick={() => onNavigate("product", { productId: product.id })} style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <ProductImage type={product.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div onClick={() => onNavigate("product", { productId: product.id })}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          {product.badge && <Badge label={product.badge} />}
          <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4 }}>{product.collection}</span>
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400, marginBottom: "4px" }}>{product.name}</h3>
        <p style={{ fontSize: "12px", opacity: 0.5, marginBottom: "12px" }}>{product.subtitle}</p>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          {product.colors.slice(0, 4).map(c => (
            <div key={c.name} title={c.name} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c.hex, border: "1px solid rgba(255,255,255,0.2)" }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "20px", fontWeight: 600, color: "#c9a85c" }}>${product.price}</p>
          {product.originalPrice && <p style={{ fontSize: "12px", opacity: 0.4, textDecoration: "line-through" }}>${product.originalPrice}</p>}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => onToggleWishlist(product.id)}
            style={{ padding: "10px", background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`, cursor: "pointer", color: isWished ? "#c9a85c" : "inherit", display: "flex", alignItems: "center" }}>
            <Icons.Heart filled={isWished} />
          </button>
          <Button variant="primary" size="sm" onClick={() => onAddToCart(product, product.sizes[0], product.colors[0]?.name)}>Add to Bag</Button>
        </div>
      </div>
    </div>
  );
}

// ── Product Detail Page ───────────────────────────────────
function ProductPage({ params, onNavigate, onAddToCart, onToggleWishlist, wishlistIds, theme }) {
  const isDark = theme === "dark";
  const product = PRODUCTS.find(p => p.id === params?.productId) || PRODUCTS[0];
  const [selectedSize, setSelectedSize] = React.useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = React.useState(product.colors[0] || null);
  const [qty, setQty] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);
  const [imgTilt, setImgTilt] = React.useState({ x: 0, y: 0 });
  const [imgHovered, setImgHovered] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [tab, setTab] = React.useState("description");
  const imgRef = React.useRef();
  const isWished = wishlistIds?.includes(product.id);
  const related = PRODUCTS.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, 4);

  const handleMouseMove = (e) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setImgTilt({ x, y });
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor?.name, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: "64px" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", opacity: 0.45 }}>
          <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontFamily: "inherit" }}>Home</button>
          <span>/</span>
          <button onClick={() => onNavigate("collection", { filter: product.collection })} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontFamily: "inherit", textTransform: "capitalize" }}>{product.collection}</button>
          <span>/</span>
          <span style={{ color: "#c9a85c" }}>{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }} className="product-detail-grid">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div
            ref={imgRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setImgHovered(true)}
            onMouseLeave={() => { setImgHovered(false); setImgTilt({ x: 0, y: 0 }); }}
            style={{
              position: "relative", aspectRatio: "3/4", overflow: "hidden",
              transform: imgHovered ? `perspective(1000px) rotateX(${imgTilt.y}deg) rotateY(${imgTilt.x}deg)` : "perspective(1000px) rotateX(0) rotateY(0)",
              transition: imgHovered ? "transform 0.1s ease" : "transform 0.6s ease",
              boxShadow: imgHovered ? "0 32px 80px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.15)",
              marginBottom: "12px",
            }}
          >
            <ProductImage type={product.images[activeImage] || product.images[0]}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {product.badge && (
              <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                <Badge label={product.badge} />
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: "8px" }}>
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setActiveImage(i)}
                  style={{
                    width: "80px", aspectRatio: "3/4", overflow: "hidden", cursor: "pointer",
                    border: `2px solid ${activeImage === i ? "#c9a85c" : "transparent"}`,
                    opacity: activeImage === i ? 1 : 0.5, transition: "all 0.2s",
                  }}>
                  <ProductImage type={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ position: "sticky", top: "88px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {product.badge && <Badge label={product.badge} />}
            <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.4, display: "flex", alignItems: "center" }}>{product.collection}</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 400, marginBottom: "8px", lineHeight: 1.15 }}>{product.name}</h1>
          <p style={{ fontSize: "13px", opacity: 0.5, marginBottom: "16px" }}>{product.subtitle}</p>
          <StarRating rating={product.rating} reviews={product.reviews} />

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", margin: "24px 0" }}>
            <span style={{ fontSize: "28px", fontWeight: 600, color: "#c9a85c" }}>${product.price}</span>
            {product.originalPrice && (
              <span style={{ fontSize: "16px", opacity: 0.35, textDecoration: "line-through" }}>${product.originalPrice}</span>
            )}
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px", opacity: 0.6 }}>
                Color — <span style={{ color: "#c9a85c" }}>{selectedColor?.name}</span>
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {product.colors.map(c => (
                  <button key={c.name} title={c.name} onClick={() => setSelectedColor(c)}
                    style={{
                      width: "28px", height: "28px", borderRadius: "50%", background: c.hex,
                      border: `2px solid ${selectedColor?.name === c.name ? "#c9a85c" : "transparent"}`,
                      outline: `2px solid ${selectedColor?.name === c.name ? "#c9a85c" : "transparent"}`,
                      outlineOffset: "3px", cursor: "pointer", transition: "all 0.2s",
                    }} />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 1 && (
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>
                  Size — <span style={{ color: "#c9a85c" }}>{selectedSize}</span>
                </p>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#c9a85c", fontSize: "11px", letterSpacing: "0.08em", fontFamily: "inherit" }}>Size Guide</button>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    style={{
                      padding: "10px 16px", fontSize: "11px", letterSpacing: "0.08em",
                      textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
                      border: `1px solid ${selectedSize === s ? "#c9a85c" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                      background: selectedSize === s ? "rgba(201,168,92,0.1)" : "transparent",
                      color: selectedSize === s ? "#c9a85c" : "inherit",
                      transition: "all 0.2s", minWidth: "48px",
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            {/* Quantity */}
            <div style={{ display: "flex", border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}` }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ padding: "0 14px", background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center" }}>
                <Icons.Minus />
              </button>
              <span style={{ padding: "0 16px", display: "flex", alignItems: "center", fontSize: "14px", minWidth: "40px", justifyContent: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                style={{ padding: "0 14px", background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center" }}>
                <Icons.Plus />
              </button>
            </div>
            {/* Add to Bag */}
            <Button variant="primary" size="lg" onClick={handleAddToCart}
              style={{ flex: 1, background: added ? "#2a5a2a" : "#c9a85c", color: added ? "#8bc98b" : "#0c0b09" }}>
              {added ? <><Icons.Check /> Added!</> : "Add to Bag"}
            </Button>
          </div>

          {/* Wishlist */}
          <button onClick={() => onToggleWishlist(product.id)}
            style={{
              width: "100%", padding: "14px", background: "transparent",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              cursor: "pointer", color: isWished ? "#c9a85c" : "inherit",
              fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.2s",
            }}>
            <Icons.Heart filled={isWished} />
            {isWished ? "Saved to Wishlist" : "Save to Wishlist"}
          </button>

          {/* Tabs */}
          <div style={{ marginTop: "40px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, paddingTop: "32px" }}>
            <div style={{ display: "flex", gap: "0", marginBottom: "24px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
              {["description", "details"].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{
                    padding: "10px 0", marginRight: "32px", background: "none", border: "none",
                    borderBottom: `2px solid ${tab === t ? "#c9a85c" : "transparent"}`,
                    cursor: "pointer", color: tab === t ? "#c9a85c" : "inherit",
                    fontSize: "11px", letterSpacing: "0.1em", textTransform: "capitalize",
                    fontFamily: "inherit", opacity: tab === t ? 1 : 0.5,
                    marginBottom: "-1px", transition: "all 0.2s",
                  }}
                >{t}</button>
              ))}
            </div>
            {tab === "description" ? (
              <p style={{ fontSize: "14px", lineHeight: "1.8", opacity: 0.65 }}>{product.description}</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {product.details.map(d => (
                  <li key={d} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", opacity: 0.65 }}>
                    <div style={{ color: "#c9a85c", flexShrink: 0 }}><Icons.Check /></div>
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Trust mini */}
          <div style={{ marginTop: "28px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[
              { icon: <Icons.Truck />, label: "Free shipping $150+" },
              { icon: <Icons.Refresh />, label: "30-day returns" },
              { icon: <Icons.Shield />, label: "Secure checkout" },
            ].map(b => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", opacity: 0.45, color: "#c9a85c" }}>
                {b.icon}<span style={{ color: "inherit", opacity: 1 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgency Bar */}
      <div style={{
        margin: "0 32px", padding: "16px 24px",
        background: isDark ? "rgba(201,168,92,0.06)" : "rgba(201,168,92,0.08)",
        border: `1px solid rgba(201,168,92,0.2)`,
        display: "flex", alignItems: "center", gap: "12px", maxWidth: "1280px",
      }}>
        <div style={{ color: "#c9a85c" }}><Icons.Tag /></div>
        <p style={{ fontSize: "12px", letterSpacing: "0.04em" }}>
          <strong style={{ color: "#c9a85c" }}>8 people</strong> are viewing this right now · Only <strong style={{ color: "#c9a85c" }}>3 left</strong> in {selectedSize}
        </p>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ padding: "80px 32px", maxWidth: "1280px", margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, marginBottom: "40px" }}>
              You May Also Love
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }} className="product-grid-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} onNavigate={onNavigate} onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} theme={theme} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Wishlist Page ─────────────────────────────────────────
function WishlistPage({ onNavigate, onAddToCart, onToggleWishlist, wishlistIds, theme }) {
  const isDark = theme === "dark";
  const wished = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "60px 32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "12px" }}>Your Curation</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, marginBottom: "8px" }}>Wishlist</h1>
        <p style={{ fontSize: "13px", opacity: 0.45, marginBottom: "48px" }}>{wished.length} {wished.length === 1 ? "piece" : "pieces"} saved</p>

        {wished.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", opacity: 0.4 }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>♡</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, marginBottom: "8px" }}>Nothing saved yet</p>
            <p style={{ fontSize: "13px" }}>Browse the collection and save pieces you love.</p>
            <div style={{ marginTop: "24px" }}>
              <Button variant="primary" onClick={() => onNavigate("collection")}>Explore Collection</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }} className="product-grid-4">
            {wished.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} onNavigate={onNavigate} onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds} theme={theme} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { CollectionPage, ProductPage, WishlistPage, ListProductRow });
