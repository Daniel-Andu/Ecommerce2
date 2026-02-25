// // admin-frontend/src/pages/ProductManagement.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import './ProductManagement.css';

// export default function ProductManagement() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     try {
//       let url = '/admin/products';
//       if (filter !== 'all') {
//         url += `?status=${filter}`;
//       }
//       const response = await api.get(url);
//       setProducts(response.data);
//     } catch (error) {
//       console.error('Error loading products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       await api.patch(`/admin/products/${id}/approve`);
//       loadProducts(); // Reload to show updated status
//     } catch (error) {
//       console.error('Error approving product:', error);
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       await api.patch(`/admin/products/${id}/reject`);
//       loadProducts();
//     } catch (error) {
//       console.error('Error rejecting product:', error);
//     }
//   };

//   const handleFeature = async (id, currentFeatured) => {
//     try {
//       await api.patch(`/admin/products/${id}/feature`, {
//         featured: !currentFeatured
//       });
//       loadProducts();
//     } catch (error) {
//       console.error('Error featuring product:', error);
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading products...</div>;
//   }

//   return (
//     <div className="product-management">
//       <div className="page-header">
//         <h1>Product Management</h1>
//       </div>

//       <div className="filter-bar">
//         <select 
//           value={filter} 
//           onChange={(e) => setFilter(e.target.value)}
//           className="filter-select"
//         >
//           <option value="all">All Products</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>

//         <button onClick={loadProducts} className="btn-refresh">
//           Refresh
//         </button>
//       </div>

//       <div className="table-responsive">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Product</th>
//               <th>Seller</th>
//               <th>Price</th>
//               <th>Status</th>
//               <th>Featured</th>
//               <th>Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map(product => (
//               <tr key={product.id}>
//                 <td>
//                   <img 
//                     src={product.images?.[0] || '/placeholder.jpg'} 
//                     alt={product.name}
//                     className="product-thumb"
//                   />
//                 </td>
//                 <td>
//                   <strong>{product.name}</strong>
//                   <br />
//                   <small>{product.category}</small>
//                 </td>
//                 <td>{product.business_name}</td>
//                 <td>ETB{product.base_price}</td>
//                 <td>
//                   <span className={`status-badge ${product.status}`}>
//                     {product.status}
//                   </span>
//                 </td>
//                 <td>
//                   <input 
//                     type="checkbox" 
//                     checked={product.is_featured === 1}
//                     onChange={() => handleFeature(product.id, product.is_featured)}
//                   />
//                 </td>
//                 <td>{new Date(product.created_at).toLocaleDateString()}</td>
//                 <td>
//                   <div className="action-buttons">
//                     {product.status === 'pending' && (
//                       <>
//                         <button 
//                           onClick={() => handleApprove(product.id)}
//                           className="btn-approve"
//                         >
//                           Approve
//                         </button>
//                         <button 
//                           onClick={() => handleReject(product.id)}
//                           className="btn-reject"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// admin-frontend/src/pages/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ProductManagement.css';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [filter]); // also reload when filter changes

  const loadProducts = async () => {
    try {
      setLoading(true);
      let url = '/admin/products';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['No', 'Product Name', 'Category', 'Seller', 'Price', 'Stock', 'Status', 'Featured', 'Date'];
    const rows = products.map((product, index) => [
      index + 1,
      product.name,
      product.category || 'N/A',
      product.business_name,
      `ETB ${product.base_price}`,
      product.stock_quantity || 0,
      product.status,
      product.is_featured ? 'Yes' : 'No',
      new Date(product.created_at).toLocaleDateString()
    ]);

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/products/${id}/approve`);
      loadProducts();
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/products/${id}/reject`);
      loadProducts();
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
  };

  const handleFeature = async (id, currentFeatured) => {
    try {
      // Optimistically update the UI first
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id
            ? { ...product, is_featured: currentFeatured ? 0 : 1 }
            : product
        )
      );

      // Then make the API call
      await api.patch(`/admin/products/${id}/feature`, {
        featured: !currentFeatured
      });

      // No need to reload - UI already updated!
    } catch (error) {
      console.error('Error featuring product:', error);
      // If error, revert the change by reloading
      loadProducts();
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h1>Product Management</h1>
      </div>

      <div className="filter-bar">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Products</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className="filter-actions">
          <button onClick={loadProducts} className="btn-refresh">
            🔄 Refresh
          </button>
          <button onClick={exportToExcel} className="btn-export">
            📊 Export to Excel
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>Seller</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                {/* Number column instead of image */}
                <td>{index + 1}</td>

                <td>
                  <strong>{product.name}</strong>
                  <br />
                  <small>{product.category}</small>
                </td>

                <td>{product.business_name}</td>

                <td>ETB {product.base_price}</td>

                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </td>

                <td>
                  <label className="feature-checkbox">
                    <input
                      type="checkbox"
                      checked={product.is_featured === 1 || product.is_featured === true}
                      onChange={() => handleFeature(product.id, product.is_featured)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </td>

                <td>
                  {new Date(product.created_at).toLocaleDateString()}
                </td>

                <td>
                  <div className="action-buttons">
                    {product.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(product.id)}
                          className="btn-approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(product.id)}
                          className="btn-reject"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="no-data">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}