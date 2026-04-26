import { useState, useEffect } from "react";

const BACKEND = "https://krishna-ai-backend-had6.onrender.com";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#F0D080";
const DARK = "#141414";
const DARK2 = "#1E1E1E";
const DARK3 = "#2A2A2A";
const BORDER = "#333";
const TEXT = "#F0F0F0";
const TEXT2 = "#A0A0A0";

const PLAN_LIMITS = {
  free:    { name:"Free",    price:0,   color:"#555",    accounts:1,  posts:5,   captions:3,   autoPost:false, scheduler:false, reachPredictor:false, viralAnalyzer:false, watermark:true  },
  starter: { name:"Starter", price:199, color:GOLD,      accounts:1,  posts:20,  captions:999, autoPost:true,  scheduler:true,  reachPredictor:true,  viralAnalyzer:true,  watermark:false },
  pro:     { name:"Pro",     price:499, color:"#5D9CEC", accounts:3,  posts:999, captions:999, autoPost:true,  scheduler:true,  reachPredictor:true,  viralAnalyzer:true,  watermark:false },
  agency:  { name:"Agency",  price:999, color:"#A855F7", accounts:10, posts:999, captions:999, autoPost:true,  scheduler:true,  reachPredictor:true,  viralAnalyzer:true,  watermark:false },
};

const NAV_ITEMS = ["Dashboard","Scheduler","AI Caption","Viral Analyzer","Reach Predictor","Post Manager","Connect IG"];
const NAV_ICONS = ["▣","📅","✦","🔥","📈","⚡","🔗"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const POST_TYPES = ["Reel","Carousel","Static Image","Story"];
const NICHES = ["AI Video Ads","Digital Marketing","Personal Finance","Home Fitness","Tech"];
const TONES = ["Professional","Viral","Casual","Telugu+English","Storytelling"];

const s = {
  app:{background:DARK,minHeight:"100vh",fontFamily:"sans-serif",color:TEXT,display:"flex",flexDirection:"column"},
  header:{background:DARK2,borderBottom:`1px solid ${BORDER}`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  logo:{color:GOLD,fontWeight:"800",fontSize:"16px",letterSpacing:"2px"},
  nav:{display:"flex",gap:"4px",flexWrap:"wrap",padding:"8px 14px",background:DARK2,borderBottom:`1px solid ${BORDER}`},
  navBtn:(a)=>({background:a?GOLD:"transparent",color:a?DARK:TEXT2,border:`1px solid ${a?GOLD:BORDER}`,borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontSize:"11px",fontWeight:a?"700":"400"}),
  content:{flex:1,padding:"14px",overflowY:"auto"},
  card:{background:DARK2,border:`1px solid ${BORDER}`,borderRadius:"10px",padding:"14px",marginBottom:"12px"},
  cardGold:{background:DARK2,border:`1px solid ${GOLD}`,borderRadius:"10px",padding:"14px",marginBottom:"12px"},
  sectionTitle:{color:GOLD,fontSize:"11px",fontWeight:"700",letterSpacing:"1px",marginBottom:"10px",textTransform:"uppercase"},
  grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"},
  grid4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"},
  statCard:{background:DARK3,borderRadius:"8px",padding:"12px",textAlign:"center"},
  statNum:{fontSize:"22px",fontWeight:"700",color:GOLD},
  statLabel:{fontSize:"10px",color:TEXT2,marginTop:"3px"},
  btn:{background:GOLD,color:DARK,border:"none",borderRadius:"6px",padding:"8px 14px",cursor:"pointer",fontWeight:"700",fontSize:"12px"},
  btnOut:{background:"transparent",color:GOLD,border:`1px solid ${GOLD}`,borderRadius:"6px",padding:"7px 14px",cursor:"pointer",fontSize:"12px"},
  btnSm:(c)=>({background:c||GOLD,color:DARK,border:"none",borderRadius:"5px",padding:"5px 10px",cursor:"pointer",fontWeight:"600",fontSize:"11px"}),
  input:{background:DARK3,border:`1px solid ${BORDER}`,borderRadius:"6px",padding:"8px 10px",color:TEXT,fontSize:"12px",width:"100%",boxSizing:"border-box"},
  select:{background:DARK3,border:`1px solid ${BORDER}`,borderRadius:"6px",padding:"8px 10px",color:TEXT,fontSize:"12px",width:"100%",boxSizing:"border-box"},
  textarea:{background:DARK3,border:`1px solid ${BORDER}`,borderRadius:"6px",padding:"8px 10px",color:TEXT,fontSize:"12px",width:"100%",boxSizing:"border-box",minHeight:"90px",resize:"vertical"},
  tag:(c)=>({background:c?`${c}22`:DARK3,color:c||TEXT2,borderRadius:"4px",padding:"2px 8px",fontSize:"10px",fontWeight:"700",display:"inline-block",border:`1px solid ${c||BORDER}`}),
  row:{display:"flex",alignItems:"center",gap:"8px"},
  lock:{background:"#E88C5A11",border:"1px solid #E88C5A44",borderRadius:"8px",padding:"10px",display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"},
  err:{color:"#E88C5A",fontSize:"11px",marginTop:"6px"},
  success:{color:"#5DBE7A",fontSize:"11px",marginTop:"6px"},
  label:{fontSize:"10px",color:TEXT2,marginBottom:"3px",display:"block"},
};

function ScoreBar({score,color}){
  const c=color||(score>=80?GOLD:score>=60?"#5D9CEC":"#E88C5A");
  return <div style={{marginTop:"4px"}}>
    <div style={{background:DARK3,borderRadius:"3px",height:"5px",overflow:"hidden"}}>
      <div style={{width:`${score}%`,height:"100%",background:c,borderRadius:"3px"}}/>
    </div>
    <div style={{fontSize:"10px",color:c,marginTop:"2px"}}>{score}/100</div>
  </div>;
}

function LockedFeature({feature,plan,onUpgrade}){
  const limits=PLAN_LIMITS[plan||"free"];
  if(limits[feature]) return null;
  return <div style={s.lock}>
    <span>🔒</span>
    <div style={{flex:1}}>
      <div style={{fontSize:"12px",fontWeight:"600",color:"#E88C5A"}}>Locked on {limits.name} plan</div>
      <div style={{fontSize:"10px",color:TEXT2}}>Upgrade to unlock this feature</div>
    </div>
    <button style={s.btnSm()} onClick={onUpgrade}>Upgrade ⚡</button>
  </div>;
}

// ==================== AUTH ====================
function AuthPage({onLogin}){
  const [mode,setMode]=useState("login");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");

  const submit=async()=>{
    if(!email||!pass){setErr("Fill all fields.");return;}
    if(mode==="register"&&!name){setErr("Enter name.");return;}
    setLoading(true);setErr("");setMsg("");
    try{
      const res=await fetch(`${BACKEND}/auth/${mode==="login"?"login":"register"}`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,email,password:pass})
      });
      const data=await res.json();
      if(data.error){setErr(data.error);setLoading(false);return;}
      if(data.token){
        localStorage.setItem("if_token",data.token);
        localStorage.setItem("if_user",JSON.stringify(data.user));
        setMsg(mode==="login"?"Welcome back!":"Account created! 🎉");
        setTimeout(()=>onLogin(data.user,data.token),700);
      }
    }catch(e){setErr("Server error. Try again.");}
    setLoading(false);
  };

  return <div style={{...s.app,justifyContent:"center",alignItems:"center",minHeight:"100vh"}}>
    <div style={{width:"100%",maxWidth:"380px",padding:"20px"}}>
      <div style={{textAlign:"center",marginBottom:"24px"}}>
        <div style={{fontSize:"28px",fontWeight:"800",color:GOLD}}>⚡ InstaFlow AI</div>
        <div style={{fontSize:"12px",color:TEXT2,marginTop:"4px"}}>AI-powered Instagram automation</div>
        <div style={{display:"flex",justifyContent:"center",gap:"8px",marginTop:"12px",flexWrap:"wrap"}}>
          {["🤖 AI Captions","📅 Auto Schedule","📈 Reach Predict","🔥 Viral Analyze"].map(f=>
            <span key={f} style={{fontSize:"10px",color:GOLD,background:`${GOLD}22`,padding:"3px 8px",borderRadius:"20px"}}>{f}</span>)}
        </div>
      </div>
      <div style={s.cardGold}>
        <div style={{display:"flex",marginBottom:"14px",background:DARK3,borderRadius:"6px",padding:"3px"}}>
          {["login","register"].map(m=><button key={m} onClick={()=>{setMode(m);setErr("");}}
            style={{flex:1,padding:"7px",border:"none",borderRadius:"5px",cursor:"pointer",fontWeight:"600",fontSize:"11px",
              background:mode===m?GOLD:"transparent",color:mode===m?DARK:TEXT2}}>{m==="login"?"Login":"Sign Up Free"}</button>)}
        </div>
        {mode==="register"&&<div><label style={s.label}>Full Name</label>
          <input style={{...s.input,marginBottom:"8px"}} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></div>}
        <label style={s.label}>Email</label>
        <input style={{...s.input,marginBottom:"8px"}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com"/>
        <label style={s.label}>Password</label>
        <input style={{...s.input,marginBottom:"10px"}} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
        {err&&<div style={s.err}>⚠ {err}</div>}
        {msg&&<div style={s.success}>✅ {msg}</div>}
        <button style={{...s.btn,width:"100%",padding:"10px",fontSize:"13px",marginTop:"10px",opacity:loading?0.7:1}} onClick={submit} disabled={loading}>
          {loading?"Please wait...":(mode==="login"?"Login →":"Create Free Account →")}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"6px",marginTop:"6px"}}>
        {Object.entries(PLAN_LIMITS).map(([id,p])=><div key={id} style={{background:DARK2,border:`1px solid ${p.color}`,borderRadius:"8px",padding:"8px",textAlign:"center"}}>
          <div style={{fontSize:"10px",fontWeight:"700",color:p.color}}>{p.name}</div>
          <div style={{fontSize:"12px",fontWeight:"800",color:TEXT,margin:"3px 0"}}>{p.price===0?"Free":`₹${p.price}`}</div>
          <div style={{fontSize:"9px",color:TEXT2}}>/mo</div>
        </div>)}
      </div>
    </div>
  </div>;
}

// ==================== PRICING ====================
function PricingPage({user,onBack}){
  const [loading,setLoading]=useState(null);
  const [msg,setMsg]=useState("");
  const plan=user.plan||"free";

  const subscribe=(planId)=>{
    if(planId==="free"){setMsg("You are on Free plan.");return;}
    const p=PLAN_LIMITS[planId];
    setLoading(planId);
    const opts={
      key:"rzp_test_Si6xe6pWT9hoDQ",
      amount:p.price*100,currency:"INR",
      name:"InstaFlow AI",description:`${p.name} Plan`,
      handler:(r)=>{setMsg(`✅ Payment done! Welcome to ${p.name}! ID: ${r.razorpay_payment_id}`);setLoading(null);},
      prefill:{name:user.name,email:user.email},
      theme:{color:GOLD},
    };
    const open=()=>{const rz=new window.Razorpay(opts);rz.open();setLoading(null);};
    if(window.Razorpay){open();return;}
    const sc=document.createElement("script");
    sc.src="https://checkout.razorpay.com/v1/checkout.js";
    sc.onload=open;document.body.appendChild(sc);
  };

  return <div style={s.app}>
    <div style={s.header}>
      <div style={s.logo}>⚡ InstaFlow AI</div>
      <div style={s.row}>
        <span style={s.tag(PLAN_LIMITS[plan].color)}>{PLAN_LIMITS[plan].name}</span>
        <button style={s.btnOut} onClick={onBack}>← Back</button>
      </div>
    </div>
    <div style={{...s.content,maxWidth:"800px",margin:"0 auto",width:"100%"}}>
      <div style={{textAlign:"center",marginBottom:"20px"}}>
        <div style={{fontSize:"22px",fontWeight:"800",color:GOLD}}>Choose Your Plan</div>
        <div style={{fontSize:"12px",color:TEXT2,marginTop:"4px"}}>Start free. Upgrade when you grow.</div>
      </div>
      {msg&&<div style={{...s.cardGold,textAlign:"center",color:msg.startsWith("✅")?"#5DBE7A":"#E88C5A",fontSize:"13px"}}>{msg}</div>}
      <div style={s.grid2}>
        {Object.entries(PLAN_LIMITS).map(([id,p])=>{
          const isCurrent=plan===id;
          return <div key={id} style={{background:DARK2,border:`2px solid ${isCurrent?"#5DBE7A":p.color}`,borderRadius:"12px",padding:"18px",position:"relative"}}>
            {id==="pro"&&<div style={{position:"absolute",top:"-11px",left:"50%",transform:"translateX(-50%)",background:GOLD,color:DARK,fontSize:"9px",fontWeight:"800",padding:"3px 10px",borderRadius:"20px"}}>MOST POPULAR</div>}
            {isCurrent&&<div style={{position:"absolute",top:"-11px",right:"14px",background:"#5DBE7A",color:DARK,fontSize:"9px",fontWeight:"800",padding:"3px 10px",borderRadius:"20px"}}>CURRENT</div>}
            <div style={{fontSize:"14px",fontWeight:"800",color:p.color}}>{p.name}</div>
            <div style={{fontSize:"22px",fontWeight:"800",color:TEXT,margin:"6px 0"}}>{p.price===0?"Free":`₹${p.price}/mo`}</div>
            <div style={{fontSize:"10px",color:TEXT2,marginBottom:"12px"}}>{p.accounts} account{p.accounts>1?"s":""} · {p.posts===999?"Unlimited":p.posts} posts/mo</div>
            {[["autoPost","🤖 Auto-posting"],["scheduler","📅 Scheduler"],["reachPredictor","📈 Reach Predictor"],["viralAnalyzer","🔥 Viral Analyzer"]].map(([f,l])=>
              <div key={f} style={{fontSize:"11px",color:p[f]?"#5DBE7A":"#555",padding:"2px 0",display:"flex",gap:"6px"}}>
                <span>{p[f]?"✓":"✗"}</span>{l}
              </div>)}
            <div style={{marginTop:"8px",marginBottom:"12px",fontSize:"10px",color:TEXT2}}>
              {p.posts===999?"Unlimited":"Up to "+p.posts} posts · {p.captions===999?"Unlimited":p.captions+" captions/day"} · {p.watermark?"Watermark":"No watermark"}
            </div>
            <button style={{...s.btn,width:"100%",padding:"9px",background:isCurrent?"#333":p.color,color:isCurrent?TEXT2:DARK,opacity:loading===id?0.7:1}}
              onClick={()=>subscribe(id)} disabled={isCurrent||loading===id}>
              {isCurrent?"Current Plan ✓":loading===id?"Processing...":p.price===0?"Free Plan":`Upgrade ₹${p.price}/mo`}
            </button>
          </div>;
        })}
      </div>
      <div style={{textAlign:"center",marginTop:"14px",fontSize:"10px",color:TEXT2}}>
        🔒 Secure payments via Razorpay · Cancel anytime · GST applicable
      </div>
    </div>
  </div>;
}

// ==================== MAIN DASHBOARD ====================
const SAMPLE_POSTS=[
  {id:1,type:"Reel",caption:"5 AI tools that replace your entire marketing team 🤖",time:"9:00 AM",day:"Mon",reach:"High",score:92,status:"scheduled"},
  {id:2,type:"Carousel",caption:"How I made ₹50K from Instagram in 30 days",time:"6:00 PM",day:"Wed",reach:"High",score:88,status:"scheduled"},
  {id:3,type:"Reel",caption:"Telugu lo AI video ads ela create cheyyali 🎬",time:"7:00 PM",day:"Sat",reach:"High",score:95,status:"posted"},
];

function MainApp({user,token,onUpgrade,onLogout}){
  const [tab,setTab]=useState(0);
  const plan=user.plan||"free";
  const limits=PLAN_LIMITS[plan];

  // ---- Dashboard ----
  function Dashboard(){
    return <div>
      <div style={s.grid4}>
        {[["Posts This Week","7",GOLD],["Posted","3","#5DBE7A"],["Remaining","4","#E88C5A"],["Avg Reach","58K",GOLD_LIGHT]].map(([l,v,c])=>
          <div key={l} style={s.statCard}><div style={{...s.statNum,color:c}}>{v}</div><div style={s.statLabel}>{l}</div></div>)}
      </div>
      {limits.watermark&&<div style={{...s.lock,marginTop:"10px"}}>
        <span>⚠️</span>
        <div style={{flex:1,fontSize:"11px",color:"#E88C5A"}}><strong>Free plan:</strong> "Made with InstaFlow AI" watermark on all posts</div>
        <button style={s.btnSm()} onClick={onUpgrade}>Remove →</button>
      </div>}
      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.sectionTitle}>This Week</div>
          {DAYS.map(d=>{
            const p=SAMPLE_POSTS.filter(x=>x.day===d);
            return <div key={d} style={{...s.row,justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${BORDER}`}}>
              <span style={{fontSize:"11px",color:TEXT2,width:"28px"}}>{d}</span>
              <div style={{flex:1,display:"flex",gap:"4px"}}>
                {p.length?p.map(x=><span key={x.id} style={s.tag(x.status==="posted"?"#5DBE7A":null)}>{x.type}</span>):<span style={{fontSize:"10px",color:BORDER}}>No post</span>}
              </div>
              <span style={{fontSize:"10px",color:p.length?GOLD:TEXT2}}>{p.length?p[0].time:""}</span>
            </div>;
          })}
        </div>
        <div style={s.card}>
          <div style={s.sectionTitle}>Plan Usage</div>
          {[["Posts",3,limits.posts],["Captions Today",1,limits.captions],["Accounts",1,limits.accounts]].map(([l,u,t])=>
            <div key={l} style={{marginBottom:"10px"}}>
              <div style={{...s.row,justifyContent:"space-between",fontSize:"10px",color:TEXT2,marginBottom:"3px"}}>
                <span>{l}</span><span style={{color:t===999?"#5DBE7A":GOLD}}>{t===999?"Unlimited":u+"/"+t}</span>
              </div>
              {t!==999&&<div style={{background:DARK3,borderRadius:"3px",height:"4px",overflow:"hidden"}}>
                <div style={{width:`${(u/t)*100}%`,height:"100%",background:GOLD,borderRadius:"3px"}}/>
              </div>}
            </div>)}
          <button style={{...s.btn,width:"100%",marginTop:"8px"}} onClick={onUpgrade}>⚡ Upgrade Plan</button>
        </div>
      </div>
      <div style={s.card}>
        <div style={s.sectionTitle}>Upcoming Posts</div>
        {SAMPLE_POSTS.filter(p=>p.status==="scheduled").map(p=><div key={p.id} style={{...s.row,justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${BORDER}`}}>
          <span style={s.tag()}>{p.type}</span>
          <span style={{fontSize:"11px",flex:1,marginLeft:"8px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.caption}</span>
          <span style={{fontSize:"10px",color:TEXT2,whiteSpace:"nowrap"}}>{p.day} · {p.time}</span>
          <span style={s.tag(p.reach==="High"?GOLD:"#5D9CEC")}>{p.reach}</span>
        </div>)}
      </div>
    </div>;
  }

  // ---- Scheduler ----
  function Scheduler(){
    const [posts,setPosts]=useState(SAMPLE_POSTS);
    const [form,setForm]=useState({type:"Reel",caption:"",time:"9:00 AM",day:"Mon"});
    const [adding,setAdding]=useState(false);
    const add=()=>{
      if(!form.caption)return;
      if(!limits.scheduler){onUpgrade();return;}
      const remaining=limits.posts-posts.filter(p=>p.status==="scheduled").length;
      if(remaining<=0){alert(`You've reached your ${limits.posts} posts/month limit. Upgrade to add more!`);return;}
      setPosts(p=>[...p,{...form,id:Date.now(),reach:"Medium",score:70,status:"scheduled"}]);
      setForm({type:"Reel",caption:"",time:"9:00 AM",day:"Mon"});setAdding(false);
    };
    return <div>
      <LockedFeature feature="scheduler" plan={plan} onUpgrade={onUpgrade}/>
      <div style={{...s.row,marginBottom:"10px"}}>
        <button style={s.btn} onClick={()=>setAdding(!adding)}>+ Schedule Post</button>
        <span style={{fontSize:"11px",color:TEXT2}}>
          {limits.posts===999?"Unlimited posts":`${posts.filter(p=>p.status==="scheduled").length}/${limits.posts} posts used`}
        </span>
      </div>
      {adding&&limits.scheduler&&<div style={s.cardGold}>
        <div style={s.sectionTitle}>New Post</div>
        <div style={s.grid2}>
          <div><label style={s.label}>Type</label>
            <select style={s.select} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{POST_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={s.label}>Day</label>
            <select style={s.select} value={form.day} onChange={e=>setForm(f=>({...f,day:e.target.value}))}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
          <div><label style={s.label}>Time</label>
            <select style={s.select} value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}>
              {["7:00 AM","9:00 AM","12:00 PM","6:00 PM","9:00 PM"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={s.label}>Caption</label>
            <input style={s.input} value={form.caption} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} placeholder="Caption..."/></div>
        </div>
        <div style={{...s.row,marginTop:"10px"}}>
          <button style={s.btn} onClick={add}>Schedule</button>
          <button style={s.btnOut} onClick={()=>setAdding(false)}>Cancel</button>
        </div>
      </div>}
      <div style={s.card}>
        <div style={s.sectionTitle}>Weekly Calendar</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"5px"}}>
          {DAYS.map(d=>{
            const dp=posts.filter(p=>p.day===d);
            return <div key={d} style={{background:DARK3,borderRadius:"6px",padding:"6px",minHeight:"80px"}}>
              <div style={{fontSize:"10px",color:GOLD,fontWeight:"700",marginBottom:"6px"}}>{d}</div>
              {dp.map(p=><div key={p.id} style={{background:p.status==="posted"?"#1A2A1A":DARK2,border:`1px solid ${p.status==="posted"?"#3A6A3A":BORDER}`,borderRadius:"4px",padding:"4px",marginBottom:"3px"}}>
                <div style={{fontSize:"8px",color:GOLD_LIGHT,fontWeight:"600"}}>{p.type}</div>
                <div style={{fontSize:"8px",color:TEXT2}}>{p.time}</div>
              </div>)}
              {!dp.length&&<div style={{fontSize:"9px",color:BORDER,textAlign:"center",marginTop:"16px"}}>Empty</div>}
            </div>;
          })}
        </div>
      </div>
    </div>;
  }

  // ---- AI Captions ----
  function AICaptions(){
    const [topic,setTopic]=useState("");
    const [niche,setNiche]=useState(NICHES[0]);
    const [tone,setTone]=useState(TONES[0]);
    const [lang,setLang]=useState("English");
    const [loading,setLoading]=useState(false);
    const [captions,setCaptions]=useState([]);
    const [err,setErr]=useState("");
    const [used,setUsed]=useState(0);

    const generate=async()=>{
      if(!topic){setErr("Enter a topic.");return;}
      if(limits.captions!==999&&used>=limits.captions){
        setErr(`Daily limit reached (${limits.captions}/day). Upgrade for unlimited!`);return;}
      setLoading(true);setCaptions([]);setErr("");
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
            messages:[{role:"user",content:`You are an Instagram expert for InstaFlow AI.
Generate 3 high-performing Instagram captions for:
Topic: ${topic}
Niche: ${niche}
Tone: ${tone}
Language: ${lang}
${limits.watermark?"Add 'Made with InstaFlow AI' at the end of each caption.":""}

Return ONLY JSON array (no markdown):
[{"caption":"...","hashtags":["#tag1"],"postType":"Reel","reachScore":85}]`}]})});
        const data=await res.json();
        const txt=data.content.map(i=>i.text||"").join("");
        setCaptions(JSON.parse(txt.replace(/```json|```/g,"").trim()));
        setUsed(u=>u+1);
      }catch(e){setErr("Generation failed.");}
      setLoading(false);
    };

    return <div>
      {limits.captions!==999&&<div style={{background:`${GOLD}22`,border:`1px solid ${GOLD}44`,borderRadius:"8px",padding:"8px 12px",marginBottom:"10px",fontSize:"11px",color:GOLD}}>
        AI Captions: {used}/{limits.captions} used today · <span style={{cursor:"pointer",fontWeight:"700"}} onClick={onUpgrade}>Upgrade for unlimited →</span>
      </div>}
      <div style={s.cardGold}>
        <div style={s.sectionTitle}>AI Caption Generator</div>
        <div style={s.grid2}>
          <div><label style={s.label}>Topic</label>
            <input style={s.input} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. AI video ads"/></div>
          <div><label style={s.label}>Niche</label>
            <select style={s.select} value={niche} onChange={e=>setNiche(e.target.value)}>{NICHES.map(n=><option key={n}>{n}</option>)}</select></div>
          <div><label style={s.label}>Tone</label>
            <select style={s.select} value={tone} onChange={e=>setTone(e.target.value)}>{TONES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={s.label}>Language</label>
            <select style={s.select} value={lang} onChange={e=>setLang(e.target.value)}>
              {["English","Telugu","Telugu + English"].map(l=><option key={l}>{l}</option>)}</select></div>
        </div>
        {err&&<div style={s.err}>{err}</div>}
        <button style={{...s.btn,marginTop:"10px",opacity:loading?0.6:1}} onClick={generate} disabled={loading}>
          {loading?"Generating...":"Generate with AI ✦"}
        </button>
      </div>
      {captions.map((c,i)=><div key={i} style={s.card}>
        <div style={{...s.row,marginBottom:"8px"}}>
          <span style={s.tag(GOLD)}>{c.postType}</span>
          <span style={{marginLeft:"auto",fontSize:"11px",color:GOLD,fontWeight:"700"}}>{c.reachScore}/100</span>
        </div>
        <ScoreBar score={c.reachScore}/>
        <div style={{marginTop:"10px",fontSize:"12px",lineHeight:"1.6"}}>{c.caption}</div>
        <div style={{marginTop:"8px",display:"flex",flexWrap:"wrap",gap:"3px"}}>
          {c.hashtags&&c.hashtags.map(h=><span key={h} style={{fontSize:"10px",color:GOLD_LIGHT}}>{h}</span>)}
        </div>
        <button style={{...s.btnOut,fontSize:"10px",padding:"4px 10px",marginTop:"8px"}}
          onClick={()=>navigator.clipboard?.writeText(c.caption+"\n\n"+(c.hashtags||[]).join(" "))}>Copy</button>
      </div>)}
    </div>;
  }

  // ---- Viral Analyzer ----
  function ViralAnalyzer(){
    const VIRAL=[
      {type:"Reel",viral:"92%",reach:"85K",eng:"8.2%",color:GOLD},
      {type:"Carousel",viral:"71%",reach:"42K",eng:"6.1%",color:"#5D9CEC"},
      {type:"Static",viral:"38%",reach:"18K",eng:"3.4%",color:"#A0A0A0"},
      {type:"Story",viral:"29%",reach:"12K",eng:"5.8%",color:"#E88C5A"},
    ];
    return <div>
      <LockedFeature feature="viralAnalyzer" plan={plan} onUpgrade={onUpgrade}/>
      {limits.viralAnalyzer&&<div>
        <div style={s.card}>
          <div style={s.sectionTitle}>Format Performance</div>
          {VIRAL.map(v=><div key={v.type} style={{...s.row,padding:"8px 0",borderBottom:`1px solid ${BORDER}`}}>
            <div style={{width:"80px",fontSize:"12px",fontWeight:"600",color:v.color}}>{v.type}</div>
            <div style={{flex:1}}>
              <div style={{...s.row,justifyContent:"space-between",fontSize:"10px",color:TEXT2,marginBottom:"2px"}}>
                <span>Viral Rate</span><span style={{color:v.color}}>{v.viral}</span>
              </div>
              <div style={{background:DARK3,borderRadius:"3px",height:"4px",overflow:"hidden"}}>
                <div style={{width:v.viral,height:"100%",background:v.color,borderRadius:"3px"}}/>
              </div>
            </div>
            <div style={{width:"60px",textAlign:"right",fontSize:"10px",color:TEXT2}}>Avg: {v.reach}</div>
          </div>)}
        </div>
        <div style={s.grid2}>
          <div style={s.card}>
            <div style={s.sectionTitle}>Trending Content</div>
            {[["AI Tools Showcase","92%"],["Before/After","88%"],["Money Tips","85%"],["Tutorial","76%"]].map(([t,v])=>
              <div key={t} style={{...s.row,justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${BORDER}`}}>
                <span style={{fontSize:"11px"}}>{t}</span>
                <span style={{...s.tag(GOLD),fontSize:"9px"}}>{v}</span>
              </div>)}
          </div>
          <div style={s.card}>
            <div style={s.sectionTitle}>Best Hook Styles</div>
            {[["Question Hook","High"],["Number Hook","High"],["Shock Hook","Very High"],["Story Hook","Medium"]].map(([t,l])=>
              <div key={t} style={{...s.row,justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${BORDER}`}}>
                <span style={{fontSize:"11px"}}>{t}</span>
                <span style={{...s.tag(l==="Very High"?GOLD:"#5D9CEC"),fontSize:"9px"}}>{l}</span>
              </div>)}
          </div>
        </div>
      </div>}
    </div>;
  }

  // ---- Reach Predictor ----
  function ReachPredictor(){
    const [post,setPost]=useState({type:"Reel",caption:"",time:"9:00 AM",hasHook:false,hasCTA:false,hasTrending:false});
    const [score,setScore]=useState(null);
    const [loading,setLoading]=useState(false);

    const predict=async()=>{
      if(!post.caption)return;
      setLoading(true);setScore(null);
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,
            messages:[{role:"user",content:`Predict Instagram reach for InstaFlow AI user:
Post Type: ${post.type}
Caption: ${post.caption}
Time: ${post.time}
Hook: ${post.hasHook}, CTA: ${post.hasCTA}, Trending: ${post.hasTrending}
Return ONLY JSON: {"reachScore":75,"reachLevel":"High","estimatedReach":"45K-80K","improvements":["tip1","tip2"],"strengths":["s1"]}`}]})});
        const data=await res.json();
        const txt=data.content.map(i=>i.text||"").join("");
        setScore(JSON.parse(txt.replace(/```json|```/g,"").trim()));
      }catch(e){}
      setLoading(false);
    };

    return <div>
      <LockedFeature feature="reachPredictor" plan={plan} onUpgrade={onUpgrade}/>
      {limits.reachPredictor&&<div>
        <div style={s.cardGold}>
          <div style={s.sectionTitle}>Reach Predictor AI</div>
          <div style={s.grid2}>
            <div><label style={s.label}>Post Type</label>
              <select style={s.select} value={post.type} onChange={e=>setPost(p=>({...p,type:e.target.value}))}>{POST_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label style={s.label}>Posting Time</label>
              <select style={s.select} value={post.time} onChange={e=>setPost(p=>({...p,time:e.target.value}))}>
                {["7:00 AM","9:00 AM","12:00 PM","6:00 PM","9:00 PM"].map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <label style={s.label}>Caption</label>
          <textarea style={{...s.textarea,marginBottom:"8px"}} value={post.caption} onChange={e=>setPost(p=>({...p,caption:e.target.value}))} placeholder="Paste your caption..."/>
          <div style={{...s.row,flexWrap:"wrap",gap:"8px",marginBottom:"10px"}}>
            {[["hasHook","Strong Hook"],["hasCTA","Has CTA"],["hasTrending","Trending Audio"]].map(([k,l])=>
              <label key={k} style={{...s.row,cursor:"pointer",fontSize:"11px",color:TEXT2}}>
                <input type="checkbox" checked={post[k]} onChange={e=>setPost(p=>({...p,[k]:e.target.checked}))} style={{accentColor:GOLD}}/>
                {l}
              </label>)}
          </div>
          <button style={{...s.btn,opacity:loading?0.6:1}} onClick={predict} disabled={loading}>
            {loading?"Analyzing...":"Predict Reach with AI"}
          </button>
        </div>
        {score&&<div>
          <div style={s.cardGold}>
            <div style={{textAlign:"center",padding:"8px 0"}}>
              <div style={{fontSize:"42px",fontWeight:"800",color:score.reachScore>=80?GOLD:score.reachScore>=60?"#5D9CEC":"#E88C5A"}}>{score.reachScore}</div>
              <ScoreBar score={score.reachScore}/>
              <div style={{marginTop:"8px"}}>
                <span style={s.tag(score.reachScore>=80?GOLD:"#5D9CEC")}>{score.reachLevel}</span>
                <span style={{marginLeft:"8px",fontSize:"12px",color:GOLD_LIGHT}}>{score.estimatedReach}</span>
              </div>
            </div>
          </div>
          <div style={s.grid2}>
            <div style={s.card}><div style={s.sectionTitle}>Strengths</div>
              {score.strengths&&score.strengths.map((s2,i)=><div key={i} style={{fontSize:"11px",padding:"4px 0",color:"#5DBE7A"}}>✓ {s2}</div>)}</div>
            <div style={s.card}><div style={s.sectionTitle}>Improvements</div>
              {score.improvements&&score.improvements.map((imp,i)=><div key={i} style={{fontSize:"11px",padding:"4px 0",color:GOLD}}>→ {imp}</div>)}</div>
          </div>
        </div>}
      </div>}
    </div>;
  }

  // ---- Post Manager ----
  function PostManager(){
    const [posts,setPosts]=useState(SAMPLE_POSTS);
    const [filter,setFilter]=useState("All");
    const filtered=filter==="All"?posts:posts.filter(p=>p.status===filter.toLowerCase()||p.type===filter);
    return <div>
      <div style={{...s.row,marginBottom:"10px",flexWrap:"wrap",gap:"5px"}}>
        {["All","Scheduled","Posted","Reel","Carousel"].map(f=>
          <button key={f} style={f===filter?s.btn:s.btnOut} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>
      {filtered.map(p=><div key={p.id} style={{background:DARK3,borderRadius:"8px",padding:"10px",marginBottom:"8px"}}>
        <div style={{...s.row,justifyContent:"space-between",flexWrap:"wrap",gap:"5px"}}>
          <div style={s.row}>
            <span style={s.tag(p.type==="Reel"?GOLD:"#5D9CEC")}>{p.type}</span>
            <span style={{...s.tag(p.status==="posted"?"#5DBE7A":"#E88C5A44")}}>{p.status}</span>
          </div>
          <span style={{fontSize:"10px",color:TEXT2}}>{p.day} · {p.time}</span>
        </div>
        <div style={{fontSize:"12px",marginTop:"6px"}}>{p.caption}</div>
        <ScoreBar score={p.score}/>
        <div style={{...s.row,marginTop:"8px",gap:"5px"}}>
          {p.status==="scheduled"&&<button style={s.btnSm("#5DBE7A")} onClick={()=>setPosts(ps=>ps.map(x=>x.id===p.id?{...x,status:"posted"}:x))}>Mark Posted</button>}
          <button style={s.btnSm("#E88C5A")} onClick={()=>setPosts(ps=>ps.filter(x=>x.id!==p.id))}>Delete</button>
        </div>
      </div>)}
    </div>;
  }

  // ---- Connect IG ----
  function ConnectIG(){
    const [tok,setTok]=useState("");
    const [uid,setUid]=useState("");
    const [uname,setUname]=useState("");
    const [followers,setFollowers]=useState("");
    const [connected,setConnected]=useState(false);
    const [profile,setProfile]=useState(null);
    const [postUrl,setPostUrl]=useState("");
    const [postCaption,setPostCaption]=useState("");
    const [posting,setPosting]=useState(false);
    const [postMsg,setPostMsg]=useState("");
    const [err,setErr]=useState("");

    const connect=()=>{
      if(!tok||!uid||!uname){setErr("Fill all fields.");return;}
      setProfile({username:uname,followers_count:followers||"N/A",id:uid});
      setConnected(true);setErr("");
    };

    const publish=async()=>{
      if(!postUrl||!postCaption){setPostMsg("Add image URL and caption.");return;}
      setPosting(true);setPostMsg("");
      try{
        const r=await fetch(`${BACKEND}/ig/publish`,{
          method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
          body:JSON.stringify({igUserId:uid,imageUrl:postUrl,caption:postCaption+(limits.watermark?"\n\nMade with InstaFlow AI ⚡":""),postType:"Image"})
        });
        const data=await r.json();
        if(data.id)setPostMsg("✅ Published! ID: "+data.id);
        else setPostMsg("Error: "+(data.error?.message||JSON.stringify(data)));
      }catch(e){setPostMsg("Failed: "+e.message);}
      setPosting(false);
    };

    return <div>
      {!connected?<div style={s.cardGold}>
        <div style={s.sectionTitle}>Connect Instagram</div>
        <label style={s.label}>Instagram Username</label>
        <input style={{...s.input,marginBottom:"8px"}} value={uname} onChange={e=>setUname(e.target.value)} placeholder="@_.ai.ads.co_"/>
        <label style={s.label}>Followers Count</label>
        <input style={{...s.input,marginBottom:"8px"}} value={followers} onChange={e=>setFollowers(e.target.value)} placeholder="e.g. 1200"/>
        <label style={s.label}>Instagram User ID</label>
        <input style={{...s.input,marginBottom:"8px"}} value={uid} onChange={e=>setUid(e.target.value)} placeholder="17841432752485627"/>
        <label style={s.label}>Access Token</label>
        <input style={{...s.input,marginBottom:"10px"}} type="password" value={tok} onChange={e=>setTok(e.target.value)} placeholder="IGAAXAyr..."/>
        {err&&<div style={s.err}>{err}</div>}
        <button style={s.btn} onClick={connect}>Connect Instagram</button>
      </div>
      :<div>
        <div style={s.cardGold}>
          <div style={s.row}>
            <div style={{width:"44px",height:"44px",borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:"800",color:DARK}}>
              {profile.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:"14px",fontWeight:"700",color:GOLD}}>@{profile.username}</div>
              <div style={{fontSize:"11px",color:"#5DBE7A"}}>✅ Connected</div>
            </div>
            <div style={{marginLeft:"auto",textAlign:"right"}}>
              <div style={{fontSize:"16px",fontWeight:"700",color:GOLD}}>{profile.followers_count}</div>
              <div style={{fontSize:"10px",color:TEXT2}}>Followers</div>
            </div>
          </div>
        </div>
        {limits.watermark&&<div style={s.lock}>
          <span>⚠️</span>
          <div style={{fontSize:"11px",color:"#E88C5A",flex:1}}>Watermark "Made with InstaFlow AI" will be added to posts</div>
          <button style={s.btnSm()} onClick={onUpgrade}>Remove →</button>
        </div>}
        <div style={s.cardGold}>
          <div style={s.sectionTitle}>Publish Post</div>
          <label style={s.label}>Public Image URL (.jpg/.png)</label>
          <input style={{...s.input,marginBottom:"8px"}} value={postUrl} onChange={e=>setPostUrl(e.target.value)} placeholder="https://imgur.com/image.jpg"/>
          <label style={s.label}>Caption</label>
          <textarea style={{...s.textarea,marginBottom:"8px"}} value={postCaption} onChange={e=>setPostCaption(e.target.value)} placeholder="Your caption + hashtags..."/>
          {postMsg&&<div style={{fontSize:"11px",color:postMsg.startsWith("✅")?"#5DBE7A":"#E88C5A",marginBottom:"8px"}}>{postMsg}</div>}
          <div style={s.row}>
            <button style={{...s.btn,opacity:posting?0.6:1}} onClick={publish} disabled={posting}>{posting?"Publishing...":"Publish to Instagram"}</button>
            <button style={s.btnOut} onClick={()=>setConnected(false)}>Disconnect</button>
          </div>
        </div>
      </div>}
    </div>;
  }

  const TABS=[Dashboard,Scheduler,AICaptions,ViralAnalyzer,ReachPredictor,PostManager,ConnectIG];
  const Tab=TABS[tab];
  const planLimits=PLAN_LIMITS[plan];

  return <div style={s.app}>
    <div style={s.header}>
      <div style={s.logo}>⚡ InstaFlow AI</div>
      <div style={s.row}>
        <span style={{fontSize:"11px",color:TEXT2}}>👤 {user.name}</span>
        <span style={s.tag(planLimits.color)}>{planLimits.name}</span>
        <button style={{...s.btnSm(),fontSize:"10px"}} onClick={onUpgrade}>⚡ Upgrade</button>
        <button style={{...s.btnOut,fontSize:"10px",padding:"4px 10px",color:TEXT2,borderColor:BORDER}} onClick={onLogout}>Logout</button>
      </div>
    </div>
    <div style={s.nav}>
      {NAV_ITEMS.map((n,i)=><button key={n} style={s.navBtn(tab===i)} onClick={()=>setTab(i)}>{NAV_ICONS[i]} {n}</button>)}
    </div>
    <div style={s.content}><Tab/></div>
  </div>;
}

// ==================== ROOT ====================
export default function App(){
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("if_user"));}catch{return null;}});
  const [token,setToken]=useState(()=>localStorage.getItem("if_token")||"");
  const [page,setPage]=useState(()=>localStorage.getItem("if_user")?"dashboard":"auth");

  const onLogin=(u,t)=>{setUser(u);setToken(t);setPage("dashboard");};
  const logout=()=>{localStorage.removeItem("if_token");localStorage.removeItem("if_user");setUser(null);setToken("");setPage("auth");};

  if(!user||page==="auth") return <AuthPage onLogin={onLogin}/>;
  if(page==="pricing") return <PricingPage user={user} onBack={()=>setPage("dashboard")}/>;
  return <MainApp user={user} token={token} onUpgrade={()=>setPage("pricing")} onLogout={logout}/>;
}
