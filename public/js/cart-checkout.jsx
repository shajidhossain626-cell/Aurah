// AURAH — Cart, Checkout, Confirmation

// ── Cart Drawer ───────────────────────────────────────────
function CartDrawer({ cart, onClose, onNavigate, onUpdateQty, onRemove, theme }) {
  const isDark = theme === "dark";
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [coupon, setCoupon] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [couponMsg, setCouponMsg] = React.useState("");

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "AURAH10") { setDiscount(0.1); setCouponMsg("10% off applied!"); }
    else if (coupon.toUpperCase() === "WELCOME") { setDiscount(0.15); setCouponMsg("15% off applied!"); }
    else setCouponMsg("Invalid code");
  };

  const discounted = total * (1 - discount);
  const shipping = discounted >= 150 ? 0 : 18;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      {/* Drawer */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "min(480px, 100vw)",
        background: isDark ? "#0e0d0b" : "#f7f3ec",
        borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"}`,
        display: "flex", flexDirection: "column",
        boxShadow: "-24px 0 80px rgba(0,0,0,0.3)",
        animation: "slideInRight 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
        }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400 }}>Your Bag</h2>
            <p style={{ fontSize: "11px", opacity: 0.45 }}>{cart.reduce((s,i) => s+i.qty, 0)} items</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={() => { onClose(); onNavigate("cart"); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#c9a85c", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit" }}>
              View Full Cart
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.6, display: "flex" }}><Icons.X /></button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 28px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.4 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", marginBottom: "8px" }}>Your bag is empty</p>
              <p style={{ fontSize: "13px" }}>Add something beautiful.</p>
            </div>
          ) : (
            cart.map(item => (
              <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item}
                onUpdateQty={onUpdateQty} onRemove={onRemove} isDark={isDark} onNavigate={onNavigate} onClose={onClose} />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
            padding: "24px 28px",
          }}>
            {/* Coupon */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <input value={coupon} onChange={e => setCoupon(e.target.value)}
                placeholder="Coupon code (try AURAH10)"
                style={{
                  flex: 1, padding: "10px 14px", background: "transparent",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                  color: "inherit", fontFamily: "inherit", fontSize: "12px", outline: "none",
                }} />
              <button onClick={applyCoupon}
                style={{
                  padding: "10px 16px", background: "transparent",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                  cursor: "pointer", color: "inherit", fontFamily: "inherit", fontSize: "11px",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>Apply</button>
            </div>
            {couponMsg && <p style={{ fontSize: "11px", color: discount > 0 ? "#8bc98b" : "#c98b8b", marginBottom: "16px" }}>{couponMsg}</p>}

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.6 }}>
                <span>Subtotal</span><span>${total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#8bc98b" }}>
                  <span>Discount ({(discount*100).toFixed(0)}%)</span><span>−${(total * discount).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.6 }}>
                <span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 600, paddingTop: "10px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                <span>Total</span><span style={{ color: "#c9a85c" }}>${(discounted + shipping).toFixed(2)}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: "11px", opacity: 0.45, marginBottom: "16px", textAlign: "center" }}>
                Add ${(150 - discounted).toFixed(2)} more for free shipping
              </p>
            )}
            <Button variant="primary" size="lg" style={{ width: "100%" }}
              onClick={() => { onClose(); onNavigate("checkout"); }}>
              Checkout · ${(discounted + shipping).toFixed(2)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cart Item ─────────────────────────────────────────────
function CartItem({ item, onUpdateQty, onRemove, isDark, onNavigate, onClose }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "80px 1fr", gap: "16px",
      padding: "20px 0",
      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
    }}>
      <div style={{ cursor: "pointer" }}
        onClick={() => { onClose?.(); onNavigate("product", { productId: item.id }); }}>
        <ProductImage type={item.image} style={{ width: "80px", height: "107px", objectFit: "cover" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>{item.name}</p>
          <p style={{ fontSize: "11px", opacity: 0.45, marginBottom: "8px" }}>
            {[item.size, item.color].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
            <button onClick={() => onUpdateQty(item.id, item.size, item.color, item.qty - 1)}
              style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center" }}>
              <Icons.Minus />
            </button>
            <span style={{ padding: "0 12px", display: "flex", alignItems: "center", fontSize: "13px" }}>{item.qty}</span>
            <button onClick={() => onUpdateQty(item.id, item.size, item.color, item.qty + 1)}
              style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center" }}>
              <Icons.Plus />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#c9a85c" }}>${(item.price * item.qty).toFixed(2)}</span>
            <button onClick={() => onRemove(item.id, item.size, item.color)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.4, display: "flex", padding: 0 }}>
              <Icons.Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Full Cart Page ────────────────────────────────────────
function CartPage({ cart, onNavigate, onUpdateQty, onRemove, theme }) {
  const isDark = theme === "dark";
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total >= 150 ? 0 : 18;

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(32px,6vw,60px) clamp(16px,4vw,32px)" }}>
        {/* Back Button */}
        <div style={{ marginBottom: "24px" }}>
          <BackButton onNavigate={onNavigate} to="collection" label="Continue Shopping" theme={theme} />
        </div>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "12px" }}>Your Selection</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, marginBottom: "48px" }}>Shopping Bag</h1>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", opacity: 0.45 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, marginBottom: "16px" }}>Your bag is empty</p>
            <Button variant="primary" onClick={() => onNavigate("collection")}>Continue Shopping</Button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }} className="cart-grid">
            {/* Items */}
            <div>
              {cart.map(item => (
                <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item}
                  onUpdateQty={onUpdateQty} onRemove={onRemove} isDark={isDark} onNavigate={onNavigate} />
              ))}
              <div style={{ marginTop: "24px" }}>
                <Button variant="ghost" size="sm" onClick={() => onNavigate("collection")}>
                  <Icons.ArrowLeft /> Continue Shopping
                </Button>
              </div>
            </div>
            {/* Summary */}
            <div style={{
              position: "sticky", top: "88px",
              padding: "32px",
              background: isDark ? "#0e0d0b" : "#f0ece4",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 400, marginBottom: "24px" }}>Order Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", opacity: 0.6 }}>
                  <span>Subtotal</span><span>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", opacity: 0.6 }}>
                  <span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 600, paddingTop: "12px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <span>Total</span><span style={{ color: "#c9a85c" }}>${(total + shipping).toFixed(2)}</span>
                </div>
              </div>
              <Button variant="primary" size="lg" style={{ width: "100%", marginBottom: "12px" }} onClick={() => onNavigate("checkout")}>
                Proceed to Checkout
              </Button>
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px", opacity: 0.4 }}>
                {["VISA", "MC", "AMEX", "PAYPAL"].map(b => (
                  <span key={b} style={{ fontSize: "9px", letterSpacing: "0.08em", fontWeight: 600 }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Checkout ──────────────────────────────────────────────
function CheckoutPage({ cart, onNavigate, onPlaceOrder, theme }) {
  const isDark = theme === "dark";
  const [step, setStep] = React.useState(1); // 1=contact, 2=shipping, 3=payment
  const [form, setForm] = React.useState({
    email: "", firstName: "", lastName: "", address: "", city: "", zip: "", country: "US",
    cardNum: "", cardExp: "", cardCvv: "", cardName: "",
  });
  const [errors, setErrors] = React.useState({});

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total >= 150 ? 0 : 18;
  const grand = total + shipping;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.email.includes("@")) e.email = "Valid email required";
      if (!form.firstName) e.firstName = "Required";
      if (!form.lastName) e.lastName = "Required";
    }
    if (step === 2) {
      if (!form.address) e.address = "Required";
      if (!form.city) e.city = "Required";
      if (!form.zip) e.zip = "Required";
    }
    if (step === 3) {
      if (form.cardNum.replace(/\s/g,"").length < 16) e.cardNum = "Valid card number required";
      if (!form.cardExp) e.cardExp = "Required";
      if (form.cardCvv.length < 3) e.cardCvv = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) { if (step < 3) setStep(s => s + 1); else { onPlaceOrder(form); onNavigate("confirmation"); } } };

  const inputStyle = (k) => ({
    width: "100%", padding: "14px 16px", background: "transparent", boxSizing: "border-box",
    border: `1px solid ${errors[k] ? "#c98b8b" : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)"}`,
    color: "inherit", fontFamily: "inherit", fontSize: "13px", outline: "none",
    transition: "border-color 0.2s",
  });

  const steps = ["Contact", "Shipping", "Payment"];

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(32px,6vw,60px) clamp(16px,4vw,32px)" }}>
        {/* Back to Cart */}
        <div style={{ marginBottom: "28px" }}>
          <BackButton onNavigate={onNavigate} to="cart" label="Back to Bag" theme={theme} />
        </div>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", letterSpacing: "0.18em" }}>AURAH</span>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0", marginBottom: "48px" }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: step > i+1 ? "#c9a85c" : step === i+1 ? "rgba(201,168,92,0.15)" : "transparent",
                  border: `1px solid ${step >= i+1 ? "#c9a85c" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                  color: step >= i+1 ? "#c9a85c" : "inherit",
                  fontSize: "12px", fontWeight: 600,
                  transition: "all 0.3s",
                }}>
                  {step > i+1 ? <Icons.Check /> : i+1}
                </div>
                <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: step === i+1 ? 1 : 0.4 }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: "80px", height: "1px", background: step > i+1 ? "#c9a85c" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", margin: "0 8px", marginBottom: "24px", transition: "background 0.3s" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }} className="cart-grid">
          {/* Form */}
          <div style={{
            padding: "40px",
            background: isDark ? "#0e0d0b" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, marginBottom: "32px" }}>{steps[step-1]}</h2>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "8px" }}>Email</label>
                  <input style={inputStyle("email")} value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" />
                  {errors.email && <p style={{ fontSize: "11px", color: "#c98b8b", marginTop: "4px" }}>{errors.email}</p>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "8px" }}>First Name</label>
                    <input style={inputStyle("firstName")} value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="Jane" />
                    {errors.firstName && <p style={{ fontSize: "11px", color: "#c98b8b", marginTop: "4px" }}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "8px" }}>Last Name</label>
                    <input style={inputStyle("lastName")} value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Doe" />
                    {errors.lastName && <p style={{ fontSize: "11px", color: "#c98b8b", marginTop: "4px" }}>{errors.lastName}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { k: "address", label: "Street Address", placeholder: "123 Rue du Faubourg" },
                  { k: "city", label: "City", placeholder: "Paris" },
                  { k: "zip", label: "Postal Code", placeholder: "75001" },
                ].map(f => (
                  <div key={f.k}>
                    <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "8px" }}>{f.label}</label>
                    <input style={inputStyle(f.k)} value={form[f.k]} onChange={e => update(f.k, e.target.value)} placeholder={f.placeholder} />
                    {errors[f.k] && <p style={{ fontSize: "11px", color: "#c98b8b", marginTop: "4px" }}>{errors[f.k]}</p>}
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ padding: "12px 16px", background: isDark ? "rgba(201,168,92,0.05)" : "rgba(201,168,92,0.08)", border: "1px solid rgba(201,168,92,0.2)", fontSize: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icons.Shield /><span>256-bit SSL encryption. Your payment is secure.</span>
                </div>
                <div>
                  <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "8px" }}>Card Number</label>
                  <input style={inputStyle("cardNum")} value={form.cardNum}
                    onChange={e => update("cardNum", e.target.value.replace(/\D/g,"").replace(/(\d{4})/g,"$1 ").trim().slice(0,19))}
                    placeholder="1234 5678 9012 3456" />
                  {errors.cardNum && <p style={{ fontSize: "11px", color: "#c98b8b", marginTop: "4px" }}>{errors.cardNum}</p>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "8px" }}>Expiry</label>
                    <input style={inputStyle("cardExp")} value={form.cardExp}
                      onChange={e => update("cardExp", e.target.value.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").slice(0,5))}
                      placeholder="MM/YY" />
                    {errors.cardExp && <p style={{ fontSize: "11px", color: "#c98b8b", marginTop: "4px" }}>{errors.cardExp}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "8px" }}>CVV</label>
                    <input style={inputStyle("cardCvv")} value={form.cardCvv}
                      onChange={e => update("cardCvv", e.target.value.replace(/\D/g,"").slice(0,4))}
                      placeholder="···" />
                    {errors.cardCvv && <p style={{ fontSize: "11px", color: "#c98b8b", marginTop: "4px" }}>{errors.cardCvv}</p>}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              {step > 1 && (
                <Button variant="secondary" onClick={() => setStep(s => s - 1)}>
                  <Icons.ArrowLeft /> Back
                </Button>
              )}
              <Button variant="primary" size="lg" style={{ flex: 1 }} onClick={next}>
                {step < 3 ? <>Continue <Icons.ArrowRight /></> : `Place Order · $${grand.toFixed(2)}`}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div style={{
              padding: "28px",
              background: isDark ? "#0e0d0b" : "#f0ece4",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 400, marginBottom: "20px" }}>Order Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {cart.map(item => (
                  <div key={`${item.id}-${item.size}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.7 }}>
                    <span>{item.name} × {item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.6 }}>
                  <span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 600, marginTop: "4px" }}>
                  <span>Total</span><span style={{ color: "#c9a85c" }}>${grand.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "24px", opacity: 0.3 }}>
              {["VISA", "MC", "AMEX", "PAYPAL"].map(b => <span key={b} style={{ fontSize: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>{b}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Order Confirmation ────────────────────────────────────
function ConfirmationPage({ onNavigate, theme, lastOrder }) {
  const isDark = theme === "dark";
  const orderNum = `AUR-${Math.random().toString(36).slice(2,8).toUpperCase()}`;

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "560px", width: "100%", padding: "80px 32px", textAlign: "center" }}>
        <Reveal>
          {/* Animated check */}
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(201,168,92,0.12)",
            border: "1px solid rgba(201,168,92,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 32px", color: "#c9a85c",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a85c", marginBottom: "16px" }}>Order Confirmed</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, marginBottom: "16px" }}>
            Thank you{lastOrder?.firstName ? `, ${lastOrder.firstName}` : ""}.
          </h1>
          <p style={{ fontSize: "14px", lineHeight: "1.8", opacity: 0.55, marginBottom: "8px" }}>
            Your order has been placed and is being prepared with care.
          </p>
          <p style={{ fontSize: "12px", opacity: 0.4, marginBottom: "40px" }}>
            A confirmation will be sent to {lastOrder?.email || "your email"}.
          </p>

          <div style={{
            padding: "24px 28px",
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            marginBottom: "32px", textAlign: "left",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", opacity: 0.5, letterSpacing: "0.06em" }}>Order Number</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#c9a85c" }}>{orderNum}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", opacity: 0.5, letterSpacing: "0.06em" }}>Estimated Delivery</span>
              <span style={{ fontSize: "12px" }}>3–5 business days</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", opacity: 0.5, letterSpacing: "0.06em" }}>Shipping To</span>
              <span style={{ fontSize: "12px" }}>{lastOrder?.city || "Your Address"}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Button variant="primary" size="lg" style={{ width: "100%" }} onClick={() => onNavigate("collection")}>
              Continue Shopping
            </Button>
            <Button variant="secondary" size="md" style={{ width: "100%" }} onClick={() => onNavigate("home")}>
              Back to Home
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

Object.assign(window, { CartDrawer, CartItem, CartPage, CheckoutPage, ConfirmationPage });
