

import React from 'react';
import { useParams } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  
  return (
    <div className="edit-product-container">
      <h1>Edit Product #{id}</h1>
      <p>Edit product form coming soon...</p>
    </div>
  );
}