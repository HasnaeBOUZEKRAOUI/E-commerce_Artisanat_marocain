import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { categoriesApi } from '../api/services'
import Breadcrumb from '../components/ui/Breadcrumb'
import SubCategoryBar from '../components/subcategory/SubCategoryBar'
import FilterSidebar from '../components/subcategory/FilterSidebar'
import ProductGrid from '../components/subcategory/ProductGrid'
import Pagination from '../components/ui/Pagination'
import RecentlyViewed from '../components/subcategory/RecentlyViewed'
import Newsletter from '../components/home/Newsletter'
import useProducts from '../hooks/useProducts'
import useRecentlyViewed from '../hooks/useRecentlyViewed'

export default function CategoryPage() {
  const { categorySlug } = useParams()

  const [subcategories, setSubcategories] = useState([])
  const [activeSubSlug, setActiveSubSlug] = useState(null)
  const [filters, setFiltersState] = useState({})

  const { products, meta, loading, params, setFilters, setPage, resetFilters } =
    useProducts({ category: categorySlug, per_page: 20 })

  const { products: recentProducts, loading: recentLoading } = useRecentlyViewed()

  useEffect(() => {
    if (!categorySlug) return
    categoriesApi.subcategories(categorySlug)
      .then((res) => {
        const data = res.data.data ?? res.data
        if (data?.length) setSubcategories(data)
      })
      .catch(() => {})
  }, [categorySlug])

  const handleSubcategorySelect = (slug) => {
    const next = slug === activeSubSlug ? null : slug
    setActiveSubSlug(next)
    setFilters({ category: next || categorySlug, page: 1 })
  }

  const handleFilterChange = (key, value) => {
    const updatedFiltersState = { ...filters, [key]: value }
    setFiltersState(updatedFiltersState)

    let apiKey = key
    if (key === 'prix_min') apiKey = 'min_price'
    if (key === 'prix_max') apiKey = 'max_price'

    const apiFilters = {}
    
    Object.keys(updatedFiltersState).forEach((k) => {
      const val = updatedFiltersState[k]
      if (val !== undefined && val !== '') {
        if (k === 'prix_min') apiFilters.min_price = val
        else if (k === 'prix_max') apiFilters.max_price = val
        else apiFilters[k] = val
      }
    })

    setFilters({
      category: activeSubSlug || categorySlug,
      ...apiFilters,
      page: 1
    })
  }

  const handleReset = () => {
    setFiltersState({})
    setActiveSubSlug(null)
    resetFilters()
  }

  const categoryTitle = categorySlug
    ? categorySlug.replace(/-/g, ' ').toUpperCase()
    : 'CATÉGORIE'

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <Breadcrumb items={[
          { label: 'Accueil', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: categoryTitle },
        ]} />

        <h1 className="text-left font-serif text-2xl md:text-4xl font-medium tracking-tight text-black mb-10">
          {categoryTitle}
        </h1>

        {subcategories.length > 0 && (
          <div className="mb-10">
            <SubCategoryBar
              subcategories={subcategories}
              activeSlug={activeSubSlug}
              onSelect={handleSubcategorySelect}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-52 flex-shrink-0">
            <FilterSidebar
              filters={{ ...filters, ...params }}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} total={meta?.total || 0} />
            {meta && (
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>

        <RecentlyViewed products={recentProducts} loading={recentLoading} />
      </div>
      <Newsletter />
    </main>
  )
}