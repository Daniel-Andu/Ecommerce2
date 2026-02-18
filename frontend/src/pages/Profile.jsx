


import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { addresses, auth } from '../api';
import { getImageUrl, handleImageError, profilePlaceholder } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({ 
    first_name: '', 
    last_name: '', 
    phone: '',
    profile_image: null 
  });
  const [addressList, setAddressList] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Ethiopia'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordForm, setPasswordForm] = useState({ 
    current_password: '', 
    new_password: '',
    confirm_password: '' 
  });

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        profile_image: user.profile_image || null
      });
    }
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    try {
      const data = await addresses.list();
      setAddressList(data || []);
    } catch (error) {
      console.error('Load addresses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const updated = await auth.uploadProfileImage(formData);
      updateUser(updated);
      setProfile(prev => ({ ...prev, profile_image: updated.profile_image }));
      toast.success('Profile image updated');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await auth.updateProfile(profile);
      updateUser(updated);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    
    setSaving(true);
    try {
      await auth.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.full_name || !newAddress.address_line1 || !newAddress.city) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setSaving(true);
    try {
      const addr = await addresses.create({ 
        ...newAddress, 
        is_default: addressList.length === 0 
      });
      setAddressList([...addressList, addr]);
      setNewAddress({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Ethiopia'
      });
      setShowAddAddress(false);
      toast.success('Address added successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await addresses.delete(id);
      setAddressList(addressList.filter(a => a.id !== id));
      toast.success('Address removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await addresses.update(id, { is_default: true });
      loadAddresses();
      toast.success('Default address updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <h1>My Account</h1>
          <p>Manage your profile and preferences</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper" onClick={handleImageClick}>
              <img 
                src={getImageUrl(profile.profile_image, 'https://ui-avatars.com/api/?name=' + profile.first_name + '+' + profile.last_name + '&background=6366F1&color=fff&size=200')} 
                alt={user.first_name}
                className="profile-avatar"
                onError={(e) => handleImageError(e, profilePlaceholder)}
              />
              <div className="avatar-overlay">
                <span>Change Photo</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {uploading && <p className="uploading-text">Uploading...</p>}
            <h3>{profile.first_name} {profile.last_name}</h3>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">
              {user.role === 'admin' ? '👑 Administrator' : 
               user.role === 'seller' ? '🛍️ Seller' : '🛒 Customer'}
            </p>
          </div>

          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="tab-icon">👤</span>
              Personal Info
            </button>
            <button 
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="tab-icon">🔒</span>
              Security
            </button>
            <button 
              className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <span className="tab-icon">📍</span>
              Addresses
            </button>
          </div>
        </div>

        {/* Profile Main Content */}
        <div className="profile-main">
          {/* Personal Info Tab */}
          {activeTab === 'profile' && (
            <div className="profile-card">
              <h2>Personal Information</h2>
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      value={profile.first_name} 
                      onChange={(e) => setProfile(p => ({ ...p, first_name: e.target.value }))}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      value={profile.last_name} 
                      onChange={(e) => setProfile(p => ({ ...p, last_name: e.target.value }))}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input value={user.email} disabled className="disabled-input" />
                  <small className="input-hint">Email cannot be changed</small>
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    value={profile.phone} 
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="profile-card">
              <h2>Change Password</h2>
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.current_password} 
                    onChange={(e) => setPasswordForm(p => ({ ...p, current_password: e.target.value }))}
                    required
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.new_password} 
                    onChange={(e) => setPasswordForm(p => ({ ...p, new_password: e.target.value }))}
                    minLength={6}
                    required
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirm_password} 
                    onChange={(e) => setPasswordForm(p => ({ ...p, confirm_password: e.target.value }))}
                    minLength={6}
                    required
                    placeholder="Confirm new password"
                  />
                </div>
                
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="profile-card">
              <div className="card-header">
                <h2>My Addresses</h2>
                <button 
                  className="btn-add"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                >
                  {showAddAddress ? '− Cancel' : '+ Add Address'}
                </button>
              </div>
              
              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress(n => ({ ...n, full_name: e.target.value }))}
                        required
                        placeholder="Full name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress(n => ({ ...n, phone: e.target.value }))}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Address Line 1 *</label>
                    <input
                      value={newAddress.address_line1}
                      onChange={(e) => setNewAddress(n => ({ ...n, address_line1: e.target.value }))}
                      required
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input
                      value={newAddress.address_line2}
                      onChange={(e) => setNewAddress(n => ({ ...n, address_line2: e.target.value }))}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(n => ({ ...n, city: e.target.value }))}
                        required
                        placeholder="City"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>State</label>
                      <input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress(n => ({ ...n, state: e.target.value }))}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress(n => ({ ...n, postal_code: e.target.value }))}
                        placeholder="Postal code"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        value={newAddress.country}
                        onChange={(e) => setNewAddress(n => ({ ...n, country: e.target.value }))}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={saving}>
                      Save Address
                    </button>
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => setShowAddAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              
              <div className="addresses-list">
                {addressList.length === 0 && !showAddAddress ? (
                  <div className="no-addresses">
                    <span className="no-data-icon">📍</span>
                    <p>No addresses saved yet</p>
                    <button className="btn-add-first" onClick={() => setShowAddAddress(true)}>
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  addressList.map((address) => (
                    <div key={address.id} className="address-item">
                      {address.is_default && <span className="default-badge">Default</span>}
                      <div className="address-details">
                        <p className="address-name"><strong>{address.full_name}</strong></p>
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>{address.city}, {address.state} {address.postal_code}</p>
                        <p>{address.country}</p>
                        {address.phone && <p className="address-phone">📞 {address.phone}</p>}
                      </div>
                      <div className="address-actions">
                        {!address.is_default && (
                          <button 
                            className="btn-set-default"
                            onClick={() => handleSetDefaultAddress(address.id)}
                            title="Set as default"
                          >
                            ★ Set Default
                          </button>
                        )}
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteAddress(address.id)}
                          title="Delete address"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}