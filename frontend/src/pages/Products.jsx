import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";

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
    fetch("/api/products/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
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
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, sort, minPrice, maxPrice, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
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
    <div className="max-w-screen-amazon mx-auto px-4 py-4">
      {/* Results Header */}
      <div className="bg-white px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-amazon-text">
            {search ? `Results for "${search}"` : category || "All Products"}
          </h1>
          <p className="text-sm text-amazon-text-secondary">{pagination.total.toLocaleString("en-IN")} results</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-amazon-text-secondary">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="input-field !w-auto text-sm !py-1.5"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
            <option value="name">Name A-Z</option>
          </select>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary !py-1.5 flex items-center gap-2 text-sm lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent" : "hidden"} lg:block lg:w-56 flex-shrink-0`}>
          <div className={`${filtersOpen ? "fixed left-0 top-0 h-full w-72 bg-white p-4 shadow-xl overflow-y-auto" : ""} lg:relative lg:w-auto lg:p-0 lg:shadow-none`}>
            {filtersOpen && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
              </div>
            )}

            <div className="bg-white p-4 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-amazon-text mb-2">Category</h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => { updateFilter("category", ""); setFiltersOpen(false); }}
                      className={`text-sm w-full text-left py-0.5 ${!category ? "font-bold text-amazon-text" : "text-amazon-text-secondary hover:text-amazon-link"}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => { updateFilter("category", cat); setFiltersOpen(false); }}
                        className={`text-sm w-full text-left py-0.5 ${category === cat ? "font-bold text-amazon-text" : "text-amazon-text-secondary hover:text-amazon-link"}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-amazon-text mb-2">Price</h3>
                <div className="space-y-1">
                  {[
                    { label: "Under \u20B91,000", min: "", max: "1000" },
                    { label: "\u20B91,000 - \u20B95,000", min: "1000", max: "5000" },
                    { label: "\u20B95,000 - \u20B910,000", min: "5000", max: "10000" },
                    { label: "\u20B910,000 - \u20B925,000", min: "10000", max: "25000" },
                    { label: "Over \u20B925,000", min: "25000", max: "" },
                  ].map((range) => (
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
                      className={`text-sm w-full text-left py-0.5 ${
                        minPrice === range.min && maxPrice === range.max ? "font-bold text-amazon-text" : "text-amazon-text-secondary hover:text-amazon-link"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateFilter("min_price", e.target.value)} className="input-field text-xs !py-1 w-20" min="0" />
                  <span className="text-gray-400 text-xs">to</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateFilter("max_price", e.target.value)} className="input-field text-xs !py-1 w-20" min="0" />
                </div>
              </div>

              {hasFilters && (
                <button onClick={() => { clearFilters(); setFiltersOpen(false); }} className="text-sm text-amazon-link hover:text-amazon-link-hover">
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-gray-200">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white text-center py-16 px-4">
              <p className="text-lg text-amazon-text-secondary">No results found</p>
              <button onClick={clearFilters} className="mt-4 btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-gray-200">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6 mb-4">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-l-lg text-sm text-amazon-text bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
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
                        className={`px-4 py-2 border text-sm ${
                          pagination.page === pageNum ? "bg-amazon-yellow border-amazon-orange font-bold" : "bg-white border-gray-300 text-amazon-text hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-r-lg text-sm text-amazon-text bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
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
