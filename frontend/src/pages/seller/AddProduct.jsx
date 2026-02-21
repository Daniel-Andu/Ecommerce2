// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import * as api from '../../api';
// import toast from 'react-hot-toast';
// import './AddProduct.css';

// export default function AddProduct() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     base_price: '',
//     sale_price: '',
//     stock_quantity: '',
//     category_id: '',
//     tags: '',
//     is_featured: false
//   });

//   // Load categories on mount
//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     try {
//       const data = await api.categories.getAll();
//       setCategories(data || []);
//     } catch (error) {
//       console.error('Error loading categories:', error);
//       toast.error('Failed to load categories');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     console.log('Form field changed:', name, value); // Debug log
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
    
//     // Validate file count (max 5 images)
//     if (images.length + files.length > 5) {
//       toast.error('You can upload maximum 5 images');
//       return;
//     }

//     // Validate each file
//     const validFiles = files.filter(file => {
//       if (!file.type.startsWith('image/')) {
//         toast.error(`${file.name} is not an image`);
//         return false;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`${file.name} exceeds 5MB limit`);
//         return false;
//       }
//       return true;
//     });

//     if (validFiles.length === 0) return;

//     setImages(prev => [...prev, ...validFiles]);

//     // Create preview URLs
//     const newPreviews = validFiles.map(file => URL.createObjectURL(file));
//     setImagePreviews(prev => [...prev, ...newPreviews]);
//   };

//   const removeImage = (index) => {
//     // Clean up preview URL
//     URL.revokeObjectURL(imagePreviews[index]);
    
//     setImages(prev => prev.filter((_, i) => i !== index));
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const validateStep1 = () => {
//     if (!formData.name?.trim()) {
//       toast.error('Product name is required');
//       return false;
//     }
//     if (!formData.category_id) {
//       toast.error('Please select a category');
//       return false;
//     }
//     return true;
//   };

//   const validateStep2 = () => {
//     if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
//       toast.error('Please enter a valid price');
//       return false;
//     }
//     if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
//       toast.error('Please enter a valid stock quantity');
//       return false;
//     }
//     return true;
//   };

//   const validateStep3 = () => {
//     if (images.length === 0) {
//       toast.error('Please add at least one product image');
//       return false;
//     }
//     return true;
//   };

//   const nextStep = () => {
//     if (currentStep === 1 && validateStep1()) {
//       setCurrentStep(2);
//       window.scrollTo(0, 0);
//     } else if (currentStep === 2 && validateStep2()) {
//       setCurrentStep(3);
//       window.scrollTo(0, 0);
//     } else if (currentStep === 3 && validateStep3()) {
//       setCurrentStep(4);
//       window.scrollTo(0, 0);
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => prev - 1);
//     window.scrollTo(0, 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (currentStep < 4) {
//       nextStep();
//       return;
//     }

//     // Debug log to check form data
//     console.log('Form data before submission:', formData);
//     console.log('Images before submission:', images);

//     // Validate all fields before submission
//     if (!formData.name?.trim()) {
//       toast.error('Product name is required');
//       return;
//     }
//     if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
//       toast.error('Please enter a valid price');
//       return;
//     }
//     if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
//       toast.error('Please enter a valid stock quantity');
//       return;
//     }
//     if (!formData.category_id) {
//       toast.error('Please select a category');
//       return;
//     }
//     if (images.length === 0) {
//       toast.error('Please add at least one product image');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Create FormData for file upload
//       const productData = new FormData();
      
//       // Append all form fields - make sure to append as strings
//       productData.append('name', String(formData.name).trim());
//       productData.append('description', String(formData.description || ''));
//       productData.append('base_price', String(formData.base_price));
//       productData.append('sale_price', String(formData.sale_price || ''));
//       productData.append('stock_quantity', String(formData.stock_quantity));
//       productData.append('category_id', String(formData.category_id));
//       productData.append('tags', String(formData.tags || ''));
//       productData.append('is_featured', formData.is_featured ? 'true' : 'false');

//       // Log FormData entries for debugging
//       console.log('FormData entries:');
//       for (let pair of productData.entries()) {
//         console.log(pair[0] + ': ' + pair[1]);
//       }

//       // Append images
//       images.forEach((image, index) => {
//         productData.append('images', image);
//         console.log('Appending image:', image.name);
//       });

//       console.log('Sending product data to API...');
//       const response = await api.seller.addProduct(productData);
//       console.log('Product added successfully:', response);
      
//       // Clean up preview URLs
//       imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
//       toast.success('Product added successfully!');
//       navigate('/seller/products');
//     } catch (error) {
//       console.error('Error adding product:', error);
//       toast.error(error.message || 'Failed to add product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clean up preview URLs on unmount
//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach(url => URL.revokeObjectURL(url));
//     };
//   }, []);

//   return (
//     <div className="add-product-container">
//       <h1>Add New Product</h1>
      
//       {/* Progress Steps */}
//       <div className="progress-steps">
//         <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
//           <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
//           <div className="step-label">Basic Info</div>
//         </div>
//         <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
//           <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
//           <div className="step-label">Pricing</div>
//         </div>
//         <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
//           <div className="step-number">{currentStep > 3 ? '✓' : '3'}</div>
//           <div className="step-label">Images</div>
//         </div>
//         <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
//           <div className="step-number">4</div>
//           <div className="step-label">Review</div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="product-form" encType="multipart/form-data">
//         {/* Step 1: Basic Information */}
//         {currentStep === 1 && (
//           <div className="form-step">
//             <h2>Basic Information</h2>
            
//             <div className="form-group">
//               <label htmlFor="name">Product Name *</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="e.g., iPhone 13 Pro Max"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="description">Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Product description..."
//                 rows="5"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="category_id">Category *</label>
//               <select
//                 id="category_id"
//                 name="category_id"
//                 value={formData.category_id}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map(cat => (
//                   <option key={cat.id} value={cat.id}>{cat.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="tags">Tags (comma separated)</label>
//               <input
//                 type="text"
//                 id="tags"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="electronics, phone, apple"
//               />
//             </div>
//           </div>
//         )}

//         {/* Step 2: Pricing & Stock */}
//         {currentStep === 2 && (
//           <div className="form-step">
//             <h2>Pricing & Stock</h2>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="base_price">Base Price *</label>
//                 <input
//                   type="number"
//                   id="base_price"
//                   name="base_price"
//                   value={formData.base_price}
//                   onChange={handleChange}
//                   placeholder="0.00"
//                   min="0"
//                   step="0.01"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="sale_price">Sale Price</label>
//                 <input
//                   type="number"
//                   id="sale_price"
//                   name="sale_price"
//                   value={formData.sale_price}
//                   onChange={handleChange}
//                   placeholder="0.00"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="stock_quantity">Stock Quantity *</label>
//               <input
//                 type="number"
//                 id="stock_quantity"
//                 name="stock_quantity"
//                 value={formData.stock_quantity}
//                 onChange={handleChange}
//                 placeholder="10"
//                 min="0"
//                 required
//               />
//             </div>

//             <div className="form-group checkbox">
//               <label>
//                 <input
//                   type="checkbox"
//                   name="is_featured"
//                   checked={formData.is_featured}
//                   onChange={handleChange}
//                 />
//                 Feature this product
//               </label>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Images */}
//         {currentStep === 3 && (
//           <div className="form-step">
//             <h2>Product Images</h2>
//             <p className="step-description">Add high-quality images of your product (minimum 1 image, max 5)</p>

//             <div className="image-upload-area">
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageUpload}
//                 id="image-upload"
//                 className="file-input"
//                 disabled={images.length >= 5}
//               />
//               <label htmlFor="image-upload" className="upload-label">
//                 <span className="upload-icon">📸</span>
//                 <span className="upload-text">Click to upload images</span>
//                 <span className="upload-hint">PNG, JPG up to 5MB (max 5 images)</span>
//               </label>
//             </div>

//             {imagePreviews.length > 0 && (
//               <div className="image-preview-grid">
//                 {imagePreviews.map((url, index) => (
//                   <div key={index} className="image-preview">
//                     <img src={url} alt={`Preview ${index + 1}`} />
//                     <button 
//                       type="button" 
//                       onClick={() => removeImage(index)} 
//                       className="remove-image"
//                       title="Remove image"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Step 4: Review */}
//         {currentStep === 4 && (
//           <div className="form-step">
//             <h2>Review Your Product</h2>
//             <p className="step-description">Please review your product details before publishing</p>

//             <div className="review-section">
//               <h3>Basic Information</h3>
//               <div className="review-grid">
//                 <div className="review-item">
//                   <span className="review-label">Product Name:</span>
//                   <span className="review-value">{formData.name || 'Not provided'}</span>
//                 </div>
//                 <div className="review-item">
//                   <span className="review-label">Category:</span>
//                   <span className="review-value">
//                     {categories.find(c => c.id === parseInt(formData.category_id))?.name || 'Not selected'}
//                   </span>
//                 </div>
//                 {formData.description && (
//                   <div className="review-item full-width">
//                     <span className="review-label">Description:</span>
//                     <span className="review-value">{formData.description}</span>
//                   </div>
//                 )}
//                 {formData.tags && (
//                   <div className="review-item full-width">
//                     <span className="review-label">Tags:</span>
//                     <span className="review-value">{formData.tags}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="review-section">
//               <h3>Pricing & Stock</h3>
//               <div className="review-grid">
//                 <div className="review-item">
//                   <span className="review-label">Base Price:</span>
//                   <span className="review-value">${parseFloat(formData.base_price || 0).toFixed(2)}</span>
//                 </div>
//                 {formData.sale_price && (
//                   <div className="review-item">
//                     <span className="review-label">Sale Price:</span>
//                     <span className="review-value">${parseFloat(formData.sale_price).toFixed(2)}</span>
//                   </div>
//                 )}
//                 <div className="review-item">
//                   <span className="review-label">Stock Quantity:</span>
//                   <span className="review-value">{formData.stock_quantity || 0}</span>
//                 </div>
//                 <div className="review-item">
//                   <span className="review-label">Featured:</span>
//                   <span className="review-value">{formData.is_featured ? 'Yes' : 'No'}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="review-section">
//               <h3>Images</h3>
//               <p className="image-count">{imagePreviews.length} image(s) uploaded</p>
//               <div className="review-images">
//                 {imagePreviews.slice(0, 3).map((url, i) => (
//                   <img key={i} src={url} alt={`Review ${i}`} className="review-thumb" />
//                 ))}
//                 {imagePreviews.length > 3 && (
//                   <span className="more-images">+{imagePreviews.length - 3} more</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="form-navigation">
//           {currentStep > 1 && (
//             <button type="button" onClick={prevStep} className="btn-prev">
//               ← Back
//             </button>
//           )}
//           <button 
//             type="submit" 
//             className="btn-next"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner"></span>
//                 Processing...
//               </>
//             ) : currentStep === 4 ? (
//               'Publish Product'
//             ) : (
//               'Continue →'
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Quick link back to products */}
//       <div className="back-link">
//         <button onClick={() => navigate('/seller/products')} className="btn-text">
//           ← Back to Products
//         </button>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import toast from 'react-hot-toast';
import './AddProduct.css';

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
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

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.categories.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Form field changed:', name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count (max 5 images)
    if (images.length + files.length > 5) {
      toast.error('You can upload maximum 5 images');
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Clean up preview URL
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    if (!formData.name?.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    
    // FIXED: Better stock validation
    if (formData.stock_quantity === undefined || formData.stock_quantity === null || formData.stock_quantity === '') {
      toast.error('Stock quantity is required');
      return false;
    }
    
    const stockQty = parseInt(formData.stock_quantity);
    if (isNaN(stockQty) || stockQty < 0) {
      toast.error('Please enter a valid stock quantity');
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      window.scrollTo(0, 0);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 4) {
      nextStep();
      return;
    }

    // Debug log to check form data
    console.log('Form data before submission:', formData);
    console.log('Images before submission:', images);

    // Validate all fields before submission
    if (!formData.name?.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    // FIXED: Better stock validation
    if (formData.stock_quantity === undefined || formData.stock_quantity === null || formData.stock_quantity === '') {
      toast.error('Stock quantity is required');
      return;
    }
    
    const stockQty = parseInt(formData.stock_quantity);
    if (isNaN(stockQty) || stockQty < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }
    
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }
    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const productData = new FormData();
      
      // Append all form fields - make sure to append as strings
      productData.append('name', String(formData.name).trim());
      productData.append('description', String(formData.description || ''));
      productData.append('base_price', String(formData.base_price));
      productData.append('sale_price', String(formData.sale_price || ''));
      productData.append('stock_quantity', String(stockQty)); // Send parsed integer as string
      productData.append('category_id', String(formData.category_id));
      productData.append('tags', String(formData.tags || ''));
      productData.append('is_featured', formData.is_featured ? 'true' : 'false');

      // Log FormData entries for debugging
      console.log('FormData entries:');
      for (let pair of productData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Append images
      images.forEach((image, index) => {
        productData.append('images', image);
        console.log('Appending image:', image.name);
      });

      console.log('Sending product data to API...');
      const response = await api.seller.addProduct(productData);
      console.log('Product added successfully:', response);
      
      // Clean up preview URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      toast.success('Product added successfully!');
      navigate('/seller/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>
      
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
          <div className="step-label">Basic Info</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
          <div className="step-label">Pricing</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 3 ? '✓' : '3'}</div>
          <div className="step-label">Images</div>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Review</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-form" encType="multipart/form-data">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., iPhone 13 Pro Max"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                rows="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Category *</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="electronics, phone, apple"
              />
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Stock */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Pricing & Stock</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="base_price">Base Price *</label>
                <input
                  type="number"
                  id="base_price"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sale_price">Sale Price</label>
                <input
                  type="number"
                  id="sale_price"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stock_quantity">Stock Quantity *</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="10"
                min="0"
                required
              />
              <small className="form-text text-muted">
                Enter the number of items available in stock
              </small>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />
                Feature this product
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Images */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Product Images</h2>
            <p className="step-description">Add high-quality images of your product (minimum 1 image, max 5)</p>

            <div className="image-upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                id="image-upload"
                className="file-input"
                disabled={images.length >= 5}
              />
              <label htmlFor="image-upload" className="upload-label">
                <span className="upload-icon">📸</span>
                <span className="upload-text">Click to upload images</span>
                <span className="upload-hint">PNG, JPG up to 5MB (max 5 images)</span>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="image-preview">
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)} 
                      className="remove-image"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>Review Your Product</h2>
            <p className="step-description">Please review your product details before publishing</p>

            <div className="review-section">
              <h3>Basic Information</h3>
              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Product Name:</span>
                  <span className="review-value">{formData.name || 'Not provided'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Category:</span>
                  <span className="review-value">
                    {categories.find(c => c.id === parseInt(formData.category_id))?.name || 'Not selected'}
                  </span>
                </div>
                {formData.description && (
                  <div className="review-item full-width">
                    <span className="review-label">Description:</span>
                    <span className="review-value">{formData.description}</span>
                  </div>
                )}
                {formData.tags && (
                  <div className="review-item full-width">
                    <span className="review-label">Tags:</span>
                    <span className="review-value">{formData.tags}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="review-section">
              <h3>Pricing & Stock</h3>
              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Base Price:</span>
                  <span className="review-value">ETB{parseFloat(formData.base_price || 0).toFixed(2)}</span>
                </div>
                {formData.sale_price && (
                  <div className="review-item">
                    <span className="review-label">Sale Price:</span>
                    <span className="review-value">ETB{parseFloat(formData.sale_price).toFixed(2)}</span>
                  </div>
                )}
                <div className="review-item">
                  <span className="review-label">Stock Quantity:</span>
                  <span className="review-value">
                    {parseInt(formData.stock_quantity) || 0} units
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Featured:</span>
                  <span className="review-value">{formData.is_featured ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3>Images</h3>
              <p className="image-count">{imagePreviews.length} image(s) uploaded</p>
              <div className="review-images">
                {imagePreviews.slice(0, 3).map((url, i) => (
                  <img key={i} src={url} alt={`Review ${i}`} className="review-thumb" />
                ))}
                {imagePreviews.length > 3 && (
                  <span className="more-images">+{imagePreviews.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-prev">
              ← Back
            </button>
          )}
          <button 
            type="submit" 
            className="btn-next"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : currentStep === 4 ? (
              'Publish Product'
            ) : (
              'Continue →'
            )}
          </button>
        </div>
      </form>

      {/* Quick link back to products */}
      <div className="back-link">
        <button onClick={() => navigate('/seller/products')} className="btn-text">
          ← Back to Products
        </button>
      </div>
    </div>
  );
}