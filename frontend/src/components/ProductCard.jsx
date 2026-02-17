import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const stars = Math.floor(product.rating);
  const hasHalf = product.rating - stars >= 0.5;

  return (
    <div className="bg-white p-4 relative group">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-white flex items-center justify-center mb-3 p-2">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div>
        <Link to={`/products/${product.id}`} className="text-sm text-amazon-text hover:text-amazon-link-hover line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < stars ? "fill-amazon-star text-amazon-star" : i === stars && hasHalf ? "fill-amazon-star/50 text-amazon-star" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-amazon-link">{product.rating}</span>
        </div>
        <div className="mt-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xs">{"\u20B9"}</span>
            <span className="text-xl font-medium text-amazon-text">{product.price.toLocaleString("en-IN")}</span>
          </div>
          {product.mrp > product.price && (
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className="text-amazon-text-secondary">M.R.P.: <span className="line-through">{"\u20B9"}{product.mrp.toLocaleString("en-IN")}</span></span>
              <span className="text-amazon-price-red">({product.discount}% off)</span>
            </div>
          )}
        </div>
        <p className="text-xs text-amazon-text-secondary mt-1">FREE Delivery</p>
        {product.stock === 0 && (
          <p className="text-xs text-red-600 font-medium mt-1">Currently unavailable</p>
        )}
      </div>
    </div>
  );
}
