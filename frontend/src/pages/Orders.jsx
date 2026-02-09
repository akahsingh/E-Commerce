import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-600 bg-amber-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Confirmed" },
  shipped: { icon: Truck, color: "text-blue-600 bg-blue-50", label: "Shipped" },
  delivered: { icon: Package, color: "text-indigo-600 bg-indigo-50", label: "Delivered" },
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 mt-4">No orders yet</h2>
        <p className="text-gray-500 mt-2">Start shopping to see your orders here.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2 mt-6">
          <ShoppingBag className="h-5 w-5" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    {status.label}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900">{"\u20B9"}{order.total.toLocaleString("en-IN")}</span>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </button>

              {/* Order Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-6 py-5">
                  <div className="grid sm:grid-cols-2 gap-4 mb-5 text-sm">
                    <div>
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="ml-2 font-medium text-gray-900 uppercase">{order.payment_method}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Shipping Address:</span>
                      <span className="ml-2 font-medium text-gray-900">{order.shipping_address}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.product_id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} x {"\u20B9"}{item.price.toLocaleString("en-IN")}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {"\u20B9"}{(item.quantity * item.price).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
