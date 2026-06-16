import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";

export default function ProductGrid({ products = [], loading = false, total = 0 }) {
  if (loading) return <ProductGridSkeleton />;

  return (
    <div>
      <p className="text-xs text-gray-400 mb-5">
        {total} {total > 1 ? "produits" : "produit"}
      </p>

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

function ProductCard({ product }) {
  const { addItem } = useCartContext();

  const handleAdd = (e) => {
    e.preventDefault();

    addItem({
      id: product.id,
      name: product.nom,
      image_url: product.image_url,
      price: product.prix,
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
          alt={product.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform p-2">
          <button
            onClick={handleAdd}
            className="w-full bg-black text-white text-[10px] font-bold py-2 rounded hover:bg-amber-500 transition-colors"
          >
            + Ajouter au panier
          </button>
        </div>
      </div>

      <div className="px-0.5 flex flex-col gap-0.5">
        <h3 className="text-xs font-medium text-gray-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {product.nom}
        </h3>
        
        {product.description && (
          <p className="text-[11px] text-gray-400 line-clamp-1">
            {product.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        <span className="text-xs font-bold text-gray-950 mt-0.5">
          {Number(product.prix).toLocaleString('fr-FR')} DH
        </span>
      </div>
    </Link>
  );
}

function ProductGridSkeleton() {
  return (
    <div>
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-5" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full text-center py-20 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg 
          className="w-6 h-6 text-amber-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Aucun produit trouvé</h3>
      <p className="text-xs text-gray-400 max-w-xs mx-auto">
        Nous n'avons trouvé aucun article correspondant à vos critères actuels. Essayez de réinitialiser vos filtres.
      </p>
    </div>
  );
}