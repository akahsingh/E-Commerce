import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-amazon">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 text-white">
        <div className="max-w-screen-amazon mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-0.5 mb-4">
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Shop</span>
                <span className="text-2xl font-black text-white">Hub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Your premier destination for quality products at unbeatable prices. Discover thousands of products across all categories.
              </p>
              <div className="flex gap-2 mt-5">
                {[{s:"f",n:"Facebook"},{s:"t",n:"Twitter"},{s:"in",n:"Instagram"},{s:"yt",n:"YouTube"}].map(({s,n}) => (
                  <div key={s} title={n} className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-xs font-bold text-gray-400">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2.5">
                {["About Us", "Careers", "Press", "Blog"].map(item => (
                  <li key={item}><span className="text-sm text-gray-400 hover:text-indigo-400 cursor-pointer transition-colors">{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Support</h3>
              <ul className="space-y-2.5">
                {["Help Center", "Returns", "Track Order", "Contact Us"].map(item => (
                  <li key={item}><span className="text-sm text-gray-400 hover:text-indigo-400 cursor-pointer transition-colors">{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Account</h3>
              <ul className="space-y-2.5">
                <li><Link to="/login" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Register</Link></li>
                <li><Link to="/orders" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">My Orders</Link></li>
                <li><Link to="/cart" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">My Cart</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-screen-amazon mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-500">&copy; 2026 ShopHub. All rights reserved.</p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(item => (
                <span key={item} className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
