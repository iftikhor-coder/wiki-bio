/* WikiBio — Home / Search */

const { useState: useStateHome, useRef: useRefHome, useEffect: useEffectHome, useMemo: useMemoHome } = React;

/* ---------- Search box with live autocomplete ---------- */
const SearchBox = ({ autoFocus = true, size = "lg" }) => {
  const [q, setQ] = useStateHome("");
  const [open, setOpen] = useStateHome(false);
  const [active, setActive] = useStateHome(0);
  const inputRef = useRefHome();

  const results = useMemoHome(() => {
    if (!q.trim()) return [];
    const lq = q.toLowerCase();
    return PROFILES.filter(p =>
      p.name.toLowerCase().includes(lq) ||
      p.category.toLowerCase().includes(lq) ||
      (p.tags||[]).some(t => t.toLowerCase().includes(lq))
    ).slice(0, 6);
  }, [q]);

  useEffectHome(() => { if (autoFocus && inputRef.current) inputRef.current.focus(); }, []);

  const pad = size === "lg" ? 24 : 14;
  const fs = size === "lg" ? 28 : 16;

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    if (e.key === "Enter" && results[active]) { window.location.hash = `#/p/${results[active].id}`; }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div style={{position:"relative", width:"100%"}}>
      <div className="crosshairs" style={{
        position:"relative",
        border:"1px solid var(--line-2)",
        background:"color-mix(in srgb, var(--bg-2) 60%, transparent)",
        display:"flex", alignItems:"center", gap:pad,
        padding: size === "lg" ? "18px 24px" : "10px 14px",
        transition:"border-color .2s",
      }}
      onFocus={()=>setOpen(true)}
      onBlur={(e)=>{ if (!e.currentTarget.contains(e.relatedTarget)) setTimeout(()=>setOpen(false), 120); }}
      tabIndex={-1}>
        <span className="ch1" /><span className="ch2" />
        <I.search size={size === "lg" ? 22 : 16} />
        <input ref={inputRef}
          value={q}
          onChange={e=>{ setQ(e.target.value); setOpen(true); setActive(0); }}
          onKeyDown={onKey}
          onFocus={()=>setOpen(true)}
          placeholder="Search a person, brand, profession…"
          style={{
            flex:1, background:"transparent", border:0, outline:"none",
            fontFamily:"var(--font-display)", fontWeight:300, fontStyle: q ? "normal" : "italic",
            color:"var(--ink)", fontSize:fs, letterSpacing:"-0.01em",
          }}
        />
        {q && (
          <button onClick={()=>{setQ(""); inputRef.current.focus();}}
            style={{color:"var(--ink-3)", padding:6}}>
            <I.x size={16}/>
          </button>
        )}
        <span className="mono" style={{color:"var(--ink-3)", fontSize:11, letterSpacing:".18em"}}>
          ⌘K
        </span>
      </div>

      {/* Dropdown */}
      {open && q && (
        <div className="fade" style={{
          position:"absolute", top:"calc(100% + 8px)", left:0, right:0,
          background:"var(--bg-2)", border:"1px solid var(--line-2)",
          boxShadow:"var(--shadow)", zIndex:30, padding:"10px"
        }}>
          {results.length === 0 ? (
            <div style={{padding:"24px 18px", color:"var(--ink-3)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span>No results for "<span style={{color:"var(--ink-2)"}}>{q}</span>"</span>
              <a href="#/create" className="btn-link">Create this profile <I.arrowR size={11}/></a>
            </div>
          ) : (
            <>
              <div className="label-sm" style={{padding:"8px 12px"}}>Profiles · {results.length}</div>
              {results.map((p, i) => (
                <a key={p.id} href={`#/p/${p.id}`}
                   onMouseEnter={()=>setActive(i)}
                   style={{
                    display:"flex", alignItems:"center", gap:14, padding:"12px",
                    background: i===active ? "color-mix(in srgb, var(--gold) 8%, transparent)" : "transparent",
                    borderLeft: i===active ? "1px solid var(--gold)" : "1px solid transparent",
                   }}>
                  <div style={{width:46, height:56, overflow:"hidden", flexShrink:0}}>
                    <Photo src={p.photo} name={p.name} color={p.color} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <span className="serif" style={{fontSize:17, fontWeight:400}}>{p.name}</span>
                      {p.tier !== "free" && <I.badge size={11} style={{color: p.tier==="gold"?"var(--verified-gold)":"var(--verified-silver)"}}/>}
                    </div>
                    <div style={{fontSize:12, color:"var(--ink-3)", marginTop:2}}>
                      {p.category} · b. {p.born} · {p.nationality}
                    </div>
                  </div>
                  <I.arrowR size={14} style={{color:"var(--ink-3)"}}/>
                </a>
              ))}
              <div style={{borderTop:"1px solid var(--line)", marginTop:8, padding:"10px 12px",
                display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--ink-3)"}} className="mono">
                <span>↑↓ navigate · ↵ open · esc close</span>
                <a href="#/browse" style={{color:"var(--gold)"}}>Browse all 184,302 profiles →</a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------- Marquee of categories ---------- */
const CategoryMarquee = () => (
  <div style={{
    overflow:"hidden", whiteSpace:"nowrap", padding:"18px 0",
    borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)",
    color:"var(--ink-3)", fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:".22em", textTransform:"uppercase",
    maskImage:"linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)"
  }}>
    <div style={{display:"inline-block", animation:"scroll 60s linear infinite"}}>
      {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((c, i) => (
        <span key={i} style={{padding:"0 28px"}}>{c} <span style={{color:"var(--gold)"}}>✦</span></span>
      ))}
    </div>
    <style>{`@keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }`}</style>
  </div>
);

/* ---------- Featured Magazine Grid ---------- */
const FeaturedGrid = () => {
  const [hero, ...rest] = PROFILES;
  return (
    <section style={{padding:"80px 0"}}>
      <div className="wrap">
        <div style={{display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:40}}>
          <div>
            <div className="eyebrow">Edition 047 — June 2026</div>
            <h2 className="display" style={{fontSize:64, margin:"18px 0 0", maxWidth:700}}>
              Profiles, <em style={{fontStyle:"italic"}}>edited</em>.
            </h2>
            <p style={{color:"var(--ink-2)", maxWidth:520, marginTop:14, fontSize:15}}>
              A weekly editorial selection of new and rising profiles, hand-picked
              by our editors. Anyone can be featured.
            </p>
          </div>
          <a href="#/browse" className="btn btn-ghost">
            See full edition <I.arrowR size={14}/>
          </a>
        </div>

        {/* Asymmetric magazine grid */}
        <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr", gap:32, alignItems:"start"}}>
          {/* Hero card */}
          <div style={{position:"relative"}}>
            <ProfileCard profile={hero} variant="hero" index={0}/>
            <div style={{
              position:"absolute", top:-12, left:-12,
              fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".22em", color:"var(--gold)",
              background:"var(--bg)", padding:"4px 10px", textTransform:"uppercase"}}>
              Cover · 001
            </div>
          </div>
          <div style={{display:"grid", gap:32}}>
            <ProfileCard profile={rest[0]} variant="default" index={1}/>
            <ProfileCard profile={rest[1]} variant="default" index={2}/>
          </div>
          <div style={{display:"grid", gap:32}}>
            <ProfileCard profile={rest[2]} variant="default" index={3}/>
            <ProfileCard profile={rest[3]} variant="default" index={4}/>
          </div>
        </div>

        {/* Second row: 4-up */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:32, marginTop:32}}>
          {rest.slice(4, 8).map((p, i) => (
            <ProfileCard key={p.id} profile={p} variant="short" index={5+i}/>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- How to get on Google (3-step explainer) ---------- */
const HowItWorks = () => {
  const steps = [
    {
      n: "I",
      title: "Create your profile",
      body: "Fill in a structured biography with sources. Our editor formats it to schema.org/Person and Organization standards — the same standards Google reads for Wikipedia."
    },
    {
      n: "II",
      title: "We index it for Google",
      body: "Once published, your profile is submitted to Google's Indexing API within minutes. JSON-LD structured data, canonical URLs, and an XML sitemap entry are generated automatically."
    },
    {
      n: "III",
      title: "Appear in the Knowledge Panel",
      body: "When someone searches your name, your profile is eligible to appear in Google's right-hand panel — with your photo, category, dates, and the snippets you wrote."
    },
  ];
  return (
    <section style={{padding:"100px 0", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)"}}>
      <div className="wrap">
        <div style={{display:"grid", gridTemplateColumns:"5fr 7fr", gap:80, alignItems:"start"}}>
          <div style={{position:"sticky", top:120}}>
            <div className="eyebrow">A primer</div>
            <h2 className="display" style={{fontSize:64, margin:"20px 0 24px"}}>
              How to get on <em style={{fontStyle:"italic"}}>Google.</em>
            </h2>
            <p style={{color:"var(--ink-2)", lineHeight:1.6, fontSize:15.5, maxWidth:440}}>
              Wikipedia decides who has a page through committee. WikiBio doesn't. If you can
              write your story honestly and source it, you can be there. Three steps, no editors
              to argue with, no notability hurdle.
            </p>
            <a href="#/create" className="btn btn-primary" style={{marginTop:28}}>
              Start your profile <I.arrowR size={14}/>
            </a>
          </div>

          <ol style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:0}}>
            {steps.map((s, i) => (
              <li key={i} style={{
                display:"grid", gridTemplateColumns:"100px 1fr", gap:32,
                padding:"36px 0",
                borderTop: i===0 ? "1px solid var(--line-2)" : "1px solid var(--line)",
                borderBottom: i===steps.length-1 ? "1px solid var(--line-2)" : "none",
              }}>
                <div className="display" style={{
                  fontSize:72, fontStyle:"italic", color:"var(--gold)",
                  fontWeight:300, lineHeight:0.8
                }}>{s.n}</div>
                <div>
                  <h3 className="serif" style={{margin:"6px 0 14px", fontSize:28, fontWeight:400, letterSpacing:"-0.01em"}}>
                    {s.title}
                  </h3>
                  <p style={{margin:0, color:"var(--ink-2)", lineHeight:1.65, fontSize:14.5, maxWidth:560}}>
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

/* ---------- Manifesto strip ---------- */
const Manifesto = () => (
  <section style={{padding:"120px 0"}}>
    <div className="wrap-sm" style={{textAlign:"center"}}>
      <div className="rule" style={{marginBottom:32, justifyContent:"center"}}>
        <span style={{flex:"none"}}>Manifesto</span>
        <span style={{flex:"none", color:"var(--gold)"}}>§ 1</span>
      </div>
      <p className="display" style={{
        fontSize:46, lineHeight:1.15, fontStyle:"italic", margin:0, maxWidth:900, marginInline:"auto", color:"var(--ink)"
      }}>
        "Every person, every brand, every product deserves a page — not a profile.
        A page that <span style={{color:"var(--gold)"}}>Google</span> reads, that the world
        can cite, that you <span style={{color:"var(--gold)"}}>own</span>."
      </p>
      <div className="mono" style={{marginTop:36, color:"var(--ink-3)", fontSize:11, letterSpacing:".22em", textTransform:"uppercase"}}>
        — The WikiBio Editors, Vol. III
      </div>
    </div>
  </section>
);

/* ---------- Stats strip ---------- */
const StatsStrip = () => (
  <section style={{borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)", padding:"36px 0"}}>
    <div className="wrap" style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:32}}>
      {[
        ["184,302", "Public profiles"],
        ["2.9M", "Monthly searches"],
        ["72%", "Index rate on Google"],
        ["41", "Countries represented"],
      ].map(([n, l]) => (
        <div key={l}>
          <div className="display tnum" style={{fontSize:44, fontWeight:300}}>{n}</div>
          <div className="label-sm" style={{marginTop:6}}>{l}</div>
        </div>
      ))}
    </div>
  </section>
);

/* ---------- HOME PAGE ---------- */
const HomePage = () => (
  <div>
    {/* Hero — magazine cover */}
    <section style={{padding:"60px 0 80px", position:"relative", overflow:"hidden"}}>
      <div className="wrap">
        <div style={{display:"grid", gridTemplateColumns:"7fr 5fr", gap:80, alignItems:"end"}}>
          <div>
            <div style={{display:"flex", gap:18, alignItems:"center", marginBottom:36}}>
              <span className="eyebrow">Vol. III · Edition 047</span>
              <span style={{height:1, background:"var(--gold)", width:60, opacity:0.6}}/>
              <span className="eyebrow" style={{color:"var(--ink-3)"}}>June 8, 2026</span>
            </div>

            <h1 className="display" style={{margin:0, fontSize: "clamp(64px, 9vw, 132px)"}}>
              The world's<br/>
              <em style={{fontStyle:"italic", color:"var(--gold)"}}>biography,</em><br/>
              rewritten by<br/>
              the people.
            </h1>

            <p style={{marginTop:36, maxWidth:560, fontSize:18, lineHeight:1.55, color:"var(--ink-2)"}}>
              A free, open knowledge platform for anyone — yourself, your brand, your product,
              your service. Visible on Google in the same panel Wikipedia gets. No committees,
              no notability bar. Just your story, structured properly.
            </p>

            <div style={{marginTop:48, maxWidth:680}}>
              <SearchBox autoFocus={false} />
              <div className="mono" style={{
                marginTop:14, fontSize:11, letterSpacing:".18em", textTransform:"uppercase",
                color:"var(--ink-3)", display:"flex", gap:18, flexWrap:"wrap"
              }}>
                <span>Try:</span>
                {["Elena Marchetti", "Cinematographer", "Architect", "Atlas Coffee"].map(s => (
                  <a key={s} href={`#/browse?q=${encodeURIComponent(s)}`} style={{color:"var(--ink-2)"}}>
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: editorial cover detail */}
          <div className="hide-mobile" style={{position:"relative"}}>
            <div className="crosshairs photo-frame" style={{height:540, position:"relative"}}>
              <span className="ch1"/><span className="ch2"/>
              <Photo src={PROFILES[0].photo} name={PROFILES[0].name} color={PROFILES[0].color}
                     style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              <div style={{position:"absolute", left:0, right:0, bottom:0, padding:24, color:"#fff", zIndex:2}}>
                <div className="mono" style={{fontSize:10, letterSpacing:".22em", textTransform:"uppercase", opacity:.85}}>
                  Cover Profile · № {PROFILES[0].profileNumber}
                </div>
                <div className="display" style={{fontSize:46, lineHeight:.95, marginTop:8, fontWeight:300}}>
                  Elena<br/><em style={{fontStyle:"italic"}}>Marchetti</em>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:18, opacity:.9}}>
                  <span className="mono" style={{fontSize:11, letterSpacing:".18em"}}>Cinematographer · b.1984</span>
                  <a href={`#/p/${PROFILES[0].id}`} className="mono" style={{fontSize:11, letterSpacing:".18em", color:"var(--gold-2)"}}>
                    Read →
                  </a>
                </div>
              </div>
            </div>
            <div style={{
              position:"absolute", top:-16, right:-16,
              width:90, height:90, borderRadius:"50%",
              background:"var(--gold)", color:"#0A0F1E",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              fontFamily:"var(--font-display)", fontStyle:"italic", textAlign:"center", lineHeight:1
            }}>
              <span style={{fontSize:28, fontWeight:400}}>New</span>
              <span style={{fontSize:11, letterSpacing:".22em", fontFamily:"var(--font-mono)", fontStyle:"normal", marginTop:4}}>VOL III</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CategoryMarquee />
    <StatsStrip />
    <FeaturedGrid />
    <HowItWorks />
    <Manifesto />
  </div>
);

window.HomePage = HomePage;
window.SearchBox = SearchBox;
