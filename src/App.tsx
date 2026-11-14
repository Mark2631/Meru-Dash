import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bike,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  MapPin,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
  Zap,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import LocationPicker from "./LocationPicker";
import { CAMPUS_CENTER, formatKES, PRODUCTS, type PinLocation, type Product, type ProductCategory } from "./data";

type CartItem = { product: Product; quantity: number };
type RequestType = "errand" | "parcel";
type MapTarget = "delivery" | "pickup" | "recipient";

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");

const categories = [
  { name: "Food & drinks", note: "Meals, snacks and something cold", icon: Utensils, tone: "mint" },
  { name: "Essentials", note: "The everyday things you need", icon: ShoppingBag, tone: "sand" },
] as const;

const services = [
  {
    id: "errand" as const,
    title: "Quick errands",
    description: "Need something picked up or sorted? Tell us what you need.",
    icon: Zap,
    tone: "service-yellow",
    action: "Make a request",
  },
  {
    id: "parcel" as const,
    title: "Send a parcel",
    description: "Send something to a friend. Add collection and drop-off points.",
    icon: Package,
    tone: "service-green",
    action: "Send a parcel",
  },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<"All" | ProductCategory>("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem("merudash-cart");
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<PinLocation | null>(null);
  const [mapTarget, setMapTarget] = useState<MapTarget>("delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [requestDescription, setRequestDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState<PinLocation | null>(null);
  const [recipientLocation, setRecipientLocation] = useState<PinLocation | null>(null);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => {
    window.localStorage.setItem("merudash-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart],
  );
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const addToCart = (product: Product) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.product.id === product.id);
      if (existing) {
        return previous.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...previous, { product, quantity: 1 }];
    });
    setToast(product.name + " added to your order");
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + change } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const openMap = (target: MapTarget) => {
    setMapTarget(target);
    setLocationOpen(true);
  };

  const handlePinConfirm = (location: PinLocation) => {
    if (mapTarget === "delivery") setDeliveryLocation(location);
    if (mapTarget === "pickup") setPickupLocation(location);
    if (mapTarget === "recipient") setRecipientLocation(location);
    setLocationOpen(false);
    setToast("Location added");
  };

  const openWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    const url = WHATSAPP_NUMBER
      ? "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encoded
      : "https://wa.me/?text=" + encoded;
    window.open(url, "_blank", "noopener,noreferrer");
    setToast(
      WHATSAPP_NUMBER
        ? "Your order is ready in WhatsApp. Press Send to submit it."
        : "WhatsApp opened with your request. Select the MeruDash chat to send it.",
    );
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setToast("Add your name and phone number to continue");
      return;
    }
    if (!deliveryLocation) {
      setToast("Pin your delivery location first");
      return;
    }
    if (cart.length === 0) {
      setToast("Your cart is empty");
      return;
    }

    const itemLines = cart.map(
      (item) => "• " + item.product.name + " × " + item.quantity + " — " + formatKES(item.product.price * item.quantity),
    );
    const mapLink = "https://www.google.com/maps?q=" + deliveryLocation.lat + "," + deliveryLocation.lng;
    const message = [
      "Hello MeruDash! I'd like to place an order.",
      "",
      "Name: " + customerName.trim(),
      "Phone: " + customerPhone.trim(),
      "",
      "ORDER",
      ...itemLines,
      "",
      "Items subtotal: " + formatKES(subtotal),
      "Delivery fee: Please confirm before dispatch.",
      "",
      "DELIVERY POINT",
      "Landmark: " + (deliveryLocation.landmark || "See map pin"),
      "Coordinates: " + deliveryLocation.lat.toFixed(6) + ", " + deliveryLocation.lng.toFixed(6),
      "Map: " + mapLink,
      "",
      "Payment: Pay on delivery",
      "Please confirm availability, final delivery fee and estimated arrival time.",
    ].join("\n");

    openWhatsApp(message);
  };

  const submitServiceRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !requestDescription.trim()) {
      setToast("Complete your name, phone number and request");
      return;
    }
    if (requestType === "parcel" && (!pickupLocation || !recipientLocation)) {
      setToast("Add both collection and delivery points");
      return;
    }
    if (requestType === "errand" && !deliveryLocation) {
      setToast("Pin your delivery location first");
      return;
    }

    const lines = [
      requestType === "parcel" ? "Hello MeruDash! I'd like to send a parcel." : "Hello MeruDash! I'd like to request an errand.",
      "",
      "Name: " + customerName.trim(),
      "Phone: " + customerPhone.trim(),
      "",
      "REQUEST",
      requestDescription.trim(),
    ];

    if (requestType === "parcel" && pickupLocation && recipientLocation) {
      lines.push(
        "",
        "COLLECTION POINT",
        "Landmark: " + (pickupLocation.landmark || "See map pin"),
        "Map: https://www.google.com/maps?q=" + pickupLocation.lat + "," + pickupLocation.lng,
        "",
        "RECIPIENT / DELIVERY POINT",
        "Landmark: " + (recipientLocation.landmark || "See map pin"),
        "Map: https://www.google.com/maps?q=" + recipientLocation.lat + "," + recipientLocation.lng,
      );
    } else if (deliveryLocation) {
      lines.push(
        "",
        "DELIVERY POINT",
        "Landmark: " + (deliveryLocation.landmark || "See map pin"),
        "Map: https://www.google.com/maps?q=" + deliveryLocation.lat + "," + deliveryLocation.lng,
      );
    }

    lines.push("", "Payment: Please confirm the amount and pay-on-delivery arrangement.", "Please confirm the request and delivery details.");
    openWhatsApp(lines.join("\n"));
    setRequestType(null);
    setRequestDescription("");
  };

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    setActiveCategory("All");
  };

  const mapTitle =
    mapTarget === "pickup"
      ? "Where should we collect it?"
      : mapTarget === "recipient"
        ? "Where should it be delivered?"
        : "Where should we meet you?";
  const mapHelper =
    mapTarget === "pickup"
      ? "Pin the sender's collection point."
      : mapTarget === "recipient"
        ? "Pin the recipient's exact delivery point."
        : "Move the pin to your exact spot around MUST.";

  const initialMapLocation =
    mapTarget === "pickup"
      ? pickupLocation
      : mapTarget === "recipient"
        ? recipientLocation
        : deliveryLocation;

  return (
    <div className="site-shell">
      <div className="top-strip">
        <span><MapPin size={13} /> Serving Meru University · Main Campus</span>
        <span className="top-strip-right"><Clock3 size={13} /> Order when you need us</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="MeruDash home">
          <span className="brand-mark"><Bike size={24} strokeWidth={2.25} /></span>
          <span className="brand-word">meru<span>dash</span><small>Campus convenience, delivered.</small></span>
        </a>

        <nav className={"desktop-nav" + (mobileMenuOpen ? " nav-open" : "")}>
          <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Explore</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a>
          <a href="#help" onClick={() => setMobileMenuOpen(false)}>Help</a>
        </nav>

        <div className="header-actions">
          <button className="header-cart" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={17} />
            <span>My order</span>
            {itemCount > 0 && <b>{itemCount}</b>}
          </button>
          <button className="mobile-menu-button icon-button" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero-section page-container">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="kicker-dot" /> YOUR DAY, A LITTLE EASIER</span>
            <h1>Campus life,<br /><em>without</em> the extra trips.</h1>
            <p>Food, essentials and everyday errands — brought closer to you around MUST.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToMenu}>Explore what you need <ArrowRight size={17} /></button>
              <a className="secondary-link" href="#how-it-works">See how it works <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero-trust">
              <span><MapPin size={15} /> Around MUST Main Campus</span>
              <span className="trust-divider" />
              <span><ShieldCheck size={15} /> Pay on delivery</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1300&q=90"
                alt="Freshly prepared meal"
                className="hero-photo"
              />
              <div className="hero-image-shade" />
              <div className="hero-image-caption">
                <span className="caption-dot" />
                <span><strong>Good food, closer.</strong><small>Order a little something today.</small></span>
              </div>
            </div>
            <div className="floating-note floating-note-top">
              <span className="floating-note-icon"><MapPin size={17} /></span>
              <span><strong>Pin your spot</strong><small>We bring it to you.</small></span>
            </div>
            <div className="floating-note floating-note-bottom">
              <span className="floating-note-icon yellow"><Zap size={17} /></span>
              <span><strong>Easy ordering</strong><small>Just a few simple steps.</small></span>
            </div>
            <div className="hero-orbit" />
          </div>
        </section>

        <section className="quick-location page-container">
          <div className="quick-location-icon"><MapPin size={20} /></div>
          <div className="quick-location-copy">
            <strong>Where should we bring it?</strong>
            <span>Choose your exact delivery point when you check out.</span>
          </div>
          <button className="text-button" onClick={() => openMap("delivery")}>Set location <ArrowRight size={16} /></button>
        </section>

        <section className="category-section page-container" aria-labelledby="category-heading">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">A LITTLE BIT OF EVERYTHING</span>
              <h2 id="category-heading">What are you in the mood for?</h2>
            </div>
            <p>Pick a category and find what you need.</p>
          </div>
          <div className="category-grid">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  className={"category-card " + category.tone}
                  key={category.name}
                  onClick={() => {
                    setActiveCategory(category.name);
                    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className="category-icon"><Icon size={22} /></span>
                  <span className="category-card-copy"><strong>{category.name}</strong><small>{category.note}</small></span>
                  <span className="category-arrow"><ArrowUpRight size={18} /></span>
                </button>
              );
            })}
          </div>
        </section>

        <section id="menu" className="menu-section page-container">
          <div className="section-heading menu-heading">
            <div>
              <span className="eyebrow">MADE FOR YOUR DAY</span>
              <h2>Find your next favourite.</h2>
              <p className="section-subtitle">A few things to get you started. Add what you need to your order.</p>
            </div>
            <div className="menu-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search food or essentials..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />
              {search && <button aria-label="Clear search" onClick={() => setSearch("")}><X size={15} /></button>}
            </div>
          </div>

          <div className="menu-toolbar">
            <div className="filter-pills">
              {(["All", "Food & drinks", "Essentials"] as const).map((item) => (
                <button
                  className={"filter-pill" + (activeCategory === item ? " active" : "")}
                  key={item}
                  onClick={() => setActiveCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="menu-count">{filteredProducts.length} items</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const quantity = cart.find((item) => item.product.id === product.id)?.quantity ?? 0;
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <img src={product.image} alt={product.name} loading="lazy" />
                      {product.label && <span className="product-tag">{product.label}</span>}
                      <span className="product-category-tag">{product.category === "Food & drinks" ? "FOOD & DRINKS" : "ESSENTIALS"}</span>
                    </div>
                    <div className="product-info">
                      <div className="product-title-row">
                        <div><h3>{product.name}</h3><p>{product.description}</p></div>
                        <strong className="product-price">{formatKES(product.price)}</strong>
                      </div>
                      <div className="product-action-row">
                        <span className="availability-label"><span /> Available to request</span>
                        {quantity > 0 ? (
                          <div className="quantity-control">
                            <button onClick={() => updateQuantity(product.id, -1)} aria-label={"Remove one " + product.name}><Minus size={14} /></button>
                            <span>{quantity}</span>
                            <button onClick={() => updateQuantity(product.id, 1)} aria-label={"Add one " + product.name}><Plus size={14} /></button>
                          </div>
                        ) : (
                          <button className="add-button" onClick={() => addToCart(product)} aria-label={"Add " + product.name}>
                            <Plus size={17} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-search">
              <Search size={24} />
              <strong>No matches found</strong>
              <span>Try another search or browse all items.</span>
              <button className="text-button" onClick={() => { setSearch(""); setActiveCategory("All"); }}>Clear filters</button>
            </div>
          )}
          <div className="menu-note"><Sparkles size={15} /> Looking for something specific? Add a note in your WhatsApp order and we’ll confirm availability.</div>
        </section>

        <section id="services" className="services-section">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">MORE THAN A QUICK BITE</span>
                <h2>Need a hand with something else?</h2>
              </div>
              <p>Tell us what you have in mind. We’ll help you figure out the next step.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article className={"service-card " + service.tone} key={service.id}>
                    <div className="service-icon"><Icon size={25} /></div>
                    <div className="service-card-copy">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <button onClick={() => setRequestType(service.id)}>{service.action} <ArrowRight size={16} /></button>
                    </div>
                    <div className="service-decoration" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-section page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">NO LONG PROCESS</span>
              <h2>Three steps. Sorted.</h2>
            </div>
            <p>Spend less time making a trip and more time getting on with your day.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon"><ShoppingBag size={22} /></div>
              <h3>Choose what you need</h3>
              <p>Browse the items or tell us what you’re looking for.</p>
            </div>
            <div className="step-connector"><span /></div>
            <div className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon"><MapPin size={22} /></div>
              <h3>Pin your location</h3>
              <p>Drop a pin and add a landmark so we know exactly where to meet you.</p>
            </div>
            <div className="step-connector"><span /></div>
            <div className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon"><Bike size={22} /></div>
              <h3>Get it delivered</h3>
              <p>Confirm the details on WhatsApp and pay when your order arrives.</p>
            </div>
          </div>
        </section>

        <section className="location-promo">
          <div className="page-container location-promo-inner">
            <div className="location-promo-icon"><Compass size={27} /></div>
            <div>
              <span className="eyebrow">RIGHT WHERE YOU ARE</span>
              <h2>Not sure how to describe your spot?</h2>
              <p>Use the map to pin your exact meeting point. Add a nearby landmark for extra clarity.</p>
            </div>
            <button className="light-button" onClick={() => openMap("delivery")}>Pin my location <MapPin size={17} /></button>
            <div className="promo-doodle"><MapPin size={78} strokeWidth={1} /></div>
          </div>
        </section>

        <section id="help" className="faq-section page-container">
          <div className="faq-intro">
            <span className="eyebrow">A FEW QUICK ANSWERS</span>
            <h2>Good to know.</h2>
            <p>Still have a question? Send us a message and we’ll help.</p>
            <a className="faq-contact" href="https://wa.me/?text=Hello%20MeruDash%2C%20I%20have%20a%20question." target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> Ask on WhatsApp <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="faq-list">
            {[
              { question: "How do I place an order?", answer: "Choose your items, add them to your order, pin your delivery point and continue to WhatsApp. Check the message and press Send to submit your request." },
              { question: "Can I pay when my order arrives?", answer: "Yes. The current ordering flow is pay on delivery. The final delivery fee and availability are confirmed with you on WhatsApp before dispatch." },
              { question: "How do I share my exact location?", answer: "Choose Use my location or move the pin on the map. You can also add a landmark such as a hostel entrance, lecture hall or the library." },
              { question: "What if I need something that isn't listed?", answer: "Use Quick errands and describe what you need. We’ll confirm whether it can be arranged and let you know the price." },
            ].map((item, index) => (
              <div className={"faq-item" + (faqOpen === index ? " open" : "")} key={item.question}>
                <button onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index}>
                  <span>{item.question}</span>
                  <ChevronDown size={18} />
                </button>
                {faqOpen === index && <p>{item.answer}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-main">
          <a className="brand footer-brand" href="#home">
            <span className="brand-mark"><Bike size={24} /></span>
            <span className="brand-word">meru<span>dash</span><small>Campus convenience, delivered.</small></span>
          </a>
          <p>Little things, made easier around MUST.</p>
          <div className="footer-links">
            <a href="#menu">Explore</a><a href="#services">Services</a><a href="#help">Help</a>
          </div>
        </div>
        <div className="page-container footer-bottom">
          <span>© {new Date().getFullYear()} MeruDash</span>
          <span>Made for campus life.</span>
        </div>
      </footer>

      {itemCount > 0 && !cartOpen && (
        <button className="mobile-cart-bar" onClick={() => setCartOpen(true)}>
          <span className="mobile-cart-count">{itemCount}</span>
          <span>View your order</span>
          <strong>{formatKES(subtotal)}</strong>
          <ArrowRight size={18} />
        </button>
      )}

      {cartOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCartOpen(false);
        }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-heading">
            <div className="drawer-heading">
              <div><span className="eyebrow">YOUR PICKS</span><h2 id="cart-heading">Your order <span>({itemCount})</span></h2></div>
              <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={20} /></button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <span><ShoppingBag size={27} /></span>
                <h3>Your order is empty</h3>
                <p>Find something you need and add it here.</p>
                <button className="primary-button" onClick={() => { setCartOpen(false); scrollToMenu(); }}>Explore items <ArrowRight size={16} /></button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-line" key={item.product.id}>
                      <img src={item.product.image} alt="" />
                      <div className="cart-line-info"><strong>{item.product.name}</strong><span>{formatKES(item.product.price)} each</span><b>{formatKES(item.product.price * item.quantity)}</b></div>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.product.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="drawer-summary">
                  <div><span>Items subtotal</span><strong>{formatKES(subtotal)}</strong></div>
                  <div><span>Delivery fee</span><strong className="pending-fee">Confirmed on WhatsApp</strong></div>
                  <div className="drawer-total"><span>Subtotal</span><strong>{formatKES(subtotal)}</strong></div>
                  <p>We’ll confirm availability and the delivery fee before dispatch.</p>
                  <button className="primary-button full-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Continue to checkout <ArrowRight size={17} /></button>
                  <button className="continue-shopping" onClick={() => setCartOpen(false)}>Keep exploring</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCheckoutOpen(false);
        }}>
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-heading">
            <div className="modal-heading">
              <div><span className="eyebrow">ALMOST THERE</span><h2 id="checkout-heading">Where should we bring it?</h2><p>Share your details and a clear meeting point.</p></div>
              <button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X size={19} /></button>
            </div>
            <form onSubmit={submitOrder}>
              <div className="form-grid">
                <label className="form-field"><span>Your name</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g. Alex" required maxLength={70} /></label>
                <label className="form-field"><span>Phone number</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="07XX XXX XXX" inputMode="tel" required maxLength={20} /></label>
              </div>
              <div className="checkout-location-card">
                <div className="checkout-location-icon"><MapPin size={20} /></div>
                <div className="checkout-location-copy">
                  <strong>{deliveryLocation ? "Delivery point added" : "Add your delivery point"}</strong>
                  <span>{deliveryLocation ? (deliveryLocation.landmark || "MUST campus area") : "Pin the exact place where we should meet you."}</span>
                  {deliveryLocation && <small>{deliveryLocation.lat.toFixed(5)}, {deliveryLocation.lng.toFixed(5)}</small>}
                </div>
                <button type="button" className="outline-small-button" onClick={() => openMap("delivery")}>{deliveryLocation ? "Change" : "Pin location"}</button>
              </div>
              {deliveryLocation && <a className="map-preview-link" href={"https://www.google.com/maps?q=" + deliveryLocation.lat + "," + deliveryLocation.lng} target="_blank" rel="noreferrer"><MapPin size={13} /> Preview your pin on Google Maps <ArrowUpRight size={13} /></a>}
              <div className="checkout-order-summary">
                <div className="summary-title"><strong>Order summary</strong><span>{itemCount} items</span></div>
                {cart.map((item) => <div className="summary-item" key={item.product.id}><span>{item.quantity} × {item.product.name}</span><strong>{formatKES(item.product.price * item.quantity)}</strong></div>)}
                <div className="summary-separator" />
                <div className="summary-item"><span>Items subtotal</span><strong>{formatKES(subtotal)}</strong></div>
                <div className="summary-item"><span>Delivery fee</span><strong className="pending-fee">Confirm on WhatsApp</strong></div>
              </div>
              <div className="payment-note"><ShieldCheck size={17} /><span><strong>Pay on delivery</strong><small>Confirm your order and final delivery fee on WhatsApp first.</small></span><Check size={17} /></div>
              <button className="whatsapp-button full-button" type="submit"><MessageCircle size={19} /> Continue on WhatsApp <ArrowRight size={17} /></button>
              <p className="whatsapp-disclaimer">WhatsApp will open with your order ready. Press Send to submit it.</p>
            </form>
          </section>
        </div>
      )}

      {requestType && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setRequestType(null);
        }}>
          <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-heading">
            <div className="modal-heading">
              <div><span className="eyebrow">{requestType === "parcel" ? "SEND SOMETHING" : "TELL US WHAT YOU NEED"}</span><h2 id="request-heading">{requestType === "parcel" ? "Send a parcel" : "Request an errand"}</h2><p>{requestType === "parcel" ? "Add both points so the parcel gets to the right person." : "Describe what you need and where we should meet you."}</p></div>
              <button className="icon-button" onClick={() => setRequestType(null)} aria-label="Close request"><X size={19} /></button>
            </div>
            <form onSubmit={submitServiceRequest}>
              <div className="form-grid">
                <label className="form-field"><span>Your name</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" required /></label>
                <label className="form-field"><span>Your phone number</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="07XX XXX XXX" inputMode="tel" required /></label>
              </div>
              <label className="form-field request-description"><span>{requestType === "parcel" ? "What are you sending?" : "What do you need help with?"}</span><textarea value={requestDescription} onChange={(event) => setRequestDescription(event.target.value)} placeholder={requestType === "parcel" ? "Describe the parcel (type, size and any special instructions)" : "Tell us what you need, where to get it and any useful details…"} rows={3} required maxLength={500} /></label>

              {requestType === "parcel" ? (
                <div className="request-points">
                  <button type="button" className={"point-select-card" + (pickupLocation ? " selected" : "")} onClick={() => openMap("pickup")}>
                    <span className="point-icon pickup"><MapPin size={18} /></span><span><strong>Collection point</strong><small>{pickupLocation ? (pickupLocation.landmark || "Pin selected") : "Where should it be collected?"}</small></span><ChevronRight size={17} />
                  </button>
                  <button type="button" className={"point-select-card" + (recipientLocation ? " selected" : "")} onClick={() => openMap("recipient")}>
                    <span className="point-icon dropoff"><MapPin size={18} /></span><span><strong>Recipient's delivery point</strong><small>{recipientLocation ? (recipientLocation.landmark || "Pin selected") : "Where should it be delivered?"}</small></span><ChevronRight size={17} />
                  </button>
                </div>
              ) : (
                <button type="button" className={"point-select-card" + (deliveryLocation ? " selected" : "")} onClick={() => openMap("delivery")}>
                  <span className="point-icon dropoff"><MapPin size={18} /></span><span><strong>Delivery point</strong><small>{deliveryLocation ? (deliveryLocation.landmark || "Pin selected") : "Pin where we should meet you"}</small></span><ChevronRight size={17} />
                </button>
              )}
              <button className="whatsapp-button full-button" type="submit"><MessageCircle size={19} /> Send request on WhatsApp <ArrowRight size={17} /></button>
              <p className="whatsapp-disclaimer">We’ll confirm the details and any charges with you before proceeding.</p>
            </form>
          </section>
        </div>
      )}

      <LocationPicker
        open={locationOpen}
        title={mapTitle}
        helper={mapHelper}
        initial={initialMapLocation}
        onClose={() => setLocationOpen(false)}
        onConfirm={handlePinConfirm}
      />

      {toast && <div className="toast-message"><Check size={16} /> {toast}</div>}
    </div>
  );
}

export default App;