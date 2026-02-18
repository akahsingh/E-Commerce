import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Package, Truck, Shield, MapPin, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState(null);
  const [pinError, setPinError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const checkDelivery = () => {
    setPinError("");
    setDelivery(null);
    if (!/^\d{6}$/.test(pincode)) { setPinError("Enter a valid 6-digit PIN code"); return; }
    fetch(`/api/delivery/estimate?pincode=${pincode}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) setPinError(data.error); else setDelivery(data); })
      .catch(() => setPinError("Could not check delivery"));
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success("Added to cart!");
  };

  if (loading) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 animate-pulse shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-100 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-100 rounded-full w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
              <div className="h-8 bg-gray-100 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl text-center py-20 px-4 shadow-sm">
          <div className="text-5xl mb-4">&#128269;</div>
          <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
          <Link to="/products" className="btn-primary mt-5 inline-block">Back to Products</Link>
        </div>
      </div>
    );
  }

  const stars = Math.floor(product.rating);
  const hasHalf = product.rating - stars >= 0.5;

  return (
    <div className="max-w-screen-amazon mx-auto px-4 py-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
        <Link to="/products" className="hover:text-indigo-600 transition-colors">All Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition-colors">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-700 line-clamp-1 max-w-xs">{product.name}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-7">
        <div className="grid md:grid-cols-5 gap-7">

          {/* Image */}
          <div className="md:col-span-2">
            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden sticky top-28 p-6">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">{product.category}</span>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < stars ? "fill-amber-400 text-amber-400" : i === stars && hasHalf ? "fill-amber-200 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            </div>

            <div className="h-px bg-gray-100"></div>

            <div>
              {product.discount > 0 && (
                <span className="inline-block bg-rose-50 text-rose-600 text-sm font-bold px-2.5 py-1 rounded-lg mb-1">
                  {product.discount}% OFF
                </span>
              )}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-gray-900">{"\u20B9"}{product.price.toLocaleString("en-IN")}</span>
                {product.mrp > product.price && (
                  <span className="text-sm text-gray-400 line-through">M.R.P. {"\u20B9"}{product.mrp.toLocaleString("en-IN")}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
            </div>

            <div className="h-px bg-gray-100"></div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Specifications</h3>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <div key={key} className={`flex text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <span className="px-4 py-2.5 text-gray-500 font-medium w-2/5 capitalize border-r border-gray-100">{key.replace(/_/g, " ")}</span>
                      <span className="px-4 py-2.5 text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-4 sticky top-28">
              <div>
                <p className="text-2xl font-black text-gray-900">{"\u20B9"}{product.price.toLocaleString("en-IN")}</p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> FREE Delivery across India
                </p>
              </div>

              {product.stock > 0 ? (
                <>
                  <p className="text-sm font-semibold text-emerald-600">In Stock</p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 font-medium flex-shrink-0">Qty:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="flex-1 border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleAddToCart} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                    Add to Cart
                  </button>
                  <button onClick={handleAddToCart} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                    Buy Now
                  </button>
                </>
              ) : (
                <p className="text-sm font-semibold text-rose-500">Currently unavailable</p>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-1.5 text-sm text-indigo-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Check delivery</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={(e) => e.key === "Enter" && checkDelivery()}
                    placeholder="PIN code"
                    className="flex-1 px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button onClick={checkDelivery} className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 px-2 flex-shrink-0">Check</button>
                </div>
                {pinError && <p className="text-xs text-rose-500 mt-1">{pinError}</p>}
                {delivery && (
                  <div className="mt-2 text-xs bg-emerald-50 rounded-xl p-2.5">
                    <p className="text-emerald-700 font-semibold">Delivery by {delivery.estimated_delivery}</p>
                    <p className="text-gray-500 mt-0.5">{delivery.zone} &middot; FREE</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                {[
                  { icon: Truck, text: "Free & fast delivery" },
                  { icon: Shield, text: "Secure transaction" },
                  { icon: Package, text: "Sold by ShopHub" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                    <Icon className="h-3.5 w-3.5 text-indigo-400" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
