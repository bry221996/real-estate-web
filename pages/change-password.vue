<template>
  <div id="change-password-page">
    <div class="container">
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
        @submit.prevent="changePassword">
        <div class="form-group row justify-content-center">
          <div class="col-12 col-md-8 col-md-10">
            <input 
              v-model="verification_code"
              placeholder="Verification Code"
              type="number" 
              class="form-control"
              @input="$v.verification_code.$touch()">
            <span v-if="$v.verification_code.$error">
              <small 
                v-show="!$v.verification_code.required"
                class="text-danger">
                Please provide the received code.
              </small>
            </span>
          </div>
        </div>
        <div class="form-group row justify-content-center">
          <div class="col-12 col-md-8 col-md-10">
            <input  
              v-model="new_password"
              placeholder="New Password"
              type="password" 
              class="form-control"
              @input="$v.new_password.$touch()">

            <span v-if="$v.new_password.$error">
              <small 
                v-show="!$v.new_password.required"
                class="text-danger">
                Please Provide your new Password
              </small>
              <small 
                v-show="!$v.new_password.minLength"
                class="text-danger">
                Provide at lease 6 characters password
              </small>
            </span>
          </div>
        </div>
        <div class="form-group row justify-content-center">
          <div class="col-12 col-md-8 col-md-10">
            <input  
              v-model="new_password_confirmation"
              placeholder="Confirm Password"
              type="password" 
              class="form-control"
              @input="$v.new_password_confirmation.$touch()">
            <span v-if="$v.new_password_confirmation.$error">
              <small 
                v-show="!$v.new_password_confirmation.sameAsNewPassword"
                class="text-danger">
                Password is not identical
              </small>
            </span>
          </div>
        </div>
        <div class="form-group row justify-content-center">
          <div class="col-12 col-md-8 col-md-10">
            <button
              class="btn btn-primary btn-block mb-2"
              style="background-color: black"
              type="submit">
              Change Password
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const { required, sameAs, minLength } = require('vuelidate/lib/validators');
export default {
  layout: 'auth',
  auth: false,
  middleware: 'notAuthenticated',
  data() {
    return {
      verification_code: '',
      new_password: '',
      new_password_confirmation: '',
      mobile: ''
    };
  },
  validations: {
    verification_code: { required },
    new_password: { required, minLength: minLength(6) },
    new_password_confirmation: { sameAsPassword: sameAs('new_password') }
  },
  mounted() {
    if (this.$route.query.mobile) {
      this.mobile = this.$route.query.mobile;
    } else {
      this.$router.push('/forgot-password');
    }
  },
  methods: {
    async changePassword() {
      await this.$axios.put('/api/password_reset', this.$data).then(res => {
        this.$notify.success({
          message: 'Password Updated Succesfully'
        });

        this.$router.push('/login');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#change-password-page {
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
  #change-password-page {
    margin-top: 25vh;
    .logo {
      margin-bottom: 10vh;
    }
  }
}
@media (min-width: 992px) {
  #change-password-page {
    margin-top: 35% !important;
  }
}
@media (min-width: 1199.98px) {
  #change-password-page {
    margin-top: 20vh !important;

    form {
      margin-top: 5vh;
    }
  }
}
</style>
