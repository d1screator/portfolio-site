import { useState, useEffect, useRef } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { createClient } from "@supabase/supabase-js";

// ─── Firebase & Supabase конфигурация (оставлено без изменений) ────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBje6u4E1S5p1206S1S-v2WgHnn1pj93j8",
  authDomain: "portfolio-site-2e586.firebaseapp.com",
  projectId: "portfolio-site-2e586",
  storageBucket: "portfolio-site-2e586.firebasestorage.app",
  messagingSenderId: "372022229342",
  appId: "1:372022229342:web:6d7ec0d3fe12e9b62b37cf",
  measurementId: "G-52H42GT49K"
};
const SUPABASE_URL = "https://xhypywgikxwuytcixqvm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xCQv30fhVzncUo8tyxaCCg_JRMZDips";
const SUPABASE_BUCKET = "portfolio";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const COL = "site";
const loadDoc = async (k, fb) => { try { const s = await getDoc(doc(db, COL, k)); return s.exists() ? s.data().value : fb; } catch { return fb; } };
const saveDoc = async (k, v) => { try { await setDoc(doc(db, COL, k), { value: v }); } catch (e) { console.error(e); } };
const subDoc = (k, cb) => onSnapshot(doc(db, COL, k), s => { if (s.exists()) cb(s.data().value); });
const uploadFile = async (file, folder = "uploads") => {
  const ext = file.name.split(".").pop();
  const name = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).upload(name, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
};

// ─── Данные по умолчанию ───────────────────────────────────────────────────────
const DEFAULT_WORKS = {
  reels: [{ id: 1, title: "Reels #1", video: "", price: "5 000 ₽" }, { id: 2, title: "Reels #2", video: "", price: "5 000 ₽" }, { id: 3, title: "Reels #3", video: "", price: "5 000 ₽" }, { id: 4, title: "Reels #4", video: "", price: "5 000 ₽" }, { id: 5, title: "Reels #5", video: "", price: "5 000 ₽" }],
  motion: [{ id: 1, title: "Motion #1", video: "", price: "10 000 ₽" }, { id: 2, title: "Motion #2", video: "", price: "10 000 ₽" }, { id: 3, title: "Motion #3", video: "", price: "10 000 ₽" }, { id: 4, title: "Motion #4", video: "", price: "10 000 ₽" }, { id: 5, title: "Motion #5", video: "", price: "10 000 ₽" }],
  youtube: [{ id: 1, title: "YouTube #1", video: "", price: "15 000 ₽" }, { id: 2, title: "YouTube #2", video: "", price: "15 000 ₽" }, { id: 3, title: "YouTube #3", video: "", price: "15 000 ₽" }],
};
const DEFAULT_CHANNELS = [
  { id: 1, name: "Канал «Техно»", before: { subs: "12K", views: "45K" }, after: { subs: "89K", views: "1.2M" }, points: [{ label: "Янв", views: 4500, thumb: "" }, { label: "Фев", views: 6200, thumb: "" }, { label: "Мар", views: 12000, thumb: "" }, { label: "Апр", views: 28000, thumb: "" }, { label: "Май", views: 65000, thumb: "" }, { label: "Июн", views: 120000, thumb: "" }] },
  { id: 2, name: "Канал «Лайфстайл»", before: { subs: "3K", views: "8K" }, after: { subs: "45K", views: "560K" }, points: [{ label: "Янв", views: 800, thumb: "" }, { label: "Фев", views: 1500, thumb: "" }, { label: "Мар", views: 5600, thumb: "" }, { label: "Апр", views: 18000, thumb: "" }, { label: "Май", views: 42000, thumb: "" }, { label: "Июн", views: 56000, thumb: "" }] },
];
const DEFAULT_CONTACTS = { telegram: "@yourstudio", email: "hello@studio.com" };
const DEFAULT_REVIEWS = [
  { id: 1, name: "Алексей", rating: 5, text: "Потрясающее качество монтажа! Очень доволен результатом.", date: "2025-12-01" },
  { id: 2, name: "Мария", rating: 5, text: "Ребята сделали крутой шоурил для моего канала.", date: "2025-11-15" },
  { id: 3, name: "Дмитрий", rating: 4, text: "Хорошая работа, рекомендую!", date: "2025-10-20" },
];
const DEFAULT_DESCRIPTION = "Монтаж видео, который цепляет. Reels, YouTube, моушн-графика — делаем контент, который смотрят до конца.";
const ADMIN_PASSWORD = "admin123";

// ─── Тема ──────────────────────────────────────────────────────────────────────
const t = {
  bg: "#050507",
  bgSecondary: "#0a0a0f",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.15)",
  text: "#f0f0f5",
  textSecondary: "rgba(240,240,245,0.45)",
  textMuted: "rgba(240,240,245,0.25)",
  accent: "#ffffff",
  accentGlow: "rgba(255,255,255,0.08)",
  navBg: "rgba(5,5,7,0.85)",
  cardBg: "rgba(255,255,255,0.04)",
  inputBg: "rgba(255,255,255,0.06)",
  scrollbar: "rgba(255,255,255,0.2)",
  orb1: "rgba(255,255,255,0.04)",
  orb2: "rgba(200,200,220,0.03)",
  decorText: "rgba(255,255,255,0.03)",
  reviewDate: "rgba(240,240,245,0.3)",
};

// ─── Глобальные стили и анимации ───────────────────────────────────────────────
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  background:${t.bg};
  color:${t.text};
  font-family:'Manrope',sans-serif;
  overflow-x:hidden;
}
body::after{
  content:'';
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:9999;
  opacity:.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat:repeat;
  background-size:128px 128px;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes pulse{0%,100%{opacity:.2}50%{opacity:.7}}
@keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes marqueeReverse{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@keyframes moveOrb1{0%{transform:translate(0,0) scale(1)}50%{transform:translate(8vw,12vh) scale(1.15)}100%{transform:translate(0,0) scale(1)}}
@keyframes moveOrb2{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-8vw,-8vh) scale(0.9)}100%{transform:translate(0,0) scale(1)}}
@keyframes shimmer{0%{opacity:.4}50%{opacity:.9}100%{opacity:.4}}
@keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.anim-hidden{opacity:0;transform:translateY(40px)}
.anim-visible{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}
.anim-fade-up{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}
.anim-scale-in{animation:scaleIn .7s cubic-bezier(.16,1,.3,1) both}
.anim-slide-down{animation:slideDown .45s cubic-bezier(.16,1,.3,1) both}
.glass{
  background:${t.surface};
  backdrop-filter:blur(32px) saturate(1.5);
  -webkit-backdrop-filter:blur(32px) saturate(1.5);
  border:1px solid ${t.border};
}
.glass-strong{
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(48px) saturate(2);
  -webkit-backdrop-filter:blur(48px) saturate(2);
  border:1px solid ${t.borderStrong};
}
.card-hover{transition:transform .4s cubic-bezier(.4,0,.2,1),box-shadow .4s,border-color .4s,background .4s}
.card-hover:hover{
  transform:translateY(-5px);
  box-shadow:0 24px 64px rgba(255,255,255,0.06);
  border-color:${t.borderStrong}!important;
  background:${t.surfaceHover}!important;
}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${t.scrollbar};border-radius:2px}
input,textarea,select{font-family:'Manrope',sans-serif}
#scroll-progress{
  position:fixed;top:0;left:0;height:2px;
  background:linear-gradient(90deg,transparent,${t.text},transparent);
  z-index:10000;transition:width .1s linear;
  box-shadow:0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.2);
}
.bg-orb{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0}
.decor-text{
  font-family:'Unbounded',sans-serif;
  font-size:clamp(6rem,18vw,18rem);
  font-weight:900;
  color:${t.decorText};
  letter-spacing:-.05em;
  line-height:1;
  pointer-events:none;
  user-select:none;
  white-space:nowrap;
}
.label-tag{
  display:inline-block;
  font-size:10px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:2px;
  color:${t.textMuted};
  border:1px solid ${t.border};
  padding:5px 12px;
  border-radius:50px;
  margin-bottom:20px;
}
.thin-line{
  height:1px;
  background:${t.border};
  width:100%;
  transform-origin:left;
  animation:lineGrow 1.2s cubic-bezier(.16,1,.3,1) both;
}
/* Мобильные стили */
.mobile-only{display:none !important}
.desktop-only{display:block}
@media (max-width: 768px){
  .mobile-only{display:block !important}
  .desktop-only{display:none !important}
  .nav-links{display:none !important}
}
`;

// ─── Вспомогательные компоненты ─────────────────────────────────────────────────

/** Компонент, который анимирует появление при скролле */
const AnimBlock = ({ children, style: s = {}, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${visible ? 'anim-visible' : 'anim-hidden'} ${className}`}
      style={{ animationDelay: `${delay}ms`, ...s }}>
      {children}
    </div>
  );
};

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const fn = () => { const el = document.documentElement; setWidth((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div id="scroll-progress" style={{ width: `${width}%` }} />;
};

const AnimCounter = ({ target, suffix = "", duration = 1400 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      const start = Date.now();
      const tick = () => { const p = Math.min((Date.now() - start) / duration, 1); const ease = 1 - Math.pow(1 - p, 3); setVal(Math.round(ease * target)); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const Stars = ({ rating, onRate, size = 18 }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} onClick={() => onRate?.(i)}
        style={{ cursor: onRate ? "pointer" : "default", fontSize: size, color: i <= rating ? "#f5c842" : "rgba(128,128,128,0.3)", transition: "color .2s,transform .2s", display: "inline-block" }}
        onMouseEnter={e => onRate && (e.target.style.transform = "scale(1.3)")}
        onMouseLeave={e => onRate && (e.target.style.transform = "scale(1)")}>★</span>
    ))}
  </div>
);

const SectionTitle = ({ children, id, sub }) => (
  <div id={id} style={{ textAlign: "center", marginBottom: 64 }}>
    <span className="label-tag">{typeof children === "string" ? children.toLowerCase() : children}</span>
    <h2 style={{
      fontFamily: "'Unbounded',sans-serif",
      fontSize: "clamp(1.8rem,4.5vw,3rem)",
      fontWeight: 800,
      letterSpacing: "-.04em",
      color: t.text,
      marginBottom: sub ? 16 : 0,
      lineHeight: 1.05,
    }}>{children}</h2>
    {sub && <p style={{ color: t.textSecondary, fontSize: 15, lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>{sub}</p>}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled = false }) => {
  const base = {
    fontFamily: "'Unbounded',sans-serif", fontWeight: 600, fontSize: 12,
    padding: "13px 30px", borderRadius: 50, border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .35s cubic-bezier(.4,0,.2,1)",
    letterSpacing: ".06em", opacity: disabled ? .4 : 1,
    textTransform: "uppercase",
    position: "relative", overflow: "hidden",
  };
  const vars = {
    primary: {
      background: t.text, color: t.bg,
      borderColor: t.text,
      boxShadow: "0 4px 24px rgba(255,255,255,0.1)",
    },
    secondary: {
      background: "transparent", color: t.text, borderColor: t.borderStrong,
    },
    ghost: {
      background: t.surface, color: t.textSecondary, borderColor: t.border,
    },
    tg: {
      background: "linear-gradient(135deg,#2aabee,#229ed9)", color: "#fff",
      borderColor: "transparent",
      boxShadow: "0 4px 24px rgba(42,171,238,.25)",
    },
    mail: {
      background: "rgba(255,255,255,0.12)",
      color: t.text, borderColor: t.borderStrong,
    },
  };
  const activeGlow = variant === 'primary' ? '0 0 30px rgba(255,255,255,0.3)' : '0 0 25px rgba(255,255,255,0.1)';
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...vars[variant], ...s }}
      onMouseEnter={e => { if (disabled) return; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = activeGlow; }}
      onMouseLeave={e => { if (disabled) return; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = vars[variant].boxShadow || ""; }}
      onMouseDown={e => { if (disabled) return; e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e => { if (disabled) return; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
    >{children}</button>
  );
};

const MarqueeRow = ({ items, speed = "28s", direction = "normal" }) => {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "8px 0", position: "relative" }}>
      <div style={{
        display: "flex", width: "max-content",
        animation: direction === 'reverse' ? `marqueeReverse ${speed} linear infinite` : `marquee ${speed} linear infinite`
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "0 40px", fontFamily: "'Unbounded',sans-serif", fontSize: 9, fontWeight: 500, color: t.textMuted, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "2px" }}>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: t.textMuted, display: "inline-block" }} />
            {item}
          </span>
        ))}
      </div>
      {/* Размытие по краям */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 120, background: `linear-gradient(90deg, ${t.bg} 0%, transparent 100%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 120, background: `linear-gradient(270deg, ${t.bg} 0%, transparent 100%)`, pointerEvents: "none" }} />
    </div>
  );
};

const FileUploadBtn = ({ onUpload, accept = "video/*,image/*", label = "Загрузить" }) => {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const handle = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setProgress("Загрузка…");
    try { const url = await uploadFile(file, accept.includes("video") ? "videos" : "images"); onUpload(url); setProgress("✓"); setTimeout(() => setProgress(""), 2000); }
    catch (err) { console.error(err); setProgress("Ошибка"); setTimeout(() => setProgress(""), 3000); }
    setUploading(false); if (ref.current) ref.current.value = "";
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <input ref={ref} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
      <button onClick={() => ref.current?.click()} disabled={uploading} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: "'Manrope',sans-serif", cursor: uploading ? "wait" : "pointer", background: t.surface, color: t.textSecondary, border: `1px solid ${t.border}`, transition: "all .3s", opacity: uploading ? .6 : 1 }}>
        {uploading ? "⏳" : "📁"} {label}
      </button>
      {progress && <span style={{ fontSize: 11, color: progress === "✓" ? "#4ade80" : progress === "Ошибка" ? "#f87171" : t.textMuted }}>{progress}</span>}
    </div>
  );
};

const makeInputStyle = () => ({
  background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10,
  padding: "10px 14px", color: t.text, fontSize: 14, outline: "none", width: "100%",
  transition: "border-color .3s",
});
const makeLabelStyle = () => ({
  display: "block", fontSize: 10, fontWeight: 700, color: t.textMuted,
  textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
});
const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: 6, fontFamily: "'Manrope',sans-serif" };

const GridLines = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
    {[20, 50, 80].map(pos => (
      <div key={pos} style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 1, background: t.border, opacity: .5 }} />
    ))}
    {[33, 66].map(pos => (
      <div key={pos} style={{ position: "absolute", left: 0, right: 0, top: `${pos}%`, height: 1, background: t.border, opacity: .3 }} />
    ))}
  </div>
);

const Cross = ({ style: s = {} }) => (
  <div style={{ position: "absolute", fontSize: 18, color: t.textMuted, lineHeight: 1, userSelect: "none", ...s }}>+</div>
);

/** Компонент с эффектом 3D-наведения (tilt) */
const TiltCard = ({ children, className = "", style: s = {} }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");
  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`);
  };
  const handleMouseLeave = () => setTransform("");
  return (
    <div ref={ref} className={className} style={{ ...s, transition: "transform .2s ease-out", transform }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
};

// ─── Основной компонент приложения ─────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [works, setWorks] = useState(DEFAULT_WORKS);
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [siteName, setSiteName] = useState("STUDIO");
  const [siteDescription, setSiteDescription] = useState(DEFAULT_DESCRIPTION);
  const [logoUrl, setLogoUrl] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [adminTab, setAdminTab] = useState("works");
  const [customWorks, setCustomWorks] = useState(null);
  const [customChannels, setCustomChannels] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [r, w, ch, co, sn, lg, sd, cw, cc] = await Promise.all([
          loadDoc("reviews", DEFAULT_REVIEWS), loadDoc("works", DEFAULT_WORKS),
          loadDoc("channels", DEFAULT_CHANNELS), loadDoc("contacts", DEFAULT_CONTACTS),
          loadDoc("siteName", "STUDIO"), loadDoc("logo", ""),
          loadDoc("siteDescription", DEFAULT_DESCRIPTION),
          loadDoc("customWorks", null), loadDoc("customChannels", null)
        ]);
        setReviews(r); setWorks(w); setChannels(ch); setContacts(co);
        setSiteName(sn); setLogoUrl(lg); setSiteDescription(sd);
        setCustomWorks(cw); setCustomChannels(cc);
      } catch (e) { console.error(e); }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const u = [
      subDoc("reviews", setReviews), subDoc("works", setWorks), subDoc("channels", setChannels),
      subDoc("contacts", setContacts), subDoc("siteName", setSiteName), subDoc("logo", setLogoUrl),
      subDoc("siteDescription", setSiteDescription), subDoc("customWorks", setCustomWorks),
      subDoc("customChannels", setCustomChannels),
    ];
    return () => u.forEach(f => f());
  }, []);

  const saveReviews = async (r) => { setReviews(r); await saveDoc("reviews", r); };
  const saveWorks = async (w) => { setWorks(w); await saveDoc("works", w); };
  const saveChannels = async (c) => { setChannels(c); await saveDoc("channels", c); };
  const saveContacts = async (c) => { setContacts(c); await saveDoc("contacts", c); };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const totalWorksComputed = works.reels.length + works.motion.length + works.youtube.length;
  const totalWorks = customWorks !== null ? Number(customWorks) : totalWorksComputed;
  const totalChannelsComputed = channels.length;
  const totalChannels = customChannels !== null ? Number(customChannels) : totalChannelsComputed;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const submitReview = async () => {
    if (!reviewName.trim() || !reviewText.trim()) return;
    setSaving(true);
    const newR = [{ id: Date.now(), name: reviewName, rating: reviewRating, text: reviewText, date: new Date().toISOString().slice(0, 10) }, ...reviews];
    await saveReviews(newR); setReviewName(""); setReviewRating(5); setReviewText(""); setSaving(false);
  };

  const handleLogin = () => {
    if (pwdInput === ADMIN_PASSWORD) { setIsAdmin(true); setShowPasswordModal(false); setPwdInput(""); setPwdError(false); }
    else setPwdError(true);
  };

  const inputStyle = makeInputStyle();
  const labelStyle = makeLabelStyle();

  // ─── Загрузка ──────────────────────────────────────────────────────────────────
  if (!loaded) return (
    <div style={{ background: t.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <style>{globalStyles}</style>
      <div style={{ width: 40, height: 40, border: `1px solid ${t.border}`, borderTopColor: t.text, borderRadius: "50%", animation: "rotate .9s linear infinite" }} />
      <p style={{ color: t.textMuted, fontSize: 11, fontFamily: "'Unbounded',sans-serif", letterSpacing: 3, textTransform: "uppercase" }}>Loading</p>
    </div>
  );

  // ─── Админ-панель ──────────────────────────────────────────────────────────────
  if (isAdmin) return (
    <div style={{ background: t.bg, minHeight: "100vh", padding: "30px 20px" }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: t.textMuted, marginBottom: 6, fontFamily: "'Unbounded',sans-serif" }}>Admin</p>
            <h1 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 24, fontWeight: 800, color: t.text }}>Панель управления</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "shimmer 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>Online</span>
            </div>
            <Btn variant="secondary" onClick={() => setIsAdmin(false)}>← На сайт</Btn>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 40, flexWrap: "wrap" }}>
          {[["works", "Работы"], ["reviews", "Отзывы"], ["channels", "Каналы"], ["contacts", "Контакты"], ["settings", "Настройки"]].map(([k, l]) => (
            <button key={k} onClick={() => setAdminTab(k)} style={{
              padding: "9px 20px", borderRadius: 50, border: `1px solid ${adminTab === k ? t.borderStrong : t.border}`,
              background: adminTab === k ? t.surface : "transparent",
              color: adminTab === k ? t.text : t.textSecondary,
              cursor: "pointer", fontFamily: "'Unbounded',sans-serif", fontWeight: 600, fontSize: 11,
              textTransform: "uppercase", letterSpacing: 1, transition: "all .3s",
            }}>{l}</button>
          ))}
        </div>

        {adminTab === "works" && <div className="anim-fade-up">
          {["reels", "motion", "youtube"].map(cat => (
            <div key={cat} style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 16, fontWeight: 700, color: t.text }}>
                  {cat === "youtube" ? "YouTube" : cat === "reels" ? "Reels" : "Моушн"}
                </h3>
                <div style={{ flex: 1, height: 1, background: t.border }} />
              </div>
              {works[cat].map((item, idx) => (
                <div key={item.id} style={{ background: t.surface, borderRadius: 14, padding: 18, marginBottom: 10, border: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                    <input placeholder="Название" value={item.title} onChange={e => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], title: e.target.value }; saveWorks(nw); }} style={inputStyle} />
                    <input placeholder="Цена" value={item.price} onChange={e => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], price: e.target.value }; saveWorks(nw); }} style={{ ...inputStyle, width: 130 }} />
                    <button onClick={() => { const nw = { ...works }; nw[cat] = nw[cat].filter((_, i) => i !== idx); saveWorks(nw); }} style={{ ...iconBtnStyle, color: "#f87171" }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <FileUploadBtn accept="video/*" label="Видео" onUpload={url => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], video: url }; saveWorks(nw); }} />
                    {item.video && <span style={{ fontSize: 11, color: "#4ade80" }}>✓ Загружено</span>}
                    {item.video && <button onClick={() => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], video: "" }; saveWorks(nw); }} style={{ ...iconBtnStyle, color: "#f87171", fontSize: 11 }}>Удалить</button>}
                  </div>
                  {item.video && <div style={{ marginTop: 10 }}><video src={item.video} style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8, border: `1px solid ${t.border}` }} controls /></div>}
                </div>
              ))}
              <button onClick={() => { const nw = { ...works }; nw[cat] = [...nw[cat], { id: Date.now(), title: "", video: "", price: "" }]; saveWorks(nw); }} style={{ ...iconBtnStyle, color: t.textSecondary, fontSize: 12, padding: "8px 16px", border: `1px dashed ${t.border}`, borderRadius: 8 }}>+ Добавить</button>
            </div>
          ))}
        </div>}

        {adminTab === "reviews" && <div className="anim-fade-up">
          {reviews.length === 0 && <p style={{ color: t.textMuted, textAlign: "center", padding: 60, fontFamily: "'Unbounded',sans-serif", fontSize: 12 }}>Отзывов пока нет</p>}
          {reviews.map((r, idx) => (
            <div key={r.id} style={{ background: t.surface, borderRadius: 14, padding: 18, marginBottom: 10, border: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <input value={r.name} onChange={e => { const nr = [...reviews]; nr[idx] = { ...nr[idx], name: e.target.value }; saveReviews(nr); }} style={{ ...inputStyle, maxWidth: 180 }} placeholder="Имя" />
                <input type="date" value={r.date} onChange={e => { const nr = [...reviews]; nr[idx] = { ...nr[idx], date: e.target.value }; saveReviews(nr); }} style={{ ...inputStyle, maxWidth: 180 }} />
                <button onClick={() => saveReviews(reviews.filter((_, i) => i !== idx))} style={{ ...iconBtnStyle, color: "#f87171" }}>✕</button>
              </div>
              <textarea value={r.text} onChange={e => { const nr = [...reviews]; nr[idx] = { ...nr[idx], text: e.target.value }; saveReviews(nr); }} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: t.textMuted, fontSize: 12 }}>Оценка:</span>
                <Stars rating={r.rating} onRate={val => { const nr = [...reviews]; nr[idx] = { ...nr[idx], rating: val }; saveReviews(nr); }} size={18} />
              </div>
            </div>
          ))}
        </div>}

        {adminTab === "channels" && <div className="anim-fade-up">
          {channels.map((ch, chIdx) => (
            <div key={ch.id} style={{ background: t.surface, borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
                <input value={ch.name} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], name: e.target.value }; saveChannels(nc); }} style={{ ...inputStyle, fontFamily: "'Unbounded',sans-serif", fontWeight: 700, flex: 1 }} placeholder="Название канала" />
                <button onClick={() => saveChannels(channels.filter((_, i) => i !== chIdx))} style={{ ...iconBtnStyle, color: "#f87171" }}>✕</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                <div><label style={labelStyle}>До — Подписчики</label><input value={ch.before.subs} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], before: { ...nc[chIdx].before, subs: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>До — Просмотры</label><input value={ch.before.views} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], before: { ...nc[chIdx].before, views: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>После — Подписчики</label><input value={ch.after.subs} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], after: { ...nc[chIdx].after, subs: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>После — Просмотры</label><input value={ch.after.views} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], after: { ...nc[chIdx].after, views: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
              </div>
              <h4 style={{ color: t.textMuted, fontSize: 11, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'Unbounded',sans-serif" }}>Точки графика</h4>
              {ch.points.map((pt, ptIdx) => (
                <div key={ptIdx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <input placeholder="Метка" value={pt.label} onChange={e => { const nc = [...channels]; const pts = [...nc[chIdx].points]; pts[ptIdx] = { ...pts[ptIdx], label: e.target.value }; nc[chIdx] = { ...nc[chIdx], points: pts }; saveChannels(nc); }} style={{ ...inputStyle, width: 80 }} />
                  <input placeholder="Просмотры" type="number" value={pt.views} onChange={e => { const nc = [...channels]; const pts = [...nc[chIdx].points]; pts[ptIdx] = { ...pts[ptIdx], views: Number(e.target.value) }; nc[chIdx] = { ...nc[chIdx], points: pts }; saveChannels(nc); }} style={{ ...inputStyle, width: 130 }} />
                  <FileUploadBtn accept="image/*" label="Превью" onUpload={url => { const nc = [...channels]; const pts = [...nc[chIdx].points]; pts[ptIdx] = { ...pts[ptIdx], thumb: url }; nc[chIdx] = { ...nc[chIdx], points: pts }; saveChannels(nc); }} />
                  {pt.thumb && <img src={pt.thumb} alt="" style={{ width: 50, height: 30, objectFit: "cover", borderRadius: 4, border: `1px solid ${t.border}` }} />}
                  <button onClick={() => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], points: nc[chIdx].points.filter((_, i) => i !== ptIdx) }; saveChannels(nc); }} style={{ ...iconBtnStyle, color: "#f87171" }}>✕</button>
                </div>
              ))}
              <button onClick={() => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], points: [...nc[chIdx].points, { label: "", views: 0, thumb: "" }] }; saveChannels(nc); }} style={{ ...iconBtnStyle, color: t.textSecondary, fontSize: 12, marginTop: 8, border: `1px dashed ${t.border}`, borderRadius: 8, padding: "6px 14px" }}>+ Точка</button>
            </div>
          ))}
          <button onClick={() => saveChannels([...channels, { id: Date.now(), name: "Новый канал", before: { subs: "0", views: "0" }, after: { subs: "0", views: "0" }, points: [{ label: "Янв", views: 0, thumb: "" }] }])} style={{ ...iconBtnStyle, color: t.textSecondary, fontSize: 12, padding: "10px 22px", border: `1px dashed ${t.border}`, borderRadius: 10 }}>+ Добавить канал</button>
        </div>}

        {adminTab === "contacts" && <div className="anim-fade-up" style={{ background: t.surface, borderRadius: 16, padding: 28, border: `1px solid ${t.border}` }}>
          <div style={{ marginBottom: 18 }}><label style={labelStyle}>Telegram</label><input value={contacts.telegram || ""} onChange={e => saveContacts({ ...contacts, telegram: e.target.value })} style={inputStyle} placeholder="@yourstudio" /></div>
          <div><label style={labelStyle}>Email</label><input value={contacts.email || ""} onChange={e => saveContacts({ ...contacts, email: e.target.value })} style={inputStyle} placeholder="hello@studio.com" /></div>
        </div>}

        {adminTab === "settings" && <div className="anim-fade-up" style={{ background: t.surface, borderRadius: 16, padding: 28, border: `1px solid ${t.border}` }}>
          <div style={{ marginBottom: 18 }}><label style={labelStyle}>Название студии</label><input value={siteName} onChange={e => { setSiteName(e.target.value); saveDoc("siteName", e.target.value); }} style={inputStyle} /></div>
          <div style={{ marginBottom: 18 }}><label style={labelStyle}>Описание</label><textarea value={siteDescription} onChange={e => { setSiteDescription(e.target.value); saveDoc("siteDescription", e.target.value); }} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Логотип</label>
            <FileUploadBtn accept="image/*" label="Загрузить логотип" onUpload={url => { setLogoUrl(url); saveDoc("logo", url); }} />
            {logoUrl && <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <img src={logoUrl} alt="logo" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `1px solid ${t.border}` }} />
              <button onClick={() => { setLogoUrl(""); saveDoc("logo", ""); }} style={{ ...iconBtnStyle, color: "#f87171", fontSize: 12 }}>Удалить</button>
            </div>}
          </div>
          <div style={{ marginBottom: 18 }}><label style={labelStyle}>Кол-во работ (пусто = авто)</label><input type="number" value={customWorks ?? ""} onChange={e => { const val = e.target.value === "" ? null : e.target.value; setCustomWorks(val); saveDoc("customWorks", val); }} style={inputStyle} placeholder={String(totalWorksComputed)} /></div>
          <div><label style={labelStyle}>Кол-во каналов (пусто = авто)</label><input type="number" value={customChannels ?? ""} onChange={e => { const val = e.target.value === "" ? null : e.target.value; setCustomChannels(val); saveDoc("customChannels", val); }} style={inputStyle} placeholder={String(totalChannelsComputed)} /></div>
        </div>}
      </div>
    </div>
  );

  // ─── Основной сайт ─────────────────────────────────────────────────────────────
  const marqueeItems = ["Монтаж видео", "Reels & Shorts", "YouTube-ролики", "Моушн-графика", "Цветокоррекция", "Звуковой дизайн", "Анимация", "Шоурилы"];
  const marqueeItems2 = ["Креатив", "Динамика", "Качество 4K", "Сценарий", "Продвижение", "Контент-план"];

  return (
    <div style={{ background: t.bg, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{globalStyles}</style>
      <ScrollProgress />

      {/* Фоновые орбы */}
      <div className="bg-orb" style={{ width: "55vw", height: "55vw", maxWidth: 700, maxHeight: 700, background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)`, top: "-10%", right: "-10%", animation: "moveOrb1 20s ease-in-out infinite" }} />
      <div className="bg-orb" style={{ width: "45vw", height: "45vw", maxWidth: 600, maxHeight: 600, background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)`, bottom: "5%", left: "-8%", animation: "moveOrb2 24s ease-in-out infinite" }} />

      {/* ── НАВИГАЦИЯ ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t.navBg,
        backdropFilter: "blur(32px) saturate(1.8)",
        WebkitBackdropFilter: "blur(32px) saturate(1.8)",
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: ".08em", color: t.text, textTransform: "uppercase" }}>
          {logoUrl
            ? <img src={logoUrl} alt="logo" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            : siteName
          }
        </div>

        {/* Десктопные ссылки */}
        <div className="desktop-only nav-links" style={{ display: "flex", gap: 2 }}>
          {[["portfolio-section", "Работы"], ["channels-section", "Результаты"], ["reviews-section", "Отзывы"], ["contacts-section", "Контакты"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              padding: "8px 16px", borderRadius: 50, border: "none", background: "transparent",
              color: t.textSecondary, cursor: "pointer", fontFamily: "'Manrope',sans-serif",
              fontSize: 13, fontWeight: 600, transition: "color .25s, background .25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.surface; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.background = "transparent"; }}
            >{label}</button>
          ))}
        </div>

        <div className="desktop-only">
          <Btn onClick={() => scrollTo("contacts-section")} style={{ padding: "9px 22px", fontSize: 11 }}>Заказать</Btn>
        </div>

        {/* Мобильная кнопка */}
        <button className="mobile-only" onClick={() => setMobileMenuOpen(true)} style={{
          background: "transparent", border: "none", color: t.text, fontSize: 28,
          cursor: "pointer", padding: 8, lineHeight: 1,
        }}>☰</button>
      </nav>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2001, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(30px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, animation: "fadeIn .3s" }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: "absolute", top: 24, right: 32, background: "transparent", border: "none", color: t.text, fontSize: 32, cursor: "pointer" }}>✕</button>
          {[["portfolio-section", "Работы"], ["channels-section", "Результаты"], ["reviews-section", "Отзывы"], ["contacts-section", "Контакты"]].map(([id, label]) => (
            <button key={id} onClick={() => { scrollTo(id); setMobileMenuOpen(false); }} style={{
              background: "transparent", border: "none", color: t.textSecondary, fontSize: 24, fontWeight: 600,
              fontFamily: "'Unbounded',sans-serif", cursor: "pointer",
              padding: "12px 24px", borderRadius: 50, transition: "all .3s",
              letterSpacing: 1,
            }}
              onMouseEnter={e => e.currentTarget.style.color = t.text}
              onMouseLeave={e => e.currentTarget.style.color = t.textSecondary}
            >{label}</button>
          ))}
          <Btn onClick={() => { scrollTo("contacts-section"); setMobileMenuOpen(false); }} style={{ padding: "16px 36px", fontSize: 14, marginTop: 20 }}>Заказать</Btn>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 20px 100px", position: "relative", zIndex: 1, textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -55%)", zIndex: 0, overflow: "hidden", width: "100%", textAlign: "center" }}>
          <div className="decor-text">{siteName}</div>
        </div>

        <GridLines />
        <Cross style={{ top: "18%", left: "12%" }} />
        <Cross style={{ top: "18%", right: "12%" }} />
        <Cross style={{ bottom: "22%", left: "8%" }} />
        <Cross style={{ bottom: "22%", right: "8%" }} />

        <div className="anim-scale-in" style={{ position: "relative", zIndex: 2, marginBottom: 32 }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%",
            background: logoUrl ? `url(${logoUrl}) center/cover` : t.surface,
            border: `1px solid ${t.borderStrong}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: logoUrl ? 0 : 28, fontFamily: "'Unbounded',sans-serif",
            fontWeight: 800, color: t.text,
            boxShadow: "0 0 60px rgba(255,255,255,0.06), 0 0 120px rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
          }}>{!logoUrl && siteName[0]}</div>
          <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px solid ${t.border}`, animation: "rotate 12s linear infinite" }} />
          <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `1px dashed ${t.border}`, animation: "rotate 20s linear infinite reverse", opacity: .5 }} />
        </div>

        <div className="anim-fade-up" style={{ animationDelay: ".05s", position: "relative", zIndex: 2 }}>
          <span className="label-tag">Видеомонтажер</span>
        </div>

        <h1 className="anim-fade-up" style={{
          animationDelay: ".12s",
          fontFamily: "'Unbounded',sans-serif",
          fontSize: "clamp(2.8rem,8vw,6rem)",
          fontWeight: 900,
          letterSpacing: "-.05em",
          lineHeight: .96,
          color: t.text,
          marginBottom: 28,
          position: "relative", zIndex: 2,
        }}>{siteName}</h1>

        <p className="anim-fade-up" style={{
          animationDelay: ".2s",
          color: t.textSecondary,
          fontSize: "clamp(14px,2vw,16px)",
          lineHeight: 1.9,
          maxWidth: 480,
          marginBottom: 48,
          fontWeight: 400,
          position: "relative", zIndex: 2,
        }}>{siteDescription}</p>

        {/* Статистика */}
        <AnimBlock className="glass" style={{
          display: "flex", gap: 0, marginBottom: 44,
          borderRadius: 20, overflow: "hidden", zIndex: 2,
        }}>
          {[
            { value: avgRating, sub: `${reviews.length} отзывов`, star: true },
            { value: null, counter: totalWorks, suffix: "+", sub: "работ" },
            { value: null, counter: totalChannels, suffix: "", sub: "канала" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px 32px", textAlign: "center", borderRight: i < 2 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, fontFamily: "'Unbounded',sans-serif", color: t.text, lineHeight: 1.1, marginBottom: 4 }}>
                {stat.value !== null ? stat.value : <AnimCounter target={stat.counter} suffix={stat.suffix} />}
              </div>
              {stat.star && <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}><Stars rating={Math.round(Number(avgRating))} size={12} /></div>}
              <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{stat.sub}</div>
            </div>
          ))}
        </AnimBlock>

        <div className="anim-fade-up" style={{ animationDelay: ".35s", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <Btn onClick={() => scrollTo("portfolio-section")}>Смотреть работы</Btn>
          <Btn variant="secondary" onClick={() => scrollTo("contacts-section")}>Написать нам</Btn>
        </div>

        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", animation: "float 2.5s ease-in-out infinite", zIndex: 2 }}>
          <div style={{ width: 24, height: 38, borderRadius: 12, border: `1px solid ${t.border}`, display: "flex", justifyContent: "center", paddingTop: 8 }}>
            <div style={{ width: 1.5, height: 8, borderRadius: 1, background: t.textMuted, animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <MarqueeRow items={marqueeItems} speed="22s" />
        <MarqueeRow items={marqueeItems2} speed="28s" direction="reverse" />
      </div>

      {/* ── ПОРТФОЛИО ── */}
      <section id="portfolio-section" style={{ padding: "112px 20px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", top: 60, right: -20, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(4rem,10vw,9rem)", fontWeight: 900, color: t.decorText, letterSpacing: "-.05em", lineHeight: 1, userSelect: "none", whiteSpace: "nowrap" }}>WORK</div>
        </div>

        <SectionTitle sub="Избранные проекты из нашего портфолио">Портфолио</SectionTitle>

        {[
          { key: "reels", label: "Reels & Shorts", desc: "Вертикальные форматы для соц. сетей", num: "01" },
          { key: "motion", label: "Моушн-графика", desc: "Анимация и визуальные эффекты", num: "02" },
          { key: "youtube", label: "YouTube", desc: "Полноформатный монтаж", num: "03" },
        ].map(({ key, label, desc, num }) => (
          <div key={key} style={{ marginBottom: 80 }}>
            <AnimBlock style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 11, color: t.textMuted, fontWeight: 400 }}>{num}</span>
              <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: "-.03em" }}>{label}</h3>
              <span style={{ color: t.textMuted, fontSize: 13 }}>— {desc}</span>
            </AnimBlock>

            {/* Bento grid: разное масштабирование карточек */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              gridAutoRows: "minmax(200px, auto)",
              gridAutoFlow: "dense",
            }}>
              {works[key].map((item, i) => {
                const isLarge = (key === "reels" && i === 0) || (key === "motion" && i === 1) || (key === "youtube" && i === 0);
                return (
                  <AnimBlock key={item.id} className="card-hover glass" delay={i * 80} style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: `1px solid ${t.border}`,
                    gridColumn: isLarge ? "span 2" : "span 1",
                    gridRow: isLarge ? "span 2" : "span 1",
                  }}>
                    <div style={{
                      aspectRatio: key === "youtube" ? "16/9" : "9/16",
                      background: item.video ? "#000" : t.surface,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", position: "relative",
                    }}>
                      {item.video
                        ? <video src={item.video} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls playsInline />
                        : <>
                            <div style={{ color: t.textMuted, fontSize: 11, textAlign: "center", padding: 20, position: "relative", zIndex: 1 }}>
                              <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 16 }}>▶</div>
                              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'Unbounded',sans-serif" }}>Видео</span>
                            </div>
                            <div style={{ position: "absolute", top: 12, left: 12, width: 20, height: 20, borderTop: `1px solid ${t.border}`, borderLeft: `1px solid ${t.border}` }} />
                            <div style={{ position: "absolute", bottom: 12, right: 12, width: 20, height: 20, borderBottom: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}` }} />
                          </>
                      }
                    </div>
                    <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: t.text, fontFamily: "'Unbounded',sans-serif", letterSpacing: "-.02em" }}>{item.title}</span>
                      {item.price && <span style={{ fontSize: 10, fontWeight: 700, background: t.surface, color: t.textSecondary, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", border: `1px solid ${t.border}`, fontFamily: "'Unbounded',sans-serif", letterSpacing: ".03em" }}>{item.price}</span>}
                    </div>
                  </AnimBlock>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* ── РЕЗУЛЬТАТЫ ── */}
      <section id="channels-section" style={{ padding: "112px 20px", position: "relative", zIndex: 1, background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ position: "absolute", bottom: 40, left: -20, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(4rem,10vw,9rem)", fontWeight: 900, color: t.decorText, letterSpacing: "-.05em", lineHeight: 1, userSelect: "none", whiteSpace: "nowrap" }}>RESULTS</div>
          </div>

          <SectionTitle sub="Реальные результаты каналов после работы с нами">Результаты</SectionTitle>

          {channels.map((ch, idx) => (
            <AnimBlock key={ch.id} className="glass" delay={idx * 120} style={{
              borderRadius: 20, padding: "36px 32px", marginBottom: 24,
              border: `1px solid ${t.border}`, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.borderStrong}, transparent)` }} />
              <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 28, color: t.text, letterSpacing: "-.03em" }}>{ch.name}</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
                <div style={{ background: "rgba(248,113,113,0.05)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(248,113,113,0.1)" }}>
                  <p style={{ color: "#f87171", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontFamily: "'Unbounded',sans-serif" }}>ДО</p>
                  <p style={{ fontSize: 13, color: t.textSecondary, marginBottom: 6 }}>Подписчики: <strong style={{ color: t.text, fontFamily: "'Unbounded',sans-serif", fontSize: 14 }}>{ch.before.subs}</strong></p>
                  <p style={{ fontSize: 13, color: t.textSecondary }}>Просмотры: <strong style={{ color: t.text, fontFamily: "'Unbounded',sans-serif", fontSize: 14 }}>{ch.before.views}</strong></p>
                </div>
                <div style={{ background: "rgba(74,222,128,0.05)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(74,222,128,0.15)" }}>
                  <p style={{ color: "#4ade80", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontFamily: "'Unbounded',sans-serif" }}>ПОСЛЕ</p>
                  <p style={{ fontSize: 13, color: t.textSecondary, marginBottom: 6 }}>Подписчики: <strong style={{ color: t.text, fontFamily: "'Unbounded',sans-serif", fontSize: 14 }}>{ch.after.subs}</strong></p>
                  <p style={{ fontSize: 13, color: t.textSecondary }}>Просмотры: <strong style={{ color: t.text, fontFamily: "'Unbounded',sans-serif", fontSize: 14 }}>{ch.after.views}</strong></p>
                </div>
              </div>

              <div style={{ height: 240, marginBottom: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ch.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${ch.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" stopOpacity={1} />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" tick={{ fill: t.textMuted, fontSize: 11, fontFamily: "'Manrope',sans-serif" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'Manrope',sans-serif" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: t.navBg, border: `1px solid ${t.border}`, borderRadius: 12, fontSize: 13, color: t.text, backdropFilter: "blur(20px)" }}
                      formatter={v => [v.toLocaleString(), "Просмотры"]}
                    />
                    <Area type="monotone" dataKey="views" stroke="#ffffff" strokeWidth={2} fill={`url(#grad-${ch.id})`}
                      dot={{ r: 4, fill: t.text, stroke: t.bg, strokeWidth: 2, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7))" }}
                      activeDot={{ r: 6, fill: "#fff", stroke: "#fff", strokeWidth: 2, filter: "drop-shadow(0 0 10px #fff)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {ch.points.some(p => p.thumb) && (
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                  {ch.points.filter(p => p.thumb).map((p, i) => (
                    <div key={i} style={{ minWidth: 80, textAlign: "center" }}>
                      <img src={p.thumb} alt="" style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 8, border: `1px solid ${t.border}` }} />
                      <p style={{ fontSize: 10, color: t.textMuted, marginTop: 4, fontFamily: "'Unbounded',sans-serif" }}>{p.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </AnimBlock>
          ))}
        </div>
      </section>

      {/* ── ОТЗЫВЫ ── */}
      <section id="reviews-section" style={{ padding: "112px 20px", maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle sub="Что говорят клиенты о нашей работе">Отзывы</SectionTitle>

        <AnimBlock className="glass" style={{ borderRadius: 20, padding: "32px 36px", marginBottom: 48, border: `1px solid ${t.border}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.borderStrong}, transparent)` }} />
          <p style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 11, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Оставить отзыв</p>
          <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            <input placeholder="Ваше имя" value={reviewName} onChange={e => setReviewName(e.target.value)} style={{ ...makeInputStyle(), flex: 1, minWidth: 160 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Unbounded',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Оценка</span>
              <Stars rating={reviewRating} onRate={setReviewRating} size={26} />
            </div>
          </div>
          <textarea placeholder="Напишите отзыв..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} style={{ ...makeInputStyle(), resize: "vertical", marginBottom: 18 }} />
          <Btn onClick={submitReview} disabled={saving} style={{ fontSize: 11, padding: "11px 28px" }}>{saving ? "Отправка..." : "Отправить"}</Btn>
        </AnimBlock>

        <div style={{ display: "grid", gap: 14 }}>
          {reviews.map((r, i) => (
            <AnimBlock key={r.id} className="card-hover glass" delay={i * 60} style={{
              borderRadius: 18, padding: "24px 28px", border: `1px solid ${t.border}`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
                    border: `1px solid ${t.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, fontWeight: 800, color: t.text,
                    fontFamily: "'Unbounded',sans-serif", flexShrink: 0,
                  }}>{r.name[0]?.toUpperCase()}</div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: t.text, fontFamily: "'Unbounded',sans-serif", letterSpacing: "-.02em" }}>{r.name}</span>
                    <div style={{ marginTop: 4 }}><Stars rating={r.rating} size={14} /></div>
                  </div>
                </div>
                <span style={{ color: t.reviewDate, fontSize: 11, fontFamily: "'Manrope',sans-serif", flexShrink: 0 }}>{r.date}</span>
              </div>
              <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.8 }}>{r.text}</p>
            </AnimBlock>
          ))}
        </div>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section id="contacts-section" style={{ padding: "112px 20px 140px", maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", overflow: "hidden", width: "120%", textAlign: "center" }}>
          <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(4rem,12vw,11rem)", fontWeight: 900, color: t.decorText, letterSpacing: "-.05em", lineHeight: 1, userSelect: "none", whiteSpace: "nowrap" }}>CONTACT</div>
        </div>

        <SectionTitle sub="Готовы обсудить ваш проект — напишите нам">Контакты</SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 48, position: "relative", zIndex: 2 }}>
          <a href={`https://t.me/${(contacts.telegram || "").replace("@", "")}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <TiltCard className="glass card-hover" style={{ borderRadius: 20, padding: "32px 28px", border: `1px solid ${t.border}`, cursor: "pointer", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(42,171,238,0.4), transparent)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(42,171,238,0.1)", border: "1px solid rgba(42,171,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✈️</div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#2aabee", marginBottom: 4, fontFamily: "'Unbounded',sans-serif" }}>Telegram</p>
                  <p style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 16, fontWeight: 700, color: t.text }}>{contacts.telegram || "@yourstudio"}</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>Отвечаем быстро. Напишите нам для быстрой связи.</p>
              <div style={{ position: "absolute", bottom: 20, right: 22, fontSize: 14, color: t.textMuted }}>↗</div>
            </TiltCard>
          </a>
          <a href={`mailto:${contacts.email || "hello@studio.com"}`} style={{ textDecoration: "none" }}>
            <TiltCard className="glass card-hover" style={{ borderRadius: 20, padding: "32px 28px", border: `1px solid ${t.border}`, cursor: "pointer", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.borderStrong}, transparent)` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: t.surface, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📧</div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: t.textMuted, marginBottom: 4, fontFamily: "'Unbounded',sans-serif" }}>Email</p>
                  <p style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 14, fontWeight: 700, color: t.text, wordBreak: "break-all" }}>{contacts.email || "hello@studio.com"}</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>Для детального брифа и обсуждения пишите на почту.</p>
              <div style={{ position: "absolute", bottom: 20, right: 22, fontSize: 14, color: t.textMuted }}>↗</div>
            </TiltCard>
          </a>
        </div>

        <AnimBlock style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
          <Btn variant="tg" onClick={() => window.open(`https://t.me/${(contacts.telegram || "").replace("@", "")}`, "_blank")} style={{ fontSize: 12, padding: "16px 36px" }}>✈️ Написать в Telegram</Btn>
          <Btn variant="secondary" onClick={() => window.location.href = `mailto:${contacts.email || "hello@studio.com"}`} style={{ fontSize: 12, padding: "16px 36px" }}>📧 Написать на Email</Btn>
        </AnimBlock>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative", zIndex: 1, background: "rgba(255,255,255,0.01)" }}>
        <span style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 13, fontWeight: 800, color: t.text, letterSpacing: ".05em" }}>{siteName}</span>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Manrope',sans-serif" }}>© {new Date().getFullYear()} — Монтаж видео</span>
        <button onClick={() => setShowPasswordModal(true)} style={{
          background: "transparent", border: "none", color: t.textMuted, fontSize: 10, cursor: "pointer",
          fontFamily: "'Manrope',sans-serif", opacity: .2, transition: "opacity .3s, color .3s",
          width: 8, height: 8, borderRadius: "50%", background: t.textMuted, padding: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.background = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "0.2"; e.currentTarget.style.background = t.textMuted; }}
        ></button>
      </footer>

      {/* ── PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn .3s ease" }}
          onClick={() => { setShowPasswordModal(false); setPwdError(false); setPwdInput(""); }}>
          <div className="anim-scale-in glass-strong" onClick={e => e.stopPropagation()} style={{ borderRadius: 24, padding: "44px 40px", width: 360, border: `1px solid ${t.borderStrong}`, textAlign: "center" }}>
            <p style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 10, color: t.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Admin Access</p>
            <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 28 }}>Вход в панель</h3>
            <input type="password" placeholder="Пароль" value={pwdInput} onChange={e => { setPwdInput(e.target.value); setPwdError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ ...makeInputStyle(), textAlign: "center", fontSize: 16, marginBottom: 12, letterSpacing: 4 }} autoFocus />
            {pwdError && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 14, fontFamily: "'Manrope',sans-serif" }}>Неверный пароль</p>}
            <Btn onClick={handleLogin} style={{ width: "100%" }}>Войти</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
