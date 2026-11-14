import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight, Check, ChevronDown, ChevronRight, ClipboardList, Compass, Home,
  MapPin, Minus, MoreHorizontal, Package, Plus, Search, ShoppingBag, Utensils,
  X, Zap, Trash2, Smartphone, Banknote,
} from "lucide-react";
import { formatKES, PRODUCTS, type PinLocation, type Product, type ProductCategory } from "./data";

const LocationPicker = lazy(() => import("./LocationPicker"));

type View = "home" | "orders" | "location" | "more";
type RequestType = "errand" | "parcel";
type PaymentMethod = "M-PESA on delivery" | "Cash on delivery";
type MapTarget = "delivery" | "pickup" | "recipient";
type CartItem = { product: Product; quantity: number };
type SavedLine = { id: string; name: string; price: number; quantity: number; description?: string; image?: string };
type SavedOrder = {
  id: string;
  kind: "shopping" | "errand" | "parcel";
  createdAt: string;
  name: string;
  phone: string;
  message: string;
  subtotal: number;
  paymentMethod?: PaymentMethod;
  items: SavedLine[];
  delivery?: PinLocation | null;
  pickup?: PinLocation | null;
  recipient?: PinLocation | null;
};

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const CAMPUS_PHOTO = "https://i0.wp.com/www.must.ac.ke/wp-content/uploads/2020/09/Main-Administration-Block.jpg?resize=1200%2C900&ssl=1";

const categories = [
  { id: "food", title: "Food & drinks", icon: Utensils, tone: "mint" },
  { id: "essentials", title: "Essentials", icon: ShoppingBag, tone: "sand" },
  { id: "errand", title: "Quick errands", icon: Zap, tone: "lavender" },
  { id: "parcel", title: "Send a parcel", icon: Package, tone: "lime" },
] as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeKenyanPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
  if (/^[17]\d{8}$/.test(digits)) return "254" + digits;
  return null;
}

function createOrderId(): string {
  return "MD-" + Date.now().toString(36).slice(-5).toUpperCase();
}

function formatOrderDate(value: string): string {
  return new Date(value).toLocaleString("en-KE", {
    day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
  });
}

function CourierLogo() {
  return <img className="courier-logo" src="/merudash-rider.webp" alt="MeruDash speeding green motorbike rider" />;
}

function MessageCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.5a8.1 8.1 0 0 1-8.2 8.1 8.4 8.4 0 0 1-3.6-.8L4 20l1.2-3.8a8.1 8.1 0 1 1 14.8-4.7Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.3 8.4c.3-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.5.9 1.3 1.6 2.2 2 .2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .3-.2.9-.5 1.2-.4.4-1 .6-1.5.6-1 0-2.4-.6-3.8-1.8-1.6-1.4-2.6-3.2-2.6-4.2 0-.6.2-1.1.5-1.4Z" fill="currentColor" />
    </svg>
  );
}


function ProductImage({ src, alt, compact = false }: { src: string; alt: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={"product-placeholder" + (compact ? " compact" : "")} role="img" aria-label={alt}>
        <ShoppingBag size={compact ? 18 : 24} />
        <span>{alt}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function BottomNavigation({ active, onChange, count }: { active: View; onChange: (view: View) => void; count: number }) {
  const items = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "orders" as const, label: "Orders", icon: ClipboardList },
    { id: "location" as const, label: "Location", icon: MapPin },
    { id: "more" as const, label: "More", icon: MoreHorizontal },
  ];
  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button className={"bottom-nav-item" + (active === item.id ? " active" : "")} key={item.id}
            onClick={() => onChange(item.id)} aria-current={active === item.id ? "page" : undefined}>
            <Icon size={21} strokeWidth={active === item.id ? 2.6 : 2.1} />
            <span>{item.label}</span>
            {item.id === "orders" && count > 0 && <b className="nav-count">{count > 99 ? "99+" : count}</b>}
          </button>
        );
      })}
    </nav>
  );
}

function ProductCard({
  product, quantity, onAdd, onChange,
}: {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onChange: (id: string, change: number) => void;
}) {
  return (
    <article className="product-card">
      <div className="product-photo">
        <ProductImage src={product.image} alt={product.name} />
        {product.label && <span className="product-label">{product.label}</span>}
      </div>
      <div className="product-details">
        <div className="product-name-price"><strong>{product.name}</strong><b>{formatKES(product.price)}</b></div>
        <div className="product-bottom-row">
          <span>{product.category === "Food & drinks" ? "Food & drinks" : "Essentials"}</span>
          {quantity > 0 ? (
            <div className="quantity-control">
              <button onClick={() => onChange(product.id, -1)} aria-label={"Remove one " + product.name}><Minus size={14} /></button>
              <b>{quantity}</b>
              <button onClick={() => onChange(product.id, 1)} aria-label={"Add one " + product.name}><Plus size={14} /></button>
            </div>
          ) : (
            <button className="add-product" onClick={() => onAdd(product)} aria-label={"Add " + product.name}><Plus size={18} /></button>
          )}
        </div>
      </div>
    </article>
  );
}

function App() {
  const [view, setView] = useState<View>("home");
  const [activeCategory, setActiveCategory] = useState<"All" | ProductCategory>("All");
  const [search, setSearch] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>("merudash-cart", []));
  const [orders, setOrders] = useState<SavedOrder[]>(() => readStorage<SavedOrder[]>("merudash-orders", []));
  const [deliveryLocation, setDeliveryLocation] = useState<PinLocation | null>(() => readStorage<PinLocation | null>("merudash-location", null));
  const [customerName, setCustomerName] = useState(() => window.localStorage.getItem("merudash-name") || "");
  const [customerPhone, setCustomerPhone] = useState(() => window.localStorage.getItem("merudash-phone") || "");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<MapTarget>("delivery");
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [requestDescription, setRequestDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState<PinLocation | null>(null);
  const [recipientLocation, setRecipientLocation] = useState<PinLocation | null>(null);
  const [commitmentConfirmed, setCommitmentConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() => readStorage<PaymentMethod>("merudash-payment-method", "M-PESA on delivery"));
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [moreExpanded, setMoreExpanded] = useState<number | null>(0);

  useEffect(() => { window.localStorage.setItem("merudash-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { window.localStorage.setItem("merudash-orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    window.localStorage.setItem("merudash-name", customerName);
    window.localStorage.setItem("merudash-phone", customerPhone);
  }, [customerName, customerPhone]);
  useEffect(() => {
    window.localStorage.setItem("merudash-payment-method", paymentMethod);
  }, [paymentMethod]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      const searchMatch = !query || (product.name + " " + product.description).toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const isBrowsingFiltered = Boolean(search.trim()) || activeCategory !== "All" || showAllProducts;
  const visibleProducts = isBrowsingFiltered ? filteredProducts : PRODUCTS.slice(0, 4);
  const moreProducts = isBrowsingFiltered ? [] : PRODUCTS.slice(4);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id);
      return found
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { product, quantity: 1 }];
    });
    setToast(product.name + " added");
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((current) => current
      .map((item) => item.product.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.product.id !== productId));
    setToast("Item removed from your basket");
  };

  const openMap = (target: MapTarget) => {
    setMapTarget(target);
    setLocationOpen(true);
  };

  const handlePinConfirm = (location: PinLocation) => {
    if (mapTarget === "delivery") {
      setDeliveryLocation(location);
      window.localStorage.setItem("merudash-location", JSON.stringify(location));
    }
    if (mapTarget === "pickup") setPickupLocation(location);
    if (mapTarget === "recipient") setRecipientLocation(location);
    setLocationOpen(false);
    setToast("Location saved");
  };

  const openWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    const url = WHATSAPP_NUMBER
      ? "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encoded
      : "https://wa.me/?text=" + encoded;
    const popup = window.open(url, "_blank");
    if (popup) popup.opener = null;
    else window.location.assign(url);
  };

  const saveOrder = (record: SavedOrder) => {
    setOrders((current) => {
      const exists = current.some((item) => item.id === record.id);
      return exists
        ? current.map((item) => item.id === record.id ? record : item)
        : [record, ...current].slice(0, 30);
    });
    setView("orders");
    setToast(editingOrderId ? "Order changes saved" : "Request saved on this phone");
  };

  const submitShoppingOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = normalizeKenyanPhone(customerPhone);
    if (!customerName.trim()) return setToast("Enter your name");
    if (!normalizedPhone) return setToast("Enter a valid Kenyan mobile number");
    if (!deliveryLocation) return setToast("Pin your delivery point");
    if (!commitmentConfirmed) return setToast("Confirm you can receive and pay for this order");
    if (cart.length === 0) return setToast("Your order is empty");

    const id = editingOrderId || createOrderId();
    const lines: SavedLine[] = cart.map((item) => ({
      id: item.product.id, name: item.product.name, price: item.product.price, quantity: item.quantity,
      description: item.product.description, image: item.product.image,
    }));
    const mapLink = "https://www.google.com/maps?q=" + deliveryLocation.lat + "," + deliveryLocation.lng;
    const message = [
      "MERUDASH ORDER REQUEST · " + id,
      "",
      "Name: " + customerName.trim(),
      "Phone: " + normalizedPhone,
      "",
      "ITEMS",
      ...lines.map((item) => item.quantity + " × " + item.name + " — " + formatKES(item.price * item.quantity)),
      "",
      "Items subtotal: " + formatKES(subtotal),
      "Delivery fee: Please confirm before dispatch.",
      "Final total: To be confirmed with me on WhatsApp.",
      "",
      "DELIVERY POINT",
      "Area: Meru University / MUST Main Campus",
      "Landmark: " + (deliveryLocation.landmark || "See map pin"),
      "Coordinates: " + deliveryLocation.lat.toFixed(6) + ", " + deliveryLocation.lng.toFixed(6),
      "Map: " + mapLink,
      "",
      "Payment method: " + paymentMethod,
      "Commitment: I will be available at the pinned location and pay by " + paymentMethod + " when the order arrives.",
      "Please confirm item availability, the final delivery fee and estimated arrival time before dispatch.",
    ].join("\n");

    saveOrder({
      id, kind: "shopping", createdAt: new Date().toISOString(), name: customerName.trim(),
      phone: normalizedPhone, message, subtotal, paymentMethod, items: lines, delivery: deliveryLocation,
    });
    setCart([]);
    setCheckoutOpen(false);
    setCommitmentConfirmed(false);
    setEditingOrderId(null);
    openWhatsApp(message);
  };

  const submitServiceRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requestType) return;
    const normalizedPhone = normalizeKenyanPhone(customerPhone);
    if (!customerName.trim()) return setToast("Enter your name");
    if (!normalizedPhone) return setToast("Enter a valid Kenyan mobile number");
    if (!requestDescription.trim()) return setToast("Describe what you need");
    if (!commitmentConfirmed) return setToast("Confirm you can receive and pay for this request");
    if (requestType === "parcel" && (!pickupLocation || !recipientLocation)) return setToast("Pin both collection and delivery points");
    if (requestType === "errand" && !deliveryLocation) return setToast("Pin your delivery point");

    const id = createOrderId();
    const lines = [
      "MERUDASH " + (requestType === "parcel" ? "PARCEL REQUEST" : "ERRAND REQUEST") + " · " + id,
      "", "Name: " + customerName.trim(), "Phone: " + normalizedPhone, "",
      "REQUEST", requestDescription.trim(),
    ];
    if (requestType === "parcel" && pickupLocation && recipientLocation) {
      lines.push(
        "", "COLLECTION POINT",
        "Landmark: " + (pickupLocation.landmark || "See map pin"),
        "Map: https://www.google.com/maps?q=" + pickupLocation.lat + "," + pickupLocation.lng,
        "", "RECIPIENT / DELIVERY POINT",
        "Landmark: " + (recipientLocation.landmark || "See map pin"),
        "Map: https://www.google.com/maps?q=" + recipientLocation.lat + "," + recipientLocation.lng,
      );
    } else if (deliveryLocation) {
      lines.push(
        "", "DELIVERY POINT",
        "Landmark: " + (deliveryLocation.landmark || "See map pin"),
        "Map: https://www.google.com/maps?q=" + deliveryLocation.lat + "," + deliveryLocation.lng,
      );
    }
    lines.push(
      "", "Payment method: " + paymentMethod,
      "I confirm this is a genuine request. I will be available at the agreed point and pay by " + paymentMethod + " when it arrives.",
      "Please confirm availability and the final charge before dispatch.",
    );

    const message = lines.join("\n");
    saveOrder({
      id, kind: requestType, createdAt: new Date().toISOString(), name: customerName.trim(),
      phone: normalizedPhone, message, subtotal: 0, paymentMethod, items: [],
      delivery: requestType === "errand" ? deliveryLocation : null,
      pickup: pickupLocation, recipient: recipientLocation,
    });
    setRequestType(null);
    setRequestDescription("");
    setCommitmentConfirmed(false);
    setPickupLocation(null);
    setRecipientLocation(null);
    openWhatsApp(message);
  };

  const openSavedOrder = (order: SavedOrder) => openWhatsApp(order.message);

  const updateSavedOrderQuantity = (orderId: string, productId: string, change: number) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId || order.kind !== "shopping") return order;
      const items = order.items
        .map((item) => item.id === productId ? { ...item, quantity: item.quantity + change } : item)
        .filter((item) => item.quantity > 0);
      const nextSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const mapLink = order.delivery
        ? "https://www.google.com/maps?q=" + order.delivery.lat + "," + order.delivery.lng
        : "";
      const message = [
        "MERUDASH UPDATED ORDER · " + order.id,
        "",
        "Name: " + order.name,
        "Phone: " + order.phone,
        "",
        "ITEMS",
        ...items.map((item) => item.quantity + " × " + item.name + " — " + formatKES(item.price * item.quantity)),
        "",
        "Items subtotal: " + formatKES(nextSubtotal),
        "Delivery fee: Please confirm before dispatch.",
        "Final total: To be confirmed with me on WhatsApp.",
        "",
        "DELIVERY POINT",
        "Area: Meru University / MUST campus",
        "Landmark: " + (order.delivery?.landmark || "See map pin"),
        "Coordinates: " + (order.delivery ? order.delivery.lat.toFixed(6) + ", " + order.delivery.lng.toFixed(6) : "To be confirmed"),
        ...(mapLink ? ["Map: " + mapLink] : []),
        "",
        "Payment method: " + (order.paymentMethod || "M-PESA on delivery"),
        "I confirm I can receive this order and pay the agreed amount on delivery.",
        "Please confirm availability and the delivery fee before dispatch.",
      ].join("\n");
      return { ...order, items, subtotal: nextSubtotal, message };
    }));
    setToast("Order updated. Send the latest details on WhatsApp.");
  };

  const removeSavedOrderItem = (orderId: string, productId: string) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId || order.kind !== "shopping") return order;
      const items = order.items.filter((item) => item.id !== productId);
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const mapLink = order.delivery
        ? "https://www.google.com/maps?q=" + order.delivery.lat + "," + order.delivery.lng
        : "";
      const message = [
        "MERUDASH UPDATED ORDER · " + order.id,
        "",
        "Name: " + order.name,
        "Phone: " + order.phone,
        "",
        "ITEMS",
        ...items.map((item) => item.quantity + " × " + item.name + " — " + formatKES(item.price * item.quantity)),
        "",
        "Items subtotal: " + formatKES(subtotal),
        "Delivery fee: Please confirm before dispatch.",
        "Final total: To be confirmed with me on WhatsApp.",
        "",
        "DELIVERY POINT",
        "Area: Meru University / MUST campus",
        "Landmark: " + (order.delivery?.landmark || "See map pin"),
        "Coordinates: " + (order.delivery ? order.delivery.lat.toFixed(6) + ", " + order.delivery.lng.toFixed(6) : "To be confirmed"),
        ...(mapLink ? ["Map: " + mapLink] : []),
        "",
        "Payment method: " + (order.paymentMethod || "M-PESA on delivery"),
        "I confirm I can receive this order and pay the agreed amount on delivery.",
      ].join("\n");
      return { ...order, items, subtotal, message };
    }));
    setToast("Item removed from saved order");
  };

  const editSavedOrder = (order: SavedOrder) => {
    if (order.kind !== "shopping") {
      setToast("Custom requests can be changed by sending an updated WhatsApp message.");
      openWhatsApp(order.message);
      return;
    }
    const nextCart = order.items
      .map((line) => {
        const product = PRODUCTS.find((item) => item.id === line.id);
        return product ? { product, quantity: line.quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
    if (nextCart.length === 0) {
      setToast("This order has no catalogue items to edit.");
      return;
    }
    setCart(nextCart);
    if (order.delivery) {
      setDeliveryLocation(order.delivery);
      window.localStorage.setItem("merudash-location", JSON.stringify(order.delivery));
    }
    setCustomerName(order.name);
    setCustomerPhone(order.phone);
    setPaymentMethod(order.paymentMethod || "M-PESA on delivery");
    setEditingOrderId(order.id);
    setView("home");
    setCartOpen(true);
  };

  const deleteSavedOrder = (orderId: string) => {
    if (!window.confirm("Delete this saved order from this phone? This does not cancel an order already sent to the team.")) return;
    setOrders((current) => current.filter((order) => order.id !== orderId));
    if (editingOrderId === orderId) setEditingOrderId(null);
    setToast("Saved order deleted from this phone");
  };

  const mapTitle = mapTarget === "pickup"
    ? "Select collection point"
    : mapTarget === "recipient"
      ? "Select recipient location"
      : "Select delivery location";
  const mapHelper = mapTarget === "pickup"
    ? "Pin where the parcel should be collected."
    : mapTarget === "recipient"
      ? "Pin where the recipient will meet the rider."
      : "Move the pin to your exact spot around MUST.";
  const mapInitial = mapTarget === "pickup"
    ? pickupLocation
    : mapTarget === "recipient"
      ? recipientLocation
      : deliveryLocation;

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand-lockup" onClick={() => setView("home")} aria-label="MeruDash home">
          <CourierLogo />
          <span className="brand-name-wrap"><strong>MeruDash</strong><small>Order · Request · Relax</small></span>
        </button>
        <button className="header-order-button" onClick={() => setCartOpen(true)} aria-label={"Open order, " + itemCount + " items"}>
          <ShoppingBag size={20} />
          {itemCount > 0 && <span>{itemCount}</span>}
        </button>
      </header>

      <main className="app-main">
        {view === "home" && (
          <>
            <button className="campus-selector" onClick={() => setView("location")}>
              <span><MapPin size={17} fill="currentColor" /> MUST Campus</span><ChevronDown size={18} />
            </button>
            <section className="home-hero" aria-label="MeruDash around MUST">
              <img src={CAMPUS_PHOTO} alt="Meru University main campus" />
              <div className="home-hero-overlay" />
              <div className="home-hero-copy">
                <span>MERUDASH · MUST</span>
                <h1>What do you<br />need <em>today?</em></h1>
                <p>We deliver around MUST.</p>
              </div>
              <div className="hero-speed-lines" aria-hidden="true"><i /><i /><i /></div>
            </section>

            <label className="home-search">
              <Search size={19} />
              <input type="search" value={search} placeholder="Search food, items or services..."
                onChange={(event) => {
                  setSearch(event.target.value);
                  setActiveCategory("All");
                  setShowAllProducts(false);
                }} aria-label="Search food, items or services" />
              {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}
            </label>

            <section className="quick-actions" aria-label="Choose a service">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button className={"quick-action " + category.tone} key={category.id}
                    onClick={() => {
                      if (category.id === "food" || category.id === "essentials") {
                        setActiveCategory(category.id === "food" ? "Food & drinks" : "Essentials");
                        setSearch("");
                        setShowAllProducts(true);
                        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      } else {
                        setRequestType(category.id);
                        setCommitmentConfirmed(false);
                      }
                    }}>
                    <Icon size={25} strokeWidth={2.3} /><strong>{category.title}</strong>
                  </button>
                );
              })}
            </section>

            <section id="products" className="products-section">
              <div className="section-title-row">
                <div>
                  <span className="section-kicker">{search || activeCategory !== "All" ? "FIND WHAT YOU NEED" : "READY WHEN YOU ARE"}</span>
                  <h2>{search || activeCategory !== "All" ? "Matching items" : "Popular items"}</h2>
                </div>
                {!isBrowsingFiltered
                  ? <button className="see-all-button" onClick={() => setShowAllProducts(true)}>See all <ArrowRight size={15} /></button>
                  : <button className="see-all-button" onClick={() => { setSearch(""); setActiveCategory("All"); setShowAllProducts(false); }}>Clear <X size={14} /></button>}
              </div>
              {filteredProducts.length === 0 ? (
                <div className="empty-results"><Search size={24} /><strong>No items found</strong><span>Try another search.</span></div>
              ) : (
                <div className={isBrowsingFiltered ? "featured-grid all-products-grid" : "featured-grid"}>
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product}
                      quantity={cart.find((item) => item.product.id === product.id)?.quantity ?? 0}
                      onAdd={addToCart} onChange={updateQuantity} />
                  ))}
                </div>
              )}
              {moreProducts.length > 0 && (
                <div className="more-products-block">
                  <div className="section-title-row more-products-title">
                    <div><h3>More around campus</h3><span>Swipe to see more</span></div><span className="swipe-cue" aria-hidden="true">→</span>
                  </div>
                  <div className="horizontal-products">
                    {moreProducts.map((product) => (
                      <ProductCard key={product.id} product={product}
                        quantity={cart.find((item) => item.product.id === product.id)?.quantity ?? 0}
                        onAdd={addToCart} onChange={updateQuantity} />
                    ))}
                  </div>
                </div>
              )}
              <p className="price-note">Prices and availability are confirmed with you before dispatch.</p>
            </section>
          </>
        )}

        {view === "orders" && (
          <section className="subpage">
            <div className="subpage-heading">
              <span className="section-kicker">YOUR BASKET & REQUESTS</span>
              <h1>My orders</h1>
              <p>Check your items, change quantities or continue to checkout.</p>
            </div>

            <section className="active-basket-card" aria-labelledby="basket-heading">
              <div className="basket-heading-row">
                <div><span className="section-kicker">CURRENT BASKET</span><h2 id="basket-heading">Your items</h2></div>
                <span className="basket-count">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
              </div>
              {cart.length === 0 ? (
                <div className="basket-empty">
                  <ShoppingBag size={25} />
                  <strong>Your basket is empty</strong>
                  <span>Add food or essentials to see them here.</span>
                  <button className="primary-button" onClick={() => setView("home")}>Browse items <ArrowRight size={15} /></button>
                </div>
              ) : (
                <>
                  <div className="basket-item-list">
                    {cart.map((item) => (
                      <article className="basket-item" key={item.product.id}>
                        <ProductImage src={item.product.image} alt={item.product.name} compact />
                        <div className="basket-item-info">
                          <strong>{item.product.name}</strong>
                          <small>{item.product.description}</small>
                          <span>{formatKES(item.product.price)} each</span>
                          <b>{formatKES(item.product.price * item.quantity)}</b>
                        </div>
                        <div className="basket-item-actions">
                          <div className="quantity-control">
                            <button onClick={() => updateQuantity(item.product.id, -1)} aria-label={"Decrease " + item.product.name}><Minus size={13} /></button>
                            <b>{item.quantity}</b>
                            <button onClick={() => updateQuantity(item.product.id, 1)} aria-label={"Increase " + item.product.name}><Plus size={13} /></button>
                          </div>
                          <button className="basket-remove-button" onClick={() => removeFromCart(item.product.id)} aria-label={"Remove " + item.product.name}>
                            <Trash2 size={15} /><span>Remove</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="basket-total-block">
                    <div><span>Items subtotal</span><strong>{formatKES(subtotal)}</strong></div>
                    <div><span>Delivery fee</span><strong>Confirmed before dispatch</strong></div>
                    <div className="basket-grand-total"><span>Amount before delivery</span><strong>{formatKES(subtotal)}</strong></div>
                    <button className="primary-button full-width" onClick={() => { setCheckoutOpen(true); setCommitmentConfirmed(false); }}>
                      Continue to checkout <ArrowRight size={17} />
                    </button>
                    <p>Final delivery charge and total are agreed with you before dispatch.</p>
                  </div>
                </>
              )}
            </section>

            {orders.length > 0 && (
              <section className="saved-orders-section">
                <div className="basket-heading-row">
                  <div><span className="section-kicker">RECENT REQUESTS</span><h2>Order history</h2></div>
                  <span className="basket-count">{orders.length}</span>
                </div>
                <div className="orders-list">
                  {orders.map((order) => (
                    <article className="order-card" key={order.id}>
                      <div className="order-card-top">
                        <div>
                          <span className="order-type">{order.kind === "shopping" ? "SHOPPING ORDER" : order.kind === "parcel" ? "PARCEL REQUEST" : "ERRAND REQUEST"}</span>
                          <strong>{order.id}</strong>
                        </div>
                        <span className="order-state">Saved on this phone</span>
                      </div>
                      <div className="order-card-meta">
                        <span>{formatOrderDate(order.createdAt)}</span>
                        <span>{order.items.length ? order.items.reduce((sum, item) => sum + item.quantity, 0) + " items" : "Custom request"}</span>
                      </div>
                      {order.items.length > 0 && (
                        <div className="saved-order-lines">
                          {order.items.map((item) => {
                            const product = PRODUCTS.find((entry) => entry.id === item.id);
                            return (
                              <div className="saved-order-line" key={item.id}>
                                <ProductImage src={item.image || product?.image || ""} alt={item.name} compact />
                                <div className="saved-order-line-info">
                                  <strong>{item.name}</strong>
                                  <small>{item.description || product?.description || "Campus item"}</small>
                                  <span>{formatKES(item.price)} each</span>
                                  <b>{formatKES(item.price * item.quantity)}</b>
                                </div>
                                <div className="saved-order-line-actions">
                                  <div className="quantity-control">
                                    <button onClick={() => updateSavedOrderQuantity(order.id, item.id, -1)} aria-label={"Decrease " + item.name}><Minus size={12} /></button>
                                    <b>{item.quantity}</b>
                                    <button onClick={() => updateSavedOrderQuantity(order.id, item.id, 1)} aria-label={"Increase " + item.name}><Plus size={12} /></button>
                                  </div>
                                  <button className="basket-remove-button" onClick={() => removeSavedOrderItem(order.id, item.id)} aria-label={"Remove " + item.name + " from saved order"}>
                                    <Trash2 size={14} /><span>Remove</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {order.subtotal > 0 && <div className="order-subtotal"><span>Items subtotal</span><strong>{formatKES(order.subtotal)}</strong></div>}
                      {order.paymentMethod && <p className="order-location-note"><Banknote size={13} /> {order.paymentMethod}</p>}
                      {order.delivery && (
                        <div className="saved-order-location">
                          <MapPin size={14} />
                          <div>
                            <strong>{order.delivery.landmark || "MUST Main Campus pin"}</strong>
                            <small>{order.delivery.lat.toFixed(5)}, {order.delivery.lng.toFixed(5)}</small>
                          </div>
                          <a href={"https://www.google.com/maps?q=" + order.delivery.lat + "," + order.delivery.lng} target="_blank" rel="noreferrer">Map</a>
                        </div>
                      )}
                      <div className="order-tracking-strip">
                        <span className="tracking-step done"><i><Check size={11} /></i><b>Saved here</b></span>
                        <span className="tracking-line" />
                        <span className="tracking-step"><i>2</i><b>Team confirmation</b></span>
                        <span className="tracking-line" />
                        <span className="tracking-step"><i>3</i><b>Delivery</b></span>
                      </div>
                      <div className="order-card-actions">
                        {order.kind === "shopping" && <button className="order-edit-button" onClick={() => editSavedOrder(order)}>Edit items <Plus size={14} /></button>}
                        <button className="order-whatsapp-button" onClick={() => openSavedOrder(order)}>Continue in WhatsApp <ArrowRight size={16} /></button>
                        <button className="order-delete-button" onClick={() => deleteSavedOrder(order.id)} aria-label={"Delete " + order.id}><X size={15} /></button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
            <p className="local-note">The basket and request history are saved on this device. A request is confirmed only after the team replies on WhatsApp.</p>
          </section>
        )}

        {view === "location" && (
          <section className="subpage">
            <div className="subpage-heading">
              <span className="section-kicker">DELIVERY LOCATION</span>
              <h1>Track your delivery</h1>
              <p>Your chosen meeting point and the latest order update.</p>
            </div>
            {orders[0] && (
              <div className="delivery-update-card">
                <div>
                  <span className="section-kicker">LATEST REQUEST</span>
                  <strong>{orders[0].id}</strong>
                  <small>Saved on this phone · Awaiting team confirmation</small>
                </div>
                <button onClick={() => openWhatsApp("Hello MeruDash, please share an update for my request " + orders[0].id + ".")}>
                  Ask for update <MessageCircleIcon />
                </button>
              </div>
            )}
            <div className="location-screen-card">
              <button className="location-screen-map" onClick={() => openMap("delivery")} aria-label="Change delivery point on map">
                <MapPin size={34} fill="currentColor" />
                <span>{deliveryLocation ? "Pinned point around MUST" : "MUST Main Campus"}</span>
                <small>Tap to set or adjust your pin</small>
              </button>
              <div className="location-screen-details">
                <span className="detail-kicker">SAVED DELIVERY POINT</span>
                <strong>{deliveryLocation?.landmark || (deliveryLocation ? "MUST Main Campus area" : "No location saved yet")}</strong>
                {deliveryLocation && (
                  <>
                    <small className="location-coordinate-text">{deliveryLocation.lat.toFixed(6)}, {deliveryLocation.lng.toFixed(6)}</small>
                    <a className="map-external-link" href={"https://www.google.com/maps?q=" + deliveryLocation.lat + "," + deliveryLocation.lng} target="_blank" rel="noreferrer">Open pinned point in Maps <ArrowRight size={14} /></a>
                  </>
                )}
                <button className="primary-button full-width" onClick={() => openMap("delivery")}>{deliveryLocation ? "Change location" : "Pin my location"} <MapPin size={16} /></button>
              </div>
            </div>
            <div className="location-tip"><Compass size={20} /><span><strong>Make the handover easy.</strong><small>Share a clear landmark such as outside the library, hostel gate or Block A entrance.</small></span></div>
            <p className="local-note">The map pin and landmark are included in each order sent to WhatsApp. Live rider GPS is not connected yet; ask the team for a delivery update on WhatsApp.</p>
          </section>
        )}

        {view === "more" && (
          <section className="subpage">
            <div className="subpage-heading"><span className="section-kicker">A FEW DETAILS</span><h1>More</h1><p>Quick answers and a direct line to MeruDash.</p></div>
            <div className="more-contact-card">
              <div className="more-contact-icon"><MessageCircleIcon /></div>
              <div><strong>Need help with an order?</strong><span>Ask the MeruDash team on WhatsApp.</span></div>
              <button onClick={() => openWhatsApp("Hello MeruDash, I need help with an order.")} aria-label="Contact MeruDash"><ArrowRight size={18} /></button>
            </div>
            <div className="more-list">
              {[
                { title: "How do I order?", body: "Choose items, add them to your order, pin your delivery point and send the prepared message in WhatsApp." },
                { title: "How do I know my order is accepted?", body: "A request saved on this phone is not yet accepted. Wait for the team to confirm item availability, the delivery fee and an estimated arrival time in WhatsApp." },
                { title: "How do I check my delivery?", body: "When the rider arrives, check the items and the agreed total before paying. Message the team if anything is missing or does not match your order." },
                { title: "When do I pay?", body: "The current flow is pay on delivery. Confirm the delivery fee and final total with the team on WhatsApp before dispatch." },
                { title: "Can I request an unlisted item?", body: "Choose Quick errands and describe what you need. The team will confirm whether it can be arranged and tell you the price." },
                { title: "How do I follow my delivery?", body: "The Location tab keeps your pinned meeting point and lets you ask the team for an update on WhatsApp. Live rider GPS is not connected yet." },
              ].map((item, index) => (
                <div className={"more-list-item" + (moreExpanded === index ? " expanded" : "")} key={item.title}>
                  <button onClick={() => setMoreExpanded(moreExpanded === index ? null : index)} aria-expanded={moreExpanded === index}>
                    <strong>{item.title}</strong><ChevronDown size={17} />
                  </button>
                  {moreExpanded === index && <p>{item.body}</p>}
                </div>
              ))}
            </div>
            <div className="service-area-note"><MapPin size={17} /><span>Currently serving around Meru University, Main Campus.</span></div>
          </section>
        )}
      </main>

      <BottomNavigation active={view} onChange={setView} count={itemCount} />

      {cartOpen && (
        <div className="sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <section className="bottom-sheet cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="sheet-handle" />
            <div className="sheet-title-row"><div><span className="section-kicker">YOUR PICKS</span><h2 id="cart-title">Your order <small>({itemCount})</small></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close order"><X size={20} /></button></div>
            {cart.length === 0 ? (
              <div className="sheet-empty"><ShoppingBag size={28} /><strong>Your order is empty</strong><button className="primary-button" onClick={() => { setCartOpen(false); setView("home"); }}>Browse items <ArrowRight size={16} /></button></div>
            ) : (
              <>
                <div className="cart-lines">
                  {cart.map((item) => (
                    <div className="cart-line" key={item.product.id}>
                      <ProductImage src={item.product.image} alt={item.product.name} compact />
                      <div className="cart-line-copy"><strong>{item.product.name}</strong><span>{formatKES(item.product.price)} each</span><b>{formatKES(item.product.price * item.quantity)}</b></div>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.product.id, -1)} aria-label={"Remove one " + item.product.name}><Minus size={14} /></button>
                        <b>{item.quantity}</b>
                        <button onClick={() => updateQuantity(item.product.id, 1)} aria-label={"Add one " + item.product.name}><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Items subtotal</span><strong>{formatKES(subtotal)}</strong></div>
                  <div><span>Delivery fee</span><strong>Confirmed before dispatch</strong></div>
                  <button className="primary-button full-width" onClick={() => { setCartOpen(false); setCheckoutOpen(true); setCommitmentConfirmed(false); }}>Review order <ArrowRight size={17} /></button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {checkoutOpen && (
        <div className="sheet-backdrop checkout-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
          <section className="bottom-sheet checkout-sheet" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <div className="sheet-handle" />
            <div className="sheet-title-row"><div><span className="section-kicker">ALMOST THERE</span><h2 id="checkout-title">Review your order</h2></div><button className="close-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X size={20} /></button></div>
            <div className="checkout-success-banner"><span><Check size={22} /></span><div><strong>One last check</strong><small>Confirm your details before sending.</small></div></div>
            <form onSubmit={submitShoppingOrder}>
              <div className="checkout-field-grid">
                <label className="form-field"><span>Your name</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" autoComplete="name" maxLength={70} required /></label>
                <label className="form-field"><span>Phone number</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="07XX XXX XXX" inputMode="tel" autoComplete="tel" maxLength={20} required /></label>
              </div>
              <div className="checkout-location-row">
                <div className="checkout-location-icon"><MapPin size={19} /></div>
                <div><strong>{deliveryLocation ? (deliveryLocation.landmark || "MUST Main Campus") : "Add your delivery point"}</strong><small>{deliveryLocation ? "Location pin saved" : "Pin your exact meeting point"}</small></div>
                <button type="button" onClick={() => openMap("delivery")}>{deliveryLocation ? "Edit" : "Pin"}</button>
              </div>
              {deliveryLocation && <a className="checkout-map-link" href={"https://www.google.com/maps?q=" + deliveryLocation.lat + "," + deliveryLocation.lng} target="_blank" rel="noreferrer">Preview location on map <ArrowRight size={13} /></a>}
              <div className="checkout-items">
                <div className="checkout-items-heading"><strong>Items</strong><span>{itemCount} items</span></div>
                {cart.map((item) => (
                  <div className="checkout-item-line" key={item.product.id}>
                    <ProductImage src={item.product.image} alt={item.product.name} compact />
                    <div><strong>{item.product.name}</strong><small>Qty: {item.quantity}</small></div>
                    <b>{formatKES(item.product.price * item.quantity)}</b>
                  </div>
                ))}
              </div>
              <div className="checkout-totals">
                <div><span>Items subtotal</span><strong>{formatKES(subtotal)}</strong></div>
                <div><span>Delivery fee</span><strong>Confirm on WhatsApp</strong></div>
                <div className="checkout-grand-total"><span>Final total</span><strong>{formatKES(subtotal)} + delivery</strong></div>
              </div>
              <div className="payment-method-picker">
                <span className="form-field-label">How will you pay when it arrives?</span>
                <div className="payment-method-options">
                  <button type="button" className={"payment-method-option" + (paymentMethod === "M-PESA on delivery" ? " selected" : "")} onClick={() => setPaymentMethod("M-PESA on delivery")}>
                    <Smartphone size={19} /><span><strong>M-PESA</strong><small>Pay the rider on delivery</small></span>{paymentMethod === "M-PESA on delivery" && <Check size={16} />}
                  </button>
                  <button type="button" className={"payment-method-option" + (paymentMethod === "Cash on delivery" ? " selected" : "")} onClick={() => setPaymentMethod("Cash on delivery")}>
                    <Banknote size={19} /><span><strong>Cash</strong><small>Pay when your order arrives</small></span>{paymentMethod === "Cash on delivery" && <Check size={16} />}
                  </button>
                </div>
              </div>
              <label className="commitment-check">
                <input type="checkbox" checked={commitmentConfirmed} onChange={(event) => setCommitmentConfirmed(event.target.checked)} />
                <span>I confirm this is a genuine order. I will be at the pinned location and pay by {paymentMethod} once the final amount is agreed.</span>
              </label>
              <button className="whatsapp-submit" type="submit"><MessageCircleIcon /> {editingOrderId ? "Update order on WhatsApp" : "Send order on WhatsApp"} <ArrowRight size={17} /></button>
              <p className="form-footnote">Your order is only dispatched after the team confirms availability and you approve the final delivery charge.</p>
            </form>
          </section>
        </div>
      )}

      {requestType && (
        <div className="sheet-backdrop request-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRequestType(null); }}>
          <section className="bottom-sheet request-sheet" role="dialog" aria-modal="true" aria-labelledby="request-title">
            <div className="sheet-handle" />
            <div className="sheet-title-row"><div><span className="section-kicker">{requestType === "parcel" ? "SEND SOMETHING" : "GET A HAND"}</span><h2 id="request-title">{requestType === "parcel" ? "Send a parcel" : "Quick errand"}</h2></div><button className="close-button" onClick={() => setRequestType(null)} aria-label="Close request"><X size={20} /></button></div>
            <form onSubmit={submitServiceRequest}>
              <div className="checkout-field-grid">
                <label className="form-field"><span>Your name</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" required /></label>
                <label className="form-field"><span>Phone number</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="07XX XXX XXX" inputMode="tel" required /></label>
              </div>
              <label className="form-field"><span>{requestType === "parcel" ? "What are you sending?" : "What do you need?"}</span><textarea value={requestDescription} onChange={(event) => setRequestDescription(event.target.value)} placeholder={requestType === "parcel" ? "Briefly describe the parcel." : "Write what you need in one or two lines."} rows={3} maxLength={350} required /></label>
              {requestType === "parcel" ? (
                <div className="request-location-stack">
                  <button type="button" className="request-location-row" onClick={() => openMap("pickup")}><MapPin size={18} /><span><strong>Collection point</strong><small>{pickupLocation?.landmark || (pickupLocation ? "Pin saved" : "Where to collect it")}</small></span><ChevronRight size={18} /></button>
                  <button type="button" className="request-location-row" onClick={() => openMap("recipient")}><MapPin size={18} /><span><strong>Recipient point</strong><small>{recipientLocation?.landmark || (recipientLocation ? "Pin saved" : "Where to deliver it")}</small></span><ChevronRight size={18} /></button>
                </div>
              ) : (
                <button type="button" className="request-location-row" onClick={() => openMap("delivery")}><MapPin size={18} /><span><strong>Delivery point</strong><small>{deliveryLocation?.landmark || (deliveryLocation ? "Pin saved" : "Pin where to meet")}</small></span><ChevronRight size={18} /></button>
              )}
              <div className="payment-method-picker compact-payment-picker">
                <span className="form-field-label">Payment on delivery</span>
                <div className="payment-method-options">
                  <button type="button" className={"payment-method-option" + (paymentMethod === "M-PESA on delivery" ? " selected" : "")} onClick={() => setPaymentMethod("M-PESA on delivery")}><Smartphone size={18} /><span><strong>M-PESA</strong><small>On delivery</small></span>{paymentMethod === "M-PESA on delivery" && <Check size={15} />}</button>
                  <button type="button" className={"payment-method-option" + (paymentMethod === "Cash on delivery" ? " selected" : "")} onClick={() => setPaymentMethod("Cash on delivery")}><Banknote size={18} /><span><strong>Cash</strong><small>On delivery</small></span>{paymentMethod === "Cash on delivery" && <Check size={15} />}</button>
                </div>
              </div>
              <label className="commitment-check">
                <input type="checkbox" checked={commitmentConfirmed} onChange={(event) => setCommitmentConfirmed(event.target.checked)} />
                <span>This is a genuine request. I will be available at the agreed point and pay by {paymentMethod} when it arrives.</span>
              </label>
              <button className="whatsapp-submit" type="submit"><MessageCircleIcon /> Send request on WhatsApp <ArrowRight size={17} /></button>
              <p className="form-footnote">The team confirms the request and charge with you before dispatch.</p>
            </form>
          </section>
        </div>
      )}

      {locationOpen && (
        <Suspense fallback={<div className="map-load-overlay"><div className="map-load-card"><span className="map-load-spinner" />Opening map…</div></div>}>
          <LocationPicker open={locationOpen} title={mapTitle} helper={mapHelper} initial={mapInitial}
            onClose={() => setLocationOpen(false)} onConfirm={handlePinConfirm} />
        </Suspense>
      )}
      {toast && <div className="toast-message"><Check size={16} />{toast}</div>}
    </div>
  );
}

export default App;
