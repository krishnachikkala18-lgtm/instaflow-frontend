import { useState, useRef, useCallback, useEffect } from "react";
import { signInWithGoogle, logoutFirebase } from "./firebase";

const BACKEND = "https://krishna-ai-backend-had6.onrender.com";
const G = "#C9A84C";
const GL = "#F0D080";
const D = "#0A0A0A";
const T = "#F0F0F0";
const T2 = "#666";
const AC = "#7C3AED";
const AC2 = "#06B6D4";
const GR = "#22C55E";
const RE = "#EF4444";

const LIMITS = {
  free:    { name:"Free",    price:0,  color:"#555",   trial:false, accounts:1,  posts:5,   captions:3,   reach:false, viral:false, watermark:true  },
  starter: { name:"Starter", price:9,  color:G,        trial:true,  accounts:1,  posts:30,  captions:999, reach:true,  viral:false, watermark:false },
  pro:     { name:"Pro",     price:19, color:AC,       trial:true,  accounts:3,  posts:999, captions:999, reach:true,  viral:true,  watermark:false },
  agency:  { name:"Agency",  price:49, color:"#06B6D4",trial:false, accounts:10, posts:999, captions:999, reach:true,  viral:true,  watermark:false },
};

// ─── THEME ────────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const h = e => setDark(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);
  return dark;
};

const getColors = dark => ({
  bg:     dark ? "#0A0A0A" : "#F5F5F5",
  bg2:    dark ? "#111"    : "#FFFFFF",
  bg3:    dark ? "#181818" : "#F0F0F0",
  bg4:    dark ? "#222"    : "#E5E5E5",
  border: dark ? "#2A2A2A" : "#E0E0E0",
  text:   dark ? "#F0F0F0" : "#111111",
  text2:  dark ? "#666"    : "#888888",
});

const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
};

const mkS = c => ({
  card: (border) => ({ background: c.bg2, border: `1px solid ${border || c.border}`, borderRadius: "16px", padding: "20px", marginBottom: "16px" }),
  btn:    (bg, tc) => ({ background: bg || G, color: tc || D, border: "none", borderRadius: "10px", padding: "11px 20px", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }),
  btnSm:  (bg, tc) => ({ background: bg || G, color: tc || D, border: "none", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontWeight: "700", fontSize: "11px" }),
  btnOut: (col)    => ({ background: "transparent", color: col || G, border: `1px solid ${col || G}44`, borderRadius: "10px", padding: "10px 18px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }),
  inp:   { background: c.bg3, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "11px 14px", color: c.text, fontSize: "13px", width: "100%", boxSizing: "border-box", outline: "none" },
  sel:   { background: c.bg3, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "11px 14px", color: c.text, fontSize: "13px", width: "100%", boxSizing: "border-box" },
  txt:   { background: c.bg3, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "11px 14px", color: c.text, fontSize: "13px", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: "80px" },
  label: { fontSize: "11px", color: c.text2, marginBottom: "5px", display: "block", fontWeight: "500" },
  goldText: { background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800" },
});

// ─── LOCK OVERLAY ─────────────────────────────────────────
function Lock({ feature, plan, onUpgrade, children, c }) {
  const l = LIMITS[plan || "free"];
  if (l[feature]) return children;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ opacity: 0.3, pointerEvents: "none", userSelect: "none" }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `${c?.bg || D}99`, borderRadius: "14px", backdropFilter: "blur(4px)" }}>
        <div style={{ fontSize: "28px", marginBottom: "6px" }}>🔒</div>
        <div style={{ fontSize: "12px", color: c?.text || T, fontWeight: "700", marginBottom: "10px" }}>Upgrade to unlock</div>
        <button style={{ background: G, color: D, border: "none", borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }} onClick={onUpgrade}>⚡ Upgrade Plan</button>
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────
function ConfirmDialog({ msg, onConfirm, onCancel, c }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: "20px", padding: "28px", maxWidth: "320px", width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
        <div style={{ fontSize: "15px", fontWeight: "700", color: c.text, marginBottom: "8px" }}>Are you sure?</div>
        <div style={{ fontSize: "13px", color: c.text2, marginBottom: "24px" }}>{msg}</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ flex: 1, background: c.bg3, color: c.text, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "11px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }} onClick={onCancel}>Cancel</button>
          <button style={{ flex: 1, background: RE, color: T, border: "none", borderRadius: "10px", padding: "11px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }} onClick={onConfirm}>Yes, confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUCCESS POPUP ────────────────────────────────────────
function SuccessPopup({ data, onClose, c }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ background: c.bg2, border: `1px solid ${G}55`, borderRadius: "20px", padding: "28px", maxWidth: "420px", width: "100%", boxShadow: `0 20px 60px ${G}22` }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
          <div style={{ background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "900", fontSize: "22px", marginBottom: "4px" }}>Post Scheduled!</div>
          <div style={{ fontSize: "12px", color: c.text2 }}>You'll get an email when it goes live</div>
        </div>
        <div style={{ background: c.bg3, borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
          <div style={{ fontSize: "10px", color: G, fontWeight: "700", marginBottom: "6px", letterSpacing: "1px" }}>📋 CAPTION</div>
          <div style={{ fontSize: "13px", color: c.text, lineHeight: "1.6" }}>{data.caption}</div>
        </div>
        <div style={{ background: c.bg3, borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
          <div style={{ fontSize: "10px", color: AC, fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>🏷️ HASHTAGS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {data.hashtags?.map(h => <span key={h} style={{ fontSize: "11px", color: AC2, background: `${AC2}11`, padding: "3px 8px", borderRadius: "6px" }}>{h}</span>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          <div style={{ background: c.bg3, borderRadius: "12px", padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: c.text2, marginBottom: "4px" }}>📅 Scheduled</div>
            <div style={{ fontSize: "12px", color: G, fontWeight: "700" }}>{data.scheduledTime}</div>
          </div>
          <div style={{ background: c.bg3, borderRadius: "12px", padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: c.text2, marginBottom: "4px" }}>📈 Est. Reach</div>
            <div style={{ fontSize: "12px", color: AC, fontWeight: "700" }}>{data.reach || "45K–80K"}</div>
          </div>
        </div>
        {data.reachScore && <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: c.text2, marginBottom: "5px" }}>
            <span>Reach Score</span><span style={{ color: G, fontWeight: "700" }}>{data.reachScore}/100</span>
          </div>
          <div style={{ background: c.bg4, borderRadius: "6px", height: "6px", overflow: "hidden" }}>
            <div style={{ width: `${data.reachScore}%`, height: "100%", background: `linear-gradient(90deg,${G},${GL})`, borderRadius: "6px" }} />
          </div>
        </div>}
        <button style={{ background: `linear-gradient(135deg,${G},${GL})`, color: D, border: "none", borderRadius: "10px", padding: "13px", width: "100%", cursor: "pointer", fontWeight: "800", fontSize: "14px" }} onClick={onClose}>Done ✓</button>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const dark = useTheme();
  const c = getColors(dark);
  const s = mkS(c);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true); setErr("");
    try {
      const googleUser = await signInWithGoogle();
      const u = { name: googleUser.name, email: googleUser.email, photo: googleUser.photo, uid: googleUser.uid, plan: "free" };
      localStorage.setItem("if_user", JSON.stringify(u));
      localStorage.setItem("if_token", googleUser.uid);
      onLogin(u, googleUser.uid);
    } catch (e) { setErr("Google login failed. Try again."); }
    setLoading(false);
  };

  const submit = async () => {
    if (!email || !pass || (mode === "register" && !name)) { setErr("Please fill all fields."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${BACKEND}/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass })
      });
      const d = await r.json();
      if (d.error) { setErr(d.error); setLoading(false); return; }
      localStorage.setItem("if_token", d.token);
      localStorage.setItem("if_user", JSON.stringify(d.user));
      onLogin(d.user, d.token);
    } catch (e) { setErr("Server error. Try again."); }
    setLoading(false);
  };

  return (
    <div style={{ background: dark ? `radial-gradient(ellipse at 20% 50%,#1a0a2e,${D} 60%)` : "#F5F5F5", minHeight: "100vh", display: "flex", flexWrap: "wrap", fontFamily: "system-ui,sans-serif", color: c.text }}>
      {/* LEFT PANEL */}
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px" }}>
        <div style={{ fontSize: "13px", color: AC, fontWeight: "700", letterSpacing: "3px", marginBottom: "14px" }}>⚡ INSTAGRAM AUTOMATION</div>
        <div style={{ fontSize: "44px", fontWeight: "900", lineHeight: "1.1", marginBottom: "14px" }}>
          <span style={s.goldText}>InstaFlow</span><span style={{ color: c.text }}> AI</span>
        </div>
        <div style={{ fontSize: "15px", color: c.text2, lineHeight: "1.7", maxWidth: "340px", marginBottom: "28px" }}>Upload video → AI writes caption → Auto schedules at best time. Done.</div>
        {[{ icon: "🎬", t: "Smart Video Analysis", d: "AI reads your video + profile" }, { icon: "📅", t: "Auto Scheduling", d: "Posts go live automatically" }, { icon: "📈", t: "Reach Prediction", d: "Know reach before you post" }, { icon: "🔥", t: "Viral Content Insights", d: "See what works in your niche" }].map((f, i) => (
          <div key={i} style={{ ...s.card(), padding: "12px 16px", display: "flex", gap: "14px", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "20px" }}>{f.icon}</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: c.text, marginBottom: "1px" }}>{f.t}</div>
              <div style={{ fontSize: "11px", color: c.text2 }}>{f.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: "0 1 420px", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px" }}>
        <div style={{ width: "100%", maxWidth: "370px" }}>
          <div style={{ ...s.card(`${G}44`), padding: "30px" }}>
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: c.text, marginBottom: "4px" }}>{mode === "login" ? "Welcome back 👋" : "Get started free 🚀"}</div>
              <div style={{ fontSize: "12px", color: c.text2 }}>{mode === "login" ? "Sign in to InstaFlow AI" : "No credit card required"}</div>
            </div>
            <button style={{ ...s.btn("#fff", "#333"), width: "100%", justifyContent: "center", marginBottom: "14px", padding: "12px", opacity: loading ? 0.7 : 1 }} onClick={handleGoogleLogin} disabled={loading}>
              <span style={{ fontSize: "15px", fontWeight: "900", color: "#4285F4" }}>G</span>
              {loading ? "Signing in..." : "Continue with Google"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ flex: 1, height: "1px", background: c.border }} />
              <span style={{ fontSize: "11px", color: c.text2 }}>or email</span>
              <div style={{ flex: 1, height: "1px", background: c.border }} />
            </div>
            <div style={{ display: "flex", background: c.bg3, borderRadius: "10px", padding: "3px", marginBottom: "18px" }}>
              {["login", "register"].map(m => (
                <button key={m} onClick={() => { setMode(m); setErr(""); }}
                  style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "12px", background: mode === m ? G : "transparent", color: mode === m ? D : c.text2, transition: "all 0.2s" }}>
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>
            {mode === "register" && <div style={{ marginBottom: "10px" }}><label style={s.label}>Full Name</label><input style={s.inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></div>}
            <div style={{ marginBottom: "10px" }}><label style={s.label}>Email</label><input style={s.inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" /></div>
            <div style={{ marginBottom: "14px" }}><label style={s.label}>Password</label><input style={s.inp} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" /></div>
            {err && <div style={{ color: RE, fontSize: "12px", marginBottom: "10px" }}>⚠ {err}</div>}
            <button style={{ ...s.btn(G), width: "100%", justifyContent: "center", padding: "13px", fontSize: "14px", opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login →" : "Create Free Account →"}
            </button>
            <div style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: c.text2 }}>
              {mode === "login" ? "No account? " : "Have account? "}
              <span style={{ color: G, cursor: "pointer", fontWeight: "700" }} onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}>
                {mode === "login" ? "Sign up free" : "Login"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────
function Onboarding({ user, onDone }) {
  const dark = useTheme();
  const c = getColors(dark);
  const s = mkS(c);
  const [step, setStep] = useState(0);
  const [igUser, setIgUser] = useState("");
  const [niche, setNiche] = useState("");
  const [goal, setGoal] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState(null);

  const analyze = async () => {
    if (!igUser) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    setProfile({ username: igUser, niche: niche || "Digital Marketing", followers: "1.2K", avgReach: "2.4K", bestTime: "7–9 PM", topContent: "Reels", tone: "Casual & Informative" });
    setAnalyzing(false);
    setStep(2);
  };

  const done = () => {
    localStorage.setItem("if_profile", JSON.stringify({ username: igUser, niche, goal, ...profile }));
    onDone();
  };

  return (
    <div style={{ background: c.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "system-ui,sans-serif", color: c.text }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "32px" }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: i === step ? "28px" : "8px", height: "8px", borderRadius: "4px", background: i <= step ? G : c.border, transition: "all 0.3s" }} />)}
        </div>
        {step === 0 && <div style={s.card(`${G}44`)}>
          <div style={{ textAlign: "center", marginBottom: "22px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>👋</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: c.text, marginBottom: "4px" }}>Welcome, {user.name}!</div>
            <div style={{ fontSize: "13px", color: c.text2 }}>Quick setup — takes 2 minutes</div>
          </div>
          <label style={s.label}>Instagram Username</label>
          <input style={{ ...s.inp, marginBottom: "12px" }} value={igUser} onChange={e => setIgUser(e.target.value)} placeholder="@yourusername" />
          <label style={s.label}>Content Niche</label>
          <select style={{ ...s.sel, marginBottom: "12px" }} value={niche} onChange={e => setNiche(e.target.value)}>
            <option value="">Select...</option>
            {["AI & Technology", "Digital Marketing", "Personal Finance", "Fitness", "Food", "Fashion", "Travel", "Education", "Comedy", "Business"].map(n => <option key={n}>{n}</option>)}
          </select>
          <label style={s.label}>Your Goal</label>
          <select style={{ ...s.sel, marginBottom: "20px" }} value={goal} onChange={e => setGoal(e.target.value)}>
            <option value="">Select...</option>
            {["Grow followers", "Get more reach", "Sell products", "Build personal brand", "Get clients", "Drive traffic"].map(g => <option key={g}>{g}</option>)}
          </select>
          <button style={{ ...s.btn(G), width: "100%", justifyContent: "center", padding: "13px", opacity: !igUser ? 0.5 : 1 }} onClick={() => setStep(1)} disabled={!igUser}>Next →</button>
        </div>}
        {step === 1 && <div style={s.card(`${AC}44`)}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: c.text, marginBottom: "4px" }}>Analyze Profile</div>
            <div style={{ fontSize: "13px", color: c.text2 }}>We'll study @{igUser} to personalize your experience</div>
          </div>
          {!analyzing
            ? <button style={{ ...s.btn(AC, T), width: "100%", justifyContent: "center", padding: "13px" }} onClick={analyze}>🔍 Analyze My Profile</button>
            : <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚙️</div>
              <div style={{ fontSize: "13px", color: c.text2 }}>Analyzing @{igUser}...</div>
            </div>}
        </div>}
        {step === 2 && profile && <div style={s.card(`${GR}44`)}>
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: c.text }}>Profile Analyzed!</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
            {[["📊 Niche", profile.niche], ["👥 Followers", profile.followers], ["📈 Avg Reach", profile.avgReach], ["⏰ Best Time", profile.bestTime], ["🎬 Top Content", profile.topContent], ["💬 Tone", profile.tone]].map(([l, v]) => (
              <div key={l} style={{ background: c.bg3, borderRadius: "10px", padding: "12px" }}>
                <div style={{ fontSize: "10px", color: c.text2, marginBottom: "3px" }}>{l}</div>
                <div style={{ fontSize: "13px", color: G, fontWeight: "700" }}>{v}</div>
              </div>
            ))}
          </div>
          <button style={{ ...s.btn(G), width: "100%", justifyContent: "center", padding: "13px" }} onClick={done}>Go to Dashboard →</button>
        </div>}
      </div>
    </div>
  );
}

// ─── CREATE POST ──────────────────────────────────────────
function CreatePost({ plan, igProfile, onScheduled, onUpgrade, c, s }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mood, setMood] = useState("Educational");
  const [scheduleTime, setScheduleTime] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f)); setStep(1);
  }, []);

  const generateAI = async () => {
    setStep(2); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          messages: [{ role: "user", content: `Generate a viral Instagram caption (under 100 words) for:
Title: ${title}, Description: ${desc}, Mood: ${mood}
Profile: Niche=${igProfile?.niche || "Digital Marketing"}, Tone=${igProfile?.tone || "Casual"}
${LIMITS[plan].watermark ? "Add 'Made with InstaFlow AI ⚡' at end." : ""}
Return ONLY JSON: {"caption":"...","hashtags":["#tag1",...15 tags],"bestTime":"7:00 PM","reachScore":85,"estimatedReach":"45K-80K","tip":"one short tip"}` }]
        })
      });
      const data = await res.json();
      const txt = data.content.map(i => i.text || "").join("");
      const result = JSON.parse(txt.replace(/```json|```/g, "").trim());
      setAiResult(result);
      const t = new Date(); t.setHours(19, 0, 0, 0);
      setScheduleTime(t.toISOString().slice(0, 16));
      setStep(3);
    } catch (e) { setStep(1); }
    setLoading(false);
  };

  const schedule = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onScheduled({ caption: aiResult.caption, hashtags: aiResult.hashtags, scheduledTime: new Date(scheduleTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }), reach: aiResult.estimatedReach, reachScore: aiResult.reachScore });
    setLoading(false);
    setFile(null); setPreview(null); setStep(0); setAiResult(null); setTitle(""); setDesc("");
  };

  return <div>
    {step === 0 && <>
      <div style={{ fontSize: "18px", fontWeight: "800", color: c.text, marginBottom: "4px" }}>Create Post</div>
      <div style={{ fontSize: "12px", color: c.text2, marginBottom: "20px" }}>Upload your video or image</div>
      <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => fileRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? G : c.border}`, borderRadius: "20px", padding: "56px 20px", textAlign: "center", cursor: "pointer", background: dragging ? `${G}08` : c.bg3, transition: "all 0.2s" }}>
        <input ref={fileRef} type="file" accept="video/*,image/*" style={{ display: "none" }} onChange={onDrop} />
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{dragging ? "⬇️" : "🎬"}</div>
        <div style={{ fontSize: "15px", fontWeight: "700", color: dragging ? G : c.text, marginBottom: "6px" }}>{dragging ? "Drop it here!" : "Drag & drop video or image"}</div>
        <div style={{ fontSize: "12px", color: c.text2, marginBottom: "16px" }}>or click to browse · MP4, MOV, JPG, PNG</div>
        <div style={{ display: "inline-block", background: G, color: D, borderRadius: "10px", padding: "10px 20px", fontWeight: "700", fontSize: "13px" }}>Browse Files</div>
      </div>
    </>}
    {step === 1 && <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
        <button style={{ background: "none", border: "none", color: c.text2, cursor: "pointer", fontSize: "20px" }} onClick={() => { setStep(0); setFile(null); setPreview(null); }}>←</button>
        <div style={{ fontSize: "17px", fontWeight: "800", color: c.text }}>About your content</div>
      </div>
      {preview && <div style={{ marginBottom: "14px", borderRadius: "12px", overflow: "hidden", maxHeight: "180px", background: c.bg3 }}>
        {file?.type?.startsWith("video") ? <video src={preview} style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }} controls /> : <img src={preview} style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }} alt="preview" />}
      </div>}
      <label style={s.label}>Post Title *</label>
      <input style={{ ...s.inp, marginBottom: "12px" }} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 5 AI tools that save 10 hours/week" />
      <label style={s.label}>Describe your content</label>
      <textarea style={{ ...s.txt, marginBottom: "12px" }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Key points, message, target audience..." />
      <label style={s.label}>Mood / Vibe</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {["Educational", "Funny", "Inspiring", "Informative", "Behind scenes", "Promotional"].map(m => (
          <button key={m} onClick={() => setMood(m)} style={{ background: mood === m ? G : c.bg4, color: mood === m ? D : c.text2, border: `1px solid ${mood === m ? G : c.border}`, borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: "600", fontSize: "11px" }}>{m}</button>
        ))}
      </div>
      <button style={{ background: G, color: D, border: "none", borderRadius: "10px", padding: "13px", width: "100%", cursor: "pointer", fontWeight: "700", fontSize: "14px", opacity: !title ? 0.5 : 1 }} onClick={generateAI} disabled={!title}>✦ Generate AI Caption</button>
    </>}
    {step === 2 && <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "44px", marginBottom: "14px" }}>🤖</div>
      <div style={{ fontSize: "18px", fontWeight: "800", color: c.text, marginBottom: "8px" }}>AI is working...</div>
      {["Studying your content niche...", "Analyzing tone & style...", "Finding viral hashtags...", "Predicting reach..."].map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: c.text2, background: c.bg3, padding: "10px 14px", borderRadius: "8px", marginBottom: "6px" }}>
          <span style={{ color: G }}>⚙</span>{t}
        </div>
      ))}
    </div>}
    {step === 3 && aiResult && <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <button style={{ background: "none", border: "none", color: c.text2, cursor: "pointer", fontSize: "20px" }} onClick={() => setStep(1)}>←</button>
        <div style={{ fontSize: "17px", fontWeight: "800", color: c.text }}>Review & Schedule</div>
      </div>
      <div style={{ ...s.card(`${G}33`), marginBottom: "12px" }}>
        <label style={s.label}>📝 Caption</label>
        <textarea style={{ ...s.txt, marginBottom: "10px" }} value={aiResult.caption} onChange={e => setAiResult(a => ({ ...a, caption: e.target.value }))} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {aiResult.hashtags?.map(h => <span key={h} style={{ fontSize: "10px", color: AC2, background: `${AC2}11`, padding: "2px 7px", borderRadius: "5px" }}>{h}</span>)}
        </div>
        {aiResult.tip && <div style={{ fontSize: "11px", color: G, background: `${G}11`, padding: "8px 12px", borderRadius: "8px", marginTop: "10px" }}>💡 {aiResult.tip}</div>}
      </div>
      <div style={{ ...s.card(), marginBottom: "12px" }}>
        <label style={s.label}>⏰ Schedule Time</label>
        <input type="datetime-local" style={s.inp} value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
        <div style={{ fontSize: "11px", color: c.text2, marginTop: "6px" }}>✨ Best time: <span style={{ color: G, fontWeight: "600" }}>{aiResult.bestTime}</span></div>
      </div>
      <Lock feature="reach" plan={plan} onUpgrade={onUpgrade} c={c}>
        <div style={{ ...s.card(`${AC}33`), marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: c.text }}>📈 Reach Prediction</span>
            <span style={{ fontSize: "18px", fontWeight: "800", color: G }}>{aiResult.reachScore}/100</span>
          </div>
          <div style={{ background: c.bg4, borderRadius: "6px", height: "5px", overflow: "hidden", marginBottom: "5px" }}>
            <div style={{ width: `${aiResult.reachScore}%`, height: "100%", background: `linear-gradient(90deg,${G},${GL})`, borderRadius: "6px" }} />
          </div>
          <div style={{ fontSize: "11px", color: c.text2 }}>Est. reach: <span style={{ color: AC, fontWeight: "600" }}>{aiResult.estimatedReach}</span></div>
        </div>
      </Lock>
      <button style={{ background: G, color: D, border: "none", borderRadius: "10px", padding: "14px", width: "100%", cursor: "pointer", fontWeight: "800", fontSize: "14px", opacity: loading ? 0.7 : 1 }} onClick={schedule} disabled={loading}>
        {loading ? "Scheduling..." : "📅 Schedule Post"}
      </button>
    </>}
  </div>;
}

// ─── SIDEBAR (Desktop) ────────────────────────────────────
function Sidebar({ tab, setTab, user, plan, limits, onUpgrade, onAdmin, c, s }) {
  const TABS = [
    { id: "home",     icon: "🏠", label: "Dashboard" },
    { id: "create",   icon: "✦",  label: "Create Post" },
    { id: "schedule", icon: "📅", label: "Schedule" },
    { id: "analyze",  icon: "📈", label: "Analytics" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  return (
    <div style={{ width: "240px", minHeight: "100vh", background: c.bg2, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column", padding: "24px 16px", position: "fixed", top: 0, left: 0, zIndex: 100 }}>
      <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
        <div style={{ background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "900", fontSize: "20px", letterSpacing: "1px" }}>⚡ InstaFlow AI</div>
        <div style={{ fontSize: "10px", color: c.text2, marginTop: "2px" }}>Instagram Automation</div>
      </div>
      {/* User info */}
      <div style={{ background: c.bg3, borderRadius: "12px", padding: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg,${G},${GL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "900", color: D, flexShrink: 0 }}>
          {user.photo ? <img src={user.photo} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} alt="" /> : user.name?.[0]?.toUpperCase()}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
          <div style={{ fontSize: "10px", color: limits.color, fontWeight: "600" }}>{limits.name} Plan</div>
        </div>
      </div>
      {/* Nav */}
      <div style={{ flex: 1 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "4px", background: tab === t.id ? `${G}22` : "transparent", color: tab === t.id ? G : c.text2, fontWeight: tab === t.id ? "700" : "400", fontSize: "13px", textAlign: "left", transition: "all 0.15s" }}>
            <span style={{ fontSize: "16px" }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      {/* Bottom */}
      <div style={{ marginTop: "auto" }}>
        <button style={{ ...s.btn(G), width: "100%", justifyContent: "center", marginBottom: "8px" }} onClick={onUpgrade}>⚡ Upgrade Plan</button>
        {user.email === "krishnachikkala18@gmail.com" && <button style={{ ...s.btnSm("#333", T), width: "100%", marginBottom: "8px" }} onClick={onAdmin}>🛡 Admin</button>}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────
function MainApp({ user, token, onLogout }) {
  const dark = useTheme();
  const c = getColors(dark);
  const s = mkS(c);
  const isMobile = useIsMobile();
  const plan = user.plan || "free";
  const limits = LIMITS[plan];
  const igProfile = JSON.parse(localStorage.getItem("if_profile") || "{}");
  const [tab, setTab] = useState("home");
  const [page, setPage] = useState("app");
  const [popup, setPopup] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const onUpgrade = () => setPage("pricing");

  if (page === "pricing") return <PricingPage user={user} onBack={() => setPage("app")} c={c} s={s} />;
  if (page === "admin")   return <AdminPage onBack={() => setPage("app")} c={c} s={s} />;

  const MOBILE_TABS = [
    { id: "home",     icon: "⬡",  label: "Home" },
    { id: "create",   icon: "+",  label: "Create" },
    { id: "schedule", icon: "◈",  label: "Schedule" },
    { id: "analyze",  icon: "▲",  label: "Analyze" },
    { id: "settings", icon: "◎",  label: "Settings" },
  ];

  // ── HOME ──
  function Home() {
    const posts = [
      { type: "Reel", caption: "5 AI tools that save 10hrs/week", time: "Today 7:00 PM", score: 92, status: "scheduled" },
      { type: "Carousel", caption: "How to grow from 0 to 10K followers", time: "Tomorrow 9:00 AM", score: 88, status: "scheduled" },
      { type: "Reel", caption: "AI ads ela cheyyali", time: "Yesterday 7:00 PM", score: 95, status: "posted" },
    ];
    return <div>
      <div style={{ fontSize: "22px", fontWeight: "900", color: c.text, marginBottom: "4px" }}>Dashboard</div>
      <div style={{ fontSize: "13px", color: c.text2, marginBottom: "20px" }}>Welcome back, {user.name} 👋</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "12px", marginBottom: "20px" }}>
        {[["📅", "Scheduled", "4", G], ["✅", "Posted", "3", GR], ["📈", "Reach", "58K", AC], ["🔗", "Referrals", "2", AC2]].map(([icon, l, v, col]) => (
          <div key={l} style={{ ...s.card(), padding: "18px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", marginBottom: "6px" }}>{icon}</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: col }}>{v}</div>
            <div style={{ fontSize: "11px", color: c.text2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "14px", fontWeight: "700", color: c.text, marginBottom: "12px" }}>Upcoming Posts</div>
      {posts.map((p, i) => (
        <div key={i} style={{ ...s.card(), padding: "14px", marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", color: p.type === "Reel" ? G : AC, background: p.type === "Reel" ? `${G}22` : `${AC}22`, padding: "2px 8px", borderRadius: "5px" }}>{p.type}</span>
            <span style={{ fontSize: "10px", color: p.status === "posted" ? GR : "#E88C5A", fontWeight: "600" }}>{p.status === "posted" ? "✅ Posted" : "⏳ Scheduled"}</span>
          </div>
          <div style={{ fontSize: "13px", color: c.text, marginBottom: "5px" }}>{p.caption}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", color: c.text2 }}>⏰ {p.time}</span>
            <span style={{ fontSize: "11px", color: G, fontWeight: "600" }}>Score: {p.score}/100</span>
          </div>
        </div>
      ))}
      <button style={{ background: G, color: D, border: "none", borderRadius: "10px", padding: "13px", width: "100%", cursor: "pointer", fontWeight: "700", fontSize: "13px" }} onClick={() => setTab("create")}>🎬 Create New Post</button>
    </div>;
  }

  // ── SCHEDULE ──
  function Schedule() {
    const [view, setView] = useState("week");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const posts = [{ day: "Mon", time: "7 PM", type: "Reel" }, { day: "Wed", time: "9 AM", type: "Carousel" }, { day: "Fri", time: "6 PM", type: "Reel" }];
    return <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "22px", fontWeight: "900", color: c.text }}>Schedule</div>
        <div style={{ display: "flex", background: c.bg3, borderRadius: "8px", padding: "3px" }}>
          {["week", "month"].map(v => <button key={v} onClick={() => setView(v)} style={{ background: view === v ? G : "transparent", color: view === v ? D : c.text2, border: "none", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }}>{v}</button>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px", marginBottom: "20px" }}>
        {days.map(d => {
          const p = posts.find(x => x.day === d);
          return <div key={d} style={{ background: p ? `${G}11` : c.bg3, border: `1px solid ${p ? G + "44" : c.border}`, borderRadius: "12px", padding: "10px 6px", textAlign: "center", minHeight: "90px" }}>
            <div style={{ fontSize: "11px", color: p ? G : c.text2, fontWeight: "700", marginBottom: "6px" }}>{d}</div>
            {p && <><div style={{ fontSize: "9px", color: c.text, background: c.bg4, borderRadius: "4px", padding: "2px 4px", marginBottom: "2px" }}>{p.type}</div><div style={{ fontSize: "9px", color: c.text2 }}>{p.time}</div></>}
          </div>;
        })}
      </div>
      <button style={{ background: G, color: D, border: "none", borderRadius: "10px", padding: "13px", width: "100%", cursor: "pointer", fontWeight: "700", fontSize: "13px" }} onClick={() => setTab("create")}>+ Schedule New Post</button>
    </div>;
  }

  // ── ANALYZE ──
  function Analyze() {
    return <div>
      <div style={{ fontSize: "22px", fontWeight: "900", color: c.text, marginBottom: "20px" }}>Analytics</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "12px", marginBottom: "20px" }}>
        {[["Total Posts", "16", G], ["Total Reach", "924K", AC], ["Avg Eng.", "6.2%", AC2], ["New Followers", "+234", GR]].map(([l, v, col]) => (
          <div key={l} style={{ ...s.card(), padding: "18px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: col }}>{v}</div>
            <div style={{ fontSize: "11px", color: c.text2, marginTop: "4px" }}>{l}</div>
          </div>
        ))}
      </div>
      <Lock feature="viral" plan={plan} onUpgrade={onUpgrade} c={c}>
        <div style={s.card()}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: c.text, marginBottom: "14px" }}>🔥 Viral Content Analysis</div>
          {[["Reels", "92%", G], ["Carousels", "71%", AC], ["Static", "38%", c.text2]].map(([t, v, col]) => (
            <div key={t} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                <span style={{ color: c.text }}>{t}</span><span style={{ color: col, fontWeight: "600" }}>{v}</span>
              </div>
              <div style={{ background: c.bg4, borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                <div style={{ width: v, height: "100%", background: `linear-gradient(90deg,${col},${col}88)`, borderRadius: "4px" }} />
              </div>
            </div>
          ))}
        </div>
      </Lock>
      <Lock feature="reach" plan={plan} onUpgrade={onUpgrade} c={c}>
        <div style={s.card()}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: c.text, marginBottom: "14px" }}>📈 Reach Insights</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "10px" }}>
            {[["Best Day", "Wednesday"], ["Best Time", "7:00 PM"], ["Best Format", "Reels"], ["Peak Month", "April"]].map(([l, v]) => (
              <div key={l} style={{ background: c.bg3, borderRadius: "10px", padding: "12px" }}>
                <div style={{ fontSize: "10px", color: c.text2, marginBottom: "4px" }}>{l}</div>
                <div style={{ fontSize: "13px", color: G, fontWeight: "700" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Lock>
    </div>;
  }

  // ── SETTINGS ──
  function Settings() {
    const refLink = `https://instaflow-frontend-gray.vercel.app?ref=${user.name?.toLowerCase().replace(/\s/g, "")}`;
    const [copied, setCopied] = useState(false);
    const copy = () => { navigator.clipboard?.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return <div>
      <div style={{ fontSize: "22px", fontWeight: "900", color: c.text, marginBottom: "20px" }}>Settings</div>
      <div style={s.card(`${G}33`)}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `linear-gradient(135deg,${G},${GL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "900", color: D, overflow: "hidden", flexShrink: 0 }}>
            {user.photo ? <img src={user.photo} style={{ width: "48px", height: "48px", objectFit: "cover" }} alt="" /> : user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: c.text }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: c.text2 }}>{user.email}</div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: limits.color, background: `${limits.color}22`, padding: "2px 8px", borderRadius: "6px" }}>{limits.name} · ${limits.price}/mo</span>
          </div>
        </div>
        <button style={{ ...s.btn(G), width: "100%", justifyContent: "center" }} onClick={onUpgrade}>⚡ Upgrade Plan</button>
      </div>
      <div style={s.card()}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: c.text, marginBottom: "10px" }}>🔗 Referral Program</div>
        <div style={{ fontSize: "12px", color: c.text2, marginBottom: "10px" }}>Share your link → friend signs up → you get <span style={{ color: G, fontWeight: "700" }}>1 month free!</span></div>
        <div style={{ background: c.bg3, borderRadius: "10px", padding: "10px 14px", fontSize: "11px", color: c.text2, marginBottom: "10px", wordBreak: "break-all" }}>{refLink}</div>
        <button style={s.btnSm(copied ? GR : G, copied ? T : D)} onClick={copy}>{copied ? "✓ Copied!" : "Copy Referral Link"}</button>
      </div>
      <div style={s.card()}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: c.text, marginBottom: "10px" }}>Instagram Account</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg,${G},${GL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: D }}>@</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: c.text }}>@{igProfile.username || "Not connected"}</div>
            <div style={{ fontSize: "11px", color: c.text2 }}>{igProfile.niche || "No niche set"}</div>
          </div>
        </div>
        <button style={{ ...s.btnOut(G), width: "100%", textAlign: "center" }}>Reconnect Instagram</button>
      </div>
      <div style={s.card()}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: c.text, marginBottom: "8px" }}>Support</div>
        <div style={{ fontSize: "12px", color: c.text2, marginBottom: "4px" }}>📧 support.instaflowai@gmail.com</div>
        <div style={{ fontSize: "11px", color: c.text2 }}>Response within 24 hours · Mon–Sat</div>
      </div>
      <button style={{ background: "transparent", color: RE, border: `1px solid ${RE}44`, borderRadius: "10px", padding: "11px", width: "100%", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
        onClick={() => setConfirm({ msg: "You will be logged out of InstaFlow AI.", onConfirm: onLogout })}>Logout</button>
    </div>;
  }

  const PAGES = {
    home:     <Home />,
    create:   <CreatePost plan={plan} igProfile={igProfile} onScheduled={setPopup} onUpgrade={onUpgrade} c={c} s={s} />,
    schedule: <Schedule />,
    analyze:  <Analyze />,
    settings: <Settings />,
  };

  return (
    <div style={{ background: c.bg, minHeight: "100vh", fontFamily: "system-ui,sans-serif", color: c.text, display: "flex" }}>
      {popup    && <SuccessPopup data={popup} onClose={() => setPopup(null)} c={c} />}
      {confirm  && <ConfirmDialog msg={confirm.msg} onConfirm={() => { confirm.onConfirm(); setConfirm(null); }} onCancel={() => setConfirm(null)} c={c} />}

      {/* DESKTOP SIDEBAR */}
      {!isMobile && <Sidebar tab={tab} setTab={setTab} user={user} plan={plan} limits={limits} onUpgrade={onUpgrade} onAdmin={() => setPage("admin")} c={c} s={s} />}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: isMobile ? 0 : "240px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Desktop top bar */}
        {!isMobile && <div style={{ padding: "20px 32px", background: c.bg2, borderBottom: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ fontSize: "16px", fontWeight: "700", color: c.text }}>
            {tab === "home" ? "Dashboard" : tab === "create" ? "Create Post" : tab === "schedule" ? "Schedule" : tab === "analyze" ? "Analytics" : "Settings"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", color: limits.color, background: `${limits.color}22`, padding: "4px 10px", borderRadius: "20px", fontWeight: "700" }}>{limits.name} Plan</span>
            <button style={s.btnSm(G)} onClick={onUpgrade}>⚡ Upgrade</button>
          </div>
        </div>}

        {/* Mobile top bar */}
        {isMobile && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: c.bg2, borderBottom: `1px solid ${c.border}`, position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "900", fontSize: "16px" }}>⚡ InstaFlow AI</div>
          <span style={{ fontSize: "10px", fontWeight: "700", color: limits.color, background: `${limits.color}22`, padding: "3px 8px", borderRadius: "20px" }}>{limits.name}</span>
        </div>}

        {/* Page content */}
        <div style={{ flex: 1, padding: isMobile ? "18px" : "32px", paddingBottom: isMobile ? "80px" : "32px", maxWidth: isMobile ? "100%" : "900px" }}>
          {PAGES[tab]}
        </div>
      </div>

      {/* MOBILE BOTTOM TABS */}
      {isMobile && <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: `${c.bg2}ee`, backdropFilter: "blur(20px)", borderTop: `1px solid ${c.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 50 }}>
        {MOBILE_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background: t.id === "create" ? G : "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", padding: t.id === "create" ? "8px 16px" : "6px 10px", borderRadius: "12px" }}>
            <span style={{ fontSize: t.id === "create" ? "18px" : "16px", fontWeight: "700", color: t.id === "create" ? D : tab === t.id ? G : c.text2 }}>{t.icon}</span>
            <span style={{ fontSize: "9px", fontWeight: tab === t.id ? "700" : "400", color: t.id === "create" ? D : tab === t.id ? G : c.text2 }}>{t.label}</span>
          </button>
        ))}
      </div>}
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────
function AdminPage({ onBack, c, s }) {
  const stats = [
    { label: "Total Users",      value: "24",   icon: "👥", color: G },
    { label: "Monthly Revenue",  value: "$312", icon: "💰", color: GR },
    { label: "Free Users",       value: "18",   icon: "🆓", color: c.text2 },
    { label: "Paid Users",       value: "6",    icon: "⭐", color: AC },
    { label: "Failed Payments",  value: "1",    icon: "❌", color: RE },
    { label: "Referrals",        value: "3",    icon: "🔗", color: AC2 },
  ];
  const users = [
    { name: "Priya S",  plan: "pro",     email: "priya@gmail.com",  joined: "Apr 20" },
    { name: "Rahul K",  plan: "starter", email: "rahul@gmail.com",  joined: "Apr 22" },
    { name: "Anita M",  plan: "free",    email: "anita@gmail.com",  joined: "Apr 24" },
    { name: "Vikram R", plan: "agency",  email: "vikram@gmail.com", joined: "Apr 25" },
  ];
  return <div style={{ background: c.bg, minHeight: "100vh", fontFamily: "system-ui,sans-serif", color: c.text, maxWidth: "900px", margin: "0 auto", padding: "0 0 40px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "18px 24px", background: c.bg2, borderBottom: `1px solid ${c.border}`, position: "sticky", top: 0 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.text2, cursor: "pointer", fontSize: "20px" }}>←</button>
      <div style={{ fontSize: "18px", fontWeight: "800", color: G }}>Admin Dashboard</div>
    </div>
    <div style={{ padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "12px", marginBottom: "20px" }}>
        {stats.map(st => <div key={st.label} style={{ ...s.card(), padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "22px", marginBottom: "5px" }}>{st.icon}</div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: st.color }}>{st.value}</div>
          <div style={{ fontSize: "10px", color: c.text2, marginTop: "3px" }}>{st.label}</div>
        </div>)}
      </div>
      <div style={s.card()}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: c.text, marginBottom: "14px" }}>Recent Users</div>
        {users.map(u => <div key={u.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c.border}` }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: c.text }}>{u.name}</div>
            <div style={{ fontSize: "10px", color: c.text2 }}>{u.email} · {u.joined}</div>
          </div>
          <span style={{ fontSize: "10px", fontWeight: "700", color: LIMITS[u.plan].color, background: `${LIMITS[u.plan].color}22`, padding: "2px 8px", borderRadius: "5px" }}>{LIMITS[u.plan].name}</span>
        </div>)}
      </div>
    </div>
  </div>;
}

// ─── PRICING PAGE ─────────────────────────────────────────
function PricingPage({ user, onBack, c, s }) {
  const plan = user.plan || "free";
  const [confirm, setConfirm] = useState(null);
  const plans = [
    { id: "free",    features: ["1 account", "5 posts/mo", "3 AI captions/day", "Basic scheduling"],                                                   locked: ["Reach Predictor", "Viral Analyzer"] },
    { id: "starter", features: ["1 account", "30 posts/mo", "Unlimited AI captions", "Smart scheduling", "Reach Predictor", "7-day free trial"],       locked: ["Viral Analyzer"] },
    { id: "pro",     features: ["3 accounts", "Unlimited posts", "All AI features", "Viral Analyzer", "Reach Predictor", "Priority support", "7-day free trial"], locked: [] },
    { id: "agency",  features: ["10 accounts", "Unlimited everything", "White label", "API access", "Dedicated support"],                              locked: [] },
  ];
  const subscribe = planId => {
    if (planId === "free") return;
    const p = LIMITS[planId];
    setConfirm({
      msg: `Start ${p.name} plan${p.trial ? " with 7-day free trial" : ""}? $${p.price}/month.`,
      onConfirm: () => {
        setConfirm(null);
        const opts = { key: "rzp_test_Si6xe6pWT9hoDQ", amount: p.price * 100 * 83, currency: "INR", name: "InstaFlow AI", description: `${p.name} Plan`, handler: () => alert(`✅ ${p.name} activated!`), prefill: { name: user.name, email: user.email }, theme: { color: G } };
        const open = () => new window.Razorpay(opts).open();
        if (window.Razorpay) { open(); return; }
        const sc = document.createElement("script"); sc.src = "https://checkout.razorpay.com/v1/checkout.js"; sc.onload = open; document.body.appendChild(sc);
      }
    });
  };
  return <div style={{ background: c.bg, minHeight: "100vh", fontFamily: "system-ui,sans-serif", color: c.text }}>
    {confirm && <ConfirmDialog msg={confirm.msg} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} c={c} />}
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "18px 24px", background: c.bg2, borderBottom: `1px solid ${c.border}` }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.text2, cursor: "pointer", fontSize: "20px" }}>←</button>
      <div style={{ background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800", fontSize: "18px" }}>Choose Plan</div>
    </div>
    <div style={{ padding: "24px", maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "26px", fontWeight: "900", color: c.text, marginBottom: "6px" }}>Upgrade InstaFlow AI</div>
        <div style={{ fontSize: "13px", color: c.text2 }}>Start free. Upgrade as you grow. Cancel anytime.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px" }}>
        {plans.map(p => {
          const l = LIMITS[p.id]; const isCurrent = plan === p.id;
          return <div key={p.id} style={{ ...s.card(isCurrent ? `${GR}55` : p.id === "pro" ? `${AC}55` : `${l.color}33`), position: "relative" }}>
            {p.id === "pro" && <div style={{ position: "absolute", top: "-10px", left: "16px", background: AC, color: T, fontSize: "9px", fontWeight: "800", padding: "3px 10px", borderRadius: "20px" }}>MOST POPULAR</div>}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: l.color }}>{l.name}</div>
              <div style={{ fontSize: "26px", fontWeight: "900", color: c.text }}>{l.price === 0 ? "Free" : `$${l.price}`}<span style={{ fontSize: "12px", color: c.text2, fontWeight: "400" }}>{l.price > 0 ? "/mo" : ""}</span></div>
              {l.trial && <div style={{ fontSize: "10px", color: GR, fontWeight: "600" }}>7-day free trial</div>}
            </div>
            {p.features.map(f => <div key={f} style={{ display: "flex", gap: "8px", fontSize: "12px", color: c.text, padding: "3px 0" }}><span style={{ color: GR }}>✓</span>{f}</div>)}
            {p.locked.map(f  => <div key={f} style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#555", padding: "3px 0" }}><span>🔒</span>{f}</div>)}
            <button style={{ background: isCurrent ? c.bg4 : p.id === "pro" ? AC : l.price === 0 ? c.bg3 : G, color: isCurrent ? c.text2 : p.id === "pro" ? T : l.price === 0 ? c.text2 : D, border: "none", borderRadius: "10px", padding: "11px", width: "100%", cursor: "pointer", fontWeight: "700", fontSize: "13px", marginTop: "14px", opacity: isCurrent ? 0.6 : 1 }}
              onClick={() => subscribe(p.id)} disabled={isCurrent}>
              {isCurrent ? "Current Plan" : l.trial ? "Start Free Trial →" : l.price === 0 ? "Downgrade" : `Upgrade → $${l.price}/mo`}
            </button>
          </div>;
        })}
      </div>
      <div style={{ textAlign: "center", fontSize: "11px", color: c.text2, marginTop: "16px" }}>🔒 Secure payments · Cancel anytime · support.instaflowai@gmail.com</div>
    </div>
  </div>;
}

// ─── ROOT ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(() => { try { return JSON.parse(localStorage.getItem("if_user")); } catch { return null; } });
  const [token, setToken]     = useState(() => localStorage.getItem("if_token") || "");
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem("if_profile"));

  const onLogin = (u, t) => { setUser(u); setToken(t); };
  const logout  = async () => {
    try { await logoutFirebase(); } catch {}
    ["if_token", "if_user", "if_profile"].forEach(k => localStorage.removeItem(k));
    setUser(null); setToken(""); setOnboarded(false);
  };

  if (!user)       return <AuthPage onLogin={onLogin} />;
  if (!onboarded)  return <Onboarding user={user} onDone={() => setOnboarded(true)} />;
  return <MainApp user={user} token={token} onLogout={logout} />;
}
