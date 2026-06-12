/* App shell with hash routing + Auth */

const { useState: useStateApp, useEffect: useEffectApp } = React;

const parseRoute = () => {
  const h = (window.location.hash || "#/").replace(/^#\/?/, "");
  const [path, query] = h.split("?");
  const segs = path.split("/").filter(Boolean);
  const q = Object.fromEntries(new URLSearchParams(query || ""));
  if (segs.length === 0) return { page: "home" };
  if (segs[0] === "p" && segs[1]) return { page: "profile", id: segs[1] };
  if (segs[0] === "create") return { page: "create" };
  if (segs[0] === "dashboard") return { page: "dashboard" };
  if (segs[0] === "alizeybek") return { page: "admin" };
  if (segs[0] === "browse") return { page: "browse", q };
  if (segs[0] === "seo-guide") return { page: "seo" };
  if (segs[0] === "about") return { page: "about" };
  return { page: "home" };
};

/* ---------- Browse page — real Supabase ---------- */
const BrowsePage = ({ q }) => {
  const [query, setQuery] = useStateApp(q.q || "");
  const [cat, setCat] = useStateApp(q.cat || "All");
  const [profiles, setProfiles] = useStateApp([]);
  const [loading, setLoading] = useStateApp(true);

  useEffectApp(() => {
    setLoading(true);
    API.getProfiles({ search: query||undefined, category: cat||undefined, limit: 50 })
      .then(({ data }) => { setProfiles(data || []); setLoading(false); });
  }, [query, cat]);

  return (
    <div>
      <PageHeader dense eyebrow="Browse" title="The" italicWord="archive." subtitle="Barcha profillar — qidiring yoki kategoriya boyicha filtrlang." />
      <div className="wrap">
        <div style={{marginBottom:32}}><SearchBox autoFocus={false}/></div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap", padding:"16px 0", borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)", marginBottom:40}}>
          {["All", ...CATEGORIES].map(c => <Pill key={c} active={cat===c} onClick={()=>setCat(c)}>{c}</Pill>)}
        </div>
        {loading
          ? <div className="mono" style={{color:"var(--ink-3)", letterSpacing:".18em"}}>YUKLANMOQDA...</div>
          : !profiles.length
            ? <div style={{padding:"60px 0", textAlign:"center", color:"var(--ink-3)"}}>Hech narsa topilmadi</div>
            : <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:28}}>
                {profiles.map((p,i) => <ProfileCard key={p.id} profile={p} index={i}/>)}
              </div>
        }
      </div>
    </div>
  );
};

/* ---------- SEO Guide ---------- */
const SEOGuidePage = () => (
  <div>
    <PageHeader eyebrow="WikiBio Qollanma" title="Google da qanday" italicWord="korinasiz." subtitle="schema.org strukturlangan malumot va indekslash haqida." />
    <div className="wrap" style={{paddingBottom:80}}>
      <article style={{maxWidth:720}}>
        {[
          ["a","Knowledge Panel nima?","Knowledge Panel — Google qidiruv natijasida ong tomonda chiqadigan malumot kartochkasi."],
          ["b","Qanday shartlar kerak?","Google quyidagilarni talab qiladi: canonical URL, schema.org/Person JSON-LD, mustaqil manbalarda tilga olinish, sifatli rasm."],
          ["c","schema.org/Person","WikiBio har profil uchun JSON-LD avtomatik yaratadi — name, jobTitle, birthDate, nationality, image maydonlari bilan."],
          ["d","Manbalar","Kamida 3 ta mustaqil manbaga ega profillar Google tomonidan 3.1x tezroq indekslanadi."],
          ["e","Google Indexing API","Profil jonlashganda WikiBio Google Indexing API orqali darhol xabar yuboradi."],
          ["f","Keng tarqalgan xatolar","Birinchi shaxs tili, sanasiz profil, past sifatli rasm — eng keng tarqalgan muammolar."],
        ].map(([id, t, body], i) => (
          <section key={id} id={`sec-${id}`} style={{marginBottom:48}}>
            <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:14}}>
              <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>S {String(i+1).padStart(2,"0")}</span>
              <h2 className="serif" style={{margin:0, fontSize:30, fontWeight:400}}>{t}</h2>
            </div>
            <p style={{fontSize:16, lineHeight:1.7, color:"var(--ink-2)", margin:0}}>{body}</p>
          </section>
        ))}
      </article>
    </div>
  </div>
);

/* ---------- About ---------- */
const AboutPage = () => (
  <div>
    <PageHeader eyebrow="Haqida" title="Bepul bilim" italicWord="platformasi." subtitle="WikiBio — ochiq biografik platforma. Har kim nashr etishi, oqishi mumkin va Google indekslaydi." />
    <div className="wrap-sm">
      <p className="serif dropcap" style={{fontSize:20, lineHeight:1.7, color:"var(--ink-2)"}}>
        Wikipedia har bir inson dunyo haqida yozishi kerak degan goyaga asoslangan.
        WikiBio bu goyani yanada kengaytiradi — siz haqingizdagi sahifa.
        Biz notablik talabiga ega emasmiz. Hikoyangizni togri yozsangiz — arxivga kiradi.
      </p>
    </div>
  </div>
);

/* ---------- TopNav with Auth ---------- */
/* ---------- LangSelector ---------- */
const LangSelector = () => {
  const [open, setOpen] = useStateApp(false);
  const [current, setCurrent] = useStateApp(getLang());

  const select = (code) => {
    setLang(code);
    setCurrent(code);
    setOpen(false);
  };

  const cur = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];

  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        display:"flex", alignItems:"center", gap:6, fontSize:13,
        color:"var(--ink-2)", border:"1px solid var(--line-2)",
        padding:"6px 10px", borderRadius:2
      }}>
        <span>{cur.flag}</span>
        <span className="mono" style={{fontSize:11, letterSpacing:".1em"}}>{cur.code.toUpperCase()}</span>
        <I.chevD size={12}/>
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", right:0,
          background:"var(--bg-2)", border:"1px solid var(--line-2)",
          zIndex:100, minWidth:140, boxShadow:"var(--shadow)"
        }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={()=>select(l.code)} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 14px", width:"100%", textAlign:"left",
              fontSize:13, color: current===l.code ? "var(--gold)" : "var(--ink-2)",
              background: current===l.code ? "color-mix(in srgb, var(--gold) 8%, transparent)" : "transparent",
              borderLeft: current===l.code ? "2px solid var(--gold)" : "2px solid transparent",
            }}>
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const TopNavWithAuth = ({ route }) => {
  const { user, profile, loading } = useAuth();
  const [showAuth, setShowAuth] = useStateApp(false);

  const handleLogout = async () => {
    await sb.auth.signOut();
    window.location.hash = "#/";
  };

  const linkStyle = (active) => ({
    fontSize:13, fontWeight:500,
    color: active ? "var(--ink)" : "var(--ink-2)",
    letterSpacing:".01em", display:"inline-flex", alignItems:"center", gap:6,
    paddingBottom:4,
    borderBottom: active ? "1px solid var(--gold)" : "1px solid transparent"
  });

  return (
    <>
      <header style={{
        position:"sticky", top:0, zIndex:50,
        backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
        background:"color-mix(in srgb, var(--bg) 78%, transparent)",
        borderBottom:"1px solid var(--line)"
      }}>
        <div className="wrap" style={{display:"flex", alignItems:"center", height:72, gap:32}}>
          <Logo/>
          <div className="hide-mobile" style={{display:"flex", alignItems:"center", gap:28, marginLeft:24}}>
            <a href="#/" style={linkStyle(route.page==="home")}>{t("discover")}</a>
            <a href="#/browse" style={linkStyle(route.page==="browse")}>{t("browse")}</a>
            <a href="#/seo-guide" style={linkStyle(route.page==="seo")}>{t("seoGuide")}</a>
            <a href="#/about" style={linkStyle(false)}>{t("about")}</a>
          </div>
          <div style={{flex:1}}/>

          {!loading && (
            user ? (
              <>
                <a href="#/dashboard" style={{fontSize:13, color:"var(--ink-3)", display:"none"}}>
                  Dashboard
                </a>
                <button onClick={handleLogout} style={{fontSize:13, color:"var(--ink-3)"}}>
                  {t("logout")}
                </button>
              </>
            ) : (
              <button onClick={()=>setShowAuth(true)} style={{
                fontSize:13, color:"var(--ink-2)", border:"1px solid var(--line-2)",
                padding:"8px 16px"
              }}>
                {t("login")}
              </button>
            )
          )}

          <LangSelector/>
          <ThemeToggle/>
          <a href="#/create" className="btn btn-primary" style={{padding:"10px 18px"}}>
            {t("createProfile")} <I.arrowR size={14}/>
          </a>
        </div>
      </header>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)}/>}
    </>
  );
};

/* ---------- App ---------- */
const App = () => {
  const [route, setRoute] = useStateApp(parseRoute());
  const [, setLangState] = useStateApp(getLang());

  useEffectApp(() => {
    const onHash = () => { setRoute(parseRoute()); window.scrollTo(0,0); };
    window.addEventListener("hashchange", onHash);
    const onLang = () => setLangState(getLang());
    window.addEventListener("wb-lang-change", onLang);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("wb-lang-change", onLang);
    };
  }, []);

  let page = null;
  switch (route.page) {
    case "home":      page = <HomePage/>; break;
    case "profile":   page = <ProfilePage id={route.id}/>; break;
    case "create":    page = <CreatePage/>; break;
    case "admin":     page = <AdminPage/>; break;
    case "dashboard": page = <DashboardPage/>; break;
    case "browse":    page = <BrowsePage q={route.q||{}}/>; break;
    case "seo":       page = <SEOGuidePage/>; break;
    case "about":     page = <AboutPage/>; break;
    default:          page = <HomePage/>;
  }

  return (
    <AuthProvider>
      <div>
        <TopNavWithAuth route={route}/>
        <main>{page}</main>
        <Footer/>
      </div>
    </AuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
