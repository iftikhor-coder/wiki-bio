/* WikiBio — App shell with hash routing */

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
  if (segs[0] === "admin") return { page: "admin" };
  if (segs[0] === "browse") return { page: "browse", q };
  if (segs[0] === "seo-guide") return { page: "seo" };
  if (segs[0] === "about") return { page: "about" };
  return { page: "home" };
};

/* ---------- Browse page (simple grid) ---------- */
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
      <PageHeader dense
        eyebrow="Browse · 184,302 profiles"
        title="The"
        italicWord="archive."
        subtitle="Filter by category or search. New profiles added every minute."
      />
      <div className="wrap">
        <div style={{marginBottom:32}}>
          <SearchBox autoFocus={false}/>
        </div>
        <div style={{
          display:"flex", gap:8, flexWrap:"wrap", padding:"16px 0",
          borderTop:"1px solid var(--line-2)", borderBottom:"1px solid var(--line-2)", marginBottom:40
        }}>
          {cats.map(c => (
            <Pill key={c} active={cat===c} onClick={()=>setCat(c)}>{c}</Pill>
          ))}
        </div>
        <div className="mono" style={{fontSize:11, letterSpacing:".18em", color:"var(--ink-3)", marginBottom:24, textTransform:"uppercase"}}>
          {results.length} {results.length === 1 ? "result" : "results"}
        </div>
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:28
        }}>
          {results.map((p, i) => <ProfileCard key={p.id} profile={p} index={i}/>)}
        </div>
      </div>
    </div>
  );
};

/* ---------- SEO guide (simple long-form) ---------- */
const SEOGuidePage = () => (
  <div>
    <PageHeader
      eyebrow="The WikiBio Guide · No. 03"
      title="How to get into the"
      italicWord="Knowledge Panel."
      subtitle="A plain-English guide to schema.org structured data, indexing, and the eligibility signals Google actually uses."
    />
    <div className="wrap" style={{paddingBottom:80}}>
      <div style={{display:"grid", gridTemplateColumns:"200px 1fr", gap:64}}>
        <div className="hide-mobile">
          <TOC items={[
            { id:"a", title:"What is a Knowledge Panel" },
            { id:"b", title:"Eligibility signals" },
            { id:"c", title:"Schema.org Person" },
            { id:"d", title:"Sourcing & citations" },
            { id:"e", title:"Indexing API" },
            { id:"f", title:"Common pitfalls" },
          ]}/>
        </div>
        <article style={{maxWidth:720}}>
          {[
            ["a","What is a Knowledge Panel",
             "The Knowledge Panel is the boxed information card Google shows on the right-hand side of search results for entities — people, places, organizations. It's pulled from Google's Knowledge Graph, which in turn ingests structured data from sources Google trusts."],
            ["b","Eligibility signals",
             "Google looks for: a single canonical URL per entity, structured data (JSON-LD/schema.org), corroborating mentions on third-party sites, an image of sufficient resolution, and consistent biographical facts across sources. WikiBio generates the first four automatically; the fifth is on you."],
            ["c","Schema.org Person",
             "We emit schema.org/Person (or Organization for brands) as JSON-LD in the page <head>. Fields like name, jobTitle, birthDate, nationality, image, and sameAs are required. The richer your fields, the better."],
            ["d","Sourcing & citations",
             "Profiles that cite at least three independent sources are 3.1× more likely to be picked up by Google's crawler in the first 72 hours. Source links should be permanent and external — newspaper articles, official records, peer-reviewed work."],
            ["e","Indexing API",
             "On publish, WikiBio submits your URL via Google's Indexing API. Free-tier profiles share a submission window (within 24h). Gold-tier profiles are submitted immediately."],
            ["f","Common pitfalls",
             "First-person voice (Google treats it as promotional), missing dates, low-resolution images, and broken sameAs links are the four most common reasons profiles don't get picked up. Our editor warns you about all four."],
          ].map(([id, t, body], i) => (
            <section key={id} id={`sec-${id}`} style={{marginBottom:48}}>
              <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:14}}>
                <span className="mono" style={{fontSize:12, color:"var(--gold)", letterSpacing:".18em"}}>§ {String(i+1).padStart(2,"0")}</span>
                <h2 className="serif" style={{margin:0, fontSize:30, fontWeight:400, letterSpacing:"-0.015em"}}>{t}</h2>
              </div>
              <p className={i===0 ? "dropcap" : ""} style={{
                fontSize:16, lineHeight:1.7, color:"var(--ink-2)", margin:0,
                textWrap:"pretty"
              }}>{body}</p>
            </section>
          ))}
        </article>
      </div>
    </div>
  </div>
);

/* ---------- About (placeholder, short) ---------- */
const AboutPage = () => (
  <div>
    <PageHeader
      eyebrow="About · Vol. III"
      title="A free knowledge"
      italicWord="commons."
      subtitle="WikiBio is an open biographical platform owned by the WikiBio Foundation. Anyone can publish, anyone can read, and Google indexes it."
    />
    <div className="wrap-sm">
      <p className="serif dropcap" style={{fontSize:20, lineHeight:1.7, color:"var(--ink-2)"}}>
        Wikipedia was built on the idea that every person should be able to write the
        story of the world. WikiBio extends that idea to one more frontier — the page
        about you. We don't gate-keep on notability. We don't have a committee that
        decides whose life is worth a page. If you can write your story honestly and
        source it, it belongs in the archive. Google reads it like it reads everything
        else. The web becomes a little less encyclopedic and a little more human.
      </p>
    </div>
  </div>
);

/* ---------- App ---------- */
const App = () => {
  const [route, setRoute] = useStateApp(parseRoute());
  useEffectApp(() => {
    const onHash = () => { setRoute(parseRoute()); window.scrollTo(0, 0); };
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
    case "browse":    page = <BrowsePage q={route.q || {}}/>; break;
    case "seo":       page = <SEOGuidePage/>; break;
    case "about":     page = <AboutPage/>; break;
    default:          page = <HomePage/>;
  }

  return (
    <div>
      <TopNav route={route}/>
      <main key={route.page + (route.id || "")}>{page}</main>
      <Footer/>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
