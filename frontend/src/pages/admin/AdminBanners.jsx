import React, { useState, useEffect } from 'react';
import { admin } from '../../api';
import toast from 'react-hot-toast';
// import './AdminBanners.css';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    sort_order: 0
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await admin.banners();
      setBanners(data || []);
    } catch (error) {
      console.error('Load banners error:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sort_order' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      sort_order: 0
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast.error('Image URL is required');
      return;
    }

    try {
      const loadingToast = toast.loading('Adding banner...');
      await admin.addBanner(formData);
      toast.dismiss(loadingToast);
      toast.success('Banner added successfully');
      resetForm();
      await loadBanners();
    } catch (error) {
      toast.error(error.message || 'Failed to add banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    setDeletingId(id);
    
    try {
      const loadingToast = toast.loading('Deleting banner...');
      
      // Call the actual delete API
      await admin.deleteBanner(id);
      
      toast.dismiss(loadingToast);
      toast.success('Banner deleted successfully');
      
      // Remove the banner from the UI immediately
      setBanners(prevBanners => prevBanners.filter(banner => banner.id !== id));
      
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete banner');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to get image URL with error handling
  const getImageUrl = (url) => {
    if (!url) return '';
    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url;
    // Otherwise, prepend the base URL
    return url;
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" /> Loading banners...
      </div>
    );
  }

  return (
    <div className="admin-banners">
      <div className="page-header">
        <h1>Manage Banners</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Banner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="banner-form">
          <h2>Add New Banner</h2>
          
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Banner title"
            />
          </div>

          <div className="form-group">
            <label>Image URL *</label>
            <input
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label>Link URL</label>
            <input
              name="link_url"
              value={formData.link_url}
              onChange={handleInputChange}
              placeholder="/products or https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Sort Order</label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          {formData.image_url && (
            <div className="image-preview">
              <img 
                src={getImageUrl(formData.image_url)} 
                alt="Preview" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }} 
              />
              <p className="preview-error" style={{display: 'none'}}>Invalid image URL</p>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Add Banner
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="banners-grid">
        {banners.length === 0 ? (
          <p className="empty-state">No banners yet. Add your first banner above.</p>
        ) : (
          banners.map(banner => (
            <div key={banner.id} className={`banner-card ${deletingId === banner.id ? 'deleting' : ''}`}>
              <div className="banner-preview">
                <img 
                  src={getImageUrl(banner.image_url)} 
                  alt={banner.title || 'Banner'} 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x100?text=Image+Not+Found';
                  }}
                />
              </div>
              <div className="banner-info">
                <h3>{banner.title || 'Untitled'}</h3>
                <p className="banner-link">Link: {banner.link_url || 'None'}</p>
                <p className="banner-order">Display Order: {banner.sort_order}</p>
                <div className="banner-actions">
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(banner.id)}
                    disabled={deletingId === banner.id}
                  >
                    {deletingId === banner.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}