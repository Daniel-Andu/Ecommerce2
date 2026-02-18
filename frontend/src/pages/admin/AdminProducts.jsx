
import React, { useState, useEffect } from 'react';
import { admin } from '../../api';
import toast from 'react-hot-toast';
import './AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await admin.pendingProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Load products error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      await admin.approveProduct(id);
      toast.success('Product approved');
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to approve product');
    } finally {
      setProcessing(false);
    }
  };

  const handleFeature = async (id, currentFeatured) => {
    setProcessing(true);
    try {
      await admin.featureProduct(id, !currentFeatured);
      toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'}`);
      
      // Update local state
      setProducts(products.map(p => 
        p.id === id ? { ...p, is_featured: !currentFeatured } : p
      ));
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" /> Loading products...
      </div>
    );
  }

  return (
    <div className="admin-products">
      <h1>Pending Products</h1>
      
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No pending products.</p>
        </div>
      ) : (
        <div className="products-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-seller">
                  <strong>Seller:</strong> {product.business_name || 'N/A'}
                </p>
                <p><strong>Price:</strong> {Number(product.sale_price || product.base_price).toFixed(2)} birr</p>
                <p><strong>Stock:</strong> {product.stock_quantity || 0}</p>
                {product.sku && <p><strong>SKU:</strong> {product.sku}</p>}
                {product.description && (
                  <p className="product-description">
                    <strong>Description:</strong> {product.description.substring(0, 150)}
                    {product.description.length > 150 && '...'}
                  </p>
                )}
              </div>
              
              <div className="product-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleApprove(product.id)}
                  disabled={processing}
                >
                  Approve
                </button>
                <button 
                  className={`btn ${product.is_featured ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => handleFeature(product.id, product.is_featured)}
                  disabled={processing}
                >
                  {product.is_featured ? '★ Featured' : '☆ Feature'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}