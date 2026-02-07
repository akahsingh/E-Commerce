import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from "lucide-react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("/api/products?sort=rating&limit=4")
      .then((r) => r.json())
      .then((data) => setFeatured(data.products))
      .catch(() => {});
  }, []);

  return (
    <div className="-mt-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Shop the Best
            <span className="block mt-2 text-indigo-200">Products Online</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Discover thousands of premium products at unbeatable prices. Fast shipping, secure payments, and hassle-free returns.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="w-full sm:w-auto bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/register" className="w-full sm:w-auto border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors text-center">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            { icon: Shield, title: "Secure Shopping", desc: "100% protected payments" },
            { icon: CreditCard, title: "Easy Payments", desc: "Multiple payment methods" },
            { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer service" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Rated Products</h2>
              <p className="mt-2 text-gray-500">Handpicked favorites from our customers</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              View All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
