import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div className="product-card">
      {discount > 0 && (
        <span className="product-badge">-{discount}%</span>
      )}
      <Link to={`/products/${product.slug}`} className="product-image">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category_name || 'General'}</span>
        <Link to={`/products/${product.slug}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-rating">
          <FiStar className="star-icon" />
          <span>{product.rating || '0.0'}</span>
          <span className="review-count">({product.review_count || 0})</span>
        </div>

        <div className="product-pricing">
          <span className="current-price">₹{product.price?.toLocaleString()}</span>
          {product.compare_price && (
            <span className="compare-price">₹{product.compare_price?.toLocaleString()}</span>
          )}
        </div>

        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <FiShoppingCart />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
