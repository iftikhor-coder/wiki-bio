/* WikiBio — Profile page (real Supabase) */

const { useState: useStateP, useEffect: useEffectP } = React;

/* ---------- TOC ---------- */
const TOC = ({ items }) => (
  <nav style={{position:"sticky", top:96}}>
    <div className="label-sm" style={{marginBottom:14}}>Mundarija</div>
    <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:0, borderLeft:"1px solid var(--line)"}}>
      {items.map((s,i) => (
        <li key={s.id}>
          <a href={`#sec-${s.id}`} style={{
            display:"flex", gap:14, padding:"10px 16px", fontSize:13,
            color:"var(--ink-2)", borderLeft:"1px solid transparent", marginLeft:-1
          }}
          onMouseEnter={e=>{e.currentTarget.style.color="var(--ink)"; e.currentTarget.style.borderLeftColor="var(--gold)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="var(--ink-2)"; e.currentTarget.style.borderLeftColor="transparent";}}>
            <span className="mono" style={{color:"var(--ink-3)", fontSize:11}}>{String(i+1).padStart(2,"0")}</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

/* ---------- Knowledge Panel ---------- */
const KnowledgePanel = ({ p }) => (
  <aside>
    <div className="crosshairs photo-frame" style={{aspectRatio:"4/5", position:"relative"}}>
      <span className="ch1"/><span className="ch2"/>
      {p.photo_url
        ? <img src={p.photo_url} style={{width:"100%", height:"100%", objectFit:"cover"}} alt={p.name}/>
        : <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg-3)"}}>
            <I.image size={48} style={{color:"var(--ink-3)"}}/>
          </div>
      }
      {p.tier !== "free" && (
        <span style={{
          position:"absolute", bottom:14, right:14, width:36, height:36, borderRadius:"50%",
          background: p.tier==="gold" ? "var(--verified-gold)" : "var(--verified-silver)",
          color:"#0A0F1E", display:"inline-flex", alignItems:"center", justifyContent:"center"
        }}><I.check size={16} stroke={2.5}/></span>
      )}
    </div>

    <div style={{marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <VerifiedBadge tier={p.tier}/>
      <div style={{display:"flex", gap:6}}>
        <button style={{width:32, height:32, borderRadius:"50%", border:"1px solid var(--line-2)", display:"inline-flex", alignItems:"center", justifyContent:"center", color:"var(--ink-2)"}}><I.share size={14}/></button>
      </div>
    </div>

    <dl style={{marginTop:24, fontSize:13}}>
      {(p.fields || [
        ["Tug'ilgan", p.birth_date],
        ["Millat", p.nationality],
        ["Kategoriya", p.category],
      ]).filter(([,v])=>v).map(([k,v]) => (
        <div key={k} style={{display:"grid", gridTemplateColumns:"100px 1fr", gap:18, padding:"14px 0", borderTop:"1px solid var(--line)"}}>
          <dt className="mono" style={{fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color:"var(--ink-3)", paddingTop:2}}>{k}</dt>
          <dd style={{margin:0, color:"var(--ink)", fontSize:13.5, lineHeight:1.5}}>{v}</dd>
        </div>
      ))}
    </dl>

    {(p.socials||[]).length > 0 && (
      <div style={{marginTop:18, borderTop:"1px solid var(--line)", paddingTop:18}}>
        <div className="label-sm" style={{marginBottom:12}}>Havolalar</div>
        <div style={{display:"grid", gap:8}}>
          {p.socials.map((s,i) => (
            <a key={i} href={s.handle?.startsWith("http") ? s.handle : `https://${s.kind}.com/${s.handle?.replace("@","")}`}
              target="_blank" rel="noopener noreferrer"
              style={{display:"flex", alignItems:"center", gap:12, padding:"10px 12px", border:"1px solid var(--line)", color:"var(--ink-2)", fontSize:13}}>
              <I.link size={14}/>
              <span style={{flex:1}}>{s.handle}</span>
              <I.arrowUR size={12} style={{color:"var(--ink-3)"}}/>
            </a>
          ))}
        </div>
      </div>
    )}

    <div style={{marginTop:22, padding:"16px 0", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)",
      display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, textAlign:"center"}}>
      <div>
        <div className="serif" style={{fontSize:20}}>{p.views_count || 0}</div>
        <div className="label-sm" style={{marginTop:4}}>Ko'rishlar</div>
      </div>
      <div>
        <div className="serif" style={{fontSize:20, color:"#5DBF8E"}}>✓</div>
        <div className="label-sm" style={{marginTop:4}}>Indekslangan</div>
      </div>
    </div>
  </aside>
);

/* ---------- Schema panel ---------- */
const SchemaPanel = ({ p }) => {
  const schema = p.schema_json || {
    "@context": "https://schema.org",
    "@type": p.category==="Brand" ? "Organization" : "Person",
    "name": p.name,
    "jobTitle": p.category,
    "birthDate": p.birth_date,
    "nationality": p.nationality,
    "description": p.short_bio,
    "image": p.photo_url,
    "url": `https://wiki-bio.vercel.app/#/p/${p.slug}`
  };
  return (
    <div style={{border:"1px dashed var(--gold-3)", padding:"22px 24px", marginTop:48, background:"color-mix(in srgb, var(--gold) 4%, transparent)"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
        <div className="eyebrow">Strukturlangan ma'lumot · indekslangan</div>
        <div className="mono" style={{fontSize:10, letterSpacing:".18em", color:"var(--ink-3)"}}>schema.org/Person · JSON-LD</div>
      </div>
      <pre className="mono" style={{margin:0, padding:0, color:"var(--ink-2)", fontSize:12, lineHeight:1.7, whiteSpace:"pre-wrap", wordBreak:"break-word"}}>
        {JSON.stringify(schema, null, 2)}
      </pre>
      <div style={{marginTop:14, display:"flex", gap:14, fontSize:12, color:"var(--ink-3)"}}>
        <span style={{display:"inline-flex", alignItems:"center", gap:6}}>
          <span style={{width:6, height:6, borderRadius:"50%", background:"#5DBF8E"}}/>
          Google da jonli
        </span>
        <span>· Canonical: wiki-bio.vercel.app/#/p/{p.slug}</span>
      </div>
    </div>
  );
};

/* ---------- Profile Page ---------- */
const ProfilePage = ({ id }) => {
  const [p, setP] = useStateP(null);
  const [loading, setLoading] = useStateP(true);
  const [notFound, setNotFound] = useStateP(false);

  useEffectP(() => {
    setLoading(true);
    API.getProfile(id).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else {
        setP(data);
        if (window.SEO) {
          window.SEO.injectProfileSchema(data);
          window.SEO.setMeta(data);
          window.SEO.setCanonical(`https://wiki-bio.vercel.app/#/p/${data.slug}`);
        }
        API.addView && API.addView(data.id);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div style={{padding:"120px 0", textAlign:"center"}}>
      <div className="mono" style={{color:"var(--ink-3)", letterSpacing:".18em"}}>YUKLANMOQDA...</div>
    </div>
  );

  if (notFound) return (
    <div style={{padding:"120px 0", textAlign:"center"}}>
      <div className="display" style={{fontSize:80, color:"var(--accent-red)"}}>404</div>
      <div style={{color:"var(--ink-3)", marginTop:12}}>Profil topilmadi</div>
      <a href="#/" className="btn btn-ghost" style={{marginTop:24}}>Bosh sahifa</a>
    </div>
  );

  const sections = p.full_bio || [];
  const tocItems = [
    ...sections.map(s => ({ id: s.title?.toLowerCase().replace(/[^a-z0-9]+/g,"-"), title: s.title })),
    { id:"schema", title:"Strukturlangan ma'lumot" },
  ];

  const nameParts = p.name?.split(" ") || [""];
  const lastName = nameParts[nameParts.length-1];
  const firstName = nameParts.slice(0,-1).join(" ");

  return (
    <article>
      <header style={{padding:"40px 0 56px", borderBottom:"1px solid var(--line)"}}>
        <div className="wrap">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center",
            fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:".18em", textTransform:"uppercase", color:"var(--ink-3)"}}>
            <div style={{display:"flex", gap:14}}>
              <a href="#/">WikiBio</a>
              <span>/</span>
              <a href={`#/browse?cat=${p.category}`}>{p.category}</a>
              <span>/</span>
              <span style={{color:"var(--ink-2)"}}>{p.name}</span>
            </div>
            <span style={{color:"var(--gold)"}}>● Google da jonli</span>
          </div>

          <div style={{marginTop:64, display:"flex", alignItems:"center", gap:18}}>
            <span style={{height:1, background:"var(--gold)", width:80}}/>
            <span className="eyebrow" style={{color:"var(--gold)"}}>{p.category}</span>
          </div>

          <h1 className="display" style={{margin:"24px 0 0", fontSize:"clamp(80px, 13vw, 160px)"}}>
            {firstName} <em style={{fontStyle:"italic", color:"var(--gold)"}}>{lastName}</em>
          </h1>

          <div style={{marginTop:36, display:"flex", flexWrap:"wrap", gap:32, alignItems:"baseline"}}>
            {p.birth_date && (
              <div style={{display:"flex", alignItems:"baseline", gap:14, fontSize:14, color:"var(--ink-2)"}}>
                <span className="label-sm">Tug'ilgan</span>
                <span className="serif" style={{fontSize:17}}>{p.birth_date}</span>
              </div>
            )}
            {p.nationality && (
              <div style={{display:"flex", alignItems:"baseline", gap:14, fontSize:14, color:"var(--ink-2)"}}>
                <span className="label-sm">Millat</span>
                <span>{p.nationality}</span>
              </div>
            )}
            <div style={{flex:1}}/>
            {(p.tags||[]).slice(0,4).map(t => (
              <span key={t} style={{fontSize:11, padding:"5px 10px", border:"1px solid var(--line-2)", color:"var(--ink-2)"}}>{t}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="wrap" style={{paddingTop:64}}>
        <div style={{display:"grid", gridTemplateColumns:"180px 1fr 1fr 380px", gap:56, alignItems:"start"}}>
          <div className="hide-mobile"><TOC items={tocItems}/></div>

          <div style={{gridColumn:"span 2"}}>
            {p.short_bio && (
              <p className="serif" style={{
                fontSize:28, lineHeight:1.4, fontWeight:300, fontStyle:"italic",
                margin:"0 0 56px", color:"var(--ink)", letterSpacing:"-0.01em",
                maxWidth:680, borderTop:"3px solid var(--gold)", paddingTop:36
              }}>{p.short_bio}</p>
            )}

            {sections.map((s,i) => (
              <section key={i} id={`sec-${s.title?.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`} style={{marginBottom:56}}>
                <div style={{display:"flex", alignItems:"baseline", gap:18, marginBottom:24}}>
                  <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>§ {String(i+1).padStart(2,"0")}</span>
                  <h2 className="serif" style={{margin:0, fontSize:36, fontWeight:400}}>{s.title}</h2>
                </div>
                <div className={i===0?"dropcap":""} style={{fontSize:16, lineHeight:1.75, color:"var(--ink-2)", maxWidth:680}}>
                  {s.body}
                </div>
              </section>
            ))}

            <section id="sec-schema" style={{marginTop:80}}>
              <div style={{display:"flex", alignItems:"baseline", gap:18, marginBottom:24}}>
                <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>§ S1</span>
                <h2 className="serif" style={{margin:0, fontSize:36, fontWeight:400}}>Strukturlangan ma'lumot</h2>
              </div>
              <SchemaPanel p={p}/>
            </section>
          </div>

          <KnowledgePanel p={p}/>
        </div>
      </div>
    </article>
  );
};

window.ProfilePage = ProfilePage;
