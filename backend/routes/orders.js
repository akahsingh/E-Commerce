import { Router } from "express";
import db from "../db/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);

router.get("/", (req, res) => {
  res.json(db.getOrdersByUser(req.user.id));
});

router.get("/:id", (req, res) => {
  const order = db.getOrderById(Number(req.params.id), req.user.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

router.post("/", (req, res) => {
  const { payment_method, payment_id, shipping_address } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ error: "Shipping address is required" });
  }

  const cartItems = db.getCartItems(req.user.id);

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  for (const item of cartItems) {
    if (item.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for ${item.name}` });
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = db.createOrder(
    req.user.id,
    total,
    payment_method,
    payment_id,
    shipping_address,
    cartItems.map((ci) => ({ product_id: ci.product_id, quantity: ci.quantity, price: ci.price }))
  );

  res.status(201).json(order);
});

export default router;
