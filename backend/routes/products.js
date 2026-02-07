import { Router } from "express";
import db from "../db/database.js";

const router = Router();

router.get("/", (req, res) => {
  const { search, category, min_price, max_price, sort, page = 1, limit = 12 } = req.query;
  const result = db.getAllProducts({ search, category, min_price, max_price, sort, page: Number(page), limit: Number(limit) });
  res.json(result);
});

router.get("/categories", (_req, res) => {
  res.json(db.getCategories());
});

router.get("/:id", (req, res) => {
  const product = db.getProductById(Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;
