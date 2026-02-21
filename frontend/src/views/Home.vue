<template>
  <div class="home">
    <h1>Welcome to E-Commerce</h1>

    <div v-if="loading">Loading user info...</div>

    <div v-else>
      <div v-if="isAuthenticated">
        <h2>Welcome back, {{ user?.name || user?.email }}!</h2>

        <!-- Test checkInGroup directly - NOW SAFE -->
        <div class="test-section">
          <h3>Group Check Test:</h3>
          <p>Is Admin: {{ checkInGroup("admin") ? "✅ Yes" : "❌ No" }}</p>
          <p>
            Is in 'users' group:
            {{ checkInGroup("users") ? "✅ Yes" : "❌ No" }}
          </p>

          <!-- Show admin panel if user is admin - NOW SAFE -->
          <div v-if="checkInGroup('admin')" class="admin-panel">
            <h4>Admin Panel (Only visible to admins)</h4>
            <p>Secret admin content here...</p>
          </div>
        </div>
      </div>

      <div v-else>
        <h2>Please login to continue</h2>
        <router-link to="/login">Go to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { authMixin } from "@/mixins/authMixin";

export default {
  name: "HomePage",
  mixins: [authMixin],

  mounted() {
    console.log("Home page mounted");
    // NOW SAFE - won't throw error
    console.log("Admin check from home:", this.checkInGroup("admin"));
  },
};
</script>

<style scoped>
.home {
  padding: 2rem;
}
.test-section {
  background: #f5f5f5;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}
.admin-panel {
  background: #d4edda;
  padding: 1rem;
  margin: 1rem 0;
  border-left: 4px solid green;
}
</style>
