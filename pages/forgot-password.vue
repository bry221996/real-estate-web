<template>
  <div
    id="forgot-password-page"
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
      @submit.prevent="requestCode">
      <div class="form-group row justify-content-center">
        <div class="col-12 col-md-8 col-md-10">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">+63</div>
            </div>
            <input 
              id="inlineFormInputGroupUsername" 
              v-model="mobile_temp"
              placeholder="Mobile Number"
              type="number"
              class="form-control"
              @input="mobileInput">
          </div>
          <span v-if="$v.mobile.$error">
            <small 
              v-show="!$v.mobile.required"
              class="text-danger">
              Please Provide your mobile number.
            </small>
            <small 
              v-show="!$v.mobile.alpha"
              class="text-danger">
              Use 639********* as a format
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
            Request Code for Verification
          </button>
        </div>
      </div>
    </form>
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-md-10">
        <nuxt-link
          to="/login">
          <small>Not Yet Member ? Register here</small>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { helpers } from 'vuelidate/lib/validators';
const { required } = require('vuelidate/lib/validators');

const alpha = helpers.regex('alpha', /^639\d{9}$/);

export default {
  layout: 'auth',
  auth: false,
  middleware: 'notAuthenticated',
  data() {
    return {
      mobile: '',
      mobile_temp: ''
    };
  },
  validations: {
    mobile: { required, alpha }
  },
  methods: {
    mobileInput() {
      if (this.mobile_temp) {
        this.$v.mobile.$model = `63${this.mobile_temp}`;
      } else {
        this.$v.mobile.$model = '';
      }
    },
    async requestCode() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.$axios
          .post('/api/password_reset/request_code', {
            mobile: this.mobile
          })
          .then(res => {
            this.$notify.success({
              message: 'Sms Verification Sent to Your Mobile'
            });
            this.$router.push(`/change-password?mobile=${this.mobile}`);
          })
          .catch(err => {
            this.$notify.warning({
              message: 'Mobile Number not Exists'
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#inlineFormInputGroupUsername:focus {
  outline: none !important;
  box-shadow: none !important;
}
#forgot-password-page {
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
  #forgot-password-page {
    margin-top: 25vh;
    .logo {
      margin-bottom: 10vh;
    }
  }
}
@media (min-width: 992px) {
  #forgot-password-page {
    margin-top: 35% !important;
  }
}
@media (min-width: 1199.98px) {
  #forgot-password-page {
    margin-top: 20vh !important;

    form {
      margin-top: 5vh;
    }
  }
}
</style>
