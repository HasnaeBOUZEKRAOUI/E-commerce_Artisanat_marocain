import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { produitsApi } from "../api/services";
import { useCartContext } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCartContext();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]); // 🌟 État pour les suggestions
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true); // 🌟 Chargement des suggestions
  const [error, setError] = useState(false);

  const [activeImg, setActiveImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDescOpen, setIsDescOpen] = useState(true);

  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center",
    transform: "scale(1)",
  });

  useEffect(() => {
    setLoading(true);
    setLoadingRelated(true);
    setQuantity(1); // Réinitialise la quantité lors du changement de produit

    produitsApi.get(id)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setProduct(data);
        setActiveImg(data?.image_url || "https://placehold.co/600x600");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });

    // 🌟 Appel de la requête pour les produits complémentaires / liés
    produitsApi.recommandations(id)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setRecommendations(Array.isArray(data) ? data.slice(0, 4) : []);
        setLoadingRelated(false);
      })
      .catch((err) => {
        console.error("Erreur recommandations:", err);
        setLoadingRelated(false);
      });
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center",
      transform: "scale(1)",
    });
  };

  if (loading) return <ProductPageSkeleton />;
  if (error || !product) return <ProductPageError />;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.nom,
      image_url: product.image_url,
      price: product.prix,
      quantity: quantity,
    });
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] font-manrope antialiased text-gray-900">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4">
        
        <nav className="text-[11px] text-gray-400 font-medium mb-6 flex items-center gap-1.5 tracking-tight">
          <Link to="/" className="hover:text-black transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-black transition-colors">Collections</Link>
          <span>/</span>
          {product.categorie && (
            <>
              <Link to={`/categories/${product.categorie.slug}`} className="hover:text-black transition-colors">
                {product.categorie.nom}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-500 font-normal truncate max-w-[150px]">{product.nom}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-12">
          
          <div className="flex flex-col gap-4 max-w-[500px] mx-auto w-full">
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center relative cursor-zoom-in"
            >
              <img
                src={activeImg}
                alt={product.nom}
                style={zoomStyle}
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-1 relative px-6">
                <button className="absolute left-0 text-gray-400 hover:text-black text-lg font-serif">‹</button>
                <div className="flex gap-2 overflow-x-auto no-scrollbar justify-center py-1">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(img.url)}
                      className={`w-16 h-12 flex-shrink-0 border rounded overflow-hidden bg-gray-50 transition-all ${
                        activeImg === img.url ? "border-gray-900 opacity-100 shadow-sm" : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button className="absolute right-0 text-gray-400 hover:text-black text-lg font-serif">›</button>
              </div>
            )}
          </div>

          <div className="flex flex-col pt-2 w-full">
            <h1 className="font-serif text-xl md:text-2xl font-normal text-gray-900 tracking-wide mb-4">
              {product.nom}
            </h1>

            <div className="flex items-center border border-gray-200 bg-white px-4 py-2.5 mb-5 max-w-[340px]">
              <span className="font-serif text-sm font-bold text-black border-r border-gray-200 pr-4 mr-4 tracking-wide whitespace-nowrap">
                Prix :
              </span>
              <span className="text-base font-medium font-mono text-gray-900 tracking-tight">
                {Number(product.prix).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} dh
              </span>
            </div>

            {product.caracteristiques && product.caracteristiques.some(c => c.nom.toLowerCase().includes('dimension') || c.nom.toLowerCase().includes('taille')) && (
              <div className="mb-6">
                <span className="inline-block text-[10px] font-mono font-medium text-gray-500 border border-gray-200 bg-gray-50 px-2 py-1 tracking-tight rounded-sm">
                  {product.caracteristiques.find(c => c.nom.toLowerCase().includes('dimension') || c.nom.toLowerCase().includes('taille'))?.valeur}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3 max-w-[340px] mb-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-300 rounded-sm bg-white h-10">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 text-gray-500 hover:bg-gray-50 h-full font-medium transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-xs font-semibold text-center select-none font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 text-gray-500 hover:bg-gray-50 h-full font-medium transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 h-10 px-4 text-xs font-semibold tracking-wider uppercase rounded-sm transition-all shadow-sm ${
                    product.stock > 0
                      ? "bg-[#d1d5db] text-gray-900 hover:bg-amber-600 hover:text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {product.stock > 0 ? "Ajouter au panier" : "Rupture"}
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                <img 
                  src="https://cdn.shopify.com/s/files/1/0082/6122/2436/files/trusted-badges.png?v=1613583215" 
                  alt="Guaranteed Safe Checkout" 
                  className="w-full max-w-[280px] mx-auto opacity-75 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            <div className="border border-gray-100 rounded bg-[#fcfcfc] overflow-hidden">
              <button
                onClick={() => setIsDescOpen(!isDescOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-white text-left font-semibold text-xs text-gray-800 border-b border-gray-100 tracking-wide uppercase"
              >
                <span>Description</span>
                <svg
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${isDescOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {isDescOpen && (
                <div className="p-4 bg-white text-[11px] text-gray-600 leading-relaxed font-normal">
                  {product.description && (
                    <p className="mb-4 font-medium text-gray-800">
                      {product.description.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                  
                  {product.caracteristiques && product.caracteristiques.length > 0 && (
                    <ul className="space-y-1.5 list-disc pl-4 text-gray-500">
                      {product.caracteristiques.map((item, idx) => (
                        <li key={item.id || idx}>
                          <span className="font-semibold text-gray-700 capitalize">{item.nom}</span> : {item.valeur}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 🌟 SECTION DYNAMIQUE : YOU MAY ALSO LIKE */}
        <div className="mt-16 mb-8">
          <div className="flex items-baseline justify-between mb-6 border-b border-gray-100 pb-2">
            <h2 className="font-serif text-lg font-normal uppercase tracking-wider text-black">
              You may also like
            </h2>
            <Link to={product.categorie ? `/categories/${product.categorie.slug}` : '/boutique'} className="text-[11px] font-bold text-gray-900 hover:text-amber-700 uppercase tracking-tight transition-colors">
              Voir plus →
            </Link>
          </div>
          
          {loadingRelated ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded" />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">Aucun produit similaire trouvé.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/produits/${item.id}`} 
                  className="group flex flex-col gap-2 bg-white p-2 rounded border border-gray-50 shadow-sm"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden rounded relative">
                    <img 
                      src={item.image_url || "https://placehold.co/400x400"} 
                      alt={item.nom} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 px-0.5 pb-1">
                    <h4 className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-tight h-7">
                      {item.nom}
                    </h4>
                    <span className="text-[11px] font-bold text-gray-950 mt-1 font-mono">
                      {Number(item.prix).toLocaleString('fr-FR')} dh
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-40 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-white p-6 rounded-lg border border-gray-100">
        <div className="flex flex-col gap-4 w-full max-w-[500px]">
          <div className="aspect-[4/3] bg-gray-200 rounded w-full" />
          <div className="flex justify-center gap-2">
            <div className="w-16 h-12 bg-gray-200 rounded" />
            <div className="w-16 h-12 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-10 bg-gray-200 rounded w-1/2 mt-4" />
          <div className="h-10 bg-gray-200 rounded w-full mt-4" />
        </div>
      </div>
    </div>
  );
}

function ProductPageError() {
  return (
    <div className="w-full text-center py-32 font-manrope">
      <h2 className="text-sm font-semibold text-gray-800 mb-1">Produit introuvable</h2>
      <p className="text-[11px] text-gray-400 mb-6">Ce produit n'existe pas ou a été retiré de notre catalogue.</p>
      <Link to="/boutique" className="bg-black text-white text-[10px] font-bold py-2 px-4 rounded-sm hover:bg-amber-600 transition-colors uppercase tracking-wider">
        Retourner à la boutique
      </Link>
    </div>
  );
}