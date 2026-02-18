import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Star, TrendingUp, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
const heroBanners = [
  {
    gradient: "from-indigo-900 via-indigo-800 to-violet-900",
    badge: "Limited Time",
    title: "Great Indian Festival",
    subtitle: "Up to 70% off on Electronics, Fashion & more",
    cta: "Shop Now",
    link: "/products?category=Electronics",
    accent: "bg-rose-500",
  },
  {
    gradient: "from-violet-900 via-purple-800 to-fuchsia-900",
    badge: "Fashion Week",
    title: "Style Redefined",
    subtitle: "Premium fashion starting from \u20B9299",
    cta: "Explore Fashion",
    link: "/products?category=Men's Clothing",
    accent: "bg-amber-400",
  },
  {
    gradient: "from-slate-900 via-indigo-900 to-blue-900",
    badge: "New Arrivals",
    title: "Latest Smartphones",
    subtitle: "Top brands, best prices, fast delivery",
    cta: "Browse Mobiles",
    link: "/products?category=Mobiles",
    accent: "bg-emerald-400",
  },
  {
    gradient: "from-rose-900 via-pink-900 to-purple-900",
    badge: "Beauty & Care",
    title: "Glow Up Season",
    subtitle: "Premium beauty products at amazing prices",
    cta: "Shop Beauty",
    link: "/products?category=Beauty",
    accent: "bg-yellow-400",
  },
];

const categoryCards = [
  { title: "Electronics", emoji: "⚡", sub: "Up to 60% off", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", link: "/products?category=Electronics", color: "from-blue-500 to-indigo-600" },
  { title: "Fashion", emoji: "👗", sub: "From \u20B9299", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&h=300&fit=crop", link: "/products?category=Men's Clothing", color: "from-pink-500 to-rose-600" },
  { title: "Home & Kitchen", emoji: "🏠", sub: "Min 40% off", image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=300&fit=crop", link: "/products?category=Home & Kitchen", color: "from-orange-500 to-amber-600" },
  { title: "Mobiles", emoji: "📱", sub: "Best Sellers", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", link: "/products?category=Mobiles", color: "from-violet-500 to-purple-600" },
  { title: "Beauty", emoji: "✨", sub: "Up to 50% off", image: "https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=400&h=300&fit=crop", link: "/products?category=Beauty", color: "from-rose-400 to-pink-600" },
  { title: "Books", emoji: "📚", sub: "Flat 30% off", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop", link: "/products?category=Books", color: "from-amber-500 to-orange-600" },
  { title: "Sports", emoji: "🏃", sub: "Get Fit Today", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop", link: "/products?category=Sports & Fitness", color: "from-emerald-500 to-teal-600" },
  { title: "Watches", emoji: "⌚", sub: "Luxury deals", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=300&fit=crop", link: "/products?category=Watches", color: "from-slate-600 to-gray-800" },
];

const trustFeatures = [
  { icon: Truck, title: "Free Delivery", sub: "On orders above \u20B9499", color: "text-indigo-600 bg-indigo-50" },
  { icon: ShieldCheck, title: "Secure Payments", sub: "100% secure checkout", color: "text-emerald-600 bg-emerald-50" },
  { icon: RotateCcw, title: "Easy Returns", sub: "7-day hassle-free returns", color: "text-violet-600 bg-violet-50" },
  { icon: Headphones, title: "24/7 Support", sub: "Dedicated customer care", color: "text-rose-600 bg-rose-50" },
];

function ProductScroller({ title, icon: Icon, products, seeAllLink, accentColor }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`h-5 w-5 ${accentColor || "text-indigo-600"}`} />}
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        {seeAllLink && (
          <Link to={seeAllLink} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-800">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="relative group px-5 pb-5">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:border-indigo-200"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div ref={ref} className="flex gap-4 overflow-x-auto hide-scrollbar">
          {products.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[160px] group/card">
              <Link to={`/products/${p.id}`} className="block">
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain group-hover/card:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div>
                {p.discount > 0 && (
                  <span className="inline-block bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-1">
                    -{p.discount}%
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-900">{"\u20B9"}{p.price.toLocaleString("en-IN")}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-snug">{p.name}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:border-indigo-200"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    fetch("/api/products?sort=price_asc&limit=20").then(r => r.json()).then(d => setDeals(d.products || [])).catch(() => {});
    fetch("/api/products?sort=rating&limit=20").then(r => r.json()).then(d => setTopRated(d.products || [])).catch(() => {});
    fetch("/api/products?limit=20").then(r => r.json()).then(d => setNewArrivals(d.products || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % heroBanners.length), 5000);
    return () => clearInterval(t);
  }, []);

  const banner = heroBanners[bannerIdx];

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-br ${banner.gradient} overflow-hidden transition-all duration-700`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute right-40 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute left-1/3 top-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-screen-amazon mx-auto px-6 py-14 sm:py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <span className={`inline-block ${banner.accent} text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider`}>
              {banner.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              {banner.title}
            </h1>
            <p className="text-indigo-200 text-lg mt-4 mb-8 leading-relaxed">{banner.subtitle}</p>
            <Link
              to={banner.link}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
            >
              {banner.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Left / Right arrows */}
        <button
          onClick={() => setBannerIdx(i => (i - 1 + heroBanners.length) % heroBanners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2.5 rounded-full transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setBannerIdx(i => (i + 1) % heroBanners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2.5 rounded-full transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`rounded-full transition-all ${i === bannerIdx ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2"}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Features */}
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {trustFeatures.map(({ icon: Icon, title, sub, color }) => (
            <div key={title} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 leading-snug">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-screen-amazon mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-800">
            All categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categoryCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`h-24 bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <span className="text-4xl">{card.emoji}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900 leading-snug">{card.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <div className="max-w-screen-amazon mx-auto px-4 space-y-5 pb-8">
        {deals.length > 0 && (
          <ProductScroller
            title="Today's Deals"
            icon={Zap}
            products={deals}
            seeAllLink="/products?sort=price_asc"
            accentColor="text-rose-500"
          />
        )}
        {topRated.length > 0 && (
          <ProductScroller
            title="Top Rated"
            icon={Star}
            products={topRated}
            seeAllLink="/products?sort=rating"
            accentColor="text-amber-500"
          />
        )}
        {newArrivals.length > 0 && (
          <ProductScroller
            title="New Arrivals"
            icon={TrendingUp}
            products={newArrivals}
            seeAllLink="/products"
            accentColor="text-indigo-600"
          />
        )}
      </div>

      {/* CTA Banner */}
      <div className="max-w-screen-amazon mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-2">Members get more</p>
            <h3 className="text-2xl md:text-3xl font-black text-white">Sign in for exclusive deals</h3>
            <p className="text-indigo-200 mt-1">Unlock personalized offers and faster checkout.</p>
          </div>
          <Link
            to="/login"
            className="flex-shrink-0 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg text-sm whitespace-nowrap"
          >
            Sign in to ShopHub
          </Link>
        </div>
      </div>
    </div>
  );
}
