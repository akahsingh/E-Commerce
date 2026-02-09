import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { generateAllProducts } from "./productGenerator.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "data.json");

// Generate 100K+ products in memory at startup
const allProducts = generateAllProducts();
const productById = new Map();
for (const p of allProducts) productById.set(p.id, p);
const allCategories = [...new Set(allProducts.map((p) => p.category))].sort();

function loadUserData() {
  if (existsSync(DB_PATH)) {
    return JSON.parse(readFileSync(DB_PATH, "utf-8"));
  }
  return { users: [], cart_items: [], orders: [], order_items: [], _counters: { users: 0, cart_items: 0, orders: 0, order_items: 0 } };
}

function saveUserData() {
  writeFileSync(DB_PATH, JSON.stringify(userData, null, 2));
}

let userData = loadUserData();

const db = {
  findUserByEmail(email) {
    return userData.users.find((u) => u.email === email) || null;
  },
  findUserById(id) {
    return userData.users.find((u) => u.id === id) || null;
  },
  createUser(name, email, password) {
    const id = ++userData._counters.users;
    const user = { id, name, email, password, created_at: new Date().toISOString() };
    userData.users.push(user);
    saveUserData();
    return user;
  },

  getAllProducts({ search, category, min_price, max_price, sort, page = 1, limit = 24 } = {}) {
    let results = allProducts;
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (category) results = results.filter((p) => p.category === category);
    if (min_price) results = results.filter((p) => p.price >= Number(min_price));
    if (max_price) results = results.filter((p) => p.price <= Number(max_price));

    if (sort) {
      results = [...results];
      if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
      else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
      else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
      else if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name));
    }

    const total = results.length;
    const offset = (page - 1) * limit;
    const paged = results.slice(offset, offset + limit);
    return { products: paged, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },
  getCategories() { return allCategories; },
  getProductById(id) { return productById.get(id) || null; },

  getCartItems(userId) {
    return userData.cart_items
      .filter((ci) => ci.user_id === userId)
      .map((ci) => {
        const p = productById.get(ci.product_id);
        return p ? { id: ci.id, quantity: ci.quantity, product_id: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock } : null;
      })
      .filter(Boolean);
  },
  findCartItem(userId, productId) {
    return userData.cart_items.find((ci) => ci.user_id === userId && ci.product_id === productId) || null;
  },
  findCartItemById(id, userId) {
    const ci = userData.cart_items.find((c) => c.id === id && c.user_id === userId);
    if (!ci) return null;
    const p = productById.get(ci.product_id);
    return p ? { ...ci, stock: p.stock } : null;
  },
  addCartItem(userId, productId, quantity) {
    const id = ++userData._counters.cart_items;
    userData.cart_items.push({ id, user_id: userId, product_id: productId, quantity });
    saveUserData();
    return id;
  },
  updateCartItemQuantity(id, quantity) {
    const item = userData.cart_items.find((c) => c.id === id);
    if (item) { item.quantity = quantity; saveUserData(); }
  },
  removeCartItem(id, userId) {
    const idx = userData.cart_items.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return false;
    userData.cart_items.splice(idx, 1);
    saveUserData();
    return true;
  },
  clearCart(userId) {
    userData.cart_items = userData.cart_items.filter((c) => c.user_id !== userId);
    saveUserData();
  },

  getOrdersByUser(userId) {
    return userData.orders
      .filter((o) => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((order) => ({
        ...order,
        items: userData.order_items.filter((oi) => oi.order_id === order.id).map((oi) => {
          const p = productById.get(oi.product_id);
          return { ...oi, name: p?.name || "Unknown", image: p?.image || "" };
        }),
      }));
  },
  getOrderById(id, userId) {
    const order = userData.orders.find((o) => o.id === id && o.user_id === userId);
    if (!order) return null;
    const items = userData.order_items.filter((oi) => oi.order_id === order.id).map((oi) => {
      const p = productById.get(oi.product_id);
      return { ...oi, name: p?.name || "Unknown", image: p?.image || "" };
    });
    return { ...order, items };
  },
  createOrder(userId, total, paymentMethod, paymentId, shippingAddress, cartItems) {
    const orderId = ++userData._counters.orders;
    const order = { id: orderId, user_id: userId, total: Math.round(total * 100) / 100, status: "confirmed", payment_method: paymentMethod || "card", payment_id: paymentId || "sim_" + Date.now(), shipping_address: shippingAddress, created_at: new Date().toISOString() };
    userData.orders.push(order);
    for (const item of cartItems) {
      const oiId = ++userData._counters.order_items;
      userData.order_items.push({ id: oiId, order_id: orderId, product_id: item.product_id, quantity: item.quantity, price: item.price });
    }
    userData.cart_items = userData.cart_items.filter((c) => c.user_id !== userId);
    saveUserData();
    return order;
  },
};

export default db;
