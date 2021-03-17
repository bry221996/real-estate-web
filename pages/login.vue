<template>
  <div
    id="login-page"
    class="container">
    <div class="row d-flex justify-content-center mb-3">
      <div class="col-4 col-md-4 d-flex align-items-center">
        <nuxt-link to="/">
          <img
            class="p-0 logo"
            src="~/assets/icons/Lazatu_with_text.png">
        </nuxt-link>
      </div>
    </div>
    <form
      class="form-signin"
      @submit.prevent="login">
      <div class="form-group row justify-content-center">
        <div class="col-12 col-md-8 col-lg-10">
          <input
            v-model="username"
            type="text"
            name="username"
            class="form-control"
            placeholder="Username">
        </div>
      </div>
      <div class="form-group row justify-content-center">
        <div class="col-12 col-md-8 col-lg-10">
          <input
            v-model="password"
            type="password"
            name="password"
            class="form-control"
            placeholder="Password">
        </div>
      </div>
      <br>
      <div class="form-group row justify-content-center">
        <div class="col-12 col-md-8 col-md-10 text-center">
          <button
            class="btn btn-primary btn-block mb-2"
            style="background-color: black"
            type="submit">
            Sign in
          </button>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-md-10">
          <div class="row m-0 p-0 text-center">
            <div class="col-12 col-md-12 col-lg-6 p-0 text-lg-left">
              <nuxt-link
                to="/forgot-password">
                <small>Forgot Password ? Reset here</small>
              </nuxt-link>
            </div>
            <div class="col-12 col-md-12 col-lg-6 p-0 text-lg-right ">
              <nuxt-link
                to="/register">
                <small>Not Yet Member ? Register here</small>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'auth',
  auth: false,
  middleware: 'notAuthenticated',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      await this.$auth
        .loginWith('password_grant', {
          data: {
            grant_type: 'password',
            client_id: process.env.clientId,
            client_secret: process.env.clientSecret,
            scope: '',
            username: this.username,
            password: this.password
          }
        })
        .then(result => {
          if (this.$store.getters.isCustomerAccountOnly) {
            this.$auth.logout();
            this.$notify.warning({
              message: "You're account has no access"
            });
          } else {
            this.$notify.success({
              message: 'Login Successful'
            });
            this.$router.push('/account');
          }
        })
        .catch(err => {
          this.$notify.warning({
            message: 'Invalid Credentials'
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#login-page {
  margin-top: 10%;
}

.logo {
  width: 80%;
}

@media (max-width: 767.98px) {
  form {
    margin-top: 20vw;
  }
  .logo {
    width: 100% !important;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  #login-page {
    margin-top: 25vh;
    .logo {
      margin-bottom: 10vh;
    }
  }
}
@media (min-width: 992px) {
  #login-page {
    margin-top: 35% !important;
  }
}
@media (min-width: 1199.98px) {
  #login-page {
    margin-top: 20vh !important;

    form {
      margin-top: 5vh;
    }
  }
}
</style>
