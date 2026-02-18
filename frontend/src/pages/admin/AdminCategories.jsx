


import React, { useState, useEffect } from 'react';
import { admin } from '../../api';
import toast from 'react-hot-toast';
import './AdminCategories.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_id: '',
    sort_order: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await admin.categories();
      setCategories(data || []);
    } catch (error) {
      console.error('Load categories error:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sort_order' || name === 'parent_id' 
        ? value === '' ? '' : Number(value)
        : value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      parent_id: '',
      sort_order: 0
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order || 0
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    // Validate slug
    if (!formData.slug) {
      toast.error('Slug is required');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await admin.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        // Add new category
        await admin.addCategory(formData);
        toast.success('Category added successfully');
      }
      
      resetForm();
      await loadCategories(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id, name) => {
    // Confirm deletion with user
    if (!window.confirm(`Are you sure you want to delete "${name}"?\n\nThis will also delete all subcategories and unlink products from this category.`)) {
      return;
    }
    
    setDeletingId(id);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Deleting category...');
      
      // Call the delete API
      await admin.deleteCategory(id);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`Category "${name}" deleted successfully`);
      
      // IMPORTANT: Update the UI immediately by filtering out the deleted category
      setCategories(prevCategories => {
        // Function to recursively remove category and its children
        const removeCategoryAndChildren = (cats, categoryId) => {
          return cats.filter(cat => {
            if (cat.id === categoryId) {
              return false; // Remove this category
            }
            if (cat.children) {
              cat.children = removeCategoryAndChildren(cat.children, categoryId);
            }
            return true;
          });
        };
        
        // If categories are flat (not tree structure)
        const filtered = prevCategories.filter(cat => cat.id !== id);
        
        // Also remove any subcategories that might have this as parent
        const withChildrenRemoved = filtered.map(cat => {
          if (cat.parent_id === id) {
            return { ...cat, parent_id: null };
          }
          return cat;
        });
        
        return withChildrenRemoved;
      });
      
      // Optionally reload from server to ensure consistency
      // await loadCategories();
      
    } catch (error) {
      console.error('Delete error:', error);
      
      // Handle specific error messages
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.hasSubcategories) {
          toast.error(`Cannot delete: Category has ${errorData.subcategoryCount} subcategories. Delete subcategories first.`);
        } else if (errorData.hasProducts) {
          toast.error(`Cannot delete: ${errorData.productCount} products are using this category. Move products first.`);
        } else {
          toast.error(errorData.message || 'Failed to delete category');
        }
      } else {
        toast.error(error.message || 'Failed to delete category');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const buildCategoryTree = (cats, parentId = null, level = 0) => {
    return cats
      .filter(c => c.parent_id === parentId)
      .map(c => ({
        ...c,
        level,
        children: buildCategoryTree(cats, c.id, level + 1)
      }));
  };

  const categoryTree = buildCategoryTree(categories);

  const renderCategoryRow = (category) => (
    <React.Fragment key={category.id}>
      <div className={`category-row ${deletingId === category.id ? 'deleting' : ''}`} style={{ paddingLeft: `${category.level * 30}px` }}>
        <span className="category-name">
          {category.level > 0 && '└─ '}
          {category.name}
          {deletingId === category.id && ' (Deleting...)'}
        </span>
        <span className="category-slug">{category.slug}</span>
        <span className="category-order">{category.sort_order}</span>
        <div className="category-actions">
          <button 
            className="btn-small"
            onClick={() => handleEdit(category)}
            disabled={deletingId === category.id}
          >
            Edit
          </button>
          <button 
            className="btn-small btn-danger"
            onClick={() => handleDelete(category.id, category.name)}
            disabled={deletingId === category.id}
          >
            {deletingId === category.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      {category.children.map(child => renderCategoryRow(child))}
    </React.Fragment>
  );

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" /> Loading categories...
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="page-header">
        <h1>Manage Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Electronics"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              placeholder="e.g., electronics"
            />
            <small className="form-text text-muted">
              URL-friendly name (auto-generated from category name)
            </small>
          </div>

          <div className="form-group">
            <label>Parent Category</label>
            <select
              name="parent_id"
              value={formData.parent_id}
              onChange={handleInputChange}
            >
              <option value="">None (Top Level)</option>
              {categories
                .filter(c => !c.parent_id && c.id !== editingCategory?.id) // Prevent self-reference
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sort Order</label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="categories-list">
        <div className="list-header">
          <span>Category</span>
          <span>Slug</span>
          <span>Order</span>
          <span>Actions</span>
        </div>
        {categoryTree.length > 0 ? (
          categoryTree.map(cat => renderCategoryRow(cat))
        ) : (
          <div className="empty-state">
            <p>No categories found. Click "Add Category" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}