import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * OrderSummary
 * @param {number} total      – montant total
 * @param {func}   onCheckout – déclenche la commande
 * @param {bool}   loading    – pendant l'appel API
 */
export default function OrderSummary({ total = 0, onCheckout, loading = false }) {
  const [note, setNote]       = useState("");
  const [showNote, setShowNote] = useState(false);
  const navigate               = useNavigate();

  return (
    <div className="border border-gray-200 rounded p-6 flex flex-col gap-4 bg-white h-fit">

      {/* Note de commande */}
      <div>
        <button
          onClick={() => setShowNote((s) => !s)}
          className="text-sm font-semibold text-gray-800 hover:text-amber-500 transition-colors flex items-center gap-1"
        >
          Ajouter une note de commande
          <svg
            className={`w-4 h-4 transition-transform ${showNote ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {showNote && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Votre note…"
            rows={3}
            className="mt-2 w-full border border-gray-200 rounded px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-amber-400 resize-none"
          />
        )}
      </div>

      {/* Séparateur */}
      <div className="border-t border-gray-100" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Total :</span>
        <span className="text-sm font-bold text-gray-900">
          {total.toFixed(2)} dh
        </span>
      </div>

      {/* Bouton cadeaux */}
      <button className="w-full border border-gray-300 text-gray-700 text-sm py-3 rounded hover:border-amber-400 hover:text-amber-600 transition-colors">
        De nombreux cadeaux à gagner !
      </button>

      {/* Vérifier / Checkout */}
      <button
        onClick={() => onCheckout && onCheckout(note)}
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-amber-500 text-white text-sm font-bold tracking-widest py-3.5 rounded transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed uppercase"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Traitement…
          </span>
        ) : (
          "vérifier"
        )}
      </button>

      {/* Continuer les achats */}
      <button
        onClick={() => navigate("/")}
        className="w-full border border-gray-200 text-gray-600 text-sm py-3 rounded hover:border-gray-400 hover:text-gray-900 transition-colors"
      >
        continuer vos achats
      </button>
    </div>
  );
}