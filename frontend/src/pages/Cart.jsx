import { Link } from "react-router-dom";
import { Plus, Minus, ShoppingCart, Trash2, ArrowRight, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, total, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 animate-pulse shadow-sm">
          <div className="h-8 bg-gray-100 rounded-full w-1/3 mb-6"></div>
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 py-5 border-b border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="h-10 w-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 mt-2 text-sm">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl mt-6 transition-colors text-sm">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-screen-amazon mx-auto px-4 py-5">
      <h1 className="text-2xl font-black text-gray-900 mb-5">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Cart Items */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
            <span className="text-sm font-semibold text-gray-500">Price</span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="flex gap-4 px-6 py-5 border-b border-gray-100 last:border-0">
              <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_id}`} className="text-sm font-medium text-gray-800 hover:text-indigo-600 line-clamp-2 transition-colors">
                  {item.name}
                </Link>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <Truck className="h-3 w-3" /> In Stock &middot; FREE Delivery
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-gray-900">{"\u20B9"}{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                <p className="text-xs text-gray-400 mt-0.5">{"\u20B9"}{item.price.toLocaleString("en-IN")} each</p>
              </div>
            </div>
          ))}

          <div className="px-6 py-4 text-right bg-gray-50">
            <p className="text-base text-gray-900">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
              <span className="font-black text-xl">{"\u20B9"}{total.toLocaleString("en-IN")}</span>
            </p>
          </div>
        </div>

        {/* Summary Box */}
        <div className="lg:w-[300px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-28">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-2.5 rounded-xl mb-4">
              <Truck className="h-4 w-4" /> Your order qualifies for FREE delivery
            </div>
            <p className="text-gray-900 text-base">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">{"\u20B9"}{total.toLocaleString("en-IN")}</p>
            <Link
              to="/checkout"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="w-full mt-3 flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
