import { useEffect } from 'react'
import Breadcrumb      from '../components/ui/Breadcrumb'
import ProductGrid     from '../components/subcategory/ProductGrid'
import Pagination      from '../components/ui/Pagination'
import RecentlyViewed  from '../components/subcategory/RecentlyViewed'
import Newsletter      from '../components/home/Newsletter'
import useProducts     from '../hooks/useProducts'
import useRecentlyViewed from '../hooks/useRecentlyViewed'

export default function AllProductsPage() {
  const { products, meta, loading, setPage } = useProducts({ per_page: 40 })

  const { products: recentProducts, loading: recentLoading } = useRecentlyViewed()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [meta?.current_page])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <Breadcrumb items={[
          { label: 'Accueil', href: '/' },
          { label: 'Tous les produits' },
        ]} />

        <h1 className="text-left font-serif text-2xl md:text-4xl font-medium tracking-tight text-black mb-2">
          Notre Catalogue
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Découvrez l'ensemble de nos créations artisanales.
        </p>

        <div className="w-full">
          <ProductGrid 
            products={products} 
            loading={loading} 
            total={meta?.total || 0} 
          />
          
          {/* Pagination globale */}
          {meta && meta.last_page > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>

        {/* Sections du bas de page */}
        <div className="mt-20">
          <RecentlyViewed products={recentProducts} loading={recentLoading} />
        </div>
      </div>
      
      <Newsletter />
    </main>
  )
}