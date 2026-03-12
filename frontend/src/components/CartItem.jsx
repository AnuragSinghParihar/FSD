import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import './CartItem.css';

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="cart-item-component">
      <img
        src={item.image_url || 'https://via.placeholder.com/80'}
        alt={item.name}
        className="ci-image"
      />
      <div className="ci-details">
        <h4 className="ci-name">{item.name}</h4>
        <span className="ci-price">₹{item.price?.toLocaleString()}</span>
      </div>
      <div className="ci-quantity">
        <button onClick={() => onUpdateQty(item.id, Math.max(0, item.qty - 1))}>
          <FiMinus size={14} />
        </button>
        <span>{item.qty}</span>
        <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>
          <FiPlus size={14} />
        </button>
      </div>
      <span className="ci-total">₹{(item.price * item.qty).toLocaleString()}</span>
      <button className="ci-remove" onClick={() => onRemove(item.id)}>
        <FiTrash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
