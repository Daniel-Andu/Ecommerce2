import React, { useState, useEffect } from 'react';
import { admin } from '../api';
import toast from 'react-hot-toast';
import './AdminSellers.css';

export default function AdminSellers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    admin.pendingSellers().then(setList).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = (id) => {
    admin.approveSeller(id).then(() => { toast.success('Approved'); load(); }).catch((e) => toast.error(e.message));
  };

  const reject = (id) => {
    admin.rejectSeller(id).then(() => { toast.success('Rejected'); load(); }).catch((e) => toast.error(e.message));
  };

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>;

  return (
    <div className="admin-sellers">
      <h1>Pending Sellers</h1>
      {list.length === 0 ? (
        <p className="empty-state">No pending seller applications.</p>
      ) : (
        <div className="sellers-list">
          {list.map((s) => (
            <div key={s.id} className="seller-row">
              <div>
                <strong>{s.business_name}</strong>
                <p>{s.business_email || ''} · {s.first_name} {s.last_name}</p>
              </div>
              <div className="actions">
                <button type="button" className="btn btn-primary" onClick={() => approve(s.id)}>Approve</button>
                <button type="button" className="btn btn-outline" onClick={() => reject(s.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
