import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Breadcrumb         from "../components/ui/Breadcrumb";
import SubCategoryBar     from "../components/subcategory/SubCategoryBar";
import FilterSidebar      from "../components/subcategory/FilterSidebar";
import ProductGrid        from "../components/subcategory/ProductGrid";
import Pagination         from "../components/ui/Pagination";
import RecentlyViewed     from "../components/subcategory/RecentlyViewed";
import Newsletter         from "../components/home/Newsletter";
import useProducts        from "../hooks/useProducts";
import useRecentlyViewed  from "../hooks/useRecentlyViewed";
import { getSubcategories } from "../services/api";

// ─────────────────────────────────────────────────────────────
//  Données de demo pour les sous-catégories
//  → À remplacer par l'appel API une fois le backend prêt
// ─────────────────────────────────────────────────────────────
const DEMO_SUBCATEGORIES = [
  { id: 1, name: "Couvertures",     slug: "couvertures",    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70" },
  { id: 2, name: "Tapis",           slug: "tapis",          image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70" },
  { id: 3, name: "Coussins",        slug: "coussins",       image_url: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=200&q=70" },
  { id: 4, name: "Bruleurs Oud",    slug: "bruleurs-oud",   image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=70" },
  { id: 5, name: "Vases et Pots",   slug: "vases-et-pots",  image_url: "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=200&q=70" },
  { id: 6, name: "Plaques et Mirroirs", slug: "plaques-mirroirs", image_url: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=200&q=70" },
  { id: 7, name: "Lampes",          slug: "lampes",         image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=70" },
];

// ─────────────────────────────────────────────────────────────
export default function CategoryPage() {
  // Route : /categories/:categorySlug
  const { categorySlug } = useParams();

  // Sous-catégories (fetchées depuis Laravel ou demo)
  const [subcategories, setSubcategories] = useState(DEMO_SUBCATEGORIES);
  const [activeSubSlug, setActiveSubSlug] = useState(null);

  // Filtres locaux (passés à useProducts)
  const [filters, setFiltersState] = useState({});

  // ── Hook produits ──────────────────────────────────────────
  const {
    products,
    meta,
    loading,
    params,
    setFilters,
    setPage,
    resetFilters,
  } = useProducts({
    category: categorySlug,
    subcategory: activeSubSlug || undefined,
    per_page: 20,
  });

  // ── Récemment consultés ────────────────────────────────────
  const { products: recentProducts, loading: recentLoading } = useRecentlyViewed();

  // ── Charger les vraies sous-catégories depuis l'API ───────
  useEffect(() => {
    if (!categorySlug) return;
    getSubcategories(categorySlug)
      .then((res) => {
        if (res.data?.length) setSubcategories(res.data);
      })
      .catch(() => {
        // Garder les données demo si l'API échoue
      });
  }, [categorySlug]);

  // ── Changer sous-catégorie ────────────────────────────────
  const handleSubcategorySelect = (slug) => {
    const next = slug === activeSubSlug ? null : slug;
    setActiveSubSlug(next);
    setFilters({ subcategory: next || undefined, page: 1 });
  };

  // ── Changer un filtre ─────────────────────────────────────
  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFiltersState(updated);
    setFilters(updated);
  };

  // ── Reset tous les filtres ────────────────────────────────
  const handleReset = () => {
    setFiltersState({});
    setActiveSubSlug(null);
    resetFilters();
  };

  // Titre catégorie (à récupérer depuis API en prod)
  const categoryTitle = categorySlug
    ? categorySlug.replace(/-/g, " ").toUpperCase()
    : "CATÉGORIE";

  return (
    
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Breadcrumb ── */}
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: categoryTitle },
          ]}
        />

        {/* ── Titre catégorie ── */}
        <h1 className="text-left font-serif text-2xl md:text-4xl font-medium tracking-tight text-black mb-10">      
        {categoryTitle}
        </h1>

        {/* ── Sous-catégories (cercles) ── */}
        <div className="mb-10">
          <SubCategoryBar
            subcategories={subcategories}
            activeSlug={activeSubSlug}
            onSelect={handleSubcategorySelect}
          />
        </div>

        {/* ── Layout principal : sidebar + grille ── */}
        <div className="flex flex-col md:flex-row gap-10">

          {/* Sidebar filtres */}
          <div className="w-full md:w-52 flex-shrink-0">
            <FilterSidebar
              filters={{ ...filters, ...params }}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Grille produits */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              loading={loading}
              total={meta?.total || 0}
            />

            {/* Pagination */}
            {meta && (
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>

        {/* ── Récemment consulté ── */}
        <RecentlyViewed products={recentProducts} loading={recentLoading} />
      </div>

      {/* ── Newsletter ── */}
      <Newsletter />
    </main>
   
  );
}