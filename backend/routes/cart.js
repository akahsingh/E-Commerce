import { Router } from "express";
import db from "../db/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);

router.get("/", (req, res) => {
  const items = db.getCartItems(req.user.id);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items, total: Math.round(total * 100) / 100 });
});

router.post("/", (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  const product = db.getProductById(product_id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.stock < quantity) return res.status(400).json({ error: "Not enough stock" });

  const existing = db.findCartItem(req.user.id, product_id);

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (product.stock < newQty) return res.status(400).json({ error: "Not enough stock" });
    db.updateCartItemQuantity(existing.id, newQty);
  } else {
    db.addCartItem(req.user.id, product_id, quantity);
  }

  res.json({ message: "Added to cart" });
});

router.put("/:id", (req, res) => {
  const { quantity } = req.body;
  const item = db.findCartItemById(Number(req.params.id), req.user.id);

  if (!item) return res.status(404).json({ error: "Cart item not found" });
  if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });
  if (quantity > item.stock) return res.status(400).json({ error: "Not enough stock" });

  db.updateCartItemQuantity(Number(req.params.id), quantity);
  res.json({ message: "Cart updated" });
});

router.delete("/:id", (req, res) => {
  const removed = db.removeCartItem(Number(req.params.id), req.user.id);
  if (!removed) return res.status(404).json({ error: "Cart item not found" });
  res.json({ message: "Removed from cart" });
});

router.delete("/", (req, res) => {
  db.clearCart(req.user.id);
  res.json({ message: "Cart cleared" });
});

export default router;
