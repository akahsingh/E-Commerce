import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, MapPin, Menu, X, Search, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");

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
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main Header Bar */}
      <nav className="bg-amazon text-white">
        <div className="max-w-screen-amazon mx-auto px-4 flex items-center h-[60px] gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 px-2 py-1 border border-transparent hover:border-white rounded">
            <span className="text-xl font-bold tracking-tight">Shop<span className="text-amazon-orange">Hub</span></span>
            <span className="text-[10px] text-gray-300 block leading-none">.in</span>
          </Link>

          {/* Deliver To */}
          <Link to="/products" className="hidden lg:flex items-end gap-1 px-2 py-1 border border-transparent hover:border-white rounded flex-shrink-0">
            <MapPin className="h-5 w-5 text-white mb-0.5" />
            <div>
              <span className="text-xs text-gray-300 block leading-none">Deliver to</span>
              <span className="text-sm font-bold leading-tight">India</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex h-[40px] min-w-0">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="hidden sm:block bg-gray-100 text-amazon-text text-xs px-2 rounded-l-md border-0 outline-none focus:ring-0 w-auto cursor-pointer"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 px-3 text-sm text-amazon-text outline-none border-0 sm:rounded-none rounded-l-md"
            />
            <button type="submit" className="bg-amazon-search-bg hover:bg-amazon-search-hover px-3 rounded-r-md transition-colors">
              <Search className="h-5 w-5 text-amazon-text" />
            </button>
          </form>

          {/* Account */}
          <div className="hidden md:flex items-center gap-1 sm:gap-3">
            {user ? (
              <div className="relative group">
                <div className="px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer">
                  <span className="text-xs text-gray-300 block leading-none">Hello, {user.name.split(" ")[0]}</span>
                  <span className="text-sm font-bold leading-tight flex items-center gap-0.5">
                    Account <ChevronDown className="h-3 w-3" />
                  </span>
                </div>
                <div className="absolute right-0 top-full mt-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/orders" className="block px-4 py-2 text-sm text-amazon-text hover:bg-gray-100">Your Orders</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-amazon-text hover:bg-gray-100">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-2 py-1 border border-transparent hover:border-white rounded">
                <span className="text-xs text-gray-300 block leading-none">Hello, sign in</span>
                <span className="text-sm font-bold leading-tight flex items-center gap-0.5">
                  Account <ChevronDown className="h-3 w-3" />
                </span>
              </Link>
            )}

            <Link to="/orders" className="px-2 py-1 border border-transparent hover:border-white rounded hidden lg:block">
              <span className="text-xs text-gray-300 block leading-none">Returns</span>
              <span className="text-sm font-bold leading-tight">& Orders</span>
            </Link>
          </div>

          {/* Cart */}
          <Link to={user ? "/cart" : "/login"} className="flex items-end gap-1 px-2 py-1 border border-transparent hover:border-white rounded flex-shrink-0">
            <div className="relative">
              <ShoppingCart className="h-8 w-8" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-amazon-cart-badge font-bold text-base leading-none">
                {cartCount || 0}
              </span>
            </div>
            <span className="text-sm font-bold hidden sm:block">Cart</span>
          </Link>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1.5 border border-transparent hover:border-white rounded">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Sub Navigation Bar */}
      <div className="bg-amazon-light text-white">
        <div className="max-w-screen-amazon mx-auto px-4 flex items-center h-[40px] gap-0.5 overflow-x-auto hide-scrollbar text-sm">
          <Link to="/products" className="flex items-center gap-1 px-2.5 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded whitespace-nowrap flex-shrink-0 font-bold">
            <Menu className="h-4 w-4" />
            All
          </Link>
          {["Mobiles", "Electronics", "Laptops", "Men's Clothing", "Women's Clothing", "Home & Kitchen", "Beauty", "Books", "Grocery", "Toys & Games"].map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="px-2.5 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded whitespace-nowrap flex-shrink-0"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-300 shadow-lg">
          <div className="p-4 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-amazon-light text-white rounded font-bold text-sm">
                  Hello, {user.name}
                </div>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-amazon-text hover:bg-gray-100 rounded">
                  Your Orders
                </Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-amazon-text hover:bg-gray-100 rounded">
                  Cart ({cartCount})
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-amazon-text hover:bg-gray-100 rounded">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-amazon-link hover:bg-blue-50 rounded">
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
