import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card group">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{product.category}</span>
          <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">{"\u20B9"}{product.price.toLocaleString("en-IN")}</span>
          <button
            onClick={() => addToCart(product.id)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.stock === 0 ? "Out of Stock" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
