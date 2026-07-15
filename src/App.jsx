import { useState, useRef, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
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
// SUPABASE — real auth + cross-device sync
// ═══════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://ztgtrvodalesxqbmrrqd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Z3Rydm9kYWxlc3hxYm1ycnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjU3MDgsImV4cCI6MjA5NzAwMTcwOH0.k7mQyT1gmnSG9pnycjUj7f6xcwTCKgHErOQUHGV5gFg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// The app only ever collects a username/password — Supabase Auth needs an
// email, so we synthesize one behind the scenes. Users never see it.
const AUTH_EMAIL_DOMAIN = "mra.local";
const emailFor = (username) => `${username.trim().toLowerCase()}@${AUTH_EMAIL_DOMAIN}`;

async function signUpUser(username, password) {
  return supabase.auth.signUp({
    email: emailFor(username),
    password,
    options: { data: { username: username.trim() } }
  });
}

async function signInUser(username, password) {
  return supabase.auth.signInWithPassword({ email: emailFor(username), password });
}

// Reconciles this account's quiz history between this device and the cloud,
// in both directions, so two devices converge instead of the cloud only
// ever overwriting local. A device that already had scores saved locally
// before this sync system existed (or made offline) has them pushed up;
// a device that's behind gets the cloud's newer copy pulled down; when
// both sides have the same quiz, whichever was completed more recently
// wins and is written back to the other side.
async function pullCloudProgress(username) {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    const prefix = `mra_${username}_`;

    const { data: profile } = await supabase.from("profiles")
      .select("streak_count, streak_last, daily_date, daily_count")
      .eq("id", authUser.id).maybeSingle();
    if (profile) {
      if (profile.streak_count) {
        localStorage.setItem(prefix + "streak", JSON.stringify({ count: profile.streak_count, last: profile.streak_last }));
      }
      if (profile.daily_count) {
        localStorage.setItem(prefix + "daily", JSON.stringify({ date: profile.daily_date, count: profile.daily_count }));
      }
    }

    const { data: rows } = await supabase.from("quiz_progress")
      .select("quiz_id, score, total, correct, completed_at")
      .eq("user_id", authUser.id);
    const cloudByQuiz = {};
    (rows || []).forEach(r => { cloudByQuiz[r.quiz_id] = r; });

    const quizIds = [...QUIZ_REGISTRY.map(q => q.id), "master"];
    for (const id of quizIds) {
      const key = prefix + `quiz_${id}`;
      let local = null;
      try { local = JSON.parse(localStorage.getItem(key)); } catch {}
      const cloud = cloudByQuiz[id];

      if (cloud && !local) {
        localStorage.setItem(key, JSON.stringify({ score: cloud.score, total: cloud.total, correct: cloud.correct, date: cloud.completed_at }));
      } else if (local && !cloud) {
        await pushQuizScore(id, local.score, local.total, local.correct, local.date);
      } else if (local && cloud) {
        const localTime = new Date(local.date || 0).getTime();
        const cloudTime = new Date(cloud.completed_at || 0).getTime();
        if (cloudTime > localTime) {
          localStorage.setItem(key, JSON.stringify({ score: cloud.score, total: cloud.total, correct: cloud.correct, date: cloud.completed_at }));
        } else if (localTime > cloudTime) {
          await pushQuizScore(id, local.score, local.total, local.correct, local.date);
        }
      }
    }
  } catch {}
}

async function pushQuizScore(quizId, score, total, correct, completedAt) {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    await supabase.from("quiz_progress").upsert({
      user_id: authUser.id,
      quiz_id: quizId,
      score, total, correct,
      percentage: score,
      completed_at: completedAt || new Date().toISOString()
    }, { onConflict: "user_id,quiz_id" });
  } catch {}
}

async function pushProfileFields(fields) {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    await supabase.from("profiles").update(fields).eq("id", authUser.id);
  } catch {}
}

// In-progress (not yet completed) quiz attempts, so a "answer 1 question,
// exit, open on another device" flow resumes at the same question instead
// of only completed scores being portable. order stays fixed for the life
// of an attempt, so it's written once; only the small idx/correct/wrong/
// missed fields need to go out after every answer.
async function pushQuizSession(quizId, order, idx, correct, wrong, missed) {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    await supabase.from("quiz_sessions").upsert({
      user_id: authUser.id,
      quiz_id: quizId,
      order_indices: order,
      idx, correct, wrong, missed,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,quiz_id" });
  } catch {}
}

async function pullQuizSession(quizId) {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;
    const { data } = await supabase.from("quiz_sessions")
      .select("order_indices, idx, correct, wrong, missed")
      .eq("user_id", authUser.id).eq("quiz_id", quizId).maybeSingle();
    return data || null;
  } catch { return null; }
}

async function deleteQuizSession(quizId) {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    await supabase.from("quiz_sessions").delete().eq("user_id", authUser.id).eq("quiz_id", quizId);
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
// RESPONSIVE — phone / tablet / desktop breakpoints
// ═══════════════════════════════════════════════════════════════════
function useViewport() {
  const getBp = () => {
    const w = window.innerWidth;
    if (w >= 1100) return "desktop";
    if (w >= 768) return "tablet";
    return "phone";
  };
  const [bp, setBp] = useState(getBp);
  useEffect(() => {
    const onResize = () => setBp(getBp());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return bp;
}

// ═══════════════════════════════════════════════════════════════════
// STORAGE — per-user isolation + Supabase sync
// ═══════════════════════════════════════════════════════════════════
function useStorage(username) {
  const prefix = username ? `mra_${username}_` : "mra_guest_";
  const get = (key) => { try { return JSON.parse(localStorage.getItem(prefix + key)) || null; } catch { return null; } };
  const set = (key, val) => {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(val));
      if (!username) return;
      if (key.startsWith("quiz_") && val?.score !== undefined) {
        const quizId = key.replace("quiz_", "");
        pushQuizScore(quizId, val.score, val.total, val.correct, val.date).catch(() => {});
      } else if (key === "streak" && val?.count !== undefined) {
        pushProfileFields({ streak_count: val.count, streak_last: val.last }).catch(() => {});
      } else if (key === "daily" && val?.count !== undefined) {
        pushProfileFields({ daily_date: val.date, daily_count: val.count }).catch(() => {});
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
  if (p >= 95) return { l:"Outstanding",      c:"#1EA457", bg:"#EAF7EE", bdr:"#1EA457" };
  if (p >= 90) return { l:"Excellent",         c:"#3580CC", bg:"#EAF2FB", bdr:"#3580CC" };
  if (p >= 80) return { l:"Very Good",         c:"#B45BF6", bg:"#F6ECFC", bdr:"#B45BF6" };
  if (p >= 70) return { l:"Good",              c:"#B5790A", bg:"#FEF3E2", bdr:"#F0BA48" };
  return              { l:"Needs Improvement", c:"#E5484D", bg:"#FDECEC", bdr:"#E5484D" };
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
  easy:     { bg:"#EAF7EE", ring:"#1EA457", text:"#177A42", label:"Easy"      },
  moderate: { bg:"#FEF3E2", ring:"#F0BA48", text:"#B5790A", label:"Moderate"  },
  difficult:{ bg:"#F6ECFC", ring:"#B45BF6", text:"#8A2BE0", label:"Difficult" },
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

// Elegant line-icon set replacing the QUIZ_REGISTRY emoji on the light screens.
const SUBJ_ICON_PATHS = {
  childado: (c) => <><path d="M9 3a4.5 4.5 0 00-4.2 6.1A4 4 0 006 17h1M15 3a4.5 4.5 0 014.2 6.1A4 4 0 0118 17h-1M9 3c0 3-1.5 4-1.5 7a3 3 0 003 3h3a3 3 0 003-3c0-3-1.5-4-1.5-7M9 3a3 3 0 016 0" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 21v-2M13.5 21v-2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
  assess:   (c) => <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>,
  inclusive:(c) => <><circle cx="9" cy="9" r="5.5" stroke={c} strokeWidth="1.5"/><circle cx="15" cy="15" r="5.5" stroke={c} strokeWidth="1.5"/></>,
  science:  (c) => <><path d="M10 3h4M10.5 3v5.5L6 17a2 2 0 001.8 3h8.4a2 2 0 001.8-3l-4.5-8.5V3" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M8.5 15h7" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></>,
  socsci:   (c) => <><path d="M3 9l9-5 9 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
  contemp:  (c) => <><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke={c} strokeWidth="1.5"/><path d="M3 12h18" stroke={c} strokeWidth="1.5"/></>,
  artapp:   (c) => <><path d="M12 3a9 9 0 100 18c1.1 0 1.8-.9 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a4 4 0 004-4c0-4.4-3.6-8.2-8-8.2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><circle cx="7.5" cy="12" r="1.1" fill={c}/><circle cx="9" cy="8" r="1.1" fill={c}/><circle cx="14" cy="7.5" r="1.1" fill={c}/></>,
  english:  (c) => <><path d="M12 6.5c-1.5-1-4-1.5-8-1.5v13c4 0 6.5.5 8 1.5 1.5-1 4-1.5 8-1.5V5c-4 0-6.5.5-8 1.5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 6.5V19" stroke={c} strokeWidth="1.5"/></>,
  filipino: (c) => <><path d="M4 4h13l-2.2 4L17 12H4" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 4v16" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
  math:     (c) => <><path d="M12 3l8 15H4l8-15z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 15h6" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></>,
  rizal:    (c) => <><path d="M19 3c-5 0-9 3-11 8-1 2.5-1.5 5-3 7 3-.5 5-1.5 7-3 5-2 8-6 8-11 0-.3 0-.7-1-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 12L6 18" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
  ethics2:  (c) => <><path d="M12 3v18M8 21h8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><path d="M12 6L5 8l3 6.5a3.4 3.4 0 004-.1L12 8zM12 6l7 2-3 6.5a3.4 3.4 0 01-4-.1L12 8z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></>,
};
function SubjIcon({ subjId, color = "#14213D", size = 20 }) {
  const draw = SUBJ_ICON_PATHS[subjId];
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{draw ? draw(color) : <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.6"/>}</svg>;
}
function CategoryIcon({ type, color, size = 22 }) {
  if (type === "prof") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth="1.5"/>
      <path d="M3 12h18M10.5 12v2h3v-2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4L2 9l10 5 8-4v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function TrophyIcon({ color = "#F0BA48", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v5a5 5 0 01-10 0V4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 14v3M9 20h6M10 20v-2.5a1 1 0 011-1h2a1 1 0 011 1V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Original animated mascot — not a copy of any illustrated character, just a
// simple geometric grad-cap companion built from the app's own palette.
const MASCOT_MSGS = {
  idle: [
    "Ready to level up today?", "Let's ace a few questions!", "Your future classroom is waiting!",
    "One quiz a day keeps doubts away.", "You've got this, future teacher!", "Small steps, big mastery.",
  ],
  happy: [
    "Nice work!", "You nailed it!", "Excellent!", "That's the spirit!", "Keep it up!", "Sharp thinking!",
  ],
  oops: [
    "Almost — let's learn from this one:", "No worries, here's why:", "Let's break it down together:", "Close! Here's the idea:",
  ],
};
function pickMsg(pose) { const arr = MASCOT_MSGS[pose] || MASCOT_MSGS.idle; return arr[Math.floor(Math.random() * arr.length)]; }

const MASCOT_ASPECT = 620 / 700; // professor.png natural width/height
function Mascot({ pose = "idle", size = 92 }) {
  const bodyAnim = pose === "happy" ? "mraMascotPop .6s ease" : pose === "oops" ? "mraMascotShake .5s ease" : "mraMascotBob 2.6s ease-in-out infinite";
  const height = size / MASCOT_ASPECT;
  return (
    <div style={{ width: size, height, position: "relative", flex: "none" }}>
      <img src="/mascot/professor.png" alt="Professor Maya" width={size} height={height}
        style={{ width: size, height, objectFit: "contain", display: "block",
          animation: bodyAnim, transformOrigin: "50% 85%",
          filter: pose === "oops" ? "saturate(0.85)" : "none" }} />
      {pose === "happy" && [0, 1, 2].map(i => (
        <span key={i} style={{ position: "absolute", left: `${8 + i * 34}%`, top: "0%", fontSize: size * 0.16,
          animation: `mraMascotSparkle .9s ease ${i * 0.15}s infinite`, color: L.gold }}>✦</span>
      ))}
    </div>
  );
}

function MascotBubble({ children, tailSide = "left", scale = 1 }) {
  const tailPos = tailSide === "bottom"
    ? { bottom: -6, right: 30 }
    : { top: "50%", [tailSide]: -6, transform: "translateY(-50%)" };
  const tailShadow = tailSide === "bottom" ? "3px 3px 5px -4px rgba(14,35,72,.15)"
    : tailSide === "right" ? "3px -3px 5px -4px rgba(14,35,72,.15)" : "-3px 3px 5px -4px rgba(14,35,72,.15)";
  return (
    <div style={{ background: "#fff", borderRadius: Math.round(16*scale), padding: `${Math.round(12*scale)}px ${Math.round(14*scale)}px`,
      fontSize: Math.round(12*scale), color: L.ink, lineHeight: 1.55, boxShadow: "0 4px 14px -4px rgba(14,35,72,.18)",
      animation: "mraBubbleIn .35s ease", position: "relative", flex: 1, minWidth: 0 }}>
      {children}
      <div style={{ position: "absolute", width: 14, height: 14, background: "#fff", ...tailPos,
        transform: `${tailPos.transform||""} rotate(45deg)`.trim(), boxShadow: tailShadow }} />
    </div>
  );
}

function MascotStrip({ pose = "idle", size = 108, message, scale = 1 }) {
  return (
    <div style={{ margin: `${Math.round(12*scale)}px ${Math.round(20*scale)}px 0`, display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 12 }}>
      <Mascot pose={pose} size={Math.round(size*scale)}/>
      <MascotBubble tailSide="right" scale={scale}>{message}</MascotBubble>
    </div>
  );
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

function Sidebar({ active, onNav, user, isAdmin, onAdmin, onLogout, streak, mastery }) {
  return (
    <div style={{ width: 248, flex: "none", background: L.navyNav, minHeight: "100vh",
      display: "flex", flexDirection: "column", padding: "26px 0",
      backgroundImage: "radial-gradient(circle at 15% -10%, rgba(240,186,72,.14), transparent 45%)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 22px 28px" }}>
        <svg width="30" height="26" viewBox="0 0 26 22" style={{ flex: "none" }}><path d="M13 0L26 5.5L13 11L0 5.5L13 0Z" fill={L.gold}/><path d="M6 8V14C6 14 9 17 13 17C17 17 20 14 20 14V8L13 11L6 8Z" fill={L.gold}/></svg>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: ".2px" }}>MASTER REVIEW</div>
          <div style={{ fontSize: 9.5, color: "#8a93a8", letterSpacing: "1px" }}>ACADEMY</div>
        </div>
      </div>

      <div style={{ margin: "0 18px 24px", background: "rgba(255,255,255,.06)", borderRadius: 16,
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 0,
        border: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: L.gold }}>{streak}</div>
          <div style={{ fontSize: 8.5, color: "#a9b4c9", marginTop: 2, letterSpacing: ".3px" }}>DAY STREAK</div>
        </div>
        <div style={{ width: 1, height: 30, background: "rgba(255,255,255,.12)" }}/>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: "#fff" }}>{mastery}%</div>
          <div style={{ fontSize: 8.5, color: "#a9b4c9", marginTop: 2, letterSpacing: ".3px" }}>MASTERY</div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {LNAV_ITEMS.map(n => (
          <div key={n.id} onClick={()=>onNav(n.id)} className="mra-hover-navitem"
            style={{ display:"flex", alignItems:"center", gap:12,
            padding:"13px 22px", cursor:"pointer", color: active===n.id ? L.gold : "#c3c9d6",
            background: active===n.id ? "rgba(240,186,72,.1)" : "transparent",
            borderLeft: active===n.id ? `3px solid ${L.gold}` : "3px solid transparent", fontFamily:pf }}>
            <NavIcon type={n.icon} active={active===n.id}/>
            <span style={{ fontSize:13, fontWeight:600 }}>{n.label}</span>
          </div>
        ))}
        {isAdmin && (
          <div onClick={onAdmin} className="mra-hover-navitem" style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 22px",
            cursor:"pointer", color:"#7fb3e8", fontFamily:pf }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Admin Panel</span>
          </div>
        )}
      </div>
      <div style={{ padding:"14px 22px 0", borderTop:"1px solid rgba(255,255,255,.1)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:L.gold, color:L.navy, fontWeight:700,
            fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", flex:"none" }}>
            {(user||"?").slice(0,2).toUpperCase()}
          </div>
          <span style={{ fontSize:12.5, fontWeight:600, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user}</span>
        </div>
        <div onClick={onLogout} style={{ fontSize:11.5, fontWeight:600, color:"#E5484D", cursor:"pointer" }}>Log Out</div>
      </div>
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

function LQuizBar({ title, left, right }) {
  return (
    <div style={{ background:L.card, borderBottom:`1px solid ${L.line}`, padding:"0 20px", height:54,
      display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200,
      fontFamily:pf }}>
      <div style={{ minWidth:60 }}>{left}</div>
      <span style={{ fontSize:12.5, fontWeight:700, color:L.ink, letterSpacing:"-0.1px", textAlign:"center",
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</span>
      <div style={{ minWidth:60, display:"flex", justifyContent:"flex-end" }}>{right}</div>
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
      fontFamily:pf, letterSpacing:"0.6px", textTransform:"uppercase" }}>
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
function SplashScreen() {
  // Matches the OS-generated PWA launch splash (background_color from
  // manifest.json, icon dead-centered on screen) so the handoff from that
  // native frame to this one doesn't visibly jump or flash a different color.
  // Uses the 512px icon source (not 192px) even though it's displayed small,
  // so it stays crisp on high-density phone screens instead of upscaling a
  // low-res source.
  const box = 216;
  const iconSize = 136;
  const r = 96;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ background: L.bg, minHeight: "100vh", position: "relative", fontFamily: pf }}>
      <div style={{ position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)", width: box, height: box }}>
        {/* Separate wrapper for the fade/scale-in so it doesn't fight with the
            ring's own continuous rotation on the shared transform property. */}
        <div style={{ position: "absolute", inset: 0,
                      animation: "mraSplashIn .45s ease-out .12s both" }}>
          <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}
               style={{ position: "absolute", inset: 0, animation: "mraSpin 1.1s linear infinite" }}>
            <circle cx={box/2} cy={box/2} r={r} fill="none" stroke={L.line} strokeWidth="3"/>
            <circle cx={box/2} cy={box/2} r={r} fill="none" stroke={L.navy} strokeWidth="3"
                    strokeLinecap="round" strokeDasharray={`${c*0.26} ${c}`}/>
          </svg>
        </div>
        <img src="/icon-512.png" alt="Master Review Academy" width={iconSize} height={iconSize}
             style={{ position: "absolute", inset: 0, margin: "auto", borderRadius: 30,
                      display: "block" }}/>
      </div>
      <div style={{ position: "absolute", top: `calc(50% + ${box/2 + 44}px)`, left: "50%",
                    transform: "translateX(-50%)", fontSize: 17, fontWeight: 800, letterSpacing: 2,
                    color: L.navy, textAlign: "center", whiteSpace: "nowrap",
                    animation: "mraSplashIn .45s ease-out .28s both" }}>
        MASTER REVIEW ACADEMY
      </div>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const viewport = useViewport();
  const wide = viewport !== "phone";
  const S = viewport === "desktop" ? 1.5 : viewport === "tablet" ? 1.25 : 1;
  const rs = n => Math.round(n * S);

  const [mode, setMode]   = useState("login"); // login | register
  const [user, setUser]   = useState("");
  const [pass, setPass]   = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr]     = useState("");
  const [ok, setOk]       = useState("");
  const [busy, setBusy]   = useState(false);
  const [welcome] = useState(() => pickMsg("idle"));

  async function ensureAdminCloudAccount() {
    // Sign in with the admin's real credentials so future syncs have a
    // session; on first-ever admin login, provision that cloud account.
    // Explicitly re-signs-in after signUp rather than trusting signUp's own
    // response to carry a session, since that depends on email-confirmation
    // timing we don't want this to be fragile against.
    const first = await signInUser(ADMIN_USER, ADMIN_PASS);
    if (!first.error) return;
    await signUpUser(ADMIN_USER, ADMIN_PASS);
    await signInUser(ADMIN_USER, ADMIN_PASS);
  }

  async function handleLogin() {
    setErr(""); setOk("");
    const username = user.trim();
    if (!username || !pass.trim()) { setErr("Please enter username and password."); return; }

    setBusy(true);
    try {
      if (username === ADMIN_USER && pass === ADMIN_PASS) {
        // Admin must always get in, cloud or no cloud — never let a sync
        // hiccup block the one account that has to work offline too.
        try {
          await ensureAdminCloudAccount();
          await pullCloudProgress(username);
        } catch {}
        onLogin(username, true);
        return;
      }
      const { data, error } = await signInUser(username, pass);
      if (error) { setErr("Incorrect username or password."); return; }
      // Use the account's stored username (not whatever casing was just
      // typed) so the local cache key stays consistent across logins.
      const canonical = data?.user?.user_metadata?.username || username;
      await pullCloudProgress(canonical);
      onLogin(canonical, false);
    } catch {
      setErr("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister() {
    setErr(""); setOk("");
    const username = user.trim();
    if (!username || !pass.trim()) { setErr("All fields are required."); return; }
    if (username === ADMIN_USER) { setErr("That username is reserved."); return; }
    if (pass !== pass2) { setErr("Passwords do not match."); return; }
    if (pass.length < 6) { setErr("Password must be at least 6 characters."); return; }

    setBusy(true);
    try {
      const { error } = await signUpUser(username, pass);
      if (error) {
        setErr(/registered|exists/i.test(error.message) ? "Username already taken." : error.message);
        return;
      }
      setOk("Account created! You can now sign in.");
      setMode("login"); setPass(""); setPass2("");
    } catch {
      setErr("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const inp = {
    width: "100%", background: "#fff", border: `1px solid ${L.line}`, borderRadius: rs(12),
    padding: `${rs(12)}px ${rs(16)}px`, fontSize: rs(13.5), color: L.ink, fontFamily: pf,
    outline: "none", boxSizing: "border-box"
  };

  return (
    <div style={{ background: L.bg, minHeight: "100vh", fontFamily: pf, display: "flex",
      alignItems: "center", justifyContent: "center", padding: rs(20) }}>
      <div style={{ width: "100%", maxWidth: wide ? 440 * S : 380 }}>

        <div className="mra-hover-lift" style={{ background: L.cream, borderRadius: rs(22),
          padding: `${rs(24)}px ${rs(24)}px 0`, display: "flex", alignItems: "flex-end",
          gap: 6, overflow: "hidden", marginBottom: rs(18), minHeight: rs(160) }}>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: rs(20) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <svg width={rs(22)} height={rs(19)} viewBox="0 0 26 22"><path d="M13 0L26 5.5L13 11L0 5.5L13 0Z" fill={L.navy}/><path d="M6 8V14C6 14 9 17 13 17C17 17 20 14 20 14V8L13 11L6 8Z" fill={L.navy}/></svg>
              <span style={{ fontSize: rs(11), fontWeight: 700, letterSpacing: ".4px", color: L.navy, textTransform: "uppercase" }}>Master Review Academy</span>
            </div>
            <h1 style={{ fontSize: rs(19), fontWeight: 700, color: L.ink, lineHeight: 1.28, margin: 0 }}>
              Hi, I'm Professor Maya!
            </h1>
            <p style={{ fontSize: rs(11.5), color: "#8a7f6f", marginTop: 6, lineHeight: 1.5 }}>{welcome}</p>
          </div>
          <div style={{ flex: "none", marginRight: rs(-6) }}>
            <Mascot pose="idle" size={rs(120)}/>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: rs(22), padding: rs(24),
          border: `1px solid ${L.line}`, boxShadow: "0 3px 14px -6px rgba(14,35,72,.12)" }}>
          <div style={{ display: "flex", background: L.bg, borderRadius: rs(11), padding: 4, marginBottom: rs(20), gap: 4 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); setOk(""); }} disabled={busy}
                style={{ flex: 1, background: mode === m ? L.navy : "none", color: mode === m ? "#fff" : L.muted,
                  border: "none", borderRadius: rs(8), padding: rs(9), fontSize: rs(12.5), fontWeight: 600,
                  cursor: busy ? "default" : "pointer", fontFamily: pf, transition: "all .2s" }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: rs(12) }}>
            <div>
              <label style={{ fontSize: rs(10.5), color: L.muted, letterSpacing: ".4px", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Username</label>
              <input value={user} onChange={e => setUser(e.target.value)} placeholder="Enter username" disabled={busy}
                style={inp} onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : null)} />
            </div>
            <div>
              <label style={{ fontSize: rs(10.5), color: L.muted, letterSpacing: ".4px", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password" disabled={busy}
                style={inp} onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : null)} />
            </div>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: rs(10.5), color: L.muted, letterSpacing: ".4px", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Confirm Password</label>
                <input type="password" value={pass2} onChange={e => setPass2(e.target.value)} placeholder="Confirm password" disabled={busy}
                  style={inp} onKeyDown={e => e.key === "Enter" && handleRegister()} />
              </div>
            )}

            {err && <div style={{ background: "#FBEAE8", border: "1px solid #F1B3AC", borderRadius: rs(10), padding: `${rs(10)}px ${rs(14)}px`, fontSize: rs(12), color: "#B3392E" }}>{err}</div>}
            {ok  && <div style={{ background: L.greenTint, border: `1px solid ${L.green}55`, borderRadius: rs(10), padding: `${rs(10)}px ${rs(14)}px`, fontSize: rs(12), color: L.green }}>{ok}</div>}

            <div onClick={busy ? undefined : (mode === "login" ? handleLogin : handleRegister)} className="mra-hover-btn"
              style={{ width: "100%", marginTop: 4, padding: rs(13), textAlign: "center", background: busy ? L.muted : L.navy,
                color: "#fff", borderRadius: 999, fontSize: rs(13.5), fontWeight: 700, cursor: busy ? "default" : "pointer",
                boxSizing: "border-box" }}>
              {busy ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account"}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: rs(16), fontSize: rs(11), color: L.muted }}>
          Your progress syncs automatically to every device you sign in on.
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
  const [users, setUsers] = useState({});
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: profiles }, { data: progress }] = await Promise.all([
        supabase.from("profiles").select("id, username, created_at").order("created_at"),
        supabase.from("quiz_progress").select("user_id, quiz_id, score, total, correct"),
      ]);
      const usernameById = {};
      const u = {};
      (profiles || []).forEach(p => { usernameById[p.id] = p.username; u[p.username] = { createdAt: p.created_at }; });
      const s = {};
      (progress || []).forEach(r => {
        const username = usernameById[r.user_id];
        if (username) s[`${username}|${r.quiz_id}`] = { score: r.score, total: r.total, correct: r.correct };
      });
      setUsers(u); setScores(s); setLoading(false);
    })();
  }, []);

  function getUserScore(username, quizId) { return scores[`${username}|${quizId}`] || null; }

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
        <div style={{ marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
            style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:10, padding:"10px 16px",
              fontSize:13, color:TXT, fontFamily:sf, outline:"none", width:280, boxSizing:"border-box" }} />
          {loading && <span style={{ fontSize:12, color:TXT2 }}>Loading from the cloud…</span>}
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
  const progressKey = `progress_${quizId}`;
  const saved = storage.get(progressKey);
  const validSaved = !!(saved && Array.isArray(saved.questions) && saved.questions.length === rawQuestions.length && saved.idx < saved.questions.length);

  const [questions, setQuestions] = useState(() => validSaved ? saved.questions : buildOrder(rawQuestions));
  const [idx,   setIdx]   = useState(() => validSaved ? saved.idx : 0);
  const [sel,   setSel]   = useState(null);
  const [shown, setShown] = useState(false);
  const [correct,setCorrect] = useState(() => validSaved ? saved.correct : 0);
  const [wrong,  setWrong]   = useState(() => validSaved ? saved.wrong : 0);
  const [missed, setMissed]  = useState(() => validSaved ? saved.missed : []);
  const [phase,  setPhase]   = useState("quiz");
  const [ckpt,   setCkpt]    = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const ref = useRef(null);

  const total    = questions.length;
  const q        = questions[idx];
  const answered = correct + wrong;
  const acc      = answered > 0 ? Math.round(correct / answered * 100) : 0;
  const prog     = Math.round(idx / total * 100);
  const every    = total >= 150 ? 50 : total >= 100 ? 25 : 20;
  const order    = useMemo(() => questions.map(qq => rawQuestions.indexOf(qq)), [questions]); // eslint-disable-line
  // Gates cloud pushes until the initial cloud-progress check below has run,
  // so a fresh-mount push can never race ahead of it and clobber further
  // progress that was made on another device.
  const [cloudChecked, setCloudChecked] = useState(!username);

  // Save progress after every answered question so exiting mid-quiz resumes
  // where you left off instead of restarting at Question 1 — locally and,
  // for a signed-in user, on any device they next open this same quiz on.
  useEffect(() => {
    storage.set(progressKey, { questions, idx, correct, wrong, missed });
    if (username && cloudChecked) pushQuizSession(quizId, order, idx, correct, wrong, missed).catch(() => {});
  }, [idx, correct, wrong, missed, cloudChecked]); // eslint-disable-line

  // On open, check whether another device got further into this exact quiz
  // attempt than this one has locally, and if so pick up from there.
  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const cloud = await pullQuizSession(quizId);
        if (!cloud || !Array.isArray(cloud.order_indices) || cloud.order_indices.length !== rawQuestions.length) return;
        const localIdx = validSaved ? saved.idx : -1;
        if (cloud.idx <= localIdx) return;
        const cloudQuestions = cloud.order_indices.map(i => rawQuestions[i]);
        if (cloudQuestions.some(qq => !qq)) return;
        setQuestions(cloudQuestions);
        setIdx(cloud.idx);
        setCorrect(cloud.correct);
        setWrong(cloud.wrong);
        setMissed(cloud.missed || []);
      } finally {
        setCloudChecked(true);
      }
    })();
  }, []); // eslint-disable-line

  function submit() {
    if (!sel || shown) return;
    const ok = sel === getA(q);
    if (ok) setCorrect(c => c + 1);
    else { setWrong(c => c + 1); setMissed(m => [...m, { ...q, ya: sel }]); }
    setFeedbackMsg(pickMsg(ok ? "happy" : "oops"));
    setShown(true);
    bumpDailyAnswered(storage);
  }

  function next() {
    const ni = idx + 1;
    if (ni >= total) {
      const fc = correct + (sel === getA(q) ? 1 : 0);
      const score = Math.round(fc / total * 100);
      storage.set(`quiz_${quizId}`, { score, correct: fc, total, date: new Date().toISOString() });
      storage.set(progressKey, null);
      if (username) deleteQuizSession(quizId).catch(() => {});
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

  // Briefly block on the cloud-progress check when the quiz first opens, so
  // a resumed question replaces this screen instead of flashing in after —
  // easy to miss and easy to mistake for sync not having worked at all.
  if (!cloudChecked && phase === "quiz" && idx === 0 && correct === 0 && wrong === 0) return (
    <div style={{ background:L.bg, minHeight:"100vh", fontFamily:pf, color:L.ink,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
      <Mascot pose="idle" size={100}/>
      <div style={{ fontSize:13, color:L.muted }}>Checking for progress on other devices…</div>
    </div>
  );

  // Checkpoint
  if (phase === "checkpoint" && ckpt) return (
    <div style={{ background:L.bg, minHeight:"100vh", fontFamily:pf, color:L.ink }}>
      <LQuizBar title="Checkpoint" right={<span onClick={()=>{setPhase("quiz");advance(ckpt.ni);}} style={{ color:L.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>Continue →</span>} />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"32px 20px" }}>
        <div style={{ fontSize:11, color:accentColor, letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>
          Progress Report · Q{ckpt.ni} of {total}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:24 }}>
          <MascotBubble tailSide="bottom">{ckpt.acc >= 70 ? "You're doing great — keep it up!" : "Stay focused, you've got this!"}</MascotBubble>
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <Mascot pose={ckpt.acc >= 70 ? "happy" : "idle"} size={140}/>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
          {[{l:"Correct",v:ckpt.correct,c:L.green},{l:"Wrong",v:ckpt.wrong,c:"#E5484D"},{l:"Accuracy",v:ckpt.acc+"%",c:accentColor},{l:"Left",v:total-ckpt.ni,c:L.muted}].map(s=>(
            <div key={s.l} style={{ background:L.card, borderRadius:12, padding:"14px 10px", textAlign:"center", border:`1px solid ${L.line}` }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.c, letterSpacing:"-1px" }}>{s.v}</div>
              <div style={{ fontSize:10, color:L.muted, marginTop:3, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div onClick={()=>{setPhase("quiz");advance(ckpt.ni);}} style={{ width:"100%", background:accentColor, color:"#fff",
          textAlign:"center", borderRadius:13, padding:"13px", fontSize:13, fontWeight:700, cursor:"pointer", boxSizing:"border-box" }}>
          Continue — Question {ckpt.ni + 1}
        </div>
      </div>
    </div>
  );

  // Results
  if (phase === "results") {
    const finalScore = Math.round(correct / total * 100);
    const gr = getRating(finalScore);
    return (
      <div style={{ background:L.bg, minHeight:"100vh", fontFamily:pf, color:L.ink }}>
        <LQuizBar title="Results" right={<span onClick={onExit} style={{ color:L.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>← Library</span>} />
        <div style={{ maxWidth:740, margin:"0 auto", padding:"28px 20px" }}>
          <div style={{ background:gr.bg, borderRadius:20, padding:"22px 20px", border:`1px solid ${gr.bdr}`, marginBottom:20,
            display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontSize:11, color:gr.c, letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Final Score</div>
              <div style={{ fontSize:48, fontWeight:900, color:gr.c, letterSpacing:"-3px", lineHeight:1 }}>{finalScore}%</div>
              <div style={{ fontSize:16, fontWeight:700, color:gr.c, marginTop:6 }}>{gr.l}</div>
              <div style={{ fontSize:11, color:L.muted, marginTop:6 }}>{correct} correct · {wrong} incorrect · {total} total questions</div>
            </div>
            <Mascot pose={finalScore >= 80 ? "happy" : finalScore >= 50 ? "idle" : "oops"} size={132}/>
          </div>

          {/* Diff breakdown */}
          <div style={{ background:L.card, borderRadius:14, padding:18, border:`1px solid ${L.line}`, marginBottom:16 }}>
            <div style={{ fontSize:10, color:L.muted, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>By Difficulty</div>
            {["easy","moderate","difficult"].map(d => {
              const dq = rawQuestions.filter(q=>(q.d||q.diff)===d);
              const dm = missed.filter(q=>(q.d||q.diff)===d);
              const dp = dq.length ? Math.round((dq.length-dm.length)/dq.length*100) : 0;
              return (
                <div key={d} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:DIFF[d].text, fontWeight:600, textTransform:"capitalize" }}>{d}</span>
                    <span style={{ fontSize:11, color:L.muted }}>{dq.length-dm.length}/{dq.length} · {dp}%</span>
                  </div>
                  <div style={{ height:4, borderRadius:2, background:L.line, overflow:"hidden" }}><div style={{ height:"100%", width:`${dp}%`, background:DIFF[d].ring, borderRadius:2 }}/></div>
                </div>
              );
            })}
          </div>

          {weakTopics.length > 0 && (
            <div style={{ background:L.card, borderRadius:14, padding:18, border:`1px solid ${L.line}`, marginBottom:16 }}>
              <div style={{ fontSize:10, color:L.muted, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:10 }}>Topics to Review</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {weakTopics.map(t=><span key={t} style={{ background:L.bg, border:`1px solid ${L.line}`, color:L.ink, padding:"3px 10px", borderRadius:99, fontSize:11 }}>{t}</span>)}
              </div>
            </div>
          )}

          {missed.length > 0 && (
            <div style={{ background:L.card, borderRadius:14, padding:18, border:`1px solid ${L.line}`, marginBottom:20 }}>
              <div style={{ fontSize:10, color:L.muted, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
                Review Guide · {missed.length} missed
              </div>
              {missed.map((w,i)=>(
                <div key={i} style={{ background:L.bg, borderRadius:10, padding:12, marginBottom:8, borderLeft:`3px solid ${DIFF[getD(w)]?.ring||L.blue}` }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                    <DiffTag diff={getD(w)}/>
                    <span style={{ fontSize:11, color:L.muted }}>{getT(w)}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:L.ink, marginBottom:6, lineHeight:1.5 }}>{getQ(w)}</div>
                  <div style={{ fontSize:12, color:"#E5484D", marginBottom:3 }}>✗ {w.ya} · {getC(w).find(x=>x.startsWith(w.ya))?.slice(3)}</div>
                  <div style={{ fontSize:12, color:L.green, marginBottom:4 }}>✓ {getA(w)} · {getC(w).find(x=>x.startsWith(getA(w)))?.slice(3)}</div>
                  <div style={{ fontSize:12, color:L.muted, lineHeight:1.6 }}>{getE(w)}</div>
                </div>
              ))}
            </div>
          )}

          <div onClick={onExit} style={{ width:"100%", background:accentColor, color:"#fff", textAlign:"center",
            borderRadius:13, padding:"13px", fontSize:13, fontWeight:700, cursor:"pointer", boxSizing:"border-box" }}>Back to Library</div>
        </div>
      </div>
    );
  }

  // Quiz
  return (
    <div style={{ background:L.bg, minHeight:"100vh", fontFamily:pf, color:L.ink }}>
      <LQuizBar title={title.length > 30 ? title.slice(0,30)+"…" : title}
        left={<span onClick={onExit} style={{ color:L.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>← Exit</span>}
        right={
          <div style={{ display:"flex", gap:14 }}>
            {[{v:correct,c:L.green,l:"✓"},{v:wrong,c:"#E5484D",l:"✗"},{v:acc+"%",c:L.ink,l:"Acc"}].map(s=>(
              <div key={s.l} style={{ textAlign:"right" }}>
                <div style={{ fontSize:14, fontWeight:800, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:9, color:L.muted, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        }
      />
      <div style={{ maxWidth:700, margin:"0 auto", padding:"24px 20px" }} ref={ref}>
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:L.muted }}>Question {idx+1} of {total}</span>
            <span style={{ fontSize:12, color:L.muted }}>{prog}%</span>
          </div>
          <div style={{ height:3, borderRadius:2, background:L.line, overflow:"hidden" }}><div style={{ height:"100%", width:`${prog}%`, background:accentColor, borderRadius:2 }}/></div>
        </div>
        <div style={{ background:L.card, borderRadius:18, border:`1px solid ${L.line}`, overflow:"hidden", boxShadow:"0 3px 10px -4px rgba(14,35,72,.10)" }}>
          <div style={{ height:3, background:accentColor }}/>
          <div style={{ padding:"22px 22px 0" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
              <DiffTag diff={getD(q)}/>
              <span style={{ fontSize:11, color:L.muted }}>{getT(q)}</span>
            </div>
            <div style={{ fontSize:16, fontWeight:500, color:L.ink, lineHeight:1.65, marginBottom:20, letterSpacing:"-0.1px" }}>
              {getQ(q)}
            </div>
          </div>
          <div style={{ padding:"0 22px 22px" }}>
            {getC(q).map(ch => {
              const l = ch[0];
              let bg=L.bg,bdr=L.line,col=L.ink,fw=400;
              if (shown) {
                if (l===getA(q)) { bg="#EAF7EE"; bdr="#1EA457"; col="#177A42"; fw=600; }
                else if (l===sel&&l!==getA(q)) { bg="#FDECEC"; bdr="#E5484D"; col="#C22A2F"; }
              } else if (l===sel) { bg=`${accentColor}18`; bdr=accentColor; col=accentColor; fw=500; }
              return (
                <button key={l} onClick={()=>!shown&&setSel(l)}
                  style={{ display:"block", width:"100%", padding:"12px 14px", marginBottom:7, borderRadius:11,
                    border:`1.5px solid ${bdr}`, background:bg, color:col, cursor:shown?"default":"pointer",
                    textAlign:"left", fontSize:13, fontFamily:pf, fontWeight:fw, lineHeight:1.5,
                    transition:"all .12s", boxSizing:"border-box" }}>
                  {ch}{shown&&l===getA(q)?" ✓":""}{shown&&l===sel&&l!==getA(q)?" ✗":""}
                </button>
              );
            })}
            {!shown ? (
              <button onClick={submit} disabled={!sel}
                style={{ width:"100%", background:sel?accentColor:L.line, color:sel?"#fff":L.muted, border:"none",
                  borderRadius:11, padding:"13px", fontSize:13, fontWeight:700, cursor:sel?"pointer":"not-allowed",
                  fontFamily:pf, transition:"all .2s", marginTop:4 }}>
                Submit Answer
              </button>
            ) : (
              <>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:6, marginBottom:8 }}>
                  <MascotBubble tailSide="bottom">
                    <div style={{ fontSize:10.5, fontWeight:600, marginBottom:4, color:L.muted }}>{feedbackMsg}</div>
                    <div style={{ fontWeight:700, marginBottom:4, color:ok?"#177A42":"#C22A2F" }}>{ok?"Correct.":"Incorrect. Answer: "+getA(q)}</div>
                    <div style={{ color:L.ink }}>{getE(q)}</div>
                  </MascotBubble>
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <Mascot pose={ok ? "happy" : "oops"} size={158}/>
                  </div>
                </div>
                <button onClick={next}
                  style={{ width:"100%", background:L.navy, color:"#fff", border:"none", borderRadius:11,
                    padding:"13px", fontSize:13, fontWeight:600, cursor:"pointer", marginTop:8, fontFamily:pf }}>
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
  const [homeMsg] = useState(() => pickMsg("idle"));
  const viewport = useViewport();
  const S = viewport === "desktop" ? 1.9 : viewport === "tablet" ? 1.5 : 1;
  const rs = n => Math.round(n * S);

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
  const [syncNonce, setSyncNonce] = useState(0);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { if (user) setStreak(bumpStreak(storage)); }, [user]);

  // Re-reconcile with the cloud whenever the app opens with an already
  // signed-in session (not just on a fresh login), so a device that was
  // logged in before this sync system existed - or before a merge with
  // another device happened - still catches up without a manual re-login.
  // syncNonce forces a re-render afterward since local storage reads here
  // aren't otherwise reactive.
  useEffect(() => {
    if (!user) return;
    pullCloudProgress(user).then(() => setSyncNonce(n => n + 1)).catch(() => {});
  }, [user]); // eslint-disable-line

  function handleLogin(username, admin) {
    setUser(username); setIsAdmin(admin); setView(admin ? "dashboard" : "home");
  }
  function handleLogout() {
    setUser(null); setIsAdmin(false); setView("home"); setActiveQ(null);
    localStorage.removeItem("mra_session");
    supabase.auth.signOut().catch(() => {});
  }

  function getData(id) { return storage.get(`quiz_${id}`); }

  const totalMastery = () => {
    const scores = QUIZ_REGISTRY.map(q => getData(q.id)?.score || 0);
    return Math.round(scores.reduce((a,b)=>a+b,0) / QUIZ_REGISTRY.length);
  };

  if (booting) return <SplashScreen/>;

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

  const shell = (active, content) => {
    const nav = v => setView(v === "master" ? "master" : v);

    if (viewport === "desktop") return (
      <div style={{ background:L.bg, minHeight:"100vh", display:"flex", fontFamily:pf }}>
        <Sidebar active={active} onNav={nav} user={user} isAdmin={isAdmin}
          onAdmin={()=>setView("admin")} onLogout={handleLogout} streak={streak} mastery={totalMastery()}/>
        <div style={{ flex:1, minHeight:"100vh", display:"flex", justifyContent:"center" }}>
          <div style={{ width:"100%", maxWidth:900, display:"flex", flexDirection:"column" }}>
            <div style={{ height:60, padding:"0 8px 0 28px", display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
              <svg width="20" height="22" viewBox="0 0 20 22"><path d="M10 0C7.79 0 6 1.79 6 4V4.6C3.6 5.7 2 8.1 2 11V15L0 18H20L18 15V11C18 8.1 16.4 5.7 14 4.6V4C14 1.79 12.21 0 10 0Z" fill={L.ink}/><path d="M7 19C7 20.66 8.34 22 10 22C11.66 22 13 20.66 13 19H7Z" fill={L.ink}/></svg>
            </div>
            {content}
          </div>
        </div>
      </div>
    );

    const contentMaxWidth = viewport === "tablet" ? 720 : 480;
    return (
      <div style={{ background:L.bg, minHeight:"100vh", display:"flex", justifyContent:"center", fontFamily:pf }}>
        <div style={{ width:"100%", maxWidth:contentMaxWidth, minHeight:"100vh", display:"flex", flexDirection:"column", background:L.bg }}>
          <LHeader user={user} onMenu={()=>setMenuOpen(true)} onBell={()=>{}}/>
          {content}
          <BottomNav active={active} onNav={nav}/>
        </div>
        {menuOpen && <LMenu user={user} isAdmin={isAdmin} onClose={()=>setMenuOpen(false)}
          onNav={v=>{setMenuOpen(false); nav(v);}}
          onAdmin={()=>{setMenuOpen(false); setView("admin");}}
          onLogout={()=>{setMenuOpen(false); handleLogout();}}/>}
      </div>
    );
  };

  const SubjRing = ({ pct, color, tint, scale = 1 }) => (
    <div style={{ width:Math.round(52*scale), height:Math.round(52*scale), borderRadius:"50%", margin:`${Math.round(8*scale)}px auto ${Math.round(6*scale)}px`, display:"flex", alignItems:"center",
      justifyContent:"center", position:"relative",
      background:`conic-gradient(${color} 0deg ${Math.min(pct,100)*3.6}deg, ${tint} ${Math.min(pct,100)*3.6}deg 360deg)` }}>
      <div style={{ position:"absolute", inset:Math.round(5*scale), borderRadius:"50%", background:L.bg }}/>
      <div style={{ position:"relative", fontSize:Math.round(12.5*scale*10)/10, fontWeight:700, color:L.ink }}>{pct}%</div>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────
  if (view === "home") {
    const wide = viewport !== "phone";

    const greeting = (
      <div className="mra-hover-lift" style={{ padding: `${rs(20)}px 0 0 ${rs(20)}px`, background:L.cream, borderRadius:rs(22),
        minHeight: rs(230), display:"flex", alignItems:"flex-end", gap:2, overflow:"hidden", position:"relative" }}>
        <div style={{ flex:1, minWidth:0, maxWidth: wide ? "58%" : "50%", paddingBottom: rs(22) }}>
          <h1 style={{ fontSize: rs(19), fontWeight:600, color:L.ink, lineHeight:1.28 }}>Good {new Date().getHours()<12?"morning":new Date().getHours()<18?"afternoon":"evening"},<br/>{user}!</h1>
          <p style={{ fontSize: rs(11), color:"#8a7f6f", marginTop:rs(10), lineHeight:1.5 }}>{homeMsg}</p>
          <div onClick={()=>setView("library")} className="mra-hover-btn" style={{ display:"inline-block", marginTop: rs(12), background:L.navy, color:"#fff",
            fontSize: rs(10.5), fontWeight:600, padding: `${rs(8)}px ${rs(15)}px`, borderRadius:999, cursor:"pointer", whiteSpace:"nowrap" }}>Let's Review →</div>
        </div>
        <div style={{ flex:"none", marginBottom:-6, marginRight: rs(-8) }}>
          <Mascot pose="idle" size={rs(205)}/>
        </div>
      </div>
    );

    const progressCard = (
      <div className="mra-hover-lift" style={{ background:L.navy, borderRadius:rs(22), padding: rs(20), color:"#fff" }}>
        <div style={{ fontSize: rs(14.5), fontWeight:600, marginBottom: rs(16) }}>Overall Progress</div>
        <div style={{ display:"flex", alignItems:"center", gap: rs(18) }}>
          <div style={{ width: rs(112), height: rs(112), borderRadius:"50%", flex:"none",
            background:`conic-gradient(${L.gold} 0deg ${totalMastery()*3.6}deg, rgba(255,255,255,.14) ${totalMastery()*3.6}deg 360deg)`,
            display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", inset: rs(12), borderRadius:"50%", background:L.navy }}/>
            <div style={{ position:"relative", textAlign:"center" }}>
              <div style={{ fontSize: rs(22), fontWeight:700 }}>{totalMastery()}%</div>
              <div style={{ fontSize: rs(9), color:"#c9d2e2", marginTop:1 }}>Mastery</div>
            </div>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection: wide ? "row" : "column", gap: wide ? rs(20) : rs(9), minWidth:0 }}>
            <div style={{flex: wide?1:"none", minWidth:0}}><div style={{ fontSize: rs(10), color:"#a9b4c9" }}>Correct Answer</div><div style={{ fontSize: rs(15), fontWeight:600, marginTop:1 }}>{correctAnswers.toLocaleString()}</div></div>
            <div style={{flex: wide?1:"none", minWidth:0}}><div style={{ fontSize: rs(10), color:"#a9b4c9" }}>Questions Answered</div><div style={{ fontSize: rs(15), fontWeight:600, marginTop:1 }}>{questionsAnswered.toLocaleString()}</div></div>
            <div style={{flex: wide?1:"none", minWidth:0}}><div style={{ fontSize: rs(10), color:"#a9b4c9" }}>Remaining</div><div style={{ fontSize: rs(15), fontWeight:600, marginTop:1 }}>{remainingQuestions.toLocaleString()}</div></div>
          </div>
        </div>
      </div>
    );

    const subjCards = (
      <div style={{ display:"flex", gap: rs(8) }}>
        <div onClick={()=>{setFilterS("all-prof");setView("library");}} className="mra-hover-lift" style={{ flex:1, minWidth:0, borderRadius:rs(16), padding: `${rs(12)}px ${rs(6)}px ${rs(10)}px`,
          textAlign:"center", background:L.greenTint, cursor:"pointer" }}>
          <CategoryIcon type="prof" color={L.green} size={rs(22)}/>
          <div style={{ fontSize: rs(10.5), fontWeight:600, color:L.ink, marginTop: rs(6) }}>Professional Education</div>
          <SubjRing pct={avgOf(profSubset)} color={L.green} tint="#d7ead9" scale={S}/>
          <div style={{ fontSize: rs(8.5), color:L.muted, marginTop:2 }}>{profSubset.length} quizzes</div>
        </div>
        <div onClick={()=>{setFilterS("all-gened");setView("library");}} className="mra-hover-lift" style={{ flex:1, minWidth:0, borderRadius:rs(16), padding: `${rs(12)}px ${rs(6)}px ${rs(10)}px`,
          textAlign:"center", background:L.purpleTint, cursor:"pointer" }}>
          <CategoryIcon type="gened" color={L.purple} size={rs(22)}/>
          <div style={{ fontSize: rs(10.5), fontWeight:600, color:L.ink, marginTop: rs(6) }}>General Education</div>
          <SubjRing pct={avgOf(genSubset)} color={L.purple} tint="#e6d3f2" scale={S}/>
          <div style={{ fontSize: rs(8.5), color:L.muted, marginTop:2 }}>{genSubset.length} quizzes</div>
        </div>
      </div>
    );

    const continueCard = (
      <div className="mra-hover-lift" style={{ background:L.card, borderRadius:rs(22), boxShadow:"0 3px 10px -4px rgba(14,35,72,.10)", border:`1px solid ${L.line}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding: `${rs(14)}px ${rs(18)}px 0` }}>
          <div style={{ fontSize: rs(13.5), fontWeight:600, color:L.ink }}>Continue Studying</div>
          <div onClick={()=>setView("library")} style={{ fontSize: rs(10.5), fontWeight:600, color:L.blue, cursor:"pointer" }}>View All</div>
        </div>
        {mostRecent ? (
          <div style={{ display:"flex", alignItems:"center", gap: rs(12), padding: `${rs(12)}px ${rs(18)}px ${rs(16)}px` }}>
            <div style={{ width: rs(52), height: rs(52), borderRadius:rs(12), background:`${mostRecent.q.color}22`, flex:"none",
              display:"flex", alignItems:"center", justifyContent:"center" }}><SubjIcon subjId={mostRecent.q.subjId} color={mostRecent.q.color} size={rs(24)}/></div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize: rs(9), color:L.muted }}>{mostRecent.q.category==="gened"?"General Education":"Professional Education"}</div>
              <div style={{ fontSize: rs(13), fontWeight:700, color:L.ink, margin:"2px 0 6px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mostRecent.q.title.split("—")[0].trim()}</div>
              <div style={{ height:rs(5), borderRadius:3, background:L.line, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${mostRecent.data.score}%`, background:mostRecent.q.color, borderRadius:3 }}/>
              </div>
              <div style={{ fontSize: rs(9), color:L.muted, marginTop:4 }}>Last session: {mostRecent.data.score}%</div>
            </div>
            <div onClick={()=>setActiveQ(mostRecent.q.id)} className="mra-hover-btn" style={{ flex:"none", background:L.navy, color:"#fff", fontSize: rs(10.5),
              fontWeight:600, padding: `${rs(8)}px ${rs(14)}px`, borderRadius:999, cursor:"pointer" }}>Continue</div>
          </div>
        ) : (
          <div style={{ padding: `${rs(12)}px ${rs(18)}px ${rs(18)}px` }}>
            <div style={{ fontSize: rs(12), color:L.muted, marginBottom:10 }}>You haven't started a quiz yet.</div>
            <div onClick={()=>setView("library")} className="mra-hover-btn" style={{ background:L.navy, color:"#fff", fontSize: rs(11), fontWeight:600,
              padding: `${rs(9)}px ${rs(16)}px`, borderRadius:999, display:"inline-block", cursor:"pointer" }}>Browse Library</div>
          </div>
        )}
      </div>
    );

    const goalCard = (
      <div className="mra-hover-lift" style={{ background:L.card, borderRadius:rs(22), boxShadow:"0 3px 10px -4px rgba(14,35,72,.10)", border:`1px solid ${L.line}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding: `${rs(14)}px ${rs(18)}px 0` }}>
          <div style={{ fontSize: rs(13.5), fontWeight:600, color:L.ink }}>Today's Goal</div>
        </div>
        <div style={{ padding: `${rs(10)}px ${rs(18)}px ${rs(16)}px` }}>
          <div style={{ fontSize: rs(12.5), fontWeight:600, color:L.ink, marginBottom:9 }}>Answer {DAILY_GOAL} questions</div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1, height: rs(8), borderRadius:4, background:L.line, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min(100,dailyAnswered/DAILY_GOAL*100)}%`, background:L.blue, borderRadius:4 }}/>
            </div>
            <div style={{ fontSize: rs(11), fontWeight:600, color:L.ink }}>{Math.min(dailyAnswered,DAILY_GOAL)} / {DAILY_GOAL}</div>
            <TrophyIcon color={L.gold} size={rs(17)}/>
          </div>
        </div>
      </div>
    );

    const m = `${rs(15)}px ${rs(20)}px 0`;
    return shell("home", (
      <>
        <div style={{ margin: `0 ${rs(20)}px` }}>{greeting}</div>
        <div style={{ margin:m }}>{progressCard}</div>
        <div style={{ margin:m }}>{subjCards}</div>
        <div style={{ margin:m }}>{continueCard}</div>
        <div style={{ margin:m }}>{goalCard}</div>
        <div style={{ height: rs(15) }}/>
      </>
    ));
  }

  // ── LIBRARY ───────────────────────────────────────────────────
  if (view === "library") {
    const wide = viewport !== "phone";
    return shell("library", (
    <>
      <div style={{ padding: `${rs(6)}px ${rs(20)}px ${rs(4)}px` }}>
        <h1 style={{ fontSize: rs(20), fontWeight:700, color:L.ink }}>Library</h1>
        <p style={{ fontSize: rs(11), color:L.muted, marginTop:3 }}>Browse every subject and jump back into studying</p>
      </div>

      <MascotStrip message="Found something new to learn today?" scale={S}/>

      <div style={{ margin: `${rs(15)}px ${rs(20)}px 0` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:`1px solid ${L.line}`,
          borderRadius:999, padding: `${rs(11)}px ${rs(16)}px` }}>
          <svg width={rs(15)} height={rs(15)} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={L.muted} strokeWidth="2"/><path d="M21 21l-4-4" stroke={L.muted} strokeWidth="2" strokeLinecap="round"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subjects, topics..."
            style={{ border:"none", outline:"none", fontSize: rs(11.5), color:L.ink, fontFamily:pf, flex:1, background:"transparent" }}/>
        </div>
      </div>

      <div style={{ margin: `${rs(12)}px ${rs(20)}px 0`, display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
        {[{id:"all",label:"All"},{id:"all-prof",label:"Professional Ed"},{id:"all-gened",label:"General Ed"}].map(f=>(
          <div key={f.id} onClick={()=>setFilterS(f.id)} className="mra-hover-btn" style={{ flex:"none", padding: `${rs(7)}px ${rs(14)}px`, borderRadius:999, fontSize: rs(10.5),
            fontWeight:600, whiteSpace:"nowrap", cursor:"pointer",
            background: filterS===f.id ? L.navy : "#fff", color: filterS===f.id ? "#fff" : L.muted,
            border: filterS===f.id ? "none" : `1px solid ${L.line}` }}>{f.label}</div>
        ))}
      </div>

      <div style={{ margin: `${rs(12)}px ${rs(20)}px 0` }}>
        <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}} className="mra-hover-lift"
          style={{ background:L.navy, borderRadius:rs(16), padding: `${rs(14)}px ${rs(16)}px`, cursor:"pointer", color:"#fff",
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div>
            <div style={{ fontSize: rs(9), color:L.gold, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>Comprehensive Exam</div>
            <div style={{ fontSize: rs(13), fontWeight:700 }}>Master Board Exam — 350Q</div>
            {getData("master") && <div style={{ fontSize: rs(10), color:"#c9d2e2", marginTop:3 }}>Last: {getData("master").score}%</div>}
          </div>
          <div style={{ fontSize: rs(10.5), fontWeight:700, color:L.navy, background:L.gold, padding: `${rs(8)}px ${rs(12)}px`, borderRadius:999, flex:"none" }}>Start →</div>
        </div>
      </div>

      <div style={{ margin: `${rs(15)}px ${rs(20)}px 0` }}>
        <div style={{ background:L.card, borderRadius:rs(22), boxShadow:"0 3px 10px -4px rgba(14,35,72,.10)",
          border:`1px solid ${L.line}`, overflow:"hidden" }}>
          {filtered.length===0 && <div style={{ padding:24, textAlign:"center", fontSize:12, color:L.muted }}>No quizzes match your search.</div>}
          {filtered.map((quiz,i) => {
            const data = getData(quiz.id);
            const tint = data ? `${quiz.color}22` : L.bg;
            return (
              <div key={quiz.id} onClick={()=>setActiveQ(quiz.id)} style={{ display:"flex", alignItems:"center", gap: rs(12), padding: rs(14), cursor:"pointer",
                borderTop: i>0 ? `1px solid ${L.line}` : "none" }}>
                <div style={{ width: rs(42), height: rs(42), borderRadius:12, flex:"none", background:tint,
                  display:"flex", alignItems:"center", justifyContent:"center" }}><SubjIcon subjId={quiz.subjId} color={quiz.color} size={rs(20)}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize: rs(12.5), fontWeight:600, color:L.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {quiz.title.split("—")[0].trim()}
                  </div>
                  <div style={{ fontSize: rs(9.5), color:L.muted, marginTop:3 }}>{quiz.questions.length} items · {quiz.category==="gened"?"General Education":"Professional Education"}</div>
                  <div style={{ height:4, borderRadius:2, background:L.line, marginTop:6, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${data?.score||0}%`, borderRadius:2, background:quiz.color }}/>
                  </div>
                </div>
                <div style={{ fontSize: rs(12), fontWeight:700, color: data?quiz.color:L.muted, flex:"none" }}>{data ? `${data.score}%` : "—"}</div>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flex:"none" }}><path d="M1 1l5 5-5 5" stroke={L.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height: rs(15) }}/>
    </>
  ));
  }

  // ── DASHBOARD ─────────────────────────────────────────────────
  if (view === "dashboard") {
    const wide = viewport !== "phone";
    return shell("dashboard", (
    <>
      <div style={{ padding: `${rs(6)}px ${rs(20)}px ${rs(4)}px` }}>
        <h1 style={{ fontSize: rs(20), fontWeight:700, color:L.ink }}>Dashboard</h1>
        <p style={{ fontSize: rs(11), color:L.muted, marginTop:3 }}>Your performance at a glance</p>
      </div>

      <MascotStrip message="Let's see how far you've come!" scale={S}/>

      <div style={{ margin: `${rs(15)}px ${rs(20)}px 0`, display:"grid",
        gridTemplateColumns:"1fr 1fr", gap: rs(10) }}>
        {[
          { v:questionsAnswered.toLocaleString(), l:"Questions Answered", icon:<svg width={rs(26)} height={rs(26)} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={L.blue} strokeWidth="1.6"/><path d="M12 7v5l4 2" stroke={L.blue} strokeWidth="1.6" strokeLinecap="round"/></svg> },
          { v:totalMastery()+"%", l:"Overall Mastery", icon:<svg width={rs(26)} height={rs(26)} viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" stroke={L.green} strokeWidth="1.4" strokeLinejoin="round"/></svg> },
          { v:streak+" Day"+(streak===1?"":"s"), l:"Current Streak", icon:<svg width={rs(26)} height={rs(26)} viewBox="0 0 24 24" fill="none"><path d="M12 2c3 4-2 5-2 9a4 4 0 108 0c0-1.5-.6-2.3-1.2-3.1.4 2-1 3-1.8 2C16 8 15 5 12 2z" fill={L.orange}/></svg> },
          { v:`${completedCount}/${QUIZ_REGISTRY.length}`, l:"Quizzes Completed", icon:<svg width={rs(26)} height={rs(26)} viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 6.5.9-4.7 4.6L18 20l-6-3.4L6 20l1.2-6.5L2.5 8.9 9 8l3-6z" fill={L.purple}/></svg> },
        ].map(t => (
          <div key={t.l} className="mra-hover-lift" style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:rs(16), padding: rs(14) }}>
            <div style={{ marginBottom:8 }}>{t.icon}</div>
            <div style={{ fontSize: rs(17), fontWeight:700, color:L.ink }}>{t.v}</div>
            <div style={{ fontSize: rs(9.5), color:L.muted, marginTop:2 }}>{t.l}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: `${rs(12)}px ${rs(20)}px 0` }}>
        <div className="mra-hover-lift" style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:rs(16), padding: `${rs(14)}px ${rs(18)}px` }}>
          <div style={{ fontSize: rs(13.5), fontWeight:600, color:L.ink, marginBottom:2 }}>Subject Performance</div>
          <div onClick={()=>{setFilterS("all-prof");setView("library");}} style={{ display:"flex", alignItems:"center", gap: rs(10), padding: `${rs(10)}px 0`, cursor:"pointer" }}>
            <div style={{ width: rs(9), height: rs(9), borderRadius:"50%", background:L.green, flex:"none" }}/>
            <div style={{ fontSize: rs(10.5), color:L.ink, width: rs(110), flex:"none" }}>Professional Ed</div>
            <div style={{ flex:1, height: rs(7), borderRadius:4, background:L.line, overflow:"hidden" }}><div style={{ height:"100%", width:`${avgOf(profSubset)}%`, background:L.green, borderRadius:4 }}/></div>
            <div style={{ fontSize: rs(10.5), fontWeight:700, color:L.ink, width: rs(32), textAlign:"right", flex:"none" }}>{avgOf(profSubset)}%</div>
          </div>
          <div onClick={()=>{setFilterS("all-gened");setView("library");}} style={{ display:"flex", alignItems:"center", gap: rs(10), padding: `${rs(10)}px 0`, cursor:"pointer" }}>
            <div style={{ width: rs(9), height: rs(9), borderRadius:"50%", background:L.purple, flex:"none" }}/>
            <div style={{ fontSize: rs(10.5), color:L.ink, width: rs(110), flex:"none" }}>General Ed</div>
            <div style={{ flex:1, height: rs(7), borderRadius:4, background:L.line, overflow:"hidden" }}><div style={{ height:"100%", width:`${avgOf(genSubset)}%`, background:L.purple, borderRadius:4 }}/></div>
            <div style={{ fontSize: rs(10.5), fontWeight:700, color:L.ink, width: rs(32), textAlign:"right", flex:"none" }}>{avgOf(genSubset)}%</div>
          </div>
        </div>
      </div>

      <div style={{ margin: `${rs(12)}px ${rs(20)}px 0` }}>
        <div className="mra-hover-lift" style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:rs(16), padding: `${rs(14)}px ${rs(18)}px` }}>
          <div style={{ fontSize: rs(13.5), fontWeight:600, color:L.ink, marginBottom:12 }}>All Quizzes</div>
          {[...QUIZ_REGISTRY, {id:"master",title:"Master Board Exam",color:L.navy}].map((quiz,i)=>{
            const data = getData(quiz.id);
            return (
              <div key={quiz.id} style={{ display:"flex", alignItems:"center", gap: rs(10), padding: `${rs(9)}px 0`,
                borderTop: i>0 ? `1px solid ${L.line}` : "none" }}>
                <div style={{ width: rs(30), height: rs(30), borderRadius:9, background:`${quiz.color}22`, display:"flex",
                  alignItems:"center", justifyContent:"center", flex:"none" }}>
                  {quiz.id==="master" ? <TrophyIcon color={L.navy} size={rs(16)}/> : <SubjIcon subjId={quiz.subjId} color={quiz.color} size={rs(16)}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize: rs(11), fontWeight:600, color:L.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{quiz.title}</div>
                  <div style={{ height:3, borderRadius:2, background:L.line, marginTop:5, overflow:"hidden" }}><div style={{ height:"100%", width:`${data?.score||0}%`, background:quiz.color, borderRadius:2 }}/></div>
                </div>
                <div style={{ textAlign:"right", flex:"none", minWidth:36, fontSize: rs(11), fontWeight:700, color: data?quiz.color:L.muted }}>{data?`${data.score}%`:"—"}</div>
                <div onClick={()=>{if(quiz.id==="master"){setMaster350(buildMaster350());setActiveQ("master");}else setActiveQ(quiz.id);}}
                  className="mra-hover-btn" style={{ fontSize: rs(9.5), fontWeight:600, color:L.blue, cursor:"pointer", flex:"none", padding:"4px 8px" }}>{data?"Retry":"Start"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: `${rs(12)}px ${rs(20)}px 0` }}>
        <div className="mra-hover-lift" style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:rs(16), padding: `${rs(14)}px ${rs(18)}px` }}>
          <div style={{ fontSize: rs(13.5), fontWeight:600, color:L.ink, marginBottom:10 }}>Study Recommendations</div>
          {QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).length > 0 ? (
            QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).map((quiz,i)=>(
              <div key={quiz.id} style={{ display:"flex", alignItems:"center", gap: rs(10), padding: `${rs(9)}px 0`,
                borderTop: i>0 ? `1px solid ${L.line}` : "none" }}>
                <div style={{ width: rs(28), height: rs(28), borderRadius:8, background:`${quiz.color}22`, display:"flex",
                  alignItems:"center", justifyContent:"center", flex:"none" }}><SubjIcon subjId={quiz.subjId} color={quiz.color} size={rs(15)}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize: rs(11), fontWeight:600, color:L.ink }}>{quiz.title}</div>
                  <div style={{ fontSize: rs(9.5), color:L.muted, marginTop:2 }}>{getData(quiz.id)?`Score: ${getData(quiz.id).score}% → Target: 80%+`:"Not yet attempted"}</div>
                </div>
                <div onClick={()=>setActiveQ(quiz.id)} className="mra-hover-btn" style={{ background:quiz.color, color:"#fff", fontSize: rs(10), fontWeight:600,
                  padding: `${rs(6)}px ${rs(12)}px`, borderRadius:999, cursor:"pointer", flex:"none" }}>Practice</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign:"center", padding:"14px 0" }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}><TrophyIcon color={L.gold} size={rs(28)}/></div>
              <div style={{ fontSize:rs(13), fontWeight:700, color:L.green }}>All quizzes above 80%!</div>
              <div style={{ fontSize:rs(11), color:L.muted, marginTop:4 }}>Ready for the Master Exam.</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: rs(15) }}/>
    </>
  ));
  }

  // ── MASTER EXAM (landing) ────────────────────────────────────
  if (view === "master") {
    return shell("master", (
    <>
      <div style={{ padding: `${rs(6)}px ${rs(20)}px ${rs(4)}px` }}>
        <h1 style={{ fontSize: rs(20), fontWeight:700, color:L.ink }}>Master Exam</h1>
        <p style={{ fontSize: rs(11), color:L.muted, marginTop:3 }}>Simulate the real board exam experience</p>
      </div>

      <MascotStrip message="Ready when you are — you've got this!" scale={S}/>

      <div style={{ margin: `${rs(15)}px ${rs(20)}px 0` }}>
        <div className="mra-hover-lift" style={{ background:L.navy, borderRadius:rs(22), padding: rs(20), color:"#fff" }}>
          <div style={{ fontSize: rs(14.5), fontWeight:600, marginBottom: rs(16) }}>Exam Readiness</div>
          <div style={{ display:"flex", alignItems:"center", gap: rs(18) }}>
            <div style={{ width: rs(100), height: rs(100), borderRadius:"50%", flex:"none",
              background:`conic-gradient(${L.gold} 0deg ${totalMastery()*3.6}deg, rgba(255,255,255,.14) ${totalMastery()*3.6}deg 360deg)`,
              display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ position:"absolute", inset: rs(11), borderRadius:"50%", background:L.navy }}/>
              <div style={{ position:"relative", textAlign:"center" }}>
                <div style={{ fontSize: rs(20), fontWeight:700 }}>{totalMastery()}%</div>
                <div style={{ fontSize: rs(8.5), color:"#c9d2e2", marginTop:1 }}>Ready</div>
              </div>
            </div>
            <div style={{ flex:1, fontSize: rs(10.5), color:"#c9d2e2", lineHeight:1.6 }}>
              {completedCount === 0
                ? "Start reviewing to build your readiness score before taking the full 350-question exam."
                : avgOf(genSubset) < avgOf(profSubset)
                  ? <>You're on track. Keep reviewing weak topics in <b style={{ color:"#fff" }}>General Education</b> to boost your score before exam day.</>
                  : <>You're on track. Keep reviewing weak topics in <b style={{ color:"#fff" }}>Professional Education</b> to boost your score before exam day.</>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin: `${rs(15)}px ${rs(20)}px 0` }}>
        <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}} className="mra-hover-btn"
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:L.gold, color:L.navy,
            fontSize: rs(13), fontWeight:700, padding: rs(14), borderRadius:rs(16), cursor:"pointer" }}>
          <svg width={rs(16)} height={rs(16)} viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-14 9V3z" fill={L.navy}/></svg>
          Take Master Exam — 350Q
        </div>
      </div>

      <div style={{ margin: `${rs(12)}px ${rs(20)}px 0` }}>
        <div style={{ fontSize: rs(13.5), fontWeight:600, color:L.ink, marginBottom:10 }}>Practice Exams</div>
        <div className="mra-hover-lift" style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:rs(22) }}>
          {[
            { name:"Full Mock Exam", meta:"350 items · All subjects", icon:<svg width={rs(20)} height={rs(20)} viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={L.blue} strokeWidth="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke={L.blue} strokeWidth="1.6" strokeLinecap="round"/></svg>, tint:L.blueTint, action:()=>{setMaster350(buildMaster350());setActiveQ("master");} },
            { name:"Professional Education Set", meta:`${profSubset.reduce((a,q)=>a+q.questions.length,0)} items · 3 quizzes`, icon:<svg width={rs(20)} height={rs(20)} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={L.orange} strokeWidth="1.6"/><path d="M12 7v5l4 2" stroke={L.orange} strokeWidth="1.6" strokeLinecap="round"/></svg>, tint:L.orangeTint, action:()=>{setFilterS("all-prof");setView("library");} },
            { name:"General Education Set", meta:`${genSubset.reduce((a,q)=>a+q.questions.length,0)} items · 9 quizzes`, icon:<svg width={rs(20)} height={rs(20)} viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" stroke={L.purple} strokeWidth="1.4" strokeLinejoin="round"/></svg>, tint:L.purpleTint, action:()=>{setFilterS("all-gened");setView("library");} },
          ].map((e,i)=>(
            <div key={e.name} style={{ display:"flex", alignItems:"center", gap: rs(12), padding: rs(14), borderTop: i>0?`1px solid ${L.line}`:"none" }}>
              <div style={{ width: rs(44), height: rs(44), borderRadius:12, flex:"none", background:e.tint, display:"flex", alignItems:"center", justifyContent:"center" }}>{e.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize: rs(12.5), fontWeight:600, color:L.ink }}>{e.name}</div>
                <div style={{ fontSize: rs(9.5), color:L.muted, marginTop:3 }}>{e.meta}</div>
              </div>
              <div onClick={e.action} className="mra-hover-btn" style={{ flex:"none", background:L.navyNav, color:"#fff", fontSize: rs(10), fontWeight:600,
                padding: `${rs(8)}px ${rs(13)}px`, borderRadius:999, cursor:"pointer" }}>Start</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: rs(15) }}/>
    </>
  ));
  }

  // ── PROFILE ───────────────────────────────────────────────────
  if (view === "profile") {
    return shell("profile", (
    <>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding: `${rs(8)}px ${rs(20)}px ${rs(4)}px`, textAlign:"center" }}>
        <div style={{ width: rs(76), height: rs(76), borderRadius:"50%", background:L.navy, display:"flex", alignItems:"center",
          justifyContent:"center", color:L.gold, fontSize: rs(24), fontWeight:700, border:`3px solid ${L.gold}` }}>
          {(user||"?").slice(0,2).toUpperCase()}
        </div>
        <h2 style={{ fontSize: rs(16), fontWeight:700, color:L.ink, marginTop:10 }}>{user}</h2>
        <p style={{ fontSize: rs(10.5), color:L.muted, marginTop:2 }}>{isAdmin ? "Administrator" : "Future Teacher"}</p>
      </div>

      <MascotStrip message="Great to see you here again!" scale={S}/>

      <div style={{ display:"flex", margin: `${rs(14)}px ${rs(20)}px 0`, background:"#fff", border:`1px solid ${L.line}`, borderRadius:16, overflow:"hidden" }}>
        {[
          { n:streak, l:"Day Streak" },
          { n:completedCount, l:"Quizzes Done" },
          { n:totalMastery()+"%", l:"Mastery" },
        ].map((s,i)=>(
          <div key={s.l} style={{ flex:1, textAlign:"center", padding: `${rs(12)}px ${rs(4)}px`, borderLeft: i>0?`1px solid ${L.line}`:"none" }}>
            <div style={{ fontSize: rs(15), fontWeight:700, color:L.ink }}>{s.n}</div>
            <div style={{ fontSize: rs(8.5), color:L.muted, marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: `${rs(15)}px ${rs(20)}px 0` }}>
        <div className="mra-hover-lift" style={{ background:"#fff", border:`1px solid ${L.line}`, borderRadius:16 }}>
          {[
            { label:"Library", action:()=>setView("library") },
            { label:"Dashboard", action:()=>setView("dashboard") },
            ...(isAdmin ? [{ label:"Admin Panel", action:()=>setView("admin"), color:L.blue }] : []),
          ].map((m,i)=>(
            <div key={m.label} onClick={m.action} style={{ display:"flex", alignItems:"center", gap:12, padding: `${rs(13)}px ${rs(14)}px`,
              cursor:"pointer", borderTop: i>0?`1px solid ${L.line}`:"none" }}>
              <div style={{ flex:1, fontSize: rs(11.5), fontWeight:600, color:m.color||L.ink }}>{m.label}</div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke={L.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          ))}
          <div onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:12, padding: `${rs(13)}px ${rs(14)}px`,
            cursor:"pointer", borderTop:`1px solid ${L.line}` }}>
            <div style={{ flex:1, fontSize: rs(11.5), fontWeight:600, color:"#E5484D" }}>Log Out</div>
          </div>
        </div>
      </div>
      <div style={{ height: rs(15) }}/>
    </>
  ));
  }

  return null;
}
