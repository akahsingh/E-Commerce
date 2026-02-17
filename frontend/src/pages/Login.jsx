import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="w-full max-w-[350px]">
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold text-amazon-text">
            Shop<span className="text-amazon-orange">Hub</span><span className="text-xs">.in</span>
          </Link>
        </div>

        <div className="border border-gray-300 rounded-lg p-5 bg-white">
          <h1 className="text-[28px] font-normal text-amazon-text mb-4">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-amazon-text mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amazon-text mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-2">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-amazon-text-secondary mt-4 leading-relaxed">
            By continuing, you agree to ShopHub's Conditions of Use and Privacy Notice.
          </p>
        </div>

        <div className="relative mt-6 mb-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-xs text-amazon-text-secondary"><span className="bg-amazon-page px-2">New to ShopHub?</span></div>
        </div>

        <Link to="/register" className="btn-secondary w-full block text-center !py-2">
          Create your ShopHub account
        </Link>
      </div>
    </div>
  );
}
