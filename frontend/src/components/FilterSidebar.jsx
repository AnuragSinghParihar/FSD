import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">Categories</h3>
        <ul className="filter-list">
          <li>
            <button
              className={`filter-item ${!activeCategory ? 'active' : ''}`}
              onClick={() => onCategoryChange('')}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                className={`filter-item ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat.slug)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Price Range</h3>
        <div className="price-ranges">
          <button className="filter-item">Under ₹500</button>
          <button className="filter-item">₹500 - ₹1,000</button>
          <button className="filter-item">₹1,000 - ₹3,000</button>
          <button className="filter-item">₹3,000 - ₹5,000</button>
          <button className="filter-item">Above ₹5,000</button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
