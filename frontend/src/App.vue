<template>
  <div id="app">
    <!-- Show loading spinner while checking auth -->
    <div v-if="loading" class="loading">Loading...</div>

    <!-- Show main content when loaded -->
    <div v-else>
      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-brand">E-Commerce</div>
        <div class="nav-menu">
          <router-link to="/">Home</router-link>
          <router-link to="/products">Products</router-link>
          <router-link to="/cart">Cart</router-link>

          <!-- Show admin link only if user is admin - NOW SAFE -->
          <router-link v-if="isAdmin" to="/admin">Admin</router-link>

          <!-- Show user info or login/register -->
          <template v-if="isAuthenticated">
            <span class="user-email">{{ user?.email }}</span>
            <button @click="logout" class="btn-logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
          </template>
        </div>
      </nav>

      <!-- Page content -->
      <router-view />
    </div>
  </div>
</template>

<script>
import { authMixin } from "@/mixins/authMixin";

export default {
  name: "App",
  mixins: [authMixin],

  mounted() {
    console.log("App mounted");
    // NOW SAFE - won't throw error
    const isUserAdmin = this.checkInGroup("admin");
    console.log("Is user admin?", isUserAdmin);
  },
};
</script>

<style>
/* Basic styles */
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.navbar {
  background: #333;
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
}

.nav-menu a {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
}

.nav-menu a:hover {
  text-decoration: underline;
}

.user-email {
  margin-left: 1rem;
  color: #ffd700;
}

.btn-logout {
  margin-left: 1rem;
  background: red;
  color: white;
  border: none;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}
</style>
