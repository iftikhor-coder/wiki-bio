// WikiBio — Auth moduli
// src/auth.js

const { useState: useStateAuth, useEffect: useEffectAuth, createContext, useContext } = React;

// ---------- Auth ----------
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useStateAuth(null);
  const [profile, setProfile] = useStateAuth(null);
  const [loading, setLoading] = useStateAuth(true);

  useEffectAuth(() => {
    // Joriy session
    sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadWbUser(session.user.id);
      else setLoading(false);
    });

    // Session changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadWbUser(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadWbUser = async (userId) => {
    const { data } = await sb
      .from("wb_users")
      .select("*, wb_profiles(*)")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  };

  return React.createElement(AuthContext.Provider, {
    value: { user, profile, loading, reload: () => user && loadWbUser(user.id) },
    children,
  });
};

const useAuth = () => useContext(AuthContext);

// ---------- Login modal ----------
const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useStateAuth("login"); // login | register | reset
  const [email, setEmail] = useStateAuth("");
  const [password, setPassword] = useStateAuth("");
  const [name, setName] = useStateAuth("");
  const [error, setError] = useStateAuth("");
  const [msg, setMsg] = useStateAuth("");
  const [busy, setBusy] = useStateAuth(false);

  const handle = async () => {
    setBusy(true); setError(""); setMsg("");
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose?.();
      } else if (mode === "register") {
        const { error } = await sb.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setMsg("Email yuborildi! Tasdiqlang va kiring.");
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMsg("Parol tiklash emaili yuborildi.");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const googleLogin = async () => {
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
  };

  return React.createElement("div", {
    style: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
    },
    onClick: (e) => e.target === e.currentTarget && onClose?.(),
  },
    React.createElement("div", {
      style: {
        width: 420, background: "var(--bg-2)", border: "1px solid var(--line)",
        padding: "40px 36px",
      },
    },
      // Sarlavha
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 28 } },
        React.createElement("h2", { className: "serif", style: { fontSize: 26, fontWeight: 400 } },
          mode === "login" ? "Kirish" : mode === "register" ? "Ro'yxatdan o'tish" : "Parolni tiklash"
        ),
        React.createElement("button", { onClick: onClose, style: { color: "var(--ink-3)" } },
          React.createElement(I.x, { size: 18 })
        )
      ),

      // Google login
      mode !== "reset" && React.createElement("button", {
        onClick: googleLogin,
        style: {
          width: "100%", padding: "12px", border: "1px solid var(--line-2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, marginBottom: 20, color: "var(--ink)", fontSize: 14,
        },
      },
        React.createElement(I.google, { size: 16 }), "Google bilan kirish"
      ),

      mode !== "reset" && React.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20, color: "var(--ink-3)", fontSize: 12 },
      },
        React.createElement("span", { style: { flex: 1, height: 1, background: "var(--line)" } }),
        "yoki email bilan",
        React.createElement("span", { style: { flex: 1, height: 1, background: "var(--line)" } }),
      ),

      // Ism (faqat register)
      mode === "register" && React.createElement("div", { style: { marginBottom: 14 } },
        React.createElement("label", { className: "field-label" }, "To'liq ism"),
        React.createElement("input", {
          className: "input", value: name, placeholder: "Ism Familiya",
          onChange: e => setName(e.target.value),
        })
      ),

      // Email
      React.createElement("div", { style: { marginBottom: 14 } },
        React.createElement("label", { className: "field-label" }, "Email"),
        React.createElement("input", {
          className: "input", type: "email", value: email, placeholder: "email@example.com",
          onChange: e => setEmail(e.target.value),
        })
      ),

      // Password
      mode !== "reset" && React.createElement("div", { style: { marginBottom: 20 } },
        React.createElement("label", { className: "field-label" }, "Parol"),
        React.createElement("input", {
          className: "input", type: "password", value: password, placeholder: "••••••••",
          onChange: e => setPassword(e.target.value),
          onKeyDown: e => e.key === "Enter" && handle(),
        })
      ),

      // Xato / muvaffaqiyat
      error && React.createElement("div", {
        style: { padding: "10px 14px", background: "rgba(199,81,70,0.12)", color: "var(--accent-red)", fontSize: 13, marginBottom: 14 },
      }, error),
      msg && React.createElement("div", {
        style: { padding: "10px 14px", background: "rgba(93,191,142,0.12)", color: "#5DBF8E", fontSize: 13, marginBottom: 14 },
      }, msg),

      // Buton
      React.createElement("button", {
        className: "btn btn-primary",
        style: { width: "100%", justifyContent: "center", opacity: busy ? 0.6 : 1 },
        onClick: handle, disabled: busy,
      }, busy ? "Yuborilmoqda..." : mode === "login" ? "Kirish" : mode === "register" ? "Ro'yxatdan o'tish" : "Yuborish"),

      // Alt links
      React.createElement("div", { style: { marginTop: 18, fontSize: 13, color: "var(--ink-3)", display: "flex", justifyContent: "space-between" } },
        mode === "login" && React.createElement(React.Fragment, null,
          React.createElement("button", { onClick: () => setMode("register"), style: { color: "var(--gold)" } }, "Ro'yxatdan o'tish"),
          React.createElement("button", { onClick: () => setMode("reset"), style: { color: "var(--ink-3)" } }, "Parolni unutdim"),
        ),
        mode === "register" && React.createElement("button", { onClick: () => setMode("login"), style: { color: "var(--gold)" } }, "Hisobim bor — kirish"),
        mode === "reset" && React.createElement("button", { onClick: () => setMode("login"), style: { color: "var(--gold)" } }, "Orqaga"),
      )
    )
  );
};

window.AuthProvider = AuthProvider;
window.useAuth = useAuth;
window.AuthModal = AuthModal;
