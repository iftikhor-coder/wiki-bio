/* WikiBio — Shared UI: Logo, Nav, Footer, Avatar fallback, ProfileCard */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Logo ---------- */
const Logo = ({ size = 22 }) => (
  <a href="#/" className="logo" style={{display:"inline-flex", alignItems:"baseline", gap:8, letterSpacing:"-0.01em"}}>
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"block"}}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="var(--gold)" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fontFamily="Fraunces, serif"
            fontSize="13" fontStyle="italic" fill="var(--gold)" fontWeight="400">W</text>
    </svg>
    <span className="serif" style={{fontSize: size*0.95, fontWeight:400, letterSpacing:"-0.02em"}}>
      Wiki<em style={{fontStyle:"italic", color:"var(--gold)"}}>Bio</em>
    </span>
  </a>
);

/* ---------- Theme toggle ---------- */
const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("wb-theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wb-theme", theme);
  }, [theme]);
  return [theme, setTheme];
};

const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
      style={{
        width:36, height:36, borderRadius:"50%", border:"1px solid var(--line-2)",
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        color:"var(--ink-2)", transition:"all .2s"
      }}>
      {theme === "dark" ? <I.sun size={15} /> : <I.moon size={15} />}
    </button>
  );
};

/* ---------- Top Nav ---------- */
const TopNav = ({ route }) => {
  const [open, setOpen] = useState(false);
  const linkStyle = (active) => ({
    fontSize: 13, fontWeight: 500, color: active ? "var(--ink)" : "var(--ink-2)",
    letterSpacing:".01em", display:"inline-flex", alignItems:"center", gap:6,
    paddingBottom:4, borderBottom: active ? "1px solid var(--gold)" : "1px solid transparent"
  });

  return (
    <header style={{
      position:"sticky", top:0, zIndex:50,
      backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
      background:"color-mix(in srgb, var(--bg) 78%, transparent)",
      borderBottom:"1px solid var(--line)"
    }}>
      <div className="wrap" style={{display:"flex", alignItems:"center", height:72, gap:32}}>
        <Logo />
        <div className="hide-mobile" style={{display:"flex", alignItems:"center", gap:28, marginLeft:24}}>
          <a href="#/" style={linkStyle(route.page==="home")}>Discover</a>
          <a href="#/browse" style={linkStyle(route.page==="browse")}>Browse</a>
          <a href="#/seo-guide" style={linkStyle(route.page==="seo")}>SEO Guide</a>
          <a href="#/about" style={linkStyle(false)}>About</a>
        </div>
        <div style={{flex:1}} />
        <a href="#/dashboard" className="hide-mobile" style={linkStyle(route.page==="dashboard")}>
          <I.bell size={14} /> Dashboard
        </a>
        <a href="#/admin" className="hide-mobile" style={linkStyle(route.page==="admin")}>
          <I.shield size={14} /> Admin
        </a>
        <ThemeToggle />
        <a href="#/create" className="btn btn-primary" style={{padding:"10px 18px"}}>
          Create profile <I.arrowR size={14}/>
        </a>
      </div>
    </header>
  );
};

/* ---------- Footer ---------- */
const Footer = () => (
  <footer style={{marginTop:120, borderTop:"1px solid var(--line)", padding:"56px 0 40px"}}>
    <div className="wrap" style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:48}}>
      <div>
        <Logo size={22} />
        <p style={{marginTop:20, maxWidth:340, color:"var(--ink-2)", fontSize:14, lineHeight:1.55}}>
          A free, editorially-minded knowledge platform —
          built by the people, indexed by Google, owned by no one.
        </p>
        <div className="rule" style={{marginTop:28, justifyContent:"flex-start", gap:10}}>
          <span style={{flex:"none"}}>Est.</span>
          <span style={{flex:"none", color:"var(--ink)"}} className="mono">MMXXVI</span>
          <span style={{flex:"none"}}>Vol. III</span>
        </div>
      </div>
      {[
        ["About", ["Our mission","Editorial standards","Team & press","Contact"]],
        ["How it Works", ["Create a profile","Verification tiers","SEO indexing","API access"]],
        ["Guides", ["SEO guide","Structured data","Sourcing","Style manual"]],
        ["Legal", ["Privacy","Terms","Takedown","Cookies"]],
      ].map(([title, items]) => (
        <div key={title}>
          <div className="eyebrow" style={{marginBottom:18}}>{title}</div>
          <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:10}}>
            {items.map(i => (
              <li key={i}><a href="#" style={{color:"var(--ink-2)", fontSize:13}}>{i}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="wrap" style={{marginTop:56, paddingTop:24, borderTop:"1px solid var(--line)",
      display:"flex", justifyContent:"space-between", alignItems:"center",
      color:"var(--ink-3)", fontSize:12}}>
      <span>© 2026 WikiBio Foundation. Content licensed CC BY-SA 4.0.</span>
      <span className="mono">v3.2.1 · ssr-ready · schema.org/Person</span>
    </div>
  </footer>
);

/* ---------- Photo (with graceful fallback to gradient + initials) ---------- */
const Photo = ({ src, name, color = "var(--gold-3)", style, alt }) => {
  const [err, setErr] = useState(false);
  const initials = (name || "?").split(" ").map(s => s[0]).slice(0,2).join("");
  if (err || !src) {
    return (
      <div style={{
        width:"100%", height:"100%",
        background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, black))`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"var(--font-display)", fontStyle:"italic",
        color:"rgba(255,255,255,0.9)", fontSize:64, ...style
      }}>{initials}</div>
    );
  }
  return <img src={src} alt={alt||name} onError={()=>setErr(true)} style={style}/>;
};

/* ---------- Verified Badge ---------- */
const VerifiedBadge = ({ tier, withLabel = true }) => {
  if (tier === "free") return null;
  const label = tier === "gold" ? "Verified · Gold" : "Verified";
  return (
    <span className={`verified ${tier}`}>
      <I.badge size={11}/>
      {withLabel && label}
    </span>
  );
};

/* ---------- Profile Card (editorial) ---------- */
const ProfileCard = ({ profile, variant = "default", index = 0 }) => {
  const heights = { default: 380, tall: 480, short: 280, hero: 560 };
  const h = heights[variant] || 380;
  return (
    <a href={`#/p/${profile.slug || profile.id}`}
      style={{
        position:"relative", display:"block", padding:0, animationDelay:`${index*60}ms`,
        background:"transparent", border:"1px solid var(--line)"
      }}>
      <div className="photo-frame" style={{height:h, position:"relative"}}>
        <Photo src={profile.photo_url || profile.photo} name={profile.name} color={profile.color}
               style={{width:"100%", height:"100%", objectFit:"cover", filter:"saturate(.92)"}}/>
        <div style={{position:"absolute", top:14, left:14, right:14,
          display:"flex", justifyContent:"space-between", alignItems:"flex-start", zIndex:2}}>
          <span className="mono" style={{
            fontSize:10, letterSpacing:".18em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.92)", background:"rgba(10,15,30,0.5)",
            padding:"4px 8px", backdropFilter:"blur(4px)"}}>
            № {profile.profileNumber} · {profile.category}
          </span>
          {profile.tier !== "free" && (
            <span style={{
              width:24, height:24, borderRadius:"50%",
              background:profile.tier==="gold"?"var(--verified-gold)":"var(--verified-silver)",
              color:"#0A0F1E", display:"inline-flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 2px 12px rgba(0,0,0,0.3)"
            }}><I.check size={12} stroke={2.5}/></span>
          )}
        </div>
        <div style={{position:"absolute", bottom:18, left:18, right:18, zIndex:2}}>
          <div style={{
            fontFamily:"var(--font-display)", fontSize: variant==="hero" ? 48 : 30,
            fontWeight:300, lineHeight:0.98, color:"#fff",
            letterSpacing:"-0.02em"
          }}>
            {profile.name.replace(profile.italicLast, "")}
            <span style={{fontStyle:"italic"}}>{profile.italicLast}</span>
          </div>
          <div className="mono" style={{
            marginTop:8, fontSize:10, letterSpacing:".18em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.75)"}}>
            b. {profile.born} · {profile.nationality}
          </div>
        </div>
      </div>
      <div style={{padding:"18px 4px 4px"}}>
        <p style={{margin:0, fontSize:13, color:"var(--ink-2)", lineHeight:1.55,
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"}}>
          {profile.short}
        </p>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center",
          marginTop:14, fontSize:11, color:"var(--ink-3)"}} className="mono">
          <span>{profile.views} views</span>
          <span style={{color:"var(--gold)", display:"inline-flex", alignItems:"center", gap:4}}>
            Read profile <I.arrowR size={11}/>
          </span>
        </div>
      </div>
    </a>
  );
};

/* ---------- Page header (eyebrow + title) ---------- */
const PageHeader = ({ eyebrow, title, italicWord, subtitle, right, dense = false }) => (
  <div style={{padding: dense ? "32px 0 24px" : "72px 0 40px"}}>
    <div className="wrap">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:40, flexWrap:"wrap"}}>
        <div>
          {eyebrow && <div className="eyebrow" style={{marginBottom: 18}}>{eyebrow}</div>}
          <h1 className="display" style={{
            margin:0, fontSize: dense ? 56 : 88, maxWidth: 900,
          }}>
            {title} {italicWord && <em style={{fontStyle:"italic"}}>{italicWord}</em>}
          </h1>
          {subtitle && <p style={{marginTop:22, fontSize:16, color:"var(--ink-2)", maxWidth:640, lineHeight:1.5}}>{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  </div>
);

Object.assign(window, { Logo, ThemeToggle, useTheme, TopNav, Footer, Photo, VerifiedBadge, ProfileCard, PageHeader });
