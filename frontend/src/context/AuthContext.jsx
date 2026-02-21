// import React, { createContext, useContext, useState, useEffect } from 'react';
// import * as api from '../api';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         setLoading(false);
//         return;
//       }
      
//       try {
//         console.log('Initializing auth with token');
//         const userData = await api.auth.me();
//         console.log('User data loaded:', userData);
        
//         // Ensure seller_status is set for sellers
//         if (userData.role === 'seller' && !userData.seller_status) {
//           userData.seller_status = 'pending';
//         }
        
//         localStorage.setItem('user', JSON.stringify(userData));
//         setUser(userData);
//       } catch (error) {
//         console.error('Auth init error:', error);
//         // Clear invalid token
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     initAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       console.log('Logging in:', email);
//       const { token, user: userData } = await api.auth.login({ email, password });
      
//       // Ensure seller_status is set for sellers
//       if (userData.role === 'seller' && !userData.seller_status) {
//         userData.seller_status = 'pending';
//       }
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userData));
//       setUser(userData);
//       return userData;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const register = async (data) => {
//     try {
//       console.log('Registering:', data.email);
//       const { token, user: userData } = await api.auth.register(data);
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userData));
//       setUser(userData);
//       return userData;
//     } catch (error) {
//       console.error('Register error:', error);
//       throw error;
//     }
//   };

//   const registerSeller = async (data) => {
//     try {
//       console.log('Registering seller:', data.email);
//       const { token, user: userData } = await api.auth.registerSeller(data);
      
//       // Set seller status to pending
//       userData.seller_status = 'pending';
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userData));
//       setUser(userData);
//       return userData;
//     } catch (error) {
//       console.error('Seller register error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const updateUser = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     registerSeller,
//     logout,
//     updateUser,
//     setUser: updateUser,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }



import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('Initializing auth with token');
        const userData = await api.auth.me();
        console.log('User data loaded:', userData);
        
        // Ensure seller_status is set for sellers
        if (userData.role === 'seller' && !userData.seller_status) {
          userData.seller_status = 'pending';
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error('Auth init error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // ============= NEW: SAFE checkInGroup FUNCTION =============
  const checkInGroup = (groupName = 'admin') => {
    try {
      console.log(`Checking if user is in group: ${groupName}`);
      
      // Case 1: No user logged in
      if (!user) {
        console.log('No user logged in');
        return false;
      }

      // Case 2: Check role property (common pattern)
      if (user.role) {
        if (Array.isArray(user.role)) {
          return user.role.includes(groupName);
        }
        if (typeof user.role === 'string') {
          return user.role === groupName;
        }
      }

      // Case 3: Check groups property (array)
      if (user.groups) {
        if (Array.isArray(user.groups)) {
          return user.groups.includes(groupName);
        }
        if (typeof user.groups === 'object') {
          return Object.keys(user.groups).includes(groupName);
        }
      }

      // Case 4: Check permissions object
      if (user.permissions) {
        if (Array.isArray(user.permissions)) {
          return user.permissions.includes(groupName);
        }
        if (typeof user.permissions === 'object') {
          return Object.keys(user.permissions).includes(groupName);
        }
      }

      // Case 5: Common role checks
      if (groupName === 'admin' && user.isAdmin) {
        return true;
      }
      
      if (groupName === 'seller' && user.role === 'seller') {
        return true;
      }

      // No match found
      return false;
      
    } catch (error) {
      console.error('Error in checkInGroup:', error);
      return false;
    }
  };
  // ============= END NEW FUNCTION =============

  // Helper function to check if user is admin
  const isAdmin = () => {
    return checkInGroup('admin');
  };

  // Helper function to check if user is seller
  const isSeller = () => {
    return checkInGroup('seller');
  };

  // Helper function to check if user has specific role
  const hasRole = (role) => {
    return checkInGroup(role);
  };

  const login = async (email, password) => {
    try {
      console.log('Logging in:', email);
      const { token, user: userData } = await api.auth.login({ email, password });
      
      // Ensure seller_status is set for sellers
      if (userData.role === 'seller' && !userData.seller_status) {
        userData.seller_status = 'pending';
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      console.log('Registering:', data.email);
      const { token, user: userData } = await api.auth.register(data);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const registerSeller = async (data) => {
    try {
      console.log('Registering seller:', data.email);
      const { token, user: userData } = await api.auth.registerSeller(data);
      
      // Set seller status to pending
      userData.seller_status = 'pending';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Seller register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    register,
    registerSeller,
    logout,
    updateUser,
    setUser: updateUser,
    // NEW: Add all the group checking functions
    checkInGroup,
    isAdmin,
    isSeller,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}