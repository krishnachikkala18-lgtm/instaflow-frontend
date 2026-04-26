import { useState, useEffect } from "react";

const BACKEND = "https://krishna-ai-backend-had6.onrender.com";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#F0D080";
const DARK = "#0A0A0A";
const DARK2 = "#111111";
const DARK3 = "#1A1A1A";
const DARK4 = "#222222";
const BORDER = "#2A2A2A";
const TEXT = "#F5F5F5";
const TEXT2 = "#888";
const ACCENT = "#7C3AED";
const ACCENT2 = "#06B6D4";

const PLAN_LIMITS = {
  free:    { name:"Free",       price:0,   color:"#555",    accounts:1,  posts:5,   captions:3,   autoPost:false, scheduler:false, reachPredictor:false, viralAnalyzer:false, watermark:true  },
  starter: { name:"Starter",    price:9,   color:GOLD,      accounts:1,  posts:30,  captions:999, autoPost:true,  scheduler:true,  reachPredictor:true,  viralAnalyzer:true,  watermark:false },
  pro:     { name:"Pro",        price:19,  color:ACCENT,    accounts:3,  posts:999, captions:999, autoPost:true,  scheduler:true,  reachPredictor:true,  viralAnalyzer:true,  watermark:false },
  agency:  { name:"Agency",     price:49,  color:ACCENT2,   accounts:10, posts:999, captions:999, autoPost:true,  scheduler:true,  reachPredictor:true,  viralAnalyzer:true,  watermark:false },
};

const NAV_ITEMS = ["Dashboard","Scheduler","AI Caption","Viral Analyzer","Reach Predictor","Post Manager","Connect IG"];
const NAV_ICONS = ["⬡","◈","✦","◉","▲","⚡","◎"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const POST_TYPES = ["Reel","Carousel","Static Image","Story"];
const NICHES = ["AI Video Ads","Digital Marketing","Personal Finance","Home Fitness","Tech"];
const TONES = ["Professional","Viral","Casual","Telugu+English","Storytelling"];

const s = {
  app:{background:DARK,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:TEXT,display:"flex",flexDirection:"column"},
  glow:{boxShadow:`0 0 30px ${GOLD}33`},
  glowAccent:{boxShadow:`0 0 30px ${ACCENT}44`},
  header:{background:`${DARK2}ee`,backdropFilter:"blur(20px)",borderBottom:`1px solid ${BORDER}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100},
  logo:{background:`linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:"900",fontSize:"18px",letterSpacing:"2px"},
  nav:{display:"flex",gap:"3px",flexWrap:"wrap",padding:"8px 16px",background:DARK2,borderBottom:`1px solid ${BORDER}`},
  navBtn:(a)=>({background:a?`linear-gradient(135deg,${GOLD}22,${GOLD}11)`:"transparent",color:a?GOLD:TEXT2,border:`1px solid ${a?GOLD:BORDER}`,borderRadius:"8px",padding:"6px 12px",cursor:"pointer",fontSize:"11px",fontWeight:a?"700":"400",transition:"all 0.2s"}),
  content:{flex:1,padding:"16px",overflowY:"auto"},
  card:{background:DARK2,border:`1px solid ${BORDER}`,borderRadius:"16px",padding:"16px",marginBottom:"14px"},
  cardGold:{background:`linear-gradient(135deg,${DARK2},${DARK3})`,border:`1px solid ${GOLD}44`,borderRadius:"16px",padding:"16px",marginBottom:"14px",boxShadow:`0 4px 20px ${GOLD}11`},
  cardAccent:{background:`linear-gradient(135deg,${DARK2},${DARK3})`,border:`1px solid ${ACCENT}44`,borderRadius:"16px",padding:"16px",marginBottom:"14px"},
  sectionTitle:{background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:"11px",fontWeight:"800",letterSpacing:"2px",marginBottom:"12px",textTransform:"uppercase"},
  grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},
  grid4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"},
  statCard:{background:`linear-gradient(135deg,${DARK3},${DARK4})`,borderRadius:"12px",padding:"14px",textAlign:"center",border:`1px solid ${BORDER}`},
  statNum:{fontSize:"24px",fontWeight:"800",background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  statLabel:{fontSize:"10px",color:TEXT2,marginTop:"4px"},
  btn:{background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,color:DARK,border:"none",borderRadius:"10px",padding:"10px 18px",cursor:"pointer",fontWeight:"800",fontSize:"12px",letterSpacing:"0.5px"},
  btnAccent:{background:`linear-gradient(135deg,${ACCENT},#9F67FF)`,color:TEXT,border:"none",borderRadius:"10px",padding:"10px 18px",cursor:"pointer",fontWeight:"700",fontSize:"12px"},
  btnOut:{background:"transparent",color:GOLD,border:`1px solid ${GOLD}55`,borderRadius:"10px",padding:"9px 16px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},
  btnSm:(c)=>({background:c||`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,color:DARK,border:"none",borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontWeight:"700",fontSize:"11px"}),
  input:{background:DARK3,border:`1px solid ${BORDER}`,borderRadius:"10px",padding:"10px 14px",color:TEXT,fontSize:"13px",width:"100%",boxSizing:"border-box",outline:"none"},
  select:{background:DARK3,border:`1px solid ${BORDER}`,borderRadius:"10px",padding:"10px 14px",color:TEXT,fontSize:"13px",width:"100%",boxSizing:"border-box"},
  textarea:{background:DARK3,border:`1px solid ${BORDER}`,borderRadius:"10px",padding:"10px 14px",color:TEXT,fontSize:"13px",width:"100%",boxSizing:"border-box",minHeight:"90px",resize:"vertical"},
  tag:(c)=>({background:c?`${c}22`:DARK3,color:c||TEXT2,borderRadius:"6px",padding:"3px 10px",fontSize:"10px",fontWeight:"700",display:"inline-block",border:`1px solid ${c?c+"44":BORDER}`}),
  row:{display:"flex",alignItems:"center",gap:"10px"},
  lock:{background:`#E88C5A11`,border:"1px solid #E88C5A33",borderRadius:"12px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"},
  err:{color:"#FF6B6B",fontSize:"11px",marginTop:"6px"},
  success:{color:"#4ADE80",fontSize:"11px",marginTop:"6px"},
  label:{fontSize:"11px",color:TEXT2,marginBottom:"5px",display:"block",fontWeight:"500"},
};

function ScoreBar({score,color}){
  const c=color||(score>=80?GOLD:score>=60?ACCENT:"#E88C5A");
  return <div style={{marginTop:"6px"}}>
    <div style={{background:DARK3,borderRadius:"4px",height:"6px",overflow:"hidden"}}>
      <div style={{width:`${score}%`,height:"100%",background:`linear-gradient(90deg,${c},${c}99)`,borderRadius:"4px",transition:"width 0.8s ease"}}/>
    </div>
    <div style={{fontSize:"10px",color:c,marginTop:"3px",fontWeight:"600"}}>{score}/100</div>
  </div>;
}

function LockedFeature({feature,plan,onUpgrade}){
  const limits=PLAN_LIMITS[plan||"free"];
  if(limits[feature]) return null;
  return <div style={s.lock}>
    <div style={{fontSize:"20px"}}>🔒</div>
    <div style={{flex:1}}>
      <div style={{fontSize:"12px",fontWeight:"700",color:"#E88C5A"}}>Locked on {limits.name} plan</div>
      <div style={{fontSize:"10px",color:TEXT2,marginTop:"2px"}}>Upgrade to unlock this feature</div>
    </div>
    <button style={s.btnSm()} onClick={onUpgrade}>Upgrade ⚡</button>
  </div>;
}

// ==================== AUTH PAGE ====================
function AuthPage({onLogin}){
  const [mode,setMode]=useState("login");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");
  const [step,setStep]=useState(0);

  useEffect(()=>{
    const t=setInterval(()=>setStep(s=>(s+1)%4),2000);
    return()=>clearInterval(t);
  },[]);

  const features=[
    {icon:"🤖",title:"AI Caption Generator",desc:"Generate viral captions in seconds"},
    {icon:"📅",title:"Smart Scheduler",desc:"Auto-post at the perfect time"},
    {icon:"📈",title:"Reach Predictor",desc:"Know your reach before posting"},
    {icon:"🔥",title:"Viral Analyzer",desc:"Find what content goes viral"},
  ];

  const submit=async()=>{
    if(!email||!pass){setErr("Please fill all fields.");return;}
    if(mode==="register"&&!name){setErr("Enter your name.");return;}
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
        setMsg(mode==="login"?"Welcome back! 👋":"Account created! 🎉");
        setTimeout(()=>onLogin(data.user,data.token),800);
      }
    }catch(e){setErr("Server error. Try again.");}
    setLoading(false);
  };

  return <div style={{...s.app,minHeight:"100vh",background:`radial-gradient(ellipse at top,#1a0a2e 0%,${DARK} 60%)`}}>
    {/* Animated background */}
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <div style={{position:"absolute",top:"10%",left:"10%",width:"300px",height:"300px",background:`${ACCENT}11`,borderRadius:"50%",filter:"blur(80px)",animation:"pulse 4s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"20%",right:"10%",width:"250px",height:"250px",background:`${GOLD}11`,borderRadius:"50%",filter:"blur(80px)"}}/>
    </div>

    <div style={{position:"relative",zIndex:1,display:"flex",minHeight:"100vh",flexDirection:"window.innerWidth>768?row:column"}}>
      {/* Left side — Hero */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px",maxWidth:"520px"}}>
        <div style={{marginBottom:"32px"}}>
          <div style={{fontSize:"13px",color:ACCENT,fontWeight:"700",letterSpacing:"3px",marginBottom:"12px"}}>⚡ AI-POWERED INSTAGRAM AUTOMATION</div>
          <div style={{fontSize:"42px",fontWeight:"900",lineHeight:"1.1",marginBottom:"16px"}}>
            <span style={{background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>InstaFlow</span>
            <span style={{color:TEXT}}> AI</span>
          </div>
          <div style={{fontSize:"16px",color:TEXT2,lineHeight:"1.6"}}>Automate your Instagram growth with AI. Schedule posts, generate viral captions, and predict your reach — all in one place.</div>
        </div>

        {/* Animated feature cards */}
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {features.map((f,i)=><div key={i} style={{...s.card,padding:"14px 16px",border:`1px solid ${i===step?GOLD+"66":BORDER}`,transition:"all 0.3s",transform:i===step?"translateX(8px)":"translateX(0)",background:i===step?`${GOLD}08`:DARK2}}>
            <div style={s.row}>
              <span style={{fontSize:"22px"}}>{f.icon}</span>
              <div>
                <div style={{fontSize:"13px",fontWeight:"700",color:i===step?GOLD:TEXT}}>{f.title}</div>
                <div style={{fontSize:"11px",color:TEXT2}}>{f.desc}</div>
              </div>
              {i===step&&<div style={{marginLeft:"auto",width:"6px",height:"6px",borderRadius:"50%",background:GOLD,boxShadow:`0 0 8px ${GOLD}`}}/>}
            </div>
          </div>)}
        </div>

        <div style={{marginTop:"24px",display:"flex",gap:"24px"}}>
          {[["500+","Creators"],["10M+","Posts scheduled"],["3x","More reach"]].map(([v,l])=>
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:"20px",fontWeight:"800",color:GOLD}}>{v}</div>
              <div style={{fontSize:"10px",color:TEXT2}}>{l}</div>
            </div>)}
        </div>
      </div>

      {/* Right side — Auth form */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"40px",flex:"0 0 420px"}}>
        <div style={{width:"100%",maxWidth:"380px"}}>
          <div style={{...s.cardGold,padding:"28px",boxShadow:`0 20px 60px ${GOLD}11`}}>
            <div style={{textAlign:"center",marginBottom:"24px"}}>
              <div style={{fontSize:"22px",fontWeight:"900",color:GOLD,marginBottom:"4px"}}>
                {mode==="login"?"Welcome Back 👋":"Get Started Free 🚀"}
              </div>
              <div style={{fontSize:"12px",color:TEXT2}}>
                {mode==="login"?"Sign in to your InstaFlow AI account":"Create your free account — no credit card needed"}
              </div>
            </div>

            <div style={{display:"flex",marginBottom:"20px",background:DARK3,borderRadius:"10px",padding:"3px"}}>
              {["login","register"].map(m=><button key={m} onClick={()=>{setMode(m);setErr("");}}
                style={{flex:1,padding:"9px",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:"700",fontSize:"12px",
                  background:mode===m?`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`:"transparent",
                  color:mode===m?DARK:TEXT2,transition:"all 0.2s"}}>
                {m==="login"?"Login":"Sign Up Free"}
              </button>)}
            </div>

            {mode==="register"&&<div style={{marginBottom:"12px"}}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
            </div>}
            <div style={{marginBottom:"12px"}}>
              <label style={s.label}>Email Address</label>
              <input style={s.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com"/>
            </div>
            <div style={{marginBottom:"16px"}}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
            </div>

            {err&&<div style={s.err}>⚠ {err}</div>}
            {msg&&<div style={s.success}>✅ {msg}</div>}

            <button style={{...s.btn,width:"100%",padding:"13px",fontSize:"14px",marginTop:"8px",opacity:loading?0.7:1,letterSpacing:"1px"}}
              onClick={submit} disabled={loading}>
              {loading?"Please wait...":mode==="login"?"LOGIN →":"CREATE FREE ACCOUNT →"}
            </button>

            <div style={{textAlign:"center",marginTop:"16px",fontSize:"12px",color:TEXT2}}>
              {mode==="login"?"New to InstaFlow AI? ":"Already have an account? "}
              <span style={{color:GOLD,cursor:"pointer",fontWeight:"700"}} onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}}>
                {mode==="login"?"Sign up free →":"Login →"}
              </span>
            </div>

            {mode==="register"&&<div style={{marginTop:"16px",padding:"12px",background:DARK3,borderRadius:"10px",textAlign:"center"}}>
              <div style={{fontSize:"11px",color:TEXT2}}>🔒 Secure · No spam · Cancel anytime</div>
              <div style={{fontSize:"11px",color:GOLD,marginTop:"4px",fontWeight:"600"}}>Free plan includes 5 posts + 3 AI captions/day</div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

// ==================== PRICING PAGE ====================
function PricingPage({user,onBack}){
  const [loading,setLoading]=useState(null);
  const [msg,setMsg]=useState("");
  const [annual,setAnnual]=useState(false);
  const plan=user.plan||"free";

  const subscribe=(planId)=>{
    if(planId==="free"){setMsg("You are already on Free plan.");return;}
    const p=PLAN_LIMITS[planId];
    const price=annual?Math.floor(p.price*10):p.price;
    setLoading(planId);
    const opts={
      key:"rzp_test_Si6xe6pWT9hoDQ",
      amount:price*100*83, // USD to INR approx
      currency:"INR",
      name:"InstaFlow AI",
      description:`${p.name} Plan ${annual?"(Annual)":"(Monthly)"}`,
      handler:(r)=>{setMsg(`✅ Welcome to ${p.name}! Payment ID: ${r.razorpay_payment_id}`);setLoading(null);},
      prefill:{name:user.name,email:user.email},
      theme:{color:GOLD},
    };
    const open=()=>{const rz=new window.Razorpay(opts);rz.open();setLoading(null);};
    if(window.Razorpay){open();return;}
    const sc=document.createElement("script");
    sc.src="https://checkout.razorpay.com/v1/checkout.js";
    sc.onload=open;document.body.appendChild(sc);
  };

  const plans=[
    {id:"free",features:["1 Instagram account","5 posts/month","3 AI captions/day","Basic analytics","InstaFlow watermark"],notIncluded:["Auto-posting","Scheduler","Reach Predictor","Viral Analyzer"]},
    {id:"starter",features:["1 Instagram account","30 posts/month","Unlimited AI captions","Full Viral Analyzer","Reach Predictor","Smart Scheduler","Auto-posting","Email support"],notIncluded:["Multiple accounts","White label"]},
    {id:"pro",features:["3 Instagram accounts","Unlimited posts","All AI features","Full auto-posting","Competitor analysis","Weekly reports","Priority support","No watermark"],notIncluded:["White label","10 accounts"]},
    {id:"agency",features:["10 Instagram accounts","Unlimited everything","Client dashboard","White label ready","API access","Custom onboarding","Dedicated support","SLA guarantee"],notIncluded:[]},
  ];

  return <div style={{...s.app,background:`radial-gradient(ellipse at top,#0d0520 0%,${DARK} 50%)`}}>
    <div style={s.header}>
      <div style={s.logo}>⚡ InstaFlow AI</div>
      <div style={s.row}>
        <span style={s.tag(PLAN_LIMITS[plan].color)}>{PLAN_LIMITS[plan].name} Plan</span>
        <button style={s.btnOut} onClick={onBack}>← Dashboard</button>
      </div>
    </div>

    <div style={{padding:"32px 20px",maxWidth:"900px",margin:"0 auto",width:"100%"}}>
      <div style={{textAlign:"center",marginBottom:"36px"}}>
        <div style={{fontSize:"13px",color:ACCENT,fontWeight:"700",letterSpacing:"3px",marginBottom:"10px"}}>SIMPLE PRICING</div>
        <div style={{fontSize:"34px",fontWeight:"900",marginBottom:"10px"}}>
          <span style={{background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Choose Your Plan</span>
        </div>
        <div style={{fontSize:"14px",color:TEXT2,marginBottom:"20px"}}>Start free. Upgrade as you grow. Cancel anytime.</div>

        {/* Annual toggle */}
        <div style={{display:"inline-flex",alignItems:"center",gap:"12px",background:DARK2,padding:"8px 16px",borderRadius:"30px",border:`1px solid ${BORDER}`}}>
          <span style={{fontSize:"12px",color:annual?TEXT2:GOLD,fontWeight:"600"}}>Monthly</span>
          <div onClick={()=>setAnnual(!annual)} style={{width:"40px",height:"22px",borderRadius:"11px",background:annual?GOLD:DARK3,cursor:"pointer",position:"relative",transition:"all 0.3s"}}>
            <div style={{position:"absolute",top:"3px",left:annual?"19px":"3px",width:"16px",height:"16px",borderRadius:"50%",background:annual?DARK:TEXT2,transition:"all 0.3s"}}/>
          </div>
          <span style={{fontSize:"12px",color:annual?GOLD:TEXT2,fontWeight:"600"}}>Annual <span style={{color:"#4ADE80",fontSize:"10px"}}>Save 17%</span></span>
        </div>
      </div>

      {msg&&<div style={{...s.cardGold,textAlign:"center",color:msg.startsWith("✅")?"#4ADE80":"#FF6B6B",fontSize:"13px",marginBottom:"20px"}}>{msg}</div>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px"}}>
        {plans.map(p=>{
          const limits=PLAN_LIMITS[p.id];
          const isCurrent=plan===p.id;
          const price=annual&&limits.price>0?Math.floor(limits.price*10):limits.price;
          return <div key={p.id} style={{background:p.id==="pro"?`linear-gradient(135deg,${DARK2},${ACCENT}11)`:DARK2,
            border:`2px solid ${isCurrent?"#4ADE80":p.id==="pro"?ACCENT:limits.color+"44"}`,
            borderRadius:"20px",padding:"24px",position:"relative",overflow:"hidden",
            boxShadow:p.id==="pro"?`0 8px 32px ${ACCENT}22`:"none"}}>

            {p.id==="pro"&&<div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${ACCENT},#9F67FF,${ACCENT2})`}}/>}
            {p.id==="pro"&&<div style={{position:"absolute",top:"16px",right:"16px",background:`linear-gradient(135deg,${ACCENT},#9F67FF)`,color:TEXT,fontSize:"9px",fontWeight:"800",padding:"4px 10px",borderRadius:"20px",letterSpacing:"1px"}}>MOST POPULAR</div>}
            {isCurrent&&<div style={{position:"absolute",top:"16px",right:"16px",background:"#4ADE8022",color:"#4ADE80",fontSize:"9px",fontWeight:"800",padding:"4px 10px",borderRadius:"20px",border:"1px solid #4ADE8055"}}>CURRENT ✓</div>}

            <div style={{fontSize:"13px",fontWeight:"800",color:limits.color,letterSpacing:"1px",marginBottom:"8px",textTransform:"uppercase"}}>{limits.name}</div>
            <div style={{marginBottom:"4px"}}>
              <span style={{fontSize:"36px",fontWeight:"900",color:TEXT}}>{limits.price===0?"Free":`$${annual&&limits.price>0?Math.floor(limits.price*10):limits.price}`}</span>
              {limits.price>0&&<span style={{fontSize:"13px",color:TEXT2}}>/{annual?"year":"month"}</span>}
            </div>
            {annual&&limits.price>0&&<div style={{fontSize:"11px",color:"#4ADE80",marginBottom:"12px"}}>= ${limits.price}/mo billed annually</div>}
            <div style={{fontSize:"11px",color:TEXT2,marginBottom:"20px",paddingBottom:"16px",borderBottom:`1px solid ${BORDER}`}}>
              {limits.accounts} account{limits.accounts>1?"s":" only"} · {limits.posts===999?"Unlimited":limits.posts} posts/mo
            </div>

            {p.features.map(f=><div key={f} style={{fontSize:"12px",color:TEXT,padding:"5px 0",display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{color:"#4ADE80",fontSize:"14px",fontWeight:"700"}}>✓</span>{f}
            </div>)}
            {p.notIncluded.map(f=><div key={f} style={{fontSize:"12px",color:"#444",padding:"4px 0",display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{fontSize:"14px"}}>✗</span>{f}
            </div>)}

            <button style={{width:"100%",padding:"12px",marginTop:"20px",border:"none",borderRadius:"12px",cursor:"pointer",fontWeight:"800",fontSize:"13px",
              background:isCurrent?"#222":p.id==="pro"?`linear-gradient(135deg,${ACCENT},#9F67FF)`:limits.price===0?DARK3:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,
              color:isCurrent?TEXT2:p.id==="pro"||limits.price===0?TEXT:DARK,
              opacity:loading===p.id?0.7:1,letterSpacing:"0.5px"}}
              onClick={()=>subscribe(p.id)} disabled={isCurrent||loading===p.id}>
              {isCurrent?"Current Plan ✓":loading===p.id?"Processing...":(limits.price===0?"Downgrade to Free":`Upgrade → $${price}/${annual?"yr":"mo"}`)}
            </button>
          </div>;
        })}
      </div>

      <div style={{textAlign:"center",marginTop:"24px",fontSize:"11px",color:TEXT2}}>
        🔒 Secure payments · Cancel anytime · 7-day money back guarantee
      </div>
    </div>
  </div>;
}

// ==================== MAIN APP ====================
const SAMPLE_POSTS=[
  {id:1,type:"Reel",caption:"5 AI tools that replace your entire marketing team 🤖",time:"9:00 AM",day:"Mon",reach:"High",score:92,status:"scheduled"},
  {id:2,type:"Carousel",caption:"How I made $5K from Instagram in 30 days",time:"6:00 PM",day:"Wed",reach:"High",score:88,status:"scheduled"},
  {id:3,type:"Reel",caption:"AI video ads ela create cheyyali 🎬",time:"7:00 PM",day:"Sat",reach:"High",score:95,status:"posted"},
];

function MainApp({user,token,onUpgrade,onLogout}){
  const [tab,setTab]=useState(0);
  const plan=user.plan||"free";
  const limits=PLAN_LIMITS[plan];

  function Dashboard(){
    return <div>
      {/* Welcome banner */}
      <div style={{...s.cardGold,background:`linear-gradient(135deg,${DARK2},#1a0a2e)`,border:`1px solid ${ACCENT}44`,marginBottom:"16px"}}>
        <div style={s.row}>
          <div>
            <div style={{fontSize:"20px",fontWeight:"800",marginBottom:"4px"}}>
              Good day, <span style={{background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{user.name}! 👋</span>
            </div>
            <div style={{fontSize:"12px",color:TEXT2}}>You're on the <span style={{color:limits.color,fontWeight:"700"}}>{limits.name} plan</span> · {limits.posts===999?"Unlimited":limits.posts} posts/month</div>
          </div>
          <button style={{...s.btn,marginLeft:"auto",fontSize:"11px"}} onClick={onUpgrade}>⚡ Upgrade</button>
        </div>
      </div>

      <div style={s.grid4}>
        {[["Posts This Week","7",GOLD,"📅"],["Posted","3","#4ADE80","✅"],["Remaining","4","#E88C5A","⏳"],["Avg Reach","58K",ACCENT,"📈"]].map(([l,v,c,icon])=>
          <div key={l} style={{...s.statCard,border:`1px solid ${c}22`}}>
            <div style={{fontSize:"20px",marginBottom:"6px"}}>{icon}</div>
            <div style={{...s.statNum,background:`linear-gradient(135deg,${c},${c}99)`,WebkitBackgroundClip:"text"}}>{v}</div>
            <div style={s.statLabel}>{l}</div>
          </div>)}
      </div>

      {limits.watermark&&<div style={{...s.lock,marginTop:"12px"}}>
        <span style={{fontSize:"18px"}}>⚠️</span>
        <div style={{flex:1}}>
          <div style={{fontSize:"12px",fontWeight:"700",color:"#E88C5A"}}>Free plan watermark active</div>
          <div style={{fontSize:"10px",color:TEXT2}}>"Made with InstaFlow AI" is added to your posts</div>
        </div>
        <button style={s.btnSm()} onClick={onUpgrade}>Remove →</button>
      </div>}

      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.sectionTitle}>This Week</div>
          {DAYS.map(d=>{
            const p=SAMPLE_POSTS.filter(x=>x.day===d);
            return <div key={d} style={{...s.row,justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${BORDER}`}}>
              <span style={{fontSize:"11px",color:TEXT2,width:"30px",fontWeight:"600"}}>{d}</span>
              <div style={{flex:1,display:"flex",gap:"4px"}}>
                {p.length?p.map(x=><span key={x.id} style={s.tag(x.status==="posted"?"#4ADE80":GOLD)}>{x.type}</span>)
                :<span style={{fontSize:"10px",color:BORDER}}>Empty</span>}
              </div>
              <span style={{fontSize:"10px",color:p.length?GOLD:TEXT2}}>{p.length?p[0].time:""}</span>
            </div>;
          })}
        </div>
        <div style={s.card}>
          <div style={s.sectionTitle}>Usage This Month</div>
          {[["Posts",3,limits.posts,GOLD],["Captions Today",1,limits.captions,ACCENT],["Accounts",1,limits.accounts,ACCENT2]].map(([l,u,t,c])=>
            <div key={l} style={{marginBottom:"14px"}}>
              <div style={{...s.row,justifyContent:"space-between",fontSize:"11px",marginBottom:"5px"}}>
                <span style={{color:TEXT2}}>{l}</span>
                <span style={{color:t===999?"#4ADE80":c,fontWeight:"700"}}>{t===999?"∞ Unlimited":`${u}/${t}`}</span>
              </div>
              {t!==999&&<div style={{background:DARK3,borderRadius:"4px",height:"5px",overflow:"hidden"}}>
                <div style={{width:`${(u/t)*100}%`,height:"100%",background:`linear-gradient(90deg,${c},${c}88)`,borderRadius:"4px"}}/>
              </div>}
            </div>)}
          <button style={{...s.btn,width:"100%",marginTop:"8px"}} onClick={onUpgrade}>⚡ Upgrade Plan</button>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>Upcoming Posts</div>
        {SAMPLE_POSTS.filter(p=>p.status==="scheduled").map(p=><div key={p.id} style={{...s.row,justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${BORDER}`}}>
          <span style={s.tag(p.type==="Reel"?GOLD:ACCENT)}>{p.type}</span>
          <span style={{fontSize:"12px",flex:1,marginLeft:"10px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.caption}</span>
          <span style={{fontSize:"10px",color:TEXT2,whiteSpace:"nowrap"}}>{p.day} · {p.time}</span>
          <span style={s.tag(p.reach==="High"?GOLD:ACCENT)}>{p.reach}</span>
        </div>)}
      </div>
    </div>;
  }

  function Scheduler(){
    const [posts,setPosts]=useState(SAMPLE_POSTS);
    const [form,setForm]=useState({type:"Reel",caption:"",time:"9:00 AM",day:"Mon"});
    const [adding,setAdding]=useState(false);
    const add=()=>{
      if(!form.caption)return;
      if(!limits.scheduler){onUpgrade();return;}
      setPosts(p=>[...p,{...form,id:Date.now(),reach:"Medium",score:70,status:"scheduled"}]);
      setForm({type:"Reel",caption:"",time:"9:00 AM",day:"Mon"});setAdding(false);
    };
    return <div>
      <LockedFeature feature="scheduler" plan={plan} onUpgrade={onUpgrade}/>
      <div style={{...s.row,marginBottom:"12px"}}>
        <button style={s.btn} onClick={()=>limits.scheduler?setAdding(!adding):onUpgrade()}>+ Schedule Post</button>
        <span style={{fontSize:"11px",color:TEXT2}}>{limits.posts===999?"Unlimited":posts.filter(p=>p.status==="scheduled").length+"/"+limits.posts} posts</span>
      </div>
      {adding&&limits.scheduler&&<div style={s.cardGold}>
        <div style={s.sectionTitle}>New Scheduled Post</div>
        <div style={s.grid2}>
          <div><label style={s.label}>Post Type</label>
            <select style={s.select} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{POST_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={s.label}>Day</label>
            <select style={s.select} value={form.day} onChange={e=>setForm(f=>({...f,day:e.target.value}))}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
          <div><label style={s.label}>Best Time</label>
            <select style={s.select} value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}>
              {["7:00 AM","9:00 AM","12:00 PM","6:00 PM","9:00 PM"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={s.label}>Caption</label>
            <input style={s.input} value={form.caption} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} placeholder="Your caption..."/></div>
        </div>
        <div style={{...s.row,marginTop:"12px"}}>
          <button style={s.btn} onClick={add}>Schedule →</button>
          <button style={s.btnOut} onClick={()=>setAdding(false)}>Cancel</button>
        </div>
      </div>}
      <div style={s.card}>
        <div style={s.sectionTitle}>Weekly Calendar</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"6px"}}>
          {DAYS.map(d=>{
            const dp=posts.filter(p=>p.day===d);
            return <div key={d} style={{background:DARK3,borderRadius:"10px",padding:"8px",minHeight:"90px",border:`1px solid ${BORDER}`}}>
              <div style={{fontSize:"10px",color:GOLD,fontWeight:"800",marginBottom:"6px"}}>{d}</div>
              {dp.map(p=><div key={p.id} style={{background:p.status==="posted"?`#4ADE8011`:DARK4,border:`1px solid ${p.status==="posted"?"#4ADE8033":BORDER}`,borderRadius:"6px",padding:"5px",marginBottom:"3px"}}>
                <div style={{fontSize:"8px",color:GOLD,fontWeight:"700"}}>{p.type}</div>
                <div style={{fontSize:"8px",color:TEXT2}}>{p.time}</div>
              </div>)}
            </div>;
          })}
        </div>
      </div>
    </div>;
  }

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
      if(!topic){setErr("Enter a topic first.");return;}
      if(limits.captions!==999&&used>=limits.captions){
        setErr(`Daily limit reached (${limits.captions}/day on ${limits.name} plan). Upgrade for unlimited!`);return;}
      setLoading(true);setCaptions([]);setErr("");
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
            messages:[{role:"user",content:`You are an Instagram expert for InstaFlow AI.
Generate 3 high-performing Instagram captions:
Topic: ${topic}, Niche: ${niche}, Tone: ${tone}, Language: ${lang}
${limits.watermark?"Add 'Made with InstaFlow AI ⚡' at caption end.":""}
Return ONLY JSON array (no markdown):
[{"caption":"...","hashtags":["#tag1"],"postType":"Reel","reachScore":85}]`}]})});
        const data=await res.json();
        const txt=data.content.map(i=>i.text||"").join("");
        setCaptions(JSON.parse(txt.replace(/```json|```/g,"").trim()));
        setUsed(u=>u+1);
      }catch(e){setErr("Generation failed. Try again.");}
      setLoading(false);
    };

    return <div>
      {limits.captions!==999&&<div style={{background:`${GOLD}11`,border:`1px solid ${GOLD}33`,borderRadius:"12px",padding:"10px 14px",marginBottom:"12px",fontSize:"11px",color:GOLD,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>AI Captions: <strong>{used}/{limits.captions}</strong> used today</span>
        <span style={{cursor:"pointer",fontWeight:"700"}} onClick={onUpgrade}>Upgrade for unlimited →</span>
      </div>}
      <div style={s.cardGold}>
        <div style={s.sectionTitle}>AI Caption Generator</div>
        <div style={s.grid2}>
          <div><label style={s.label}>Topic / Idea</label>
            <input style={s.input} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. AI video ads for brands"/></div>
          <div><label style={s.label}>Niche</label>
            <select style={s.select} value={niche} onChange={e=>setNiche(e.target.value)}>{NICHES.map(n=><option key={n}>{n}</option>)}</select></div>
          <div><label style={s.label}>Tone</label>
            <select style={s.select} value={tone} onChange={e=>setTone(e.target.value)}>{TONES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={s.label}>Language</label>
            <select style={s.select} value={lang} onChange={e=>setLang(e.target.value)}>
              {["English","Telugu","Telugu + English"].map(l=><option key={l}>{l}</option>)}</select></div>
        </div>
        {err&&<div style={s.err}>{err}</div>}
        <button style={{...s.btn,marginTop:"12px",opacity:loading?0.6:1,padding:"12px 20px"}} onClick={generate} disabled={loading}>
          {loading?"✦ Generating...":"✦ Generate with AI"}
        </button>
      </div>
      {captions.map((c,i)=><div key={i} style={{...s.card,border:`1px solid ${GOLD}22`}}>
        <div style={{...s.row,marginBottom:"10px"}}>
          <span style={s.tag(GOLD)}>{c.postType}</span>
          <div style={{marginLeft:"auto"}}>
            <span style={{fontSize:"11px",color:TEXT2}}>Reach Score </span>
            <span style={{color:GOLD,fontWeight:"800",fontSize:"16px"}}>{c.reachScore}</span>
          </div>
        </div>
        <ScoreBar score={c.reachScore}/>
        <div style={{marginTop:"12px",fontSize:"13px",lineHeight:"1.7",color:TEXT}}>{c.caption}</div>
        <div style={{marginTop:"10px",display:"flex",flexWrap:"wrap",gap:"4px"}}>
          {c.hashtags&&c.hashtags.map(h=><span key={h} style={{fontSize:"10px",color:ACCENT2,background:`${ACCENT2}11`,padding:"2px 6px",borderRadius:"4px"}}>{h}</span>)}
        </div>
        <button style={{...s.btnOut,fontSize:"10px",padding:"5px 12px",marginTop:"10px"}}
          onClick={()=>navigator.clipboard?.writeText(c.caption+"\n\n"+(c.hashtags||[]).join(" "))}>
          Copy Caption
        </button>
      </div>)}
    </div>;
  }

  function ViralAnalyzer(){
    const VIRAL=[
      {type:"Reel",viral:"92%",reach:"85K",color:GOLD},
      {type:"Carousel",viral:"71%",reach:"42K",color:ACCENT},
      {type:"Static",viral:"38%",reach:"18K",color:TEXT2},
      {type:"Story",viral:"29%",reach:"12K",color:"#E88C5A"},
    ];
    return <div>
      <LockedFeature feature="viralAnalyzer" plan={plan} onUpgrade={onUpgrade}/>
      {limits.viralAnalyzer&&<div>
        <div style={s.card}>
          <div style={s.sectionTitle}>Format Performance</div>
          {VIRAL.map(v=><div key={v.type} style={{...s.row,padding:"10px 0",borderBottom:`1px solid ${BORDER}`}}>
            <div style={{width:"80px",fontSize:"12px",fontWeight:"700",color:v.color}}>{v.type}</div>
            <div style={{flex:1,margin:"0 12px"}}>
              <div style={{background:DARK3,borderRadius:"4px",height:"6px",overflow:"hidden"}}>
                <div style={{width:v.viral,height:"100%",background:`linear-gradient(90deg,${v.color},${v.color}66)`,borderRadius:"4px"}}/>
              </div>
            </div>
            <span style={{...s.tag(v.color),fontSize:"10px"}}>{v.viral}</span>
            <span style={{fontSize:"10px",color:TEXT2,marginLeft:"8px"}}>~{v.reach}</span>
          </div>)}
        </div>
        <div style={s.grid2}>
          <div style={s.card}>
            <div style={s.sectionTitle}>Trending Now</div>
            {[["AI Tools Showcase","92%",GOLD],["Before/After","88%",GOLD],["Money Tips","85%","#4ADE80"],["Tutorial","76%",ACCENT]].map(([t,v,c])=>
              <div key={t} style={{...s.row,justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${BORDER}`}}>
                <span style={{fontSize:"12px"}}>{t}</span>
                <span style={s.tag(c)}>{v}</span>
              </div>)}
          </div>
          <div style={s.card}>
            <div style={s.sectionTitle}>Best Hook Styles</div>
            {[["Question Hook","High",GOLD],["Number Hook","High",GOLD],["Shock Hook","Very High",ACCENT],["Story Hook","Medium",ACCENT2]].map(([t,l,c])=>
              <div key={t} style={{...s.row,justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${BORDER}`}}>
                <span style={{fontSize:"12px"}}>{t}</span>
                <span style={s.tag(c)}>{l}</span>
              </div>)}
          </div>
        </div>
      </div>}
    </div>;
  }

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
            messages:[{role:"user",content:`Predict Instagram reach:
Type: ${post.type}, Caption: ${post.caption}, Time: ${post.time}
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
          <label style={s.label}>Your Caption</label>
          <textarea style={{...s.textarea,marginBottom:"12px"}} value={post.caption} onChange={e=>setPost(p=>({...p,caption:e.target.value}))} placeholder="Paste your caption here..."/>
          <div style={{...s.row,flexWrap:"wrap",gap:"12px",marginBottom:"12px"}}>
            {[["hasHook","Strong Hook"],["hasCTA","Has CTA"],["hasTrending","Trending Audio"]].map(([k,l])=>
              <label key={k} style={{...s.row,cursor:"pointer",fontSize:"12px",color:TEXT2}}>
                <input type="checkbox" checked={post[k]} onChange={e=>setPost(p=>({...p,[k]:e.target.checked}))} style={{accentColor:GOLD,width:"14px",height:"14px"}}/>
                {l}
              </label>)}
          </div>
          <button style={{...s.btn,opacity:loading?0.6:1,padding:"12px 20px"}} onClick={predict} disabled={loading}>
            {loading?"Analyzing...":"▲ Predict Reach"}
          </button>
        </div>
        {score&&<div>
          <div style={{...s.cardAccent,textAlign:"center",padding:"24px"}}>
            <div style={{fontSize:"56px",fontWeight:"900",background:`linear-gradient(135deg,${score.reachScore>=80?GOLD:ACCENT},${score.reachScore>=80?GOLD_LIGHT:"#9F67FF"})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{score.reachScore}</div>
            <ScoreBar score={score.reachScore}/>
            <div style={{marginTop:"12px",display:"flex",justifyContent:"center",gap:"12px"}}>
              <span style={s.tag(score.reachScore>=80?GOLD:ACCENT)}>{score.reachLevel} Reach</span>
              <span style={{fontSize:"13px",color:GOLD_LIGHT,fontWeight:"600"}}>{score.estimatedReach} estimated</span>
            </div>
          </div>
          <div style={s.grid2}>
            <div style={s.card}><div style={s.sectionTitle}>Strengths</div>
              {score.strengths&&score.strengths.map((s2,i)=><div key={i} style={{fontSize:"12px",padding:"5px 0",color:"#4ADE80"}}>✓ {s2}</div>)}</div>
            <div style={s.card}><div style={s.sectionTitle}>Improvements</div>
              {score.improvements&&score.improvements.map((imp,i)=><div key={i} style={{fontSize:"12px",padding:"5px 0",color:GOLD}}>→ {imp}</div>)}</div>
          </div>
        </div>}
      </div>}
    </div>;
  }

  function PostManager(){
    const [posts,setPosts]=useState(SAMPLE_POSTS);
    const [filter,setFilter]=useState("All");
    const filtered=filter==="All"?posts:posts.filter(p=>p.status===filter.toLowerCase()||p.type===filter);
    return <div>
      <div style={{...s.row,marginBottom:"12px",flexWrap:"wrap",gap:"6px"}}>
        {["All","Scheduled","Posted","Reel","Carousel"].map(f=>
          <button key={f} style={f===filter?s.btn:s.btnOut} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>
      {filtered.map(p=><div key={p.id} style={{...s.card,border:`1px solid ${p.status==="posted"?"#4ADE8022":BORDER}`}}>
        <div style={{...s.row,justifyContent:"space-between",flexWrap:"wrap",gap:"6px"}}>
          <div style={s.row}>
            <span style={s.tag(p.type==="Reel"?GOLD:ACCENT)}>{p.type}</span>
            <span style={s.tag(p.status==="posted"?"#4ADE80":"#E88C5A")}>{p.status}</span>
          </div>
          <span style={{fontSize:"10px",color:TEXT2}}>{p.day} · {p.time}</span>
        </div>
        <div style={{fontSize:"12px",marginTop:"8px",lineHeight:"1.5"}}>{p.caption}</div>
        <ScoreBar score={p.score}/>
        <div style={{...s.row,marginTop:"10px",gap:"6px"}}>
          {p.status==="scheduled"&&<button style={s.btnSm("#4ADE8033")} onClick={()=>setPosts(ps=>ps.map(x=>x.id===p.id?{...x,status:"posted"}:x))}>✓ Mark Posted</button>}
          <button style={{...s.btnSm("#FF6B6B22"),color:"#FF6B6B"}} onClick={()=>setPosts(ps=>ps.filter(x=>x.id!==p.id))}>Delete</button>
        </div>
      </div>)}
    </div>;
  }

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
        if(data.id)setPostMsg("✅ Published successfully! ID: "+data.id);
        else setPostMsg("Error: "+(data.error?.message||JSON.stringify(data)));
      }catch(e){setPostMsg("Failed: "+e.message);}
      setPosting(false);
    };

    return <div>
      {!connected?<div style={s.cardGold}>
        <div style={s.sectionTitle}>Connect Instagram Account</div>
        <div style={s.grid2}>
          <div><label style={s.label}>Instagram Username</label>
            <input style={{...s.input,marginBottom:"10px"}} value={uname} onChange={e=>setUname(e.target.value)} placeholder="@username"/></div>
          <div><label style={s.label}>Followers Count</label>
            <input style={{...s.input,marginBottom:"10px"}} value={followers} onChange={e=>setFollowers(e.target.value)} placeholder="e.g. 5000"/></div>
          <div><label style={s.label}>Instagram User ID</label>
            <input style={{...s.input,marginBottom:"10px"}} value={uid} onChange={e=>setUid(e.target.value)} placeholder="17841432752485627"/></div>
          <div><label style={s.label}>Access Token</label>
            <input style={{...s.input,marginBottom:"10px"}} type="password" value={tok} onChange={e=>setTok(e.target.value)} placeholder="IGAAXAyr..."/></div>
        </div>
        {err&&<div style={s.err}>{err}</div>}
        <button style={s.btn} onClick={connect}>Connect Instagram →</button>
      </div>
      :<div>
        <div style={s.cardGold}>
          <div style={s.row}>
            <div style={{width:"48px",height:"48px",borderRadius:"50%",background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",fontWeight:"900",color:DARK}}>
              {profile.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:"15px",fontWeight:"800",color:GOLD}}>@{profile.username}</div>
              <div style={{fontSize:"11px",color:"#4ADE80",fontWeight:"600"}}>✅ Connected</div>
            </div>
            <div style={{marginLeft:"auto",textAlign:"right"}}>
              <div style={{fontSize:"18px",fontWeight:"800",color:GOLD}}>{profile.followers_count}</div>
              <div style={{fontSize:"10px",color:TEXT2}}>Followers</div>
            </div>
          </div>
        </div>
        <div style={s.cardAccent}>
          <div style={s.sectionTitle}>Publish Post Now</div>
          <label style={s.label}>Public Image URL (.jpg/.png)</label>
          <input style={{...s.input,marginBottom:"10px"}} value={postUrl} onChange={e=>setPostUrl(e.target.value)} placeholder="https://imgur.com/image.jpg"/>
          <label style={s.label}>Caption + Hashtags</label>
          <textarea style={{...s.textarea,marginBottom:"10px"}} value={postCaption} onChange={e=>setPostCaption(e.target.value)} placeholder="Your viral caption..."/>
          {postMsg&&<div style={{fontSize:"11px",color:postMsg.startsWith("✅")?"#4ADE80":"#FF6B6B",marginBottom:"10px"}}>{postMsg}</div>}
          <div style={s.row}>
            <button style={{...s.btn,opacity:posting?0.6:1}} onClick={publish} disabled={posting}>{posting?"Publishing...":"⚡ Publish to Instagram"}</button>
            <button style={s.btnOut} onClick={()=>setConnected(false)}>Disconnect</button>
          </div>
        </div>
      </div>}
    </div>;
  }

  const TABS=[Dashboard,Scheduler,AICaptions,ViralAnalyzer,ReachPredictor,PostManager,ConnectIG];
  const Tab=TABS[tab];

  return <div style={s.app}>
    <div style={s.header}>
      <div style={s.logo}>⚡ INSTAFLOW AI</div>
      <div style={s.row}>
        <span style={{fontSize:"11px",color:TEXT2}}>👤 {user.name}</span>
        <span style={{...s.tag(limits.color),textTransform:"uppercase",letterSpacing:"1px"}}>{limits.name}</span>
        <button style={{...s.btn,fontSize:"10px",padding:"6px 12px"}} onClick={onUpgrade}>⚡ Upgrade</button>
        <button style={{background:"transparent",border:`1px solid ${BORDER}`,borderRadius:"8px",padding:"6px 12px",cursor:"pointer",fontSize:"10px",color:TEXT2}} onClick={onLogout}>Logout</button>
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
