import { useEffect, useRef, useState, useCallback } from "react";
import { ShoppingBag, ArrowUpRight, X, ChevronRight, Check } from "lucide-react";

const BG_IMAGE_1 = "/images/hero-1.png";
const BG_IMAGE_2 = "/images/hero-2.png";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Michroma&family=Orbitron:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

/* ---------------------------------------------------------------------- */
/* Corner bracket SVGs                                                     */
/* ---------------------------------------------------------------------- */
function Corner({ pos, size = "var(--corner)", className = "" }) {
  const paths = {
    tl: "M0 11.5V0.5H11.5",
    tr: "M0.5 0.5H11.5V11.5",
    bl: "M0 0.5V11.5H11.5",
    br: "M0.5 11.5H11.5V0.5",
  };
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
      fill="none"
    >
      <path d={paths[pos]} stroke="black" strokeWidth="1.5" />
    </svg>
  );
}

function WireframeGlobe() {
  return (
    <svg
      viewBox="0 0 64 64"
      style={{ width: "var(--globe)", height: "var(--globe)" }}
      fill="none"
    >
      <circle cx="32" cy="32" r="28" stroke="black" strokeWidth="1.2" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="black" strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="28" ry="11" stroke="black" strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="28" ry="22" stroke="black" strokeWidth="1.2" />
      <line x1="32" y1="4" x2="32" y2="60" stroke="black" strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="11" ry="28" stroke="black" strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="22" ry="28" stroke="black" strokeWidth="1.2" />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Desktop interactive dual-image reveal background                       */
/* ---------------------------------------------------------------------- */
function ImageRevealBackground() {
  const containerRef = useRef(null);
  const revealRef = useRef(null);
  const canvasRef = useRef(null);
  const patternRef = useRef(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const cellRef = useRef(48);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;

    const setInitial = () => {
      mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      smoothRef.current = { ...mouseRef.current };
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cellRef.current = Math.round(
        Math.min(64, Math.max(36, window.innerWidth * 0.028))
      );
    };
    setInitial();

    const handlePointerMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cellRef.current = Math.round(
        Math.min(64, Math.max(36, window.innerWidth * 0.028))
      );
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("resize", handleResize);

    const ctx = canvas.getContext("2d");

    const tick = () => {
      const mouse = mouseRef.current;
      const smooth = smoothRef.current;
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      const radius = Math.round(
        Math.min(420, Math.max(160, window.innerWidth * 0.16))
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createRadialGradient(
        smooth.x,
        smooth.y,
        0,
        smooth.x,
        smooth.y,
        radius
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,1)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0.75)");
      gradient.addColorStop(0.75, "rgba(255,255,255,0.4)");
      gradient.addColorStop(0.88, "rgba(255,255,255,0.12)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (revealRef.current) {
        const dataUrl = canvas.toDataURL();
        revealRef.current.style.maskImage = `url(${dataUrl})`;
        revealRef.current.style.webkitMaskImage = `url(${dataUrl})`;
        revealRef.current.style.maskSize = "100% 100%";
        revealRef.current.style.webkitMaskSize = "100% 100%";
      }

      // parallax grid
      const cx = smooth.x / window.innerWidth - 0.5;
      const cy = smooth.y / window.innerHeight - 0.5;
      const go = gridOffsetRef.current;
      go.x += (cx * 16 - go.x) * 0.06;
      go.y += (cy * 16 - go.y) * 0.06;
      if (patternRef.current) {
        patternRef.current.setAttribute("x", String(go.x));
        patternRef.current.setAttribute("y", String(go.y));
        const cell = cellRef.current;
        patternRef.current.setAttribute("width", String(cell));
        patternRef.current.setAttribute("height", String(cell));
        const path = patternRef.current.firstElementChild;
        if (path) {
          path.setAttribute("d", `M ${cell} 0 L 0 0 0 ${cell}`);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="block fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${BG_IMAGE_1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        ref={revealRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${BG_IMAGE_2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1 }}>
        <defs>
          <pattern
            ref={patternRef}
            id="lgpsm-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgpsm-grid)" />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Drawer                                                                   */
/* ---------------------------------------------------------------------- */
function Drawer({ open, onClose, title, children, footer }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 250ms ease",
          zIndex: 30,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "var(--drawer-max)",
          background: "white",
          borderLeft: "1px solid #d1d5db",
          padding: "var(--drawer-pad)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease",
          zIndex: 31,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
          <h2
            className="font-orbitron font-bold uppercase"
            style={{ fontSize: "var(--nav)", letterSpacing: "0.1em" }}
          >
            {title}
          </h2>
          <button onClick={onClose} className="hover:opacity-50" aria-label="Close">
            <X style={{ width: "var(--icon)", height: "var(--icon)" }} strokeWidth={1.5} />
          </button>
        </div>
        <div style={{ flex: 1 }}>{children}</div>
        <div style={{ marginTop: "1.5rem" }}>
          {footer ? (
            footer
          ) : (
            <p
              className="font-jakarta text-gray-500 uppercase text-center"
              style={{ fontSize: "var(--micro)", letterSpacing: "0.15em" }}
            >
              LGPSM © 2026 — FUTURE FORWARD FASHION
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Data                                                                     */
/* ---------------------------------------------------------------------- */
const SHOP_ITEMS = [
  { title: "CYBER-TEX OVERCOAT", price: 850, tag: "LIMITED EDITION" },
  { title: "GEO-MESH TECH HOODIE", price: 320, tag: "NEW DROP" },
  { title: "ORBITAL TAPERED TROUSERS", price: 290, tag: "IN STOCK" },
  { title: "MODULAR ALL-WEATHER VEST", price: 410, tag: "PRE-ORDER" },
];

const COLLECTIONS = [
  {
    title: "SERIES 01 — SYNTHETIC HORIZONS",
    desc: "Ultra-durable weather-sealed fabrics with minimalist silhouette architecture.",
  },
  {
    title: "SERIES 02 — KINETIC FORM",
    desc: "Ergonomic streetwear designed for maximum mobility and temperature equilibrium.",
  },
  {
    title: "SERIES 03 — MONOCHROME ZERO",
    desc: "Pure black and white structural tailoring crafted from 100% recycled polymers.",
  },
];

const JOURNAL_ITEMS = [
  {
    date: "AUG 2026",
    title: "THE ARCHITECTURE OF NEXT-GEN TEXTILES",
    read: "4 MIN READ",
  },
  {
    date: "JUL 2026",
    title: "CIRCULAR DESIGN IN HIGH-END APPAREL",
    read: "6 MIN READ",
  },
  {
    date: "JUN 2026",
    title: "MINIMALISM AS A FUNCTIONAL STATEMENT",
    read: "3 MIN READ",
  },
];

/* ---------------------------------------------------------------------- */
/* Main app                                                                  */
/* ---------------------------------------------------------------------- */
export default function LGPSMLanding() {
  const [drawer, setDrawer] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const toastTimeout = useRef(null);

  useEffect(() => {
    if (document.getElementById("lgpsm-fonts")) return;
    const link = document.createElement("link");
    link.id = "lgpsm-fonts";
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.title === item.title);
      if (existing) {
        return prev.map((p) =>
          p.title === item.title ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`Added "${item.title}" to your shopping bag.`);
  };

  const removeFromCart = (title) => {
    setCart((prev) => prev.filter((p) => p.title !== title));
  };

  const checkout = () => {
    setCart([]);
    setDrawer(null);
    showToast("Order submitted successfully!");
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const closeDrawer = () => setDrawer(null);

  return (
    <div
      className="min-h-screen bg-white text-black font-jakarta flex flex-col justify-between relative overflow-hidden"
      style={{
        "--pad-x": "clamp(1.25rem, 4.5vw, 5rem)",
        "--pad-y": "clamp(1rem, 3vh, 4rem)",
        "--header-pt": "clamp(1.25rem, 2.5vh, 2.5rem)",
        "--gap-nav": "clamp(1rem, 2.2vw, 2.25rem)",
        "--logo": "clamp(1.35rem, 1.2vw + 0.9rem, 2.1rem)",
        "--logo-deg": "clamp(0.65rem, 0.4vw + 0.45rem, 0.9rem)",
        "--nav": "clamp(0.65rem, 0.35vw + 0.5rem, 0.875rem)",
        "--headline": "clamp(2.15rem, 4.5vw + 0.75rem, 5.25rem)",
        "--body": "clamp(0.7rem, 0.35vw + 0.55rem, 0.9rem)",
        "--micro": "clamp(0.55rem, 0.25vw + 0.45rem, 0.7rem)",
        "--btn-px": "clamp(1.15rem, 1.4vw, 1.75rem)",
        "--btn-py": "clamp(0.6rem, 0.9vh, 0.85rem)",
        "--btn-gap": "clamp(0.75rem, 1vw, 1.1rem)",
        "--feature-pad": "clamp(1rem, 1.5vw, 1.75rem)",
        "--feature-min": "clamp(13rem, 18vw, 20rem)",
        "--globe": "clamp(2.25rem, 2.5vw + 1rem, 3.25rem)",
        "--checker-w": "clamp(2.75rem, 4.5vw, 6.5rem)",
        "--checker-h": "clamp(1.35rem, 2.2vw, 3rem)",
        "--corner": "clamp(0.65rem, 0.4vw + 0.4rem, 0.95rem)",
        "--icon": "clamp(1rem, 0.6vw + 0.7rem, 1.35rem)",
        "--drawer-pad": "clamp(1.25rem, 2.5vw, 2.25rem)",
        "--drawer-max": "clamp(18rem, 28vw, 28rem)",
        "--section-gap": "clamp(0.75rem, 1.5vh, 1.5rem)",
        "--main-py": "clamp(1.25rem, 4vh, 4rem)",
      }}
    >
      <style>{`
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::selection { background: black; color: white; }
        .lgpsm-feature-block {
          position: absolute;
          right: 1cm;
          bottom: 1cm;
        }
        @media (max-width: 767px) {
          .lgpsm-feature-block {
            position: static;
            margin-top: 2.5rem;
            margin-left: auto;
            margin-right: 0;
          }
        }
      `}</style>

      <ImageRevealBackground />

      {/* Header */}
      <header
        className="relative z-20 flex items-center justify-between"
        style={{
          paddingInline: "var(--pad-x)",
          paddingTop: "var(--header-pt)",
          paddingBottom: "var(--section-gap)",
        }}
      >
        <button
          onClick={closeDrawer}
          className="font-orbitron hover:opacity-80"
          style={{
            fontWeight: 900,
            letterSpacing: "0.15em",
            fontSize: "var(--logo)",
          }}
        >
          LGPSM
          <span
            className="ml-0.5 -mt-0.5 inline-block align-top"
            style={{ fontSize: "var(--logo-deg)" }}
          >
            ˚
          </span>
        </button>

        <nav
          className="flex items-center font-jakarta font-medium uppercase"
          style={{
            gap: "var(--gap-nav)",
            letterSpacing: "0.2em",
            fontSize: "var(--nav)",
          }}
        >
          <button onClick={() => setDrawer("shop")} className="hover:opacity-50">
            SHOP
          </button>
          <button onClick={() => setDrawer("collections")} className="hover:opacity-50">
            COLLECTIONS
          </button>
          <button onClick={() => setDrawer("journal")} className="hover:opacity-50">
            JOURNAL
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setDrawer("cart")}
            className="relative hover:opacity-50"
            aria-label="Cart"
          >
            <ShoppingBag style={{ width: "var(--icon)", height: "var(--icon)" }} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span
                className="absolute flex items-center justify-center bg-black text-white rounded-full"
                style={{
                  top: "-0.45rem",
                  right: "-0.55rem",
                  width: "1rem",
                  height: "1rem",
                  fontSize: "0.6rem",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main
        className="relative z-10 flex-1 flex flex-col lg:flex-row lg:justify-between"
        style={{ paddingInline: "var(--pad-x)", paddingBlock: "var(--main-py)" }}
      >
        {/* Left block */}
        <div
          className="flex flex-col justify-center"
          style={{
            gap: "var(--section-gap)",
            transform: "translateY(calc(clamp(3rem, 14vh, 9rem) - 3cm))",
          }}
        >
          <Corner pos="tl" />
          <h1
            className="font-orbitron font-extrabold uppercase"
            style={{
              letterSpacing: "0.08em",
              lineHeight: 1.05,
              fontSize: "var(--headline)",
              fontWeight: 800,
            }}
          >
            FUTURE
            <br />
            FORWARD
            <br />
            FASHION
          </h1>
          <Corner pos="bl" />

          <button
            onClick={() => setDrawer("shop")}
            className="group inline-flex items-center w-fit border rounded-md uppercase font-jakarta hover:bg-black hover:text-white transition-colors"
            style={{
              borderColor: "#9ca3af",
              gap: "var(--btn-gap)",
              letterSpacing: "0.18em",
              fontSize: "var(--body)",
              paddingInline: "var(--btn-px)",
              paddingBlock: "var(--btn-py)",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "black")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#9ca3af")}
          >
            SHOP NOW
            <ArrowUpRight
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              style={{ width: "var(--icon)", height: "var(--icon)" }}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Right feature block — pinned to the bottom-right corner of the page */}
        <div
          className="lgpsm-feature-block"
          style={{
            padding: "var(--feature-pad)",
            minWidth: "var(--feature-min)",
          }}
        >
          <div className="absolute top-0 left-0">
            <Corner pos="tl" />
          </div>
          <div className="absolute top-0 right-0">
            <Corner pos="tr" />
          </div>
          <div className="absolute bottom-0 left-0">
            <Corner pos="bl" />
          </div>
          <div className="absolute bottom-0 right-0">
            <Corner pos="br" />
          </div>

          <div className="flex flex-col items-start" style={{ gap: "0.9rem" }}>
            <WireframeGlobe />
            <p
              className="font-jakarta font-semibold uppercase"
              style={{ letterSpacing: "0.18em", fontSize: "var(--body)", lineHeight: 1.5 }}
            >
              BEYOND TRENDS.
              <br />
              BUILT FOR TOMORROW.
            </p>
          </div>
        </div>
      </main>

      {/* SHOP drawer */}
      <Drawer open={drawer === "shop"} onClose={closeDrawer} title="Catalog">
        <p
          className="font-jakarta text-gray-500 uppercase"
          style={{ fontSize: "var(--micro)", letterSpacing: "0.15em", marginBottom: "1.25rem" }}
        >
          Featured Garments
        </p>
        <div className="flex flex-col" style={{ gap: "1.5rem" }}>
          {SHOP_ITEMS.map((item) => (
            <div key={item.title} className="border-b border-gray-200 pb-4">
              <p
                className="text-gray-400 uppercase"
                style={{ fontSize: "var(--micro)", letterSpacing: "0.1em" }}
              >
                {item.tag}
              </p>
              <p
                className="font-orbitron font-bold uppercase"
                style={{ fontSize: "var(--body)", marginTop: "0.35rem" }}
              >
                {item.title}
              </p>
              <div className="flex items-center justify-between" style={{ marginTop: "0.6rem" }}>
                <span className="font-jakarta font-semibold" style={{ fontSize: "var(--body)" }}>
                  ${item.price}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="border border-gray-400 rounded-md uppercase hover:bg-black hover:text-white hover:border-black transition-colors"
                  style={{
                    letterSpacing: "0.15em",
                    fontSize: "var(--micro)",
                    padding: "0.4rem 0.9rem",
                  }}
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      {/* COLLECTIONS drawer */}
      <Drawer open={drawer === "collections"} onClose={closeDrawer} title="Archive 2026">
        <p
          className="font-jakarta text-gray-500 uppercase"
          style={{ fontSize: "var(--micro)", letterSpacing: "0.15em", marginBottom: "1.25rem" }}
        >
          Season Lineup
        </p>
        <div className="flex flex-col" style={{ gap: "1.5rem" }}>
          {COLLECTIONS.map((c) => (
            <div key={c.title} className="border-b border-gray-200 pb-4">
              <p
                className="font-orbitron font-bold uppercase"
                style={{ fontSize: "var(--body)" }}
              >
                {c.title}
              </p>
              <p
                className="font-jakarta text-gray-600"
                style={{ fontSize: "var(--micro)", marginTop: "0.5rem", lineHeight: 1.6 }}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </Drawer>

      {/* JOURNAL drawer */}
      <Drawer open={drawer === "journal"} onClose={closeDrawer} title="Editorial">
        <p
          className="font-jakarta text-gray-500 uppercase"
          style={{ fontSize: "var(--micro)", letterSpacing: "0.15em", marginBottom: "1.25rem" }}
        >
          Latest Dispatches
        </p>
        <div className="flex flex-col" style={{ gap: "1.5rem" }}>
          {JOURNAL_ITEMS.map((j) => (
            <div key={j.title} className="border-b border-gray-200 pb-4">
              <p
                className="text-gray-400 uppercase"
                style={{ fontSize: "var(--micro)", letterSpacing: "0.1em" }}
              >
                {j.date}
              </p>
              <p
                className="font-orbitron font-bold uppercase"
                style={{ fontSize: "var(--body)", marginTop: "0.35rem" }}
              >
                {j.title}
              </p>
              <p
                className="font-jakarta text-gray-500 uppercase"
                style={{ fontSize: "var(--micro)", marginTop: "0.4rem", letterSpacing: "0.1em" }}
              >
                {j.read}
              </p>
            </div>
          ))}
        </div>
      </Drawer>

      {/* CART drawer */}
      <Drawer
        open={drawer === "cart"}
        onClose={closeDrawer}
        title="Shopping Bag"
        footer={
          cart.length > 0 ? (
            <button
              onClick={checkout}
              className="w-full flex items-center justify-center bg-black text-white uppercase rounded-md hover:opacity-90"
              style={{
                gap: "0.5rem",
                letterSpacing: "0.18em",
                fontSize: "var(--body)",
                padding: "var(--btn-py) var(--btn-px)",
              }}
            >
              CHECKOUT NOW
              <ChevronRight style={{ width: "var(--icon)", height: "var(--icon)" }} strokeWidth={1.5} />
            </button>
          ) : undefined
        }
      >
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: "2.5rem", gap: "1rem" }}>
            <ShoppingBag style={{ width: "2rem", height: "2rem" }} strokeWidth={1} className="text-gray-400" />
            <p className="font-jakarta text-gray-500" style={{ fontSize: "var(--body)" }}>
              Your shopping bag is empty.
            </p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: "1.25rem" }}>
            {cart.map((item) => (
              <div key={item.title} className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <p className="font-orbitron font-bold uppercase" style={{ fontSize: "var(--body)" }}>
                    {item.title}{item.qty > 1 ? ` × ${item.qty}` : ""}
                  </p>
                  <p className="font-jakarta text-gray-600" style={{ fontSize: "var(--micro)", marginTop: "0.25rem" }}>
                    ${item.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.title)}
                  className="text-gray-400 uppercase hover:text-black"
                  style={{ fontSize: "var(--micro)", letterSpacing: "0.1em" }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Toast */}
      <div
        className="fixed z-40 flex items-center bg-black text-white rounded-md"
        style={{
          top: "1.5rem",
          right: "1.5rem",
          gap: "0.6rem",
          padding: "0.75rem 1.1rem",
          fontSize: "var(--micro)",
          letterSpacing: "0.05em",
          transform: toast ? "translateY(0)" : "translateY(-1rem)",
          opacity: toast ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 250ms ease, transform 250ms ease",
        }}
      >
        <Check style={{ width: "1rem", height: "1rem", color: "#34d399" }} strokeWidth={2} />
        <span className="font-jakarta">{toast}</span>
      </div>
    </div>
  );
}
