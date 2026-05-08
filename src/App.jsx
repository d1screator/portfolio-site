import { useState, useEffect, useRef } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { createClient } from "@supabase/supabase-js";

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

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#050505;
  --surface:rgba(255,255,255,0.03);
  --surface2:rgba(255,255,255,0.05);
  --border:rgba(255,255,255,0.07);
  --border-bright:rgba(255,255,255,0.15);
  --text:#f0ede8;
  --text2:rgba(240,237,232,0.45);
  --text3:rgba(240,237,232,0.25);
  --accent:#e8e0d0;
  --accent2:#c8bfae;
  --white:#ffffff;
  --radius:2px;
  --radius-sm:2px;
}
html{scroll-behavior:smooth}
body{
  background:var(--bg);
  color:var(--text);
  font-family:'Space Grotesk',sans-serif;
  overflow-x:hidden;
}

/* Noise overlay */
body::before{
  content:'';
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:9999;
  opacity:.04;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat:repeat;
  background-size:200px 200px;
}

@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{opacity:.2}50%{opacity:.7}}
@keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes driftSlow{0%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(3vw,5vh) rotate(3deg)}66%{transform:translate(-2vw,8vh) rotate(-2deg)}100%{transform:translate(0,0) rotate(0deg)}}
@keyframes driftFast{0%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(-4vw,-6vh) rotate(-4deg)}100%{transform:translate(0,0) rotate(0deg)}}
@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.8}94%{opacity:1}96%{opacity:.9}97%{opacity:1}}
@keyframes revealText{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)}}

.anim-fade-up{animation:fadeUp .9s cubic-bezier(.16,1,.3,1) both}
.anim-scale-in{animation:scaleIn .75s cubic-bezier(.16,1,.3,1) both}
.anim-slide-down{animation:slideDown .4s cubic-bezier(.16,1,.3,1) both}

/* Editorial text styles */
.display-font{font-family:'Bebas Neue',sans-serif;letter-spacing:.04em}
.serif-font{font-family:'Cormorant Garamond',serif}
.sans-font{font-family:'Space Grotesk',sans-serif}

/* Glass panels */
.glass{
  background:rgba(255,255,255,0.03);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,0.07);
}
.glass-strong{
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(32px);
  -webkit-backdrop-filter:blur(32px);
  border:1px solid rgba(255,255,255,0.1);
}

/* Hover cards */
.card-hover{transition:transform .4s cubic-bezier(.4,0,.2,1),box-shadow .4s,border-color .4s,background .4s}
.card-hover:hover{transform:translateY(-4px);box-shadow:0 24px 64px rgba(0,0,0,.6);border-color:rgba(255,255,255,.12)!important;background:rgba(255,255,255,.05)!important}

/* Scrollbar */
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#050505}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}

input,textarea,select{font-family:'Space Grotesk',sans-serif}

/* Scroll progress */
#scroll-progress{position:fixed;top:0;left:0;height:1px;background:linear-gradient(90deg,rgba(255,255,255,0.2),rgba(255,255,255,0.8),rgba(255,255,255,0.2));z-index:10000;transition:width .1s linear}

/* Decorative cross */
.deco-cross::before,.deco-cross::after{content:'';position:absolute;background:rgba(255,255,255,.15)}
.deco-cross::before{width:1px;height:16px;top:-8px;left:50%;transform:translateX(-50%)}
.deco-cross::after{width:16px;height:1px;left:-8px;top:50%;transform:translateY(-50%)}

/* Background text */
.bg-text{
  position:absolute;
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(120px,20vw,260px);
  color:rgba(255,255,255,0.018);
  white-space:nowrap;
  user-select:none;
  pointer-events:none;
  letter-spacing:.05em;
  line-height:1;
}

/* Tag pill */
.tag{
  display:inline-block;
  font-size:10px;
  font-weight:500;
  letter-spacing:.12em;
  text-transform:uppercase;
  padding:5px 12px;
  border:1px solid rgba(255,255,255,.15);
  color:var(--text2);
}

/* Section divider line */
.section-line{
  width:40px;
  height:1px;
  background:rgba(255,255,255,.3);
  margin-bottom:24px;
}
`;

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

const Stars = ({ rating, onRate, size = 18 }) => (<div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(i => (<span key={i} onClick={() => onRate && onRate(i)} style={{ cursor: onRate ? "pointer" : "default", fontSize: size, color: i <= rating ? "rgba(240,237,232,0.9)" : "rgba(255,255,255,0.1)", transition: "color .2s,transform .2s", display: "inline-block" }} onMouseEnter={e => onRate && (e.target.style.transform = "scale(1.3)")} onMouseLeave={e => onRate && (e.target.style.transform = "scale(1)")}>★</span>))}</div>);

const SectionTitle = ({ children, id, sub, num }) => (
  <div id={id} style={{ marginBottom: 64, position: "relative" }}>
    {num && <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: ".2em", color: "var(--text3)", marginBottom: 16 }}>{num}</div>}
    <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
      <div className="section-line" style={{ marginTop: 14, flexShrink: 0 }} />
      <div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 400, letterSpacing: ".04em", lineHeight: .95, color: "var(--text)", marginBottom: sub ? 14 : 0 }}>{children}</h2>
        {sub && <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, fontWeight: 300, maxWidth: 480 }}>{sub}</p>}
      </div>
    </div>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled = false }) => {
  const base = { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 12, padding: "13px 32px", border: "1px solid", cursor: disabled ? "not-allowed" : "pointer", transition: "all .35s cubic-bezier(.4,0,.2,1)", letterSpacing: ".1em", textTransform: "uppercase", opacity: disabled ? .4 : 1, borderRadius: 0 };
  const vars = {
    primary: { background: "var(--text)", color: "#050505", borderColor: "var(--text)", boxShadow: "none" },
    secondary: { background: "transparent", color: "var(--text)", borderColor: "rgba(255,255,255,.2)" },
    ghost: { background: "transparent", color: "var(--text2)", borderColor: "rgba(255,255,255,.1)" },
    tg: { background: "transparent", color: "var(--text)", borderColor: "rgba(255,255,255,.25)" },
    mail: { background: "transparent", color: "var(--text)", borderColor: "rgba(255,255,255,.25)" }
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...vars[variant], ...s }}
    onMouseEnter={e => { if (disabled) return; if (variant === "primary") { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.5)"; } else { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"; } }}
    onMouseLeave={e => { if (disabled) return; e.currentTarget.style.background = vars[variant].background; e.currentTarget.style.color = vars[variant].color; e.currentTarget.style.borderColor = vars[variant].borderColor; }}
  >{children}</button>;
};

const Marquee = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "12px 0", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", width: "max-content", animation: "marquee 28s linear infinite" }}>
        {doubled.map((item, i) => (<span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "0 40px", fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 400, color: "var(--text3)", whiteSpace: "nowrap", letterSpacing: ".12em", textTransform: "uppercase" }}><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "inline-block", flexShrink: 0 }} />{item}</span>))}
      </div>
    </div>
  );
};

const FileUploadBtn = ({ onUpload, accept = "video/*,image/*", label = "Загрузить файл" }) => {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const handle = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setProgress(`Загрузка...`);
    try { const url = await uploadFile(file, accept.includes("video") ? "videos" : "images"); onUpload(url); setProgress("Готово!"); setTimeout(() => setProgress(""), 2000); }
    catch (err) { console.error(err); setProgress("Ошибка"); setTimeout(() => setProgress(""), 3000); }
    setUploading(false); if (ref.current) ref.current.value = "";
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <input ref={ref} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
      <button onClick={() => ref.current?.click()} disabled={uploading} style={{ padding: "7px 14px", fontSize: 11, fontWeight: 500, fontFamily: "'Space Grotesk',sans-serif", cursor: uploading ? "wait" : "pointer", background: "transparent", color: "var(--text2)", border: "1px solid rgba(255,255,255,.12)", transition: "all .3s", opacity: uploading ? .5 : 1, textTransform: "uppercase", letterSpacing: ".08em" }}>{uploading ? "⏳" : "↑"} {label}</button>
      {progress && <span style={{ fontSize: 11, color: progress === "Готово!" ? "rgba(180,220,180,.8)" : progress.includes("Ошибка") ? "rgba(220,100,100,.8)" : "var(--text2)" }}>{progress}</span>}
    </div>
  );
};

const inputStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 0, padding: "10px 14px", color: "var(--text)", fontSize: 13, outline: "none", width: "100%", transition: "border-color .3s" };
const labelStyle = { display: "block", fontSize: 10, fontWeight: 500, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 };
const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: 6, fontFamily: "'Space Grotesk',sans-serif" };

// Decorative background orbs / blobs
const BgOrbs = () => (
  <>
    {/* Large radial glow top-left */}
    <div style={{ position: "fixed", top: "-20vh", left: "-20vw", width: "70vw", height: "70vh", background: "radial-gradient(ellipse,rgba(255,255,255,0.025) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0, animation: "driftSlow 30s ease-in-out infinite" }} />
    {/* Large radial glow bottom-right */}
    <div style={{ position: "fixed", bottom: "-25vh", right: "-15vw", width: "60vw", height: "60vh", background: "radial-gradient(ellipse,rgba(255,255,255,0.018) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0, animation: "driftFast 24s ease-in-out infinite" }} />
    {/* Subtle center glow */}
    <div style={{ position: "fixed", top: "35%", left: "45%", width: "40vw", height: "40vh", background: "radial-gradient(ellipse,rgba(200,191,174,0.04) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0, transform: "translate(-50%,-50%)" }} />
    {/* Horizontal scanline */}
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)", pointerEvents: "none", zIndex: 1, animation: "scanline 8s linear infinite", animationPlayState: "running" }} />
  </>
);

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

  useEffect(() => {
    (async () => {
      try {
        const [r, w, ch, co, sn, lg, sd, cw, cc] = await Promise.all([
          loadDoc("reviews", DEFAULT_REVIEWS),
          loadDoc("works", DEFAULT_WORKS),
          loadDoc("channels", DEFAULT_CHANNELS),
          loadDoc("contacts", DEFAULT_CONTACTS),
          loadDoc("siteName", "STUDIO"),
          loadDoc("logo", ""),
          loadDoc("siteDescription", DEFAULT_DESCRIPTION),
          loadDoc("customWorks", null),
          loadDoc("customChannels", null)
        ]);
        setReviews(r); setWorks(w); setChannels(ch); setContacts(co); setSiteName(sn); setLogoUrl(lg); setSiteDescription(sd);
        setCustomWorks(cw); setCustomChannels(cc);
      } catch (e) { console.error(e); }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const u = [subDoc("reviews", setReviews), subDoc("works", setWorks), subDoc("channels", setChannels), subDoc("contacts", setContacts), subDoc("siteName", setSiteName), subDoc("logo", setLogoUrl), subDoc("siteDescription", setSiteDescription), subDoc("customWorks", setCustomWorks), subDoc("customChannels", setCustomChannels)];
    return () => u.forEach(f => f());
  }, []);

  const saveReviews = async r => { setReviews(r); await saveDoc("reviews", r); };
  const saveWorks = async w => { setWorks(w); await saveDoc("works", w); };
  const saveChannels = async c => { setChannels(c); await saveDoc("channels", c); };
  const saveContacts = async c => { setContacts(c); await saveDoc("contacts", c); };
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const totalWorksComputed = works.reels.length + works.motion.length + works.youtube.length;
  const totalWorks = customWorks !== null ? Number(customWorks) : totalWorksComputed;
  const totalChannelsComputed = channels.length;
  const totalChannels = customChannels !== null ? Number(customChannels) : totalChannelsComputed;

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const submitReview = async () => {
    if (!reviewName.trim() || !reviewText.trim()) return; setSaving(true);
    const newR = [{ id: Date.now(), name: reviewName, rating: reviewRating, text: reviewText, date: new Date().toISOString().slice(0, 10) }, ...reviews];
    await saveReviews(newR); setReviewName(""); setReviewRating(5); setReviewText(""); setSaving(false);
  };
  const handleLogin = () => { if (pwdInput === ADMIN_PASSWORD) { setIsAdmin(true); setShowPasswordModal(false); setPwdInput(""); setPwdError(false); } else setPwdError(true); };

  if (!loaded) return (
    <div style={{ background: "#050505", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <style>{globalStyles}</style>
      <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom,transparent,rgba(255,255,255,.3),transparent)", animation: "pulse 1.5s ease-in-out infinite" }} />
      <p style={{ color: "var(--text3)", fontSize: 11, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: ".2em", textTransform: "uppercase" }}>Загрузка</p>
    </div>
  );

  // ADMIN PANEL
  if (isAdmin) return (
    <div style={{ background: "#050505", minHeight: "100vh", padding: "30px 20px" }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, flexWrap: "wrap", gap: 12, borderBottom: "1px solid rgba(255,255,255,.06)", paddingBottom: 24 }}>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: ".1em", color: "var(--text)" }}>Панель управления</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 11, color: "rgba(160,220,160,.6)", letterSpacing: ".1em", textTransform: "uppercase" }}>● Онлайн</span>
            <Btn variant="secondary" onClick={() => setIsAdmin(false)} style={{ fontSize: 11, padding: "10px 20px" }}>← Сайт</Btn>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 40, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,.06)", paddingBottom: 24 }}>
          {[["works","Работы"],["reviews","Отзывы"],["channels","Каналы"],["contacts","Контакты"],["settings","Настройки"]].map(([k,l]) => (
            <button key={k} onClick={() => setAdminTab(k)} style={{ padding: "9px 18px", border: "1px solid", borderColor: adminTab===k?"rgba(255,255,255,.3)":"rgba(255,255,255,.06)", background: adminTab===k?"rgba(255,255,255,.06)":"transparent", color: adminTab===k?"var(--text)":"var(--text3)", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: 12, transition: "all .3s", textTransform: "uppercase", letterSpacing: ".08em" }}>{l}</button>
          ))}
        </div>

        {adminTab === "works" && <div className="anim-fade-up">
          {["reels","motion","youtube"].map(cat => (
            <div key={cat} style={{ marginBottom: 48 }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: ".08em", marginBottom: 20, color: "var(--text2)" }}>{cat==="youtube"?"YouTube":cat==="reels"?"Reels":"Моушн"}</h3>
              {works[cat].map((item,idx) => (
                <div key={item.id} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", padding: 16, marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                    <input placeholder="Название" value={item.title} onChange={e => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],title:e.target.value}; saveWorks(nw); }} style={inputStyle} />
                    <input placeholder="Цена" value={item.price} onChange={e => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],price:e.target.value}; saveWorks(nw); }} style={{...inputStyle,width:120}} />
                    <button onClick={() => { const nw={...works}; nw[cat]=nw[cat].filter((_,i)=>i!==idx); saveWorks(nw); }} style={{...iconBtnStyle,color:"rgba(220,100,100,.7)"}}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <FileUploadBtn accept="video/*" label="Загрузить видео" onUpload={url => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],video:url}; saveWorks(nw); }} />
                    {item.video && <span style={{ fontSize: 11, color: "rgba(160,220,160,.7)", letterSpacing: ".06em" }}>✓ Загружено</span>}
                    {item.video && <button onClick={() => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],video:""}; saveWorks(nw); }} style={{...iconBtnStyle,color:"rgba(220,100,100,.7)",fontSize:11}}>Удалить</button>}
                  </div>
                  {item.video && <div style={{ marginTop: 8 }}><video src={item.video} style={{ maxWidth: 200, maxHeight: 120, border: "1px solid rgba(255,255,255,.08)" }} controls /></div>}
                </div>
              ))}
              <button onClick={() => { const nw={...works}; nw[cat]=[...nw[cat],{id:Date.now(),title:"",video:"",price:""}]; saveWorks(nw); }} style={{...iconBtnStyle,color:"var(--text2)",fontSize:12,padding:"10px 18px",border:"1px dashed rgba(255,255,255,.1)"}}>+ Добавить</button>
            </div>
          ))}
        </div>}

        {adminTab === "reviews" && <div className="anim-fade-up">
          {reviews.length===0 && <p style={{ color:"var(--text2)",textAlign:"center",padding:40 }}>Отзывов пока нет</p>}
          {reviews.map((r,idx) => (
            <div key={r.id} style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",padding:16,marginBottom:8,display:"flex",flexDirection:"column",gap:12 }}>
              <div style={{ display:"flex",gap:12,alignItems:"center",flexWrap:"wrap" }}>
                <input value={r.name} onChange={e => { const nr=[...reviews]; nr[idx]={...nr[idx],name:e.target.value}; saveReviews(nr); }} style={{...inputStyle,maxWidth:180}} placeholder="Имя" />
                <input type="date" value={r.date} onChange={e => { const nr=[...reviews]; nr[idx]={...nr[idx],date:e.target.value}; saveReviews(nr); }} style={{...inputStyle,maxWidth:180}} />
                <button onClick={() => saveReviews(reviews.filter((_,i)=>i!==idx))} style={{...iconBtnStyle,color:"rgba(220,100,100,.7)"}}>✕</button>
              </div>
              <textarea value={r.text} onChange={e => { const nr=[...reviews]; nr[idx]={...nr[idx],text:e.target.value}; saveReviews(nr); }} rows={2} style={{...inputStyle,resize:"vertical"}} />
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ color:"var(--text3)",fontSize:12 }}>Оценка:</span>
                <Stars rating={r.rating} onRate={(val) => { const nr=[...reviews]; nr[idx]={...nr[idx],rating:val}; saveReviews(nr); }} size={18} />
              </div>
            </div>
          ))}
        </div>}

        {adminTab === "channels" && <div className="anim-fade-up">
          {channels.map((ch,chIdx) => (
            <div key={ch.id} style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",padding:20,marginBottom:16 }}>
              <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:12 }}>
                <input value={ch.name} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],name:e.target.value}; saveChannels(nc); }} style={{...inputStyle,fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:".05em",flex:1}} placeholder="Название канала" />
                <button onClick={() => saveChannels(channels.filter((_,i)=>i!==chIdx))} style={{...iconBtnStyle,color:"rgba(220,100,100,.7)",fontSize:18}}>✕</button>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
                <div><label style={labelStyle}>До — Подписчики</label><input value={ch.before.subs} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],before:{...nc[chIdx].before,subs:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>До — Просмотры</label><input value={ch.before.views} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],before:{...nc[chIdx].before,views:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>После — Подписчики</label><input value={ch.after.subs} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],after:{...nc[chIdx].after,subs:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>После — Просмотры</label><input value={ch.after.views} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],after:{...nc[chIdx].after,views:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
              </div>
              <h4 style={{ color:"var(--text3)",fontSize:11,marginBottom:10,letterSpacing:".1em",textTransform:"uppercase" }}>Точки графика</h4>
              {ch.points.map((pt,ptIdx) => (
                <div key={ptIdx} style={{ display:"flex",gap:8,marginBottom:8,alignItems:"center",flexWrap:"wrap" }}>
                  <input placeholder="Метка" value={pt.label} onChange={e => { const nc=[...channels]; const pts=[...nc[chIdx].points]; pts[ptIdx]={...pts[ptIdx],label:e.target.value}; nc[chIdx]={...nc[chIdx],points:pts}; saveChannels(nc); }} style={{...inputStyle,width:80}} />
                  <input placeholder="Просмотры" type="number" value={pt.views} onChange={e => { const nc=[...channels]; const pts=[...nc[chIdx].points]; pts[ptIdx]={...pts[ptIdx],views:Number(e.target.value)}; nc[chIdx]={...nc[chIdx],points:pts}; saveChannels(nc); }} style={{...inputStyle,width:120}} />
                  <FileUploadBtn accept="image/*" label="Превью" onUpload={url => { const nc=[...channels]; const pts=[...nc[chIdx].points]; pts[ptIdx]={...pts[ptIdx],thumb:url}; nc[chIdx]={...nc[chIdx],points:pts}; saveChannels(nc); }} />
                  {pt.thumb && <img src={pt.thumb} alt="" style={{ width:50,height:30,objectFit:"cover",border:"1px solid rgba(255,255,255,.08)" }} />}
                  <button onClick={() => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],points:nc[chIdx].points.filter((_,i)=>i!==ptIdx)}; saveChannels(nc); }} style={{...iconBtnStyle,color:"rgba(220,100,100,.7)"}}>✕</button>
                </div>
              ))}
              <button onClick={() => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],points:[...nc[chIdx].points,{label:"",views:0,thumb:""}]}; saveChannels(nc); }} style={{...iconBtnStyle,color:"var(--text2)",fontSize:12,marginTop:6}}>+ Точка</button>
            </div>
          ))}
          <button onClick={() => saveChannels([...channels,{id:Date.now(),name:"Новый канал",before:{subs:"0",views:"0"},after:{subs:"0",views:"0"},points:[{label:"Янв",views:0,thumb:""}]}])} style={{...iconBtnStyle,color:"var(--text2)",fontSize:12,padding:"10px 18px",border:"1px dashed rgba(255,255,255,.1)"}}>+ Добавить канал</button>
        </div>}

        {adminTab === "contacts" && <div className="anim-fade-up" style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",padding:24 }}>
          <div style={{ marginBottom:16 }}><label style={labelStyle}>Telegram</label><input value={contacts.telegram||""} onChange={e => saveContacts({...contacts,telegram:e.target.value})} style={inputStyle} placeholder="@yourstudio" /></div>
          <div style={{ marginBottom:16 }}><label style={labelStyle}>Email</label><input value={contacts.email||""} onChange={e => saveContacts({...contacts,email:e.target.value})} style={inputStyle} placeholder="hello@studio.com" /></div>
        </div>}

        {adminTab === "settings" && <div className="anim-fade-up" style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",padding:24 }}>
          <div style={{ marginBottom:16 }}><label style={labelStyle}>Название студии</label><input value={siteName} onChange={e => { setSiteName(e.target.value); saveDoc("siteName",e.target.value); }} style={inputStyle} /></div>
          <div style={{ marginBottom:16 }}><label style={labelStyle}>Описание</label><textarea value={siteDescription} onChange={e => { setSiteDescription(e.target.value); saveDoc("siteDescription",e.target.value); }} rows={3} style={{...inputStyle,resize:"vertical"}} /></div>
          <div style={{ marginBottom:16 }}>
            <label style={labelStyle}>Логотип</label>
            <FileUploadBtn accept="image/*" label="Загрузить логотип" onUpload={url => { setLogoUrl(url); saveDoc("logo",url); }} />
            {logoUrl && <div style={{ marginTop:10,display:"flex",alignItems:"center",gap:10 }}><img src={logoUrl} alt="logo" style={{ width:48,height:48,borderRadius:"50%",objectFit:"cover",border:"1px solid rgba(255,255,255,.1)" }} /><button onClick={() => { setLogoUrl(""); saveDoc("logo",""); }} style={{...iconBtnStyle,color:"rgba(220,100,100,.7)",fontSize:11}}>Удалить</button></div>}
          </div>
          <div style={{ marginBottom:16 }}><label style={labelStyle}>Кол-во работ (пусто — авто)</label><input type="number" value={customWorks??""} onChange={e => { const val=e.target.value===""?null:e.target.value; setCustomWorks(val); saveDoc("customWorks",val); }} style={inputStyle} placeholder={String(totalWorksComputed)} /></div>
          <div style={{ marginBottom:16 }}><label style={labelStyle}>Кол-во каналов (пусто — авто)</label><input type="number" value={customChannels??""} onChange={e => { const val=e.target.value===""?null:e.target.value; setCustomChannels(val); saveDoc("customChannels",val); }} style={inputStyle} placeholder={String(totalChannelsComputed)} /></div>
        </div>}
      </div>
    </div>
  );

  const marqueeItems = ["Монтаж видео","Reels & Shorts","YouTube-ролики","Моушн-графика","Цветокоррекция","Звуковой дизайн","Анимация","Шоурилы"];

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", position:"relative", overflow:"hidden" }}>
      <style>{globalStyles}</style>
      <ScrollProgress />
      <BgOrbs />

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"0 32px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(5,5,5,0.85)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:18,fontWeight:400,letterSpacing:".1em",color:"var(--text)",animation:"flicker 8s ease infinite" }}>
          {logoUrl ? <img src={logoUrl} alt="logo" style={{ height:28,width:28,borderRadius:"50%",objectFit:"cover",verticalAlign:"middle",marginRight:10 }} /> : null}
          {siteName}
        </div>
        <div style={{ display:"flex",gap:2,alignItems:"center" }}>
          {[["portfolio-section","Работы"],["channels-section","Результаты"],["reviews-section","Отзывы"],["contacts-section","Контакты"]].map(([id,label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ padding:"6px 14px",border:"none",background:"transparent",color:"var(--text3)",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:400,transition:"color .25s",letterSpacing:".06em",textTransform:"uppercase" }} onMouseEnter={e => e.currentTarget.style.color="var(--text)"} onMouseLeave={e => e.currentTarget.style.color="var(--text3)"}>{label}</button>
          ))}
        </div>
        <Btn onClick={() => scrollTo("contacts-section")} style={{ padding:"9px 20px",fontSize:11 }}>Заказать</Btn>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 24px 80px",position:"relative",zIndex:1,textAlign:"center",overflow:"hidden" }}>
        {/* Giant background text */}
        <div className="bg-text" style={{ top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"clamp(140px,22vw,320px)" }}>VIDEO</div>

        {/* Decorative corner marks */}
        <div style={{ position:"absolute",top:80,left:32,width:24,height:24,borderTop:"1px solid rgba(255,255,255,.15)",borderLeft:"1px solid rgba(255,255,255,.15)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",top:80,right:32,width:24,height:24,borderTop:"1px solid rgba(255,255,255,.15)",borderRight:"1px solid rgba(255,255,255,.15)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:80,left:32,width:24,height:24,borderBottom:"1px solid rgba(255,255,255,.15)",borderLeft:"1px solid rgba(255,255,255,.15)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:80,right:32,width:24,height:24,borderBottom:"1px solid rgba(255,255,255,.15)",borderRight:"1px solid rgba(255,255,255,.15)",pointerEvents:"none" }} />

        {/* Logo avatar */}
        {logoUrl && (
          <div className="anim-scale-in" style={{ width:72,height:72,borderRadius:"50%",background:`url(${logoUrl}) center/cover`,border:"1px solid rgba(255,255,255,.12)",marginBottom:32,boxShadow:"0 0 60px rgba(255,255,255,.06)" }} />
        )}

        {/* Tag */}
        <div className="anim-fade-up tag" style={{ marginBottom:28, animationDelay:".05s" }}>Видеопроизводство</div>

        {/* Hero headline */}
        <h1 className="anim-fade-up" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3.5rem,10vw,8rem)",fontWeight:400,letterSpacing:".04em",lineHeight:.9,color:"var(--text)",animationDelay:".1s",position:"relative",zIndex:2,marginBottom:12 }}>
          {siteName}
        </h1>

        {/* Subtitle in serif */}
        <p className="anim-fade-up" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.1rem,2.5vw,1.6rem)",fontStyle:"italic",color:"var(--text2)",maxWidth:500,lineHeight:1.5,marginBottom:40,animationDelay:".2s",position:"relative",zIndex:2,fontWeight:300 }}>
          {siteDescription}
        </p>

        {/* Stats row */}
        <div className="anim-fade-up" style={{ display:"flex",gap:0,marginBottom:48,animationDelay:".3s",position:"relative",zIndex:2,border:"1px solid rgba(255,255,255,.07)" }}>
          {[
            { val: avgRating, sub: `${reviews.length} отзывов`, extra: <Stars rating={Math.round(Number(avgRating))} size={12} /> },
            { val: null, target: totalWorks, suffix: "+", sub: "работ" },
            { val: null, target: totalChannels, suffix: "", sub: "канала" }
          ].map((item, i) => (
            <div key={i} style={{ padding:"20px 36px",borderRight:i<2?"1px solid rgba(255,255,255,.07)":"none",textAlign:"center" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:".04em",lineHeight:1,color:"var(--text)",marginBottom:4 }}>
                {item.val !== null ? item.val : <AnimCounter target={item.target} suffix={item.suffix} />}
              </div>
              {item.extra && <div style={{ display:"flex",justifyContent:"center",marginBottom:4 }}>{item.extra}</div>}
              <div style={{ color:"var(--text3)",fontSize:10,letterSpacing:".12em",textTransform:"uppercase" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="anim-fade-up" style={{ display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",animationDelay:".4s",position:"relative",zIndex:2 }}>
          <Btn onClick={() => scrollTo("portfolio-section")}>Смотреть работы</Btn>
          <Btn variant="secondary" onClick={() => scrollTo("contacts-section")}>Написать нам</Btn>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",animation:"float 2.8s ease-in-out infinite",display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
          <div style={{ width:20,height:32,border:"1px solid rgba(255,255,255,.12)",display:"flex",justifyContent:"center",paddingTop:6 }}>
            <div style={{ width:1,height:8,background:"rgba(255,255,255,.3)",animation:"pulse 1.6s ease-in-out infinite" }} />
          </div>
          <span style={{ fontSize:9,letterSpacing:".15em",textTransform:"uppercase",color:"var(--text3)" }}>Scroll</span>
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* PORTFOLIO */}
      <section id="portfolio-section" style={{ padding:"120px 32px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1 }}>
        {/* Decorative background text */}
        <div className="bg-text" style={{ top:0,right:-40,fontSize:"clamp(80px,12vw,180px)",opacity:.012 }}>WORK</div>

        <SectionTitle num="01 / Портфолио" sub="Избранные проекты из нашего портфолио">Наши работы</SectionTitle>

        {[{key:"reels",label:"Reels & Shorts",desc:"Вертикальные форматы для соц. сетей"},{key:"motion",label:"Моушн-графика",desc:"Анимация и визуальные эффекты"},{key:"youtube",label:"YouTube",desc:"Полноформатный монтаж"}].map(({key,label,desc},catIdx) => (
          <div key={key} style={{ marginBottom:80 }}>
            {/* Category header */}
            <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:32,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:"var(--text3)",letterSpacing:".15em" }}>0{catIdx+1}</span>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.4rem,3vw,2rem)",fontWeight:400,letterSpacing:".06em",color:"var(--text)" }}>{label}</h3>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:"var(--text3)",fontSize:15,fontWeight:300 }}>{desc}</span>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:key==="youtube"?"repeat(auto-fill,minmax(320px,1fr))":"repeat(auto-fill,minmax(200px,1fr))",gap:12 }}>
              {works[key].map((item,i) => (
                <div key={item.id} className="anim-fade-up card-hover" style={{ animationDelay:`${i*.06}s`,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",overflow:"hidden",position:"relative" }}>
                  {/* Video / placeholder */}
                  <div style={{ aspectRatio:key==="youtube"?"16/9":"9/16",background:item.video?"#000":"rgba(255,255,255,.02)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative" }}>
                    {item.video
                      ? <video src={item.video} style={{ width:"100%",height:"100%",objectFit:"cover" }} controls playsInline />
                      : (
                        <div style={{ textAlign:"center",padding:24 }}>
                          <div style={{ width:40,height:40,border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:16,color:"var(--text3)" }}>▶</div>
                          <span style={{ color:"var(--text3)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase" }}>Видео</span>
                        </div>
                      )
                    }
                    {/* Overlay gradient */}
                    {!item.video && <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 60%,rgba(5,5,5,.6))",pointerEvents:"none" }} />}
                  </div>
                  {/* Card footer */}
                  <div style={{ padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,.06)" }}>
                    <span style={{ fontWeight:500,fontSize:13,color:"var(--text2)",letterSpacing:".02em" }}>{item.title}</span>
                    {item.price && <span style={{ fontSize:11,fontWeight:500,color:"var(--text3)",letterSpacing:".06em" }}>{item.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* RESULTS / CHANNELS */}
      <section id="channels-section" style={{ padding:"120px 32px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1 }}>
        <div className="bg-text" style={{ top:0,left:-40,fontSize:"clamp(80px,12vw,180px)",opacity:.012 }}>STATS</div>

        <SectionTitle num="02 / Результаты" sub="Реальные результаты каналов после работы с нами">Рост каналов</SectionTitle>

        {channels.map((ch,idx) => (
          <div key={ch.id} className="anim-fade-up" style={{ animationDelay:`${idx*.1}s`,marginBottom:32,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",position:"relative",overflow:"hidden" }}>
            {/* Subtle corner decoration */}
            <div style={{ position:"absolute",top:0,right:0,width:120,height:120,background:"radial-gradient(circle at top right,rgba(255,255,255,.03),transparent 60%)",pointerEvents:"none" }} />

            <div style={{ padding:"32px 32px 0" }}>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:".08em",marginBottom:28,color:"var(--text)" }}>{ch.name}</h3>

              {/* Before / After */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32 }}>
                <div style={{ background:"rgba(255,255,255,.02)",padding:"20px 24px",border:"1px solid rgba(255,255,255,.05)",position:"relative" }}>
                  <div style={{ position:"absolute",top:12,right:12,width:6,height:6,border:"1px solid rgba(220,100,100,.3)",borderRadius:"50%",background:"rgba(220,100,100,.15)" }} />
                  <p style={{ color:"rgba(220,100,100,.6)",fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:".12em",marginBottom:14 }}>До</p>
                  <p style={{ fontSize:13,color:"var(--text3)",marginBottom:6 }}>Подписчики: <strong style={{ color:"var(--text2)",fontWeight:500 }}>{ch.before.subs}</strong></p>
                  <p style={{ fontSize:13,color:"var(--text3)" }}>Просмотры: <strong style={{ color:"var(--text2)",fontWeight:500 }}>{ch.before.views}</strong></p>
                </div>
                <div style={{ background:"rgba(255,255,255,.03)",padding:"20px 24px",border:"1px solid rgba(255,255,255,.08)",position:"relative" }}>
                  <div style={{ position:"absolute",top:12,right:12,width:6,height:6,border:"1px solid rgba(160,220,160,.3)",borderRadius:"50%",background:"rgba(160,220,160,.15)" }} />
                  <p style={{ color:"rgba(160,220,160,.7)",fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:".12em",marginBottom:14 }}>После</p>
                  <p style={{ fontSize:13,color:"var(--text3)",marginBottom:6 }}>Подписчики: <strong style={{ color:"var(--text)",fontWeight:600 }}>{ch.after.subs}</strong></p>
                  <p style={{ fontSize:13,color:"var(--text3)" }}>Просмотры: <strong style={{ color:"var(--text)",fontWeight:600 }}>{ch.after.views}</strong></p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={{ height:220,padding:"0 8px 24px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ch.points} margin={{top:10,right:24,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id={`grad-${ch.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{fill:"rgba(255,255,255,.2)",fontSize:11,fontFamily:"'Space Grotesk',sans-serif"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"rgba(255,255,255,.15)",fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:"rgba(10,10,10,.95)",border:"1px solid rgba(255,255,255,.08)",borderRadius:0,fontSize:12,color:"var(--text)",fontFamily:"'Space Grotesk',sans-serif"}} formatter={v=>[v.toLocaleString(),"Просмотры"]}/>
                  <Area type="monotone" dataKey="views" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} fill={`url(#grad-${ch.id})`} dot={{r:3,fill:"rgba(255,255,255,.5)",stroke:"none"}} activeDot={{r:5,fill:"#fff"}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {ch.points.some(p=>p.thumb) && (
              <div style={{ display:"flex",gap:8,overflowX:"auto",padding:"0 32px 24px" }}>
                {ch.points.filter(p=>p.thumb).map((p,i)=>(<div key={i} style={{ minWidth:80,textAlign:"center",flexShrink:0 }}><img src={p.thumb} alt="" style={{ width:80,height:45,objectFit:"cover",border:"1px solid rgba(255,255,255,.08)" }}/><p style={{ fontSize:10,color:"var(--text3)",marginTop:4,letterSpacing:".06em",textTransform:"uppercase" }}>{p.label}</p></div>))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* REVIEWS */}
      <section id="reviews-section" style={{ padding:"120px 32px",maxWidth:960,margin:"0 auto",position:"relative",zIndex:1 }}>
        <div className="bg-text" style={{ bottom:0,right:-40,fontSize:"clamp(80px,12vw,180px)",opacity:.012 }}>TRUST</div>

        <SectionTitle num="03 / Отзывы" sub="Что говорят клиенты о нашей работе">Клиенты</SectionTitle>

        {/* Review form */}
        <div className="glass" style={{ padding:28,marginBottom:40,border:"1px solid rgba(255,255,255,.07)" }}>
          <h4 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:".08em",marginBottom:20,color:"var(--text2)" }}>Оставить отзыв</h4>
          <div style={{ display:"flex",gap:14,marginBottom:14,flexWrap:"wrap",alignItems:"center" }}>
            <input placeholder="Ваше имя" value={reviewName} onChange={e=>setReviewName(e.target.value)} style={{...inputStyle,flex:1,minWidth:150}} />
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:12,color:"var(--text3)",letterSpacing:".06em",textTransform:"uppercase" }}>Оценка</span>
              <Stars rating={reviewRating} onRate={setReviewRating} size={20}/>
            </div>
          </div>
          <textarea placeholder="Напишите отзыв..." value={reviewText} onChange={e=>setReviewText(e.target.value)} rows={3} style={{...inputStyle,width:"100%",resize:"vertical",marginBottom:16}} />
          <Btn onClick={submitReview} disabled={saving} style={{ fontSize:11,padding:"11px 28px" }}>{saving?"Отправка...":"Отправить"}</Btn>
        </div>

        {/* Reviews grid */}
        <div style={{ display:"grid",gap:10 }}>
          {reviews.map((r,i)=>(
            <div key={r.id} className="anim-fade-up card-hover" style={{ animationDelay:`${i*.05}s`,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",padding:"24px 28px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8 }}>
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  <div style={{ width:36,height:36,border:"1px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,color:"var(--text2)",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:".05em",flexShrink:0 }}>{r.name[0]?.toUpperCase()}</div>
                  <span style={{ fontWeight:600,fontSize:15,letterSpacing:".02em" }}>{r.name}</span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <Stars rating={r.rating} size={13}/>
                  <span style={{ color:"var(--text3)",fontSize:11,letterSpacing:".06em" }}>{r.date}</span>
                </div>
              </div>
              <p style={{ color:"var(--text2)",fontSize:14,lineHeight:1.75,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:16,fontWeight:300 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts-section" style={{ padding:"120px 32px 160px",maxWidth:800,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center" }}>
        {/* Big decorative text behind */}
        <div className="bg-text" style={{ top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"clamp(80px,14vw,200px)",opacity:.012 }}>TALK</div>

        <SectionTitle num="04 / Контакты" sub="Готовы обсудить ваш проект — напишите нам">Связаться</SectionTitle>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:48,textAlign:"left" }}>
          {/* Telegram */}
          <a href={`https://t.me/${(contacts.telegram||"").replace("@","")}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
            <div className="card-hover" style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.08)",padding:"32px 28px",cursor:"pointer",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,right:0,width:80,height:80,background:"radial-gradient(circle at top right,rgba(255,255,255,.04),transparent)",pointerEvents:"none" }} />
              <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:".14em",color:"var(--text3)",marginBottom:16 }}>Telegram</div>
              <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:".06em",color:"var(--text)",marginBottom:10 }}>{contacts.telegram||"@yourstudio"}</p>
              <p style={{ fontSize:13,color:"var(--text3)",lineHeight:1.6,fontWeight:300 }}>Отвечаем быстро. Напишите нам для быстрой связи.</p>
              <div style={{ marginTop:20,fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:"var(--text3)",borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:16 }}>Открыть →</div>
            </div>
          </a>
          {/* Email */}
          <a href={`mailto:${contacts.email||"hello@studio.com"}`} style={{ textDecoration:"none" }}>
            <div className="card-hover" style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.08)",padding:"32px 28px",cursor:"pointer",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",bottom:0,left:0,width:80,height:80,background:"radial-gradient(circle at bottom left,rgba(255,255,255,.04),transparent)",pointerEvents:"none" }} />
              <div style={{ fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:".14em",color:"var(--text3)",marginBottom:16 }}>Email</div>
              <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:".06em",color:"var(--text)",marginBottom:10,wordBreak:"break-all" }}>{contacts.email||"hello@studio.com"}</p>
              <p style={{ fontSize:13,color:"var(--text3)",lineHeight:1.6,fontWeight:300 }}>Для детального брифа и обсуждения пишите на почту.</p>
              <div style={{ marginTop:20,fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:"var(--text3)",borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:16 }}>Написать →</div>
            </div>
          </a>
        </div>

        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
          <Btn variant="tg" onClick={()=>window.open(`https://t.me/${(contacts.telegram||"").replace("@","")}`,`_blank`)} style={{ fontSize:11,padding:"14px 36px" }}>Telegram</Btn>
          <Btn variant="mail" onClick={()=>window.location.href=`mailto:${contacts.email||"hello@studio.com"}`} style={{ fontSize:11,padding:"14px 36px" }}>Email</Btn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,.05)",padding:"20px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,position:"relative",zIndex:1 }}>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:".1em",color:"var(--text3)" }}>{siteName}</span>
        <span style={{ fontSize:11,color:"var(--text3)",letterSpacing:".06em" }}>© {new Date().getFullYear()} — Монтаж видео</span>
        <button onClick={()=>setShowPasswordModal(true)} style={{ background:"transparent",border:"none",color:"rgba(255,255,255,.04)",fontSize:10,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"color .3s",letterSpacing:".06em" }} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.15)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.04)"}>admin</button>
      </footer>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s ease" }} onClick={()=>{setShowPasswordModal(false);setPwdError(false);setPwdInput("");}}>
          <div className="anim-scale-in" onClick={e=>e.stopPropagation()} style={{ background:"rgba(10,10,10,.95)",border:"1px solid rgba(255,255,255,.1)",padding:40,width:320,position:"relative" }}>
            {/* Corner marks */}
            <div style={{ position:"absolute",top:0,left:0,width:16,height:16,borderTop:"1px solid rgba(255,255,255,.2)",borderLeft:"1px solid rgba(255,255,255,.2)" }} />
            <div style={{ position:"absolute",bottom:0,right:0,width:16,height:16,borderBottom:"1px solid rgba(255,255,255,.2)",borderRight:"1px solid rgba(255,255,255,.2)" }} />
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:".1em",marginBottom:24,textAlign:"center",color:"var(--text)" }}>Вход в панель</h3>
            <input type="password" placeholder="Пароль" value={pwdInput} onChange={e=>{setPwdInput(e.target.value);setPwdError(false);}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...inputStyle,textAlign:"center",fontSize:15,marginBottom:12}} autoFocus />
            {pwdError && <p style={{ color:"rgba(220,100,100,.8)",fontSize:12,textAlign:"center",marginBottom:12,letterSpacing:".04em" }}>Неверный пароль</p>}
            <Btn onClick={handleLogin} style={{ width:"100%",textAlign:"center" }}>Войти</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
