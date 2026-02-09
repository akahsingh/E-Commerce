// Deterministic product generator - creates 100,000+ unique products at startup
// Products live in memory only, user data (cart/orders) stored in JSON

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}

const images = {
  "Mobiles": ["photo-1511707171634-5f897ff02aa9", "photo-1598327105666-5b89351aff97", "photo-1592899677977-9c10ca588bbd", "photo-1610945265064-0e34e5519bbf", "photo-1695048133142-1a20484d2569", "photo-1544244015-0df4b3ffc6b0"],
  "Laptops": ["photo-1517336714731-489689fd1ca8", "photo-1496181133206-80ce9b88a853", "photo-1588872657578-7efd1f1555ed", "photo-1593642632559-0c6d3fc62b89", "photo-1603302576837-37561b2e2302", "photo-1625842268584-8f3296236761"],
  "Electronics": ["photo-1505740420928-5e560c06d30e", "photo-1590658268037-6bf12f032f55", "photo-1608043152269-423dbba4e7e1", "photo-1523275335684-37898b6baf30", "photo-1511467687858-23d96c32e4ae", "photo-1516035069371-29a1b244cc32", "photo-1593359677879-a4bb92f829d1", "photo-1578303512597-81e6cc155b3e"],
  "Men's Clothing": ["photo-1542272454315-4c01d7abdf4a", "photo-1596755094514-f87e34085b2c", "photo-1576995853123-5a10305d93c0", "photo-1521572163474-6864f9cf17ab", "photo-1618354691373-d851c5c3a990"],
  "Women's Clothing": ["photo-1572804013309-59a88b7e92f1", "photo-1576566588028-4147f3842f27", "photo-1506629082955-511b1aa562c8", "photo-1515886657613-9f3515b0c78f", "photo-1594938298603-c8148c4dae35"],
  "Men's Footwear": ["photo-1542291026-7eec264c27ff", "photo-1556906781-9a412961c28c", "photo-1525966222134-fcfa99b8ae77", "photo-1460353581641-37baddab0fa2"],
  "Women's Footwear": ["photo-1595950653106-6c9ebd614d3a", "photo-1543163521-1bf539c55dd2", "photo-1518894781321-630e0d5046be"],
  "Home & Kitchen": ["photo-1585659722983-3a675dabf23d", "photo-1517668808822-9ebb02f2a0e6", "photo-1594631252845-29fc4cc8cde9", "photo-1556909114-f6e7ad7d3136", "photo-1507473885765-e6ed057ab6fe", "photo-1631049307264-da0ec9d70304", "photo-1602607646949-82e869ffd4cf"],
  "Beauty": ["photo-1522338242992-e1a54571a9f7", "photo-1556228578-0d85b1a4d571", "photo-1620916566398-39f1143ab7be", "photo-1541643600914-78b084683601", "photo-1596462502278-27bfdc403348"],
  "Sports & Fitness": ["photo-1601925260368-ae2f83cf8b7f", "photo-1534438327276-14e5300c3a48", "photo-1575311373937-040b8e1fd5b6", "photo-1598289431512-b97b0917affc", "photo-1602143407151-7111542de6e8"],
  "Books": ["photo-1544947950-fa07a98d237f", "photo-1512820790803-83ca734da794", "photo-1543002588-bfa74002ed7e", "photo-1524578271613-d550eacf6090", "photo-1497633762265-9d179a990aa6"],
  "Grocery": ["photo-1556679343-c7306c1976bc", "photo-1599599810769-bcde5a160d32", "photo-1474979266404-7eaacbcd87c5", "photo-1549007994-cb92caebd54b"],
  "Toys & Games": ["photo-1587654780291-39c9404d7dd0", "photo-1632501641765-e568d28b0015", "photo-1507582020474-9a35b7d455d9", "photo-1494059980473-813e73ee784b"],
  "Bags & Luggage": ["photo-1553062407-98eeb64c6a62", "photo-1548036328-c9fa89d128fa", "photo-1622560480654-996b3a2549e1"],
  "Watches": ["photo-1524805444758-089113d48a6d", "photo-1533139502658-0198f920d8e8", "photo-1522312346375-d1a52e2b99b8"],
  "Furniture": ["photo-1555041469-a586c61ea9bc", "photo-1506439773649-6e0eb8cfb237", "photo-1580480055273-228ff5388ef8", "photo-1518455027359-f3f8164ba6bd"],
  "Baby & Kids": ["photo-1515488042361-ee00e0ddd4e4", "photo-1519689680058-324335c77eba", "photo-1596461404969-9ae70f2830c1"],
  "Health & Wellness": ["photo-1559591937-dbc8f4b7b8e3", "photo-1556228578-0d85b1a4d571", "photo-1587854692152-cbe660dbde88"],
  "Jewelry": ["photo-1599643478518-a784e5dc4c8f", "photo-1535632066927-ab7c9ab60908", "photo-1605100804763-247f67b3557e"],
  "Office": ["photo-1580480055273-228ff5388ef8", "photo-1518455027359-f3f8164ba6bd", "photo-1531346878377-a5be20888e57", "photo-1587826080692-f439cd0b70da"],
};

function getImage(category, index) {
  const pool = images[category] || images["Electronics"];
  return `https://images.unsplash.com/${pool[index % pool.length]}?w=500`;
}

const catalog = [
  // ── MOBILES ──
  {
    category: "Mobiles",
    brands: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Google", "Nothing", "Motorola", "Nokia", "iQOO", "Poco", "Redmi", "Infinix", "Tecno", "Lava", "Asus"],
    types: [
      { name: "5G Smartphone", adjectives: ["Pro", "Ultra", "Plus", "Max", "Lite", "Neo", "Prime", "SE", "Edge"], storages: ["64GB", "128GB", "256GB", "512GB"], colors: ["Midnight Black", "Arctic White", "Ocean Blue", "Lavender Purple", "Emerald Green", "Sunset Gold", "Pearl Pink", "Glacier Silver"], priceBase: 8999, priceMax: 149999 },
      { name: "4G Smartphone", adjectives: ["A", "C", "M", "Y", "Star", "Power"], storages: ["32GB", "64GB", "128GB"], colors: ["Black", "Blue", "Green", "White"], priceBase: 5999, priceMax: 24999 },
      { name: "Tablet", adjectives: ["Tab", "Pad", "View", "Canvas"], storages: ["64GB", "128GB", "256GB", "512GB", "1TB"], colors: ["Space Grey", "Silver", "Blue", "Starlight"], priceBase: 12999, priceMax: 89999 },
    ],
    specsFn: (rand, item) => ({
      "Display": pick(["6.1-inch AMOLED", "6.4-inch Super AMOLED", "6.5-inch IPS LCD", "6.67-inch AMOLED 120Hz", "6.7-inch LTPO OLED", "6.82-inch 2K AMOLED", "10.9-inch Liquid Retina", "11-inch AMOLED"], rand),
      "Processor": pick(["Snapdragon 8 Gen 3", "Snapdragon 7s Gen 2", "Dimensity 9200+", "Apple A17 Pro", "Exynos 2400", "Tensor G3", "Helio G99", "Snapdragon 695"], rand),
      "RAM": pick(["4GB", "6GB", "8GB", "12GB", "16GB"], rand),
      "Storage": item.storage,
      "Camera": pick(["50MP + 12MP + 8MP", "108MP + 8MP + 2MP", "200MP + 12MP + 10MP", "48MP + 8MP", "64MP + 8MP + 2MP + 2MP", "12MP + 12MP (Pro)"], rand),
      "Battery": pick(["4500mAh", "5000mAh", "5100mAh", "5400mAh", "4800mAh"], rand),
      "Charging": pick(["25W Fast Charging", "33W Fast Charging", "67W Turbo Charging", "100W SuperVOOC", "120W HyperCharge", "20W MagSafe"], rand),
      "OS": pick(["Android 14", "Android 13", "iOS 17", "iPadOS 17", "HyperOS", "OxygenOS 14", "FunTouch OS 14"], rand),
      "Network": pick(["5G", "4G LTE", "5G + Wi-Fi 6E"], rand),
      "Weight": pick(["172g", "189g", "196g", "221g", "233g", "462g"], rand),
      "Warranty": "1 Year Manufacturer Warranty",
    }),
  },
  // ── LAPTOPS ──
  {
    category: "Laptops",
    brands: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Samsung", "Microsoft", "Infinix", "Realme", "Zebronics"],
    types: [
      { name: "Gaming Laptop", adjectives: ["ROG Strix", "Predator", "Legion", "Omen", "Nitro", "TUF", "Victus", "Katana"], storages: ["512GB SSD", "1TB SSD", "2TB SSD"], colors: ["Eclipse Grey", "Phantom Black", "Nebula Red"], priceBase: 54999, priceMax: 249999 },
      { name: "Ultrabook", adjectives: ["Air", "XPS", "ThinkPad", "ZenBook", "Swift", "Galaxy Book", "Surface", "Yoga"], storages: ["256GB SSD", "512GB SSD", "1TB SSD"], colors: ["Silver", "Space Grey", "Midnight Blue", "Starlight"], priceBase: 34999, priceMax: 179999 },
      { name: "Business Laptop", adjectives: ["Latitude", "ProBook", "ThinkBook", "ExpertBook", "Vostro"], storages: ["256GB SSD", "512GB SSD"], colors: ["Black", "Silver", "Grey"], priceBase: 29999, priceMax: 119999 },
      { name: "Budget Laptop", adjectives: ["Aspire", "IdeaPad", "Pavilion", "VivoBook", "Inspiron"], storages: ["256GB SSD", "512GB SSD", "1TB HDD"], colors: ["Silver", "Black", "Blue"], priceBase: 19999, priceMax: 49999 },
    ],
    specsFn: (rand, item) => ({
      "Processor": pick(["Intel Core i3-1315U", "Intel Core i5-13500H", "Intel Core i7-13700H", "Intel Core i9-13980HX", "Apple M3", "Apple M3 Pro", "AMD Ryzen 5 7530U", "AMD Ryzen 7 7840HS", "AMD Ryzen 9 7945HX"], rand),
      "RAM": pick(["8GB DDR4", "8GB DDR5", "16GB DDR5", "32GB DDR5", "16GB Unified"], rand),
      "Storage": item.storage,
      "Display": pick(["14-inch FHD IPS", "15.6-inch FHD 144Hz", "15.6-inch 3.5K OLED", "16-inch QHD 240Hz", "13.3-inch Retina", "15.3-inch Liquid Retina"], rand),
      "Graphics": pick(["Intel Iris Xe", "NVIDIA RTX 4050", "NVIDIA RTX 4060", "NVIDIA RTX 4070", "NVIDIA RTX 4090", "Apple M3 10-core GPU", "AMD Radeon 780M"], rand),
      "OS": pick(["Windows 11 Home", "Windows 11 Pro", "macOS Sonoma", "Ubuntu 22.04", "ChromeOS"], rand),
      "Battery": pick(["42Wh (~6 hrs)", "54Wh (~8 hrs)", "72Wh (~12 hrs)", "90Wh (~18 hrs)"], rand),
      "Weight": pick(["1.24 kg", "1.51 kg", "1.76 kg", "2.06 kg", "2.4 kg"], rand),
      "Ports": pick(["2x USB-C, 1x USB-A, HDMI", "3x USB-C (Thunderbolt 4), MagSafe", "2x USB-A, 1x USB-C, HDMI, RJ45", "1x USB-C, 2x USB-A, HDMI, SD Card"], rand),
      "Warranty": "1 Year Onsite Warranty",
    }),
  },
  // ── ELECTRONICS ──
  {
    category: "Electronics",
    brands: ["Sony", "JBL", "Samsung", "LG", "boAt", "Noise", "Realme", "Apple", "Bose", "Sennheiser", "OnePlus", "Marshall", "Zebronics", "Portronics", "Logitech", "Canon", "Nikon"],
    types: [
      { name: "Wireless Headphones", adjectives: ["ANC", "Pro", "Bass", "Studio", "Sport", "Max", "Elite"], storages: [""], colors: ["Black", "White", "Blue", "Silver", "Red", "Olive Green"], priceBase: 799, priceMax: 34999 },
      { name: "TWS Earbuds", adjectives: ["Buds", "Airdopes", "FreeBuds", "Pods", "Buds Pro", "Airdots"], storages: [""], colors: ["Black", "White", "Navy Blue", "Mint Green", "Pearl White", "Lavender"], priceBase: 499, priceMax: 24999 },
      { name: "Bluetooth Speaker", adjectives: ["Charge", "Flip", "Go", "Xtreme", "Stone", "SoundLink", "Rocker"], storages: [""], colors: ["Black", "Blue", "Red", "Teal", "Camo", "Grey"], priceBase: 999, priceMax: 29999 },
      { name: "Smart TV", adjectives: ["Crystal UHD", "OLED", "QLED", "Neo QLED", "NanoCell", "Smart", "Fire TV"], storages: ["32-inch", "43-inch", "50-inch", "55-inch", "65-inch", "75-inch"], colors: ["Black"], priceBase: 11999, priceMax: 249999 },
      { name: "Smartwatch", adjectives: ["Watch", "Band", "GT", "Fit", "Active", "ColorFit"], storages: [""], colors: ["Black", "Silver", "Gold", "Blue", "Green", "Pink"], priceBase: 1299, priceMax: 44999 },
      { name: "Camera", adjectives: ["DSLR", "Mirrorless", "Action Cam", "Vlogging Kit"], storages: ["Body Only", "With 18-55mm Lens", "With 18-135mm Lens"], colors: ["Black", "Silver"], priceBase: 29999, priceMax: 299999 },
      { name: "Power Bank", adjectives: ["Turbo", "Rapid", "Slim", "Pro", "Lithium"], storages: ["10000mAh", "20000mAh", "26800mAh"], colors: ["Black", "White", "Blue"], priceBase: 599, priceMax: 3499 },
    ],
    specsFn: (rand, item) => ({
      "Type": item.type,
      "Connectivity": pick(["Bluetooth 5.3", "Bluetooth 5.2", "Wi-Fi + Bluetooth", "Bluetooth 5.0"], rand),
      "Battery Life": pick(["6 hours", "8 hours", "10 hours", "20 hours", "30 hours", "40 hours", "7 days"], rand),
      "Water Resistance": pick(["IPX4", "IPX5", "IP67", "IP68", "Not rated"], rand),
      "Weight": pick(["45g", "120g", "250g", "380g", "550g", "780g"], rand),
      "Warranty": "1 Year Manufacturer Warranty",
    }),
  },
  // ── MEN'S CLOTHING ──
  {
    category: "Men's Clothing",
    brands: ["Allen Solly", "Van Heusen", "Peter England", "Louis Philippe", "Arrow", "US Polo", "Jack & Jones", "H&M", "Zara", "Levi's", "Roadster", "Puma", "Nike", "Adidas", "Under Armour", "Raymond", "Park Avenue", "ColorPlus", "Indian Terrain", "Wrangler"],
    types: [
      { name: "Formal Shirt", adjectives: ["Slim Fit", "Regular Fit", "Classic Fit"], storages: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Light Blue", "Pink", "Lavender", "Sky Blue", "Cream", "Navy Stripe"], priceBase: 599, priceMax: 3999 },
      { name: "Casual T-Shirt", adjectives: ["Round Neck", "Polo", "V-Neck", "Henley", "Oversized"], storages: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "White", "Navy", "Olive", "Maroon", "Grey", "Teal", "Mustard", "Rust"], priceBase: 299, priceMax: 2499 },
      { name: "Jeans", adjectives: ["Slim Fit", "Straight Fit", "Skinny", "Relaxed Fit", "Bootcut", "Tapered"], storages: ["28", "30", "32", "34", "36", "38", "40"], colors: ["Dark Blue", "Light Blue", "Black", "Grey", "Indigo", "Stone Wash"], priceBase: 799, priceMax: 4999 },
      { name: "Formal Trousers", adjectives: ["Slim Fit", "Regular Fit", "Pleated", "Flat Front"], storages: ["28", "30", "32", "34", "36", "38"], colors: ["Black", "Navy", "Grey", "Khaki", "Brown", "Charcoal"], priceBase: 899, priceMax: 4499 },
      { name: "Jacket", adjectives: ["Bomber", "Denim", "Puffer", "Windcheater", "Blazer", "Leather"], storages: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Navy", "Olive", "Brown", "Tan", "Grey", "Maroon"], priceBase: 1299, priceMax: 14999 },
      { name: "Kurta", adjectives: ["Cotton", "Silk", "Linen", "Embroidered", "Printed", "Nehru Jacket Set"], storages: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Cream", "Blue", "Maroon", "Green", "Yellow", "Pink"], priceBase: 499, priceMax: 7999 },
    ],
    specsFn: (rand, item) => ({
      "Size": item.storage,
      "Material": pick(["100% Cotton", "Cotton Blend", "Polyester", "Linen", "Silk", "Denim", "Wool Blend", "Viscose Rayon"], rand),
      "Fit": item.adjective,
      "Pattern": pick(["Solid", "Striped", "Checked", "Printed", "Self Design", "Textured"], rand),
      "Sleeve": pick(["Full Sleeve", "Half Sleeve", "Sleeveless", "Roll-Up Sleeve"], rand),
      "Occasion": pick(["Formal", "Casual", "Party", "Sports", "Ethnic", "Everyday"], rand),
      "Care": "Machine Wash Cold",
      "Country of Origin": "India",
    }),
  },
  // ── WOMEN'S CLOTHING ──
  {
    category: "Women's Clothing",
    brands: ["Zara", "H&M", "ONLY", "Vero Moda", "W", "Biba", "Libas", "Aurelia", "FabIndia", "Global Desi", "AND", "Forever 21", "Marks & Spencer", "Allen Solly", "Van Heusen", "Anouk", "Jaipur Kurti"],
    types: [
      { name: "Kurti", adjectives: ["Straight", "Anarkali", "A-Line", "Flared", "Embroidered", "Printed"], storages: ["XS", "S", "M", "L", "XL", "XXL"], colors: ["Navy Blue", "Maroon", "Green", "Yellow", "Pink", "White", "Teal", "Coral", "Mustard"], priceBase: 399, priceMax: 4999 },
      { name: "Saree", adjectives: ["Silk", "Cotton", "Georgette", "Chiffon", "Banarasi", "Kanjivaram", "Printed"], storages: ["Free Size"], colors: ["Red", "Blue", "Green", "Pink", "Gold", "Purple", "Maroon", "Teal", "Orange"], priceBase: 499, priceMax: 49999 },
      { name: "Western Dress", adjectives: ["Maxi", "Midi", "Bodycon", "Shift", "Wrap", "Skater", "A-Line"], storages: ["XS", "S", "M", "L", "XL"], colors: ["Black", "Red", "Navy", "Floral Print", "White", "Blue", "Blush Pink"], priceBase: 699, priceMax: 5999 },
      { name: "Top", adjectives: ["Crop", "Peplum", "Blouson", "Off-Shoulder", "Ruffled", "Casual"], storages: ["XS", "S", "M", "L", "XL"], colors: ["White", "Black", "Pink", "Blue", "Yellow", "Green", "Lavender", "Coral"], priceBase: 299, priceMax: 2999 },
      { name: "Leggings", adjectives: ["Ankle Length", "Churidar", "Yoga", "Jeggings", "Palazzo"], storages: ["S", "M", "L", "XL", "XXL", "Free Size"], colors: ["Black", "Navy", "Maroon", "Grey", "Olive", "Skin"], priceBase: 199, priceMax: 1999 },
      { name: "Salwar Suit Set", adjectives: ["Cotton", "Georgette", "Silk", "Embroidered", "Printed", "Designer"], storages: ["S", "M", "L", "XL", "XXL"], colors: ["Blue", "Red", "Green", "Pink", "Yellow", "Purple", "Peach"], priceBase: 699, priceMax: 14999 },
    ],
    specsFn: (rand, item) => ({
      "Size": item.storage,
      "Material": pick(["Pure Cotton", "Rayon", "Georgette", "Silk", "Chiffon", "Crepe", "Linen", "Polyester"], rand),
      "Pattern": pick(["Solid", "Printed", "Embroidered", "Woven", "Bandhani", "Block Print", "Floral"], rand),
      "Occasion": pick(["Casual", "Party Wear", "Festive", "Office Wear", "Wedding", "Daily Wear"], rand),
      "Wash Care": "Hand Wash / Gentle Machine Wash",
      "Country of Origin": "India",
    }),
  },
  // ── MEN'S FOOTWEAR ──
  {
    category: "Men's Footwear",
    brands: ["Nike", "Adidas", "Puma", "Reebok", "Skechers", "Woodland", "Red Tape", "Bata", "Sparx", "Campus", "Asian", "Lotto", "New Balance", "ASICS", "Fila", "Crocs", "Liberty"],
    types: [
      { name: "Running Shoes", adjectives: ["Air Max", "Ultraboost", "RS-X", "Nano", "GEL", "Fresh Foam", "Revolution"], storages: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black/White", "Navy/Red", "Grey/Green", "All Black", "White/Blue", "Red/Black"], priceBase: 999, priceMax: 16999 },
      { name: "Casual Sneakers", adjectives: ["Classic", "Retro", "Canvas", "Suede", "Low Top", "High Top"], storages: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["White", "Black", "Navy", "Grey", "Tan", "Olive"], priceBase: 799, priceMax: 9999 },
      { name: "Formal Shoes", adjectives: ["Oxford", "Derby", "Brogue", "Monk Strap", "Loafer", "Slip-On"], storages: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Brown", "Tan", "Cherry", "Burgundy"], priceBase: 999, priceMax: 8999 },
      { name: "Sandals", adjectives: ["Sports", "Casual", "Floater", "Leather", "Flip Flop"], storages: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colors: ["Black", "Brown", "Navy", "Grey", "Olive"], priceBase: 299, priceMax: 3999 },
    ],
    specsFn: (rand, item) => ({
      "Size": item.storage,
      "Material": pick(["Mesh", "Synthetic Leather", "Genuine Leather", "Canvas", "Knit", "EVA + Rubber"], rand),
      "Sole": pick(["Rubber", "EVA", "Phylon", "TPR", "PU"], rand),
      "Closure": pick(["Lace-Up", "Slip-On", "Velcro", "Buckle"], rand),
      "Ideal For": "Men",
      "Country of Origin": pick(["India", "Vietnam", "China", "Indonesia"], rand),
    }),
  },
  // ── WOMEN'S FOOTWEAR ──
  {
    category: "Women's Footwear",
    brands: ["Nike", "Adidas", "Puma", "Bata", "Catwalk", "Metro", "Mochi", "Inc.5", "Aldo", "Steve Madden", "Crocs", "Skechers", "Woodland", "Clarks"],
    types: [
      { name: "Sneakers", adjectives: ["Running", "Classic", "Platform", "Canvas", "Chunky", "Slip-On"], storages: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["White", "Pink", "Black", "Lavender", "Mint", "Grey"], priceBase: 799, priceMax: 12999 },
      { name: "Heels", adjectives: ["Stiletto", "Block Heel", "Kitten Heel", "Platform", "Wedge"], storages: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Black", "Nude", "Red", "Gold", "Silver", "Pink"], priceBase: 599, priceMax: 8999 },
      { name: "Flats", adjectives: ["Ballet", "Mules", "Loafer", "Juttis", "Kolhapuri", "Mojari"], storages: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], colors: ["Black", "Tan", "Red", "Gold", "Multi", "Blue"], priceBase: 399, priceMax: 4999 },
    ],
    specsFn: (rand, item) => ({
      "Size": item.storage,
      "Material": pick(["Synthetic", "Genuine Leather", "Suede", "Canvas", "Satin", "PU"], rand),
      "Sole": pick(["Rubber", "TPR", "Resin", "PU"], rand),
      "Heel Height": pick(["Flat", "1 inch", "2 inch", "3 inch", "4 inch"], rand),
      "Ideal For": "Women",
    }),
  },
  // ── HOME & KITCHEN ──
  {
    category: "Home & Kitchen",
    brands: ["Prestige", "Pigeon", "Bajaj", "Philips", "Havells", "Crompton", "Butterfly", "Borosil", "Milton", "Cello", "Wipro", "Syska", "Morphy Richards", "Eureka Forbes", "Kent", "Dyson", "LG", "Samsung", "IFB", "Godrej"],
    types: [
      { name: "Mixer Grinder", adjectives: ["750W", "500W", "1000W", "Smart", "Pro", "Super"], storages: ["3 Jars", "4 Jars"], colors: ["Black", "White", "Red", "Grey", "Blue"], priceBase: 1499, priceMax: 8999 },
      { name: "Water Purifier", adjectives: ["RO+UV", "RO+UV+UF", "Gravity", "Smart", "Mineral"], storages: ["7L", "8L", "9L", "10L"], colors: ["White", "Blue", "Black"], priceBase: 4999, priceMax: 24999 },
      { name: "Air Conditioner", adjectives: ["Split", "Window", "Inverter", "5-Star", "3-Star"], storages: ["1 Ton", "1.5 Ton", "2 Ton"], colors: ["White"], priceBase: 24999, priceMax: 69999 },
      { name: "Refrigerator", adjectives: ["Single Door", "Double Door", "Side-by-Side", "Mini", "French Door"], storages: ["190L", "260L", "340L", "450L", "580L", "700L"], colors: ["Silver", "Blue", "Red", "Black", "White"], priceBase: 9999, priceMax: 89999 },
      { name: "Washing Machine", adjectives: ["Front Load", "Top Load", "Semi-Automatic", "Fully Automatic"], storages: ["6 kg", "6.5 kg", "7 kg", "8 kg", "9 kg", "10 kg"], colors: ["White", "Silver", "Grey"], priceBase: 7999, priceMax: 54999 },
      { name: "Bedsheet Set", adjectives: ["Cotton", "Satin", "Microfiber", "Silk", "Jaipuri", "King Size", "Double"], storages: ["Single", "Double", "King", "Queen"], colors: ["Floral", "Geometric", "Solid Blue", "Solid White", "Paisley", "Striped"], priceBase: 299, priceMax: 4999 },
      { name: "Cookware Set", adjectives: ["Non-Stick", "Stainless Steel", "Cast Iron", "Hard Anodized", "Granite"], storages: ["3-Piece", "5-Piece", "7-Piece", "12-Piece"], colors: ["Black", "Red", "Blue", "Silver"], priceBase: 999, priceMax: 12999 },
      { name: "LED Bulb Pack", adjectives: ["9W", "12W", "15W", "Smart", "Motion Sensor"], storages: ["Pack of 2", "Pack of 4", "Pack of 6", "Pack of 10"], colors: ["Cool White", "Warm White", "Daylight"], priceBase: 149, priceMax: 2999 },
    ],
    specsFn: (rand, item) => ({
      "Type": item.type,
      "Power": pick(["500W", "750W", "1000W", "1200W", "1400W", "1800W", "N/A"], rand),
      "Capacity": item.storage,
      "Energy Rating": pick(["3 Star", "4 Star", "5 Star", "BEE 5 Star"], rand),
      "Warranty": pick(["1 Year", "2 Years", "3 Years", "5 Years", "10 Years on Compressor"], rand),
      "Country of Origin": "India",
    }),
  },
  // ── BEAUTY ──
  {
    category: "Beauty",
    brands: ["Lakme", "Maybelline", "L'Oreal", "Nivea", "Biotique", "Mamaearth", "WOW", "The Body Shop", "Forest Essentials", "Plum", "Nykaa", "Sugar", "Faces Canada", "Cetaphil", "Neutrogena", "Himalaya", "Dove"],
    types: [
      { name: "Face Serum", adjectives: ["Vitamin C", "Hyaluronic Acid", "Niacinamide", "Retinol", "AHA BHA", "Anti-Aging"], storages: ["15ml", "30ml", "50ml"], colors: [""], priceBase: 199, priceMax: 2499 },
      { name: "Sunscreen", adjectives: ["SPF 30", "SPF 50", "SPF 50+", "Matte Finish", "Gel", "Cream"], storages: ["50ml", "80ml", "100ml", "120ml"], colors: [""], priceBase: 199, priceMax: 1499 },
      { name: "Lipstick", adjectives: ["Matte", "Glossy", "Liquid Matte", "Crayon", "Satin", "Bullet"], storages: [""], colors: ["Red", "Nude", "Pink", "Coral", "Berry", "Mauve", "Maroon", "Peach", "Brown", "Plum"], priceBase: 149, priceMax: 1999 },
      { name: "Hair Oil", adjectives: ["Coconut", "Argan", "Bhringraj", "Onion", "Castor", "Almond"], storages: ["100ml", "200ml", "300ml", "500ml"], colors: [""], priceBase: 149, priceMax: 999 },
      { name: "Shampoo", adjectives: ["Anti-Dandruff", "Keratin", "Volumizing", "Color Protect", "Sulphate Free", "Herbal"], storages: ["180ml", "340ml", "650ml", "1L"], colors: [""], priceBase: 149, priceMax: 999 },
      { name: "Perfume", adjectives: ["Eau de Parfum", "Eau de Toilette", "Body Spray", "Attar", "Mist"], storages: ["50ml", "100ml", "150ml", "200ml"], colors: [""], priceBase: 299, priceMax: 8999 },
    ],
    specsFn: (rand, item) => ({
      "Quantity": item.storage || pick(["15ml", "30ml", "50ml", "100ml", "200ml"], rand),
      "Skin/Hair Type": pick(["All Skin Types", "Oily Skin", "Dry Skin", "Combination", "Sensitive", "Normal", "All Hair Types"], rand),
      "Key Ingredients": pick(["Vitamin C, Vitamin E", "Hyaluronic Acid, Aloe Vera", "Niacinamide, Zinc", "Tea Tree, Salicylic Acid", "Argan Oil, Keratin", "Coconut, Bhringraj"], rand),
      "Paraben Free": pick(["Yes", "No"], rand),
      "Cruelty Free": "Yes",
      "Country of Origin": "India",
    }),
  },
  // ── SPORTS & FITNESS ──
  {
    category: "Sports & Fitness",
    brands: ["Decathlon", "Nivia", "Cosco", "Yonex", "Li-Ning", "Vector X", "Nike", "Adidas", "Puma", "Under Armour", "Fitbit", "Boldfit", "PowerMax", "Durafit"],
    types: [
      { name: "Cricket Bat", adjectives: ["English Willow", "Kashmir Willow", "Tennis Ball", "Junior", "Pro", "Tournament"], storages: ["Short Handle", "Full Size", "Size 5", "Size 6"], colors: ["Natural Wood", "Blue Grip", "Black Grip", "Red Grip"], priceBase: 499, priceMax: 24999 },
      { name: "Yoga Mat", adjectives: ["6mm", "8mm", "10mm", "Anti-Skid", "Premium", "Travel"], storages: [""], colors: ["Blue", "Purple", "Black", "Green", "Pink", "Grey"], priceBase: 249, priceMax: 2999 },
      { name: "Dumbbell Set", adjectives: ["PVC Coated", "Rubber Coated", "Chrome", "Adjustable", "Hex"], storages: ["1 kg pair", "2 kg pair", "3 kg pair", "5 kg pair", "10 kg pair", "15 kg pair", "20 kg pair"], colors: ["Black", "Grey", "Blue", "Red"], priceBase: 199, priceMax: 14999 },
      { name: "Resistance Band Set", adjectives: ["Latex", "Fabric", "Loop", "Tube", "Pull-Up Assist"], storages: ["Light", "Medium", "Heavy", "Set of 3", "Set of 5"], colors: ["Multi-Color", "Black", "Blue"], priceBase: 199, priceMax: 2999 },
      { name: "Treadmill", adjectives: ["Motorized", "Manual", "Foldable", "Commercial", "Walking Pad"], storages: ["2.5 HP", "3.5 HP", "4.5 HP", "6 HP"], colors: ["Black", "Black/Red", "Grey"], priceBase: 12999, priceMax: 89999 },
      { name: "Football", adjectives: ["Match Ball", "Training", "Street", "Futsal", "PU Leather"], storages: ["Size 3", "Size 4", "Size 5"], colors: ["White/Black", "Yellow/Blue", "Orange", "Multi"], priceBase: 299, priceMax: 4999 },
    ],
    specsFn: (rand, item) => ({
      "Material": pick(["PVC", "Rubber", "TPE", "Leather", "Synthetic", "Willow", "Nylon"], rand),
      "Ideal For": pick(["Men & Women", "Beginners", "Professional", "Home Gym", "Kids", "All Levels"], rand),
      "Weight": pick(["200g", "450g", "1 kg", "2 kg", "5 kg", "15 kg", "45 kg"], rand),
      "Warranty": pick(["6 Months", "1 Year", "2 Years"], rand),
      "Country of Origin": "India",
    }),
  },
  // ── BOOKS ──
  {
    category: "Books",
    brands: ["Penguin", "HarperCollins", "Rupa Publications", "Bloomsbury", "Westland", "Hachette", "Pan Macmillan", "S. Chand", "Arihant", "Drishti", "Lucent", "Pearson", "McGraw Hill", "Wiley"],
    types: [
      { name: "Self-Help Book", adjectives: ["Bestseller", "Award Winning", "New Release", "Classic"], storages: ["Paperback", "Hardcover", "Kindle Edition"], colors: [""], priceBase: 99, priceMax: 999 },
      { name: "Fiction Novel", adjectives: ["Thriller", "Romance", "Mystery", "Sci-Fi", "Fantasy", "Historical", "Literary"], storages: ["Paperback", "Hardcover"], colors: [""], priceBase: 149, priceMax: 1299 },
      { name: "Competitive Exam Book", adjectives: ["UPSC", "SSC", "Banking", "GATE", "CAT", "JEE", "NEET", "NDA"], storages: ["Paperback", "Previous Year Papers", "Practice Set"], colors: [""], priceBase: 99, priceMax: 1499 },
      { name: "Children's Book", adjectives: ["Picture Book", "Activity", "Story Collection", "Educational", "Comics", "Coloring"], storages: ["Paperback", "Hardcover", "Board Book"], colors: [""], priceBase: 99, priceMax: 799 },
      { name: "Business & Finance Book", adjectives: ["Investing", "Entrepreneurship", "Marketing", "Economics", "Personal Finance"], storages: ["Paperback", "Hardcover"], colors: [""], priceBase: 199, priceMax: 999 },
    ],
    specsFn: (rand, item) => ({
      "Format": item.storage,
      "Language": pick(["English", "Hindi", "English & Hindi", "Tamil", "Telugu", "Marathi"], rand),
      "Pages": pick(["120", "200", "280", "350", "420", "550", "680"], rand),
      "Publisher": item.brand,
      "Genre": item.adjective,
      "Country of Origin": "India",
    }),
  },
  // ── GROCERY ──
  {
    category: "Grocery",
    brands: ["Tata", "Aashirvaad", "Fortune", "Saffola", "MTR", "Haldiram's", "Dabur", "Patanjali", "Organic Tattva", "24 Mantra", "True Elements", "Vedaka", "Sunfeast", "Cadbury", "Amul", "Nestle"],
    types: [
      { name: "Cooking Oil", adjectives: ["Sunflower", "Mustard", "Groundnut", "Olive", "Coconut", "Rice Bran", "Kachi Ghani"], storages: ["1L", "2L", "5L", "15L"], colors: [""], priceBase: 99, priceMax: 2999 },
      { name: "Atta (Wheat Flour)", adjectives: ["Whole Wheat", "Multigrain", "Chakki Fresh", "Sharbati"], storages: ["1kg", "2kg", "5kg", "10kg"], colors: [""], priceBase: 49, priceMax: 699 },
      { name: "Rice", adjectives: ["Basmati", "Long Grain", "Sona Masoori", "Kolam", "Biryani Special", "Brown Rice"], storages: ["1kg", "5kg", "10kg", "25kg"], colors: [""], priceBase: 79, priceMax: 2499 },
      { name: "Tea", adjectives: ["CTC", "Green Tea", "Masala Chai", "Darjeeling", "Assam", "Herbal"], storages: ["100g", "250g", "500g", "1kg", "100 Tea Bags"], colors: [""], priceBase: 49, priceMax: 999 },
      { name: "Dry Fruits & Nuts", adjectives: ["Almonds", "Cashews", "Walnuts", "Pistachios", "Mixed Nuts", "Raisins", "Dates"], storages: ["200g", "500g", "1kg"], colors: [""], priceBase: 149, priceMax: 2499 },
      { name: "Chocolate", adjectives: ["Dairy Milk", "Dark", "Milk", "White", "Assorted", "Roasted Almond", "Fruit & Nut"], storages: ["50g", "150g", "300g", "Gift Pack"], colors: [""], priceBase: 49, priceMax: 1499 },
      { name: "Ghee", adjectives: ["Pure Cow", "Buffalo", "A2 Cow", "Organic", "Desi"], storages: ["200ml", "500ml", "1L", "2L"], colors: [""], priceBase: 149, priceMax: 2499 },
    ],
    specsFn: (rand, item) => ({
      "Quantity": item.storage,
      "Type": item.adjective,
      "Organic": pick(["Yes", "No"], rand),
      "Vegetarian": "Yes",
      "Shelf Life": pick(["3 Months", "6 Months", "9 Months", "12 Months", "18 Months"], rand),
      "FSSAI Licensed": "Yes",
      "Country of Origin": "India",
    }),
  },
  // ── TOYS & GAMES ──
  {
    category: "Toys & Games",
    brands: ["LEGO", "Funskool", "Mattel", "Hasbro", "Hot Wheels", "Nerf", "Fisher-Price", "Barbie", "Webby", "Toyshine", "Smartivity", "Skillmatics", "Ravensburger"],
    types: [
      { name: "Building Blocks Set", adjectives: ["Classic", "Technic", "City", "Creator", "Architecture", "Friends"], storages: ["100 pcs", "250 pcs", "500 pcs", "1000 pcs", "1500+ pcs"], colors: ["Multi-Color"], priceBase: 299, priceMax: 14999 },
      { name: "Board Game", adjectives: ["Strategy", "Family", "Party", "Trivia", "Classic", "Educational"], storages: [""], colors: [""], priceBase: 199, priceMax: 4999 },
      { name: "Remote Control Car", adjectives: ["Off-Road", "Racing", "Drift", "Monster Truck", "Stunt"], storages: [""], colors: ["Red", "Blue", "Black", "Yellow", "Green"], priceBase: 399, priceMax: 7999 },
      { name: "Educational Toy", adjectives: ["STEM", "Coding", "Science Kit", "Math Kit", "Solar Robot", "Magnetic Tiles"], storages: [""], colors: ["Multi-Color"], priceBase: 299, priceMax: 4999 },
      { name: "Action Figure", adjectives: ["Superhero", "Anime", "Cartoon", "Collectible", "Posable"], storages: [""], colors: ["Multi-Color"], priceBase: 199, priceMax: 6999 },
      { name: "Puzzle", adjectives: ["Jigsaw 500pc", "Jigsaw 1000pc", "3D Puzzle", "Wooden Puzzle", "Floor Puzzle"], storages: [""], colors: [""], priceBase: 199, priceMax: 2999 },
    ],
    specsFn: (rand, item) => ({
      "Age Group": pick(["3-5 Years", "5-8 Years", "8-12 Years", "12+ Years", "All Ages"], rand),
      "Material": pick(["ABS Plastic", "Wood", "Cardboard", "Metal + Plastic", "Non-Toxic Plastic"], rand),
      "Number of Players": pick(["1", "1-2", "2-4", "2-6", "1-4"], rand),
      "Battery Required": pick(["Yes (3xAA)", "Yes (Rechargeable)", "No"], rand),
      "Safety Certified": "BIS / EN 71 Certified",
      "Country of Origin": pick(["India", "China", "Denmark"], rand),
    }),
  },
  // ── BAGS & LUGGAGE ──
  {
    category: "Bags & Luggage",
    brands: ["American Tourister", "Skybags", "Safari", "Wildcraft", "VIP", "Samsonite", "Aristocrat", "Fastrack", "Lavie", "Baggit", "Caprese", "Hidesign", "Tommy Hilfiger", "Allen Solly"],
    types: [
      { name: "Backpack", adjectives: ["Laptop", "Travel", "College", "Hiking", "Anti-Theft", "Casual"], storages: ["25L", "30L", "35L", "40L", "50L"], colors: ["Black", "Navy", "Grey", "Blue", "Red", "Olive", "Camo"], priceBase: 499, priceMax: 7999 },
      { name: "Trolley Bag", adjectives: ["Cabin", "Medium", "Large", "Hard Shell", "Soft Shell", "Set of 3"], storages: ["55 cm", "65 cm", "75 cm", "Set"], colors: ["Black", "Blue", "Red", "Silver", "Purple"], priceBase: 1999, priceMax: 19999 },
      { name: "Handbag", adjectives: ["Tote", "Sling", "Crossbody", "Clutch", "Shoulder", "Bucket"], storages: [""], colors: ["Black", "Tan", "Red", "Navy", "Pink", "White", "Maroon"], priceBase: 399, priceMax: 9999 },
    ],
    specsFn: (rand, item) => ({
      "Capacity": item.storage || pick(["10L", "20L", "30L", "40L", "60L"], rand),
      "Material": pick(["Polyester", "Nylon", "Polycarbonate", "ABS", "Genuine Leather", "PU Leather", "Canvas"], rand),
      "Laptop Compartment": pick(["Yes (up to 15.6 inch)", "Yes (up to 17 inch)", "No"], rand),
      "Water Resistant": pick(["Yes", "No", "Water Repellent"], rand),
      "Warranty": pick(["1 Year", "3 Years", "5 Years", "International Warranty"], rand),
    }),
  },
  // ── WATCHES ──
  {
    category: "Watches",
    brands: ["Titan", "Fastrack", "Casio", "Fossil", "Sonata", "Timex", "Noise", "boAt", "Fire-Boltt", "Amazfit", "Samsung", "Apple", "Citizen", "Seiko", "HMT"],
    types: [
      { name: "Analog Watch", adjectives: ["Classic", "Formal", "Casual", "Chronograph", "Day-Date", "Slim"], storages: [""], colors: ["Black Dial", "Blue Dial", "White Dial", "Silver Dial", "Green Dial", "Rose Gold"], priceBase: 499, priceMax: 24999 },
      { name: "Smartwatch", adjectives: ["GPS", "AMOLED", "Fitness", "Calling", "Premium", "Ultra"], storages: [""], colors: ["Black", "Silver", "Gold", "Blue", "Green", "Pink"], priceBase: 999, priceMax: 44999 },
      { name: "Digital Watch", adjectives: ["Sports", "G-Shock", "Illuminator", "Retro", "Tough Solar"], storages: [""], colors: ["Black", "Army Green", "Navy", "Red", "Orange"], priceBase: 399, priceMax: 14999 },
    ],
    specsFn: (rand, item) => ({
      "Dial Shape": pick(["Round", "Square", "Rectangular", "Oval"], rand),
      "Strap Material": pick(["Stainless Steel", "Leather", "Silicone", "Nylon", "Metal Chain"], rand),
      "Water Resistance": pick(["30m", "50m", "100m", "200m", "5 ATM", "10 ATM"], rand),
      "Movement": pick(["Quartz", "Automatic", "Digital", "Smart"], rand),
      "Display": pick(["Analog", "Digital", "1.39-inch AMOLED", "1.85-inch TFT", "1.96-inch AMOLED"], rand),
      "Warranty": pick(["1 Year", "2 Years", "International Warranty"], rand),
    }),
  },
  // ── FURNITURE ──
  {
    category: "Furniture",
    brands: ["Wakefit", "SleepyCat", "Urban Ladder", "Nilkamal", "Godrej Interio", "Durian", "HomeTown", "Solimo", "IKEA", "Cellbell", "Green Soul", "Da URBAN", "Featherlite"],
    types: [
      { name: "Office Chair", adjectives: ["Ergonomic", "Gaming", "Executive", "Mesh Back", "High Back", "Mid Back"], storages: [""], colors: ["Black", "Grey", "Blue", "Red/Black", "White/Grey", "All Black"], priceBase: 2999, priceMax: 34999 },
      { name: "Study Table", adjectives: ["Computer Desk", "Standing Desk", "L-Shaped", "Folding", "Engineered Wood", "Solid Wood"], storages: [""], colors: ["Walnut", "White", "Wenge", "Oak", "Natural", "Brown"], priceBase: 1999, priceMax: 24999 },
      { name: "Mattress", adjectives: ["Memory Foam", "Orthopedic", "Latex", "Spring", "Dual Comfort", "Firm"], storages: ["Single", "Double", "Queen", "King"], colors: ["White", "Grey"], priceBase: 3999, priceMax: 29999 },
      { name: "Bookshelf", adjectives: ["Wall Mounted", "Open", "Ladder", "Corner", "With Doors", "Modular"], storages: [""], colors: ["Brown", "White", "Walnut", "Wenge", "Natural Wood"], priceBase: 1499, priceMax: 14999 },
      { name: "Sofa", adjectives: ["3-Seater", "2-Seater", "L-Shape", "Recliner", "Futon", "Sofa Cum Bed"], storages: [""], colors: ["Grey", "Blue", "Brown", "Beige", "Green", "Maroon"], priceBase: 8999, priceMax: 79999 },
    ],
    specsFn: (rand, item) => ({
      "Material": pick(["Engineered Wood", "Solid Sheesham", "Metal + Wood", "Fabric + Wood", "Leatherette", "Memory Foam", "HR Foam"], rand),
      "Assembly": pick(["DIY (Tools Included)", "Professional Assembly Included", "No Assembly Required"], rand),
      "Load Capacity": pick(["100 kg", "120 kg", "150 kg", "200 kg", "250 kg"], rand),
      "Warranty": pick(["1 Year", "3 Years", "5 Years", "10 Years"], rand),
      "Country of Origin": "India",
    }),
  },
  // ── BABY & KIDS ──
  {
    category: "Baby & Kids",
    brands: ["Johnson's", "Pampers", "Huggies", "MamyPoko", "Himalaya", "Chicco", "Fisher-Price", "LuvLap", "R for Rabbit", "Babyhug", "Mothercare", "Carter's", "Mee Mee"],
    types: [
      { name: "Diapers", adjectives: ["Pant Style", "Taped", "Premium", "Night", "Swim"], storages: ["NB", "S (4-8 kg)", "M (7-12 kg)", "L (9-14 kg)", "XL (12-17 kg)", "XXL (15-25 kg)"], colors: [""], priceBase: 199, priceMax: 2499 },
      { name: "Baby Clothing Set", adjectives: ["Romper", "Onesie Set", "Pajama Set", "Frock", "Ethnic Wear", "Winter Wear"], storages: ["0-3M", "3-6M", "6-12M", "1-2Y", "2-3Y", "3-4Y", "4-5Y"], colors: ["Pink", "Blue", "White", "Yellow", "Green", "Multi"], priceBase: 199, priceMax: 2999 },
      { name: "Stroller", adjectives: ["Lightweight", "Pram", "Jogger", "Travel System", "Twin", "Foldable"], storages: [""], colors: ["Black", "Grey", "Red", "Navy", "Green"], priceBase: 2999, priceMax: 34999 },
      { name: "Baby Care Kit", adjectives: ["Bath Set", "Grooming Kit", "Skincare Set", "Gift Set", "Travel Kit"], storages: [""], colors: [""], priceBase: 199, priceMax: 1999 },
    ],
    specsFn: (rand, item) => ({
      "Age Group": item.storage || pick(["0-6 Months", "6-12 Months", "1-2 Years", "2-4 Years"], rand),
      "Material": pick(["100% Cotton", "Organic Cotton", "Soft Breathable Fabric", "Non-Woven", "Bamboo Fiber"], rand),
      "Dermatologically Tested": "Yes",
      "Safety Certified": pick(["BIS Certified", "EN 1888 Certified", "ISO Certified"], rand),
      "Country of Origin": "India",
    }),
  },
  // ── OFFICE ──
  {
    category: "Office",
    brands: ["HP", "Canon", "Epson", "Brother", "Logitech", "Zebronics", "AmazonBasics", "Classmate", "Faber-Castell", "Parker", "Cross", "Cello", "Doms"],
    types: [
      { name: "Printer", adjectives: ["Inkjet", "Laser", "All-in-One", "Color", "Mono", "Wi-Fi"], storages: [""], colors: ["Black", "White", "Grey"], priceBase: 2999, priceMax: 34999 },
      { name: "Stationery Set", adjectives: ["Premium", "Student", "Office", "Artist", "Gifting"], storages: [""], colors: ["Multi-Color", "Blue", "Black"], priceBase: 99, priceMax: 2999 },
      { name: "Webcam", adjectives: ["HD 720p", "Full HD 1080p", "2K QHD", "4K UHD", "With Ring Light"], storages: [""], colors: ["Black"], priceBase: 699, priceMax: 9999 },
      { name: "Desk Organizer", adjectives: ["Wooden", "Metal Mesh", "Acrylic", "Rotating", "Multi-Compartment"], storages: [""], colors: ["Black", "Walnut", "White", "Rose Gold"], priceBase: 299, priceMax: 2999 },
    ],
    specsFn: (rand, item) => ({
      "Type": item.type,
      "Material": pick(["ABS Plastic", "Metal", "Wood", "Acrylic", "Paper"], rand),
      "Connectivity": pick(["USB", "Wi-Fi + USB", "Bluetooth + USB", "N/A"], rand),
      "Warranty": pick(["6 Months", "1 Year", "2 Years"], rand),
      "Country of Origin": pick(["India", "China", "Japan"], rand),
    }),
  },
  // ── JEWELRY ──
  {
    category: "Jewelry",
    brands: ["Tanishq", "Malabar Gold", "PC Jeweller", "Kalyan Jewellers", "CaratLane", "Senco Gold", "GIVA", "Zaveri Pearls", "Sukkhi", "Voylla", "BlueStone", "Candere"],
    types: [
      { name: "Ring", adjectives: ["Gold", "Silver", "Diamond", "Solitaire", "Band", "Cocktail", "Adjustable"], storages: [""], colors: ["Gold", "Silver", "Rose Gold", "Platinum"], priceBase: 199, priceMax: 149999 },
      { name: "Necklace Set", adjectives: ["Choker", "Pendant", "Layered", "Temple", "Kundan", "Pearl", "American Diamond"], storages: [""], colors: ["Gold", "Silver", "Multi", "Green/Gold", "Red/Gold"], priceBase: 199, priceMax: 99999 },
      { name: "Earrings", adjectives: ["Stud", "Jhumka", "Drop", "Hoop", "Chandbali", "Danglers"], storages: [""], colors: ["Gold", "Silver", "Rose Gold", "Multi-Color"], priceBase: 99, priceMax: 49999 },
      { name: "Bangle Set", adjectives: ["Gold Plated", "Silver", "Kundan", "Silk Thread", "Metal", "Diamond"], storages: ["2.4", "2.6", "2.8", "Free Size"], colors: ["Gold", "Silver", "Multi", "Red/Green", "Pink/Gold"], priceBase: 149, priceMax: 29999 },
    ],
    specsFn: (rand, item) => ({
      "Metal": pick(["Gold Plated Brass", "925 Sterling Silver", "18K Gold", "22K Gold", "Platinum Plated", "Alloy"], rand),
      "Stone": pick(["American Diamond", "Cubic Zirconia", "Pearl", "Kundan", "Ruby", "Emerald", "No Stone", "Swarovski"], rand),
      "Occasion": pick(["Daily Wear", "Party", "Wedding", "Festive", "Office Wear", "Traditional"], rand),
      "Hallmarked": pick(["BIS Hallmark", "925 Silver Mark", "No"], rand),
      "Gift Box": "Included",
    }),
  },
];

export function generateAllProducts() {
  const products = [];
  let id = 0;

  for (const cat of catalog) {
    for (const type of cat.types) {
      for (const brand of cat.brands) {
        for (const adj of type.adjectives) {
          const storageList = type.storages.length > 0 ? type.storages : [""];
          for (const storage of storageList) {
            const colorList = type.colors.length > 0 ? type.colors : [""];
            for (const color of colorList) {
              id++;
              const rand = seededRandom(id * 7919);

              const nameParts = [brand, adj, type.name];
              if (storage && !["", "Free Size"].includes(storage)) nameParts.push(storage);
              if (color) nameParts.push(`- ${color}`);
              const name = nameParts.join(" ");

              const priceRand = seededRandom(id * 1301);
              const price = Math.round((type.priceBase + priceRand() * (type.priceMax - type.priceBase)) / 10) * 10 - 1;

              const ratingRand = seededRandom(id * 4253);
              const rating = Math.round((3.2 + ratingRand() * 1.8) * 10) / 10;

              const stockRand = seededRandom(id * 9371);
              const stock = Math.floor(5 + stockRand() * 200);

              const specs = cat.specsFn(seededRandom(id * 6143), {
                brand, type: type.name, adjective: adj, storage, color,
              });

              const imgRand = seededRandom(id * 3301);
              const image = getImage(cat.category, Math.floor(imgRand() * 100));

              const description = `${brand} ${adj} ${type.name}${storage ? ` (${storage})` : ""}${color ? ` in ${color}` : ""}. ${Object.entries(specs).slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(". ")}. Genuine product with manufacturer warranty. Fast delivery across India.`;

              products.push({
                id, name, description, price, image,
                category: cat.category, stock, rating, specs,
                created_at: new Date(Date.now() - id * 60000).toISOString(),
              });
            }
          }
        }
      }
    }
  }

  console.log(`Generated ${products.length} products across ${new Set(products.map(p => p.category)).size} categories`);
  return products;
}
