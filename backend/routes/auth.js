import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db/database.js";
import { generateToken, authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hash = bcrypt.hashSync(password, 10);
  const user = db.createUser(name, email, hash);
  const token = generateToken({ id: user.id, name: user.name, email: user.email });

  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken({ id: user.id, name: user.name, email: user.email });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

router.get("/me", authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email, created_at: user.created_at });
});

export default router;
