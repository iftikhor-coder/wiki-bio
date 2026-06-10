// WikiBio — API moduli (barcha Supabase so'rovlar)
// src/api.js

const API = {

  // ==================== PROFILES ====================

  // all live account (home page)
  async getProfiles({ limit = 20, category, search } = {}) {
    let q = sb.from("wb_profiles")
      .select("id,slug,name,category,short_bio,photo_url,tier,views_count,nationality,birth_date,tags")
      .in("status", ["approved", "live"])
      .order("views_count", { ascending: false })
      .limit(limit);

    if (category && category !== "All") q = q.eq("category", category);
    if (search) q = q.ilike("name", `%${search}%`);

    const { data, error } = await q;
    return { data, error };
  },

  // Bitta profil slug
  async getProfile(slug) {
    const { data, error } = await sb
      .from("wb_profiles")
      .select("*")
      .eq("slug", slug)
      .in("status", ["approved", "live"])
      .single();
    return { data, error };
  },

  // Create account
  async createProfile(profileData, userId) {
    const slug = profileData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const schemaJson = {
      "@context": "https://schema.org",
      "@type": profileData.category === "Brand" ? "Organization" : "Person",
      "name": profileData.name,
      "jobTitle": profileData.category,
      "birthDate": profileData.birth_date,
      "nationality": profileData.nationality,
      "description": profileData.short_bio,
      "image": profileData.photo_url,
      "url": `https://wikibio.uz/${slug}`,
    };

    const { data, error } = await sb.from("wb_profiles").insert({
      ...profileData,
      slug,
      schema_json: schemaJson,
      status: "pending",
      created_by: userId,
    }).select().single();

    return { data, error };
  },

  // Account update
  async updateProfile(id, updates) {
    const { data, error } = await sb
      .from("wb_profiles")
      .update(updates)
      .eq("id", id)
      .select().single();
    return { data, error };
  },

  // Views count
  async addView(profileId) {
    await sb.from("wb_views").insert({ profile_id: profileId });
    await sb.rpc("increment_views", { profile_id: profileId }).catch(() => {});
  },

  // Users account
  async getMyProfiles(userId) {
    const { data, error } = await sb
      .from("wb_profiles")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // ==================== ADMIN ====================

  // Waiting Account
  async getPendingProfiles() {
    const { data, error } = await sb
      .from("wb_profiles")
      .select("*, wb_users(display_name, username)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // All account (admin)
  async getAllProfiles({ limit = 50, status, page = 0 } = {}) {
    let q = sb.from("wb_profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (status) q = q.eq("status", status);

    const { data, error, count } = await q;
    return { data, error, count };
  },

  // Account confirm / cencel
  async reviewProfile(profileId, action, reviewerId, note = "") {
    const newStatus = action === "approve" ? "live" : action === "reject" ? "rejected" : "pending";

    const { error: pErr } = await sb
      .from("wb_profiles")
      .update({
        status: newStatus,
        published_at: action === "approve" ? new Date().toISOString() : null,
      })
      .eq("id", profileId);

    if (pErr) return { error: pErr };

    const { data, error } = await sb.from("wb_reviews").insert({
      profile_id: profileId,
      reviewer_id: reviewerId,
      action,
      note,
    }).select().single();

    return { data, error };
  },

  // Statistic (admin dashboard)
  async getStats() {
    const [total, pending, live, users] = await Promise.all([
      sb.from("wb_profiles").select("id", { count: "exact", head: true }),
      sb.from("wb_profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
      sb.from("wb_profiles").select("id", { count: "exact", head: true }).eq("status", "live"),
      sb.from("wb_users").select("id", { count: "exact", head: true }),
    ]);
    return {
      total: total.count || 0,
      pending: pending.count || 0,
      live: live.count || 0,
      users: users.count || 0,
    };
  },

  // ==================== WIKIPEDIA IMPORT ====================

  // Wikipedia parsing
  async fetchFromWikipedia(title) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Topilmadi");
      const d = await res.json();

      return {
        data: {
          name: d.title,
          short_bio: d.description,
          full_bio: [{ title: "Biography", body: d.extract }],
          photo_url: d.thumbnail?.source || d.originalimage?.source || null,
          wikipedia_url: d.content_urls?.desktop?.page,
          category: d.description || "Person",
        },
        error: null,
      };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },

  // Wikipedia import confirm
  async saveImport(wikiTitle, rawData) {
    const { data, error } = await sb.from("wb_imports").insert({
      wikipedia_title: wikiTitle,
      wikipedia_url: rawData.wikipedia_url,
      raw_data: rawData,
      status: "pending",
    }).select().single();
    return { data, error };
  },

  // ==================== STORAGE ====================

  // Photo upload
  async uploadPhoto(file, userId, type = "portrait") {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${type}-${Date.now()}.${ext}`;

    const { data, error } = await sb.storage
      .from("wb-photos")
      .upload(path, file, { upsert: true });

    if (error) return { url: null, error };

    const { data: { publicUrl } } = sb.storage
      .from("wb-photos")
      .getPublicUrl(path);

    return { url: publicUrl, error: null };
  },
};

window.API = API;
