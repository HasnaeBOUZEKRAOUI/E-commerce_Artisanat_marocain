import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";

/* ──────────────────────────────────────── */
export default function ProductGrid({ products = [], loading = false, total = 0 }) {
  if (loading) return <ProductGridSkeleton />;

  return (
    <div>
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

/* ── CARD ── */
function ProductCard({ product }) {
  const { addItem } = useCartContext(); // ✅ ICI

  const handleAdd = (e) => {
    e.preventDefault(); // empêche navigation Link

    addItem({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      price: product.price,
    });
  };

  return (
    <Link
      to={`/produits/${product.id}`}
      className="group flex flex-col gap-2"
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
        <img
          src={product.image_url || "https://placehold.co/300x300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />

        {/* bouton panier */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform p-2">
          <button
            onClick={handleAdd}
            className="w-full bg-black text-white text-[10px] font-bold py-2 rounded hover:bg-amber-500"
          >
            + Ajouter au panier
          </button>
        </div>
      </div>

      <div className="px-0.5">
        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
          {product.description || product.name}
        </p>
        <span className="text-xs font-bold text-gray-900">
          {product.price} dh
        </span>
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