<template>
  <div class="login">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>

      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <div v-if="error" class="error">{{ error }}</div>
    </form>

    <p>
      Don't have an account? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>

<script>
import { authMixin } from "@/mixins/authMixin";

export default {
  name: "LoginPage",
  mixins: [authMixin],

  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },

  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = "";

      const result = await this.login(this.email, this.password);

      if (result.success) {
        // Redirect to home page
        this.$router.push("/");
      } else {
        this.error = result.error;
      }

      this.loading = false;
    },
  },
};
</script>
