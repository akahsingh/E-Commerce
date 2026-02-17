import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function HorizontalScroller({ title, seeAllLink, children }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };
  return (
    <div className="bg-white p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-amazon-text">{title}</h2>
        {seeAllLink && <Link to={seeAllLink} className="text-sm amazon-link">See all deals</Link>}
      </div>
      <div className="relative group">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-300 rounded-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div ref={ref} className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {children}
        </div>
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-300 rounded-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function DealCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="flex-shrink-0 w-[180px] group">
      <div className="aspect-square bg-white overflow-hidden flex items-center justify-center p-2">
        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
      </div>
      <div className="mt-2">
        {product.discount > 0 && (
          <span className="inline-block bg-amazon-price-red text-white text-xs font-bold px-2 py-0.5 rounded-sm">{product.discount}% off</span>
        )}
        <p className="text-sm mt-1 font-medium">{"\u20B9"}{product.price.toLocaleString("en-IN")}</p>
        <p className="text-xs text-amazon-text-secondary line-clamp-2 mt-0.5">{product.name}</p>
      </div>
    </Link>
  );
}

function CategoryCard({ title, image, link, subtitle }) {
  return (
    <Link to={link} className="bg-white p-5 block hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-amazon-text mb-3">{title}</h3>
      <div className="aspect-[4/3] overflow-hidden bg-white flex items-center justify-center mb-3 p-2">
        <img src={image} alt={title} className="max-w-full max-h-full object-contain" loading="lazy" />
      </div>
      <span className="text-sm amazon-link">{subtitle || "See more"}</span>
    </Link>
  );
}

const heroBanners = [
  { bg: "from-blue-900 to-blue-700", title: "Great Indian Festival", subtitle: "Up to 70% off on Electronics", link: "/products?category=Electronics" },
  { bg: "from-orange-800 to-yellow-700", title: "Fashion Sale", subtitle: "Starting from \u20B9299", link: "/products?category=Men's Clothing" },
  { bg: "from-green-900 to-green-700", title: "Home & Kitchen", subtitle: "Appliances from top brands", link: "/products?category=Home & Kitchen" },
  { bg: "from-purple-900 to-indigo-700", title: "Smartphones", subtitle: "Latest launches from top brands", link: "/products?category=Mobiles" },
];

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    fetch("/api/products?sort=price_asc&limit=20").then(r => r.json()).then(d => setDeals(d.products)).catch(() => {});
    fetch("/api/products?sort=rating&limit=20").then(r => r.json()).then(d => setTopRated(d.products)).catch(() => {});
    fetch("/api/products?limit=20").then(r => r.json()).then(d => setNewArrivals(d.products)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % heroBanners.length), 5000);
    return () => clearInterval(t);
  }, []);

  const banner = heroBanners[bannerIdx];

  const categoryCards = [
    { title: "Up to 60% off | Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format", link: "/products?category=Electronics" },
    { title: "Starting \u20B9299 | Fashion", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&h=300&fit=crop&auto=format", link: "/products?category=Men's Clothing" },
    { title: "Min 40% off | Home & Kitchen", image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=300&fit=crop&auto=format", link: "/products?category=Home & Kitchen" },
    { title: "Best Sellers | Mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&auto=format", link: "/products?category=Mobiles" },
    { title: "Up to 50% off | Beauty", image: "https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=400&h=300&fit=crop&auto=format", link: "/products?category=Beauty" },
    { title: "Deals on Books", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&auto=format", link: "/products?category=Books" },
    { title: "Sports & Fitness", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop&auto=format", link: "/products?category=Sports & Fitness" },
    { title: "Watches & Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=300&fit=crop&auto=format", link: "/products?category=Watches" },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative">
        <div className={`bg-gradient-to-r ${banner.bg} h-[200px] sm:h-[300px] md:h-[400px] flex items-center transition-all duration-500`}>
          <div className="max-w-screen-amazon mx-auto px-8 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{banner.title}</h1>
            <p className="text-lg sm:text-xl text-white/80 mt-2">{banner.subtitle}</p>
            <Link to={banner.link} className="inline-block mt-4 btn-primary">Shop now</Link>
          </div>
        </div>
        <button onClick={() => setBannerIdx(i => (i - 1 + heroBanners.length) % heroBanners.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-sm shadow">
          <ChevronLeft className="h-6 w-6 text-amazon-text" />
        </button>
        <button onClick={() => setBannerIdx(i => (i + 1) % heroBanners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-sm shadow">
          <ChevronRight className="h-6 w-6 text-amazon-text" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amazon-page to-transparent"></div>
      </div>

      {/* Category Cards Grid */}
      <div className="max-w-screen-amazon mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map((card) => (
            <CategoryCard key={card.title} {...card} />
          ))}
        </div>
      </div>

      {/* Today's Deals */}
      {deals.length > 0 && (
        <div className="max-w-screen-amazon mx-auto px-4 mt-5">
          <HorizontalScroller title="Today's Deals" seeAllLink="/products?sort=price_asc">
            {deals.map((p) => <DealCard key={p.id} product={p} />)}
          </HorizontalScroller>
        </div>
      )}

      {/* Top Rated Products */}
      {topRated.length > 0 && (
        <div className="max-w-screen-amazon mx-auto px-4 mt-5">
          <HorizontalScroller title="Top Rated Products" seeAllLink="/products?sort=rating">
            {topRated.map((p) => <DealCard key={p.id} product={p} />)}
          </HorizontalScroller>
        </div>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div className="max-w-screen-amazon mx-auto px-4 mt-5">
          <HorizontalScroller title="New Arrivals" seeAllLink="/products">
            {newArrivals.map((p) => <DealCard key={p.id} product={p} />)}
          </HorizontalScroller>
        </div>
      )}

      {/* Sign-in strip */}
      <div className="max-w-screen-amazon mx-auto px-4 mt-5">
        <div className="bg-white p-5 text-center">
          <p className="text-sm text-amazon-text">Sign in for the best experience</p>
          <Link to="/login" className="btn-primary inline-block mt-2 !px-16">Sign in securely</Link>
        </div>
      </div>
    </div>
  );
}
