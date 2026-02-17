import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
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
          <h1 className="text-[28px] font-normal text-amazon-text mb-4">Create account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-amazon-text mb-1">Your name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="First and last name"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="At least 6 characters"
              />
              <p className="text-xs text-amazon-text-secondary mt-1">Passwords must be at least 6 characters.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-amazon-text mb-1">Re-enter password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-2">
              {loading ? "Creating account..." : "Create your ShopHub account"}
            </button>
          </form>

          <p className="text-xs text-amazon-text-secondary mt-4 leading-relaxed">
            By creating an account, you agree to ShopHub's Conditions of Use and Privacy Notice.
          </p>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-sm text-amazon-text">
              Already have an account? <Link to="/login" className="amazon-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
