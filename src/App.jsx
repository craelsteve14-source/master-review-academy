import { useState, useRef, useEffect } from "react";
import { SCIENCE_50 } from './data/science_50q';
import { SOCSCI_50 } from './data/socsci_50q';
import { CONTEMP_50 } from './data/contemp_50q';
import { ARTAPP_50 } from './data/artapp_50q';
import { ENGLISH_100 } from './data/english_100q';
import { FILIPINO_100 } from './data/filipino_100q';
import { MATH_100 } from './data/math_100q';
import { RIZAL_15 } from './data/rizal_15q';
import { ETHICS_80 } from './data/ethics_80q';
import { CHILDADO_50 } from './data/childado_50q';
import { ASSESS_50 } from './data/assess_50q';
import { INCLUSIVE_50 } from './data/inclusive_50q';

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

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("mra_session", JSON.stringify({ user, isAdmin, view }));
    } else {
      localStorage.removeItem("mra_session");
    }
  }, [user, isAdmin, view]);

  const storage = useStorage(user);

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
    return (filterS==="all"||q.subjId===filterS) && (!ms||q.title.toLowerCase().includes(ms));
  });

  const completedCount = QUIZ_REGISTRY.filter(q=>getData(q.id)).length;

  // ── HOME ──────────────────────────────────────────────────────
  if (view === "home") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Master Review Academy"
        left={<span style={{ fontSize:13, color:"#6366f1", fontWeight:700 }}>👤 {user}</span>}
        right={
          <div style={{ display:"flex", gap:4 }}>
            {["Library","Dashboard"].map(v=>(
              <GhostBtn key={v} onClick={()=>setView(v.toLowerCase())}>{v}</GhostBtn>
            ))}
            <GhostBtn onClick={handleLogout} style={{ color:"#ef4444" }}>Sign Out</GhostBtn>
          </div>
        }
      />

      {/* Hero */}
      <div style={{ padding:"56px 20px 40px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ fontSize:11, color:"#6366f1", letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>
          LET Board Examination Review
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:900, letterSpacing:"-2px", lineHeight:1.08,
          margin:"0 0 14px", background:"linear-gradient(135deg,#fafafa 40%,#52525b)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Everything you need<br/>to pass the LET.
        </h1>
        <p style={{ fontSize:15, color:TXT2, lineHeight:1.75, maxWidth:480, margin:"0 0 28px" }}>
          745 questions across Professional Education and General Education subjects. Organized, trackable, examination-ready.
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <SolidBtn onClick={()=>setView("library")}>Start Reviewing</SolidBtn>
          <SolidBtn onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
            color={SURF2} style={{ border:`1px solid ${BORDER}`, color:TXT }}>
            Master Exam — 350Q
          </SolidBtn>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background:SURF, borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`, padding:"20px" }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[
            {l:"Total Questions",v:QUIZ_REGISTRY.reduce((a,q)=>a+q.questions.length,0),c:"#6366f1"},
            {l:"Subject Areas",  v:SUBJECTS.length,c:"#10b981"},
            {l:"Available Quizzes",v:QUIZ_REGISTRY.length,c:"#f59e0b"},
            {l:"Your Mastery",   v:totalMastery()+"%",c:"#a855f7"},
          ].map(s=>(
            <div key={s.l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:s.c, letterSpacing:"-1px" }}>{s.v}</div>
              <div style={{ fontSize:10, color:TXT2, marginTop:3, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Cards */}
      <div style={{ padding:"40px 20px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:16 }}>Subject Areas</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
          {SUBJECTS.map(s => {
            const sq = QUIZ_REGISTRY.filter(q=>q.subjId===s.id);
            const avg = Math.round(sq.reduce((a,q)=>a+(getData(q.id)?.score||0),0)/sq.length);
            return (
              <div key={s.id} onClick={()=>{setFilterS(s.id);setView("library");}}
                style={{ background:SURF, borderRadius:14, padding:20, border:`1px solid ${BORDER}`, cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=s.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:TXT, marginBottom:5, letterSpacing:"-0.2px" }}>{s.name}</div>
                <div style={{ fontSize:11, color:TXT2, lineHeight:1.6, marginBottom:12 }}>{s.desc}</div>
                <Bar pct={avg} color={s.color}/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
                  <span style={{ fontSize:10, color:TXT2 }}>{sq.length} quizzes · {sq.reduce((a,q)=>a+q.questions.length,0)}Q</span>
                  <span style={{ fontSize:10, color:s.color, fontWeight:600 }}>{avg}% mastery</span>
                </div>
              </div>
            );
          })}
          <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
            style={{ background:"linear-gradient(135deg,#1e1b4b,#111116)", borderRadius:14, padding:20, border:"1px solid #6366f1", cursor:"pointer" }}>
            <div style={{ fontSize:24, marginBottom:10 }}>🏆</div>
            <div style={{ fontSize:13, fontWeight:700, color:TXT, marginBottom:5 }}>Master Board Exam</div>
            <div style={{ fontSize:11, color:TXT2, lineHeight:1.6, marginBottom:12 }}>All 350 questions from the seven subject banks in one exam.</div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, color:TXT2 }}>350Q · All subjects</span>
              <span style={{ fontSize:10, color:"#818cf8", fontWeight:600 }}>Start →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LIBRARY ───────────────────────────────────────────────────
  if (view === "library") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Quiz Library"
        left={<GhostBtn onClick={()=>{setView("home");setFilterS("all");}}>← Home</GhostBtn>}
        right={<GhostBtn onClick={()=>setView("dashboard")}>Dashboard</GhostBtn>}
      />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 20px" }}>
        {/* Category Groups */}
        <div style={{ marginBottom:24 }}>
          <LibraryGroup
            label="Professional Education"
            icon="📋"
            subtitle="From physical handouts"
            color="#10b981"
            quizzes={QUIZ_REGISTRY.filter(q => !q.category || q.category === "profd")}
            storage={storage}
            onStart={q=>setActiveQ(q.id)}
          />
          <LibraryGroup
            label="General Education"
            icon="🎓"
            subtitle="Lorimar GEN ED 2023 — 595 questions"
            color="#a78bfa"
            quizzes={QUIZ_REGISTRY.filter(q => q.category === "gened")}
            storage={storage}
            onStart={q=>setActiveQ(q.id)}
          />
        </div>

        {/* Search & Filter */}
        <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search quizzes..."
            style={{ flex:1, minWidth:160, background:SURF, border:`1px solid ${BORDER}`, borderRadius:9,
              padding:"9px 14px", fontSize:13, color:TXT, fontFamily:sf, outline:"none" }}/>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[{id:"all",label:"All"},...SUBJECTS.map(s=>({id:s.id,label:`${s.icon} ${s.name.split(" ")[1]||s.name}`}))].map(f=>(
              <button key={f.id} onClick={()=>setFilterS(f.id)}
                style={{ background:filterS===f.id?"#6366f1":SURF, color:filterS===f.id?"#fff":TXT2,
                  border:`1px solid ${filterS===f.id?"#6366f1":BORDER}`, borderRadius:8,
                  padding:"7px 12px", fontSize:12, cursor:"pointer", fontFamily:sf, fontWeight:500 }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Banner */}
        <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
          style={{ background:"linear-gradient(135deg,#1e1b4b,#111116)", borderRadius:14, padding:"16px 20px",
            border:"1px solid #6366f1", cursor:"pointer", marginBottom:24,
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div>
            <div style={{ fontSize:10, color:"#818cf8", letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>Comprehensive Exam</div>
            <div style={{ fontSize:15, fontWeight:800, color:TXT, letterSpacing:"-0.3px" }}>Master Board Exam Review</div>
            <div style={{ fontSize:11, color:TXT2, marginTop:3 }}>
              350 questions · All 7 subjects · Shuffled fresh each attempt
              {getData("master") && <span style={{ color:"#818cf8", marginLeft:8 }}>Last: {getData("master").score}%</span>}
            </div>
          </div>
          <SolidBtn onClick={e=>{e.stopPropagation();setMaster350(buildMaster350());setActiveQ("master");}}>Start 350Q →</SolidBtn>
        </div>

        {/* Quiz Grid */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
          {filtered.length} Quiz{filtered.length!==1?"zes":""}
        </div>

        {/* Group by subject */}
        {SUBJECTS.filter(s=>filterS==="all"||s.id===filterS).map(s => {
          const sq = filtered.filter(q=>q.subjId===s.id);
          if (!sq.length) return null;
          return (
            <div key={s.id} style={{ marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:3, height:16, background:s.color, borderRadius:99 }}/>
                <span style={{ fontSize:12, fontWeight:700, color:s.color }}>{s.icon} {s.name}</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:12 }}>
                {sq.map(quiz => {
                  const data = getData(quiz.id);
                  return (
                    <div key={quiz.id} style={{ background:SURF, borderRadius:14, border:`1px solid ${BORDER}`, overflow:"hidden", transition:"border-color .2s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=quiz.color}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                      <div style={{ height:2, background:quiz.color }}/>
                      <div style={{ padding:18 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:quiz.color, letterSpacing:"-0.1px" }}>
                            {quiz.questions.length}Q · {quiz.easy+quiz.moderate+quiz.difficult} Questions
                          </span>
                          {data && <span style={{ fontSize:13, fontWeight:800, color:quiz.color }}>{data.score}%</span>}
                        </div>
                        <div style={{ fontSize:13, fontWeight:700, color:TXT, marginBottom:5, lineHeight:1.3, letterSpacing:"-0.2px" }}>
                          {quiz.title.split("—")[1]?.trim()||quiz.title}
                        </div>
                        <div style={{ fontSize:11, color:TXT2, lineHeight:1.55, marginBottom:12 }}>{quiz.desc}</div>
                        <div style={{ display:"flex", gap:4, marginBottom:12 }}>
                          {[["easy",quiz.easy],["moderate",quiz.moderate],["difficult",quiz.difficult]].map(([d,n])=>(
                            <span key={d} style={{ fontSize:9, color:DIFF[d].text, background:DIFF[d].bg, padding:"2px 7px", borderRadius:5 }}>{n} {d}</span>
                          ))}
                        </div>
                        {data && <div style={{ marginBottom:10 }}><Bar pct={data.score} color={quiz.color}/></div>}
                        <button onClick={()=>setActiveQ(quiz.id)}
                          style={{ width:"100%", background:quiz.color, color:"#fff", border:"none", borderRadius:9,
                            padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:sf }}>
                          {data ? "Retake" : "Start Quiz"}
                        </button>
                        {data && <div style={{ fontSize:10, color:TXT2, textAlign:"center", marginTop:6 }}>
                          {data.correct}/{data.total} · {new Date(data.date).toLocaleDateString()}
                        </div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── DASHBOARD ─────────────────────────────────────────────────
  if (view === "dashboard") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Dashboard"
        left={<GhostBtn onClick={()=>setView("home")}>← Home</GhostBtn>}
        right={
          <div style={{ display:"flex", gap:4 }}>
            <GhostBtn onClick={()=>setView("library")}>Library</GhostBtn>
            {isAdmin && <GhostBtn onClick={()=>setView("admin")} style={{ color:"#6366f1", fontWeight:700 }}>Admin Panel</GhostBtn>}
            <GhostBtn onClick={handleLogout} style={{ color:"#ef4444" }}>Sign Out</GhostBtn>
          </div>
        }
      />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 20px" }}>
        {/* Welcome */}
        <div style={{ background:"linear-gradient(135deg,#1e1b4b,#111116)", borderRadius:16, padding:24, border:"1px solid #6366f1", marginBottom:20,
          display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
          <Ring pct={totalMastery()} size={88} color="#6366f1" label="Overall"/>
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ fontSize:11, color:"#818cf8", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>
              Welcome back, {user}
            </div>
            <div style={{ fontSize:28, fontWeight:900, color:TXT, letterSpacing:"-1px", lineHeight:1 }}>{totalMastery()}% Mastery</div>
            <div style={{ fontSize:12, color:TXT2, marginTop:6 }}>
              {completedCount}/{QUIZ_REGISTRY.length} quizzes completed · 600 total questions
            </div>
          </div>
          <div style={{ display:"flex", gap:24 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:900, color:"#22c55e" }}>{completedCount}</div>
              <div style={{ fontSize:9, color:TXT2, marginTop:2, textTransform:"uppercase", letterSpacing:"0.5px" }}>Done</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:900, color:"#f59e0b" }}>{QUIZ_REGISTRY.length-completedCount}</div>
              <div style={{ fontSize:9, color:TXT2, marginTop:2, textTransform:"uppercase", letterSpacing:"0.5px" }}>Left</div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>Subject Performance</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12, marginBottom:20 }}>
          {SUBJECTS.map(s => {
            const sq = QUIZ_REGISTRY.filter(q=>q.subjId===s.id);
            const scores = sq.map(q=>getData(q.id)?.score).filter(Boolean);
            const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
            return (
              <div key={s.id} style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:20, marginBottom:3 }}>{s.icon}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:TXT, letterSpacing:"-0.2px" }}>{s.name.split(" ").slice(0,3).join(" ")}</div>
                  </div>
                  <Ring pct={avg} size={52} color={s.color}/>
                </div>
                <Bar pct={avg} color={s.color}/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
                  <span style={{ fontSize:10, color:TXT2 }}>{scores.length}/{sq.length} done</span>
                  <span style={{ fontSize:10, color:s.color, fontWeight:600 }}>{avg>0?avg+"%":"Not started"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Quizzes */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>All Quizzes</div>
        <div style={{ background:SURF, borderRadius:14, border:`1px solid ${BORDER}`, overflow:"hidden", marginBottom:20 }}>
          {[...QUIZ_REGISTRY, {id:"master",title:"Master Board Exam",icon:"🏆",color:"#6366f1"}].map((quiz,i,arr)=>{
            const data = getData(quiz.id);
            return (
              <div key={quiz.id} style={{ padding:"14px 18px", borderBottom:i<arr.length-1?`1px solid ${BORDER}`:"none",
                display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:34,height:34,borderRadius:9,background:`${quiz.color}22`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
                  {quiz.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12,fontWeight:600,color:TXT,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {quiz.title}
                  </div>
                  <Bar pct={data?.score||0} color={quiz.color} h={2}/>
                </div>
                <div style={{ textAlign:"right",flexShrink:0,minWidth:50 }}>
                  {data?<><div style={{fontSize:14,fontWeight:800,color:quiz.color}}>{data.score}%</div>
                  <div style={{fontSize:9,color:TXT2}}>{data.correct}/{data.total}</div></>
                  :<div style={{fontSize:10,color:TXT2}}>—</div>}
                </div>
                <button onClick={()=>{if(quiz.id==="master"){setMaster350(buildMaster350());setActiveQ("master");}else setActiveQ(quiz.id);}}
                  style={{background:SURF2,border:`1px solid ${BORDER}`,color:TXT,borderRadius:7,
                    padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:sf,fontWeight:600,flexShrink:0}}>
                  {data?"Retry":"Start"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>Study Recommendations</div>
        <div style={{ background:SURF, borderRadius:14, border:`1px solid ${BORDER}`, padding:18 }}>
          {QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).length > 0 ? (
            QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).map(quiz=>(
              <div key={quiz.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:`1px solid ${BORDER}` }}>
                <div style={{fontSize:18}}>{quiz.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:TXT}}>{quiz.title}</div>
                  <div style={{fontSize:10,color:TXT2,marginTop:2}}>
                    {getData(quiz.id)?`Score: ${getData(quiz.id).score}% → Target: 80%+`:"Not yet attempted"}
                  </div>
                </div>
                <button onClick={()=>setActiveQ(quiz.id)}
                  style={{background:quiz.color,color:"#fff",border:"none",borderRadius:7,
                    padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:sf,fontWeight:700}}>
                  Practice
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:24, marginBottom:6 }}>🏆</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#4ade80" }}>All quizzes above 80%!</div>
              <div style={{ fontSize:11, color:TXT2, marginTop:4 }}>Ready for the Master Exam.</div>
              <SolidBtn onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
                style={{ marginTop:14, padding:"10px 24px" }}>Take Master Exam →</SolidBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return null;
}
