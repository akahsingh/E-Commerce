import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Building2, Banknote, Smartphone, Truck, Lock, CheckCircle2 } from "lucide-react";
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
    fullName: "", address: "", city: "", state: "", pincode: "", phone: "",
    cardNumber: "", expiry: "", cvv: "", upiId: "",
  });

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.pincode)) { toast.error("Enter a valid 6-digit PIN code"); return; }
    if (!/^\d{10}$/.test(form.phone)) { toast.error("Enter a valid 10-digit phone number"); return; }

    setProcessing(true);
    try {
      const payRes = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: total }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error);

      const confirmRes = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ payment_id: payData.paymentId }),
      });
      if (!confirmRes.ok) throw new Error("Payment confirmation failed");

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

  if (items.length === 0 && !orderPlaced) { navigate("/cart"); return null; }

  if (orderPlaced) {
    return (
      <div className="max-w-screen-amazon mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white p-8 text-center border border-gray-200 rounded">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
          <h1 className="text-2xl font-bold text-amazon-text mt-4">Order Placed!</h1>
          <p className="mt-2 text-amazon-text-secondary">
            Order <span className="font-bold text-amazon-text">#{orderPlaced.id}</span> has been placed successfully.
          </p>
          <p className="mt-1 text-amazon-text-secondary">Total: <span className="font-bold text-amazon-text">{"\u20B9"}{orderPlaced.total.toLocaleString("en-IN")}</span></p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/orders" className="btn-primary !px-8">View Orders</Link>
            <Link to="/products" className="btn-secondary !px-8">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-amazon mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-amazon-text mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-4">
          {/* Shipping */}
          <div className="bg-white p-5 border border-gray-200 rounded">
            <h2 className="text-lg font-bold text-amazon-text flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-amazon-orange" /> Shipping Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-amazon-text mb-1">Full Name</label>
                <input required value={form.fullName} onChange={(e) => updateForm("fullName", e.target.value)} className="input-field" placeholder="Rahul Sharma" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-amazon-text mb-1">Address</label>
                <input required value={form.address} onChange={(e) => updateForm("address", e.target.value)} className="input-field" placeholder="123, MG Road, Near City Mall" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amazon-text mb-1">City</label>
                <input required value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="input-field" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amazon-text mb-1">State</label>
                <select required value={form.state} onChange={(e) => updateForm("state", e.target.value)} className="input-field">
                  <option value="">Select State</option>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-amazon-text mb-1">PIN Code</label>
                <input required value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} className="input-field" placeholder="400001" maxLength={6} />
              </div>
              <div>
                <label className="block text-sm font-bold text-amazon-text mb-1">Phone</label>
                <input required value={form.phone} onChange={(e) => updateForm("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className="input-field" placeholder="9876543210" maxLength={10} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white p-5 border border-gray-200 rounded">
            <h2 className="text-lg font-bold text-amazon-text flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-amazon-orange" /> Payment Method
            </h2>
            <div className="space-y-2 mb-4">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <label key={id} className={`flex items-center gap-3 p-3 border rounded cursor-pointer ${paymentMethod === id ? "border-amazon-orange bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-amazon-orange" />
                  <Icon className="h-5 w-5 text-amazon-text-secondary" />
                  <span className="text-sm font-medium text-amazon-text">{label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === "upi" && (
              <div>
                <label className="block text-sm font-bold text-amazon-text mb-1">UPI ID</label>
                <input required value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} className="input-field" placeholder="yourname@upi" />
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-amazon-text mb-1">Card Number</label>
                  <input required value={form.cardNumber} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 16); updateForm("cardNumber", v.replace(/(\d{4})(?=\d)/g, "$1 ")); }} className="input-field" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-amazon-text mb-1">Expiry</label>
                    <input required value={form.expiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2); updateForm("expiry", v); }} className="input-field" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amazon-text mb-1">CVV</label>
                    <input required type="password" maxLength={4} value={form.cvv} onChange={(e) => updateForm("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} className="input-field" placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <p className="text-sm text-amazon-text-secondary bg-blue-50 p-3 rounded">You will be redirected to your bank's secure page.</p>
            )}
            {paymentMethod === "cod" && (
              <p className="text-sm text-amazon-text-secondary bg-yellow-50 p-3 rounded">Pay with cash on delivery. {"\u20B9"}49 COD charge for orders below {"\u20B9"}500.</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[300px] flex-shrink-0">
          <div className="bg-white p-4 border border-gray-200 rounded sticky top-28">
            <button type="submit" disabled={processing} className="btn-primary w-full !py-2 mb-4">
              {processing ? "Processing..." : "Place your order"}
            </button>
            <p className="text-xs text-amazon-text-secondary mb-3">By placing your order, you agree to ShopHub's privacy notice and conditions of use.</p>
            <div className="border-t border-gray-200 pt-3">
              <h3 className="text-sm font-bold text-amazon-text mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amazon-text line-clamp-1">{item.name}</p>
                      <p className="text-xs text-amazon-text-secondary">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-medium">{"\u20B9"}{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>Items:</span><span>{"\u20B9"}{total.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span>Delivery:</span><span className="text-green-700">FREE</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2 text-amazon-price-red">
                  <span>Order Total:</span><span>{"\u20B9"}{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
