import { Link } from "react-router-dom";

/* ────────────────────────────────────────
   ProductGrid
   @param products  - Product[] depuis Laravel
   @param loading   - bool
   @param total     - nombre total (meta.total)
──────────────────────────────────────── */
export default function ProductGrid({ products = [], loading = false, total = 0 }) {
  if (loading) return <ProductGridSkeleton />;

  return (
    <div>
      {/* Compteur */}
      <p className="text-xs text-gray-400 mb-5">{total} produits</p>

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Carte produit ── */
function ProductCard({ product }) {
  return (
    <Link
      to={`/produits/${product.id}`}
      className="group flex flex-col gap-2"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
        <img
          src={product.image_url || "https://placehold.co/300x300/f5f5f5/aaa?text=Produit"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/300x300/f5f5f5/aaa?text=Produit";
          }}
        />

        {/* Badge stock */}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-gray-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Épuisé
          </span>
        )}
        {product.is_new && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Nouveau
          </span>
        )}

        {/* Bouton survol */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-2">
          <button
            onClick={(e) => { e.preventDefault(); /* logique panier */ }}
            className="w-full bg-black text-white text-[10px] font-bold tracking-widest py-2 rounded hover:bg-amber-500 transition-colors"
          >
            + Ajouter au panier
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="px-0.5">
        <p className="text-xs text-gray-600 leading-snug line-clamp-2 mb-1">
          {product.description || product.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-900">
            {product.price} dh
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-[10px] text-gray-400 line-through">
              {product.original_price} dh
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ── Skeleton loading (16 cartes) ── */
function ProductGridSkeleton() {
  return (
    <div>
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-5" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="col-span-4 text-center py-20">
      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
        
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-1">Aucun produit trouvé</p>
      <p className="text-xs text-gray-400">Essayez de modifier vos filtres.</p>
    </div>
  );
}