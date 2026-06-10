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

/* ---------- Browse page ---------- */
const BrowsePage = ({ q }) => {
  const [query, setQuery] = useStateApp(q.q || "");
  const [cat, setCat] = useStateApp(q.cat || "All");
  const results = PROFILES.filter(p => {
    if (cat !== "All" && p.category !== cat) return false;
    if (query.trim()) {
      const lq = query.toLowerCase();
      return p.name.toLowerCase().includes(lq) ||
             p.category.toLowerCase().includes(lq) ||
             (p.tags||[]).some(t => t.toLowerCase().includes(lq));
    }
    return true;
  });
  const cats = ["All", ...Array.from(new Set(PROFILES.map(p => p.category)))];
  return (
    <div>
      <PageHeader dense eyebrow="Browse · 184,302 profiles" title="The" italicWord="archive." subtitle="Filter by category or search." />
      <div className="wrap">
        <div style={{marginBottom:32}}><SearchBox autoFocus={false}/></div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap", padding:"16px 0", borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)", marginBottom:40}}>
          {cats.map(c => <Pill key={c} active={cat===c} onClick={()=>setCat(c)}>{c}</Pill>)}
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:28}}>
          {results.map((p, i) => <ProfileCard key={p.id} profile={p} index={i}/>)}
        </div>
      </div>
    </div>
  );
};

/* -SEO Guide-  */
const SEOGuidePage = () => (
  <div>
    <PageHeader eyebrow="The WikiBio Guide · No. 03" title="How to get into the" italicWord="Knowledge Panel." subtitle="A plain-English guide to schema.org structured data and indexing." />
    <div className="wrap" style={{paddingBottom:80}}>
      <div style={{display:"grid", gridTemplateColumns:"200px 1fr", gap:64}}>
        <div className="hide-mobile">
          <TOC items={[
            {id:"a", title:"What is a Knowledge Panel"},
            {id:"b", title:"Eligibility signals"},
            {id:"c", title:"Schema.org Person"},
            {id:"d", title:"Sourcing & citations"},
            {id:"e", title:"Indexing API"},
            {id:"f", title:"Common pitfalls"},
          ]}/>
        </div>
        <article style={{maxWidth:720}}>
          {[
            ["a","What is a Knowledge Panel","The Knowledge Panel is the boxed information card Google shows on the right-hand side of search results for entities — people, places, organizations."],
            ["b","Eligibility signals","Google looks for: a single canonical URL per entity, structured data (JSON-LD/schema.org), corroborating mentions on third-party sites, an image of sufficient resolution, and consistent biographical facts across sources."],
            ["c","Schema.org Person","We emit schema.org/Person (or Organization for brands) as JSON-LD in the page <head>. Fields like name, jobTitle, birthDate, nationality, image, and sameAs are required."],
            ["d","Sourcing & citations","Profiles that cite at least three independent sources are 3.1× more likely to be picked up by Google's crawler in the first 72 hours."],
            ["e","Indexing API","On publish, WikiBio submits your URL via Google's Indexing API. Free-tier profiles share a submission window (within 24h). Gold-tier profiles are submitted immediately."],
            ["f","Common pitfalls","First-person voice, missing dates, low-resolution images, and broken sameAs links are the four most common reasons profiles don't get picked up."],
          ].map(([id, t, body], i) => (
            <section key={id} id={`sec-${id}`} style={{marginBottom:48}}>
              <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:14}}>
                <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>§ {String(i+1).padStart(2,"0")}</span>
                <h2 className="serif" style={{margin:0, fontSize:30, fontWeight:400}}>{t}</h2>
              </div>
              <p className={i===0?"dropcap":""} style={{fontSize:16, lineHeight:1.7, color:"var(--ink-2)", margin:0}}>{body}</p>
            </section>
          ))}
        </article>
      </div>
    </div>
  </div>
);

/* - About - */
const AboutPage = () => (
  <div>
    <PageHeader eyebrow="About · Vol. III" title="A free knowledge" italicWord="commons." subtitle="WikiBio is an open biographical platform. Anyone can publish, anyone can read, and Google indexes it." />
    <div className="wrap-sm">
      <p className="serif dropcap" style={{fontSize:20, lineHeight:1.7, color:"var(--ink-2)"}}>
        Wikipedia was built on the idea that every person should be able to write the story of the world.
        WikiBio extends that idea — the page about you. We don't gate-keep on notability.
        If you can write your story honestly and source it, it belongs in the archive.
      </p>
    </div>
  </div>
);

/* ---------- TopNav with Auth ---------- */
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
            <a href="#/" style={linkStyle(route.page==="home")}>Discover</a>
            <a href="#/browse" style={linkStyle(route.page==="browse")}>Browse</a>
            <a href="#/seo-guide" style={linkStyle(route.page==="seo")}>SEO Guide</a>
            <a href="#/about" style={linkStyle(false)}>About</a>
          </div>
          <div style={{flex:1}}/>

          {!loading && (
            user ? (
              <>
                <button onClick={handleLogout} style={{fontSize:13, color:"var(--ink-3)"}}>
                  Chiqish
                </button>
              </>
            ) : (
              <button onClick={()=>setShowAuth(true)} style={{
                fontSize:13, color:"var(--ink-2)", border:"1px solid var(--line-2)",
                padding:"8px 16px"
              }}>
                Kirish
              </button>
            )
          )}

          <ThemeToggle/>
          <a href="#/create" className="btn btn-primary" style={{padding:"10px 18px"}}>
            Profil yaratish <I.arrowR size={14}/>
          </a>
        </div>
      </header>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)}/>}
    </>
  );
};

/* -app ----  */
const App = () => {
  const [route, setRoute] = useStateApp(parseRoute());

  useEffectApp(() => {
    const onHash = () => { setRoute(parseRoute()); window.scrollTo(0,0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
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
        <main key={route.page+(route.id||"")}>{page}</main>
        <Footer/>
      </div>
    </AuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
