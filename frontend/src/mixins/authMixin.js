// src/mixins/authMixin.js
export const authMixin = {
    data() {
      return {
        user: null,
        loading: true
      }
    },
  
    computed: {
      // FIXED: Safe user groups - NEVER throws Object.keys error
      userGroups() {
        if (!this.user) return [];
        if (!this.user.groups) return [];
        if (Array.isArray(this.user.groups)) return this.user.groups;
        if (typeof this.user.groups === 'object') {
          // FIXED: Use empty object if groups is null
          return Object.keys(this.user.groups || {});
        }
        return [];
      },
  
      // Check if admin
      isAdmin() {
        return this.checkInGroup('admin');
      },
  
      // Check if logged in
      isAuthenticated() {
        return !!this.user;
      }
    },
  
    methods: {
      // FIXED: SAFE checkInGroup method - NEVER throws error
      checkInGroup(groupName = 'admin') {
        try {
          console.log('Checking group:', groupName);
          
          // If no user, return false
          if (!this.user) {
            console.log('No user logged in');
            return false;
          }
  
          // Check role first (common pattern)
          if (this.user.role) {
            if (this.user.role === groupName) return true;
            if (Array.isArray(this.user.role) && this.user.role.includes(groupName)) return true;
          }
  
          // Check groups
          if (this.user.groups) {
            if (Array.isArray(this.user.groups)) {
              return this.user.groups.includes(groupName);
            }
            if (typeof this.user.groups === 'object') {
              // FIXED: CRITICAL - Use empty object if groups is null/undefined
              const keys = Object.keys(this.user.groups || {});
              return keys.includes(groupName);
            }
          }
  
          // Check permissions as fallback
          if (this.user.permissions) {
            if (Array.isArray(this.user.permissions)) {
              return this.user.permissions.includes(groupName);
            }
          }
  
          return false;
        } catch (error) {
          console.error('Error in checkInGroup:', error);
          return false;
        }
      },
  
      // Fetch user from your backend
      async fetchUser() {
        try {
          this.loading = true;
          // Get token from localStorage
          const token = localStorage.getItem('token');
          
          if (!token) {
            this.user = null;
            this.loading = false;
            return;
          }
  
          // Call your backend API
          const response = await fetch('http://localhost:5000/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (response.ok) {
            this.user = await response.json();
            console.log('User loaded:', this.user);
          } else {
            // Token invalid
            localStorage.removeItem('token');
            this.user = null;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          this.user = null;
        } finally {
          this.loading = false;
        }
      },
  
      // Login method
      async login(email, password) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            localStorage.setItem('token', data.token);
            this.user = data.user;
            return { success: true, user: data.user };
          } else {
            return { success: false, error: data.message };
          }
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, error: 'Network error' };
        }
      },
  
      // Logout method
      logout() {
        localStorage.removeItem('token');
        this.user = null;
        // Redirect to login
        if (this.$router) {
          this.$router.push('/login');
        }
      }
    },
  
    // Auto-fetch user when component mounts
    mounted() {
      console.log('AuthMixin mounted - fetching user...');
      this.fetchUser();
    }
  };