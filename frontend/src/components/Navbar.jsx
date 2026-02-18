import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, ChevronDown, LogOut, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NAV_CATEGORIES = [
  "Mobiles", "Electronics", "Laptops", "Men's Clothing", "Women's Clothing",
  "Home & Kitchen", "Beauty", "Books", "Grocery", "Toys & Games",
  "Sports & Fitness", "Watches", "Footwear",
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (searchCategory) params.set("category", searchCategory);
    navigate(`/products?${params}`);
    setSearchQuery("");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
    setAccountOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main Header */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-amazon mx-auto px-4 flex items-center h-16 gap-3 sm:gap-5">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-0.5">
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none">
              Shop
            </span>
            <span className="text-2xl font-black text-gray-900 leading-none">Hub</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center min-w-0">
            <div className="flex w-full items-center bg-gray-100 hover:bg-gray-200/70 rounded-2xl transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white focus-within:border focus-within:border-indigo-200">
              <Search className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2.5 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400"
              />
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="hidden sm:block text-xs text-gray-500 bg-transparent border-l border-gray-300 px-3 py-2.5 outline-none cursor-pointer max-w-[120px] truncate"
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-r-2xl transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-700 font-bold text-sm">{user.name[0].toUpperCase()}</span>
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="text-xs text-gray-500 block leading-none">Hello,</span>
                    <span className="text-sm font-semibold text-gray-900 leading-tight">{user.name.split(" ")[0]}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">
                      <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                        <p className="text-sm font-semibold text-indigo-900">{user.name}</p>
                        <p className="text-xs text-indigo-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="h-4 w-4 text-gray-400" />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm font-medium text-gray-700"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}

            <Link
              to={user ? "/cart" : "/login"}
              className="relative flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-semibold hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Cart + Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Link to={user ? "/cart" : "/login"} className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Category Pills Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-amazon mx-auto px-4 flex items-center h-10 gap-2 overflow-x-auto hide-scrollbar">
          <Link
            to="/products"
            className="flex-shrink-0 px-3.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full whitespace-nowrap"
          >
            All Products
          </Link>
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="flex-shrink-0 px-3.5 py-1 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors border border-transparent hover:border-indigo-200"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="p-4 border-b border-gray-100">
            <div className="flex items-center bg-gray-100 rounded-xl px-3 gap-2">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-2.5 bg-transparent text-sm outline-none"
              />
              <button type="submit" className="text-indigo-600 font-semibold text-xs">Go</button>
            </div>
          </form>

          <div className="p-4 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 bg-indigo-50 rounded-xl mb-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 font-bold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  <Package className="h-4 w-4 text-gray-400" /> My Orders
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  <ShoppingCart className="h-4 w-4 text-gray-400" /> Cart ({cartCount})
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl text-center mt-2"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
