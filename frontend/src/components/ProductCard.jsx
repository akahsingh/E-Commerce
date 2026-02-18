import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const stars = Math.floor(product.rating);
  const hasHalf = product.rating - stars >= 0.5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
    toast.success("Added to cart!");
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col relative">
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          -{product.discount}%
        </div>
      )}

      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-medium text-gray-800 hover:text-indigo-600 line-clamp-2 leading-snug transition-colors flex-1 min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < stars
                    ? "fill-amber-400 text-amber-400"
                    : i === stars && hasHalf
                    ? "fill-amber-200 text-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">{"\u20B9"}{product.price.toLocaleString("en-IN")}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">{"\u20B9"}{product.mrp.toLocaleString("en-IN")}</span>
            )}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">FREE Delivery</p>
          {product.stock === 0 && (
            <p className="text-xs text-rose-500 font-medium">Out of stock</p>
          )}
        </div>

        {/* Add to Cart */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
