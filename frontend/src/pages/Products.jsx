import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";

const PRICE_RANGES = [
  { label: "Under \u20B91,000", min: "", max: "1000" },
  { label: "\u20B91,000 \u2013 \u20B95,000", min: "1000", max: "5000" },
  { label: "\u20B95,000 \u2013 \u20B910,000", min: "5000", max: "10000" },
  { label: "\u20B910,000 \u2013 \u20B925,000", min: "10000", max: "25000" },
  { label: "Over \u20B925,000", min: "25000", max: "" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    fetch("/api/products/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    params.set("page", page);

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(data.products); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, sort, minPrice, maxPrice, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p);
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const hasFilters = category || sort || minPrice || maxPrice;

  return (
    <div className="max-w-screen-amazon mx-auto px-4 py-5">

      {/* Header */}
      <div className="bg-white rounded-2xl px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {search ? (
              <span>Results for <span className="text-indigo-600">"{search}"</span></span>
            ) : category ? (
              category
            ) : (
              "All Products"
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total.toLocaleString("en-IN")} products found</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="text-sm text-gray-700 bg-gray-100 rounded-xl px-3 py-2 outline-none cursor-pointer border-0 font-medium"
            >
              <option value="">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 bg-indigo-50 text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl border border-indigo-100"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && <span className="bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{[category, minPrice || maxPrice, sort].filter(Boolean).length}</span>}
          </button>
        </div>
      </div>

      <div className="flex gap-5">

        {/* Sidebar Overlay (Mobile) */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setFiltersOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <FilterContent
                categories={categories}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                  hasFilters={hasFilters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                setFiltersOpen={setFiltersOpen}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
          </div>
        )}

        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Filters</h2>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-rose-500 font-semibold hover:text-rose-700">
                  Clear all
                </button>
              )}
            </div>
            <FilterContent
              categories={categories}
              category={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              hasFilters={hasFilters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              setFiltersOpen={setFiltersOpen}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-100"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
                    <div className="h-5 bg-gray-100 rounded-full w-1/3"></div>
                    <div className="h-9 bg-gray-100 rounded-xl w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl text-center py-20 px-4 shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-bold text-gray-800">No results found</p>
              <p className="text-gray-500 mt-1 text-sm">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="mt-5 btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
                      let pageNum;
                      if (pagination.pages <= 7) pageNum = i + 1;
                      else if (pagination.page <= 4) pageNum = i + 1;
                      else if (pagination.page >= pagination.pages - 3) pageNum = pagination.pages - 6 + i;
                      else pageNum = pagination.page - 3 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                            pagination.page === pageNum
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-white text-gray-600 border border-gray-100 hover:bg-indigo-50 hover:text-indigo-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterContent({ categories, category, minPrice, maxPrice, hasFilters, updateFilter, clearFilters, setFiltersOpen, searchParams, setSearchParams }) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => { updateFilter("category", ""); setFiltersOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              !category ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { updateFilter("category", cat); setFiltersOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                category === cat ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  if (range.min) params.set("min_price", range.min); else params.delete("min_price");
                  if (range.max) params.set("max_price", range.max); else params.delete("max_price");
                  params.delete("page");
                  setSearchParams(params);
                  setFiltersOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  isActive ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilter("min_price", e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-400 border-0"
            min="0"
          />
          <span className="text-gray-400 text-xs flex-shrink-0">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilter("max_price", e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-400 border-0"
            min="0"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={() => { clearFilters(); setFiltersOpen(false); }}
          className="w-full text-sm font-semibold text-rose-500 hover:text-rose-700 py-2 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
