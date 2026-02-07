import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);

// Simulated payment processing for development
// In production, integrate with Stripe, PayPal, or another payment provider
router.post("/create-payment-intent", (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valid amount is required" });
  }

  const paymentId = "pay_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  res.json({
    clientSecret: "secret_" + paymentId,
    paymentId,
    simulated: true,
  });
});

router.post("/confirm", (req, res) => {
  const { payment_id } = req.body;

  if (!payment_id) {
    return res.status(400).json({ error: "Payment ID is required" });
  }

  res.json({
    confirmed: true,
    payment_id,
    message: "Payment confirmed successfully",
  });
});

export default router;
