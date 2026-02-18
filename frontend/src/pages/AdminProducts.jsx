import React, { useState, useEffect } from 'react';
import { admin } from '../api';
import toast from 'react-hot-toast';
import './AdminProducts.css';

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    admin.pendingProducts().then(setList).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = (id) => {
    admin.approveProduct(id).then(() => { toast.success('Approved'); load(); }).catch((e) => toast.error(e.message));
  };

  const feature = (id, val) => {
    admin.featureProduct(id, val).then(() => { toast.success('Updated'); load(); }).catch((e) => toast.error(e.message));
  };

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>;

  return (
    <div className="admin-products">
      <h1>Pending Products</h1>
      {list.length === 0 ? (
        <p className="empty-state">No pending products.</p>
      ) : (
        <div className="products-list">
          {list.map((p) => (
            <div key={p.id} className="product-row">
              <span className="name">{p.name}</span>
              <span>{p.business_name || ''}</span>
              <span>{Number(p.sale_price || p.base_price).toFixed(2)} birr</span>
              <div className="actions">
                <button type="button" className="btn btn-primary" onClick={() => approve(p.id)}>Approve</button>
                <button type="button" className="btn btn-outline" onClick={() => feature(p.id, !p.is_featured)}>
                  {p.is_featured ? 'Unfeature' : 'Feature'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
