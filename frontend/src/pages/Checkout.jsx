import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Building2, Wallet, Truck, Lock, ArrowLeft, CheckCircle2, Banknote, Smartphone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function Checkout() {
  const { token } = useAuth();
  const { items, total, fetchCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  const grandTotal = total;

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Enter a valid 6-digit PIN code");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    setProcessing(true);

    try {
      // 1. Create payment intent
      const payRes = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error);

      // 2. Confirm payment
      const confirmRes = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ payment_id: payData.paymentId }),
      });
      if (!confirmRes.ok) throw new Error("Payment confirmation failed");

      // 3. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          payment_method: paymentMethod,
          payment_id: payData.paymentId,
          shipping_address: `${form.fullName}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}, Phone: ${form.phone}`,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      await fetchCart();
      setOrderPlaced(orderData);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  // Order success view
  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-3 text-gray-500">
          Your order <span className="font-semibold text-gray-700">#{orderPlaced.id}</span> has been placed successfully.
        </p>
        <p className="mt-1 text-gray-500">Total: <span className="font-semibold text-gray-700">{"\u20B9"}{orderPlaced.total.toLocaleString("en-IN")}</span></p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
              <Truck className="h-5 w-5 text-indigo-600" />
              Shipping Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required value={form.fullName} onChange={(e) => updateForm("fullName", e.target.value)} className="input-field" placeholder="Rahul Sharma" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input required value={form.address} onChange={(e) => updateForm("address", e.target.value)} className="input-field" placeholder="123, MG Road, Near City Mall" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="input-field" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select required value={form.state} onChange={(e) => updateForm("state", e.target.value)} className="input-field">
                  <option value="">Select State</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                <input
                  required
                  value={form.pincode}
                  onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="input-field"
                  placeholder="400001"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="input-field"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
              <Lock className="h-5 w-5 text-indigo-600" />
              Payment Method
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    required
                    value={form.upiId}
                    onChange={(e) => updateForm("upiId", e.target.value)}
                    className="input-field"
                    placeholder="yourname@upi"
                  />
                </div>
                <div className="bg-indigo-50 text-indigo-700 rounded-lg p-4 text-sm">
                  A payment request will be sent to your UPI app. Please approve it to complete the order.
                </div>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    required
                    value={form.cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      updateForm("cardNumber", v.replace(/(\d{4})(?=\d)/g, "$1 "));
                    }}
                    className="input-field"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      required
                      value={form.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                        updateForm("expiry", v);
                      }}
                      className="input-field"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      value={form.cvv}
                      onChange={(e) => updateForm("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="input-field"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-sm">
                You will be redirected to your bank's secure payment page to complete the transaction.
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="bg-amber-50 text-amber-700 rounded-lg p-4 text-sm">
                Pay with cash when your order is delivered. An additional {"\u20B9"}49 COD charge may apply for orders below {"\u20B9"}500.
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{"\u20B9"}{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{"\u20B9"}{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-gray-900 text-base">
                <span>Total</span>
                <span>{"\u20B9"}{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay {"\u20B9"}{grandTotal.toLocaleString("en-IN")}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Secured by SSL encryption
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
