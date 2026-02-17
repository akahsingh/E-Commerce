import { Routes, Route, Navigate } from "react-router-dom";
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
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange"></div></div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-amazon-page font-amazon">
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
      <footer className="mt-8">
        <button onClick={() => window.scrollTo(0, 0)} className="w-full bg-amazon-mid text-white text-sm py-3 hover:bg-opacity-90 transition-colors">
          Back to top
        </button>
        <div className="bg-amazon-light text-white">
          <div className="max-w-screen-amazon mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="font-bold mb-3">Get to Know Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="hover:underline cursor-pointer">About ShopHub</span></li>
                <li><span className="hover:underline cursor-pointer">Careers</span></li>
                <li><span className="hover:underline cursor-pointer">Press Releases</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Connect with Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="hover:underline cursor-pointer">Facebook</span></li>
                <li><span className="hover:underline cursor-pointer">Twitter</span></li>
                <li><span className="hover:underline cursor-pointer">Instagram</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Make Money with Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="hover:underline cursor-pointer">Sell on ShopHub</span></li>
                <li><span className="hover:underline cursor-pointer">Become an Affiliate</span></li>
                <li><span className="hover:underline cursor-pointer">Advertise Products</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Let Us Help You</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="hover:underline cursor-pointer">Your Account</span></li>
                <li><span className="hover:underline cursor-pointer">Returns Centre</span></li>
                <li><span className="hover:underline cursor-pointer">Help</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-amazon text-gray-400 text-xs text-center py-4">
          &copy; 2026 ShopHub.in. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
