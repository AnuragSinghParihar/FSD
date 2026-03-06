import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../api/client';
import './PDPPage.css';

const PDPPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${slug}`);
        setProduct(res.data.product);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD', item: { id: product.id, name: product.name, price: product.price, image_url: product.image_url } });
    }
  };

  if (loading) return <div className="pdp-loading"><div className="spinner" /></div>;
  if (!product) return <div className="pdp-error container"><h2>Product not found</h2><Link to="/products">Back to Products</Link></div>;

  const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;

  return (
    <div className="pdp-page container">
      <Link to="/products" className="back-link"><FiArrowLeft /> Back to Products</Link>

      <div className="pdp-layout">
        <div className="pdp-gallery">
          <div className="pdp-main-image">
            {discount > 0 && <span className="pdp-badge">-{discount}% OFF</span>}
            <img src={product.image_url || 'https://via.placeholder.com/600'} alt={product.name} />
          </div>
        </div>

        <div className="pdp-details">
          <span className="pdp-category">{product.category_name}</span>
          <h1 className="pdp-title">{product.name}</h1>

          <div className="pdp-rating">
            <div className="stars">
              {[1,2,3,4,5].map(i => (
                <FiStar key={i} className={i <= Math.round(product.rating) ? 'star filled' : 'star'} />
              ))}
            </div>
            <span>{product.rating} ({product.review_count} reviews)</span>
          </div>

          <div className="pdp-pricing">
            <span className="pdp-price">₹{product.price?.toLocaleString()}</span>
            {product.compare_price && (
              <span className="pdp-compare">₹{product.compare_price?.toLocaleString()}</span>
            )}
            {discount > 0 && <span className="pdp-save">Save {discount}%</span>}
          </div>

          <p className="pdp-description">{product.description}</p>

          <div className="pdp-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <div className="pdp-actions">
            <div className="quantity-picker">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><FiPlus /></button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock === 0}>
              <FiShoppingCart /> Add to Cart
            </button>
          </div>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="pdp-reviews">
              <h3>Customer Reviews</h3>
              {product.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <strong>{review.user_name}</strong>
                    <div className="review-stars">
                      {[1,2,3,4,5].map(i => (
                        <FiStar key={i} className={i <= review.rating ? 'star filled' : 'star'} size={12} />
                      ))}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDPPage;
