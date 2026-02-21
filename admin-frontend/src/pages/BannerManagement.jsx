import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './BannerManagement.css';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.patch(`/admin/banners/${editingBanner.id}`, formData);
      } else {
        await api.post('/admin/banners', formData);
      }
      loadBanners();
      resetForm();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      sort_order: banner.sort_order || 0,
      is_active: banner.is_active === 1
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.delete(`/admin/banners/${id}`);
        loadBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/banners/${id}`, { is_active: !currentStatus });
      loadBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      sort_order: 0,
      is_active: true
    });
  };

  if (loading) {
    return <div className="loading">Loading banners...</div>;
  }

  return (
    <div className="banner-management">
      <div className="page-header">
        <h1>Banner Management</h1>
        <button 
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Add New Banner
        </button>
      </div>

      {showForm && (
        <div className="banner-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={resetForm} className="btn-close">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="banner-form">
              <div className="form-group">
                <label htmlFor="title">Banner Title (Optional)</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Sale"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Image URL *</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/banner.jpg"
                />
                <small>Recommended size: 1920x600 pixels</small>
              </div>

              {formData.image_url && (
                <div className="image-preview">
                  <img src={formData.image_url} alt="Preview" />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="link_url">Link URL (Optional)</label>
                <input
                  type="url"
                  id="link_url"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/promo"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sort_order">Sort Order</label>
                  <input
                    type="number"
                    id="sort_order"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    min="0"
                  />
                  <small>Lower numbers appear first</small>
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="banners-grid">
        {banners.length === 0 ? (
          <div className="no-banners">
            <p>No banners found. Click "Add New Banner" to create one.</p>
          </div>
        ) : (
          banners.map(banner => (
            <div key={banner.id} className="banner-card">
              <div className="banner-preview">
                <img src={banner.image_url} alt={banner.title || 'Banner'} />
                <div className="banner-status">
                  <span className={`status-badge ${banner.is_active ? 'active' : 'inactive'}`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="banner-info">
                <h3>{banner.title || 'Untitled Banner'}</h3>
                {banner.link_url && (
                  <p className="banner-link">
                    <strong>Link:</strong> {banner.link_url}
                  </p>
                )}
                <p className="banner-meta">
                  <span>Order: {banner.sort_order || 0}</span>
                  <span>Created: {new Date(banner.created_at).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="banner-actions">
                <button 
                  onClick={() => toggleActive(banner.id, banner.is_active)}
                  className={`btn-toggle ${banner.is_active ? 'active' : 'inactive'}`}
                >
                  {banner.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleEdit(banner)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}