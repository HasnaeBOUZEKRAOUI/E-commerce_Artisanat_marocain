import { Link } from "react-router-dom";

/**
 * Breadcrumb
 * @param {Array} items - [{ label, href }]  (dernier item sans href = page courante)
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-300">›</span>}
          {item.href ? (
            <Link to={item.href} className="hover:text-amber-500 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}