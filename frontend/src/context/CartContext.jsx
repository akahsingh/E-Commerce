import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchCart = useCallback(async () => {
    if (!token) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return false;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers,
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Added to cart!");
      await fetchCart();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      await fetchCart();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await fetch(`/api/cart/${cartItemId}`, { method: "DELETE", headers });
      toast.success("Removed from cart");
      await fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await fetch("/api/cart", { method: "DELETE", headers });
      setItems([]);
      setTotal(0);
    } catch {
      // ignore
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, cartCount, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
