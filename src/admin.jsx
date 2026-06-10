/* Admin Panel (real Supabase) */

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

/* --- Sparkline -- */
const Sparkline = ({ points, color, width=120, height=28 }) => {
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const d = points.map((v,i) => `${i===0?"M":"L"} ${i*step} ${height-((v-min)/range)*height}`).join(" ");
  return (
    <svg width={width} height={height} style={{overflow:"visible"}}>
      <path d={d} stroke={color} strokeWidth="1.5" fill="none"/>
    </svg>
  );
};

/* - StatBlock ---- */
const StatBlock = ({ label, value, delta, sparkline }) => (
  <div style={{padding:"28px 0", display:"grid", gap:8}}>
    <div className="label-sm">{label}</div>
    <div className="display tnum" style={{fontSize:46, fontWeight:300, letterSpacing:"-0.02em"}}>{value}</div>
    <div style={{display:"flex", alignItems:"center", gap:10, color:delta>=0?"#5DBF8E":"var(--accent-red)", fontSize:12}}>
      <span className="mono">{delta>=0?"▲":"▼"} {Math.abs(delta)}%</span>
      <span style={{color:"var(--ink-3)"}}>vs last 7d</span>
      {sparkline && <><span style={{flex:1}}/><Sparkline points={sparkline} color={delta>=0?"#5DBF8E":"var(--accent-red)"}/></>}
    </div>
  </div>
);

/* ---- Sidebar - */
const ADMIN_SECTIONS = [
  {id:"overview",  label:"Overview",     icon:I.bars},
  {id:"pending",   label:"Pending",      icon:I.bell},
  {id:"profiles",  label:"All Profiles", icon:I.users},
  {id:"imports",   label:"Wikipedia Import", icon:I.globe},
  {id:"analytics", label:"Analytics",    icon:I.trend},
];

const AdminSidebar = ({ active, setActive, pendingCount }) => (
  <aside style={{position:"sticky", top:96}}>
    <div className="label-sm" style={{marginBottom:18}}>Super Admin</div>
    <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:2}}>
      {ADMIN_SECTIONS.map(s => {
        const Icon = s.icon;
        return (
          <li key={s.id}>
            <button onClick={()=>setActive(s.id)} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px", width:"100%", textAlign:"left", fontSize:13.5,
              color: active===s.id ? "var(--ink)" : "var(--ink-2)",
              background: active===s.id ? "color-mix(in srgb, var(--gold) 8%, transparent)" : "transparent",
              borderLeft: active===s.id ? "2px solid var(--gold)" : "2px solid transparent",
            }}>
              <Icon size={14} style={{color: active===s.id?"var(--gold)":"var(--ink-3)"}}/>
              {s.label}
              {s.id==="pending" && pendingCount > 0 && (
                <span style={{
                  marginLeft:"auto", background:"var(--accent-red)", color:"#fff",
                  borderRadius:10, fontSize:10, padding:"2px 7px", fontFamily:"var(--font-mono)"
                }}>{pendingCount}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
    <div style={{marginTop:32, padding:16, border:"1px solid var(--line)", fontSize:12}}>
      <div className="label-sm" style={{marginBottom:8}}>Queue</div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span style={{color:"var(--ink-2)"}}>Awaiting review</span>
        <span className="mono" style={{color:"var(--gold)"}}>{pendingCount}</span>
      </div>
    </div>
  </aside>
);

/* - Overview -- */
const AdminOverview = ({ stats }) => (
  <div>
    <div style={{
      display:"grid", gridTemplateColumns:"repeat(4,1fr)",
      borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)",
    }}>
      <div style={{paddingLeft:0, paddingRight:24, borderRight:"1px solid var(--line)"}}>
        <StatBlock label="Jami profillar" value={stats.total} delta={4.2} sparkline={[12,18,16,22,28,26,34,42,46]}/>
      </div>
      <div style={{padding:"0 24px", borderRight:"1px solid var(--line)"}}>
        <StatBlock label="Kutilmoqda" value={stats.pending} delta={0} sparkline={[40,52,48,60,68,72,68,84,92]}/>
      </div>
      <div style={{padding:"0 24px", borderRight:"1px solid var(--line)"}}>
        <StatBlock label="Jonli profillar" value={stats.live} delta={3.4} sparkline={[30,32,28,40,46,52,48,54,60]}/>
      </div>
      <div style={{padding:"0 0 0 24px"}}>
        <StatBlock label="Foydalanuvchilar" value={stats.users} delta={8.1} sparkline={[60,62,64,62,58,60,62,58,56]}/>
      </div>
    </div>
    <div style={{marginTop:32, padding:"24px", border:"1px solid var(--line)"}}>
      <div className="eyebrow" style={{marginBottom:12}}>Tizim holati</div>
      <div style={{display:"flex", gap:24, flexWrap:"wrap"}}>
        {[["Supabase DB","#5DBF8E","● Ishlayapti"],["Vercel Deploy","#5DBF8E","● Ishlayapti"],["Storage","#5DBF8E","● Ishlayapti"]].map(([n,c,t])=>(
          <div key={n} style={{fontSize:13}}>
            <span className="mono" style={{color:c}}>{t}</span>
            <span style={{color:"var(--ink-3)", marginLeft:6}}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* - Pending profiles -- */
const AdminPending = ({ onApprove }) => {
  const [list, setList] = useStateA([]);
  const [loading, setLoading] = useStateA(true);
  const [note, setNote] = useStateA({});
  const [busy, setBusy] = useStateA(null);
  const { user } = useAuth();

  useEffectA(() => {
    API.getPendingProfiles().then(({ data }) => {
      setList(data || []);
      setLoading(false);
    });
  }, []);

  const review = async (profileId, action) => {
    setBusy(profileId);
    const { error } = await API.reviewProfile(profileId, action, user.id, note[profileId]||"");
    if (!error) {
      setList(l => l.filter(p => p.id !== profileId));
      onApprove?.();
    }
    setBusy(null);
  };

  if (loading) return <div style={{padding:40, color:"var(--ink-3)", textAlign:"center"}}>Yuklanmoqda...</div>;
  if (!list.length) return (
    <div style={{padding:60, textAlign:"center"}}>
      <div className="display" style={{fontSize:48, color:"var(--gold)"}}>✓</div>
      <div style={{color:"var(--ink-3)", marginTop:12}}>Hamma profil ko'rib chiqilgan</div>
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:20, padding:"12px 0", borderBottom:"1px solid var(--line-2)"}}>
        <div className="eyebrow">{list.length} ta profil ko'rib chiqilishini kutmoqda</div>
      </div>
      {list.map(p => (
        <div key={p.id} style={{
          border:"1px solid var(--line)", marginBottom:16, padding:24,
          display:"grid", gridTemplateColumns:"120px 1fr auto", gap:24, alignItems:"start"
        }}>
          {/* Photo */}
          <div style={{aspectRatio:"4/5", overflow:"hidden", background:"var(--bg-3)"}}>
            {p.photo_url
              ? <img src={p.photo_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              : <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <I.image size={28} style={{color:"var(--ink-3)"}}/>
                </div>
            }
          </div>

          {/* Info */}
          <div>
            <div style={{display:"flex", gap:10, alignItems:"baseline", marginBottom:6}}>
              <span className="serif" style={{fontSize:22, fontWeight:400}}>{p.name}</span>
              <span className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".12em"}}>{p.category?.toUpperCase()}</span>
            </div>
            <p style={{margin:"0 0 12px", color:"var(--ink-2)", fontSize:13.5, lineHeight:1.55}}>{p.short_bio}</p>
            <div style={{display:"flex", gap:16, flexWrap:"wrap", fontSize:12, color:"var(--ink-3)"}}>
              {p.birth_date && <span>Tug'ilgan: {p.birth_date}</span>}
              {p.nationality && <span>Millat: {p.nationality}</span>}
              <span className="mono">{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
            {(p.full_bio||[]).slice(0,1).map((s,i) => (
              <div key={i} style={{marginTop:12, padding:"10px 14px", background:"var(--bg-3)", fontSize:13, color:"var(--ink-2)", lineHeight:1.5}}>
                <strong>{s.title}:</strong> {s.body?.slice(0,200)}{s.body?.length>200?"...":""}
              </div>
            ))}
            <div style={{marginTop:12}}>
              <label className="field-label">Admin izohi (ixtiyoriy)</label>
              <input className="input" style={{maxWidth:400}} placeholder="Rad etish sababi yoki izoh..."
                value={note[p.id]||""} onChange={e=>setNote(n=>({...n,[p.id]:e.target.value}))}/>
            </div>
          </div>

          {/* Amallar */}
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            <button className="btn btn-primary" onClick={()=>review(p.id,"approve")}
              disabled={busy===p.id} style={{opacity:busy===p.id?.6:1}}>
              <I.check size={14}/> Tasdiqlash
            </button>
            <button className="btn btn-ghost" onClick={()=>review(p.id,"request_changes")}
              disabled={busy===p.id}>
              O'zgartirish so'ra
            </button>
            <button onClick={()=>review(p.id,"reject")} disabled={busy===p.id}
              style={{padding:"10px 16px", border:"1px solid var(--accent-red)", color:"var(--accent-red)", fontSize:13}}>
              <I.x size={14}/> Rad etish
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* --- All profiles - */
const AdminAllProfiles = () => {
  const [list, setList] = useStateA([]);
  const [loading, setLoading] = useStateA(true);
  const [statusFilter, setStatusFilter] = useStateA("");

  const load = async () => {
    const { data } = await API.getAllProfiles({ status: statusFilter||undefined });
    setList(data||[]);
    setLoading(false);
  };

  useEffectA(() => { load(); }, [statusFilter]);

  const statusColor = { pending:"var(--gold)", live:"#5DBF8E", approved:"#5DBF8E", rejected:"var(--accent-red)" };

  return (
    <div>
      <div style={{display:"flex", gap:8, marginBottom:20, flexWrap:"wrap"}}>
        {["","pending","live","rejected"].map(s => (
          <Pill key={s} active={statusFilter===s} onClick={()=>setStatusFilter(s)}>
            {s||"Barchasi"}
          </Pill>
        ))}
      </div>
      {loading ? <div style={{color:"var(--ink-3)"}}>Yuklanmoqda...</div> : (
        <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
          <thead>
            <tr className="mono" style={{color:"var(--ink-3)"}}>
              <th style={{padding:"10px 12px", textAlign:"left", fontSize:10, letterSpacing:".18em", borderBottom:"1px solid var(--line)"}}>PROFIL</th>
              <th style={{padding:"10px 12px", textAlign:"left", fontSize:10, letterSpacing:".18em", borderBottom:"1px solid var(--line)"}}>KATEGORIYA</th>
              <th style={{padding:"10px 12px", textAlign:"left", fontSize:10, letterSpacing:".18em", borderBottom:"1px solid var(--line)"}}>HOLAT</th>
              <th style={{padding:"10px 12px", textAlign:"left", fontSize:10, letterSpacing:".18em", borderBottom:"1px solid var(--line)"}}>SANA</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} style={{borderBottom:"1px solid var(--line)"}}>
                <td style={{padding:"14px 12px"}}>
                  <div className="serif" style={{fontSize:16}}>{p.name}</div>
                  <div style={{fontSize:11, color:"var(--ink-3)"}}>{p.slug}</div>
                </td>
                <td style={{padding:"14px 12px", color:"var(--ink-2)"}}>{p.category}</td>
                <td style={{padding:"14px 12px"}}>
                  <span className="mono" style={{fontSize:10, color:statusColor[p.status]||"var(--ink-3)", letterSpacing:".12em"}}>
                    ● {p.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{padding:"14px 12px", color:"var(--ink-3)", fontSize:12}}>
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* - Wikipedia Import - */
const AdminImport = () => {
  const [query, setQuery] = useStateA("");
  const [result, setResult] = useStateA(null);
  const [loading, setLoading] = useStateA(false);
  const [saved, setSaved] = useStateA(false);
  const [error, setError] = useStateA("");

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setResult(null); setError(""); setSaved(false);
    const { data, error } = await API.fetchFromWikipedia(query.trim());
    if (error) setError("Topilmadi: " + error);
    else setResult(data);
    setLoading(false);
  };

  const saveImport = async () => {
    const { error } = await API.saveImport(query, result);
    if (!error) setSaved(true);
  };

  return (
    <div style={{maxWidth:720}}>
      <div className="eyebrow" style={{marginBottom:14}}>Wikipedia dan import qilish</div>
      <div style={{display:"flex", gap:10, marginBottom:24}}>
        <input className="input" value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Wikipedia sahifa nomi, masalan: Feruz Umarov"
          onKeyDown={e=>e.key==="Enter"&&search()}
          style={{flex:1}}/>
        <button className="btn btn-primary" onClick={search} disabled={loading}>
          {loading ? "Izlanmoqda..." : "Qidirish"}
        </button>
      </div>

      {error && <div style={{padding:"12px 16px", background:"rgba(199,81,70,0.12)", color:"var(--accent-red)", fontSize:13, marginBottom:16}}>{error}</div>}

      {result && (
        <div style={{border:"1px solid var(--line)", padding:24}}>
          <div style={{display:"grid", gridTemplateColumns:"120px 1fr", gap:20, marginBottom:20}}>
            {result.photo_url && (
              <img src={result.photo_url} style={{width:"100%", aspectRatio:"4/5", objectFit:"cover"}}/>
            )}
            <div>
              <h3 className="serif" style={{fontSize:24, fontWeight:400, marginBottom:8}}>{result.name}</h3>
              <p style={{color:"var(--ink-2)", fontSize:13.5, lineHeight:1.6}}>{result.short_bio}</p>
              {result.wikipedia_url && (
                <a href={result.wikipedia_url} target="_blank" style={{color:"var(--gold)", fontSize:12, marginTop:8, display:"block"}}>
                  Wikipedia sahifasi →
                </a>
              )}
            </div>
          </div>
          <div style={{borderTop:"1px solid var(--line)", paddingTop:16, display:"flex", gap:10}}>
            {saved
              ? <div style={{color:"#5DBF8E", fontSize:13}}>✓ Saqlandi — Admin pending da ko'rinadi</div>
              : <button className="btn btn-primary" onClick={saveImport}>
                  <I.check size={14}/> Pending ga qo'shish
                </button>
            }
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Admin shell - */
const AdminPage = () => {
  const [active, setActive] = useStateA("overview");
  const [stats, setStats] = useStateA({total:0, pending:0, live:0, users:0});
  const { user, profile } = useAuth();

  useEffectA(() => {
    API.getStats().then(s => setStats(s));
  }, []);

  const reloadStats = () => API.getStats().then(s => setStats(s));

  // just a view admin
  if (!profile || !["admin","superadmin"].includes(profile.role)) {
    return (
      <div style={{padding:"80px 0", textAlign:"center"}}>
        <div className="display" style={{fontSize:64, color:"var(--accent-red)"}}>403</div>
        <div style={{color:"var(--ink-3)", marginTop:12}}>Admin huquqi yo'q</div>
      </div>
    );
  }

  const titles = {
    overview: ["Admin","paneli"],
    pending:  ["Ko'rib","chiqish"],
    profiles: ["Barcha","profillar"],
    imports:  ["Wikipedia","import"],
    analytics:["Deep","analytics"],
  };

  return (
    <div>
      <PageHeader dense
        eyebrow="Super Admin · WikiBio"
        title={titles[active][0]}
        italicWord={titles[active][1]}
        right={
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <span className="mono" style={{fontSize:11, color:"#5DBF8E", letterSpacing:".18em"}}>● TIZIM ISHLAYAPTI</span>
          </div>
        }
      />
      <div className="wrap">
        <div style={{display:"grid", gridTemplateColumns:"200px 1fr", gap:48, paddingBottom:80}}>
          <AdminSidebar active={active} setActive={setActive} pendingCount={stats.pending}/>
          <main>
            {active==="overview"  && <AdminOverview stats={stats}/>}
            {active==="pending"   && <AdminPending onApprove={reloadStats}/>}
            {active==="profiles"  && <AdminAllProfiles/>}
            {active==="imports"   && <AdminImport/>}
            {active==="analytics" && <div style={{color:"var(--ink-3)"}}>Analytics tez kunda...</div>}
          </main>
        </div>
      </div>
    </div>
  );
};

window.AdminPage = AdminPage;
