import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import './AddProduct.css'; // Reuse AddProduct styles

export default function EditProduct() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    sale_price: '',
    stock_quantity: '',
    category_id: '',
    tags: '',
    is_featured: false
  });

  useEffect(() => {
    loadCategories();
    loadProduct();
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await api.categories.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.seller.getProduct(id);

      setProduct(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        base_price: data.base_price || '',
        sale_price: data.sale_price || '',
        stock_quantity: data.stock_quantity || '',
        category_id: data.category_id || '',
        tags: data.tags || '',
        is_featured: data.is_featured || false
      });

      // Set existing images
      if (data.images && data.images.length > 0) {
        setExistingImages(data.images);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      navigate('/seller/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const totalImages = existingImages.length + images.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImages(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    setSaving(true);

    try {
      const productData = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          productData.append(key, formData[key]);
        }
      });

      // Add new images
      images.forEach(image => {
        productData.append('images', image);
      });

      // Add existing images to keep
      productData.append('existing_images', JSON.stringify(existingImages));

      await api.seller.updateProduct(id, productData);

      toast.success('Product updated successfully!');
      navigate('/seller/products');
    } catch (error) {
      console.error('Update product error:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="add-product-container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="add-product-container">
        <div className="error">Product not found</div>
      </div>
    );
  }

  return (
    <div className="add-product-container">
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Information */}
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your product"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Base Price (ETB) *</label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Sale Price (ETB)</label>
            <input
              type="number"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. electronics, gadgets, sale"
          />
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            name="is_featured"
            id="is_featured"
            checked={formData.is_featured}
            onChange={handleChange}
          />
          <label htmlFor="is_featured">Feature this product</label>
        </div>

        {/* Images Section */}
        <div className="form-group">
          <label>Product Images (Max 5)</label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="image-preview-grid">
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="image-preview">
                  <img
                    src={getImageUrl(img)}
                    alt={`Product ${index + 1}`}
                    onError={handleImageError}
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images */}
          {imagePreviews.length > 0 && (
            <div className="image-preview-grid">
              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="image-preview">
                  <img src={preview} alt={`New ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {(existingImages.length + images.length) < 5 && (
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="images" className="upload-label">
                <span>📷</span>
                <span>Add Images</span>
                <small>JPG, PNG, GIF (Max 5MB each)</small>
              </label>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-submit"
          >
            {saving ? (
              <>
                <span className="spinner"></span>
                Updating...
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </form>

      {/* Back Link */}
      <div className="back-link">
        <Link to="/seller/products" className="btn-text">
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}
