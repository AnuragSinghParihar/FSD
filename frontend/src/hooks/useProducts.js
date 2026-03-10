import { useState, useEffect } from 'react';
import api from '../api/client';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryString = new URLSearchParams(params).toString();
        const res = await api.get(`/api/products?${queryString}`);
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, loading, error, pagination };
};

export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/${slug}`);
        setProduct(res.data.product);
      } catch (err) {
        setError(err.response?.data?.error || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};
