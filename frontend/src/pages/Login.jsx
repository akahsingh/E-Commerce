import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Gradient header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-8 pt-8 pb-14">
            <Link to="/" className="flex items-center gap-0.5 mb-6">
              <span className="text-2xl font-black text-white">Shop</span>
              <span className="text-2xl font-black text-indigo-200">Hub</span>
            </Link>
            <h1 className="text-3xl font-black text-white">Welcome back</h1>
            <p className="text-indigo-200 mt-1 text-sm">Sign in to continue shopping</p>
          </div>

          {/* Form card (overlaps header) */}
          <div className="px-8 pb-8 -mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white placeholder-gray-400 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white placeholder-gray-400 transition-all"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors mt-1"
                >
                  {loading ? "Signing in..." : <>Sign in <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>

              <p className="text-xs text-gray-400 mt-4 text-center">
                By continuing, you agree to ShopHub's Terms &amp; Privacy Policy.
              </p>
            </div>

            <p className="text-sm text-center text-gray-500 mt-5">
              New to ShopHub?{" "}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
