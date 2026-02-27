// // // Image utilities for handling images
// // export const API_URL = 'http://localhost:5000';

// // export const getImageUrl = (url, fallback = 'https://placehold.co/600x400/6366F1/white?text=Marketplace') => {
// //   if (!url) return fallback;

// //   // Handle backend uploaded images
// //   if (url.startsWith('/uploads')) {
// //     return `${API_URL}${url}`;
// //   }

// //   // Handle local public images
// //   if (url.startsWith('/images')) {
// //     return url;
// //   }

// //   // Handle full URLs
// //   if (url.startsWith('http')) {
// //     return url;
// //   }

// //   return fallback;
// // };

// // export const handleImageError = (e, fallback = 'https://placehold.co/600x400/6366F1/white?text=Image+Not+Found') => {
// //   e.target.onerror = null;
// //   e.target.src = fallback;
// // };

// // // Placeholder images for different contexts
// // export const productPlaceholder = 'https://placehold.co/300x300/6366F1/white?text=Product';
// // export const categoryPlaceholder = 'https://placehold.co/600x400/8B5CF6/white?text=Category';
// // export const bannerPlaceholder = 'https://placehold.co/1200x400/EC4899/white?text=Special+Offer';
// // export const profilePlaceholder = 'https://placehold.co/200x200/10B981/white?text=User';
// // export const avatarPlaceholder = 'https://placehold.co/32x32/94A3B8/white?text=U';

// // // Grouped placeholders object for convenience
// // export const placeholders = {
// //   product: productPlaceholder,
// //   category: categoryPlaceholder,
// //   banner: bannerPlaceholder,
// //   profile: profilePlaceholder,
// //   avatar: avatarPlaceholder
// // };



// // Image utilities for handling images
// export const API_URL = 'http://localhost:5000';

// export const getImageUrl = (url, fallback = 'https://placehold.co/600x400/6366F1/white?text=Marketplace') => {
//   if (!url) return fallback;

//   // Handle backend uploaded images
//   if (url.startsWith('/uploads')) {
//     return `${API_URL}${url}`;
//   }

//   // Handle local public images
//   if (url.startsWith('/images')) {
//     return url;
//   }

//   // Handle full URLs
//   if (url.startsWith('http')) {
//     return url;
//   }

//   return fallback;
// };

// export const handleImageError = (e, fallback = 'https://placehold.co/600x400/6366F1/white?text=Image+Not+Found') => {
//   e.target.onerror = null;
//   e.target.src = fallback;
// };

// // Placeholder images for different contexts
// export const productPlaceholder = 'https://placehold.co/300x300/6366F1/white?text=Product';
// export const categoryPlaceholder = 'https://placehold.co/600x400/8B5CF6/white?text=Category';
// export const bannerPlaceholder = 'https://placehold.co/1200x400/EC4899/white?text=Special+Offer';
// export const profilePlaceholder = 'https://placehold.co/200x200/10B981/white?text=User';
// export const avatarPlaceholder = 'https://placehold.co/32x32/94A3B8/white?text=U';

// // Grouped placeholders object for convenience
// export const placeholders = {
//   product: productPlaceholder,
//   category: categoryPlaceholder,
//   banner: bannerPlaceholder,
//   profile: profilePlaceholder,
//   avatar: avatarPlaceholder
// };


// frontend/src/utils/imageUtils.js
// Use environment variable or fallback to production
export const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://e-commerce-backend-3i6r.onrender.com';

export const getImageUrl = (url, fallback = 'https://placehold.co/600x400/6366F1/white?text=Marketplace') => {
  // Handle undefined or null
  if (!url) return fallback;

  // Ensure url is a string
  const urlString = String(url);

  // Handle full URLs (already complete)
  if (urlString.startsWith('http')) {
    return urlString;
  }

  // Handle backend uploaded images (relative paths)
  if (urlString.startsWith('/uploads')) {
    return `${API_URL}${urlString}`;
  }

  // Handle local public images
  if (urlString.startsWith('/images')) {
    return urlString;
  }

  return fallback;
};

export const handleImageError = (e, fallback = 'https://placehold.co/600x400/6366F1/white?text=Image+Not+Found') => {
  e.target.onerror = null;
  e.target.src = fallback;
};

// Placeholder images for different contexts
export const productPlaceholder = 'https://placehold.co/300x300/6366F1/white?text=Product';
export const categoryPlaceholder = 'https://placehold.co/600x400/8B5CF6/white?text=Category';
export const bannerPlaceholder = 'https://placehold.co/1200x400/EC4899/white?text=Special+Offer';
export const profilePlaceholder = 'https://placehold.co/200x200/10B981/white?text=User';
export const avatarPlaceholder = 'https://placehold.co/32x32/94A3B8/white?text=U';

export const placeholders = {
  product: productPlaceholder,
  category: categoryPlaceholder,
  banner: bannerPlaceholder,
  profile: profilePlaceholder,
  avatar: avatarPlaceholder
};