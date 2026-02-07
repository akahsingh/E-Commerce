import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "data.json");

const products = [
  { name: "Wireless Bluetooth Headphones", description: "Premium noise-cancelling wireless headphones with 30-hour battery life, deep bass, and crystal-clear sound quality.", price: 79.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", category: "Electronics", stock: 50, rating: 4.5 },
  { name: "Smart Watch Pro", description: "Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water resistant to 50m.", price: 199.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", category: "Electronics", stock: 30, rating: 4.7 },
  { name: "Laptop Stand Aluminum", description: "Ergonomic aluminum laptop stand with adjustable height. Compatible with all laptops 10-17 inches.", price: 45.99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", category: "Electronics", stock: 100, rating: 4.3 },
  { name: "Mechanical Keyboard RGB", description: "Full-size mechanical keyboard with Cherry MX switches, per-key RGB lighting, and aircraft-grade aluminum frame.", price: 129.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500", category: "Electronics", stock: 40, rating: 4.6 },
  { name: "Running Shoes Ultra", description: "Lightweight performance running shoes with responsive cushioning and breathable mesh upper. Perfect for marathon training.", price: 134.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", category: "Clothing", stock: 60, rating: 4.4 },
  { name: "Denim Jacket Classic", description: "Timeless classic denim jacket made from premium cotton. Versatile style for any season.", price: 89.99, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500", category: "Clothing", stock: 35, rating: 4.2 },
  { name: "Leather Backpack", description: "Handcrafted genuine leather backpack with padded laptop compartment and multiple organizer pockets.", price: 159.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", category: "Accessories", stock: 25, rating: 4.8 },
  { name: "Sunglasses Polarized", description: "UV400 polarized sunglasses with lightweight titanium frame. Includes premium carrying case.", price: 59.99, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", category: "Accessories", stock: 80, rating: 4.1 },
  { name: "Yoga Mat Premium", description: "Extra thick 6mm eco-friendly yoga mat with alignment lines and non-slip surface. Includes carrying strap.", price: 39.99, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500", category: "Sports", stock: 70, rating: 4.5 },
  { name: "Water Bottle Insulated", description: "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold 24hrs or hot 12hrs. BPA-free.", price: 29.99, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", category: "Sports", stock: 120, rating: 4.3 },
  { name: "Wireless Mouse Ergonomic", description: "Ergonomic vertical wireless mouse with adjustable DPI, silent clicks, and rechargeable battery.", price: 34.99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", category: "Electronics", stock: 90, rating: 4.4 },
  { name: "Coffee Maker Programmable", description: "12-cup programmable coffee maker with built-in grinder, thermal carafe, and auto-brew timer.", price: 149.99, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500", category: "Home", stock: 20, rating: 4.6 },
  { name: "Plant Pot Ceramic Set", description: "Set of 3 minimalist ceramic plant pots with drainage holes and bamboo saucers. Modern matte finish.", price: 44.99, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500", category: "Home", stock: 55, rating: 4.2 },
  { name: "Desk Lamp LED", description: "Adjustable LED desk lamp with 5 color modes, 10 brightness levels, USB charging port, and memory function.", price: 54.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500", category: "Home", stock: 45, rating: 4.5 },
  { name: "Canvas Sneakers", description: "Classic canvas sneakers with vulcanized rubber sole. Available in multiple colors. Unisex sizing.", price: 49.99, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500", category: "Clothing", stock: 75, rating: 4.0 },
  { name: "Wireless Earbuds", description: "True wireless earbuds with active noise cancellation, transparency mode, and wireless charging case.", price: 109.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500", category: "Electronics", stock: 65, rating: 4.7 },
  { name: "Fitness Resistance Bands", description: "Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and carry bag.", price: 24.99, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500", category: "Sports", stock: 100, rating: 4.3 },
  { name: "Scented Candle Set", description: "Luxury soy wax candle set with 3 signature scents: lavender, vanilla, and sandalwood. 40hr burn time each.", price: 34.99, image: "https://images.unsplash.com/photo-1602607646949-82e869ffd4cf?w=500", category: "Home", stock: 40, rating: 4.6 },
  { name: "Crossbody Bag", description: "Compact crossbody bag with RFID-blocking pocket, adjustable strap, and water-resistant fabric.", price: 39.99, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500", category: "Accessories", stock: 50, rating: 4.1 },
  { name: "Portable Bluetooth Speaker", description: "Waterproof portable speaker with 360-degree sound, 20-hour battery, and built-in microphone for calls.", price: 69.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", category: "Electronics", stock: 55, rating: 4.5 },
];

let data;
if (existsSync(DB_PATH)) {
  data = JSON.parse(readFileSync(DB_PATH, "utf-8"));
} else {
  data = { users: [], products: [], cart_items: [], orders: [], order_items: [], _counters: { users: 0, products: 0, cart_items: 0, orders: 0, order_items: 0 } };
}

if (data.products.length === 0) {
  products.forEach((p) => {
    const id = ++data._counters.products;
    data.products.push({ id, ...p, created_at: new Date().toISOString() });
  });
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  console.log(`Seeded ${products.length} products`);
} else {
  console.log(`Database already has ${data.products.length} products`);
}
