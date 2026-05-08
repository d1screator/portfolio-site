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
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#080810;--surface:#0f0f1a;--surface2:#181826;--border:#252535;--text:#eeeef2;--text2:#7878a0;--accent:#7c6af5;--accent2:#a99dff;--gradient1:linear-gradient(135deg,#7c6af5,#a99dff,#f472b6);--radius:18px;--radius-sm:12px}
html{scroll-behavior:smooth}body{background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;overflow-x:hidden}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:128px 128px}
@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.anim-fade-up{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both}
.anim-scale-in{animation:scaleIn .65s cubic-bezier(.16,1,.3,1) both}
.anim-slide-down{animation:slideDown .4s cubic-bezier(.16,1,.3,1) both}
.gradient-text{background:var(--gradient1);background-size:200% 200%;animation:gradientShift 5s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.glass{background:rgba(15,15,26,.65);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.05)}
.card-hover{transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s,border-color .35s}
.card-hover:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(124,106,245,.12);border-color:rgba(124,106,245,.25)!important}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--accent);border-radius:3px}
input,textarea,select{font-family:'Manrope',sans-serif}
#scroll-progress{position:fixed;top:0;left:0;height:2px;background:var(--gradient1);background-size:200% 200%;animation:gradientShift 3s ease infinite;z-index:10000;transition:width .1s linear}
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

const Stars = ({ rating, onRate, size = 18 }) => (<div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4, 5].map(i => (<span key={i} onClick={() => onRate && onRate(i)} style={{ cursor: onRate ? "pointer" : "default", fontSize: size, color: i <= rating ? "#fbbf24" : "#2a2a3a", transition: "color .2s,transform .2s", display: "inline-block" }} onMouseEnter={e => onRate && (e.target.style.transform = "scale(1.3)")} onMouseLeave={e => onRate && (e.target.style.transform = "scale(1)")}>★</span>))}</div>);

const SectionTitle = ({ children, id, sub }) => (
  <div id={id} style={{ textAlign: "center", marginBottom: 52 }}>
    <h2 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(1.5rem,4vw,2.2rem)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: sub ? 12 : 0 }}><span className="gradient-text">{children}</span></h2>
    {sub && <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7 }}>{sub}</p>}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled = false }) => {
  const base = { fontFamily: "'Unbounded',sans-serif", fontWeight: 600, fontSize: 13, padding: "14px 34px", borderRadius: 50, border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all .3s cubic-bezier(.4,0,.2,1)", letterSpacing: ".02em", opacity: disabled ? .5 : 1 };
  const vars = { primary: { background: "var(--gradient1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite", color: "#fff", boxShadow: "0 4px 28px rgba(124,106,245,.3)" }, secondary: { background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }, ghost: { background: "rgba(124,106,245,.1)", color: "var(--accent2)", border: "1px solid rgba(124,106,245,.2)" }, tg: { background: "linear-gradient(135deg,#2aabee,#229ed9)", color: "#fff", boxShadow: "0 4px 24px rgba(42,171,238,.3)" }, mail: { background: "linear-gradient(135deg,#7c6af5,#a99dff)", color: "#fff", boxShadow: "0 4px 24px rgba(124,106,245,.3)" } };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...vars[variant], ...s }} onMouseEnter={e => { if (disabled) return; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }} onMouseLeave={e => { if (disabled) return; e.currentTarget.style.transform = "translateY(0) scale(1)"; }}>{children}</button>;
};

const Marquee = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", width: "max-content", animation: "marquee 22s linear infinite" }}>
        {doubled.map((item, i) => (<span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 36px", fontFamily: "'Unbounded',sans-serif", fontSize: 12, fontWeight: 500, color: "var(--text2)", whiteSpace: "nowrap" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />{item}</span>))}
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
    setUploading(true); setProgress(`Загрузка: ${file.name}...`);
    try { const url = await uploadFile(file, accept.includes("video") ? "videos" : "images"); onUpload(url); setProgress("Готово!"); setTimeout(() => setProgress(""), 2000); }
    catch (err) { console.error(err); setProgress("Ошибка загрузки"); setTimeout(() => setProgress(""), 3000); }
    setUploading(false); if (ref.current) ref.current.value = "";
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <input ref={ref} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
      <button onClick={() => ref.current?.click()} disabled={uploading} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: "'Manrope',sans-serif", cursor: uploading ? "wait" : "pointer", background: "rgba(124,106,245,.12)", color: "var(--accent2)", border: "1px solid rgba(124,106,245,.25)", transition: "all .3s", opacity: uploading ? .6 : 1 }}>{uploading ? "⏳" : "📁"} {label}</button>
      {progress && <span style={{ fontSize: 11, color: progress === "Готово!" ? "#34d399" : progress.includes("Ошибка") ? "#f87171" : "var(--text2)" }}>{progress}</span>}
    </div>
  );
};

const inputStyle = { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 14, outline: "none", width: "100%", transition: "border-color .3s" };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: .8, marginBottom: 6 };
const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: 6, fontFamily: "'Manrope',sans-serif" };

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

  useEffect(() => {
    (async () => {
      try {
        const [r, w, ch, co, sn, lg, sd] = await Promise.all([loadDoc("reviews", DEFAULT_REVIEWS), loadDoc("works", DEFAULT_WORKS), loadDoc("channels", DEFAULT_CHANNELS), loadDoc("contacts", DEFAULT_CONTACTS), loadDoc("siteName", "STUDIO"), loadDoc("logo", ""), loadDoc("siteDescription", DEFAULT_DESCRIPTION)]);
        setReviews(r); setWorks(w); setChannels(ch); setContacts(co); setSiteName(sn); setLogoUrl(lg); setSiteDescription(sd);
      } catch (e) { console.error(e); }
      setLoaded(true);
    })();
  }, []);
  useEffect(() => {
    const u = [subDoc("reviews", setReviews), subDoc("works", setWorks), subDoc("channels", setChannels), subDoc("contacts", setContacts), subDoc("siteName", setSiteName), subDoc("logo", setLogoUrl), subDoc("siteDescription", setSiteDescription)];
    return () => u.forEach(f => f());
  }, []);

  const saveReviews = async r => { setReviews(r); await saveDoc("reviews", r); };
  const saveWorks = async w => { setWorks(w); await saveDoc("works", w); };
  const saveChannels = async c => { setChannels(c); await saveDoc("channels", c); };
  const saveContacts = async c => { setContacts(c); await saveDoc("contacts", c); };
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const totalWorks = works.reels.length + works.motion.length + works.youtube.length;
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const submitReview = async () => {
    if (!reviewName.trim() || !reviewText.trim()) return; setSaving(true);
    const newR = [{ id: Date.now(), name: reviewName, rating: reviewRating, text: reviewText, date: new Date().toISOString().slice(0, 10) }, ...reviews];
    await saveReviews(newR); setReviewName(""); setReviewRating(5); setReviewText(""); setSaving(false);
  };
  const handleLogin = () => { if (pwdInput === ADMIN_PASSWORD) { setIsAdmin(true); setShowPasswordModal(false); setPwdInput(""); setPwdError(false); } else setPwdError(true); };

  if (!loaded) return (<div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}><style>{globalStyles}</style><div style={{ width: 44, height: 44, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "rotate .8s linear infinite" }} /><p style={{ color: "var(--text2)", fontSize: 13, fontFamily: "'Manrope',sans-serif" }}>Загрузка...</p></div>);

  // ─── ADMIN ───────────────────────────────────────────────────────
  if (isAdmin) return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "30px 20px" }}><style>{globalStyles}</style>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 22 }} className="gradient-text">Админ-панель</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 11, color: "#34d399" }}>● Online</span><Btn variant="secondary" onClick={() => setIsAdmin(false)}>← На сайт</Btn></div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {[["works","Работы"],["reviews","Отзывы"],["channels","Каналы"],["contacts","Контакты"],["settings","Настройки"]].map(([k,l]) => (
            <button key={k} onClick={() => setAdminTab(k)} style={{ padding: "10px 20px", borderRadius: 50, border: "1px solid", borderColor: adminTab===k?"var(--accent)":"var(--border)", background: adminTab===k?"rgba(124,106,245,.15)":"transparent", color: adminTab===k?"var(--accent2)":"var(--text2)", cursor: "pointer", fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, transition: "all .3s" }}>{l}</button>
          ))}
        </div>
        {adminTab === "works" && <div className="anim-fade-up">
          {["reels","motion","youtube"].map(cat => (
            <div key={cat} style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 18, marginBottom: 16 }}>{cat==="youtube"?"YouTube":cat==="reels"?"Reels":"Моушн"}</h3>
              {works[cat].map((item,idx) => (
                <div key={item.id} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 16, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                    <input placeholder="Название" value={item.title} onChange={e => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],title:e.target.value}; saveWorks(nw); }} style={inputStyle} />
                    <input placeholder="Цена" value={item.price} onChange={e => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],price:e.target.value}; saveWorks(nw); }} style={{...inputStyle,width:120}} />
                    <button onClick={() => { const nw={...works}; nw[cat]=nw[cat].filter((_,i)=>i!==idx); saveWorks(nw); }} style={{...iconBtnStyle,color:"#f87171"}}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <FileUploadBtn accept="video/*" label="Загрузить видео" onUpload={url => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],video:url}; saveWorks(nw); }} />
                    {item.video && <span style={{ fontSize: 11, color: "#34d399" }}>✓ Видео загружено</span>}
                    {item.video && <button onClick={() => { const nw={...works}; nw[cat]=[...nw[cat]]; nw[cat][idx]={...nw[cat][idx],video:""}; saveWorks(nw); }} style={{...iconBtnStyle,color:"#f87171",fontSize:11}}>Удалить</button>}
                  </div>
                  {item.video && <div style={{ marginTop: 8 }}><video src={item.video} style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8, border: "1px solid var(--border)" }} controls /></div>}
                </div>
              ))}
              <button onClick={() => { const nw={...works}; nw[cat]=[...nw[cat],{id:Date.now(),title:"",video:"",price:""}]; saveWorks(nw); }} style={{...iconBtnStyle,color:"var(--accent2)",fontSize:13,padding:"8px 16px",border:"1px dashed var(--border)",borderRadius:8}}>+ Добавить</button>
            </div>
          ))}
        </div>}
        {adminTab === "reviews" && <div className="anim-fade-up">
          {reviews.length===0 && <p style={{ color:"var(--text2)",textAlign:"center",padding:40 }}>Отзывов пока нет</p>}
          {reviews.map((r,idx) => (
            <div key={r.id} style={{ background:"var(--surface)",borderRadius:"var(--radius-sm)",padding:16,marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap" }}>
              <span style={{ color:"var(--text2)",fontSize:13,minWidth:80 }}>{r.name}</span><Stars rating={r.rating} size={14} />
              <span style={{ color:"var(--text2)",fontSize:12,flex:1 }}>{r.text.slice(0,60)}...</span>
              <span style={{ color:"#444",fontSize:11 }}>{r.date}</span>
              <button onClick={() => saveReviews(reviews.filter((_,i)=>i!==idx))} style={{...iconBtnStyle,color:"#f87171"}}>✕</button>
            </div>
          ))}
        </div>}
        {adminTab === "channels" && <div className="anim-fade-up">
          {channels.map((ch,chIdx) => (
            <div key={ch.id} style={{ background:"var(--surface)",borderRadius:"var(--radius)",padding:20,marginBottom:20 }}>
              <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:12 }}>
                <input value={ch.name} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],name:e.target.value}; saveChannels(nc); }} style={{...inputStyle,fontFamily:"'Unbounded',sans-serif",fontWeight:600,fontSize:16,flex:1}} placeholder="Название канала" />
                <button onClick={() => saveChannels(channels.filter((_,i)=>i!==chIdx))} style={{...iconBtnStyle,color:"#f87171",fontSize:18}}>✕</button>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
                <div><label style={labelStyle}>До — Подписчики</label><input value={ch.before.subs} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],before:{...nc[chIdx].before,subs:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>До — Просмотры</label><input value={ch.before.views} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],before:{...nc[chIdx].before,views:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>После — Подписчики</label><input value={ch.after.subs} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],after:{...nc[chIdx].after,subs:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
                <div><label style={labelStyle}>После — Просмотры</label><input value={ch.after.views} onChange={e => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],after:{...nc[chIdx].after,views:e.target.value}}; saveChannels(nc); }} style={inputStyle} /></div>
              </div>
              <h4 style={{ color:"var(--text2)",fontSize:13,marginBottom:10 }}>Точки графика</h4>
              {ch.points.map((pt,ptIdx) => (
                <div key={ptIdx} style={{ display:"flex",gap:8,marginBottom:8,alignItems:"center",flexWrap:"wrap" }}>
                  <input placeholder="Метка" value={pt.label} onChange={e => { const nc=[...channels]; const pts=[...nc[chIdx].points]; pts[ptIdx]={...pts[ptIdx],label:e.target.value}; nc[chIdx]={...nc[chIdx],points:pts}; saveChannels(nc); }} style={{...inputStyle,width:80}} />
                  <input placeholder="Просмотры" type="number" value={pt.views} onChange={e => { const nc=[...channels]; const pts=[...nc[chIdx].points]; pts[ptIdx]={...pts[ptIdx],views:Number(e.target.value)}; nc[chIdx]={...nc[chIdx],points:pts}; saveChannels(nc); }} style={{...inputStyle,width:120}} />
                  <FileUploadBtn accept="image/*" label="Превью" onUpload={url => { const nc=[...channels]; const pts=[...nc[chIdx].points]; pts[ptIdx]={...pts[ptIdx],thumb:url}; nc[chIdx]={...nc[chIdx],points:pts}; saveChannels(nc); }} />
                  {pt.thumb && <img src={pt.thumb} alt="" style={{ width:50,height:30,objectFit:"cover",borderRadius:4,border:"1px solid var(--border)" }} />}
                  <button onClick={() => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],points:nc[chIdx].points.filter((_,i)=>i!==ptIdx)}; saveChannels(nc); }} style={{...iconBtnStyle,color:"#f87171"}}>✕</button>
                </div>
              ))}
              <button onClick={() => { const nc=[...channels]; nc[chIdx]={...nc[chIdx],points:[...nc[chIdx].points,{label:"",views:0,thumb:""}]}; saveChannels(nc); }} style={{...iconBtnStyle,color:"var(--accent2)",fontSize:12,marginTop:6}}>+ Точка</button>
            </div>
          ))}
          <button onClick={() => saveChannels([...channels,{id:Date.now(),name:"Новый канал",before:{subs:"0",views:"0"},after:{subs:"0",views:"0"},points:[{label:"Янв",views:0,thumb:""}]}])} style={{...iconBtnStyle,color:"var(--accent2)",fontSize:13,padding:"10px 20px",border:"1px dashed var(--border)",borderRadius:10}}>+ Добавить канал</button>
        </div>}
        {adminTab === "contacts" && <div className="anim-fade-up" style={{ background:"var(--surface)",borderRadius:"var(--radius)",padding:24 }}>
          <div style={{ marginBottom:14 }}><label style={labelStyle}>Telegram</label><input value={contacts.telegram||""} onChange={e => saveContacts({...contacts,telegram:e.target.value})} style={inputStyle} placeholder="@yourstudio" /></div>
          <div style={{ marginBottom:14 }}><label style={labelStyle}>Email</label><input value={contacts.email||""} onChange={e => saveContacts({...contacts,email:e.target.value})} style={inputStyle} placeholder="hello@studio.com" /></div>
        </div>}
        {adminTab === "settings" && <div className="anim-fade-up" style={{ background:"var(--surface)",borderRadius:"var(--radius)",padding:24 }}>
          <div style={{ marginBottom:14 }}><label style={labelStyle}>Название студии</label><input value={siteName} onChange={e => { setSiteName(e.target.value); saveDoc("siteName",e.target.value); }} style={inputStyle} /></div>
          <div style={{ marginBottom:14 }}><label style={labelStyle}>Описание (под заголовком)</label><textarea value={siteDescription} onChange={e => { setSiteDescription(e.target.value); saveDoc("siteDescription",e.target.value); }} rows={3} style={{...inputStyle,resize:"vertical"}} placeholder="Расскажите о себе..." /></div>
          <div style={{ marginBottom:14 }}>
            <label style={labelStyle}>Логотип</label>
            <FileUploadBtn accept="image/*" label="Загрузить логотип" onUpload={url => { setLogoUrl(url); saveDoc("logo",url); }} />
            {logoUrl && <div style={{ marginTop:10,display:"flex",alignItems:"center",gap:10 }}><img src={logoUrl} alt="logo" style={{ width:60,height:60,borderRadius:"50%",objectFit:"cover",border:"1px solid var(--border)" }} /><button onClick={() => { setLogoUrl(""); saveDoc("logo",""); }} style={{...iconBtnStyle,color:"#f87171",fontSize:12}}>Удалить</button></div>}
          </div>
        </div>}
      </div>
    </div>
  );

  // ─── PUBLIC ──────────────────────────────────────────────────────
  const marqueeItems = ["Монтаж видео","Reels & Shorts","YouTube-ролики","Моушн-графика","Цветокоррекция","Звуковой дизайн","Анимация","Шоурилы"];
  return (
    <div style={{ background:"var(--bg)",minHeight:"100vh",position:"relative",overflow:"hidden" }}><style>{globalStyles}</style>
      <ScrollProgress />
      <div style={{ position:"fixed",top:"-20vh",right:"-15vw",width:"60vw",height:"60vw",maxWidth:700,maxHeight:700,background:"radial-gradient(circle,rgba(124,106,245,.07) 0%,transparent 65%)",pointerEvents:"none",zIndex:0 }} />
      <div style={{ position:"fixed",bottom:"-25vh",left:"-15vw",width:"55vw",height:"55vw",maxWidth:650,maxHeight:650,background:"radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)",pointerEvents:"none",zIndex:0 }} />

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"0 24px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(8,8,16,.8)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ fontFamily:"'Unbounded',sans-serif",fontSize:15,fontWeight:700,letterSpacing:".05em" }}><span className="gradient-text">{siteName}</span></div>
        <div style={{ display:"flex",gap:4 }}>
          {[["portfolio-section","Работы"],["channels-section","Результаты"],["reviews-section","Отзывы"],["contacts-section","Контакты"]].map(([id,label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ padding:"8px 14px",borderRadius:50,border:"none",background:"transparent",color:"var(--text2)",cursor:"pointer",fontFamily:"'Manrope',sans-serif",fontSize:13,fontWeight:600,transition:"color .2s,background .2s" }} onMouseEnter={e => { e.currentTarget.style.color="var(--text)"; e.currentTarget.style.background="rgba(255,255,255,.05)"; }} onMouseLeave={e => { e.currentTarget.style.color="var(--text2)"; e.currentTarget.style.background="transparent"; }}>{label}</button>
          ))}
        </div>
        <Btn onClick={() => scrollTo("contacts-section")} style={{ padding:"10px 22px",fontSize:12 }}>Заказать</Btn>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 20px 80px",position:"relative",zIndex:1,textAlign:"center" }}>
        <div className="anim-scale-in" style={{ width:120,height:120,borderRadius:"50%",background:logoUrl?`url(${logoUrl}) center/cover`:"var(--gradient1)",backgroundSize:logoUrl?"cover":"200% 200%",animation:logoUrl?"none":"gradientShift 4s ease infinite",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 80px rgba(124,106,245,.25),0 0 160px rgba(124,106,245,.1)",marginBottom:28,fontSize:logoUrl?0:34,fontFamily:"'Unbounded',sans-serif",fontWeight:800,color:"#fff",flexShrink:0 }}>{!logoUrl && siteName[0]}</div>
        <h1 className="anim-fade-up" style={{ fontFamily:"'Unbounded',sans-serif",fontSize:"clamp(2.4rem,7vw,4.2rem)",fontWeight:900,marginBottom:20,letterSpacing:"-.04em",lineHeight:1,animationDelay:".1s" }}><span className="gradient-text">{siteName}</span></h1>
        <p className="anim-fade-up" style={{ animationDelay:".2s",color:"var(--text2)",fontSize:"clamp(14px,2vw,16px)",lineHeight:1.75,maxWidth:520,marginBottom:36,fontWeight:400 }}>{siteDescription}</p>
        <div className="anim-fade-up" style={{ animationDelay:".3s",display:"flex",gap:32,marginBottom:40,flexWrap:"wrap",justifyContent:"center",alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28,fontWeight:800,fontFamily:"'Unbounded',sans-serif" }}>{avgRating}</div>
            <div style={{ display:"flex",justifyContent:"center",marginTop:4 }}><Stars rating={Math.round(Number(avgRating))} size={14} /></div>
            <div style={{ color:"var(--text2)",fontSize:11,marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>{reviews.length} отзывов</div>
          </div>
          <div style={{ width:1,height:48,background:"var(--border)" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28,fontWeight:800,fontFamily:"'Unbounded',sans-serif" }}><AnimCounter target={totalWorks} suffix="+" /></div>
            <div style={{ color:"var(--text2)",fontSize:11,marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>работ</div>
          </div>
          <div style={{ width:1,height:48,background:"var(--border)" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28,fontWeight:800,fontFamily:"'Unbounded',sans-serif" }}><AnimCounter target={channels.length} /></div>
            <div style={{ color:"var(--text2)",fontSize:11,marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:.5 }}>канала</div>
          </div>
        </div>
        <div className="anim-fade-up" style={{ animationDelay:".4s",display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center" }}>
          <Btn onClick={() => scrollTo("portfolio-section")}>Смотреть работы</Btn>
          <Btn variant="secondary" onClick={() => scrollTo("contacts-section")}>Написать нам</Btn>
        </div>
        <div style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",animation:"float 2.5s ease-in-out infinite" }}>
          <div style={{ width:22,height:36,borderRadius:11,border:"1.5px solid rgba(255,255,255,.15)",display:"flex",justifyContent:"center",paddingTop:7 }}><div style={{ width:2,height:7,borderRadius:1,background:"var(--accent2)",animation:"pulse 1.5s ease-in-out infinite" }} /></div>
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* PORTFOLIO */}
      <section id="portfolio-section" style={{ padding:"96px 20px",maxWidth:1120,margin:"0 auto",position:"relative",zIndex:1 }}>
        <SectionTitle sub="Избранные проекты из нашего портфолио">Портфолио</SectionTitle>
        {[{key:"reels",label:"Reels & Shorts",desc:"Вертикальные форматы для соц. сетей"},{key:"motion",label:"Моушн-графика",desc:"Анимация и визуальные эффекты"},{key:"youtube",label:"YouTube",desc:"Полноформатный монтаж"}].map(({key,label,desc}) => (
          <div key={key} style={{ marginBottom:64 }}>
            <div style={{ display:"flex",alignItems:"baseline",gap:14,marginBottom:24,flexWrap:"wrap" }}>
              <h3 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:18,fontWeight:700 }}>{label}</h3>
              <span style={{ color:"var(--text2)",fontSize:13 }}>{desc}</span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:key==="youtube"?"repeat(auto-fill,minmax(300px,1fr))":"repeat(auto-fill,minmax(190px,1fr))",gap:16 }}>
              {works[key].map((item,i) => (
                <div key={item.id} className="anim-fade-up card-hover" style={{ animationDelay:`${i*.07}s`,background:"var(--surface)",borderRadius:"var(--radius)",overflow:"hidden",border:"1px solid var(--border)" }}>
                  <div style={{ aspectRatio:key==="youtube"?"16/9":"9/16",background:item.video?"#000":"linear-gradient(135deg,var(--surface2),var(--surface))",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                    {item.video?<video src={item.video} style={{ width:"100%",height:"100%",objectFit:"cover" }} controls playsInline />:<div style={{ color:"var(--text2)",fontSize:12,textAlign:"center",padding:20 }}><div style={{ width:44,height:44,borderRadius:"50%",border:"2px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:18 }}>▶</div><span>Видео</span></div>}
                  </div>
                  <div style={{ padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontWeight:600,fontSize:13 }}>{item.title}</span>
                    {item.price && <span style={{ fontSize:11,fontWeight:700,background:"rgba(124,106,245,.12)",color:"var(--accent2)",padding:"4px 10px",borderRadius:20,whiteSpace:"nowrap" }}>{item.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CHANNELS */}
      <section id="channels-section" style={{ padding:"96px 20px",maxWidth:1120,margin:"0 auto",position:"relative",zIndex:1 }}>
        <SectionTitle sub="Реальные результаты каналов после работы с нами">Результаты</SectionTitle>
        {channels.map((ch,idx) => (
          <div key={ch.id} className="anim-fade-up" style={{ animationDelay:`${idx*.1}s`,background:"var(--surface)",borderRadius:"var(--radius)",padding:"32px 28px",marginBottom:28,border:"1px solid var(--border)" }}>
            <h3 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:17,fontWeight:700,marginBottom:24 }}>{ch.name}</h3>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28 }}>
              <div style={{ background:"rgba(248,113,113,.06)",borderRadius:"var(--radius-sm)",padding:"18px 20px",border:"1px solid rgba(248,113,113,.1)" }}><p style={{ color:"#f87171",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:10 }}>ДО</p><p style={{ fontSize:13,color:"var(--text2)",marginBottom:6 }}>Подписчики: <strong style={{ color:"var(--text)" }}>{ch.before.subs}</strong></p><p style={{ fontSize:13,color:"var(--text2)" }}>Просмотры: <strong style={{ color:"var(--text)" }}>{ch.before.views}</strong></p></div>
              <div style={{ background:"rgba(124,106,245,.06)",borderRadius:"var(--radius-sm)",padding:"18px 20px",border:"1px solid rgba(124,106,245,.15)" }}><p style={{ color:"var(--accent2)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:10 }}>ПОСЛЕ</p><p style={{ fontSize:13,color:"var(--text2)",marginBottom:6 }}>Подписчики: <strong style={{ color:"var(--text)" }}>{ch.after.subs}</strong></p><p style={{ fontSize:13,color:"var(--text2)" }}>Просмотры: <strong style={{ color:"var(--text)" }}>{ch.after.views}</strong></p></div>
            </div>
            <div style={{ height:240,marginBottom:16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ch.points} margin={{top:10,right:10,left:-20,bottom:0}}>
                  <defs><linearGradient id={`grad-${ch.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c6af5" stopOpacity={.35}/><stop offset="100%" stopColor="#7c6af5" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="label" tick={{fill:"#555",fontSize:12}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:12,fontSize:13,color:"var(--text)"}} formatter={v=>[v.toLocaleString(),"Просмотры"]}/>
                  <Area type="monotone" dataKey="views" stroke="#7c6af5" strokeWidth={2.5} fill={`url(#grad-${ch.id})`} dot={{r:5,fill:"#7c6af5",stroke:"#0f0f1a",strokeWidth:2}} activeDot={{r:7}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {ch.points.some(p=>p.thumb) && <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:6 }}>{ch.points.filter(p=>p.thumb).map((p,i)=>(<div key={i} style={{ minWidth:80,textAlign:"center" }}><img src={p.thumb} alt="" style={{ width:80,height:45,objectFit:"cover",borderRadius:6,border:"1px solid var(--border)" }}/><p style={{ fontSize:10,color:"var(--text2)",marginTop:4 }}>{p.label}</p></div>))}</div>}
          </div>
        ))}
      </section>

      {/* REVIEWS */}
      <section id="reviews-section" style={{ padding:"96px 20px",maxWidth:900,margin:"0 auto",position:"relative",zIndex:1 }}>
        <SectionTitle sub="Что говорят клиенты о нашей работе">Отзывы</SectionTitle>
        <div className="glass" style={{ borderRadius:"var(--radius)",padding:28,marginBottom:40,border:"1px solid rgba(255,255,255,.04)" }}>
          <h4 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:14,marginBottom:18,fontWeight:600 }}>Оставить отзыв</h4>
          <div style={{ display:"flex",gap:12,marginBottom:12,flexWrap:"wrap",alignItems:"center" }}>
            <input placeholder="Ваше имя" value={reviewName} onChange={e=>setReviewName(e.target.value)} style={{...inputStyle,flex:1,minWidth:150}} />
            <div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ fontSize:13,color:"var(--text2)" }}>Оценка:</span><Stars rating={reviewRating} onRate={setReviewRating} size={22}/></div>
          </div>
          <textarea placeholder="Напишите отзыв..." value={reviewText} onChange={e=>setReviewText(e.target.value)} rows={3} style={{...inputStyle,width:"100%",resize:"vertical",marginBottom:14}} />
          <Btn onClick={submitReview} disabled={saving} style={{ fontSize:12,padding:"10px 24px" }}>{saving?"Отправка...":"Отправить"}</Btn>
        </div>
        <div style={{ display:"grid",gap:12 }}>
          {reviews.map((r,i)=>(<div key={r.id} className="anim-fade-up card-hover" style={{ animationDelay:`${i*.05}s`,background:"var(--surface)",borderRadius:"var(--radius)",padding:"22px 26px",border:"1px solid var(--border)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}><div style={{ width:38,height:38,borderRadius:"50%",background:"var(--gradient1)",backgroundSize:"200% 200%",animation:"gradientShift 4s ease infinite",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0 }}>{r.name[0]?.toUpperCase()}</div><span style={{ fontWeight:700,fontSize:14 }}>{r.name}</span></div>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}><Stars rating={r.rating} size={14}/><span style={{ color:"#333",fontSize:11 }}>{r.date}</span></div>
            </div>
            <p style={{ color:"var(--text2)",fontSize:14,lineHeight:1.7 }}>{r.text}</p>
          </div>))}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts-section" style={{ padding:"96px 20px 120px",maxWidth:760,margin:"0 auto",position:"relative",zIndex:1 }}>
        <SectionTitle sub="Готовы обсудить ваш проект — напишите нам">Контакты</SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginBottom:40 }}>
          <a href={`https://t.me/${(contacts.telegram||"").replace("@","")}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
            <div style={{ background:"linear-gradient(135deg,rgba(42,171,238,.08),rgba(42,171,238,.03))",borderRadius:"var(--radius)",padding:"32px 28px",border:"1px solid rgba(42,171,238,.18)",cursor:"pointer",transition:"transform .3s,box-shadow .3s,border-color .3s" }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 20px 50px rgba(42,171,238,.15)";e.currentTarget.style.borderColor="rgba(42,171,238,.4)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="rgba(42,171,238,.18)";}}>
              <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
                <div style={{ width:50,height:50,borderRadius:14,background:"rgba(42,171,238,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>✈</div>
                <div><p style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#2aabee",marginBottom:3 }}>Telegram</p><p style={{ fontFamily:"'Unbounded',sans-serif",fontSize:16,fontWeight:600 }}>{contacts.telegram||"@yourstudio"}</p></div>
              </div>
              <p style={{ fontSize:13,color:"var(--text2)",lineHeight:1.6 }}>Отвечаем быстро. Напишите нам для быстрой связи.</p>
            </div>
          </a>
          <a href={`mailto:${contacts.email||"hello@studio.com"}`} style={{ textDecoration:"none" }}>
            <div style={{ background:"linear-gradient(135deg,rgba(124,106,245,.08),rgba(124,106,245,.03))",borderRadius:"var(--radius)",padding:"32px 28px",border:"1px solid rgba(124,106,245,.18)",cursor:"pointer",transition:"transform .3s,box-shadow .3s,border-color .3s" }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 20px 50px rgba(124,106,245,.15)";e.currentTarget.style.borderColor="rgba(124,106,245,.4)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="rgba(124,106,245,.18)";}}>
              <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
                <div style={{ width:50,height:50,borderRadius:14,background:"rgba(124,106,245,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>✉</div>
                <div><p style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--accent2)",marginBottom:3 }}>Email</p><p style={{ fontFamily:"'Unbounded',sans-serif",fontSize:14,fontWeight:600,wordBreak:"break-all" }}>{contacts.email||"hello@studio.com"}</p></div>
              </div>
              <p style={{ fontSize:13,color:"var(--text2)",lineHeight:1.6 }}>Для детального брифа и обсуждения пишите на почту.</p>
            </div>
          </a>
        </div>
        <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
          <Btn variant="tg" onClick={()=>window.open(`https://t.me/${(contacts.telegram||"").replace("@","")}`,`_blank`)} style={{ fontSize:14,padding:"16px 36px" }}>Написать в Telegram</Btn>
          <Btn variant="mail" onClick={()=>window.location.href=`mailto:${contacts.email||"hello@studio.com"}`} style={{ fontSize:14,padding:"16px 36px" }}>Написать на Email</Btn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid var(--border)",padding:"24px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,position:"relative",zIndex:1 }}>
        <span style={{ fontFamily:"'Unbounded',sans-serif",fontSize:13,fontWeight:700 }}><span className="gradient-text">{siteName}</span></span>
        <span style={{ fontSize:12,color:"var(--text2)" }}>© {new Date().getFullYear()} — Монтаж видео</span>
        <button onClick={()=>setShowPasswordModal(true)} style={{ background:"transparent",border:"none",color:"rgba(255,255,255,.06)",fontSize:10,cursor:"pointer",fontFamily:"'Manrope',sans-serif",transition:"color .3s" }} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.2)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.06)"}>admin</button>
      </footer>

      {showPasswordModal && <div style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.75)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s ease" }} onClick={()=>{setShowPasswordModal(false);setPwdError(false);setPwdInput("");}}>
        <div className="anim-scale-in" onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",borderRadius:"var(--radius)",padding:36,width:340,border:"1px solid var(--border)" }}>
          <h3 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:16,marginBottom:22,textAlign:"center" }}><span className="gradient-text">Вход в панель</span></h3>
          <input type="password" placeholder="Пароль" value={pwdInput} onChange={e=>{setPwdInput(e.target.value);setPwdError(false);}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...inputStyle,textAlign:"center",fontSize:16,marginBottom:12}} autoFocus />
          {pwdError && <p style={{ color:"#f87171",fontSize:12,textAlign:"center",marginBottom:10 }}>Неверный пароль</p>}
          <Btn onClick={handleLogin} style={{ width:"100%",textAlign:"center" }}>Войти</Btn>
        </div>
      </div>}
    </div>
  );
}
