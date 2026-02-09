import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Star, ArrowLeft, Package, Truck, Shield, MapPin } from "lucide-react";
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
    if (!/^\d{6}$/.test(pincode)) {
      setPinError("Enter a valid 6-digit PIN code");
      return;
    }
    fetch(`/api/delivery/estimate?pincode=${pincode}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setPinError(data.error);
        else setDelivery(data);
      })
      .catch(() => setPinError("Could not check delivery"));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <Link to="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <div>
      <Link to="/products" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div>
          <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating} rating)</span>
          </div>

          <p className="text-3xl font-bold text-gray-900 mt-6">{"\u20B9"}{product.price.toLocaleString("en-IN")}</p>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center gap-2">
            <Package className={`h-5 w-5 ${product.stock > 0 ? "text-green-500" : "text-red-500"}`} />
            <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  +
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2 flex-1">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          )}

          {/* Delivery Estimation */}
          <div className="mt-8 bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-indigo-600" />
              Check Delivery
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && checkDelivery()}
                placeholder="Enter PIN code"
                className="input-field flex-1 !py-2 text-sm"
              />
              <button onClick={checkDelivery} className="btn-secondary !py-2 text-sm">
                Check
              </button>
            </div>
            {pinError && <p className="text-sm text-red-500 mt-2">{pinError}</p>}
            {delivery && (
              <div className="mt-3 text-sm">
                <p className="text-green-600 font-medium">
                  <Truck className="h-4 w-4 inline mr-1" />
                  Delivery by {delivery.estimated_delivery} ({delivery.business_days})
                </p>
                <p className="text-gray-500 mt-1">{delivery.zone} &middot; Free Delivery</p>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Free delivery across India</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-500 w-1/3 capitalize">
                      {key.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
