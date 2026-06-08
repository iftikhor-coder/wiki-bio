/* WikiBio — Profile / Knowledge Panel page (the centerpiece) */

const { useState: useStateP, useMemo: useMemoP } = React;

/* ---------- Sticky TOC ---------- */
const TOC = ({ items }) => (
  <nav style={{position:"sticky", top:96}}>
    <div className="label-sm" style={{marginBottom:14}}>Contents</div>
    <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:0,
      borderLeft:"1px solid var(--line)"}}>
      {items.map((s, i) => (
        <li key={s.id}>
          <a href={`#sec-${s.id}`} style={{
            display:"flex", gap:14, padding:"10px 16px",
            fontSize:13, color:"var(--ink-2)", borderLeft:"1px solid transparent",
            marginLeft:-1
          }}
          onMouseEnter={(e)=>{e.currentTarget.style.color="var(--ink)"; e.currentTarget.style.borderLeftColor="var(--gold)";}}
          onMouseLeave={(e)=>{e.currentTarget.style.color="var(--ink-2)"; e.currentTarget.style.borderLeftColor="transparent";}}>
            <span className="mono" style={{color:"var(--ink-3)", fontSize:11}}>
              {String(i+1).padStart(2,"0")}
            </span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

/* ---------- Knowledge Panel (right column) ---------- */
const KnowledgePanel = ({ p }) => (
  <aside>
    <div className="crosshairs photo-frame" style={{aspectRatio:"4/5", position:"relative"}}>
      <span className="ch1" /><span className="ch2" />
      <Photo src={p.photo} name={p.name} color={p.color}
             style={{width:"100%", height:"100%", objectFit:"cover"}}/>
      <span style={{
        position:"absolute", top:14, left:14,
        background:"rgba(10,15,30,0.55)", backdropFilter:"blur(4px)",
        padding:"4px 10px", fontFamily:"var(--font-mono)", fontSize:10,
        letterSpacing:".22em", textTransform:"uppercase", color:"#fff"
      }}>№ {p.profileNumber}</span>
      {p.tier !== "free" && (
        <span style={{
          position:"absolute", bottom:14, right:14,
          width:36, height:36, borderRadius:"50%",
          background: p.tier==="gold" ? "var(--verified-gold)" : "var(--verified-silver)",
          color:"#0A0F1E", display:"inline-flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 18px rgba(0,0,0,0.45)"
        }}><I.check size={16} stroke={2.5}/></span>
      )}
    </div>

    {/* Verified + actions */}
    <div style={{marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <VerifiedBadge tier={p.tier}/>
      <div style={{display:"flex", gap:6}}>
        <button title="Save" style={iconBtn}><I.bookmark size={14}/></button>
        <button title="Share" style={iconBtn}><I.share size={14}/></button>
        <button title="Edit"  style={iconBtn}><I.edit size={14}/></button>
      </div>
    </div>

    {/* Quick facts table */}
    <dl style={{marginTop:24, padding:"4px 0", border:0, fontSize:13}}>
      {p.fields.map(([k, v]) => (
        <div key={k} style={{
          display:"grid", gridTemplateColumns:"100px 1fr", gap:18,
          padding:"14px 0", borderTop:"1px solid var(--line)"
        }}>
          <dt className="mono" style={{
            fontSize:10, letterSpacing:".18em", textTransform:"uppercase",
            color:"var(--ink-3)", paddingTop:2
          }}>{k}</dt>
          <dd style={{margin:0, color:"var(--ink)", fontSize:13.5, lineHeight:1.5}}>{v}</dd>
        </div>
      ))}
    </dl>

    {/* Socials */}
    <div style={{marginTop:18, borderTop:"1px solid var(--line)", paddingTop:18}}>
      <div className="label-sm" style={{marginBottom:12}}>Links</div>
      <div style={{display:"grid", gap:8}}>
        {p.socials.map(s => (
          <a key={s.handle} href="#" style={{
            display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
            border:"1px solid var(--line)", color:"var(--ink-2)", fontSize:13,
            transition:"border-color .2s, color .2s"
          }}
          onMouseEnter={(e)=>{e.currentTarget.style.borderColor="var(--gold-3)"; e.currentTarget.style.color="var(--ink)";}}
          onMouseLeave={(e)=>{e.currentTarget.style.borderColor="var(--line)"; e.currentTarget.style.color="var(--ink-2)";}}>
            <SocialIcon kind={s.kind}/>
            <span style={{flex:1}}>{s.handle}</span>
            <I.arrowUR size={12} style={{color:"var(--ink-3)"}}/>
          </a>
        ))}
      </div>
    </div>

    {/* Stats bar */}
    <div style={{marginTop:22, padding:"16px 0", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)",
      display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, textAlign:"center"}}>
      {[
        ["Views", p.views],
        ["Followers", p.followers || "—"],
        ["Indexed", "Google ✓"],
      ].map(([k, v]) => (
        <div key={k}>
          <div className="serif" style={{fontSize:20, fontWeight:400}}>{v}</div>
          <div className="label-sm" style={{marginTop:4}}>{k}</div>
        </div>
      ))}
    </div>
  </aside>
);

const iconBtn = {
  width:32, height:32, borderRadius:"50%",
  border:"1px solid var(--line-2)", display:"inline-flex",
  alignItems:"center", justifyContent:"center", color:"var(--ink-2)",
  transition:"all .15s"
};

/* ---------- Schema.org visual representation ---------- */
const SchemaPanel = ({ p }) => (
  <div style={{
    border:"1px dashed var(--gold-3)", padding:"22px 24px", marginTop:48,
    background:"color-mix(in srgb, var(--gold) 4%, transparent)"
  }}>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
      <div className="eyebrow">Structured data · indexed</div>
      <div className="mono" style={{fontSize:10, letterSpacing:".18em", color:"var(--ink-3)"}}>
        schema.org/Person · JSON-LD
      </div>
    </div>
    <pre className="mono" style={{
      margin:0, padding:0, color:"var(--ink-2)", fontSize:12, lineHeight:1.7,
      whiteSpace:"pre-wrap", wordBreak:"break-word"
    }}>{`{
  "@context": "https://schema.org",
  "@type": "${p.category === "Brand" ? "Organization" : "Person"}",
  "name": "${p.name}",
  "jobTitle": "${p.category}",
  "birthDate": "${p.birthDate}",
  "nationality": "${p.nationality}",
  "description": "${p.short}",
  "image": "${p.photo.split("?")[0]}",
  "sameAs": [${p.socials.map(s=>`\n    "https://${s.kind}.com/${s.handle.replace(/^@/,'')}"`).join(",")}
  ]
}`}</pre>
    <div style={{marginTop:14, display:"flex", gap:14, fontSize:12, color:"var(--ink-3)"}}>
      <span style={{display:"inline-flex", alignItems:"center", gap:6}}>
        <span style={{width:6, height:6, borderRadius:"50%", background:"#5DBF8E"}}/>
        Live on Google
      </span>
      <span>· Last crawled 2 hours ago</span>
      <span>· Canonical: wikibio.org/{p.id}</span>
    </div>
  </div>
);

/* ---------- Filmography / Works table ---------- */
const WorksTable = ({ items, kind = "filmography" }) => (
  <div style={{borderTop:"1px solid var(--line-2)"}}>
    {items.map((w, i) => (
      <div key={i} style={{
        display:"grid", gridTemplateColumns:"80px 1fr 1.4fr 180px",
        gap:24, padding:"22px 0",
        borderBottom:"1px solid var(--line)", alignItems:"baseline"
      }}>
        <div className="mono tnum" style={{fontSize:12, color:"var(--gold)", letterSpacing:".06em"}}>
          {w.year}
        </div>
        <div className="serif" style={{fontSize:22, fontWeight:400, letterSpacing:"-0.01em"}}>
          <em style={{fontStyle:"italic"}}>{w.title}</em>
        </div>
        <div style={{color:"var(--ink-2)", fontSize:13.5}}>{w.note || w.for}</div>
        <div className="label-sm" style={{textAlign:"right"}}>{w.role || w.award}</div>
      </div>
    ))}
  </div>
);

/* ---------- Related profiles ---------- */
const RelatedRail = ({ ids }) => {
  const items = ids.map(id => PROFILE_MAP[id]).filter(Boolean);
  if (!items.length) return null;
  return (
    <section style={{marginTop:80, paddingTop:64, borderTop:"1px solid var(--line)"}}>
      <div style={{display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:32}}>
        <div>
          <div className="eyebrow">Continue reading</div>
          <h2 className="display" style={{fontSize:48, margin:"14px 0 0"}}>
            Related <em style={{fontStyle:"italic"}}>profiles</em>
          </h2>
        </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:`repeat(${items.length}, 1fr)`, gap:28}}>
        {items.map((p, i) => <ProfileCard key={p.id} profile={p} variant="default" index={i}/>)}
      </div>
    </section>
  );
};

/* ---------- THE PROFILE PAGE ---------- */
const ProfilePage = ({ id }) => {
  const p = PROFILE_MAP[id] || PROFILES[0];

  const tocItems = useMemoP(() => {
    const xs = p.sections.map(s => ({ id: s.title.toLowerCase().replace(/[^a-z0-9]+/g,"-"), title: s.title }));
    if (p.filmography) xs.push({ id: "filmography", title: "Selected Filmography" });
    if (p.awards)      xs.push({ id: "awards", title: "Awards & Honors" });
    xs.push({ id: "schema", title: "Structured Data" });
    xs.push({ id: "sources", title: "Sources" });
    return xs;
  }, [p.id]);

  return (
    <article>
      {/* ---- Editorial masthead ---- */}
      <header style={{padding:"40px 0 56px", borderBottom:"1px solid var(--line)"}}>
        <div className="wrap">
          {/* Breadcrumb + meta */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center",
            fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:".18em",
            textTransform:"uppercase", color:"var(--ink-3)"}}>
            <div style={{display:"flex", gap:14}}>
              <a href="#/">WikiBio</a>
              <span>/</span>
              <a href={`#/browse?cat=${p.category}`}>{p.category}</a>
              <span>/</span>
              <span style={{color:"var(--ink-2)"}}>Profile № {p.profileNumber}</span>
            </div>
            <div style={{display:"flex", gap:14}}>
              <span>Vol. III · Edition 047</span>
              <span style={{color:"var(--gold)"}}>● Live on Google</span>
            </div>
          </div>

          {/* Category line */}
          <div style={{marginTop:64, display:"flex", alignItems:"center", gap:18}}>
            <span style={{height:1, background:"var(--gold)", width:80}}/>
            <span className="eyebrow" style={{color:"var(--gold)"}}>The {p.category}</span>
          </div>

          {/* Massive editorial display name */}
          <h1 className="display" style={{
            margin:"24px 0 0", fontSize:"clamp(80px, 13vw, 200px)",
          }}>
            {p.name.replace(p.italicLast, "").trim()}{" "}
            <em style={{fontStyle:"italic", color:"var(--gold)"}}>{p.italicLast}</em>
          </h1>

          {/* Sub line */}
          <div style={{
            marginTop:36, display:"flex", flexWrap:"wrap", gap:32, alignItems:"baseline"
          }}>
            <div style={{display:"flex", alignItems:"baseline", gap:14, fontSize:14, color:"var(--ink-2)"}}>
              <span className="label-sm">Born</span>
              <span className="serif tnum" style={{fontSize:17}}>{p.birthDate}</span>
            </div>
            <div style={{display:"flex", alignItems:"baseline", gap:14, fontSize:14, color:"var(--ink-2)"}}>
              <span className="label-sm">From</span>
              <span style={{fontSize:14}}>{p.nationality}</span>
            </div>
            <div style={{display:"flex", alignItems:"baseline", gap:14, fontSize:14, color:"var(--ink-2)"}}>
              <span className="label-sm">Based</span>
              <span style={{fontSize:14}}>{p.location}</span>
            </div>
            <div style={{flex:1}}/>
            <div style={{display:"flex", gap:8}}>
              {p.tags.slice(0, 4).map(t => (
                <span key={t} style={{
                  fontSize:11, padding:"5px 10px", border:"1px solid var(--line-2)",
                  color:"var(--ink-2)", letterSpacing:".02em"
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ---- Main body ---- */}
      <div className="wrap" style={{paddingTop:64}}>
        <div style={{display:"grid", gridTemplateColumns:"180px 1fr 1fr 420px", gap:56, alignItems:"start"}}>
          {/* TOC */}
          <div className="hide-mobile"><TOC items={tocItems}/></div>

          {/* Standfirst + bio */}
          <div style={{gridColumn:"span 2"}}>
            <p className="serif" style={{
              fontSize:28, lineHeight:1.4, fontWeight:300, fontStyle:"italic",
              margin:"0 0 56px", color:"var(--ink)", letterSpacing:"-0.01em",
              maxWidth:680, borderTop:"3px solid var(--gold)", paddingTop:36
            }}>
              {p.short}
            </p>

            {/* Section bodies */}
            {p.sections.map((s, i) => (
              <section key={s.title} id={`sec-${s.title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}
                style={{marginBottom:56}}>
                <div style={{display:"flex", alignItems:"baseline", gap:18, marginBottom:24}}>
                  <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>
                    § {String(i+1).padStart(2,"0")}
                  </span>
                  <h2 className="serif" style={{
                    margin:0, fontSize:36, fontWeight:400, letterSpacing:"-0.015em"
                  }}>{s.title}</h2>
                </div>
                <div className={i===0 ? "dropcap" : ""}
                  style={{
                    fontSize:16, lineHeight:1.75, color:"var(--ink-2)", maxWidth:680,
                    textWrap:"pretty"
                  }}>
                  {s.body}
                </div>
              </section>
            ))}

            {p.filmography && (
              <section id="sec-filmography" style={{marginTop:80}}>
                <div style={{display:"flex", alignItems:"baseline", gap:18, marginBottom:24}}>
                  <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>
                    § {String(p.sections.length+1).padStart(2,"0")}
                  </span>
                  <h2 className="serif" style={{margin:0, fontSize:36, fontWeight:400, letterSpacing:"-0.015em"}}>
                    Selected Filmography
                  </h2>
                </div>
                <WorksTable items={p.filmography}/>
              </section>
            )}

            {p.awards && (
              <section id="sec-awards" style={{marginTop:80}}>
                <div style={{display:"flex", alignItems:"baseline", gap:18, marginBottom:24}}>
                  <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>
                    § {String(p.sections.length+2).padStart(2,"0")}
                  </span>
                  <h2 className="serif" style={{margin:0, fontSize:36, fontWeight:400, letterSpacing:"-0.015em"}}>
                    Awards & Honors
                  </h2>
                </div>
                <WorksTable items={p.awards} kind="awards"/>
              </section>
            )}

            <section id="sec-schema" style={{marginTop:80}}>
              <div style={{display:"flex", alignItems:"baseline", gap:18, marginBottom:24}}>
                <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>§ S1</span>
                <h2 className="serif" style={{margin:0, fontSize:36, fontWeight:400, letterSpacing:"-0.015em"}}>
                  Structured Data
                </h2>
              </div>
              <p style={{color:"var(--ink-2)", fontSize:14.5, lineHeight:1.6, maxWidth:680, marginTop:0}}>
                This profile is published with JSON-LD structured data using the
                schema.org standard — the same standard Google reads when building
                its Knowledge Panels. Below is the live payload.
              </p>
              <SchemaPanel p={p}/>
            </section>

            <section id="sec-sources" style={{marginTop:80}}>
              <div style={{display:"flex", alignItems:"baseline", gap:18, marginBottom:24}}>
                <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>§ S2</span>
                <h2 className="serif" style={{margin:0, fontSize:36, fontWeight:400, letterSpacing:"-0.015em"}}>
                  Sources
                </h2>
              </div>
              <ol style={{paddingLeft:18, margin:0, color:"var(--ink-2)", fontSize:13.5, lineHeight:1.8}}>
                {p.sources.map((s, i) => (
                  <li key={i} style={{paddingLeft:6}}>{s}</li>
                ))}
              </ol>
            </section>
          </div>

          {/* Knowledge Panel sidebar */}
          <KnowledgePanel p={p}/>
        </div>

        {/* Related */}
        <RelatedRail ids={p.related}/>
      </div>
    </article>
  );
};

window.ProfilePage = ProfilePage;
