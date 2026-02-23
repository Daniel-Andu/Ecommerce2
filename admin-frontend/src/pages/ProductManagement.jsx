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
      await api.patch(`/admin/products/${id}/feature`, {
        featured: !currentFeatured
      });
      loadProducts();
    } catch (error) {
      console.error('Error featuring product:', error);
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

        <button onClick={loadProducts} className="btn-refresh">
          Refresh
        </button>
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
                  <input 
                    type="checkbox" 
                    checked={product.is_featured === 1}
                    onChange={() => handleFeature(product.id, product.is_featured)}
                  />
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