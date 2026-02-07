import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "data.json");

function loadData() {
  if (existsSync(DB_PATH)) {
    return JSON.parse(readFileSync(DB_PATH, "utf-8"));
  }
  return { users: [], products: [], cart_items: [], orders: [], order_items: [], _counters: { users: 0, products: 0, cart_items: 0, orders: 0, order_items: 0 } };
}

function saveData(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

let data = loadData();

const db = {
  get data() {
    return data;
  },

  // Users
  findUserByEmail(email) {
    return data.users.find((u) => u.email === email) || null;
  },
  findUserById(id) {
    return data.users.find((u) => u.id === id) || null;
  },
  createUser(name, email, password) {
    const id = ++data._counters.users;
    const user = { id, name, email, password, created_at: new Date().toISOString() };
    data.users.push(user);
    saveData(data);
    return user;
  },

  // Products
  getAllProducts({ search, category, min_price, max_price, sort, page = 1, limit = 12 } = {}) {
    let results = [...data.products];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    if (category) results = results.filter((p) => p.category === category);
    if (min_price) results = results.filter((p) => p.price >= Number(min_price));
    if (max_price) results = results.filter((p) => p.price <= Number(max_price));

    if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
    else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
    else if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name));
    else results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = results.length;
    const offset = (page - 1) * limit;
    const paged = results.slice(offset, offset + limit);

    return { products: paged, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },
  getCategories() {
    return [...new Set(data.products.map((p) => p.category))].sort();
  },
  getProductById(id) {
    return data.products.find((p) => p.id === id) || null;
  },
  updateProductStock(id, change) {
    const product = data.products.find((p) => p.id === id);
    if (product) {
      product.stock += change;
      saveData(data);
    }
  },

  // Cart
  getCartItems(userId) {
    return data.cart_items
      .filter((ci) => ci.user_id === userId)
      .map((ci) => {
        const p = data.products.find((pr) => pr.id === ci.product_id);
        return p ? { id: ci.id, quantity: ci.quantity, product_id: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock } : null;
      })
      .filter(Boolean);
  },
  findCartItem(userId, productId) {
    return data.cart_items.find((ci) => ci.user_id === userId && ci.product_id === productId) || null;
  },
  findCartItemById(id, userId) {
    const ci = data.cart_items.find((c) => c.id === id && c.user_id === userId);
    if (!ci) return null;
    const p = data.products.find((pr) => pr.id === ci.product_id);
    return p ? { ...ci, stock: p.stock } : null;
  },
  addCartItem(userId, productId, quantity) {
    const id = ++data._counters.cart_items;
    data.cart_items.push({ id, user_id: userId, product_id: productId, quantity });
    saveData(data);
    return id;
  },
  updateCartItemQuantity(id, quantity) {
    const item = data.cart_items.find((c) => c.id === id);
    if (item) {
      item.quantity = quantity;
      saveData(data);
    }
  },
  removeCartItem(id, userId) {
    const idx = data.cart_items.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return false;
    data.cart_items.splice(idx, 1);
    saveData(data);
    return true;
  },
  clearCart(userId) {
    data.cart_items = data.cart_items.filter((c) => c.user_id !== userId);
    saveData(data);
  },

  // Orders
  getOrdersByUser(userId) {
    return data.orders
      .filter((o) => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((order) => ({
        ...order,
        items: data.order_items
          .filter((oi) => oi.order_id === order.id)
          .map((oi) => {
            const p = data.products.find((pr) => pr.id === oi.product_id);
            return { ...oi, name: p?.name || "Unknown", image: p?.image || "" };
          }),
      }));
  },
  getOrderById(id, userId) {
    const order = data.orders.find((o) => o.id === id && o.user_id === userId);
    if (!order) return null;
    const items = data.order_items
      .filter((oi) => oi.order_id === order.id)
      .map((oi) => {
        const p = data.products.find((pr) => pr.id === oi.product_id);
        return { ...oi, name: p?.name || "Unknown", image: p?.image || "" };
      });
    return { ...order, items };
  },
  createOrder(userId, total, paymentMethod, paymentId, shippingAddress, cartItems) {
    const orderId = ++data._counters.orders;
    const order = {
      id: orderId,
      user_id: userId,
      total: Math.round(total * 100) / 100,
      status: "confirmed",
      payment_method: paymentMethod || "card",
      payment_id: paymentId || "sim_" + Date.now(),
      shipping_address: shippingAddress,
      created_at: new Date().toISOString(),
    };
    data.orders.push(order);

    for (const item of cartItems) {
      const oiId = ++data._counters.order_items;
      data.order_items.push({ id: oiId, order_id: orderId, product_id: item.product_id, quantity: item.quantity, price: item.price });
      const product = data.products.find((p) => p.id === item.product_id);
      if (product) product.stock -= item.quantity;
    }

    data.cart_items = data.cart_items.filter((c) => c.user_id !== userId);
    saveData(data);
    return order;
  },
};

export default db;
