import { useState, useRef, useEffect } from "react";
import { SCIENCE_50 } from './data/GEN ED/science_50q';
import { SOCSCI_50 } from './data/GEN ED/socsci_50q';
import { CONTEMP_50 } from './data/GEN ED/contemp_50q';
import { ARTAPP_50 } from './data/GEN ED/artapp_50q';
import { ENGLISH_100 } from './data/GEN ED/english_100q';
import { FILIPINO_100 } from './data/GEN ED/filipino_100q';
import { MATH_100 } from './data/GEN ED/math_100q';
import { RIZAL_15 } from './data/GEN ED/rizal_15q';
import { ETHICS_80 } from './data/GEN ED/ethics_80q';
import { CHILDADO_50 } from './data/Physical Handouts/childado_50q';
import { ASSESS_50 } from './data/Physical Handouts/assess_50q';
import { INCLUSIVE_50 } from './data/Physical Handouts/inclusive_50q';

// ═══════════════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://ztgtrvodalesxqbmrrqd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Z3Rydm9kYWxlc3hxYm1ycnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjU3MDgsImV4cCI6MjA5NzAwMTcwOH0.k7mQyT1gmnSG9pnycjUj7f6xcwTCKgHErOQUHGV5gFg";

async function sbFetch(path, opts = {}) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...opts,
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
        ...(opts.headers || {})
      }
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  } catch { return null; }
}

async function syncUserToSupabase(username, password) {
  try {
    await sbFetch("users", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  } catch {}
}

async function syncScoreToSupabase(username, quizId, score, total, correct) {
  try {
    await sbFetch(`quiz_progress?username=eq.${encodeURIComponent(username)}&quiz_id=eq.${encodeURIComponent(quizId)}`, {
      method: "DELETE"
    });
    await sbFetch("quiz_progress", {
      method: "POST",
      body: JSON.stringify({
        username,
        quiz_id: quizId,
        score,
        total,
        percentage: score,
        completed_at: new Date().toISOString()
      })
    });
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════
// MASTER REVIEW ACADEMY v3
// 7 subjects x 50Q (Prof Ed + Gen Ed)
// Master Board Exam: 350Q (all 7 banks combined)
// Auth: Username/Password | Admin: Rating Sheet
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// QUIZ REGISTRY — 7 quizzes × 50Q
// ═══════════════════════════════════════════════════════════════════
const QUIZ_REGISTRY = [
  { id:"childado-50",   subjId:"childado",  title:"Child & Adolescent Learners — 50Q",
    desc:"Growth & development, developmental stages, Freud, Erikson, Piaget, Vygotsky, Kohlberg, behaviorism & learning theories.",
    questions:CHILDADO_50,   easy:15, moderate:25,  difficult:10, color:"#0ea5e9", icon:"🧠" },
  { id:"assess-50",     subjId:"assess",    title:"Assessment of Learning — 50Q",
    desc:"Assessment purposes & modes, test construction, validity & reliability, item analysis, statistics & K-12 grading.",
    questions:ASSESS_50,     easy:15, moderate:25,  difficult:10, color:"#a855f7", icon:"📊" },
  { id:"inclusive-50",  subjId:"inclusive", title:"Inclusive Education — 50Q",
    desc:"Inclusive vs special needs education, types of disabilities, legal bases, co-teaching models & action research.",
    questions:INCLUSIVE_50,  easy:15, moderate:25,  difficult:10, color:"#f43f5e", icon:"🤝" },
  {id:"science50",subjId:"science",category:"gened",title:"Science and Technology — 50Q",desc:"Earth science, physics, environment, tech & innovation",questions:SCIENCE_50,easy:15,moderate:34,difficult:1,color:"#10b981",icon:"🔬"},
  {id:"socsci50",subjId:"socsci",category:"gened",title:"Social Science — 50Q",desc:"Philippine history, education history & government",questions:SOCSCI_50,easy:8,moderate:42,difficult:0,color:"#ef4444",icon:"🏛"},
  {id:"contemp50",subjId:"contemp",category:"gened",title:"The Contemporary World — 50Q",desc:"Globalization, sustainable development & global issues",questions:CONTEMP_50,easy:10,moderate:40,difficult:0,color:"#8b5cf6",icon:"🌏"},
  {id:"artapp50",subjId:"artapp",category:"gened",title:"Art Appreciation — 50Q",desc:"Art forms, movements, elements, Philippine arts & culture",questions:ARTAPP_50,easy:6,moderate:44,difficult:0,color:"#f97316",icon:"🎨"},
  {id:"english100",subjId:"english",category:"gened",title:"Purposive Communication in English — 100Q",desc:"Grammar, vocabulary, idioms, sentence correction & communication",questions:ENGLISH_100,easy:26,moderate:67,difficult:7,color:"#3b82f6",icon:"📘"},
  {id:"filipino-100",subjId:"filipino",category:"gened",title:"Malayuning Komunikasyon sa Filipino — 100Q",desc:"Ponolohiya, morpolohiya, pangungusap, tayutay at higit pa",questions:FILIPINO_100,easy:19,moderate:77,difficult:4,color:"#f59e0b",icon:"🇵🇭"},
  {id:"math100",subjId:"math",category:"gened",title:"Mathematics — 100Q",desc:"Number theory, fractions, decimals, geometry, statistics & more",questions:MATH_100,easy:14,moderate:68,difficult:18,color:"#6366f1",icon:"📐"},
  {id:"rizal15",subjId:"rizal",category:"gened",title:"Life and Works of Rizal — 15Q",desc:"Rizal's works, philosophies and contributions to the nation",questions:RIZAL_15,easy:1,moderate:14,difficult:0,color:"#ec4899",icon:"📖"},
  {id:"ethics2-80",subjId:"ethics2",category:"gened",title:"Ethics (GEN ED) — 80Q",desc:"Ethical theories, moral decision-making, values & the Good",questions:ETHICS_80,easy:8,moderate:68,difficult:4,color:"#14b8a6",icon:"⚖️"},
];

const SUBJECTS = [
  { id:"childado",   name:"Child & Adolescent Learners",       color:"#0ea5e9", icon:"🧠", desc:"Growth & development, developmental theories, and learning principles." },
  { id:"assess",     name:"Assessment of Learning",            color:"#a855f7", icon:"📊", desc:"Assessment types, test construction, statistics, and K-12 grading." },
  { id:"inclusive",  name:"Inclusive Education",               color:"#f43f5e", icon:"🤝", desc:"Inclusive education, disabilities, legal bases, and action research." },
  {id:"science",name:"Science and Technology",color:"#10b981",icon:"🔬",desc:"Earth science, physics, environment & technology"},
  {id:"socsci",name:"Social Science",color:"#ef4444",icon:"🏛",desc:"Philippine history, society & governance"},
  {id:"contemp",name:"The Contemporary World",color:"#8b5cf6",icon:"🌏",desc:"Globalization, sustainability & global issues"},
  {id:"artapp",name:"Art Appreciation",color:"#f97316",icon:"🎨",desc:"Art forms, movements & Philippine culture"},
  {id:"english",name:"Purposive Communication in English",color:"#3b82f6",icon:"📘",desc:"Grammar, vocabulary, idioms & effective communication"},
  {id:"filipino",name:"Malayuning Komunikasyon sa Filipino",color:"#f59e0b",icon:"🇵🇭",desc:"Ponolohiya, morpolohiya, at komunikasyon sa Filipino"},
  {id:"math",name:"Mathematics",color:"#6366f1",icon:"📐",desc:"Number theory, algebra, geometry & statistics"},
  {id:"rizal",name:"Life and Works of Rizal",color:"#ec4899",icon:"📖",desc:"Rizal's works, philosophies & national contributions"},
  {id:"ethics2",name:"Ethics (GEN ED)",color:"#14b8a6",icon:"⚖️",desc:"Ethical theories, values & moral decision-making"},
];

// ── MASTER 350Q — all 7 subject banks combined ───────────────────
function buildMaster350() {
  return buildOrder(shuffle([
    ...CHILDADO_50, ...ASSESS_50, ...INCLUSIVE_50,
    ...SCIENCE_50, ...SOCSCI_50, ...CONTEMP_50, ...ARTAPP_50,
  ]));
}

// ═══════════════════════════════════════════════════════════════════
// AUTH CONSTANTS
// ═══════════════════════════════════════════════════════════════════
const ADMIN_USER = "crael";
const ADMIN_PASS = "ftrc2024";

// ═══════════════════════════════════════════════════════════════════
// STORAGE — per-user isolation + Supabase sync
// ═══════════════════════════════════════════════════════════════════
function useStorage(username) {
  const prefix = username ? `mra_${username}_` : "mra_guest_";
  const get = (key) => { try { return JSON.parse(localStorage.getItem(prefix + key)) || null; } catch { return null; } };
  const set = (key, val) => {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(val));
      if (key.startsWith("quiz_") && username && val?.score !== undefined) {
        const quizId = key.replace("quiz_", "");
        syncScoreToSupabase(username, quizId, val.score, val.total, val.correct).catch(() => {});
      }
    } catch {}
  };
  const getGlobal = (key) => { try { return JSON.parse(localStorage.getItem("mra_" + key)) || null; } catch { return null; } };
  const setGlobal = (key, val) => { try { localStorage.setItem("mra_" + key, JSON.stringify(val)); } catch {} };
  return { get, set, getGlobal, setGlobal };
}

// ═══════════════════════════════════════════════════════════════════
// STREAK + DAILY GOAL — real, derived from actual usage
// ═══════════════════════════════════════════════════════════════════
const DAILY_GOAL = 30;
function todayKey() { return new Date().toISOString().slice(0, 10); }

// Call once per session on login/mount — bumps the consecutive-day streak.
function bumpStreak(storage) {
  const today = todayKey();
  const s = storage.get("streak") || { count: 0, last: null };
  if (s.last === today) return s.count;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = s.last === yesterday ? s.count + 1 : 1;
  storage.set("streak", { count, last: today });
  return count;
}
// Call on every answered question — bumps today's answered-question tally.
function bumpDailyAnswered(storage) {
  const today = todayKey();
  const d = storage.get("daily") || { date: today, count: 0 };
  const count = d.date === today ? d.count + 1 : 1;
  storage.set("daily", { date: today, count });
  return count;
}
function getDailyAnswered(storage) {
  const d = storage.get("daily") || { date: null, count: 0 };
  return d.date === todayKey() ? d.count : 0;
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOrder(questions) {
  const e = shuffle(questions.filter(q => (q.d||q.diff) === "easy"));
  const m = shuffle(questions.filter(q => (q.d||q.diff) === "moderate"));
  const h = shuffle(questions.filter(q => (q.d||q.diff) === "difficult"));
  const out = []; let ei=0, mi=0, hi=0;
  const blocks = Math.ceil(questions.length / 10);
  for (let b = 0; b < blocks; b++) {
    for (let j = 0; j < 3 && ei < e.length; j++) out.push(e[ei++]);
    for (let j = 0; j < 5 && mi < m.length; j++) out.push(m[mi++]);
    for (let j = 0; j < 2 && hi < h.length; j++) out.push(h[hi++]);
  }
  while (ei < e.length) out.push(e[ei++]);
  while (mi < m.length) out.push(m[mi++]);
  while (hi < h.length) out.push(h[hi++]);
  return out;
}

function getQ(q)  { return q.q || q.q; }
function getC(q)  { return q.c || q.choices || []; }
function getA(q)  { return q.a || q.ans; }
function getD(q)  { return q.d || q.diff; }
function getT(q)  { return q.t || q.topic; }
function getE(q)  { return q.e || q.exp || q.explanation || ""; }

function getRating(p) {
  if (p >= 95) return { l:"Outstanding",      c:"#10b981", bg:"#022c22", bdr:"#10b981" };
  if (p >= 90) return { l:"Excellent",         c:"#818cf8", bg:"#1e1b4b", bdr:"#6366f1" };
  if (p >= 80) return { l:"Very Good",         c:"#38bdf8", bg:"#0c2740", bdr:"#0ea5e9" };
  if (p >= 70) return { l:"Good",              c:"#fbbf24", bg:"#2c1a00", bdr:"#f59e0b" };
  return              { l:"Needs Improvement", c:"#f87171", bg:"#2a0a0a", bdr:"#ef4444" };
}

// ═══════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════
const sf     = "'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const BG     = "#09090b";
const SURF   = "#111116";
const SURF2  = "#1a1a22";
const BORDER = "#27272f";
const TXT    = "#fafafa";
const TXT2   = "#71717a";
const DIFF   = {
  easy:     { bg:"#052e16", ring:"#22c55e", text:"#4ade80", label:"Easy"      },
  moderate: { bg:"#1c1400", ring:"#eab308", text:"#facc15", label:"Moderate"  },
  difficult:{ bg:"#2d0a1f", ring:"#a855f7", text:"#c084fc", label:"Difficult" },
};

// ═══════════════════════════════════════════════════════════════════
// LIGHT DESIGN SYSTEM — Home / Library / Master Exam / Dashboard / Profile
// (matches the approved MRA mockup; quiz-taking, auth & admin stay on the
// dark tokens above)
// ═══════════════════════════════════════════════════════════════════
const pf = "'Poppins',sans-serif";
const L = {
  navy:"#0E2348", navyNav:"#071A37", gold:"#F0BA48", cream:"#FBF3E3",
  green:"#1EA457", greenTint:"#EAF7EE", orange:"#F5A623", orangeTint:"#FEF3E2",
  blue:"#3580CC", blueTint:"#EAF2FB", purple:"#B45BF6", purpleTint:"#F6ECFC",
  bg:"#F6F6F8", card:"#FFFFFF", line:"#E7E9EE", ink:"#14213D", muted:"#7A8299",
};
const LNAV_ITEMS = [
  { id:"home",     label:"Home",        icon:"home" },
  { id:"library",  label:"Library",     icon:"library" },
  { id:"master",   label:"Master Exam", icon:"exam" },
  { id:"dashboard",label:"Dashboard",   icon:"dashboard" },
  { id:"profile",  label:"Profile",     icon:"profile" },
];

function NavIcon({ type, active }) {
  const c = active ? L.gold : "#8a93a8";
  if (type === "home") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 11l9-8 9 8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v10h14V10" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (type === "library") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h7v16H4z M13 4h7v16h-7z" stroke={c} strokeWidth="1.6"/></svg>;
  if (type === "exam") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={c} strokeWidth="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>;
  if (type === "dashboard") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 20V13M11 20V7M18 20V10" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.6"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>;
}

function BottomNav({ active, onNav }) {
  return (
    <div style={{ marginTop:"auto", background:L.navyNav, height:72, display:"flex", alignItems:"center",
      justifyContent:"space-around", padding:"0 6px", position:"sticky", bottom:0, zIndex:100 }}>
      {LNAV_ITEMS.map(n => (
        <button key={n.id} onClick={()=>onNav(n.id)} style={{ background:"none", border:"none", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:4,
          color: active===n.id ? L.gold : "#8a93a8", fontFamily:pf }}>
          <NavIcon type={n.icon} active={active===n.id}/>
          <span style={{ fontSize:9, fontWeight:500 }}>{n.label}</span>
        </button>
      ))}
    </div>
  );
}

function LHeader({ user, onMenu, onBell }) {
  return (
    <div style={{ height:56, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
      flex:"none", fontFamily:pf, background:L.bg }}>
      <button onClick={onMenu} style={{ background:"none", border:"none", cursor:"pointer", padding:0, marginRight:12 }}>
        <svg width="19" height="14" viewBox="0 0 20 14"><rect y="0" width="20" height="2" rx="1" fill={L.ink}/><rect y="6" width="20" height="2" rx="1" fill={L.ink}/><rect y="12" width="20" height="2" rx="1" fill={L.ink}/></svg>
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
        <svg width="24" height="22" viewBox="0 0 26 22" style={{ flex:"none" }}><path d="M13 0L26 5.5L13 11L0 5.5L13 0Z" fill={L.navy}/><path d="M6 8V14C6 14 9 17 13 17C17 17 20 14 20 14V8L13 11L6 8Z" fill={L.navy}/><path d="M23 6.5V13" stroke={L.gold} strokeWidth="1.4"/><circle cx="23" cy="14" r="1.6" fill={L.gold}/></svg>
        <div style={{ lineHeight:1.15, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:.2, color:L.ink, whiteSpace:"nowrap" }}>MASTER REVIEW ACADEMY</div>
          <div style={{ fontSize:8, color:L.muted, whiteSpace:"nowrap" }}>Your Journey. Our Guidance. Your Success.</div>
        </div>
      </div>
      <button onClick={onBell} style={{ background:"none", border:"none", cursor:"pointer", padding:0, flex:"none" }}>
        <svg width="20" height="22" viewBox="0 0 20 22"><path d="M10 0C7.79 0 6 1.79 6 4V4.6C3.6 5.7 2 8.1 2 11V15L0 18H20L18 15V11C18 8.1 16.4 5.7 14 4.6V4C14 1.79 12.21 0 10 0Z" fill={L.ink}/><path d="M7 19C7 20.66 8.34 22 10 22C11.66 22 13 20.66 13 19H7Z" fill={L.ink}/></svg>
      </button>
    </div>
  );
}

function LMenu({ user, isAdmin, onClose, onNav, onAdmin, onLogout }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(14,35,72,.35)", zIndex:300,
      display:"flex", alignItems:"flex-start" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:L.card, width:240, maxWidth:"78vw", height:"100%",
        boxShadow:"6px 0 24px -8px rgba(14,35,72,.3)", fontFamily:pf, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"22px 18px", background:L.navy, color:"#fff" }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:L.gold, color:L.navy, fontWeight:700,
            fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
            {(user||"?").slice(0,2).toUpperCase()}
          </div>
          <div style={{ fontSize:13, fontWeight:700 }}>{user}</div>
        </div>
        <div style={{ padding:"10px 0", flex:1 }}>
          {LNAV_ITEMS.map(n => (
            <div key={n.id} onClick={()=>onNav(n.id)} style={{ padding:"12px 18px", fontSize:12.5, fontWeight:600,
              color:L.ink, cursor:"pointer" }}>{n.label}</div>
          ))}
          {isAdmin && <div onClick={onAdmin} style={{ padding:"12px 18px", fontSize:12.5, fontWeight:600, color:L.blue, cursor:"pointer" }}>Admin Panel</div>}
        </div>
        <div onClick={onLogout} style={{ padding:"16px 18px", fontSize:12.5, fontWeight:600, color:"#E5484D",
          cursor:"pointer", borderTop:`1px solid ${L.line}` }}>Log Out</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════
function Ring({ pct, size=72, color="#6366f1", label }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct||0, 100) / 100 * circ;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={BORDER} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1s ease" }}/>
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
          fill={TXT} fontSize={size<56?11:14} fontWeight="700" fontFamily={sf}
          style={{ transform:`rotate(90deg)`, transformOrigin:`${size/2}px ${size/2}px` }}>
          {pct||0}%
        </text>
      </svg>
      {label && <span style={{ fontSize:10, color:TXT2, fontFamily:sf, letterSpacing:"0.5px", textTransform:"uppercase" }}>{label}</span>}
    </div>
  );
}

function Bar({ pct, color="#6366f1", h=3 }) {
  return (
    <div style={{ background:BORDER, borderRadius:99, height:h, overflow:"hidden" }}>
      <div style={{ background:color, width:`${Math.min(pct||0,100)}%`, height:"100%", borderRadius:99, transition:"width .8s ease" }}/>
    </div>
  );
}

function DiffTag({ diff }) {
  const d = DIFF[diff] || DIFF.easy;
  return (
    <span style={{ fontSize:10, fontWeight:700, color:d.text, background:d.bg,
      border:`1px solid ${d.ring}33`, padding:"2px 9px", borderRadius:99,
      fontFamily:sf, letterSpacing:"0.6px", textTransform:"uppercase" }}>
      {d.label}
    </span>
  );
}

function NavBar({ title, left, right }) {
  return (
    <nav style={{ background:`${SURF}cc`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${BORDER}`,
      padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
      height:54, position:"sticky", top:0, zIndex:200 }}>
      <div style={{ minWidth:80 }}>{left}</div>
      <span style={{ fontSize:13, fontWeight:700, color:TXT, fontFamily:sf, letterSpacing:"-0.2px" }}>{title}</span>
      <div style={{ minWidth:80, display:"flex", justifyContent:"flex-end" }}>{right}</div>
    </nav>
  );
}

function GhostBtn({ onClick, children, style={} }) {
  return (
    <button onClick={onClick} style={{ background:"none", border:"none", color:TXT2,
      fontSize:12, cursor:"pointer", padding:"7px 12px", borderRadius:8, fontFamily:sf,
      fontWeight:500, ...style }}>
      {children}
    </button>
  );
}

function SolidBtn({ onClick, children, color="#6366f1", style={} }) {
  return (
    <button onClick={onClick} style={{ background:color, color:"#fff", border:"none",
      borderRadius:10, padding:"11px 20px", fontSize:13, fontWeight:700, cursor:"pointer",
      fontFamily:sf, transition:"opacity .15s", ...style }}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LOGIN / REGISTER
// ═══════════════════════════════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [mode, setMode]   = useState("login"); // login | register
  const [user, setUser]   = useState("");
  const [pass, setPass]   = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr]     = useState("");
  const [ok, setOk]       = useState("");

  function getUsers() { try { return JSON.parse(localStorage.getItem("mra_users")) || {}; } catch { return {}; } }
  function saveUsers(u) { localStorage.setItem("mra_users", JSON.stringify(u)); }

  function handleLogin() {
    setErr(""); setOk("");
    if (!user.trim() || !pass.trim()) { setErr("Please enter username and password."); return; }
    if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) { onLogin(user.trim(), true); return; }
    const users = getUsers();
    if (!users[user.trim()]) { setErr("Username not found."); return; }
    if (users[user.trim()].pass !== pass) { setErr("Incorrect password."); return; }
    onLogin(user.trim(), false);
  }

  function handleRegister() {
    setErr(""); setOk("");
    if (!user.trim() || !pass.trim()) { setErr("All fields are required."); return; }
    if (user.trim() === ADMIN_USER) { setErr("That username is reserved."); return; }
    if (pass !== pass2) { setErr("Passwords do not match."); return; }
    if (pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    const users = getUsers();
    if (users[user.trim()]) { setErr("Username already taken."); return; }
    users[user.trim()] = { pass, createdAt: new Date().toISOString() };
    saveUsers(users);
    syncUserToSupabase(user.trim(), pass).catch(() => {});
    setOk("Account created! You can now log in.");
    setMode("login"); setPass(""); setPass2("");
  }

  const inp = { width:"100%", background:SURF2, border:`1px solid ${BORDER}`, borderRadius:10,
    padding:"12px 16px", fontSize:14, color:TXT, fontFamily:sf, outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#a855f7)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
            margin:"0 auto 14px" }}>🏛</div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.5px" }}>Master Review Academy</div>
          <div style={{ fontSize:13, color:TXT2, marginTop:4 }}>LET Board Examination Review</div>
        </div>

        <div style={{ background:SURF, borderRadius:20, padding:28, border:`1px solid ${BORDER}` }}>
          {/* Tab */}
          <div style={{ display:"flex", background:SURF2, borderRadius:10, padding:4, marginBottom:24, gap:4 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); setOk(""); }}
                style={{ flex:1, background:mode===m?"#6366f1":"none", color:mode===m?"#fff":TXT2,
                  border:"none", borderRadius:8, padding:"9px", fontSize:13, fontWeight:600,
                  cursor:"pointer", fontFamily:sf, textTransform:"capitalize", transition:"all .2s" }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <label style={{ fontSize:11, color:TXT2, letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Username</label>
              <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Enter username"
                style={inp} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?handleLogin():null)} />
            </div>
            <div>
              <label style={{ fontSize:11, color:TXT2, letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter password"
                style={inp} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?handleLogin():null)} />
            </div>
            {mode === "register" && (
              <div>
                <label style={{ fontSize:11, color:TXT2, letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Confirm Password</label>
                <input type="password" value={pass2} onChange={e=>setPass2(e.target.value)} placeholder="Confirm password"
                  style={inp} onKeyDown={e=>e.key==="Enter"&&handleRegister()} />
              </div>
            )}

            {err && <div style={{ background:"#2a0a0a", border:"1px solid #ef4444", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171" }}>{err}</div>}
            {ok  && <div style={{ background:"#022c22", border:"1px solid #22c55e", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#4ade80" }}>{ok}</div>}

            <SolidBtn onClick={mode==="login"?handleLogin:handleRegister} style={{ width:"100%", marginTop:4, padding:"13px" }}>
              {mode === "login" ? "Sign In →" : "Create Account"}
            </SolidBtn>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:16, fontSize:12, color:TXT2 }}>
          Your progress is saved locally on this device.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN — RATING SHEET
// ═══════════════════════════════════════════════════════════════════
function AdminPanel({ onBack }) {
  const [tab, setTab] = useState("ratings"); // ratings | users
  const [search, setSearch] = useState("");

  function getUsers() { try { return JSON.parse(localStorage.getItem("mra_users")) || {}; } catch { return {}; } }

  function getUserScore(username, quizId) {
    try {
      const val = localStorage.getItem(`mra_${username}_quiz_${quizId}`);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  }

  const users = getUsers();
  const userList = Object.keys(users).filter(u =>
    !search || u.toLowerCase().includes(search.toLowerCase())
  );

  const allQuizzes = [...QUIZ_REGISTRY, { id:"master", title:"Master Exam (350Q)", icon:"🏆" }];

  function getLetterGrade(score) {
    if (score === null || score === undefined) return "—";
    if (score >= 95) return "OS";
    if (score >= 90) return "EX";
    if (score >= 80) return "VG";
    if (score >= 70) return "GD";
    return "NI";
  }

  function getGradeColor(score) {
    if (score === null || score === undefined) return TXT2;
    if (score >= 90) return "#4ade80";
    if (score >= 80) return "#60a5fa";
    if (score >= 70) return "#facc15";
    return "#f87171";
  }

  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Admin Panel"
        left={<GhostBtn onClick={onBack}>← Dashboard</GhostBtn>}
        right={<span style={{ fontSize:11, color:"#6366f1", fontWeight:700, letterSpacing:"1px" }}>OWNER</span>}
      />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px" }}>
        {/* Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {[["ratings","Rating Sheet"],["users","User List"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background:tab===t?"#6366f1":SURF, color:tab===t?"#fff":TXT2,
                border:`1px solid ${tab===t?"#6366f1":BORDER}`, borderRadius:8,
                padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:sf }}>
              {l}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom:20 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
            style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:10, padding:"10px 16px",
              fontSize:13, color:TXT, fontFamily:sf, outline:"none", width:280, boxSizing:"border-box" }} />
        </div>

        {/* Summary cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
          {[
            { l:"Total Users", v:Object.keys(users).length, c:"#6366f1" },
            { l:"Active (attempted)", v:Object.keys(users).filter(u=>QUIZ_REGISTRY.some(q=>getUserScore(u,q.id))).length, c:"#10b981" },
            { l:"Total Quizzes", v:QUIZ_REGISTRY.length, c:"#f59e0b" },
            { l:"Avg Mastery", v:(() => {
                const scores = Object.keys(users).flatMap(u => QUIZ_REGISTRY.map(q => getUserScore(u,q.id)?.score).filter(Boolean));
                return scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) + "%" : "—";
              })(), c:"#a855f7" },
          ].map(s => (
            <div key={s.l} style={{ background:SURF, borderRadius:12, padding:"16px", border:`1px solid ${BORDER}`, textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:s.c, letterSpacing:"-1px" }}>{s.v}</div>
              <div style={{ fontSize:10, color:TXT2, marginTop:4, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* RATING SHEET */}
        {tab === "ratings" && (
          <div>
            <div style={{ fontSize:11, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
              Rating Sheet — All Users × All Quizzes
            </div>
            <div style={{ fontSize:11, color:TXT2, marginBottom:12 }}>
              OS=Outstanding(95%+) · EX=Excellent(90%+) · VG=Very Good(80%+) · GD=Good(70%+) · NI=Needs Improvement · —=Not attempted
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:sf }}>
                <thead>
                  <tr style={{ background:SURF2 }}>
                    <th style={{ padding:"12px 16px", textAlign:"left", color:TXT2, fontWeight:600,
                      borderBottom:`1px solid ${BORDER}`, whiteSpace:"nowrap", position:"sticky", left:0, background:SURF2 }}>
                      USERNAME
                    </th>
                    {QUIZ_REGISTRY.map(q => (
                      <th key={q.id} style={{ padding:"12px 10px", textAlign:"center", color:TXT2, fontWeight:600,
                        borderBottom:`1px solid ${BORDER}`, whiteSpace:"nowrap", minWidth:90 }}>
                        <div>{q.icon} {q.title.split("—")[0].trim()}</div>
                        <div style={{ fontSize:10, fontWeight:400, marginTop:2 }}>
                          {q.title.includes("200Q") ? "200Q" : "100Q"}
                        </div>
                      </th>
                    ))}
                    <th style={{ padding:"12px 10px", textAlign:"center", color:"#818cf8", fontWeight:700,
                      borderBottom:`1px solid ${BORDER}`, minWidth:90 }}>
                      MASTER<br/><span style={{ fontSize:10, fontWeight:400 }}>350Q</span>
                    </th>
                    <th style={{ padding:"12px 10px", textAlign:"center", color:"#10b981", fontWeight:700,
                      borderBottom:`1px solid ${BORDER}`, minWidth:80 }}>
                      AVG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userList.length === 0 && (
                    <tr><td colSpan={QUIZ_REGISTRY.length + 3} style={{ padding:"24px", textAlign:"center", color:TXT2 }}>
                      No users found.
                    </td></tr>
                  )}
                  {userList.map((u, i) => {
                    const scores = QUIZ_REGISTRY.map(q => getUserScore(u, q.id)?.score ?? null);
                    const masterScore = getUserScore(u, "master")?.score ?? null;
                    const allScores = [...scores, masterScore].filter(s => s !== null);
                    const avg = allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length) : null;
                    return (
                      <tr key={u} style={{ background:i%2===0?BG:SURF, borderBottom:`1px solid ${BORDER}` }}>
                        <td style={{ padding:"12px 16px", fontWeight:600, color:TXT,
                          position:"sticky", left:0, background:i%2===0?BG:SURF, whiteSpace:"nowrap" }}>
                          👤 {u}
                          <div style={{ fontSize:10, color:TXT2, fontWeight:400 }}>
                            {users[u]?.createdAt ? new Date(users[u].createdAt).toLocaleDateString() : ""}
                          </div>
                        </td>
                        {scores.map((s, j) => (
                          <td key={j} style={{ padding:"12px 10px", textAlign:"center" }}>
                            {s !== null ? (
                              <div>
                                <div style={{ fontWeight:700, color:getGradeColor(s), fontSize:14 }}>{s}%</div>
                                <div style={{ fontSize:10, color:getGradeColor(s), marginTop:1 }}>{getLetterGrade(s)}</div>
                              </div>
                            ) : <span style={{ color:TXT2 }}>—</span>}
                          </td>
                        ))}
                        <td style={{ padding:"12px 10px", textAlign:"center" }}>
                          {masterScore !== null ? (
                            <div>
                              <div style={{ fontWeight:700, color:getGradeColor(masterScore), fontSize:14 }}>{masterScore}%</div>
                              <div style={{ fontSize:10, color:getGradeColor(masterScore), marginTop:1 }}>{getLetterGrade(masterScore)}</div>
                            </div>
                          ) : <span style={{ color:TXT2 }}>—</span>}
                        </td>
                        <td style={{ padding:"12px 10px", textAlign:"center" }}>
                          {avg !== null ? (
                            <div style={{ fontWeight:800, color:getGradeColor(avg), fontSize:15 }}>{avg}%</div>
                          ) : <span style={{ color:TXT2 }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USER LIST */}
        {tab === "users" && (
          <div>
            <div style={{ fontSize:11, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
              Registered Users — {userList.length}
            </div>
            <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BORDER}`, overflow:"hidden" }}>
              {userList.length === 0 && (
                <div style={{ padding:32, textAlign:"center", color:TXT2 }}>No users registered yet.</div>
              )}
              {userList.map((u, i) => {
                const attempts = QUIZ_REGISTRY.filter(q => getUserScore(u, q.id)).length;
                const scores = QUIZ_REGISTRY.map(q=>getUserScore(u,q.id)?.score).filter(Boolean);
                const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
                return (
                  <div key={u} style={{ padding:"16px 20px", borderBottom:i<userList.length-1?`1px solid ${BORDER}`:"none",
                    display:"flex", alignItems:"center", gap:16 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#6366f1,#a855f7)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, fontWeight:700 }}>
                      {u[0].toUpperCase()}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:TXT }}>{u}</div>
                      <div style={{ fontSize:11, color:TXT2, marginTop:3 }}>
                        Joined: {users[u]?.createdAt ? new Date(users[u].createdAt).toLocaleDateString() : "N/A"} · {attempts} quiz{attempts!==1?"zes":""} attempted
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      {avg !== null ? (
                        <>
                          <div style={{ fontSize:18, fontWeight:900, color:getGradeColor(avg) }}>{avg}%</div>
                          <div style={{ fontSize:10, color:TXT2 }}>avg score</div>
                        </>
                      ) : <div style={{ fontSize:12, color:TXT2 }}>No attempts</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUIZ ENGINE
// ═══════════════════════════════════════════════════════════════════
function LibraryGroup({ label, icon, subtitle, color, quizzes, storage, onStart }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{marginBottom:12}}>
      <button onClick={() => setOpen(o => !o)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"14px 16px",borderRadius:14,border:`1px solid ${color}`,background:`linear-gradient(135deg, ${color}18, ${color}08)`,cursor:"pointer",marginBottom:open?8:0}}>
        <span style={{fontSize:22}}>{icon}</span>
        <div style={{flex:1,textAlign:"left"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{label}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:2}}>{subtitle} · {quizzes.length} quizzes</div>
        </div>
        <span style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>{open?"▼":"▶"}</span>
      </button>
      {open && (
        <div style={{background:"#161616",borderRadius:12,padding:10,border:"1px solid #222"}}>
          {quizzes.map(q => {
            const done = storage?.get(`quiz_${q.id}`);
            return (
              <div key={q.id} onClick={() => onStart(q)} style={{display:"flex",alignItems:"center",gap:10,background:"#1a1a1a",borderRadius:10,padding:"10px 12px",marginBottom:8,border:"1px solid #222",cursor:"pointer"}}>
                <div style={{width:36,height:36,borderRadius:9,background:`${q.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{q.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#eee",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{q.title}</div>
                  <div style={{fontSize:10,color:"#555",marginTop:1}}>{q.desc}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:`${q.color}18`,color:q.color}}>{q.questions.length}Q</div>
                  {done && <div style={{fontSize:9,color:"#10b981"}}>✓ {done.score}%</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
function QuizEngine({ rawQuestions, title, quizId, accentColor, onExit, username }) {
  const storage = useStorage(username);
  const [questions]  = useState(() => buildOrder(rawQuestions));
  const [idx,   setIdx]   = useState(0);
  const [sel,   setSel]   = useState(null);
  const [shown, setShown] = useState(false);
  const [correct,setCorrect] = useState(0);
  const [wrong,  setWrong]   = useState(0);
  const [missed, setMissed]  = useState([]);
  const [phase,  setPhase]   = useState("quiz");
  const [ckpt,   setCkpt]    = useState(null);
  const ref = useRef(null);

  const total    = questions.length;
  const q        = questions[idx];
  const answered = correct + wrong;
  const acc      = answered > 0 ? Math.round(correct / answered * 100) : 0;
  const prog     = Math.round(idx / total * 100);
  const every    = total >= 150 ? 50 : total >= 100 ? 25 : 20;

  function submit() {
    if (!sel || shown) return;
    const ok = sel === getA(q);
    if (ok) setCorrect(c => c + 1);
    else { setWrong(c => c + 1); setMissed(m => [...m, { ...q, ya: sel }]); }
    setShown(true);
    bumpDailyAnswered(storage);
  }

  function next() {
    const ni = idx + 1;
    if (ni >= total) {
      const fc = correct + (sel === getA(q) ? 1 : 0);
      const score = Math.round(fc / total * 100);
      storage.set(`quiz_${quizId}`, { score, correct: fc, total, date: new Date().toISOString() });
      setPhase("results");
      return;
    }
    if (ni % every === 0) {
      setCkpt({ ni, correct: correct + (sel===getA(q)?1:0), wrong: wrong+(sel!==getA(q)?1:0), acc });
      setPhase("checkpoint");
    } else advance(ni);
  }

  function advance(ni) {
    setIdx(ni); setSel(null); setShown(false);
    if (ref.current) ref.current.scrollTop = 0;
  }

  const ok = shown && sel === getA(q);
  const g  = getRating(Math.round(correct / total * 100));
  const weakTopics = [...new Set(missed.map(w => getT(w)))];

  // Checkpoint
  if (phase === "checkpoint" && ckpt) return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Checkpoint" right={<GhostBtn onClick={()=>{setPhase("quiz");advance(ckpt.ni);}}>Continue →</GhostBtn>} />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"32px 20px" }}>
        <div style={{ fontSize:11, color:accentColor, letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>
          Progress Report · Q{ckpt.ni} of {total}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
          {[{l:"Correct",v:ckpt.correct,c:"#22c55e"},{l:"Wrong",v:ckpt.wrong,c:"#ef4444"},{l:"Accuracy",v:ckpt.acc+"%",c:accentColor},{l:"Left",v:total-ckpt.ni,c:TXT2}].map(s=>(
            <div key={s.l} style={{ background:SURF, borderRadius:12, padding:"14px 10px", textAlign:"center", border:`1px solid ${BORDER}` }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.c, letterSpacing:"-1px" }}>{s.v}</div>
              <div style={{ fontSize:10, color:TXT2, marginTop:3, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <SolidBtn onClick={()=>{setPhase("quiz");advance(ckpt.ni);}} color={accentColor} style={{ width:"100%", padding:"13px" }}>
          Continue — Question {ckpt.ni + 1}
        </SolidBtn>
      </div>
    </div>
  );

  // Results
  if (phase === "results") {
    const finalScore = Math.round(correct / total * 100);
    const gr = getRating(finalScore);
    return (
      <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
        <NavBar title="Results" right={<GhostBtn onClick={onExit}>← Library</GhostBtn>} />
        <div style={{ maxWidth:740, margin:"0 auto", padding:"28px 20px" }}>
          <div style={{ background:gr.bg, borderRadius:20, padding:"28px", textAlign:"center", border:`1px solid ${gr.bdr}`, marginBottom:20 }}>
            <div style={{ fontSize:11, color:gr.c, letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Final Score</div>
            <div style={{ fontSize:60, fontWeight:900, color:gr.c, letterSpacing:"-3px", lineHeight:1 }}>{finalScore}%</div>
            <div style={{ fontSize:18, fontWeight:700, color:gr.c, marginTop:6 }}>{gr.l}</div>
            <div style={{ fontSize:12, color:TXT2, marginTop:6 }}>{correct} correct · {wrong} incorrect · {total} total questions</div>
          </div>

          {/* Diff breakdown */}
          <div style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}`, marginBottom:16 }}>
            <div style={{ fontSize:10, color:TXT2, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>By Difficulty</div>
            {["easy","moderate","difficult"].map(d => {
              const dq = rawQuestions.filter(q=>(q.d||q.diff)===d);
              const dm = missed.filter(q=>(q.d||q.diff)===d);
              const dp = dq.length ? Math.round((dq.length-dm.length)/dq.length*100) : 0;
              return (
                <div key={d} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:DIFF[d].text, fontWeight:600, textTransform:"capitalize" }}>{d}</span>
                    <span style={{ fontSize:11, color:TXT2 }}>{dq.length-dm.length}/{dq.length} · {dp}%</span>
                  </div>
                  <Bar pct={dp} color={DIFF[d].ring} h={4}/>
                </div>
              );
            })}
          </div>

          {weakTopics.length > 0 && (
            <div style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}`, marginBottom:16 }}>
              <div style={{ fontSize:10, color:TXT2, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:10 }}>Topics to Review</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {weakTopics.map(t=><span key={t} style={{ background:SURF2, border:`1px solid ${BORDER}`, color:TXT, padding:"3px 10px", borderRadius:99, fontSize:11 }}>{t}</span>)}
              </div>
            </div>
          )}

          {missed.length > 0 && (
            <div style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}`, marginBottom:20 }}>
              <div style={{ fontSize:10, color:TXT2, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
                Review Guide · {missed.length} missed
              </div>
              {missed.map((w,i)=>(
                <div key={i} style={{ background:SURF2, borderRadius:10, padding:12, marginBottom:8, borderLeft:`3px solid ${DIFF[getD(w)]?.ring||"#6366f1"}` }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                    <DiffTag diff={getD(w)}/>
                    <span style={{ fontSize:11, color:TXT2 }}>{getT(w)}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:TXT, marginBottom:6, lineHeight:1.5 }}>{getQ(w)}</div>
                  <div style={{ fontSize:12, color:"#f87171", marginBottom:3 }}>✗ {w.ya} · {getC(w).find(x=>x.startsWith(w.ya))?.slice(3)}</div>
                  <div style={{ fontSize:12, color:"#4ade80", marginBottom:4 }}>✓ {getA(w)} · {getC(w).find(x=>x.startsWith(getA(w)))?.slice(3)}</div>
                  <div style={{ fontSize:12, color:TXT2, lineHeight:1.6 }}>{getE(w)}</div>
                </div>
              ))}
            </div>
          )}

          <SolidBtn onClick={onExit} color={accentColor} style={{ width:"100%", padding:"13px" }}>Back to Library</SolidBtn>
        </div>
      </div>
    );
  }

  // Quiz
  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title={title.length > 30 ? title.slice(0,30)+"…" : title}
        left={<GhostBtn onClick={onExit}>← Exit</GhostBtn>}
        right={
          <div style={{ display:"flex", gap:14 }}>
            {[{v:correct,c:"#4ade80",l:"✓"},{v:wrong,c:"#f87171",l:"✗"},{v:acc+"%",c:TXT,l:"Acc"}].map(s=>(
              <div key={s.l} style={{ textAlign:"right" }}>
                <div style={{ fontSize:14, fontWeight:800, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:9, color:TXT2, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        }
      />
      <div style={{ maxWidth:700, margin:"0 auto", padding:"24px 20px" }} ref={ref}>
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:TXT2 }}>Question {idx+1} of {total}</span>
            <span style={{ fontSize:12, color:TXT2 }}>{prog}%</span>
          </div>
          <Bar pct={prog} color={accentColor} h={3}/>
        </div>
        <div style={{ background:SURF, borderRadius:18, border:`1px solid ${BORDER}`, overflow:"hidden" }}>
          <div style={{ height:3, background:accentColor }}/>
          <div style={{ padding:"22px 22px 0" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
              <DiffTag diff={getD(q)}/>
              <span style={{ fontSize:11, color:TXT2 }}>{getT(q)}</span>
            </div>
            <div style={{ fontSize:16, fontWeight:500, color:TXT, lineHeight:1.65, marginBottom:20, letterSpacing:"-0.1px" }}>
              {getQ(q)}
            </div>
          </div>
          <div style={{ padding:"0 22px 22px" }}>
            {getC(q).map(ch => {
              const l = ch[0];
              let bg=SURF2,bdr=BORDER,col=TXT,fw=400;
              if (shown) {
                if (l===getA(q)) { bg="#022c22"; bdr="#22c55e"; col="#4ade80"; fw=600; }
                else if (l===sel&&l!==getA(q)) { bg="#2a0a0a"; bdr="#ef4444"; col="#f87171"; }
              } else if (l===sel) { bg="#1e1b4b"; bdr=accentColor; col="#a5b4fc"; fw=500; }
              return (
                <button key={l} onClick={()=>!shown&&setSel(l)}
                  style={{ display:"block", width:"100%", padding:"12px 14px", marginBottom:7, borderRadius:11,
                    border:`1.5px solid ${bdr}`, background:bg, color:col, cursor:shown?"default":"pointer",
                    textAlign:"left", fontSize:13, fontFamily:sf, fontWeight:fw, lineHeight:1.5,
                    transition:"all .12s", boxSizing:"border-box" }}>
                  {ch}{shown&&l===getA(q)?" ✓":""}{shown&&l===sel&&l!==getA(q)?" ✗":""}
                </button>
              );
            })}
            {!shown ? (
              <button onClick={submit} disabled={!sel}
                style={{ width:"100%", background:sel?accentColor:"#27272f", color:sel?"#fff":TXT2, border:"none",
                  borderRadius:11, padding:"13px", fontSize:13, fontWeight:700, cursor:sel?"pointer":"not-allowed",
                  fontFamily:sf, transition:"all .2s", marginTop:4 }}>
                Submit Answer
              </button>
            ) : (
              <>
                <div style={{ padding:"12px 14px", borderRadius:11, marginTop:4, fontSize:13, lineHeight:1.65,
                  background:ok?"#022c22":"#2a0a0a", borderLeft:`3px solid ${ok?"#22c55e":"#ef4444"}`,
                  color:ok?"#86efac":"#fca5a5" }}>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{ok?"Correct.":"Incorrect. Answer: "+getA(q)}</div>
                  {getE(q)}
                </div>
                <button onClick={next}
                  style={{ width:"100%", background:SURF2, color:TXT, border:`1px solid ${BORDER}`, borderRadius:11,
                    padding:"13px", fontSize:13, fontWeight:600, cursor:"pointer", marginTop:8, fontFamily:sf }}>
                  {idx+1>=total ? "View Results" : "Next →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function MasterReviewAcademy() {
  // ── Persist login across refresh ──────────────────────────────
  const savedSession = (() => {
    try { return JSON.parse(localStorage.getItem("mra_session")) || {}; } catch { return {}; }
  })();

  const [user,     setUser]     = useState(savedSession.user     || null);
  const [isAdmin,  setIsAdmin]  = useState(savedSession.isAdmin  || false);
  const [view,     setView]     = useState(savedSession.view     || "home");
  const [activeQ,  setActiveQ]  = useState(null); // never restore mid-quiz on refresh
  const [filterS,  setFilterS]  = useState("all");
  const [search,   setSearch]   = useState("");
  const [master350,setMaster350]= useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("mra_session", JSON.stringify({ user, isAdmin, view }));
    } else {
      localStorage.removeItem("mra_session");
    }
  }, [user, isAdmin, view]);

  const storage = useStorage(user);
  const [streak, setStreak] = useState(0);

  useEffect(() => { if (user) setStreak(bumpStreak(storage)); }, [user]);

  function handleLogin(username, admin) {
    setUser(username); setIsAdmin(admin); setView(admin ? "dashboard" : "home");
  }
  function handleLogout() {
    setUser(null); setIsAdmin(false); setView("home"); setActiveQ(null);
    localStorage.removeItem("mra_session");
  }

  function getData(id) { return storage.get(`quiz_${id}`); }

  const totalMastery = () => {
    const scores = QUIZ_REGISTRY.map(q => getData(q.id)?.score || 0);
    return Math.round(scores.reduce((a,b)=>a+b,0) / QUIZ_REGISTRY.length);
  };

  if (!user) return <AuthScreen onLogin={handleLogin}/>;

  if (isAdmin && view === "admin") return <AdminPanel onBack={() => setView("dashboard")}/>;

  if (activeQ) {
    if (activeQ === "master") {
      if (!master350) setMaster350(buildMaster350());
      const qs = master350 || buildMaster350();
      return <QuizEngine rawQuestions={qs} title="Master Board Exam — 350Q" quizId="master"
        accentColor="#6366f1" onExit={()=>setActiveQ(null)} username={user}/>;
    }
    const quiz = QUIZ_REGISTRY.find(q=>q.id===activeQ);
    return <QuizEngine rawQuestions={quiz.questions} title={quiz.title} quizId={quiz.id}
      accentColor={quiz.color} onExit={()=>setActiveQ(null)} username={user}/>;
  }

  const filtered = QUIZ_REGISTRY.filter(q => {
    const ms = search.toLowerCase();
    const isProf = !q.category || q.category === "profd";
    const catMatch = filterS==="all" ? true
      : filterS==="all-prof" ? isProf
      : filterS==="all-gened" ? q.category==="gened"
      : q.subjId===filterS;
    return catMatch && (!ms||q.title.toLowerCase().includes(ms));
  });

  const completedCount = QUIZ_REGISTRY.filter(q=>getData(q.id)).length;

  // ── shared real-data helpers for the light screens ─────────────
  const profSubset = QUIZ_REGISTRY.filter(q => !q.category || q.category === "profd");
  const genSubset  = QUIZ_REGISTRY.filter(q => q.category === "gened");
  const avgOf = (subset) => {
    const scores = subset.map(q => getData(q.id)?.score || 0);
    return Math.round(scores.reduce((a,b)=>a+b,0) / subset.length);
  };
  const grandTotalQuestions = QUIZ_REGISTRY.reduce((a,q)=>a+q.questions.length,0);
  const questionsAnswered   = QUIZ_REGISTRY.reduce((a,q)=>a+(getData(q.id)?.total||0),0);
  const correctAnswers      = QUIZ_REGISTRY.reduce((a,q)=>a+(getData(q.id)?.correct||0),0);
  const remainingQuestions  = grandTotalQuestions - questionsAnswered;
  const mostRecent = QUIZ_REGISTRY
    .map(q => ({ q, data:getData(q.id) }))
    .filter(x => x.data)
    .sort((a,b) => new Date(b.data.date) - new Date(a.data.date))[0];
  const dailyAnswered = getDailyAnswered(storage);

  const shell = (active, content) => (
    <div style={{ background:L.bg, minHeight:"100vh", display:"flex", justifyContent:"center", fontFamily:pf }}>
      <div style={{ width:"100%", maxWidth:480, minHeight:"100vh", display:"flex", flexDirection:"column", background:L.bg }}>
        <LHeader user={user} onMenu={()=>setMenuOpen(true)} onBell={()=>{}}/>
        {content}
        <BottomNav active={active} onNav={v => {
          if (v === "master") { setView("master"); return; }
          setView(v);
        }}/>
      </div>
      {menuOpen && <LMenu user={user} isAdmin={isAdmin} onClose={()=>setMenuOpen(false)}
        onNav={v=>{setMenuOpen(false); setView(v==="master"?"master":v);}}
        onAdmin={()=>{setMenuOpen(false); setView("admin");}}
        onLogout={()=>{setMenuOpen(false); handleLogout();}}/>}
    </div>
  );

  const SubjRing = ({ pct, color, tint }) => (
    <div style={{ width:52, height:52, borderRadius:"50%", margin:"8px auto 6px", display:"flex", alignItems:"center",
      justifyContent:"center", position:"relative",
      background:`conic-gradient(${color} 0deg ${Math.min(pct,100)*3.6}deg, ${tint} ${Math.min(pct,100)*3.6}deg 360deg)` }}>
      <div style={{ position:"absolute", inset:5, borderRadius:"50%", background:L.bg }}/>
      <div style={{ position:"relative", fontSize:12.5, fontWeight:700, color:L.ink }}>{pct}%</div>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────
  if (view === "home") return shell("home", (
    <>
      <div style={{ margin:"0 20px", padding:20, background:L.cream, borderRadius:22, minHeight:120 }}>
        <h1 style={{ fontSize:19, fontWeight:600, color:L.ink, lineHeight:1.28, maxWidth:"70%" }}>Good {new Date().getHours()<12?"morning":new Date().getHours()<18?"afternoon":"evening"},<br/>{user}!</h1>
        <p style={{ fontSize:11, color:"#8a7f6f", marginTop:10, maxWidth:"80%", lineHeight:1.5 }}>Every question you answer brings you closer to your goal.</p>
      </div>

      <div style={{ margin:"15px 20px 0" }}>
        <div style={{ background:L.navy, borderRadius:22, padding:20, color:"#fff" }}>
          <div style={{ fontSize:14.5, fontWeight:600, marginBottom:16 }}>Overall Progress</div>
          <div style={{ display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ width:112, height:112, borderRadius:"50%", flex:"none",
              background:`conic-gradient(${L.gold} 0deg ${totalMastery()*3.6}deg, rgba(255,255,255,.14) ${totalMastery()*3.6}deg 360deg)`,
              display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ position:"absolute", inset:12, borderRadius:"50%", background:L.navy }}/>
              <div style={{ position:"relative", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:700 }}>{totalMastery()}%</div>
                <div style={{ fontSize:9, color:"#c9d2e2", marginTop:1 }}>Mastery</div>
              </div>
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:9, minWidth:0 }}>
              <div><div style={{ fontSize:10, color:"#a9b4c9" }}>Correct Answer</div><div style={{ fontSize:15, fontWeight:600, marginTop:1 }}>{correctAnswers.toLocaleString()}</div></div>
              <div><div style={{ fontSize:10, color:"#a9b4c9" }}>Questions Answered</div><div style={{ fontSize:15, fontWeight:600, marginTop:1 }}>{questionsAnswered.toLocaleString()}</div></div>
              <div><div style={{ fontSize:10, color:"#a9b4c9" }}>Remaining</div><div style={{ fontSize:15, fontWeight:600, marginTop:1 }}>{remainingQuestions.toLocaleString()}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin:"15px 20px 0", display:"flex", gap:8 }}>
        <div onClick={()=>{setFilterS("all-prof");setView("library");}} style={{ flex:1, minWidth:0, borderRadius:16, padding:"12px 6px 10px",
          textAlign:"center", background:L.greenTint, cursor:"pointer" }}>
          <div style={{ fontSize:22 }}>📋</div>
          <div style={{ fontSize:10.5, fontWeight:600, color:L.ink, marginTop:6 }}>Professional Education</div>
          <SubjRing pct={avgOf(profSubset)} color={L.green} tint="#d7ead9"/>
          <div style={{ fontSize:8.5, color:L.muted, marginTop:2 }}>{profSubset.length} quizzes</div>
        </div>
        <div onClick={()=>{setFilterS("all-gened");setView("library");}} style={{ flex:1, minWidth:0, borderRadius:16, padding:"12px 6px 10px",
          textAlign:"center", background:L.purpleTint, cursor:"pointer" }}>
          <div style={{ fontSize:22 }}>🎓</div>
          <div style={{ fontSize:10.5, fontWeight:600, color:L.ink, marginTop:6 }}>General Education</div>
          <SubjRing pct={avgOf(genSubset)} color={L.purple} tint="#e6d3f2"/>
          <div style={{ fontSize:8.5, color:L.muted, marginTop:2 }}>{genSubset.length} quizzes</div>
        </div>
      </div>

      <div style={{ margin:"15px 20px 0" }}>
        <div style={{ background:L.card, borderRadius:22, boxShadow:"0 3px 10px -4px rgba(14,35,72,.10)", border:`1px solid ${L.line}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px 0" }}>
            <div style={{ fontSize:13.5, fontWeight:600, color:L.ink }}>Continue Studying</div>
            <div onClick={()=>setView("library")} style={{ fontSize:10.5, fontWeight:600, color:L.blue, cursor:"pointer" }}>View All</div>
          </div>
          {mostRecent ? (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px 16px" }}>
              <div style={{ width:52, height:52, borderRadius:12, background:mostRecent.q.color, flex:"none",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{mostRecent.q.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9, color:L.muted }}>{mostRecent.q.category==="gened"?"General Education":"Professional Education"}</div>
                <div style={{ fontSize:13, fontWeight:700, color:L.ink, margin:"2px 0 6px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mostRecent.q.title.split("—")[0].trim()}</div>
                <div style={{ height:5, borderRadius:3, background:L.line, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${mostRecent.data.score}%`, background:mostRecent.q.color, borderRadius:3 }}/>
                </div>
                <div style={{ fontSize:9, color:L.muted, marginTop:4 }}>Last session: {mostRecent.data.score}%</div>
              </div>
              <div onClick={()=>setActiveQ(mostRecent.q.id)} style={{ flex:"none", background:L.navy, color:"#fff", fontSize:10.5,
                fontWeight:600, padding:"8px 14px", borderRadius:999, cursor:"pointer" }}>Continue</div>
            </div>
          ) : (
            <div style={{ padding:"12px 18px 18px" }}>
              <div style={{ fontSize:12, color:L.muted, marginBottom:10 }}>You haven't started a quiz yet.</div>
              <div onClick={()=>setView("library")} style={{ background:L.navy, color:"#fff", fontSize:11, fontWeight:600,
                padding:"9px 16px", borderRadius:999, display:"inline-block", cursor:"pointer" }}>Browse Library</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ margin:"12px 20px 0 20px" }}>
        <div style={{ background:L.card, borderRadius:22, boxShadow:"0 3px 10px -4px rgba(14,35,72,.10)", border:`1px solid ${L.line}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px 0" }}>
            <div style={{ fontSize:13.5, fontWeight:600, color:L.ink }}>Today's Goal</div>
          </div>
          <div style={{ padding:"10px 18px 16px" }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:L.ink, marginBottom:9 }}>Answer {DAILY_GOAL} questions</div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, height:8, borderRadius:4, background:L.line, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min(100,dailyAnswered/DAILY_GOAL*100)}%`, background:L.blue, borderRadius:4 }}/>
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:L.ink }}>{Math.min(dailyAnswered,DAILY_GOAL)} / {DAILY_GOAL}</div>
              <div style={{ fontSize:15 }}>🏆</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height:15 }}/>
    </>
  ));

  // ── LIBRARY ───────────────────────────────────────────────────
  if (view === "library") return shell("library", (
    <>
      <div style={{ padding:"6px 20px 4px" }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:L.ink }}>Library</h1>
        <p style={{ fontSize:11, color:L.muted, marginTop:3 }}>Browse every subject and jump back into studying</p>
      </div>

      <div style={{ margin:"15px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:`1px solid ${L.line}`,
          borderRadius:999, padding:"11px 16px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={L.muted} strokeWidth="2"/><path d="M21 21l-4-4" stroke={L.muted} strokeWidth="2" strokeLinecap="round"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subjects, topics..."
            style={{ border:"none", outline:"none", fontSize:11.5, color:L.ink, fontFamily:pf, flex:1, background:"transparent" }}/>
        </div>
      </div>

      <div style={{ margin:"12px 20px 0", display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
        {[{id:"all",label:"All"},{id:"all-prof",label:"Professional Ed"},{id:"all-gened",label:"General Ed"}].map(f=>(
          <div key={f.id} onClick={()=>setFilterS(f.id)} style={{ flex:"none", padding:"7px 14px", borderRadius:999, fontSize:10.5,
            fontWeight:600, whiteSpace:"nowrap", cursor:"pointer",
            background: filterS===f.id ? L.navy : "#fff", color: filterS===f.id ? "#fff" : L.muted,
            border: filterS===f.id ? "none" : `1px solid ${L.line}` }}>{f.label}</div>
        ))}
      </div>

      <div style={{ margin:"12px 20px 0" }}>
        <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
          style={{ background:L.navy, borderRadius:16, padding:"14px 16px", cursor:"pointer", color:"#fff",
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div>
            <div style={{ fontSize:9, color:L.gold, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>Comprehensive Exam</div>
            <div style={{ fontSize:13, fontWeight:700 }}>Master Board Exam — 350Q</div>
            {getData("master") && <div style={{ fontSize:10, color:"#c9d2e2", marginTop:3 }}>Last: {getData("master").score}%</div>}
          </div>
          <div style={{ fontSize:10.5, fontWeight:700, color:L.navy, background:L.gold, padding:"8px 12px", borderRadius:999, flex:"none" }}>Start →</div>
        </div>
      </div>

      <div style={{ margin:"15px 20px 0" }}>
        <div style={{ background:L.card, borderRadius:22, boxShadow:"0 3px 10px -4px rgba(14,35,72,.10)", border:`1px solid ${L.line}`, overflow:"hidden" }}>
          {filtered.length===0 && <div style={{ padding:24, textAlign:"center", fontSize:12, color:L.muted }}>No quizzes match your search.</div>}
          {filtered.map((quiz,i) => {
            const data = getData(quiz.id);
            const tint = data ? `${quiz.color}22` : L.bg;
            return (
              <div key={quiz.id} onClick={()=>setActiveQ(quiz.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:14, cursor:"pointer",
                borderTop: i>0 ? `1px solid ${L.line}` : "none" }}>
                <div style={{ width:42, height:42, borderRadius:12, flex:"none", background:tint,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:19 }}>{quiz.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:L.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {quiz.title.split("—")[0].trim()}
                  </div>
                  <div style={{ fontSize:9.5, color:L.muted, marginTop:3 }}>{quiz.questions.length} items · {quiz.category==="gened"?"General Education":"Professional Education"}</div>
                  <div style={{ height:4, borderRadius:2, background:L.line, marginTop:6, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${data?.score||0}%`, borderRadius:2, background:quiz.color }}/>
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color: data?quiz.color:L.muted, flex:"none" }}>{data ? `${data.score}%` : "—"}</div>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flex:"none" }}><path d="M1 1l5 5-5 5" stroke={L.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height:15 }}/>
    </>
  ));

  // ── DASHBOARD ─────────────────────────────────────────────────
  if (view === "dashboard") return shell("dashboard", (
    <>
      <div style={{ padding:"6px 20px 4px" }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:L.ink }}>Dashboard</h1>
        <p style={{ fontSize:11, color:L.muted, marginTop:3 }}>Your performance at a glance</p>
      </div>

      <div style={{ margin:"15px 20px 0", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[
          { v:questionsAnswered.toLocaleString(), l:"Questions Answered", icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={L.blue} strokeWidth="1.6"/><path d="M12 7v5l4 2" stroke={L.blue} strokeWidth="1.6" strokeLinecap="round"/></svg> },
          { v:totalMastery()+"%", l:"Overall Mastery", icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" stroke={L.green} strokeWidth="1.4" strokeLinejoin="round"/></svg> },
          { v:streak+" Day"+(streak===1?"":"s"), l:"Current Streak", icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2c3 4-2 5-2 9a4 4 0 108 0c0-1.5-.6-2.3-1.2-3.1.4 2-1 3-1.8 2C16 8 15 5 12 2z" fill={L.orange}/></svg> },
          { v:`${completedCount}/${QUIZ_REGISTRY.length}`, l:"Quizzes Completed", icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 6.5.9-4.7 4.6L18 20l-6-3.4L6 20l1.2-6.5L2.5 8.9 9 8l3-6z" fill={L.purple}/></svg> },
        ].map(t => (
          <div key={t.l} style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:16, padding:14 }}>
            <div style={{ marginBottom:8 }}>{t.icon}</div>
            <div style={{ fontSize:17, fontWeight:700, color:L.ink }}>{t.v}</div>
            <div style={{ fontSize:9.5, color:L.muted, marginTop:2 }}>{t.l}</div>
          </div>
        ))}
      </div>

      <div style={{ margin:"12px 20px 0" }}>
        <div style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:16, padding:"14px 18px" }}>
          <div style={{ fontSize:13.5, fontWeight:600, color:L.ink, marginBottom:2 }}>Subject Performance</div>
          <div onClick={()=>{setFilterS("all-prof");setView("library");}} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", cursor:"pointer" }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:L.green, flex:"none" }}/>
            <div style={{ fontSize:10.5, color:L.ink, width:110, flex:"none" }}>Professional Ed</div>
            <div style={{ flex:1, height:7, borderRadius:4, background:L.line, overflow:"hidden" }}><div style={{ height:"100%", width:`${avgOf(profSubset)}%`, background:L.green, borderRadius:4 }}/></div>
            <div style={{ fontSize:10.5, fontWeight:700, color:L.ink, width:32, textAlign:"right", flex:"none" }}>{avgOf(profSubset)}%</div>
          </div>
          <div onClick={()=>{setFilterS("all-gened");setView("library");}} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", cursor:"pointer" }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:L.purple, flex:"none" }}/>
            <div style={{ fontSize:10.5, color:L.ink, width:110, flex:"none" }}>General Ed</div>
            <div style={{ flex:1, height:7, borderRadius:4, background:L.line, overflow:"hidden" }}><div style={{ height:"100%", width:`${avgOf(genSubset)}%`, background:L.purple, borderRadius:4 }}/></div>
            <div style={{ fontSize:10.5, fontWeight:700, color:L.ink, width:32, textAlign:"right", flex:"none" }}>{avgOf(genSubset)}%</div>
          </div>
        </div>
      </div>

      <div style={{ margin:"12px 20px 0" }}>
        <div style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:16, padding:"14px 18px" }}>
          <div style={{ fontSize:13.5, fontWeight:600, color:L.ink, marginBottom:12 }}>All Quizzes</div>
          {[...QUIZ_REGISTRY, {id:"master",title:"Master Board Exam",icon:"🏆",color:L.navy}].map((quiz,i)=>{
            const data = getData(quiz.id);
            return (
              <div key={quiz.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0",
                borderTop: i>0 ? `1px solid ${L.line}` : "none" }}>
                <div style={{ width:30, height:30, borderRadius:9, background:`${quiz.color}22`, display:"flex",
                  alignItems:"center", justifyContent:"center", fontSize:13, flex:"none" }}>{quiz.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:L.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{quiz.title}</div>
                  <div style={{ height:3, borderRadius:2, background:L.line, marginTop:5, overflow:"hidden" }}><div style={{ height:"100%", width:`${data?.score||0}%`, background:quiz.color, borderRadius:2 }}/></div>
                </div>
                <div style={{ textAlign:"right", flex:"none", minWidth:36, fontSize:11, fontWeight:700, color: data?quiz.color:L.muted }}>{data?`${data.score}%`:"—"}</div>
                <div onClick={()=>{if(quiz.id==="master"){setMaster350(buildMaster350());setActiveQ("master");}else setActiveQ(quiz.id);}}
                  style={{ fontSize:9.5, fontWeight:600, color:L.blue, cursor:"pointer", flex:"none", padding:"4px 8px" }}>{data?"Retry":"Start"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin:"12px 20px 0" }}>
        <div style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:16, padding:"14px 18px" }}>
          <div style={{ fontSize:13.5, fontWeight:600, color:L.ink, marginBottom:10 }}>Study Recommendations</div>
          {QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).length > 0 ? (
            QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).map((quiz,i)=>(
              <div key={quiz.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0",
                borderTop: i>0 ? `1px solid ${L.line}` : "none" }}>
                <div style={{ fontSize:16 }}>{quiz.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:L.ink }}>{quiz.title}</div>
                  <div style={{ fontSize:9.5, color:L.muted, marginTop:2 }}>{getData(quiz.id)?`Score: ${getData(quiz.id).score}% → Target: 80%+`:"Not yet attempted"}</div>
                </div>
                <div onClick={()=>setActiveQ(quiz.id)} style={{ background:quiz.color, color:"#fff", fontSize:10, fontWeight:600,
                  padding:"6px 12px", borderRadius:999, cursor:"pointer", flex:"none" }}>Practice</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign:"center", padding:"14px 0" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>🏆</div>
              <div style={{ fontSize:13, fontWeight:700, color:L.green }}>All quizzes above 80%!</div>
              <div style={{ fontSize:11, color:L.muted, marginTop:4 }}>Ready for the Master Exam.</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ height:15 }}/>
    </>
  ));

  // ── MASTER EXAM (landing) ────────────────────────────────────
  if (view === "master") return shell("master", (
    <>
      <div style={{ padding:"6px 20px 4px" }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:L.ink }}>Master Exam</h1>
        <p style={{ fontSize:11, color:L.muted, marginTop:3 }}>Simulate the real board exam experience</p>
      </div>

      <div style={{ margin:"15px 20px 0" }}>
        <div style={{ background:L.navy, borderRadius:22, padding:20, color:"#fff" }}>
          <div style={{ fontSize:14.5, fontWeight:600, marginBottom:16 }}>Exam Readiness</div>
          <div style={{ display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ width:100, height:100, borderRadius:"50%", flex:"none",
              background:`conic-gradient(${L.gold} 0deg ${totalMastery()*3.6}deg, rgba(255,255,255,.14) ${totalMastery()*3.6}deg 360deg)`,
              display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ position:"absolute", inset:11, borderRadius:"50%", background:L.navy }}/>
              <div style={{ position:"relative", textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:700 }}>{totalMastery()}%</div>
                <div style={{ fontSize:8.5, color:"#c9d2e2", marginTop:1 }}>Ready</div>
              </div>
            </div>
            <div style={{ flex:1, fontSize:10.5, color:"#c9d2e2", lineHeight:1.6 }}>
              {completedCount === 0
                ? "Start reviewing to build your readiness score before taking the full 350-question exam."
                : avgOf(genSubset) < avgOf(profSubset)
                  ? <>You're on track. Keep reviewing weak topics in <b style={{ color:"#fff" }}>General Education</b> to boost your score before exam day.</>
                  : <>You're on track. Keep reviewing weak topics in <b style={{ color:"#fff" }}>Professional Education</b> to boost your score before exam day.</>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin:"15px 20px 0" }}>
        <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:L.gold, color:L.navy,
            fontSize:13, fontWeight:700, padding:14, borderRadius:16, cursor:"pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-14 9V3z" fill={L.navy}/></svg>
          Take Master Exam — 350Q
        </div>
      </div>

      <div style={{ margin:"12px 20px 0" }}>
        <div style={{ fontSize:13.5, fontWeight:600, color:L.ink, marginBottom:10 }}>Practice Exams</div>
        <div style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:22 }}>
          {[
            { name:"Full Mock Exam", meta:"350 items · All subjects", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={L.blue} strokeWidth="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke={L.blue} strokeWidth="1.6" strokeLinecap="round"/></svg>, tint:L.blueTint, action:()=>{setMaster350(buildMaster350());setActiveQ("master");} },
            { name:"Professional Education Set", meta:`${profSubset.reduce((a,q)=>a+q.questions.length,0)} items · 3 quizzes`, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={L.orange} strokeWidth="1.6"/><path d="M12 7v5l4 2" stroke={L.orange} strokeWidth="1.6" strokeLinecap="round"/></svg>, tint:L.orangeTint, action:()=>{setFilterS("all-prof");setView("library");} },
            { name:"General Education Set", meta:`${genSubset.reduce((a,q)=>a+q.questions.length,0)} items · 9 quizzes`, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" stroke={L.purple} strokeWidth="1.4" strokeLinejoin="round"/></svg>, tint:L.purpleTint, action:()=>{setFilterS("all-gened");setView("library");} },
          ].map((e,i)=>(
            <div key={e.name} style={{ display:"flex", alignItems:"center", gap:12, padding:14, borderTop: i>0?`1px solid ${L.line}`:"none" }}>
              <div style={{ width:44, height:44, borderRadius:12, flex:"none", background:e.tint, display:"flex", alignItems:"center", justifyContent:"center" }}>{e.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:L.ink }}>{e.name}</div>
                <div style={{ fontSize:9.5, color:L.muted, marginTop:3 }}>{e.meta}</div>
              </div>
              <div onClick={e.action} style={{ flex:"none", background:L.navyNav, color:"#fff", fontSize:10, fontWeight:600,
                padding:"8px 13px", borderRadius:999, cursor:"pointer" }}>Start</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height:15 }}/>
    </>
  ));

  // ── PROFILE ───────────────────────────────────────────────────
  if (view === "profile") return shell("profile", (
    <>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 20px 4px", textAlign:"center" }}>
        <div style={{ width:76, height:76, borderRadius:"50%", background:L.navy, display:"flex", alignItems:"center",
          justifyContent:"center", color:L.gold, fontSize:24, fontWeight:700, border:`3px solid ${L.gold}` }}>
          {(user||"?").slice(0,2).toUpperCase()}
        </div>
        <h2 style={{ fontSize:16, fontWeight:700, color:L.ink, marginTop:10 }}>{user}</h2>
        <p style={{ fontSize:10.5, color:L.muted, marginTop:2 }}>{isAdmin ? "Administrator" : "Future Teacher"}</p>
      </div>

      <div style={{ display:"flex", margin:"14px 20px 0", background:"#fff", border:`1px solid ${L.line}`, borderRadius:16, overflow:"hidden" }}>
        {[
          { n:streak, l:"Day Streak" },
          { n:completedCount, l:"Quizzes Done" },
          { n:totalMastery()+"%", l:"Mastery" },
        ].map((s,i)=>(
          <div key={s.l} style={{ flex:1, textAlign:"center", padding:"12px 4px", borderLeft: i>0?`1px solid ${L.line}`:"none" }}>
            <div style={{ fontSize:15, fontWeight:700, color:L.ink }}>{s.n}</div>
            <div style={{ fontSize:8.5, color:L.muted, marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ margin:"15px 20px 0" }}>
        <div style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:16 }}>
          {[
            { label:"Library", action:()=>setView("library") },
            { label:"Dashboard", action:()=>setView("dashboard") },
            ...(isAdmin ? [{ label:"Admin Panel", action:()=>setView("admin"), color:L.blue }] : []),
          ].map((m,i)=>(
            <div key={m.label} onClick={m.action} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
              cursor:"pointer", borderTop: i>0?`1px solid ${L.line}`:"none" }}>
              <div style={{ flex:1, fontSize:11.5, fontWeight:600, color:m.color||L.ink }}>{m.label}</div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke={L.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          ))}
          <div onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
            cursor:"pointer", borderTop:`1px solid ${L.line}` }}>
            <div style={{ flex:1, fontSize:11.5, fontWeight:600, color:"#E5484D" }}>Log Out</div>
          </div>
        </div>
      </div>
      <div style={{ height:15 }}/>
    </>
  ));

  return null;
}
