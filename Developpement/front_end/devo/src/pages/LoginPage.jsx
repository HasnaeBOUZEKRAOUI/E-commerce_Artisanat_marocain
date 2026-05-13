import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Email ou mot de passe incorrect.");
        return;
      }

      // Stocker le token Laravel Sanctum / JWT
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirection après connexion
      navigate("/");
    } catch {
      setError("Erreur de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-start justify-center bg-white pt-10 pb-20 px-4">
      <div className="w-full max-w-md">

        {/* Titre */}
        <h1 className="text-center font-serif text-2xl md:text-3xl font-medium tracking-tight text-black mb-10">     
        Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-black">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-800 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-black">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-amber-500 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          {/* Bouton Sign in */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 text-white text-sm font-semibold tracking-widest py-4 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed uppercase"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Connexion…
              </span>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Créer un compte */}
          <p className="text-sm text-gray-500 text-left">
            <Link
              to="/register"
              className="hover:text-amber-800 transition-colors underline-offset-2 hover:underline"
            >
              create account?
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

/* ── Champ password avec toggle visibilité ── */
function PasswordInput({ id, name, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        required
        autoComplete="current-password"
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-none px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:border-gray-800 transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {show ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        )}
      </button>
    </div>
  );
}