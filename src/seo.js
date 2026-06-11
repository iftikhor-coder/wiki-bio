// WikiBio — SEO: schema.org JSON-LD + meta tags
// src/seo.js

const SEO = {

  // Profil sahifasi uchun JSON-LD inject qilish
  injectProfileSchema(profile) {
    // Eski schema ni o'chirish
    const old = document.getElementById("wb-schema");
    if (old) old.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": profile.category === "Brand" ? "Organization" : "Person",
      "name": profile.name,
      "jobTitle": profile.category,
      "birthDate": profile.birth_date || profile.birthDate,
      "nationality": profile.nationality,
      "description": profile.short_bio || profile.short,
      "image": profile.photo_url || profile.photo,
      "url": `https://wiki-bio.vercel.app/#/p/${profile.slug || profile.id}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://wiki-bio.vercel.app/#/p/${profile.slug || profile.id}`
      },
      "sameAs": (profile.socials || []).map(s => {
        const map = {
          instagram: `https://instagram.com/${s.handle?.replace("@","")}`,
          x: `https://x.com/${s.handle?.replace("@","")}`,
          linkedin: `https://linkedin.com/in/${s.handle}`,
          youtube: `https://youtube.com/@${s.handle?.replace("@","")}`,
          site: s.handle?.startsWith("http") ? s.handle : `https://${s.handle}`,
        };
        return map[s.kind] || null;
      }).filter(Boolean),
    };

    const script = document.createElement("script");
    script.id = "wb-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  },

  // Meta taglarni yangilash
  setMeta(profile) {
    const title = `${profile.name} — WikiBio`;
    const desc = profile.short_bio || profile.short || `${profile.name} haqida ma'lumot`;
    const image = profile.photo_url || profile.photo || "";
    const url = `https://wiki-bio.vercel.app/#/p/${profile.slug || profile.id}`;

    document.title = title;

    const setOrCreate = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrVal] = selector.replace("meta[","").replace("]","").split("=");
        el.setAttribute(attrName, attrVal.replace(/"/g,""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setOrCreate('meta[name="description"]', "content", desc);
    setOrCreate('meta[property="og:title"]', "content", title);
    setOrCreate('meta[property="og:description"]', "content", desc);
    setOrCreate('meta[property="og:image"]', "content", image);
    setOrCreate('meta[property="og:url"]', "content", url);
    setOrCreate('meta[property="og:type"]', "content", "profile");
    setOrCreate('meta[name="twitter:card"]', "content", "summary_large_image");
    setOrCreate('meta[name="twitter:title"]', "content", title);
    setOrCreate('meta[name="twitter:description"]', "content", desc);
    setOrCreate('meta[name="twitter:image"]', "content", image);
  },

  // Canonical URL
  setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.rel = "canonical";
      document.head.appendChild(el);
    }
    el.href = url;
  },

  // Bosh sahifa meta
  setHome() {
    document.title = "WikiBio — The free knowledge platform built by the people";
    const desc = "Bepul bilim platformasi. O'z profilingizni yarating va Google da Wikipedia kabi ko'rining.";
    let el = document.querySelector('meta[name="description"]');
    if (el) el.setAttribute("content", desc);

    // Eski schemani o'chirish
    const old = document.getElementById("wb-schema");
    if (old) old.remove();

    // Website schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "WikiBio",
      "url": "https://wiki-bio.vercel.app",
      "description": desc,
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://wiki-bio.vercel.app/#/browse?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const script = document.createElement("script");
    script.id = "wb-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  },
};

window.SEO = SEO;
