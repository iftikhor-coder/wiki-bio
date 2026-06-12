/* WikiBio — Create Profile (real Supabase saqlash) */

const { useState: useStateC, useMemo: useMemoC } = React;

const STEPS = [
  { n:"I",   title:"Basic info",        key:"basic" },
  { n:"II",  title:"Photography",       key:"photo" },
  { n:"III", title:"Biography",         key:"bio"   },
  { n:"IV",  title:"Links & tags",      key:"links" },
  { n:"V",   title:"Preview & publish", key:"pub"   },
];

/* ---------- Stepper ---------- */
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
          <button onClick={()=>i<=step && setStep(i)} disabled={i>step} style={{
            width:"100%", padding:"22px 20px", textAlign:"left",
            borderRight: i<STEPS.length-1 ? "1px solid var(--line)" : "none",
            cursor: i<=step ? "pointer" : "not-allowed",
            background: active ? "color-mix(in srgb, var(--gold) 7%, transparent)" : "transparent",
            borderTop: active ? "2px solid var(--gold)" : "2px solid transparent",
            marginTop:-1, opacity: i>step ? 0.55 : 1,
          }}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
              <span className="display" style={{
                fontSize:24, fontStyle:"italic",
                color: active ? "var(--gold)" : done ? "var(--ink-2)" : "var(--ink-3)",
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

const Field = ({ label, hint, children, full }) => (
  <div style={{gridColumn: full ? "span 2" : "auto"}}>
    <label className="field-label">{label}</label>
    {children}
    {hint && <div style={{marginTop:8, fontSize:12, color:"var(--ink-3)"}}>{hint}</div>}
  </div>
);

const Pill = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding:"8px 14px",
    border:`1px solid ${active ? "var(--gold)" : "var(--line-2)"}`,
    color: active ? "var(--gold)" : "var(--ink-2)",
    fontSize:12,
    background: active ? "color-mix(in srgb, var(--gold) 8%, transparent)" : "transparent",
  }}>{children}</button>
);

/* ---------- Step 1 ---------- */
const StepBasic = ({ data, set }) => (
  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, maxWidth:760}}>
    <Field label="To'liq ism" full>
      <input className="input" value={data.name} onChange={e=>set({name:e.target.value})} placeholder="Ism Familiya"/>
    </Field>
    <Field label="Profil turi">
      <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
        {["Person","Brand","Product","Service"].map(t => (
          <Pill key={t} active={data.type===t} onClick={()=>set({type:t})}>{t}</Pill>
        ))}
      </div>
    </Field>
    <Field label="Kategoriya">
      <select className="select" value={data.category} onChange={e=>set({category:e.target.value})}>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>
    </Field>
    <Field label="Tug'ilgan sana">
      <input className="input" value={data.birth_date} onChange={e=>set({birth_date:e.target.value})} placeholder="March 14, 1984"/>
    </Field>
    <Field label="Millat / Davlat">
      <input className="input" value={data.nationality} onChange={e=>set({nationality:e.target.value})} placeholder="O'zbek"/>
    </Field>
    <Field label="Qisqa tavsif" full hint="Google eng avval shu satrni o'qiydi. 140 ta belgidan kam bo'lsin.">
      <input className="input" value={data.short_bio} onChange={e=>set({short_bio:e.target.value})} placeholder="O'zbekistonning taniqli musiqachisi..."/>
      <div style={{marginTop:6, fontSize:11, color:"var(--ink-3)", textAlign:"right"}} className="mono">
        {(data.short_bio||"").length} / 140
      </div>
    </Field>
  </div>
);

/* ---------- Step 2 ---------- */
const StepPhoto = ({ data, set }) => {
  const [uploading, setUploading] = useStateC(false);
  const { user } = useAuth();

  const handleFile = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const { url, error } = await API.uploadPhoto(file, user.id, type);
    if (!error && url) set(type === "portrait" ? { photo_url: url } : { cover_url: url });
    setUploading(false);
  };

  const stockPhotos = [];

  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:40}}>
        {/* Portrait */}
        <div>
          <label className="field-label">Portret rasm</label>
          <div style={{
            aspectRatio:"4/5", border:"1px dashed var(--line-2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            overflow:"hidden", position:"relative", background:"var(--bg-3)"
          }}>
            {data.photo_url
              ? <img src={data.photo_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              : <div style={{textAlign:"center", color:"var(--ink-3)", padding:24}}>
                  <I.upload size={28} style={{color:"var(--ink-2)"}}/>
                  <div className="serif" style={{fontSize:16, marginTop:10}}>Rasm tanlang</div>
                </div>
            }
          </div>
          <input type="file" accept="image/*" onChange={e=>handleFile(e,"portrait")}
            style={{marginTop:10, fontSize:13, color:"var(--ink-2)"}}/>
          {uploading && <div style={{fontSize:12, color:"var(--gold)", marginTop:6}}>Yuklanmoqda...</div>}
        </div>

        {/* Cover + library */}
        <div>
          <label className="field-label">Cover rasm (ixtiyoriy)</label>
          <div style={{
            aspectRatio:"16/7", border:"1px dashed var(--line-2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            overflow:"hidden", background:"var(--bg-3)", marginBottom:10
          }}>
            {data.cover_url
              ? <img src={data.cover_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              : <div style={{color:"var(--ink-3)", fontSize:13}}>Cover rasm</div>
            }
          </div>
          <input type="file" accept="image/*" onChange={e=>handleFile(e,"cover")}
            style={{fontSize:13, color:"var(--ink-2)", marginBottom:20}}/>

          <label className="field-label" style={{marginBottom:8}}>Yoki kutubxonadan tanlang</label>
          <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6}}>
            {stockPhotos.map((p,i) => (
              <button key={i} onClick={()=>set({photo_url:p})} style={{
                aspectRatio:"4/5", padding:0, overflow:"hidden",
                border: data.photo_url===p ? "2px solid var(--gold)" : "1px solid var(--line)",
              }}>
                <img src={p} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Step 3 ---------- */
const StepBio = ({ data, set }) => {
  const sections = data.full_bio || [{title:"Early Life", body:""},{title:"Career", body:""}];
  const update = (i, field, value) => {
    const next = sections.map((s,j) => j===i ? {...s,[field]:value} : s);
    set({full_bio: next});
  };
  return (
    <div style={{maxWidth:820}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
        <div className="label-sm">Bo'limlar</div>
        <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
          {["Early Life","Career","Awards","Personal Life"].map(t => (
            <Pill key={t} onClick={()=>set({full_bio:[...sections,{title:t,body:""}]})}>+ {t}</Pill>
          ))}
        </div>
      </div>
      {sections.map((s,i) => (
        <div key={i} style={{border:"1px solid var(--line)", marginBottom:16}}>
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 16px", borderBottom:"1px solid var(--line)",
            background:"color-mix(in srgb, var(--bg-2) 50%, transparent)"
          }}>
            <input value={s.title} onChange={e=>update(i,"title",e.target.value)}
              placeholder="Bo'lim nomi" style={{
                background:"transparent", border:0, outline:"none",
                color:"var(--ink)", fontSize:14, fontWeight:500
              }}/>
            <button onClick={()=>set({full_bio:sections.filter((_,j)=>j!==i)})}
              style={{color:"var(--ink-3)"}}><I.x size={14}/></button>
          </div>
          <textarea value={s.body} onChange={e=>update(i,"body",e.target.value)}
            placeholder="Matn yozing..."
            style={{
              width:"100%", border:0, outline:"none", background:"transparent",
              padding:"16px", color:"var(--ink-2)", fontSize:15,
              lineHeight:1.65, minHeight:140, resize:"vertical", fontFamily:"var(--font-sans)"
            }}/>
        </div>
      ))}
      <button onClick={()=>set({full_bio:[...sections,{title:"",body:""}]})}
        style={{
          width:"100%", padding:"20px", border:"1px dashed var(--line-2)",
          color:"var(--ink-3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8
        }}>
        <I.plus size={14}/> Bo'lim qo'shish
      </button>
    </div>
  );
};

/* ---------- Step 4 ---------- */
const StepLinks = ({ data, set }) => {
  const kinds = ["instagram","x","linkedin","imdb","site","youtube"];
  const socials = data.socials || [];
  return (
    <div style={{maxWidth:760}}>
      <div className="label-sm" style={{marginBottom:12}}>Ijtimoiy tarmoqlar</div>
      <div style={{display:"grid", gap:10, marginBottom:28}}>
        {socials.map((s,i) => (
          <div key={i} style={{display:"grid", gridTemplateColumns:"160px 1fr 40px", gap:10, alignItems:"center"}}>
            <select className="select" value={s.kind}
              onChange={e=>{const n=[...socials]; n[i]={...s,kind:e.target.value}; set({socials:n});}}>
              {kinds.map(k=><option key={k}>{k}</option>)}
            </select>
            <input className="input" value={s.handle} placeholder="@username yoki link"
              onChange={e=>{const n=[...socials]; n[i]={...s,handle:e.target.value}; set({socials:n});}}/>
            <button onClick={()=>set({socials:socials.filter((_,j)=>j!==i)})}
              style={{color:"var(--ink-3)"}}><I.x size={16}/></button>
          </div>
        ))}
        <button onClick={()=>set({socials:[...socials,{kind:"instagram",handle:""}]})}
          className="btn btn-ghost" style={{justifySelf:"start"}}>
          <I.plus size={14}/> Link qo'shish
        </button>
      </div>

      <div className="label-sm" style={{marginBottom:10}}>Teglar</div>
      <div style={{
        border:"1px solid var(--line-2)", padding:12,
        display:"flex", flexWrap:"wrap", gap:8, minHeight:54
      }}>
        {(data.tags||[]).map((t,i) => (
          <span key={i} style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"5px 10px",
            background:"color-mix(in srgb, var(--gold) 8%, transparent)",
            border:"1px solid var(--gold-3)", color:"var(--gold-2)", fontSize:12
          }}>
            {t}
            <button onClick={()=>set({tags:(data.tags||[]).filter((_,j)=>j!==i)})}>
              <I.x size={11}/>
            </button>
          </span>
        ))}
        <input placeholder="yozing va Enter bosing…"
          style={{flex:1, minWidth:140, background:"transparent", border:0, outline:"none", color:"var(--ink)", fontSize:13}}
          onKeyDown={e=>{
            if(e.key==="Enter" && e.target.value.trim()){
              set({tags:[...(data.tags||[]),e.target.value.trim()]});
              e.target.value="";
            }
          }}/>
      </div>
    </div>
  );
};

/* ---------- Step 5 preview ---------- */
const StepPreview = ({ data }) => (
  <div>
    <div style={{border:"1px solid var(--line-2)", padding:32, background:"color-mix(in srgb, var(--bg-2) 40%, transparent)"}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr 320px", gap:40, alignItems:"start"}}>
        <div>
          <span className="eyebrow" style={{color:"var(--gold)"}}>{data.category}</span>
          <h1 className="display" style={{margin:"12px 0 16px", fontSize:56}}>{data.name || "Ismingiz"}</h1>
          <p className="serif" style={{fontSize:17, lineHeight:1.5, fontStyle:"italic", color:"var(--ink-2)", borderTop:"2px solid var(--gold)", paddingTop:14}}>
            {data.short_bio || "Qisqa tavsif bu yerda chiqadi."}
          </p>
          {(data.full_bio||[]).filter(s=>s.body).map((s,i) => (
            <section key={i} style={{marginTop:24}}>
              <h3 className="serif" style={{fontSize:20, fontWeight:400, marginBottom:8}}>{s.title}</h3>
              <p style={{margin:0, color:"var(--ink-2)", fontSize:14, lineHeight:1.7}}>{s.body}</p>
            </section>
          ))}
        </div>
        <aside>
          <div style={{aspectRatio:"4/5", overflow:"hidden", background:"var(--bg-3)", marginBottom:14}}>
            {data.photo_url
              ? <img src={data.photo_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              : <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--ink-3)"}}>
                  <I.image size={32}/>
                </div>
            }
          </div>
          <dl style={{fontSize:13}}>
            {[["Tug'ilgan",data.birth_date],["Millat",data.nationality],["Kategoriya",data.category]]
              .filter(([,v])=>v)
              .map(([k,v]) => (
                <div key={k} style={{display:"grid", gridTemplateColumns:"90px 1fr", gap:10, padding:"10px 0", borderTop:"1px solid var(--line)"}}>
                  <dt className="label-sm" style={{paddingTop:2}}>{k}</dt>
                  <dd style={{margin:0, color:"var(--ink)"}}>{v}</dd>
                </div>
              ))
            }
          </dl>
        </aside>
      </div>
    </div>
  </div>
);

/* ---------- Success ---------- */
const SuccessScreen = ({ data, slug }) => (
  <div style={{textAlign:"center", padding:"80px 0"}}>
    <div style={{
      width:100, height:100, borderRadius:"50%", margin:"0 auto 28px",
      background:"linear-gradient(135deg, var(--gold), var(--gold-2))",
      display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#0A0F1E"
    }}>
      <I.check size={44} stroke={1.5}/>
    </div>
    <div className="eyebrow" style={{color:"var(--gold)"}}>Yuborildi — ko'rib chiqilmoqda</div>
    <h1 className="display" style={{margin:"20px 0 16px", fontSize:64}}>
      Profilingiz <em style={{fontStyle:"italic", color:"var(--gold)"}}>qabul qilindi.</em>
    </h1>
    <p style={{maxWidth:520, margin:"0 auto", color:"var(--ink-2)", fontSize:15, lineHeight:1.55}}>
      Admin tekshirib chiqqandan so'ng profilingiz jonlashadi va Google indekslanishiga yuboriladi.
      Odatda 24 soat ichida.
    </p>
    <div style={{display:"flex", gap:12, justifyContent:"center", marginTop:40}}>
      <a href="#/dashboard" className="btn btn-primary">Dashboard <I.arrowR size={14}/></a>
      <a href="#/" className="btn btn-ghost">Bosh sahifa</a>
    </div>
  </div>
);

/* ---------- Create page ---------- */
const CreatePage = () => {
  const { user } = useAuth();
  const [step, setStep] = useStateC(0);
  const [data, setData] = useStateC({
    name:"", type:"Person", category:"Musician",
    birth_date:"", nationality:"", short_bio:"",
    photo_url:"", cover_url:"",
    full_bio:[{title:"Early Life",body:""},{title:"Career",body:""}],
    socials:[{kind:"instagram",handle:""}],
    tags:[],
  });
  const [published, setPublished] = useStateC(false);
  const [savedSlug, setSavedSlug] = useStateC("");
  const [saving, setSaving] = useStateC(false);
  const [error, setError] = useStateC("");

  const set = (patch) => setData(d => ({...d,...patch}));

  const handlePublish = async () => {
    if (!user) { setError("Avval tizimga kiring!"); return; }
    if (!data.name.trim()) { setError("Ism kiritilmagan!"); return; }
    setSaving(true); setError("");
    const { data: saved, error: err } = await API.createProfile(data, user.id);
    if (err) { setError(err.message); setSaving(false); return; }
    setSavedSlug(saved?.slug || "");
    setPublished(true);
    setSaving(false);
  };

  if (published) return <div className="wrap-sm"><SuccessScreen data={data} slug={savedSlug}/></div>;

  return (
    <div>
      <PageHeader dense
        eyebrow="5 bosqichli forma"
        title="Profil"
        italicWord="yarating"
        subtitle="Har kim bepul profil yaratishi mumkin. Google da ko'rining."
      />
      <div className="wrap">
        <Stepper step={step} setStep={setStep}/>
        <div style={{padding:"48px 0 24px", minHeight:440}}>
          {step===0 && <StepBasic data={data} set={set}/>}
          {step===1 && <StepPhoto data={data} set={set}/>}
          {step===2 && <StepBio   data={data} set={set}/>}
          {step===3 && <StepLinks data={data} set={set}/>}
          {step===4 && <StepPreview data={data}/>}
        </div>

        {error && <div style={{padding:"10px 14px", background:"rgba(199,81,70,0.12)", color:"var(--accent-red)", fontSize:13, marginBottom:14}}>{error}</div>}

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 0", borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-ghost" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{opacity:step===0?.4:1}}>
            <I.arrowL size={14}/> Orqaga
          </button>
          <div className="mono" style={{fontSize:11, letterSpacing:".18em", color:"var(--ink-3)", textTransform:"uppercase"}}>
            {step+1} / {STEPS.length} — {STEPS[step].title}
          </div>
          {step < STEPS.length-1
            ? <button className="btn btn-primary" onClick={()=>setStep(s=>s+1)}>Davom <I.arrowR size={14}/></button>
            : <button className="btn btn-primary" onClick={handlePublish} disabled={saving} style={{opacity:saving?.6:1}}>
                {saving ? "Saqlanmoqda..." : "Nashr etish"} <I.arrowR size={14}/>
              </button>
          }
        </div>
      </div>
    </div>
  );
};

window.CreatePage = CreatePage;
