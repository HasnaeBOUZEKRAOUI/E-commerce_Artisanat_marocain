import { useState } from "react";

const COULEURS = [
  { label: "Black", value: "Black", hex: "#1a1a1a" },
  { label: "Blanc", value: "white", hex: "#f5f5f5" },
  { label: "Rouge", value: "red", hex: "#c0392b" },
  { label: "Bleu", value: "blue", hex: "#2980b9" },
  { label: "Vert", value: "green", hex: "#27ae60" },
  { label: "Beige", value: "beige", hex: "#d4b896" },
  { label: "Or", value: "gold", hex: "#d4af37" },
];

const TAILLES = ["XS", "S", "M", "L", "XL", "Unique"];

/**
 * FilterSidebar
 * @param {object} filters   - état courant des filtres
 * @param {func}   onChange  - (key, value) => void
 * @param {func}   onReset   - () => void
 */
export default function FilterSidebar({ filters = {}, onChange, onReset }) {
  const [openSections, setOpenSections] = useState({
    disponibilite: true,
    prix: false,
    couleur: false,
    taille: false,
  });

  const toggle = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className="w-full">
      {/* ── Disponibilité ── */}
      <FilterSection
        label="Disponibilité"
        open={openSections.disponibilite}
        onToggle={() => toggle("disponibilite")}
      >
        <div className="flex flex-col gap-2 pt-2">
          {[
            { label: "Tous", value: "all" },
            { label: "En stock", value: "in_stock" },
            { label: "Rupture de stock", value: "out_of_stock" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="disponibilite"
                value={opt.value}
                checked={(filters.disponibilite || "all") === opt.value}
                onChange={() => onChange("disponibilite", opt.value)}
                className="accent-amber-500"
              />
              <span className="text-xs text-gray-600 group-hover:text-amber-600 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ── Prix ── */}
      <FilterSection
        label="Prix"
        open={openSections.prix}
        onToggle={() => toggle("prix")}
      >
        <div className="pt-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.prix_min || ""}
              onChange={(e) => onChange("prix_min", e.target.value)}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-amber-400"
            />
            <span className="text-gray-400 text-xs">—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.prix_max || ""}
              onChange={(e) => onChange("prix_max", e.target.value)}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={() => { onChange("prix_min", ""); onChange("prix_max", ""); }}
            className="text-xs text-amber-500 hover:underline text-left"
          >
            Effacer
          </button>
        </div>
      </FilterSection>

      {/* ── Couleur ── */}
      <FilterSection
        label="Couleur"
        open={openSections.couleur}
        onToggle={() => toggle("couleur")}
      >
        <div className="pt-3 flex flex-wrap gap-2">
          {COULEURS.map((c) => {
            const selected = filters.couleur === c.value;
            return (
              <button
                key={c.value}
                title={c.label}
                onClick={() => onChange("couleur", selected ? "" : c.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selected ? "border-amber-400 scale-110 shadow-md" : "border-transparent hover:border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* ── Taille ── */}
      <FilterSection
        label="Taille"
        open={openSections.taille}
        onToggle={() => toggle("taille")}
      >
        <div className="pt-3 flex flex-wrap gap-2">
          {TAILLES.map((t) => {
            const selected = filters.taille === t;
            return (
              <button
                key={t}
                onClick={() => onChange("taille", selected ? "" : t)}
                className={`px-3 py-1 text-xs border rounded transition-all ${
                  selected
                    ? "bg-amber-500 border-amber-500 text-white font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Reset */}
      <button
        onClick={onReset}
        className="mt-4 w-full text-xs text-gray-400 hover:text-amber-500 border border-gray-200 hover:border-amber-300 rounded py-2 transition-all"
      >
        Réinitialiser les filtres
      </button>
    </aside>
  );
}

/* ── Accordion section interne ── */
function FilterSection({ label, open, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 py-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}