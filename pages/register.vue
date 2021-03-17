<template>
  <div 
    id="registration-page" 
    class="container mt-4">
    <div class="row justify-content-center mb-3">
      <div class="col-3 col-md-3">
        <nuxt-link to="/">
          <img
            class="p-0 logo"
            src="~/assets/icons/Lazatu_with_text.png">
        </nuxt-link>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-9">
        <form 
          class="w-100" 
          @submit.prevent="submit">
          <!-- Form Fields-->
          <div 
            v-for="(formInput, index) in formInputs"
            :key="index">
            <input-container 
              :ref="formInput.model"
              :model="formInput.model" 
              :default="formInput.default"
              :category="formInput.category"
              :type="formInput.type"
              :placeholder="formInput.placeholder"
              :has-error="formInput.hasError"
              :validations="formInput.validations"
              :options="formInput.options"
              container-class="w-100"
              @input="inputChanged"/>
          </div>
        </form>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-sm-9 p-0">
        <button
          class="btn btn-primary btn-block"
          style="background-color: black"
          @click="submit">
          SIGNUP
        </button>
      </div>
    </div>

    <div class="row justify-content-center mt-2 mb-5">
      <!-- Link to Login Page-->
      <div class="col-12 col-sm-9 p-0">
        <nuxt-link
          to="/login">
          <small>Already Registered Member ? Login here</small>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { helpers } from 'vuelidate/lib/validators';
import InputContainer from '@/components/Utils/InputContainer';

const {
  required,
  email,
  minValue,
  maxValue,
  minLength,
  sameAs
} = require('vuelidate/lib/validators');

const alpha = helpers.regex('alpha', /^639\d{9}$/);

export default {
  name: 'Register',
  layout: 'auth',
  middleware: 'notAuthenticated',
  components: {
    InputContainer
  },
  auth: false,
  data() {
    return {
      role_id: 0,
      first_name: '',
      last_name: '',
      mobile: null,
      email: '',
      username: '',
      password: '',
      password_confirmation: ''
    };
  },
  computed: {
    formInputs: function() {
      return [
        {
          model: 'role_id',
          category: 'select',
          hasError: this.$v.role_id.$error,
          validations: [
            {
              isError: !this.$v.role_id.minValue || !this.$v.role_id.maxValue,
              label: 'Select an Account Type'
            }
          ],
          default: 0,
          options: [
            {
              value: 0,
              text: 'Choose Business Account Type'
            },
            { value: 4, text: 'Owner' },
            { value: 5, text: 'Agent' }
          ]
        },
        {
          model: 'first_name',
          placeholder: 'Firstname',
          hasError: this.$v.first_name.$error,
          validations: [
            {
              isError: !this.$v.first_name.required,
              label: 'First Name is required'
            }
          ]
        },
        {
          model: 'last_name',
          placeholder: 'Lastname',
          hasError: this.$v.last_name.$error,
          validations: [
            {
              isError: !this.$v.last_name.required,
              label: 'Last Name is required'
            }
          ]
        },
        {
          model: 'mobile',
          placeholder: 'Mobile Number',
          type: 'number',
          category: 'input-group',
          hasError: this.$v.mobile.$error,
          validations: [
            { isError: !this.$v.mobile.required, label: 'Mobile is required' },
            { isError: !this.$v.mobile.alpha, label: '639********* as format' }
          ]
        },
        {
          model: 'email',
          placeholder: 'Email Address',
          hasError: this.$v.email.$error,
          type: 'email',
          validations: [
            {
              isError: !this.$v.email.required,
              label: 'Email Address is required'
            },
            {
              isError: !this.$v.email.email,
              label: 'Please enter a valid email'
            }
          ]
        },
        {
          model: 'username',
          placeholder: 'Username',
          hasError: this.$v.username.$error,
          validations: [
            {
              isError: !this.$v.username.required,
              label: 'Username is required'
            }
          ]
        },
        {
          model: 'password',
          placeholder: 'Password',
          type: 'password',
          hasError: this.$v.password.$error,
          validations: [
            {
              isError: !this.$v.password.required,
              label: 'Password is required'
            },
            {
              isError: !this.$v.password.minLength,
              label: 'Provide at lease 6 characters password'
            }
          ]
        },
        {
          model: 'password_confirmation',
          placeholder: 'Confirm Password',
          type: 'password',
          hasError: this.$v.password_confirmation.$error,
          validations: [
            {
              isError: !this.$v.password_confirmation.sameAsPassword,
              label: 'Password is not identical'
            }
          ]
        }
      ];
    }
  },
  validations: {
    role_id: { required, minValue: minValue(4), maxValue: maxValue(5) },
    first_name: { required },
    last_name: { required },
    mobile: {
      required,
      alpha
    },
    email: { required, email },
    username: { required },
    password: { required, minLength: minLength(6) },
    password_confirmation: { sameAsPassword: sameAs('password') }
  },

  mounted() {
    let queryKeys = Object.keys(this.$route.query);
    let dataKeys = Object.keys(this.$data);
    queryKeys.map(key => {
      if (dataKeys.includes(key)) {
        this.$data[key] = this.$route.query[key];

        if (key in this.$refs) {
          this.$refs[key][0].setValue(this.$route.query[key]);
        }
      }
    });
  },

  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.$axios
          .$post('/api/register', this.$data)
          .then(res => {
            this.$notify.success({
              message: 'Registration Successful'
            });
            this.$auth
              .loginWith('password_grant', {
                data: {
                  grant_type: 'password',
                  client_id: process.env.clientId,
                  client_secret: process.env.clientSecret,
                  scope: '',
                  username: this.mobile,
                  password: this.password
                }
              })
              .then(result => {
                this.$router.push('/account');
                this.resetForm();
              });
          })
          .catch(err => {
            let errors = err.response.data.errors;
            if ('mobile' in errors || 'email' in errors) {
              this.$notify.warning({
                message: 'Mobile or Email Already Exists'
              });
            }
          });
      }
    },
    resetForm() {
      this.$v.$reset();
      this.formInputs.map(input => {
        this.$refs[input.model][0].resetValue();
        this.$data[input.model] = input.default;
      });
    },
    inputChanged(model, value) {
      this.$v[model].$model = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 80%;
}
@media (max-width: 767.98px) {
  #registration-page {
    .page-title,
    .page-sub-title {
      font-size: 1.2rem !important;
    }
    .page-sub-title {
      text-align: center;
    }
  }
}
@media (min-width: 768px) and (max-width: 991.98px) {
  .page-title,
  .page-sub-title,
  .page-sub-title {
    text-align: center;
  }
}

@media (min-width: 992px) {
  .page-title,
  .page-sub-title,
  .page-sub-title {
    text-align: center;
  }
}
</style>
