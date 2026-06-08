/* WikiBio — User Dashboard (logged-in profile owner) */

const { useState: useStateD, useMemo: useMemoD } = React;

const DashStat = ({ label, value, sub, delta }) => (
  <div style={{padding:"24px 28px", border:"1px solid var(--line)"}}>
    <div className="label-sm">{label}</div>
    <div className="display tnum" style={{fontSize:42, fontWeight:300, margin:"12px 0 6px"}}>
      {value}
    </div>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
      <span style={{fontSize:12, color:"var(--ink-3)"}}>{sub}</span>
      {delta !== undefined && (
        <span className="mono" style={{fontSize:11, color: delta>=0 ? "#5DBF8E" : "var(--accent-red)"}}>
          {delta>=0 ? "▲" : "▼"} {Math.abs(delta)}%
        </span>
      )}
    </div>
  </div>
);

/* Mini chart */
const MiniBars = ({ data, height=64, color="var(--gold)" }) => {
  const max = Math.max(...data);
  return (
    <div style={{display:"flex", gap:3, alignItems:"flex-end", height}}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex:1, height:`${(v/max)*100}%`, background: color,
          opacity: 0.5 + (i/data.length)*0.5,
          transition:"all .2s"
        }}/>
      ))}
    </div>
  );
};

const Notif = ({ icon: Icon, title, body, time, accent }) => (
  <div style={{
    display:"grid", gridTemplateColumns:"36px 1fr auto", gap:14,
    padding:"16px 0", borderTop:"1px solid var(--line)", alignItems:"start"
  }}>
    <div style={{
      width:36, height:36, borderRadius:"50%",
      background: accent ? "color-mix(in srgb, var(--gold) 14%, transparent)" : "var(--bg-3)",
      color: accent ? "var(--gold)" : "var(--ink-2)",
      display:"inline-flex", alignItems:"center", justifyContent:"center"
    }}><Icon size={14}/></div>
    <div>
      <div style={{fontSize:13.5, color:"var(--ink)"}}>{title}</div>
      <div style={{fontSize:12, color:"var(--ink-3)", marginTop:4, lineHeight:1.5}}>{body}</div>
    </div>
    <span className="mono" style={{fontSize:11, color:"var(--ink-3)"}}>{time}</span>
  </div>
);

const DashboardPage = () => {
  const me = PROFILES[0]; // pretend the user is Elena
  const views7d = useMemoD(() => [12,18,22,16,28,34,29], []);
  const views30d = useMemoD(() => Array.from({length:30},(_,i)=>Math.round(10+Math.sin(i/3)*5+Math.random()*8+i*0.5)), []);

  return (
    <div>
      <PageHeader dense
        eyebrow="My Dashboard · signed in as Elena Marchetti"
        title="Welcome back,"
        italicWord="Elena."
        right={
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <span className="mono" style={{fontSize:11, color:"#5DBF8E", letterSpacing:".18em"}}>● PROFILE LIVE ON GOOGLE</span>
            <button className="btn btn-ghost"><I.bell size={14}/> 4</button>
            <a href="#/create" className="btn btn-primary"><I.edit size={14}/> Edit profile</a>
          </div>
        }
      />
      <div className="wrap" style={{paddingBottom:80}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 360px", gap:48}}>
          {/* LEFT */}
          <div>
            {/* Profile card preview */}
            <section style={{
              border:"1px solid var(--line-2)", padding:0,
              display:"grid", gridTemplateColumns:"240px 1fr", gap:0, marginBottom:40
            }}>
              <div className="photo-frame" style={{height:"100%", minHeight:300}}>
                <Photo src={me.photo} name={me.name} color={me.color}
                  style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              </div>
              <div style={{padding:"32px 36px"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                  <div>
                    <div className="eyebrow" style={{color:"var(--gold)"}}>The {me.category}</div>
                    <h2 className="display" style={{fontSize:42, margin:"12px 0 0", fontWeight:300}}>
                      Elena <em style={{fontStyle:"italic"}}>Marchetti</em>
                    </h2>
                  </div>
                  <VerifiedBadge tier={me.tier}/>
                </div>
                <p style={{margin:"18px 0 24px", fontSize:14, color:"var(--ink-2)", lineHeight:1.6, maxWidth:480}}>
                  {me.short}
                </p>
                <div style={{display:"flex", gap:14, flexWrap:"wrap"}}>
                  <a href={`#/p/${me.id}`} className="btn btn-ghost">
                    <I.eye size={14}/> View live profile
                  </a>
                  <a href="#/create" className="btn btn-ghost">
                    <I.edit size={14}/> Edit
                  </a>
                  <span style={{flex:1}}/>
                  <span className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".18em", alignSelf:"center"}}>
                    LAST UPDATED · 3 DAYS AGO
                  </span>
                </div>
              </div>
            </section>

            {/* Stats */}
            <div className="eyebrow" style={{marginBottom:16}}>This week</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16, marginBottom:32}}>
              <DashStat label="Profile views" value="2,418" sub="7-day total" delta={18.4}/>
              <DashStat label="Google clicks" value="186" sub="from Knowledge Panel" delta={4.1}/>
              <DashStat label="New followers" value="42" sub="across linked socials" delta={-2.3}/>
            </div>

            {/* Views chart */}
            <section style={{border:"1px solid var(--line)", padding:"24px 28px", marginBottom:32}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:18}}>
                <div>
                  <div className="eyebrow">Profile views</div>
                  <h3 className="serif" style={{margin:"6px 0 0", fontSize:22, fontWeight:400}}>Last 30 days</h3>
                </div>
                <div className="mono" style={{fontSize:11, color:"var(--gold)", letterSpacing:".18em"}}>
                  ▲ 24% VS LAST PERIOD
                </div>
              </div>
              <MiniBars data={views30d} height={120}/>
              <div style={{
                display:"grid", gridTemplateColumns:"repeat(5, 1fr)",
                marginTop:8, fontSize:10, color:"var(--ink-3)", fontFamily:"var(--font-mono)", letterSpacing:".1em"
              }}>
                <span>May 10</span><span style={{textAlign:"center"}}>17</span><span style={{textAlign:"center"}}>24</span><span style={{textAlign:"center"}}>31</span><span style={{textAlign:"right"}}>Jun 8</span>
              </div>
            </section>

            {/* Google appearance */}
            <section style={{
              border:"1px solid var(--gold-3)", padding:"24px 28px",
              background:"linear-gradient(135deg, color-mix(in srgb, var(--gold) 8%, transparent), transparent)",
              marginBottom:32
            }}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24}}>
                <div className="eyebrow" style={{color:"var(--gold)"}}>Google appearance</div>
                <span className="mono" style={{fontSize:10, color:"#5DBF8E", letterSpacing:".18em"}}>● APPEARING IN PANEL</span>
              </div>

              {/* Mock Google SERP */}
              <div style={{
                background:"var(--bg)", border:"1px solid var(--line)",
                padding:"22px 28px"
              }}>
                <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".16em", marginBottom:12}}>
                  GOOGLE.COM/SEARCH?Q=ELENA+MARCHETTI
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:32}}>
                  <div>
                    <div style={{
                      color:"#8AB4F8", fontSize:18, fontFamily:"arial, sans-serif",
                      marginBottom:4
                    }}>WikiBio — Elena Marchetti</div>
                    <div style={{fontSize:12, color:"#5DBF8E", fontFamily:"arial, sans-serif"}}>
                      wikibio.org › elena-marchetti
                    </div>
                    <p style={{fontSize:13.5, color:"var(--ink-2)", marginTop:8, lineHeight:1.5, fontFamily:"arial, sans-serif"}}>
                      Italian-American cinematographer known for natural-light portraiture
                      and her three-time collaboration with director Marisa Vello...
                    </p>
                  </div>
                  {/* Knowledge panel */}
                  <div style={{border:"1px solid var(--line)", padding:14, background:"var(--bg-2)"}}>
                    <div style={{aspectRatio:"4/5", overflow:"hidden"}}>
                      <Photo src={me.photo} name={me.name} color={me.color}
                        style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                    </div>
                    <div style={{
                      fontFamily:"Roboto, arial, sans-serif", fontSize:18, color:"var(--ink)",
                      marginTop:10, fontWeight:500
                    }}>Elena Marchetti</div>
                    <div style={{fontSize:11, color:"var(--ink-3)", marginTop:2}}>
                      Italian-American cinematographer
                    </div>
                    <div style={{fontSize:11.5, color:"var(--ink-2)", marginTop:10}}>
                      <strong>Born:</strong> March 14, 1984 (age 42)
                    </div>
                    <div style={{fontSize:11.5, color:"var(--ink-2)", marginTop:4}}>
                      <strong>Nationality:</strong> Italian
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                display:"grid", gridTemplateColumns:"repeat(3, 1fr)",
                gap:16, marginTop:20, paddingTop:20, borderTop:"1px solid var(--line)"
              }}>
                <div>
                  <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".16em"}}>IMPRESSIONS</div>
                  <div className="serif" style={{fontSize:22, marginTop:4}}>14,820</div>
                </div>
                <div>
                  <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".16em"}}>AVG POSITION</div>
                  <div className="serif" style={{fontSize:22, marginTop:4}}>1.2</div>
                </div>
                <div>
                  <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".16em"}}>LAST CRAWL</div>
                  <div className="serif" style={{fontSize:22, marginTop:4}}>2h ago</div>
                </div>
              </div>
            </section>

            {/* Verification upgrade */}
            <section style={{
              border:"1px solid var(--line-2)", padding:"32px 36px",
              display:"grid", gridTemplateColumns:"80px 1fr auto", gap:28, alignItems:"center"
            }}>
              <div style={{
                width:80, height:80, borderRadius:"50%",
                background:"linear-gradient(135deg, var(--gold), var(--gold-2))",
                color:"#0A0F1E", display:"inline-flex", alignItems:"center", justifyContent:"center"
              }}>
                <I.badge size={32} stroke={1.5}/>
              </div>
              <div>
                <div className="eyebrow" style={{color:"var(--gold)"}}>You're on Gold</div>
                <h3 className="serif" style={{margin:"10px 0 8px", fontSize:26, fontWeight:400}}>
                  Verification active until <em style={{fontStyle:"italic"}}>June 14, 2027</em>
                </h3>
                <p style={{margin:0, fontSize:13.5, color:"var(--ink-2)", lineHeight:1.55, maxWidth:480}}>
                  Priority indexing (typically &lt;2 hours), custom domain, and advanced
                  analytics are all enabled.
                </p>
              </div>
              <button className="btn btn-ghost">Manage plan</button>
            </section>
          </div>

          {/* RIGHT — notifications + tasks */}
          <aside>
            <div style={{
              border:"1px solid var(--line)", padding:"24px 26px", marginBottom:32
            }}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
                <div className="eyebrow">Notifications</div>
                <button className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".18em"}}>
                  MARK ALL READ
                </button>
              </div>
              <Notif icon={I.spark} accent
                title="Your profile re-indexed by Google"
                body="The Knowledge Panel was updated 2 hours ago. View the new snapshot."
                time="2h"/>
              <Notif icon={I.eye}
                title="Traffic spike from Cannes coverage"
                body="412 referrals from cannesfilmfestival.com in the last 24 hours."
                time="6h"/>
              <Notif icon={I.users}
                title="3 new followers"
                body="@noor_writes, @marisa.vello and 1 other followed your profile."
                time="1d"/>
              <Notif icon={I.badge}
                title="Verification renewed"
                body="Your Gold verification has been auto-renewed for another year."
                time="3d"/>
            </div>

            <div style={{
              border:"1px solid var(--line)", padding:"24px 26px", marginBottom:32
            }}>
              <div className="eyebrow" style={{marginBottom:14}}>Suggested next steps</div>
              {[
                ["Add 2024 Cannes premiere to filmography", true],
                ["Connect your IMDb account", false],
                ["Add an alternate-language version", false],
                ["Upload a behind-the-scenes cover image", false],
              ].map(([t, done], i) => (
                <label key={i} style={{
                  display:"flex", gap:14, padding:"12px 0",
                  borderTop: i===0 ? "1px solid var(--line)" : "none",
                  borderBottom: i<3 ? "1px solid var(--line)" : "none",
                  cursor:"pointer", alignItems:"center"
                }}>
                  <span style={{
                    width:18, height:18, border:"1px solid var(--line-2)",
                    background: done ? "var(--gold)" : "transparent",
                    color:"#0A0F1E", display:"inline-flex", alignItems:"center", justifyContent:"center"
                  }}>{done && <I.check size={12} stroke={2.5}/>}</span>
                  <span style={{
                    fontSize:13.5,
                    color: done ? "var(--ink-3)" : "var(--ink-2)",
                    textDecoration: done ? "line-through" : "none"
                  }}>{t}</span>
                </label>
              ))}
            </div>

            {/* Recent visitors / referrals */}
            <div style={{
              border:"1px solid var(--line)", padding:"24px 26px"
            }}>
              <div className="eyebrow" style={{marginBottom:14}}>Top referrers · 7d</div>
              {[
                ["google.com", "1,820", 75],
                ["imdb.com", "284", 38],
                ["instagram.com", "176", 22],
                ["nytimes.com/movies", "112", 14],
                ["cannesfilmfestival.com", "98", 12],
              ].map(([src, n, w], i) => (
                <div key={i} style={{
                  display:"grid", gridTemplateColumns:"1fr 60px", gap:12,
                  alignItems:"center", padding:"10px 0",
                  borderTop:"1px solid var(--line)"
                }}>
                  <div>
                    <div style={{fontSize:13, color:"var(--ink-2)"}}>{src}</div>
                    <div style={{height:3, background:"var(--bg-3)", marginTop:6, overflow:"hidden"}}>
                      <div style={{width:`${w}%`, height:"100%", background:"var(--gold)"}}/>
                    </div>
                  </div>
                  <span className="mono tnum" style={{fontSize:12, color:"var(--ink-3)", textAlign:"right"}}>{n}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

window.DashboardPage = DashboardPage;
