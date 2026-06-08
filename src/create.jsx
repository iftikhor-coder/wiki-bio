/* WikiBio — Create Profile multi-step wizard */

const { useState: useStateC, useMemo: useMemoC } = React;

const STEPS = [
  { n: "I",   title: "Basic info",      key: "basic" },
  { n: "II",  title: "Photography",     key: "photo" },
  { n: "III", title: "Biography",       key: "bio"   },
  { n: "IV",  title: "Links & tags",    key: "links" },
  { n: "V",   title: "Preview & publish", key: "pub" },
];

/* ---------- Step indicator ---------- */
const Stepper = ({ step, setStep }) => (
  <ol style={{
    listStyle:"none", padding:0, margin:0,
    display:"grid", gridTemplateColumns:`repeat(${STEPS.length}, 1fr)`,
    borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)"
  }}>
    {STEPS.map((s, i) => {
      const done = i < step, active = i === step;
      return (
        <li key={s.key}>
          <button onClick={()=>i<=step && setStep(i)}
            disabled={i>step}
            style={{
              width:"100%", padding:"22px 20px", textAlign:"left",
              borderRight: i<STEPS.length-1 ? "1px solid var(--line)" : "none",
              cursor: i<=step ? "pointer" : "not-allowed",
              background: active ? "color-mix(in srgb, var(--gold) 7%, transparent)" : "transparent",
              borderTop: active ? "2px solid var(--gold)" : "2px solid transparent",
              marginTop:-1, opacity: i>step ? 0.55 : 1, transition:"all .2s"
            }}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
              <span className="display" style={{
                fontSize:24, fontStyle:"italic", color: active ? "var(--gold)" : (done ? "var(--ink-2)" : "var(--ink-3)"),
              }}>{s.n}</span>
              {done && <I.check size={14} style={{color:"var(--gold)"}}/>}
            </div>
            <div className="label-sm" style={{marginTop:8, color: active ? "var(--ink)" : "var(--ink-3)"}}>
              {s.title}
            </div>
          </button>
        </li>
      );
    })}
  </ol>
);

/* ---------- Form field ---------- */
const Field = ({ label, hint, children, full }) => (
  <div style={{gridColumn: full ? "span 2" : "auto"}}>
    <label className="field-label">{label}</label>
    {children}
    {hint && <div style={{marginTop:8, fontSize:12, color:"var(--ink-3)"}}>{hint}</div>}
  </div>
);

const Pill = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding:"8px 14px", border:`1px solid ${active ? "var(--gold)" : "var(--line-2)"}`,
    color: active ? "var(--gold)" : "var(--ink-2)",
    fontSize:12, letterSpacing:".02em",
    background: active ? "color-mix(in srgb, var(--gold) 8%, transparent)" : "transparent",
    transition:"all .15s"
  }}>{children}</button>
);

/* ---------- Step 1: basic ---------- */
const StepBasic = ({ data, set }) => (
  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, maxWidth:760}}>
    <Field label="Full name" full>
      <input className="input" value={data.name} onChange={e=>set({name:e.target.value})} placeholder="Elena Marchetti"/>
    </Field>
    <Field label="Profile type">
      <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
        {["Person", "Brand", "Product", "Service"].map(t => (
          <Pill key={t} active={data.type===t} onClick={()=>set({type:t})}>{t}</Pill>
        ))}
      </div>
    </Field>
    <Field label="Primary category">
      <select className="select" value={data.category} onChange={e=>set({category:e.target.value})}>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>
    </Field>
    <Field label="Birth / founded date">
      <input className="input" type="text" value={data.birthDate} onChange={e=>set({birthDate:e.target.value})} placeholder="March 14, 1984"/>
    </Field>
    <Field label="Nationality / country">
      <input className="input" value={data.nationality} onChange={e=>set({nationality:e.target.value})} placeholder="Italian-American"/>
    </Field>
    <Field label="One-line description" full hint="The first thing Google reads. Keep it factual and < 140 characters.">
      <input className="input" value={data.short} onChange={e=>set({short:e.target.value})} placeholder="Italian-American cinematographer known for natural-light portraiture."/>
      <div style={{marginTop:6, fontSize:11, color:"var(--ink-3)", textAlign:"right"}} className="mono">
        {(data.short||"").length} / 140
      </div>
    </Field>
  </div>
);

/* ---------- Step 2: photo ---------- */
const Dropzone = ({ label, hint, aspect = "4/5", img, onPick }) => (
  <div>
    <label className="field-label">{label}</label>
    <div style={{
      aspectRatio: aspect, border:"1px dashed var(--line-2)",
      background: img ? "transparent" : "color-mix(in srgb, var(--bg-2) 50%, transparent)",
      position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center"
    }}>
      {img ? (
        <Photo src={img} name="" color="var(--gold-3)" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
      ) : (
        <div style={{textAlign:"center", color:"var(--ink-3)", padding:24}}>
          <I.upload size={28} style={{color:"var(--ink-2)"}}/>
          <div className="serif" style={{fontSize:18, marginTop:14, color:"var(--ink-2)"}}>Drop a photo</div>
          <div style={{fontSize:12, marginTop:6}}>or click to browse · JPG, PNG · min 800×1000px</div>
        </div>
      )}
      <button onClick={onPick} style={{position:"absolute", inset:0, cursor:"pointer", background:"transparent"}}/>
    </div>
    {hint && <div style={{marginTop:10, fontSize:12, color:"var(--ink-3)"}}>{hint}</div>}
  </div>
);

const StepPhoto = ({ data, set }) => {
  const stockPortraits = PROFILES.slice(0, 6).map(p => p.photo);
  const stockCovers = PROFILES.slice(0, 6).map(p => p.cover);
  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:40}}>
        <Dropzone label="Portrait — primary" aspect="4/5" img={data.photo}
          hint="This is the photo Google uses in the Knowledge Panel. Vertical orientation works best."
          onPick={() => set({ photo: stockPortraits[Math.floor(Math.random()*stockPortraits.length)] })}/>
        <div>
          <Dropzone label="Cover image — optional" aspect="16/7" img={data.cover}
            hint="A landscape image for the top of your profile page. Skip if you don't have one."
            onPick={() => set({ cover: stockCovers[Math.floor(Math.random()*stockCovers.length)] })}/>

          <div style={{marginTop:32}}>
            <label className="field-label">Or pick from our library</label>
            <div style={{display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:8, marginTop:6}}>
              {stockPortraits.map((p, i) => (
                <button key={i} onClick={()=>set({photo: p})}
                  style={{
                    aspectRatio:"4/5", padding:0, overflow:"hidden",
                    border: data.photo === p ? "2px solid var(--gold)" : "1px solid var(--line)",
                  }}>
                  <img src={p} style={{width:"100%", height:"100%", objectFit:"cover", display:"block"}}/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Step 3: bio (rich text editor) ---------- */
const RichToolbar = () => (
  <div style={{
    display:"flex", gap:4, padding:8,
    borderBottom:"1px solid var(--line)", color:"var(--ink-3)"
  }}>
    {[
      ["H1", "serif"], ["H2", "serif"], ["B", "bold"], ["i", "italic"],
      [<I.list size={14}/>, "list"], [<I.quote size={14}/>, "quote"], [<I.link size={14}/>, "link"]
    ].map(([l], i) => (
      <button key={i} style={{
        width:30, height:30, fontSize:13, fontFamily: i<2 ? "var(--font-display)" : "var(--font-sans)",
        fontStyle: i===3 ? "italic" : "normal",
        fontWeight: i===2 ? 700 : 400,
        color:"var(--ink-2)",
      }}>{l}</button>
    ))}
    <div style={{flex:1}}/>
    <span className="mono" style={{fontSize:10, letterSpacing:".18em", textTransform:"uppercase", padding:"6px 8px"}}>
      0 / 1500 words
    </span>
  </div>
);

const BioSection = ({ title, value, onChange, onRemove }) => (
  <div style={{border:"1px solid var(--line)", marginBottom:18}}>
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"14px 16px", borderBottom:"1px solid var(--line)",
      background:"color-mix(in srgb, var(--bg-2) 50%, transparent)"
    }}>
      <div style={{display:"flex", gap:14, alignItems:"center"}}>
        <I.grip size={14} style={{color:"var(--ink-3)", cursor:"grab"}}/>
        <input value={title} placeholder="Section title — e.g. Early Life"
          style={{
            background:"transparent", border:0, outline:"none",
            color:"var(--ink)", fontSize:14, fontWeight:500
          }}/>
      </div>
      <button onClick={onRemove} style={{color:"var(--ink-3)"}}><I.x size={14}/></button>
    </div>
    <RichToolbar />
    <textarea
      value={value}
      onChange={e=>onChange(e.target.value)}
      placeholder="Write the section content here. Plain prose, full sentences. Cite your sources at the end of the wizard."
      style={{
        width:"100%", border:0, outline:"none", background:"transparent",
        padding:"18px 20px", color:"var(--ink-2)", fontSize:15,
        lineHeight:1.65, minHeight:160, resize:"vertical",
        fontFamily:"var(--font-sans)"
      }}/>
  </div>
);

const StepBio = ({ data, set }) => {
  const sections = data.sections || [
    { title: "Early Life", body: "" },
    { title: "Career", body: "" }
  ];
  const update = (i, field, value) => {
    const next = sections.map((s, j) => j===i ? {...s, [field]: value} : s);
    set({sections: next});
  };
  return (
    <div style={{maxWidth:820}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
        <div className="label-sm">Sections — drag to reorder</div>
        <div style={{display:"flex", gap:8}}>
          {["Early Life","Career","Style","Awards","Personal Life","Legacy"].map(t => (
            <Pill key={t} onClick={()=>set({sections:[...sections, {title:t, body:""}]})}>
              + {t}
            </Pill>
          ))}
        </div>
      </div>
      {sections.map((s, i) => (
        <BioSection key={i} title={s.title} value={s.body}
          onChange={v=>update(i, "body", v)}
          onRemove={()=>set({sections: sections.filter((_, j)=>j!==i)})}/>
      ))}
      <button style={{
        width:"100%", padding:"22px", border:"1px dashed var(--line-2)",
        color:"var(--ink-3)", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:10
      }}
        onClick={()=>set({sections:[...sections, {title:"", body:""}]})}>
        <I.plus size={14}/> Add custom section
      </button>
    </div>
  );
};

/* ---------- Step 4: links ---------- */
const StepLinks = ({ data, set }) => {
  const kinds = ["instagram","x","linkedin","imdb","site"];
  const socials = data.socials || [];
  return (
    <div style={{maxWidth:760}}>
      <div className="label-sm" style={{marginBottom:14}}>Social links</div>
      <div style={{display:"grid", gap:10, marginBottom:32}}>
        {socials.map((s, i) => (
          <div key={i} style={{display:"grid", gridTemplateColumns:"160px 1fr 40px", gap:12, alignItems:"center"}}>
            <select className="select" value={s.kind}
              onChange={e=>{
                const next=[...socials]; next[i]={...s, kind:e.target.value}; set({socials:next});
              }}>
              {kinds.map(k => <option key={k}>{k}</option>)}
            </select>
            <input className="input" value={s.handle}
              placeholder="@yourhandle  or  yourdomain.com"
              onChange={e=>{
                const next=[...socials]; next[i]={...s, handle:e.target.value}; set({socials:next});
              }}/>
            <button onClick={()=>set({socials: socials.filter((_,j)=>j!==i)})}
              style={{color:"var(--ink-3)"}}><I.x size={16}/></button>
          </div>
        ))}
        <button onClick={()=>set({socials:[...socials, {kind:"instagram", handle:""}]})}
          className="btn btn-ghost" style={{justifySelf:"start"}}>
          <I.plus size={14}/> Add link
        </button>
      </div>

      <div className="label-sm" style={{marginBottom:14}}>Tags — for browse & search</div>
      <div style={{
        border:"1px solid var(--line-2)", padding:14,
        display:"flex", flexWrap:"wrap", gap:8, minHeight:60
      }}>
        {(data.tags||[]).map((t, i) => (
          <span key={i} style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"6px 10px", background:"color-mix(in srgb, var(--gold) 8%, transparent)",
            border:"1px solid var(--gold-3)", color:"var(--gold-2)", fontSize:12
          }}>
            {t}
            <button onClick={()=>set({tags:(data.tags||[]).filter((_,j)=>j!==i)})}>
              <I.x size={11}/>
            </button>
          </span>
        ))}
        <input placeholder="type and press enter…" style={{
          flex:1, minWidth:160, background:"transparent", border:0, outline:"none",
          color:"var(--ink)", fontSize:13, padding:"6px 4px"
        }}
        onKeyDown={(e)=>{
          if(e.key==="Enter" && e.target.value.trim()){
            set({tags:[...(data.tags||[]), e.target.value.trim()]});
            e.target.value="";
          }
        }}/>
      </div>

      <div style={{
        marginTop:40, padding:"28px 32px",
        border:"1px solid var(--gold-3)",
        background:"linear-gradient(135deg, color-mix(in srgb, var(--gold) 8%, transparent), transparent)",
        display:"grid", gridTemplateColumns:"60px 1fr auto", gap:24, alignItems:"center"
      }}>
        <div style={{
          width:60, height:60, borderRadius:"50%",
          background:"var(--gold)", color:"#0A0F1E",
          display:"inline-flex", alignItems:"center", justifyContent:"center"
        }}>
          <I.badge size={24} stroke={1.5}/>
        </div>
        <div>
          <div className="serif" style={{fontSize:22, fontWeight:400, letterSpacing:"-0.01em"}}>
            Upgrade to <em style={{fontStyle:"italic"}}>Gold Verified</em> — $9/mo
          </div>
          <div style={{color:"var(--ink-2)", fontSize:13.5, marginTop:6, lineHeight:1.5}}>
            Gold tier brings priority Google indexing (typically &lt;2 hours), the verified
            gold ribbon, custom domain support, and advanced analytics.
          </div>
        </div>
        <button className="btn btn-primary">Upgrade <I.arrowR size={14}/></button>
      </div>
    </div>
  );
};

/* ---------- Step 5: preview ---------- */
const StepPreview = ({ data }) => {
  const p = {
    ...data,
    italicLast: (data.name || "Your Name").split(" ").slice(-1)[0],
    born: 2026,
    profileNumber: "—",
    photo: data.photo || PROFILES[0].photo,
    tier: "free",
    fields: [
      ["Born", data.birthDate || "—"],
      ["From", data.nationality || "—"],
      ["Category", data.category || "—"],
    ],
    socials: data.socials || [],
    tags: data.tags || [],
    views: "—", followers: "—"
  };
  return (
    <div>
      <div className="rule" style={{marginBottom:24}}>
        <span style={{flex:"none"}}>Preview</span>
        <span style={{flex:"none", color:"var(--gold)"}}>as it will appear</span>
      </div>
      <div style={{
        border:"1px solid var(--line-2)", padding:40,
        background:"color-mix(in srgb, var(--bg-2) 40%, transparent)"
      }}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 360px", gap:48, alignItems:"start"}}>
          <div>
            <span className="eyebrow" style={{color:"var(--gold)"}}>The {p.category || "—"}</span>
            <h1 className="display" style={{margin:"14px 0 18px", fontSize:64}}>
              {p.name || "Your Name"}
            </h1>
            <p className="serif" style={{
              fontSize:18, lineHeight:1.5, fontStyle:"italic", color:"var(--ink-2)",
              borderTop:"2px solid var(--gold)", paddingTop:16, marginTop:24, maxWidth:520
            }}>
              {p.short || "Your one-line description appears here, exactly as Google will read it."}
            </p>
            {(p.sections||[]).filter(s=>s.body).map((s, i) => (
              <section key={i} style={{marginTop:32}}>
                <h3 className="serif" style={{fontSize:22, fontWeight:400, margin:"0 0 10px"}}>{s.title}</h3>
                <p style={{margin:0, color:"var(--ink-2)", fontSize:14.5, lineHeight:1.7}}>{s.body}</p>
              </section>
            ))}
          </div>
          <aside>
            <div className="photo-frame" style={{aspectRatio:"4/5"}}>
              <Photo src={p.photo} name={p.name} color="var(--gold-3)"
                style={{width:"100%", height:"100%", objectFit:"cover"}}/>
            </div>
            <dl style={{marginTop:18, fontSize:13}}>
              {p.fields.map(([k, v]) => (
                <div key={k} style={{display:"grid", gridTemplateColumns:"90px 1fr", gap:14,
                  padding:"12px 0", borderTop:"1px solid var(--line)"}}>
                  <dt className="label-sm" style={{paddingTop:2}}>{k}</dt>
                  <dd style={{margin:0, color:"var(--ink)"}}>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ---------- Success ---------- */
const SuccessScreen = ({ data }) => (
  <div style={{textAlign:"center", padding:"80px 0 40px"}}>
    <div style={{
      width:120, height:120, borderRadius:"50%", margin:"0 auto 32px",
      background:"linear-gradient(135deg, var(--gold), var(--gold-2))",
      display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#0A0F1E"
    }}>
      <I.check size={56} stroke={1.5}/>
    </div>
    <div className="eyebrow" style={{color:"var(--gold)"}}>Published · Vol. III · № 184,303</div>
    <h1 className="display" style={{margin:"22px 0 18px", fontSize:80}}>
      Your profile is <em style={{fontStyle:"italic", color:"var(--gold)"}}>live.</em>
    </h1>
    <p style={{maxWidth:580, margin:"0 auto", color:"var(--ink-2)", fontSize:16, lineHeight:1.55}}>
      <strong style={{color:"var(--ink)"}}>{data.name || "Your profile"}</strong> is now Google-indexable.
      It typically takes 24–72 hours on the free tier to appear in the Knowledge Panel.
    </p>

    <div style={{
      marginTop:48, maxWidth:620, marginInline:"auto",
      border:"1px solid var(--line-2)", padding:"22px 28px", textAlign:"left"
    }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
        <span className="label-sm">Your canonical URL</span>
        <span className="mono" style={{fontSize:10, color:"#5DBF8E", letterSpacing:".18em"}}>● SUBMITTED TO GOOGLE</span>
      </div>
      <div className="mono" style={{
        fontSize:14, padding:"10px 14px", border:"1px solid var(--line)",
        background:"color-mix(in srgb, var(--gold) 5%, transparent)", color:"var(--gold-2)"
      }}>
        wikibio.org/{(data.name||"your-name").toLowerCase().replace(/\s+/g,"-")}
      </div>
    </div>

    <div style={{display:"flex", gap:14, justifyContent:"center", marginTop:48}}>
      <a href="#/dashboard" className="btn btn-primary">Open my dashboard <I.arrowR size={14}/></a>
      <a href="#/p/elena-marchetti" className="btn btn-ghost">View live profile</a>
    </div>
  </div>
);

/* ---------- Create page ---------- */
const CreatePage = () => {
  const [step, setStep] = useStateC(0);
  const [data, setData] = useStateC({
    name:"", type:"Person", category:"Cinematographer",
    birthDate:"", nationality:"", short:"",
    photo:"", cover:"",
    sections:[{title:"Early Life", body:""},{title:"Career", body:""}],
    socials:[{kind:"instagram", handle:""}],
    tags:[],
  });
  const [published, setPublished] = useStateC(false);
  const set = (patch) => setData(d => ({...d, ...patch}));

  if (published) {
    return (
      <div className="wrap-sm">
        <SuccessScreen data={data}/>
      </div>
    );
  }

  return (
    <div>
      <PageHeader dense
        eyebrow="Multi-step · 5 of 5"
        title="Create a"
        italicWord="profile"
        subtitle="Anyone can publish. Each step takes a minute. You can save at any time and finish later."
      />
      <div className="wrap">
        <Stepper step={step} setStep={setStep}/>
        <div style={{padding:"56px 0 24px", minHeight:480}}>
          {step===0 && <StepBasic data={data} set={set}/>}
          {step===1 && <StepPhoto data={data} set={set}/>}
          {step===2 && <StepBio   data={data} set={set}/>}
          {step===3 && <StepLinks data={data} set={set}/>}
          {step===4 && <StepPreview data={data}/>}
        </div>
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"24px 0", borderTop:"1px solid var(--line)"
        }}>
          <button className="btn btn-ghost" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
            style={{opacity: step===0 ? .4 : 1}}>
            <I.arrowL size={14}/> Back
          </button>
          <div className="mono" style={{fontSize:11, letterSpacing:".18em", color:"var(--ink-3)", textTransform:"uppercase"}}>
            Step {step+1} of {STEPS.length} — {STEPS[step].title}
          </div>
          {step < STEPS.length - 1
            ? <button className="btn btn-primary" onClick={()=>setStep(s=>Math.min(STEPS.length-1, s+1))}>
                Continue <I.arrowR size={14}/>
              </button>
            : <button className="btn btn-primary" onClick={()=>setPublished(true)}>
                Publish profile <I.arrowR size={14}/>
              </button>
          }
        </div>
      </div>
    </div>
  );
};

window.CreatePage = CreatePage;
