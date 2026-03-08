import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, dispatch } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <FiShoppingBag className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <Link to="/products" className="back-link"><FiArrowLeft /> Continue Shopping</Link>
      <h1>Shopping Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span className="cart-item-price">₹{item.price?.toLocaleString()}</span>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => {
                  if (item.qty <= 1) dispatch({ type: 'REMOVE', id: item.id });
                  else dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 });
                }}><FiMinus /></button>
                <span>{item.qty}</span>
                <button onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}><FiPlus /></button>
              </div>
              <span className="cart-item-total">₹{(item.price * item.qty).toLocaleString()}</span>
              <button className="cart-item-remove" onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          {shipping > 0 && <p className="free-ship-hint">Add ₹{(500 - subtotal).toLocaleString()} more for free shipping</p>}
          <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <Link to="/checkout" className="btn btn-primary btn-block">Proceed to Checkout</Link>
          <button className="btn btn-outline btn-block" onClick={() => dispatch({ type: 'CLEAR' })}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
