import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, total, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 py-4 border-b">
              <div className="w-24 h-24 bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white p-8 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto" />
          <h2 className="text-2xl font-bold text-amazon-text mt-4">Your ShopHub Cart is empty</h2>
          <p className="text-amazon-text-secondary mt-2">Your shopping cart is waiting. Give it purpose.</p>
          <Link to="/products" className="btn-primary inline-block mt-6">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-screen-amazon mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cart Items */}
        <div className="flex-1 bg-white p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-amazon-text pb-3 border-b border-gray-200">Shopping Cart</h1>
          <p className="text-sm text-amazon-text-secondary text-right pb-2 border-b border-gray-200">Price</p>

          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 border-b border-gray-200">
              <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-[120px] h-[120px] object-contain" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_id}`} className="text-sm text-amazon-text hover:text-amazon-link-hover line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-xs text-green-700 mt-1">In Stock</p>
                <p className="text-xs text-amazon-text-secondary mt-0.5">FREE Delivery</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-amazon-text hover:bg-gray-100 disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium bg-gray-50 border-x border-gray-300">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 text-amazon-text hover:bg-gray-100 disabled:opacity-30"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-sm text-amazon-link hover:text-amazon-link-hover">
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-amazon-text">{"\u20B9"}{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}

          <div className="text-right pt-3">
            <p className="text-lg text-amazon-text">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}): <span className="font-bold">{"\u20B9"}{total.toLocaleString("en-IN")}</span>
            </p>
          </div>
        </div>

        {/* Subtotal Box */}
        <div className="lg:w-[300px] flex-shrink-0">
          <div className="bg-white p-4 border border-gray-200 rounded">
            <p className="text-xs text-green-700 mb-2">Your order is eligible for FREE Delivery.</p>
            <p className="text-sm text-amazon-text">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}): <span className="font-bold text-lg">{"\u20B9"}{total.toLocaleString("en-IN")}</span>
            </p>
            <Link to="/checkout" className="btn-primary w-full mt-4 block text-center !py-2">
              Proceed to Buy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
