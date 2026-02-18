

import React, { useState, useEffect } from 'react';
import { seller, categories } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, handleImageError, productPlaceholder } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import './SellerProducts.css';

export default function SellerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sellerStatus, setSellerStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    base_price: '',
    sale_price: '',
    sku: '',
    stock_quantity: 0,
    image_url: '' // Add image URL field
  });

  useEffect(() => {
    if (user?.seller) {
      setSellerStatus(user.seller.status);
    }
    loadCategories();
    if (user?.seller?.status === 'approved') {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      const cats = await categories.list();
      setCategoriesList(cats || []);
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const prods = await seller.products();
      setProducts(prods || []);
    } catch (error) {
      console.error('Load products error:', error);
      if (!error.message.includes('pending approval')) {
        toast.error('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category_id' || name === 'stock_quantity'
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      description: '',
      base_price: '',
      sale_price: '',
      sku: '',
      stock_quantity: 0,
      image_url: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
      description: product.description || '',
      base_price: product.base_price || '',
      sale_price: product.sale_price || '',
      sku: product.sku || '',
      stock_quantity: product.stock_quantity || 0,
      image_url: product.images?.[0] || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.base_price) {
      toast.error('Product name and price are required');
      return;
    }

    setSaving(true);
    
    try {
      const productData = {
        name: formData.name,
        category_id: formData.category_id || null,
        description: formData.description || null,
        base_price: Number(formData.base_price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        sku: formData.sku || null,
        stock_quantity: Number(formData.stock_quantity) || 0,
        images: formData.image_url ? [{ url: formData.image_url }] : []
      };

      if (editingProduct) {
        await seller.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await seller.addProduct(productData);
        toast.success('Product added successfully. Pending approval.');
      }
      
      resetForm();
      await loadProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await seller.deleteProduct(id);
      toast.success('Product deleted');
      await loadProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (sellerStatus === 'pending') {
    return (
      <div className="pending-approval">
        <div className="pending-card">
          <span className="pending-icon">⏳</span>
          <h2>Account Pending Approval</h2>
          <p>Your seller account is currently being reviewed by our admin team.</p>
          <p>You'll be able to add products once your account is approved.</p>
          <div className="pending-status">
            Status: <span className="badge badge-warning">Pending Approval</span>
          </div>
        </div>
      </div>
    );
  }

  if (sellerStatus === 'rejected') {
    return (
      <div className="pending-approval">
        <div className="pending-card rejected">
          <span className="pending-icon">❌</span>
          <h2>Application Rejected</h2>
          <p>Your seller application has been rejected.</p>
          <p>Please contact support for more information./</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="seller-products-page">
      <div className="page-header">
        <h1>My Products</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select a category --</option>
                {categoriesList
                  .filter(c => !c.parent_id)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Product Image URL</label>
            <input
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/product-image.jpg"
            />
            <small className="form-text">Enter a URL for your product image (optional)</small>
          </div>

          {formData.image_url && (
            <div className="image-preview">
              <img 
                src={getImageUrl(formData.image_url)} 
                alt="Preview" 
                onError={(e) => handleImageError(e, productPlaceholder)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Product description..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="base_price"
                value={formData.base_price}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Sale Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleInputChange}
                placeholder="0.00 (optional)"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SKU</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Stock keeping unit (optional)"
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                min="0"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <p>You haven't added any products yet.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="products-table">
          <div className="table-header">
            <span>Image</span>
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          
          {products.map(product => (
            <div key={product.id} className="table-row">
              <div className="product-image-cell">
                <img 
                  src={getImageUrl(product.images?.[0], productPlaceholder)} 
                  alt={product.name}
                  className="product-thumbnail"
                  onError={(e) => handleImageError(e, productPlaceholder)}
                />
              </div>
              <span className="product-name">{product.name}</span>
              <span>${Number(product.sale_price || product.base_price).toFixed(2)}</span>
              <span>{product.stock_quantity}</span>
              <span className={`status-badge ${product.status}`}>{product.status}</span>
              <div className="action-buttons">
                <button 
                  className="btn-small"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button 
                  className="btn-small btn-danger"
                  onClick={() => handleDelete(product.id, product.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}