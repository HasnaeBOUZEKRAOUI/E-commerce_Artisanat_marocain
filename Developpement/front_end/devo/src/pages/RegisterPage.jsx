import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth() // Assurez-vous d'avoir une méthode register dans votre AuthContext

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Vérification locale stricte avant l'envoi à l'API
    if (formData.password !== formData.password_confirmation) {
      return setError('Les mots de passe ne correspondent pas.');
    }
  
    setLoading(true);
    setError('');
  
    try {
      // 2. Envoi des clés exactes attendues par le validateur Laravel
      await register({
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation // 🌟 Indispensable pour la règle 'confirmed'
      });
      
      navigate('/');
    } catch (err) {
      // 3. Récupération propre des erreurs de validation Laravel (ex: email déjà pris, etc.)
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message ?? "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-start justify-center bg-white pt-10 pb-20 px-4">
      <div className="w-full max-w-md">

        <h1 className="text-center font-serif text-2xl md:text-3xl font-medium tracking-tight text-black mb-10">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Prénom */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prenom" className="text-sm text-black">First Name</label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              required
              value={formData.prenom}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-800 transition-colors"
            />
          </div>

          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nom" className="text-sm text-black">Last Name</label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              value={formData.nom}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-800 transition-colors"
            />
          </div>

          {/* Téléphone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="telephone" className="text-sm text-black">Phone Number</label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              required
              placeholder="+212..."
              value={formData.telephone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-800 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-black">Email</label>
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
            <label htmlFor="password" className="text-sm text-black">Password</label>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          {/* Confirmation Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password_confirmation" className="text-sm text-black">Confirm Password</label>
            <PasswordInput
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 text-white text-sm font-semibold tracking-widest py-4 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed uppercase mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creation…
              </span>
            ) : 'Create'}
          </button>

          {/* Lien de bascule vers le Login */}
          <p className="text-sm text-gray-500 text-left mt-2">
            Already have an account?{' '}
            <Link to="/login" className="hover:text-amber-800 transition-colors underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

/* ── COMPOSANT REUTILISABLE PASSWORDINPUT ── */
function PasswordInput({ id, name, value, onChange, autoComplete = "current-password" }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id} 
        name={name} 
        type={show ? 'text' : 'password'}
        required 
        autoComplete={autoComplete} 
        value={value} 
        onChange={onChange}
        className="w-full border border-gray-300 rounded-none px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:border-gray-800 transition-colors"
      />
      <button type="button" onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label={show ? 'Masquer' : 'Afficher'}>
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
  )
}