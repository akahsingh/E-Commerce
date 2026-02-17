import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-600 bg-amber-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Confirmed" },
  shipped: { icon: Truck, color: "text-blue-600 bg-blue-50", label: "Shipped" },
  delivered: { icon: Package, color: "text-green-700 bg-green-50", label: "Delivered" },
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-6">
        <div className="bg-white p-8 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto" />
          <h2 className="text-xl font-bold text-amazon-text mt-4">No orders yet</h2>
          <p className="text-amazon-text-secondary mt-2">Start shopping to see your orders here.</p>
          <Link to="/products" className="btn-primary inline-block mt-6">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-amazon mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-amazon-text mb-4">Your Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex flex-wrap gap-4 sm:gap-8">
                    <div>
                      <span className="text-xs text-amazon-text-secondary uppercase block">Order Placed</span>
                      <span className="text-amazon-text">{new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div>
                      <span className="text-xs text-amazon-text-secondary uppercase block">Total</span>
                      <span className="text-amazon-text font-bold">{"\u20B9"}{order.total.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-xs text-amazon-text-secondary uppercase block">Ship To</span>
                      <span className="text-amazon-link text-xs">{order.shipping_address?.split(",")[0]}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amazon-text-secondary block">Order # {order.id}</span>
                    <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="text-sm amazon-link flex items-center gap-0.5">
                      {isExpanded ? "Hide" : "Details"}
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status + Items */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium ${status.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    {status.label}
                  </div>
                  <span className="text-sm text-amazon-text-secondary uppercase">{order.payment_method}</span>
                </div>

                {/* Items preview (always show first 2) */}
                <div className="flex gap-3 overflow-x-auto">
                  {order.items.slice(0, isExpanded ? order.items.length : 3).map((item) => (
                    <Link key={item.id} to={`/products/${item.product_id}`} className="flex-shrink-0 flex items-center gap-3 group">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain border border-gray-200 rounded" />
                      {isExpanded && (
                        <div className="min-w-0">
                          <p className="text-sm text-amazon-link group-hover:text-amazon-link-hover line-clamp-1">{item.name}</p>
                          <p className="text-xs text-amazon-text-secondary">Qty: {item.quantity} x {"\u20B9"}{item.price.toLocaleString("en-IN")}</p>
                        </div>
                      )}
                    </Link>
                  ))}
                  {!isExpanded && order.items.length > 3 && (
                    <button onClick={() => setExpandedOrder(order.id)} className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded flex items-center justify-center text-sm text-amazon-link">
                      +{order.items.length - 3}
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-amazon-text-secondary">
                    <p><span className="font-medium">Shipping:</span> {order.shipping_address}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
