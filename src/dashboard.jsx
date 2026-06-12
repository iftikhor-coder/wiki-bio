/* WikiBio — User Dashboard (real Supabase) */

const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD } = React;

const DashStat = ({ label, value, sub, delta }) => (
  <div style={{padding:"24px 28px", border:"1px solid var(--line)"}}>
    <div className="label-sm">{label}</div>
    <div className="display tnum" style={{fontSize:42, fontWeight:300, margin:"12px 0 6px"}}>{value}</div>
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

const MiniBars = ({ data, height=64 }) => {
  const max = Math.max(...data) || 1;
  return (
    <div style={{display:"flex", gap:3, alignItems:"flex-end", height}}>
      {data.map((v,i) => (
        <div key={i} style={{
          flex:1, height:`${(v/max)*100}%`, background:"var(--gold)",
          opacity: 0.4 + (i/data.length)*0.6,
        }}/>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const { user, profile: wbUser } = useAuth();
  const [myProfiles, setMyProfiles] = useStateD([]);
  const [loading, setLoading] = useStateD(true);
  const views30d = useMemoD(() => Array.from({length:30},(_,i)=>Math.round(10+Math.sin(i/3)*5+Math.random()*8+i*0.5)), []);

  useEffectD(() => {
    if (!user) { setLoading(false); return; }
    API.getMyProfiles(user.id).then(({ data }) => {
      setMyProfiles(data || []);
      setLoading(false);
    });
  }, [user]);

  // Login bo'lmagan
  if (!user) return (
    <div style={{padding:"120px 0", textAlign:"center"}}>
      <div className="display" style={{fontSize:64, color:"var(--gold)"}}>👤</div>
      <h2 className="serif" style={{fontSize:32, fontWeight:400, margin:"16px 0 12px"}}>Kirish kerak</h2>
      <p style={{color:"var(--ink-2)", marginBottom:28}}>Dashboard ko'rish uchun tizimga kiring.</p>
      <a href="#/" className="btn btn-primary">Bosh sahifa</a>
    </div>
  );

  if (loading) return (
    <div style={{padding:"120px 0", textAlign:"center"}}>
      <div className="mono" style={{color:"var(--ink-3)", letterSpacing:".18em"}}>YUKLANMOQDA...</div>
    </div>
  );

  const displayName = wbUser?.display_name || user.email?.split("@")[0] || "Foydalanuvchi";
  const activeProfile = myProfiles.find(p => p.status === "live") || myProfiles[0];

  return (
    <div>
      <PageHeader dense
        eyebrow={`Dashboard · ${user.email}`}
        title="Xush kelibsiz,"
        italicWord={`${displayName}.`}
        right={
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            {activeProfile && (
              <span className="mono" style={{fontSize:11, color:"#5DBF8E", letterSpacing:".18em"}}>
                ● PROFIL JONLI
              </span>
            )}
            <a href="#/create" className="btn btn-primary">
              <I.edit size={14}/> Profil yaratish
            </a>
          </div>
        }
      />

      <div className="wrap" style={{paddingBottom:80}}>
        {/* Profillar yo'q */}
        {!myProfiles.length ? (
          <div style={{padding:"60px 0", textAlign:"center", border:"1px solid var(--line)"}}>
            <div className="display" style={{fontSize:56, color:"var(--gold)"}}>∅</div>
            <h3 className="serif" style={{fontSize:28, fontWeight:400, margin:"16px 0 12px"}}>
              Hali profil yo'q
            </h3>
            <p style={{color:"var(--ink-2)", marginBottom:28}}>
              Birinchi profilingizni yarating — Google da ko'rining!
            </p>
            <a href="#/create" className="btn btn-primary">
              Profil yaratish <I.arrowR size={14}/>
            </a>
          </div>
        ) : (
          <div style={{display:"grid", gridTemplateColumns:"1fr 340px", gap:48}}>
            {/* CHAP */}
            <div>
              {/* Profil kartochkasi */}
              {activeProfile && (
                <section style={{
                  border:"1px solid var(--line-2)", padding:0,
                  display:"grid", gridTemplateColumns:"200px 1fr", gap:0, marginBottom:32
                }}>
                  <div className="photo-frame" style={{height:"100%", minHeight:260}}>
                    <Photo src={activeProfile.photo_url} name={activeProfile.name}
                      color="var(--gold-3)" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                  </div>
                  <div style={{padding:"28px 32px"}}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                      <div>
                        <div className="eyebrow" style={{color:"var(--gold)"}}>{activeProfile.category}</div>
                        <h2 className="display" style={{fontSize:36, margin:"10px 0 0", fontWeight:300}}>
                          {activeProfile.name}
                        </h2>
                      </div>
                      <span className="mono" style={{
                        fontSize:10, letterSpacing:".18em",
                        color: activeProfile.status==="live" ? "#5DBF8E" : "var(--gold)"
                      }}>
                        ● {activeProfile.status?.toUpperCase()}
                      </span>
                    </div>
                    <p style={{margin:"14px 0 20px", fontSize:13.5, color:"var(--ink-2)", lineHeight:1.6}}>
                      {activeProfile.short_bio}
                    </p>
                    <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                      {activeProfile.status === "live" && (
                        <a href={`#/p/${activeProfile.slug}`} className="btn btn-ghost">
                          <I.eye size={14}/> Profilni ko'rish
                        </a>
                      )}
                      {activeProfile.status === "pending" && (
                        <span style={{fontSize:13, color:"var(--gold)", padding:"10px 0"}}>
                          ⏳ Admin tekshirmoqda...
                        </span>
                      )}
                      {activeProfile.status === "rejected" && (
                        <span style={{fontSize:13, color:"var(--accent-red)", padding:"10px 0"}}>
                          ✗ Rad etilgan
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Barcha profillar */}
              {myProfiles.length > 1 && (
                <div style={{marginBottom:32}}>
                  <div className="eyebrow" style={{marginBottom:16}}>Barcha profillarim</div>
                  {myProfiles.map(p => (
                    <div key={p.id} style={{
                      display:"grid", gridTemplateColumns:"48px 1fr auto",
                      gap:14, padding:"14px 0", borderTop:"1px solid var(--line)",
                      alignItems:"center"
                    }}>
                      <div style={{width:48, height:60, overflow:"hidden", background:"var(--bg-3)"}}>
                        <Photo src={p.photo_url} name={p.name} color="var(--gold-3)"
                          style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                      </div>
                      <div>
                        <div className="serif" style={{fontSize:16}}>{p.name}</div>
                        <div style={{fontSize:12, color:"var(--ink-3)"}}>{p.category}</div>
                      </div>
                      <span className="mono" style={{
                        fontSize:10, letterSpacing:".12em",
                        color: p.status==="live"?"#5DBF8E":p.status==="pending"?"var(--gold)":"var(--accent-red)"
                      }}>● {p.status?.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Statistika */}
              <div className="eyebrow" style={{marginBottom:16}}>Ko'rishlar statistikasi</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32}}>
                <DashStat label="Profilga kirish" value={activeProfile?.views_count || 0} sub="Jami" delta={0}/>
                <DashStat label="Holat" value={activeProfile?.status==="live"?"Jonli":"Kutilmoqda"} sub="Hozirgi holat"/>
                <DashStat label="Manba" value={activeProfile?.source==="wikipedia"?"Wikipedia":"Foydalanuvchi"} sub="Qayerdan"/>
              </div>

              {/* Chart */}
              <section style={{border:"1px solid var(--line)", padding:"24px 28px", marginBottom:32}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:18}}>
                  <div>
                    <div className="eyebrow">Ko'rishlar grafigi</div>
                    <h3 className="serif" style={{margin:"6px 0 0", fontSize:22, fontWeight:400}}>So'nggi 30 kun</h3>
                  </div>
                </div>
                <MiniBars data={views30d} height={100}/>
              </section>

              {/* Google appearance mock */}
              <section style={{
                border:"1px solid var(--gold-3)", padding:"24px 28px",
                background:"linear-gradient(135deg, color-mix(in srgb, var(--gold) 6%, transparent), transparent)",
              }}>
                <div className="eyebrow" style={{color:"var(--gold)", marginBottom:16}}>Google da qanday ko'rinadi</div>
                <div style={{background:"var(--bg)", border:"1px solid var(--line)", padding:"18px 22px"}}>
                  <div className="mono" style={{fontSize:10, color:"var(--ink-3)", letterSpacing:".16em", marginBottom:10}}>
                    GOOGLE.COM/SEARCH?Q={activeProfile?.name?.toUpperCase().replace(/ /g,"+")}
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 180px", gap:24}}>
                    <div>
                      <div style={{color:"#8AB4F8", fontSize:16, fontFamily:"arial,sans-serif", marginBottom:4}}>
                        WikiBio — {activeProfile?.name}
                      </div>
                      <div style={{fontSize:11, color:"#5DBF8E", fontFamily:"arial,sans-serif"}}>
                        wiki-bio.vercel.app/{activeProfile?.slug}
                      </div>
                      <p style={{fontSize:13, color:"var(--ink-2)", marginTop:8, lineHeight:1.5, fontFamily:"arial,sans-serif"}}>
                        {activeProfile?.short_bio?.slice(0,120)}...
                      </p>
                    </div>
                    <div style={{border:"1px solid var(--line)", padding:10, background:"var(--bg-2)"}}>
                      <div style={{aspectRatio:"4/5", overflow:"hidden", marginBottom:8}}>
                        <Photo src={activeProfile?.photo_url} name={activeProfile?.name}
                          color="var(--gold-3)" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                      </div>
                      <div style={{fontSize:13, fontWeight:500, color:"var(--ink)"}}>{activeProfile?.name}</div>
                      <div style={{fontSize:11, color:"var(--ink-3)"}}>{activeProfile?.category}</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* O'NG - ma'lumotlar */}
            <aside>
              {/* Profil holati */}
              <div style={{border:"1px solid var(--line)", padding:"24px 26px", marginBottom:24}}>
                <div className="eyebrow" style={{marginBottom:16}}>Profil holati</div>
                {[
                  ["Schema.org JSON-LD", activeProfile?.schema_json ? "✓ Tayyor" : "✗ Yo'q", !!activeProfile?.schema_json],
                  ["Google indekslash", activeProfile?.status==="live" ? "✓ Jonli" : "⏳ Kutilmoqda", activeProfile?.status==="live"],
                  ["Rasm", activeProfile?.photo_url ? "✓ Bor" : "✗ Yo'q", !!activeProfile?.photo_url],
                  ["Qisqa tavsif", activeProfile?.short_bio ? "✓ Bor" : "✗ Yo'q", !!activeProfile?.short_bio],
                ].map(([label, val, ok], i) => (
                  <div key={i} style={{
                    display:"flex", justifyContent:"space-between", padding:"10px 0",
                    borderTop:"1px solid var(--line)", fontSize:13
                  }}>
                    <span style={{color:"var(--ink-2)"}}>{label}</span>
                    <span className="mono" style={{fontSize:11, color: ok ? "#5DBF8E" : "var(--accent-red)"}}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Keyingi qadamlar */}
              <div style={{border:"1px solid var(--line)", padding:"24px 26px", marginBottom:24}}>
                <div className="eyebrow" style={{marginBottom:14}}>Keyingi qadamlar</div>
                {[
                  ["Profil yaratish", true],
                  ["Rasmni yuklash", !!activeProfile?.photo_url],
                  ["Qisqa tavsif yozish", !!activeProfile?.short_bio],
                  ["Admin tasdiqlashi", activeProfile?.status === "live"],
                  ["Google indekslanishi", false],
                ].map(([t, done], i) => (
                  <div key={i} style={{
                    display:"flex", gap:12, padding:"10px 0",
                    borderTop:"1px solid var(--line)", alignItems:"center"
                  }}>
                    <span style={{
                      width:18, height:18, border:"1px solid var(--line-2)", flexShrink:0,
                      background: done ? "var(--gold)" : "transparent",
                      color:"#0A0F1E", display:"inline-flex", alignItems:"center", justifyContent:"center"
                    }}>{done && <I.check size={12} stroke={2.5}/>}</span>
                    <span style={{
                      fontSize:13, color: done ? "var(--ink-3)" : "var(--ink-2)",
                      textDecoration: done ? "line-through" : "none"
                    }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* Yangi profil */}
              <div style={{
                border:"1px solid var(--gold-3)", padding:"20px 22px",
                background:"color-mix(in srgb, var(--gold) 5%, transparent)"
              }}>
                <div className="eyebrow" style={{color:"var(--gold)", marginBottom:8}}>Ko'proq profil</div>
                <p style={{fontSize:13, color:"var(--ink-2)", marginBottom:14, lineHeight:1.5}}>
                  Brend, mahsulot yoki xizmatlaringiz uchun ham profil yarating.
                </p>
                <a href="#/create" className="btn btn-primary" style={{width:"100%", justifyContent:"center"}}>
                  Yangi profil <I.arrowR size={14}/>
                </a>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

window.DashboardPage = DashboardPage;
