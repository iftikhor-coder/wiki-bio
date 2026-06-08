/* WikiBio — Super Admin dashboard */

const { useState: useStateA, useMemo: useMemoA } = React;

/* ---------- Stat block ---------- */
const StatBlock = ({ label, value, delta, sparkline }) => (
  <div style={{padding:"28px 0", display:"grid", gap:8}}>
    <div className="label-sm">{label}</div>
    <div className="display tnum" style={{fontSize:46, fontWeight:300, letterSpacing:"-0.02em"}}>
      {value}
    </div>
    <div style={{display:"flex", alignItems:"center", gap:10, color: delta>=0 ? "#5DBF8E" : "var(--accent-red)", fontSize:12}}>
      <span className="mono">{delta>=0 ? "▲" : "▼"} {Math.abs(delta)}%</span>
      <span style={{color:"var(--ink-3)"}}>vs last 7d</span>
      {sparkline && <span style={{flex:1}}/>}
      {sparkline && <Sparkline points={sparkline} color={delta>=0 ? "#5DBF8E" : "var(--accent-red)"} />}
    </div>
  </div>
);

const Sparkline = ({ points, color, width=120, height=28 }) => {
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const d = points.map((v, i) => `${i===0?"M":"L"} ${i*step} ${height - ((v-min)/range)*height}`).join(" ");
  return (
    <svg width={width} height={height} style={{overflow:"visible"}}>
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
};

/* ---------- Big chart ---------- */
const AreaChart = ({ data, height=260 }) => {
  const width = 800;
  const max = Math.max(...data.map(d => d.v));
  const step = width / (data.length - 1);
  const path = data.map((d, i) => `${i===0?"M":"L"} ${i*step} ${height - (d.v/max)*height*0.85}`).join(" ");
  const area = path + ` L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{width:"100%", height, display:"block"}}>
      <defs>
        <linearGradient id="aGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* horizontal grid */}
      {[0,1,2,3].map(i => (
        <line key={i} x1="0" x2={width} y1={height*(i/4)+1} y2={height*(i/4)+1}
          stroke="var(--line)" strokeDasharray="2 4"/>
      ))}
      <path d={area} fill="url(#aGrad)" />
      <path d={path} stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
      {data.map((d, i) => (i % 3 === 0) && (
        <circle key={i} cx={i*step} cy={height - (d.v/max)*height*0.85} r="2.5"
          fill="var(--gold)" stroke="var(--bg)" strokeWidth="1.5" />
      ))}
    </svg>
  );
};

/* ---------- Admin nav sidebar ---------- */
const ADMIN_SECTIONS = [
  { id:"overview", label:"Overview", icon: I.bars },
  { id:"profiles", label:"Profiles", icon: I.users },
  { id:"featured", label:"Featured", icon: I.star },
  { id:"seo",      label:"SEO Health", icon: I.spark },
  { id:"users",    label:"Users & roles", icon: I.shield },
  { id:"analytics",label:"Analytics", icon: I.trend },
];

const AdminSidebar = ({ active, setActive }) => (
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
              <Icon size={14} style={{color: active===s.id ? "var(--gold)" : "var(--ink-3)"}}/>
              {s.label}
            </button>
          </li>
        );
      })}
    </ul>

    <div style={{marginTop:32, padding:"16px", border:"1px solid var(--line)", fontSize:12}}>
      <div className="label-sm" style={{marginBottom:8}}>Queue</div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span style={{color:"var(--ink-2)"}}>Awaiting review</span>
        <span className="mono" style={{color:"var(--gold)"}}>47</span>
      </div>
      <div style={{display:"flex", justifyContent:"space-between", marginTop:6}}>
        <span style={{color:"var(--ink-2)"}}>Verification req</span>
        <span className="mono" style={{color:"var(--gold)"}}>12</span>
      </div>
      <div style={{display:"flex", justifyContent:"space-between", marginTop:6}}>
        <span style={{color:"var(--ink-2)"}}>Takedowns</span>
        <span className="mono" style={{color:"var(--accent-red)"}}>3</span>
      </div>
    </div>
  </aside>
);

/* ---------- Overview ---------- */
const AdminOverview = () => {
  const series = useMemoA(() => {
    const days = 30;
    return Array.from({length:days}, (_, i) => ({
      d:i, v: 800 + Math.round(Math.sin(i/2.5)*150 + Math.random()*300 + i*30)
    }));
  }, []);

  return (
    <div>
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(4, 1fr)",
        borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)",
      }}>
        <div style={{paddingLeft:0, paddingRight:24, borderRight:"1px solid var(--line)"}}>
          <StatBlock label="Total profiles" value="184,302" delta={4.2}
            sparkline={[12,18,16,22,28,26,34,30,38,42,46]}/>
        </div>
        <div style={{padding:"0 24px", borderRight:"1px solid var(--line)"}}>
          <StatBlock label="Daily registrations" value="1,206" delta={12.1}
            sparkline={[40,52,48,60,68,72,68,84,92,88,96]}/>
        </div>
        <div style={{padding:"0 24px", borderRight:"1px solid var(--line)"}}>
          <StatBlock label="Daily searches" value="92,488" delta={3.4}
            sparkline={[30,32,28,40,46,52,48,54,60,62,58]}/>
        </div>
        <div style={{padding:"0 0 0 24px"}}>
          <StatBlock label="Verified accounts" value="8,142" delta={-1.2}
            sparkline={[60,62,64,62,58,60,62,58,56,54,52]}/>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        marginTop:48, padding:"32px 32px 24px",
        border:"1px solid var(--line)"
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24}}>
          <div>
            <div className="eyebrow">Traffic</div>
            <h3 className="serif" style={{margin:"8px 0 0", fontSize:24, fontWeight:400}}>
              Profile views — last 30 days
            </h3>
          </div>
          <div style={{display:"flex", gap:6}}>
            {["24H","7D","30D","90D","1Y"].map((r, i) => (
              <button key={r} style={{
                padding:"6px 12px", fontSize:11, letterSpacing:".1em",
                fontFamily:"var(--font-mono)",
                color: i===2 ? "var(--gold)" : "var(--ink-3)",
                border: i===2 ? "1px solid var(--gold-3)" : "1px solid var(--line)",
              }}>{r}</button>
            ))}
          </div>
        </div>
        <AreaChart data={series}/>
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(5, 1fr)",
          marginTop:8, fontSize:10, color:"var(--ink-3)", fontFamily:"var(--font-mono)", letterSpacing:".1em"
        }}>
          <span>May 10</span><span style={{textAlign:"center"}}>May 17</span><span style={{textAlign:"center"}}>May 24</span><span style={{textAlign:"center"}}>May 31</span><span style={{textAlign:"right"}}>Jun 8</span>
        </div>
      </div>

      {/* Two-column: top searches + recent ----- */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginTop:32}}>
        <div style={{border:"1px solid var(--line)", padding:"24px 28px"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:16}}>
            <div className="eyebrow">Top searched names</div>
            <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".18em"}}>LAST 24H</div>
          </div>
          <ol style={{listStyle:"none", padding:0, margin:0}}>
            {PROFILES.slice(0,7).map((p, i) => {
              const queries = Math.round(8000 - i*900 + Math.random()*400);
              return (
                <li key={p.id} style={{
                  display:"grid", gridTemplateColumns:"24px 36px 1fr auto", gap:14,
                  alignItems:"center", padding:"10px 0",
                  borderTop: i===0 ? "1px solid var(--line)" : "none",
                  borderBottom:"1px solid var(--line)"
                }}>
                  <span className="mono" style={{color:"var(--ink-3)", fontSize:11}}>{String(i+1).padStart(2,"0")}</span>
                  <div style={{width:36, height:44, overflow:"hidden"}}>
                    <Photo src={p.photo} name={p.name} color={p.color} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                  </div>
                  <div>
                    <div className="serif" style={{fontSize:15, fontWeight:400}}>{p.name}</div>
                    <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".12em"}}>
                      {p.category.toUpperCase()}
                    </div>
                  </div>
                  <span className="mono tnum" style={{fontSize:13, color:"var(--gold)"}}>{queries.toLocaleString()}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div style={{border:"1px solid var(--line)", padding:"24px 28px"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:16}}>
            <div className="eyebrow">Recent registrations</div>
            <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".18em"}}>LAST HOUR</div>
          </div>
          {[
            ["Felix Aubuchon", "Photographer", "FR", "12s ago"],
            ["Yara Halawi", "Journalist", "LB", "1m ago"],
            ["Studio Hai-Lin", "Brand", "TW", "3m ago"],
            ["Toby Sundgren", "Athlete", "SE", "6m ago"],
            ["Itzel Cruz Vidal", "Author", "MX", "9m ago"],
            ["Aoife Brennan", "Designer", "IE", "14m ago"],
            ["Ravi Pillai", "Founder", "IN", "22m ago"],
          ].map(([n, c, country, t], i) => (
            <div key={i} style={{
              display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:14,
              padding:"12px 0", borderTop: i===0 ? "1px solid var(--line)" : "none",
              borderBottom:"1px solid var(--line)", alignItems:"center", fontSize:13
            }}>
              <div>
                <div style={{color:"var(--ink)"}}>{n}</div>
                <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".12em", marginTop:2}}>
                  {c.toUpperCase()}
                </div>
              </div>
              <span style={{
                fontSize:10, padding:"3px 7px", border:"1px solid var(--line-2)",
                color:"var(--ink-2)", letterSpacing:".08em"
              }} className="mono">{country}</span>
              <span className="mono" style={{fontSize:11, color:"var(--ink-3)"}}>{t}</span>
              <button style={{
                fontSize:11, padding:"5px 10px", border:"1px solid var(--gold-3)", color:"var(--gold)"
              }} className="mono">REVIEW</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Profile management ---------- */
const AdminProfiles = () => {
  const [filter, setFilter] = useStateA("All");
  const list = filter === "All" ? PROFILES : PROFILES.filter(p => p.category === filter);
  const cats = ["All", ...Array.from(new Set(PROFILES.map(p => p.category)))];
  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"16px 0", borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)", marginBottom:24
      }}>
        <div style={{display:"flex", alignItems:"center", gap:12, flex:1}}>
          <I.search size={14} style={{color:"var(--ink-3)"}}/>
          <input placeholder="Search 184,302 profiles by name, ID, category…"
            style={{background:"transparent", border:0, outline:"none", color:"var(--ink)", fontSize:14, flex:1, maxWidth:480}}/>
        </div>
        <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
          {cats.slice(0, 9).map(c => (
            <Pill key={c} active={filter===c} onClick={()=>setFilter(c)}>{c}</Pill>
          ))}
        </div>
      </div>

      {/* Table */}
      <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
        <thead>
          <tr style={{textAlign:"left", color:"var(--ink-3)"}} className="mono">
            <th style={th}>№</th>
            <th style={th}>Profile</th>
            <th style={th}>Category</th>
            <th style={th}>Tier</th>
            <th style={th}>Views</th>
            <th style={th}>SEO</th>
            <th style={th}>Indexed</th>
            <th style={{...th, textAlign:"right"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p, i) => {
            const seo = 60 + (i*7) % 38;
            return (
              <tr key={p.id} style={{borderTop:"1px solid var(--line)"}}>
                <td style={td} className="mono">№ {p.profileNumber}</td>
                <td style={td}>
                  <div style={{display:"flex", alignItems:"center", gap:12}}>
                    <div style={{width:32, height:40, overflow:"hidden", flexShrink:0}}>
                      <Photo src={p.photo} name={p.name} color={p.color} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                    </div>
                    <div>
                      <a href={`#/p/${p.id}`} className="serif" style={{fontSize:15, fontWeight:400}}>{p.name}</a>
                      <div style={{color:"var(--ink-3)", fontSize:11, marginTop:2}}>{p.nationality} · b. {p.born}</div>
                    </div>
                  </div>
                </td>
                <td style={td}><span style={{color:"var(--ink-2)"}}>{p.category}</span></td>
                <td style={td}><VerifiedBadge tier={p.tier}/></td>
                <td style={{...td, fontVariantNumeric:"tabular-nums"}} className="mono">{p.views}</td>
                <td style={td}>
                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                    <div style={{width:60, height:4, background:"var(--line)", overflow:"hidden"}}>
                      <div style={{width:`${seo}%`, height:"100%",
                        background: seo>80 ? "#5DBF8E" : seo>60 ? "var(--gold)" : "var(--accent-red)"}}/>
                    </div>
                    <span className="mono tnum" style={{fontSize:11, color:"var(--ink-2)"}}>{seo}</span>
                  </div>
                </td>
                <td style={td}>
                  <span className="mono" style={{fontSize:10, letterSpacing:".18em", color:"#5DBF8E"}}>
                    ● LIVE
                  </span>
                </td>
                <td style={{...td, textAlign:"right"}}>
                  <div style={{display:"inline-flex", gap:4}}>
                    <button style={actionBtn} title="Verify"><I.badge size={13}/></button>
                    <button style={actionBtn} title="Feature"><I.star size={13}/></button>
                    <button style={actionBtn} title="Edit"><I.edit size={13}/></button>
                    <button style={{...actionBtn, color:"var(--accent-red)"}} title="Ban"><I.x size={13}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const th = {padding:"12px 14px", fontSize:10, letterSpacing:".18em", textTransform:"uppercase", fontWeight:500};
const td = {padding:"16px 14px", verticalAlign:"middle"};
const actionBtn = {
  width:28, height:28, border:"1px solid var(--line)",
  display:"inline-flex", alignItems:"center", justifyContent:"center",
  color:"var(--ink-2)"
};

/* ---------- Featured drag-drop ---------- */
const AdminFeatured = () => {
  const [items, setItems] = useStateA(PROFILES.slice(0, 8));
  const move = (i, dir) => {
    const ni = i + dir;
    if (ni < 0 || ni >= items.length) return;
    const next = [...items];
    [next[i], next[ni]] = [next[ni], next[i]];
    setItems(next);
  };
  return (
    <div>
      <div style={{
        padding:"16px 0", borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)",
        marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center"
      }}>
        <div>
          <div className="eyebrow">Edition 047 · Cover slate</div>
          <div style={{marginTop:4, fontSize:13, color:"var(--ink-2)"}}>
            Order determines homepage position. Drag handle to reorder. Top item is the cover profile.
          </div>
        </div>
        <button className="btn btn-primary">Publish edition</button>
      </div>
      <div style={{display:"grid", gap:8}}>
        {items.map((p, i) => (
          <div key={p.id} style={{
            display:"grid", gridTemplateColumns:"40px 60px 90px 1fr 1fr auto auto",
            gap:18, alignItems:"center", padding:"14px 18px",
            border:"1px solid var(--line)",
            background: i===0 ? "color-mix(in srgb, var(--gold) 6%, transparent)" : "transparent",
          }}>
            <I.grip size={14} style={{color:"var(--ink-3)", cursor:"grab"}}/>
            <span className="display" style={{fontSize:24, fontStyle:"italic", color: i===0 ? "var(--gold)" : "var(--ink-3)"}}>
              {String(i+1).padStart(2,"0")}
            </span>
            <div style={{width:80, height:56, overflow:"hidden"}}>
              <Photo src={p.photo} name={p.name} color={p.color} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
            </div>
            <div>
              <div className="serif" style={{fontSize:18, fontWeight:400}}>{p.name}</div>
              <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".12em", marginTop:2}}>
                {p.category.toUpperCase()} · № {p.profileNumber}
              </div>
            </div>
            <div style={{color:"var(--ink-2)", fontSize:13, lineHeight:1.5, overflow:"hidden",
              textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
              {p.short}
            </div>
            <span className="mono tnum" style={{fontSize:12, color:"var(--gold)"}}>{p.views}</span>
            <div style={{display:"flex", gap:4}}>
              <button style={actionBtn} onClick={()=>move(i, -1)}><I.chev size={12} style={{transform:"rotate(-90deg)"}}/></button>
              <button style={actionBtn} onClick={()=>move(i, +1)}><I.chev size={12} style={{transform:"rotate(90deg)"}}/></button>
              <button style={{...actionBtn, color:"var(--accent-red)"}}><I.x size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- SEO Health ---------- */
const AdminSeo = () => {
  const issues = [
    { sev: "warn", title: "16 profiles missing image alt text", body: "Schema.org/ImageObject without alt — affects accessibility score." },
    { sev: "warn", title: "9 profiles have thin content (<150 words)", body: "Google de-prioritizes pages below the threshold." },
    { sev: "ok",   title: "All canonical URLs resolve", body: "100% of profiles return 200 for canonical." },
    { sev: "err",  title: "3 profiles flagged for duplicate content", body: "Manual review required before next index push." },
    { sev: "ok",   title: "Sitemap submitted 14m ago", body: "184,302 URLs, 99.2% accepted by Google Search Console." }
  ];
  const sevColor = { ok: "#5DBF8E", warn: "var(--gold)", err: "var(--accent-red)" };
  return (
    <div>
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:32,
        padding:"24px 0", borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)", marginBottom:32
      }}>
        <div>
          <div className="label-sm">Avg SEO score</div>
          <div className="display" style={{fontSize:54, marginTop:8}}>82<span style={{color:"var(--ink-3)", fontSize:24}}>/100</span></div>
        </div>
        <div>
          <div className="label-sm">Indexed on Google</div>
          <div className="display" style={{fontSize:54, marginTop:8}}>72<span style={{color:"var(--ink-3)", fontSize:24}}>%</span></div>
        </div>
        <div>
          <div className="label-sm">Avg crawl delay</div>
          <div className="display" style={{fontSize:54, marginTop:8}}>6.4<span style={{color:"var(--ink-3)", fontSize:24}}>h</span></div>
        </div>
      </div>
      <div className="eyebrow" style={{marginBottom:18}}>Live issues</div>
      {issues.map((it, i) => (
        <div key={i} style={{
          display:"grid", gridTemplateColumns:"100px 1fr auto", gap:20, alignItems:"center",
          padding:"18px 0", borderTop:"1px solid var(--line)",
          borderBottom: i===issues.length-1 ? "1px solid var(--line)" : "none"
        }}>
          <span className="mono" style={{
            fontSize:10, letterSpacing:".18em", color: sevColor[it.sev], textTransform:"uppercase"
          }}>● {it.sev==="ok"?"Healthy":it.sev==="warn"?"Warning":"Critical"}</span>
          <div>
            <div className="serif" style={{fontSize:17, fontWeight:400}}>{it.title}</div>
            <div style={{fontSize:13, color:"var(--ink-3)", marginTop:4}}>{it.body}</div>
          </div>
          <button className="btn btn-ghost" style={{padding:"8px 12px"}}>Open</button>
        </div>
      ))}
    </div>
  );
};

/* ---------- Users & roles ---------- */
const AdminUsers = () => (
  <div>
    <div style={{padding:"16px 0", borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)", marginBottom:24,
      display:"flex", justifyContent:"space-between"}}>
      <div className="eyebrow">Editors & moderators · 28 active</div>
      <button className="btn btn-primary"><I.plus size={14}/> Invite editor</button>
    </div>
    {[
      ["Naima Diallo", "Senior Editor", "naima@wikibio.org", "Admin", "Online", "var(--gold)"],
      ["Tomás Reyes", "Moderator", "tomas@wikibio.org", "Editor", "Online", "var(--ink-2)"],
      ["Jules Okafor", "Verified profile owner", "jules@okaforstudio.co", "Owner", "12m ago", "var(--ink-2)"],
      ["Hana Petrová", "Verified profile owner", "h.petrova@opera.fr", "Owner", "1h ago", "var(--ink-2)"],
      ["Ezra Banks", "Verified profile owner", "ezra@bowerman.com", "Owner", "Yesterday", "var(--ink-2)"],
      ["Søren Våsk", "Profile owner", "soren@studio-vask.dk", "Owner", "3d ago", "var(--ink-2)"],
      ["Lina Park", "Trust & Safety", "lina@wikibio.org", "Admin", "Online", "var(--gold)"],
    ].map(([name, role, email, badge, status, color], i) => (
      <div key={i} style={{
        display:"grid", gridTemplateColumns:"40px 2fr 1fr 1fr 110px auto",
        gap:18, alignItems:"center", padding:"14px 0", borderTop:"1px solid var(--line)"
      }}>
        <div style={{
          width:36, height:36, borderRadius:"50%",
          background:"color-mix(in srgb, var(--gold) 15%, var(--bg-3))",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"var(--font-display)", fontStyle:"italic", color:"var(--gold)", fontSize:16
        }}>{name.split(" ").map(n=>n[0]).join("")}</div>
        <div>
          <div style={{fontSize:14, color:"var(--ink)"}}>{name}</div>
          <div style={{fontSize:12, color:"var(--ink-3)", marginTop:2}}>{role}</div>
        </div>
        <span style={{fontSize:13, color:"var(--ink-2)"}} className="mono">{email}</span>
        <span style={{
          fontSize:10, padding:"4px 10px", letterSpacing:".18em",
          border:`1px solid ${color}`, color, alignSelf:"start", justifySelf:"start"
        }} className="mono">{badge.toUpperCase()}</span>
        <span style={{fontSize:11, color:"var(--ink-3)"}} className="mono">{status}</span>
        <div style={{display:"flex", gap:4}}>
          <button style={actionBtn}><I.edit size={13}/></button>
          <button style={{...actionBtn, color:"var(--accent-red)"}}><I.x size={13}/></button>
        </div>
      </div>
    ))}
  </div>
);

/* ---------- Analytics ---------- */
const AdminAnalytics = () => {
  const growth = useMemoA(() => Array.from({length: 24}, (_, i) => ({
    d: i, v: Math.round(2000 + i*180 + Math.sin(i/2)*400 + Math.random()*200)
  })), []);
  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:32, marginBottom:32}}>
        <div style={{border:"1px solid var(--line)", padding:"24px 28px"}}>
          <div className="eyebrow">Profile growth · cumulative</div>
          <h3 className="serif" style={{margin:"8px 0 20px", fontSize:24, fontWeight:400}}>
            Monthly registrations — last 24 months
          </h3>
          <AreaChart data={growth}/>
        </div>
        <div style={{border:"1px solid var(--line)", padding:"24px 28px"}}>
          <div className="eyebrow">By category</div>
          <h3 className="serif" style={{margin:"8px 0 20px", fontSize:24, fontWeight:400}}>Distribution</h3>
          {[
            ["Musician", 22], ["Author", 18], ["Founder", 14], ["Athlete", 12],
            ["Artist", 10], ["Brand", 9], ["Scientist", 8], ["Other", 7]
          ].map(([c, pct]) => (
            <div key={c} style={{
              display:"grid", gridTemplateColumns:"110px 1fr 40px", gap:14,
              alignItems:"center", padding:"10px 0", borderTop:"1px solid var(--line)"
            }}>
              <span style={{fontSize:13, color:"var(--ink-2)"}}>{c}</span>
              <div style={{height:6, background:"var(--bg-3)", overflow:"hidden"}}>
                <div style={{width:`${pct*4}%`, height:"100%", background:"var(--gold)"}}/>
              </div>
              <span className="mono tnum" style={{fontSize:12, color:"var(--ink-3)", textAlign:"right"}}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{border:"1px solid var(--line)", padding:"24px 28px"}}>
        <div className="eyebrow" style={{marginBottom:16}}>Top countries by inbound traffic</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:32}}>
          {[
            ["US", "United States", "31%"], ["GB", "United Kingdom", "12%"],
            ["IN", "India", "9%"], ["DE", "Germany", "7%"],
            ["FR", "France", "6%"], ["JP", "Japan", "5%"],
          ].map(([code, name, pct]) => (
            <div key={code}>
              <div className="display" style={{fontSize:36}}>{pct}</div>
              <div className="mono" style={{fontSize:10, color:"var(--gold)", letterSpacing:".18em", marginTop:6}}>{code}</div>
              <div style={{fontSize:12, color:"var(--ink-3)", marginTop:2}}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Admin shell ---------- */
const AdminPage = () => {
  const [active, setActive] = useStateA("overview");
  const titles = {
    overview: ["Command", "center"],
    profiles: ["Profile", "management"],
    featured: ["Edition", "slate"],
    seo:      ["SEO", "health"],
    users:    ["Users &", "roles"],
    analytics:["Deep", "analytics"]
  };
  return (
    <div>
      <PageHeader dense
        eyebrow="Super Admin · Vol. III"
        title={titles[active][0]}
        italicWord={titles[active][1]}
        right={
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <span className="mono" style={{fontSize:11, color:"#5DBF8E", letterSpacing:".18em"}}>
              ● ALL SYSTEMS NOMINAL
            </span>
            <button className="btn btn-ghost"><I.bell size={14}/> 12 alerts</button>
          </div>
        }
      />
      <div className="wrap">
        <div style={{display:"grid", gridTemplateColumns:"200px 1fr", gap:48, paddingBottom:80}}>
          <AdminSidebar active={active} setActive={setActive}/>
          <main>
            {active==="overview"  && <AdminOverview/>}
            {active==="profiles"  && <AdminProfiles/>}
            {active==="featured"  && <AdminFeatured/>}
            {active==="seo"       && <AdminSeo/>}
            {active==="users"     && <AdminUsers/>}
            {active==="analytics" && <AdminAnalytics/>}
          </main>
        </div>
      </div>
    </div>
  );
};

window.AdminPage = AdminPage;
