/* WikiBio — Home / Search (real Supabase data) */

const { useState: useStateHome, useRef: useRefHome, useEffect: useEffectHome, useMemo: useMemoHome } = React;

/* ---------- Search box ---------- */
const SearchBox = ({ autoFocus = true, size = "lg" }) => {
  const [q, setQ] = useStateHome("");
  const [open, setOpen] = useStateHome(false);
  const [active, setActive] = useStateHome(0);
  const [results, setResults] = useStateHome([]);
  const inputRef = useRefHome();

  useEffectHome(() => {
    if (!q.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      const { data } = await API.getProfiles({ search: q, limit: 6 });
      setResults(data || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  useEffectHome(() => { if (autoFocus && inputRef.current) inputRef.current.focus(); }, []);

  const pad = size === "lg" ? 24 : 14;
  const fs = size === "lg" ? 28 : 16;

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(results.length-1, a+1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(0, a-1)); }
    if (e.key === "Enter" && results[active]) window.location.hash = `#/p/${results[active].slug}`;
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div style={{position:"relative", width:"100%"}}>
      <div className="crosshairs" style={{
        position:"relative", border:"1px solid var(--line-2)",
        background:"color-mix(in srgb, var(--bg-2) 60%, transparent)",
        display:"flex", alignItems:"center", gap:pad,
        padding: size==="lg" ? "18px 24px" : "10px 14px",
      }}
      onFocus={()=>setOpen(true)}
      onBlur={(e)=>{ if(!e.currentTarget.contains(e.relatedTarget)) setTimeout(()=>setOpen(false),120); }}
      tabIndex={-1}>
        <span className="ch1"/><span className="ch2"/>
        <I.search size={size==="lg"?22:16}/>
        <input ref={inputRef} value={q}
          onChange={e=>{ setQ(e.target.value); setOpen(true); setActive(0); }}
          onKeyDown={onKey} onFocus={()=>setOpen(true)}
          placeholder="Ism, brend, kasb qidiring..."
          style={{
            flex:1, background:"transparent", border:0, outline:"none",
            fontFamily:"var(--font-display)", fontWeight:300, fontStyle:q?"normal":"italic",
            color:"var(--ink)", fontSize:fs, letterSpacing:"-0.01em",
          }}
        />
        {q && <button onClick={()=>{setQ(""); inputRef.current.focus();}} style={{color:"var(--ink-3)", padding:6}}><I.x size={16}/></button>}
        <span className="mono" style={{color:"var(--ink-3)", fontSize:11, letterSpacing:".18em"}}>⌘K</span>
      </div>

      {open && q && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", left:0, right:0,
          background:"var(--bg-2)", border:"1px solid var(--line-2)",
          boxShadow:"var(--shadow)", zIndex:30, padding:"10px"
        }}>
          {results.length === 0 ? (
            <div style={{padding:"24px 18px", color:"var(--ink-3)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span>"{q}" topilmadi</span>
              <a href="#/create" className="btn-link">Profil yarating <I.arrowR size={11}/></a>
            </div>
          ) : (
            <>
              <div className="label-sm" style={{padding:"8px 12px"}}>Profillar · {results.length}</div>
              {results.map((p, i) => (
                <a key={p.id} href={`#/p/${p.slug}`}
                  onMouseEnter={()=>setActive(i)}
                  style={{
                    display:"flex", alignItems:"center", gap:14, padding:"12px",
                    background: i===active ? "color-mix(in srgb, var(--gold) 8%, transparent)" : "transparent",
                    borderLeft: i===active ? "1px solid var(--gold)" : "1px solid transparent",
                  }}>
                  <div style={{width:46, height:56, overflow:"hidden", flexShrink:0, background:"var(--bg-3)"}}>
                    {p.photo_url
                      ? <img src={p.photo_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                      : <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--ink-3)"}}>
                          <I.image size={18}/>
                        </div>
                    }
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <span className="serif" style={{fontSize:17, fontWeight:400}}>{p.name}</span>
                    </div>
                    <div style={{fontSize:12, color:"var(--ink-3)", marginTop:2}}>
                      {p.category} · {p.nationality}
                    </div>
                  </div>
                  <I.arrowR size={14} style={{color:"var(--ink-3)"}}/>
                </a>
              ))}
              <div style={{borderTop:"1px solid var(--line)", marginTop:8, padding:"10px 12px",
                display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--ink-3)"}} className="mono">
                <span>↑↓ navigate · ↵ open</span>
                <a href="#/browse" style={{color:"var(--gold)"}}>Barchasini ko'rish →</a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------- Category Marquee ---------- */
const CategoryMarquee = () => (
  <div style={{
    overflow:"hidden", whiteSpace:"nowrap", padding:"18px 0",
    borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)",
    color:"var(--ink-3)", fontFamily:"var(--font-mono)", fontSize:11,
    letterSpacing:".22em", textTransform:"uppercase",
    maskImage:"linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)"
  }}>
    <div style={{display:"inline-block", animation:"scroll 60s linear infinite"}}>
      {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((c,i) => (
        <span key={i} style={{padding:"0 28px"}}>{c} <span style={{color:"var(--gold)"}}>✦</span></span>
      ))}
    </div>
    <style>{`@keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }`}</style>
  </div>
);

/* ---------- Featured Grid (real data) ---------- */
const FeaturedGrid = () => {
  const [profiles, setProfiles] = useStateHome([]);
  const [loading, setLoading] = useStateHome(true);

  useEffectHome(() => {
    API.getProfiles({ limit: 12 }).then(({ data }) => {
      setProfiles(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <section style={{padding:"80px 0", textAlign:"center"}}>
      <div className="mono" style={{color:"var(--ink-3)", letterSpacing:".18em"}}>YUKLANMOQDA...</div>
    </section>
  );

  if (!profiles.length) return (
    <section style={{padding:"80px 0"}}>
      <div className="wrap" style={{textAlign:"center"}}>
        <div className="display" style={{fontSize:64, color:"var(--gold)"}}>∅</div>
        <h2 className="serif" style={{fontSize:32, fontWeight:400, margin:"16px 0 12px"}}>
          Hali profillar yo'q
        </h2>
        <p style={{color:"var(--ink-2)", marginBottom:28}}>Birinchi profil siz bo'ling!</p>
        <a href="#/create" className="btn btn-primary">Profil yaratish <I.arrowR size={14}/></a>
      </div>
    </section>
  );

  const [hero, ...rest] = profiles;

  return (
    <section style={{padding:"80px 0"}}>
      <div className="wrap">
        <div style={{display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:40}}>
          <div>
            <div className="eyebrow">So'nggi profillar</div>
            <h2 className="display" style={{fontSize:64, margin:"18px 0 0"}}>
              Profillar, <em style={{fontStyle:"italic"}}>tahririyat</em>.
            </h2>
          </div>
          <a href="#/browse" className="btn btn-ghost">Barchasini ko'rish <I.arrowR size={14}/></a>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr", gap:32, alignItems:"start"}}>
          <ProfileCard profile={hero} variant="hero" index={0}/>
          <div style={{display:"grid", gap:32}}>
            {rest[0] && <ProfileCard profile={rest[0]} variant="default" index={1}/>}
            {rest[1] && <ProfileCard profile={rest[1]} variant="default" index={2}/>}
          </div>
          <div style={{display:"grid", gap:32}}>
            {rest[2] && <ProfileCard profile={rest[2]} variant="default" index={3}/>}
            {rest[3] && <ProfileCard profile={rest[3]} variant="default" index={4}/>}
          </div>
        </div>

        {rest.length > 4 && (
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32, marginTop:32}}>
            {rest.slice(4,8).map((p,i) => <ProfileCard key={p.id} profile={p} variant="short" index={5+i}/>)}
          </div>
        )}
      </div>
    </section>
  );
};

/* ---------- Stats ---------- */
const StatsStrip = () => {
  const [stats, setStats] = useStateHome({total:0, live:0, users:0});

  useEffectHome(() => {
    API.getStats().then(s => setStats(s));
  }, []);

  return (
    <section style={{borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)", padding:"36px 0"}}>
      <div className="wrap" style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32}}>
        {[
          [stats.total || "0", "Jami profillar"],
          [stats.live || "0", "Jonli profillar"],
          [stats.users || "0", "Foydalanuvchilar"],
          ["Google", "Indekslangan"],
        ].map(([n,l]) => (
          <div key={l}>
            <div className="display tnum" style={{fontSize:44, fontWeight:300}}>{n}</div>
            <div className="label-sm" style={{marginTop:6}}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------- How it works ---------- */
const HowItWorks = () => {
  const steps = [
    { n:"I", title:"Profil yarating", body:"5 daqiqada to'ldiring — ism, rasm, tarjimayi hol, ijtimoiy tarmoqlar. Bepul." },
    { n:"II", title:"Biz indekslaymiz", body:"Profilingiz schema.org/Person bilan chiqariladi. Google Indexing API orqali darhol yuboriladi." },
    { n:"III", title:"Google da ko'rining", body:"Ismingizni yozganda o'ng tomonda rasm va ma'lumotlaringiz chiqishi mumkin — Wikipedia kabi." },
  ];
  return (
    <section style={{padding:"100px 0", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)"}}>
      <div className="wrap">
        <div style={{display:"grid", gridTemplateColumns:"5fr 7fr", gap:80, alignItems:"start"}}>
          <div style={{position:"sticky", top:120}}>
            <div className="eyebrow">Qanday ishlaydi</div>
            <h2 className="display" style={{fontSize:64, margin:"20px 0 24px"}}>
              Google da <em style={{fontStyle:"italic"}}>qanday</em> ko'rinasiz.
            </h2>
            <p style={{color:"var(--ink-2)", lineHeight:1.6, fontSize:15.5, maxWidth:440}}>
              Wikipedia notablik talabiga ega. WikiBio ega emas. Hikoyangizni to'g'ri yozsangiz — siz ham Google da ko'rinasiz.
            </p>
            <a href="#/create" className="btn btn-primary" style={{marginTop:28}}>
              Boshlash <I.arrowR size={14}/>
            </a>
          </div>
          <ol style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:0}}>
            {steps.map((s,i) => (
              <li key={i} style={{
                display:"grid", gridTemplateColumns:"100px 1fr", gap:32, padding:"36px 0",
                borderTop: i===0 ? "1px solid var(--line-2)" : "1px solid var(--line)",
                borderBottom: i===steps.length-1 ? "1px solid var(--line-2)" : "none",
              }}>
                <div className="display" style={{fontSize:72, fontStyle:"italic", color:"var(--gold)", fontWeight:300, lineHeight:0.8}}>{s.n}</div>
                <div>
                  <h3 className="serif" style={{margin:"6px 0 14px", fontSize:28, fontWeight:400}}>{s.title}</h3>
                  <p style={{margin:0, color:"var(--ink-2)", lineHeight:1.65, fontSize:14.5}}>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

/* ---------- Manifesto ---------- */
const Manifesto = () => (
  <section style={{padding:"120px 0"}}>
    <div className="wrap-sm" style={{textAlign:"center"}}>
      <p className="display" style={{fontSize:46, lineHeight:1.15, fontStyle:"italic", margin:0, maxWidth:900, marginInline:"auto"}}>
        "Har bir inson, har bir brend, har bir mahsulot sahifaga loyiq —
        <span style={{color:"var(--gold)"}}> Google</span> o'qiydigan,
        dunyo ko'radigan, siz <span style={{color:"var(--gold)"}}>egasi</span> bo'ladigan sahifa."
      </p>
      <div className="mono" style={{marginTop:36, color:"var(--ink-3)", fontSize:11, letterSpacing:".22em", textTransform:"uppercase"}}>
        — WikiBio Muharrirlari
      </div>
    </div>
  </section>
);

/* ---------- HOME PAGE ---------- */
const HomePage = () => {
  useEffectHome(() => {
    if (window.SEO) window.SEO.setHome();
  }, []);

  return (
    <div>
      <section style={{padding:"60px 0 80px", position:"relative", overflow:"hidden"}}>
        <div className="wrap">
          <div style={{display:"grid", gridTemplateColumns:"7fr 5fr", gap:80, alignItems:"end"}}>
            <div>
              <div style={{display:"flex", gap:18, alignItems:"center", marginBottom:36}}>
                <span className="eyebrow">WikiBio · Bepul platforma</span>
              </div>
              <h1 className="display" style={{margin:0, fontSize:"clamp(64px, 9vw, 132px)"}}>
                Dunyo <em style={{fontStyle:"italic", color:"var(--gold)"}}>biografiyasi,</em><br/>
                xalq tomonidan.
              </h1>
              <p style={{marginTop:36, maxWidth:560, fontSize:18, lineHeight:1.55, color:"var(--ink-2)"}}>
                Bepul ochiq bilim platformasi — o'zingiz, brendingiz, mahsulotingiz uchun.
                Google da Wikipedia kabi ko'rining.
              </p>
              <div style={{marginTop:48, maxWidth:680}}>
                <SearchBox autoFocus={false}/>
              </div>
            </div>

            <div className="hide-mobile" style={{position:"relative"}}>
              <div style={{
                border:"1px solid var(--line-2)", padding:"32px",
                background:"color-mix(in srgb, var(--gold) 5%, transparent)"
              }}>
                <div className="eyebrow" style={{marginBottom:16}}>Google qidiruv natijasi</div>
                <div style={{background:"var(--bg)", border:"1px solid var(--line)", padding:20}}>
                  <div style={{color:"#4A90D9", fontSize:16, marginBottom:4}}>WikiBio — Ismingiz</div>
                  <div style={{color:"#3a7a3a", fontSize:12, marginBottom:8}}>wiki-bio.vercel.app/ismingiz</div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 120px", gap:16}}>
                    <div style={{fontSize:13, color:"var(--ink-2)", lineHeight:1.5}}>
                      Kasb · Tug'ilgan yil · Qisqa ma'lumot...
                    </div>
                    <div style={{background:"var(--bg-3)", aspectRatio:"3/4", display:"flex", alignItems:"center", justifyContent:"center"}}>
                      <I.image size={24} style={{color:"var(--ink-3)"}}/>
                    </div>
                  </div>
                </div>
                <div style={{marginTop:16, fontSize:12, color:"var(--ink-3)"}}>
                  Shunday ko'rinish — 6-12 oyda erishish mumkin
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryMarquee/>
      <StatsStrip/>
      <FeaturedGrid/>
      <HowItWorks/>
      <Manifesto/>
    </div>
  );
};

window.HomePage = HomePage;
window.SearchBox = SearchBox;
