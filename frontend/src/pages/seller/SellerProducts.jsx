import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import toast from 'react-hot-toast';
import './SellerProducts.css';

export default function SellerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.seller.products();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.seller.deleteProduct(productId);
        toast.success('Product deleted successfully');
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading your products...</div>;
  }

  return (
    <div className="seller-products">
      <div className="page-header">
        <h1>My Products</h1>
        <Link to="/seller/products/add" className="btn-add">
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>You haven't added any products yet.</p>
          <Link to="/seller/products/add" className="btn-add-product">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.name}
                      className="product-thumb"
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <small>{product.category}</small>
                  </td>
                  <td>ETB{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/products/${product.slug}`} className="btn-view">
                        View
                      </Link>
                      <Link to={`/seller/products/edit/${product.id}`} className="btn-edit">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}