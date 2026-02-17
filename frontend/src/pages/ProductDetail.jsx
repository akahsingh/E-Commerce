import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Package, Truck, Shield, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";

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

  if (loading) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white p-6 animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white text-center py-20 px-4">
          <h2 className="text-xl font-bold text-amazon-text">Product Not Found</h2>
          <Link to="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
        </div>
      </div>
    );
  }

  const stars = Math.floor(product.rating);
  const hasHalf = product.rating - stars >= 0.5;

  return (
    <div className="max-w-screen-amazon mx-auto px-4 py-4">
      <div className="text-sm text-amazon-text-secondary mb-3">
        <Link to="/products" className="amazon-link">All Products</Link>
        <span className="mx-1">&rsaquo;</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="amazon-link">{product.category}</Link>
      </div>

      <div className="bg-white p-4 sm:p-6">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Image */}
          <div className="md:col-span-2">
            <div className="aspect-square bg-white flex items-center justify-center border border-gray-200 rounded overflow-hidden sticky top-28 p-4">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-xl font-medium text-amazon-text leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-amazon-link">{product.rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < stars ? "fill-amazon-star text-amazon-star" : i === stars && hasHalf ? "fill-amazon-star/50 text-amazon-star" : "text-gray-300"}`} />
                ))}
              </div>
            </div>

            <div className="border-b border-gray-200 my-3"></div>

            <div>
              {product.discount > 0 && <span className="text-amazon-price-red text-xl font-medium">-{product.discount}% </span>}
              <span className="text-[28px] font-medium text-amazon-text">{"\u20B9"}{product.price.toLocaleString("en-IN")}</span>
            </div>
            {product.mrp > product.price && (
              <p className="text-sm text-amazon-text-secondary mt-1">M.R.P.: <span className="line-through">{"\u20B9"}{product.mrp.toLocaleString("en-IN")}</span></p>
            )}
            <p className="text-xs text-amazon-text-secondary mt-0.5">Inclusive of all taxes</p>

            <div className="border-b border-gray-200 my-3"></div>

            <div>
              <h3 className="text-sm font-bold text-amazon-text mb-2">About this item</h3>
              <p className="text-sm text-amazon-text leading-relaxed">{product.description}</p>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-amazon-text mb-2">Product Details</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-3 py-2 font-medium text-amazon-text-secondary w-2/5 capitalize">{key.replace(/_/g, " ")}</td>
                        <td className="px-3 py-2 text-amazon-text">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div className="md:col-span-1">
            <div className="border border-gray-300 rounded-lg p-4 space-y-3 sticky top-28">
              <p className="text-[28px] font-medium text-amazon-text">{"\u20B9"}{product.price.toLocaleString("en-IN")}</p>
              <p className="text-xs text-amazon-text-secondary">FREE Delivery across India</p>

              {product.stock > 0 ? (
                <>
                  <p className="text-lg text-green-700 font-medium">In Stock</p>
                  <div>
                    <label className="text-sm text-amazon-text">Qty:</label>
                    <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100">
                      {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={() => addToCart(product.id, quantity)} className="btn-primary w-full !py-2">Add to Cart</button>
                  <button onClick={() => addToCart(product.id, quantity)} className="btn-orange w-full !py-2">Buy Now</button>
                </>
              ) : (
                <p className="text-lg text-red-600 font-medium">Currently unavailable</p>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <MapPin className="h-4 w-4 text-amazon-link" />
                  <span className="text-amazon-link">Deliver to</span>
                </div>
                <div className="flex gap-1">
                  <input type="text" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && checkDelivery()} placeholder="Enter PIN" className="input-field !py-1.5 text-xs flex-1" />
                  <button onClick={checkDelivery} className="text-xs text-amazon-link hover:text-amazon-link-hover px-2">Check</button>
                </div>
                {pinError && <p className="text-xs text-red-500 mt-1">{pinError}</p>}
                {delivery && (
                  <div className="mt-2 text-xs">
                    <p className="text-green-700 font-medium"><Truck className="h-3 w-3 inline mr-1" />Delivery by {delivery.estimated_delivery}</p>
                    <p className="text-amazon-text-secondary mt-0.5">{delivery.zone} &middot; FREE</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2 text-xs text-amazon-text-secondary">
                <div className="flex items-center gap-2"><Truck className="h-4 w-4" /><span>Free delivery</span></div>
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span>Secure transaction</span></div>
                <div className="flex items-center gap-2"><Package className="h-4 w-4" /><span>Sold by ShopHub</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
