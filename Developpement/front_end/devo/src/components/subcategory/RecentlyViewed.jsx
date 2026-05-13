import { Link } from "react-router-dom";

/**
 * RecentlyViewed
 * @param {Array}   products  - depuis useRecentlyViewed
 * @param {boolean} loading
 */
export default function RecentlyViewed({ products = [], loading = false }) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="py-14 border-t border-gray-100">
      <h2 className="text-base font-bold tracking-widest uppercase text-gray-900 mb-8">
        Récemment Consulté
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))
          : products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/produits/${product.id}`}
                className="group flex flex-col gap-2"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.image_url || "https://placehold.co/300x300/f5f5f5/aaa?text=Produit"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/300x300/f5f5f5/aaa?text=Produit";
                    }}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 leading-snug line-clamp-2 mb-1">
                    {product.description || product.name}
                  </p>
                  <p className="text-xs font-bold text-gray-900">{product.price} dh</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}