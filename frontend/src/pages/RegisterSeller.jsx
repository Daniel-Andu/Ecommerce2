// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import './RegisterSeller.css';

// export default function RegisterSeller() {
//   const navigate = useNavigate();
//   const { registerSeller } = useAuth();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
  
//   const [formData, setFormData] = useState({
//     // Account Info
//     email: '',
//     password: '',
//     confirmPassword: '',
    
//     // Personal Info
//     first_name: '',
//     last_name: '',
//     phone: '',
    
//     // Business Info
//     business_name: '',
//     business_type: 'individual',
//     business_address: '',
//     business_phone: '',
//     tax_id: '',
//     website: '',
//     years_in_business: '',
    
//     // Documents
//     business_license: null,
//     tax_certificate: null,
//     id_document: null
//   });

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setFormData({
//         ...formData,
//         [name]: files[0]
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };

//   const calculatePasswordStrength = (password) => {
//     if (!password) return 0;
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (password.match(/[a-z]+/)) strength++;
//     if (password.match(/[A-Z]+/)) strength++;
//     if (password.match(/[0-9]+/)) strength++;
//     if (password.match(/[$@#&!]+/)) strength++;
//     return strength;
//   };

//   const getPasswordStrengthText = (strength) => {
//     if (strength <= 2) return { text: 'Weak', class: 'weak' };
//     if (strength <= 4) return { text: 'Medium', class: 'medium' };
//     return { text: 'Strong', class: 'strong' };
//   };

//   const passwordStrength = calculatePasswordStrength(formData.password);
//   const strengthInfo = getPasswordStrengthText(passwordStrength);

//   const validateStep = () => {
//     if (currentStep === 1) {
//       if (!formData.email || !formData.password || !formData.confirmPassword) {
//         toast.error('Please fill in all fields');
//         return false;
//       }
//       if (formData.password !== formData.confirmPassword) {
//         toast.error('Passwords do not match');
//         return false;
//       }
//       if (formData.password.length < 6) {
//         toast.error('Password must be at least 6 characters');
//         return false;
//       }
//       if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//         toast.error('Please enter a valid email');
//         return false;
//       }
//     }
    
//     if (currentStep === 2) {
//       if (!formData.first_name || !formData.last_name || !formData.phone) {
//         toast.error('Please fill in all personal information');
//         return false;
//       }
//       if (!formData.phone.match(/^[0-9]{10,15}$/)) {
//         toast.error('Please enter a valid phone number');
//         return false;
//       }
//     }
    
//     if (currentStep === 3) {
//       if (!formData.business_name || !formData.business_address) {
//         toast.error('Please fill in all business information');
//         return false;
//       }
//     }
    
//     return true;
//   };

//   const nextStep = () => {
//     if (validateStep()) {
//       setCurrentStep(currentStep + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep(currentStep - 1);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!agreeTerms) {
//       toast.error('Please agree to the terms and conditions');
//       return;
//     }
    
//     if (currentStep < 4) {
//       nextStep();
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       // Prepare data for API
//       const sellerData = {
//         email: formData.email,
//         password: formData.password,
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         phone: formData.phone,
//         business_name: formData.business_name,
//         business_type: formData.business_type,
//         business_address: formData.business_address,
//         business_phone: formData.business_phone || formData.phone,
//         tax_id: formData.tax_id,
//         website: formData.website,
//         years_in_business: formData.years_in_business
//       };
      
//       await registerSeller(sellerData);
//       toast.success('Seller account created! Please wait for approval.');
//       navigate('/seller/pending');
//     } catch (error) {
//       toast.error(error.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="seller-register-page">
//       <div className="seller-register-container">
//         {/* Header */}
//         <div className="register-header">
//           <Link to="/" className="logo">
//             <span className="logo-icon">🛍️</span>
//             <span className="logo-text">Marketplace</span>
//           </Link>
//           <h1>Become a Seller</h1>
//           <p>Join thousands of successful sellers on our marketplace</p>
//         </div>

//         {/* Progress Bar */}
//         <div className="progress-container">
//           <div className="progress-steps">
//             <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
//               <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
//               <div className="step-label">Account</div>
//             </div>
//             <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
//               <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
//               <div className="step-label">Personal</div>
//             </div>
//             <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
//               <div className="step-number">{currentStep > 3 ? '✓' : '3'}</div>
//               <div className="step-label">Business</div>
//             </div>
//             <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
//               <div className="step-number">4</div>
//               <div className="step-label">Review</div>
//             </div>
//           </div>
//           <div className="progress-bar">
//             <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="seller-form">
//           {/* Step 1: Account Information */}
//           {currentStep === 1 && (
//             <div className="form-step fade-in">
//               <h2>Create Your Account</h2>
//               <p className="step-description">Start your seller journey with a secure account</p>
              
//               <div className="form-group">
//                 <label>
//                   <span className="label-icon">📧</span>
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="you@example.com"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>
//                   <span className="label-icon">🔒</span>
//                   Password
//                 </label>
//                 <div className="password-field">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Create a strong password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="password-toggle"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//                 {formData.password && (
//                   <>
//                     <div className="password-strength">
//                       <div className={`strength-bar ${strengthInfo.class}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
//                     </div>
//                     <span className={`strength-text ${strengthInfo.class}`}>
//                       Password strength: {strengthInfo.text}
//                     </span>
//                   </>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label>
//                   <span className="label-icon">🔒</span>
//                   Confirm Password
//                 </label>
//                 <div className="password-field">
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Re-enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="password-toggle"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//                 {formData.confirmPassword && formData.password !== formData.confirmPassword && (
//                   <span className="error-text">Passwords do not match</span>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 2: Personal Information */}
//           {currentStep === 2 && (
//             <div className="form-step fade-in">
//               <h2>Personal Information</h2>
//               <p className="step-description">Tell us about yourself</p>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     <span className="label-icon">👤</span>
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleChange}
//                     placeholder="John"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>
//                     <span className="label-icon">👤</span>
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleChange}
//                     placeholder="Doe"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>
//                   <span className="label-icon">📱</span>
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="+251912345678"
//                   required
//                 />
//               </div>
//             </div>
//           )}

//           {/* Step 3: Business Information */}
//           {currentStep === 3 && (
//             <div className="form-step fade-in">
//               <h2>Business Information</h2>
//               <p className="step-description">Tell us about your business</p>

//               <div className="form-group">
//                 <label>
//                   <span className="label-icon">🏢</span>
//                   Business Name
//                 </label>
//                 <input
//                   type="text"
//                   name="business_name"
//                   value={formData.business_name}
//                   onChange={handleChange}
//                   placeholder="Your Store Name"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>
//                   <span className="label-icon">📋</span>
//                   Business Type
//                 </label>
//                 <select
//                   name="business_type"
//                   value={formData.business_type}
//                   onChange={handleChange}
//                 >
//                   <option value="individual">Individual / Sole Proprietor</option>
//                   <option value="company">Limited Company</option>
//                   <option value="partnership">Partnership</option>
//                   <option value="nonprofit">Non-profit Organization</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>
//                   <span className="label-icon">📍</span>
//                   Business Address
//                 </label>
//                 <textarea
//                   name="business_address"
//                   value={formData.business_address}
//                   onChange={handleChange}
//                   placeholder="Full business address"
//                   rows="3"
//                   required
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     <span className="label-icon">📞</span>
//                     Business Phone
//                   </label>
//                   <input
//                     type="tel"
//                     name="business_phone"
//                     value={formData.business_phone}
//                     onChange={handleChange}
//                     placeholder="Business phone (optional)"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>
//                     <span className="label-icon">🔢</span>
//                     Tax ID / License
//                   </label>
//                   <input
//                     type="text"
//                     name="tax_id"
//                     value={formData.tax_id}
//                     onChange={handleChange}
//                     placeholder="Tax ID (optional)"
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     <span className="label-icon">🌐</span>
//                     Website
//                   </label>
//                   <input
//                     type="url"
//                     name="website"
//                     value={formData.website}
//                     onChange={handleChange}
//                     placeholder="https://yourstore.com (optional)"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>
//                     <span className="label-icon">⏳</span>
//                     Years in Business
//                   </label>
//                   <input
//                     type="number"
//                     name="years_in_business"
//                     value={formData.years_in_business}
//                     onChange={handleChange}
//                     placeholder="Years (optional)"
//                     min="0"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Review */}
//           {currentStep === 4 && (
//             <div className="form-step fade-in">
//               <h2>Review Your Information</h2>
//               <p className="step-description">Please review your details before submitting</p>

//               <div className="review-section">
//                 <h3>Account Information</h3>
//                 <div className="review-grid">
//                   <div className="review-item">
//                     <span className="review-label">Email:</span>
//                     <span className="review-value">{formData.email}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="review-section">
//                 <h3>Personal Information</h3>
//                 <div className="review-grid">
//                   <div className="review-item">
//                     <span className="review-label">Name:</span>
//                     <span className="review-value">{formData.first_name} {formData.last_name}</span>
//                   </div>
//                   <div className="review-item">
//                     <span className="review-label">Phone:</span>
//                     <span className="review-value">{formData.phone}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="review-section">
//                 <h3>Business Information</h3>
//                 <div className="review-grid">
//                   <div className="review-item">
//                     <span className="review-label">Business Name:</span>
//                     <span className="review-value">{formData.business_name}</span>
//                   </div>
//                   <div className="review-item">
//                     <span className="review-label">Business Type:</span>
//                     <span className="review-value">{formData.business_type}</span>
//                   </div>
//                   <div className="review-item full-width">
//                     <span className="review-label">Address:</span>
//                     <span className="review-value">{formData.business_address}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="terms-section">
//                 <label className="terms-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={agreeTerms}
//                     onChange={(e) => setAgreeTerms(e.target.checked)}
//                   />
//                   <span>
//                     I agree to the <Link to="/terms">Terms of Service</Link>,{' '}
//                     <Link to="/privacy">Privacy Policy</Link>, and{' '}
//                     <Link to="/seller-agreement">Seller Agreement</Link>
//                   </span>
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="form-navigation">
//             {currentStep > 1 && (
//               <button type="button" onClick={prevStep} className="btn-prev">
//                 ← Back
//               </button>
//             )}
//             <button 
//               type="submit" 
//               className="btn-next"
//               disabled={loading || (currentStep === 4 && !agreeTerms)}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner"></span>
//                   Processing...
//                 </>
//               ) : currentStep === 4 ? (
//                 'Submit Application'
//               ) : (
//                 'Continue →'
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Login Link */}
//         <div className="login-link">
//           Already have an account? <Link to="/login">Sign in</Link>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './RegisterSeller.css';

export default function RegisterSeller() {
  const navigate = useNavigate();
  const { registerSeller } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeSellerTerms, setAgreeSellerTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    // Account Info
    email: '',
    password: '',
    confirmPassword: '',
    
    // Personal Info
    first_name: '',
    last_name: '',
    phone: '',
    
    // Business Info - REMOVED fields that don't exist in your database
    business_name: '',
    business_address: '',
    business_phone: '',
    tax_id: ''
    // Removed: business_type, website, years_in_business
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'agreeTerms') {
        setAgreeTerms(checked);
      } else if (name === 'agreeSellerTerms') {
        setAgreeSellerTerms(checked);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return { text: 'Weak', class: 'weak' };
    if (strength <= 4) return { text: 'Medium', class: 'medium' };
    return { text: 'Strong', class: 'strong' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthText(passwordStrength);

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all account fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.first_name || !formData.last_name || !formData.phone) {
      toast.error('Please fill in all personal information');
      return false;
    }
    if (!formData.phone.match(/^[0-9]{10,15}$/)) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.business_name || !formData.business_address) {
      toast.error('Please fill in all business information');
      return false;
    }
    return true;
  };

  const validateTerms = () => {
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }
    if (!agreeSellerTerms) {
      toast.error('Please agree to the seller agreement');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 4) {
      nextStep();
      return;
    }
    
    // Final validation including terms
    if (!validateTerms()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API - MATCHING YOUR DATABASE STRUCTURE
      const sellerData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        business_name: formData.business_name,
        business_address: formData.business_address,
        business_phone: formData.business_phone || formData.phone,
        tax_id: formData.tax_id
        // Removed: business_type, website, years_in_business
      };
      
      console.log('Submitting seller data:', sellerData);
      await registerSeller(sellerData);
      toast.success('Seller account created! Please wait for approval.');
      navigate('/seller/pending');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-register-page">
      <div className="seller-register-container">
        {/* Header */}
        <div className="register-header">
          <Link to="/" className="logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">Marketplace</span>
          </Link>
          <h1>Become a Seller</h1>
          <p>Join thousands of successful sellers on our marketplace</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
              <div className="step-label">Account</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
              <div className="step-label">Personal</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-number">{currentStep > 3 ? '✓' : '3'}</div>
              <div className="step-label">Business</div>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Terms</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="seller-form">
          {/* Step 1: Account Information */}
          {currentStep === 1 && (
            <div className="form-step fade-in">
              <h2>Create Your Account</h2>
              <p className="step-description">Start your seller journey with a secure account</p>
              
              <div className="form-group">
                <label>
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <div className="password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {formData.password && (
                    <>
                      <div className="password-strength">
                        <div className={`strength-bar ${strengthInfo.class}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                      </div>
                      <span className={`strength-text ${strengthInfo.class}`}>
                        {strengthInfo.text}
                      </span>
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">🔒</span>
                    Confirm Password
                  </label>
                  <div className="password-field">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="form-step fade-in">
              <h2>Personal Information</h2>
              <p className="step-description">Tell us about yourself</p>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <span className="label-icon">👤</span>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">👤</span>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251912345678"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Business Information - UPDATED to match your database */}
          {currentStep === 3 && (
            <div className="form-step fade-in">
              <h2>Business Information</h2>
              <p className="step-description">Tell us about your business</p>

              <div className="form-group">
                <label>
                  <span className="label-icon">🏢</span>
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Your Store Name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">📍</span>
                  Business Address *
                </label>
                <textarea
                  name="business_address"
                  value={formData.business_address}
                  onChange={handleChange}
                  placeholder="Full business address"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <span className="label-icon">📞</span>
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    name="business_phone"
                    value={formData.business_phone}
                    onChange={handleChange}
                    placeholder="Business phone (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-icon">🔢</span>
                    Tax ID / License
                  </label>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    placeholder="Tax ID (optional)"
                  />
                </div>
              </div>

              {/* Removed: Business Type, Website, Years in Business - they don't exist in your database */}
            </div>
          )}

          {/* Step 4: Terms and Conditions */}
          {currentStep === 4 && (
            <div className="form-step fade-in">
              <h2>Terms & Conditions</h2>
              <p className="step-description">Please review and accept our terms</p>

              <div className="terms-section">
                <div className="terms-box">
                  <h3>Seller Agreement</h3>
                  <div className="terms-content">
                    <p>By becoming a seller on our marketplace, you agree to:</p>
                    <ul>
                      <li>Provide accurate and truthful information about your products</li>
                      <li>Deliver products within the promised timeframe</li>
                      <li>Respond to customer inquiries within 24 hours</li>
                      <li>Accept our commission rate of 10% on each sale</li>
                      <li>Maintain high-quality customer service standards</li>
                      <li>Not sell prohibited or counterfeit items</li>
                      <li>Comply with all applicable laws and regulations</li>
                    </ul>
                  </div>
                </div>

                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={agreeTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I have read and agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                    <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>

                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    name="agreeSellerTerms"
                    checked={agreeSellerTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the <Link to="/seller-agreement">Seller Agreement</Link>
                  </span>
                </label>
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
                'Submit Application'
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}