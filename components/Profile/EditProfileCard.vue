<template>
  <div class="edit-profile card card-shadow pl-2 pr-2">
    <div class="border-bottom card-header">
      <h6 class="m-0">
        <strong>Account Details</strong>
      </h6>
    </div>
    <div class="card-body">
      <form>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="firstname">Firstname</label>
            <input 
              id="firstname"
              v-model.trim="first_name" 
              type="text" 
              class="form-control"
              @input="$v.first_name.$touch()">
            <span v-if="$v.first_name.$error">
              <small class="text-danger">
                This field is required.
              </small>
            </span>
          </div>
          <div class="form-group col-md-6">
            <label for="lastname">Lastname</label>
            <input 
              id="lastname" 
              v-model.trim="last_name" 
              type="text" 
              class="form-control"
              @input="$v.last_name.$touch()">
            <span v-if="$v.last_name.$error">
              <small class="text-danger">
                This field is required.
              </small>
            </span>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="mobile">Mobile</label>
            <input 
              id="mobile" 
              v-model="mobile" 
              type="text" 
              class="form-control"
              disabled>
          </div>
          <div class="form-group col-md-6">
            <label for="email">Email</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              class="form-control"
              disabled>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="username">Username</label>
            <input 
              id="username" 
              v-model="username" 
              type="text" 
              class="form-control"
              disabled>
          </div>
          <div class="form-group col-md-6">
            <label for="location">Location</label>
            <input 
              id="location" 
              v-model="location" 
              type="text" 
              class="form-control">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="gender">Gender</label>
            <select
              id="gender"
              v-model="gender"
              class="form-control">
              <option :value="null">Choose Your Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div class="form-group col-md-6">
            <label for="maritalStatus">Marital Status</label>
            <select
              id="maritalStatus"
              v-model="marital_status"
              class="form-control">
              <option :value="null">Choose Your Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="separated">Separated</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="prcNumber">PRC Number</label>
            <input 
              id="prcNumber" 
              v-model="prc_registration_number"
              type="text" 
              class="form-control">
          </div>
          <div class="form-group col-md-6">
            <label 
              id="profileLabel"
              for="prcFile">
              PRC File
            </label>
            <div 
              id="prcFile" 
              class="edit-profile__prc-file">
              <label 
                for="attachmentUpload" 
                class="btn btn-secondary">
                {{ prcFileButtonText }}
              </label>
              <input 
                id="attachmentUpload" 
                type="file" 
                accept=".doc,.docx,application/msword,image/*,application/pdf" 
                class="form-control-file d-none"
                @change="uploadAttachment">
              <div
                v-if="prc_id_link"
                class="btn-group mb-2 mr-2"
                role="group" >
                <div 
                  id="fileLink" 
                  class="btn btn-sm card" 
                  v-html="attachmentName"/>
                <div 
                  id="removeIcon" 
                  class="btn btn-sm card"
                  @click="removeAttachment">
                  <span>
                    <i class="la la-close"/>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-row pull-right">
          <button 
            :disabled="nothingToUpdate"
            class="btn btn-light mr-1"
            @click.prevent="cancel">
            Cancel
          </button>
          <button 
            :disabled="nothingToUpdate || hasError" 
            type="submit"
            class="btn btn-primary"
            @click.prevent="update">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const { required } = require('vuelidate/lib/validators');
export default {
  name: 'EditProfileCard',
  props: {
    account: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      first_name: '',
      email: '',
      gender: null,
      last_name: '',
      location: '',
      marital_status: '',
      mobile: '',
      prc_registration_number: '',
      prc_id_link: null,
      username: '',
      fileToUpload: {}
    };
  },
  validations: {
    first_name: { required },
    last_name: { required }
  },
  computed: {
    nothingToUpdate() {
      let boolean = true;
      this.accountKeys.forEach(key => {
        boolean = boolean && this.$data[key] == this.account[key];
      });
      return boolean;
    },
    hasError() {
      return this.$v.$invalid;
    },
    prcFileButtonText() {
      return this.prc_id_link ? 'Change' : 'Upload';
    },
    accountKeys() {
      const keys = Object.keys(this.$data);
      let filtered = keys.filter(function(value, index, arr) {
        return value !== 'fileToUpload';
      });

      return filtered;
    },
    attachementRemoved() {
      let boolean = true;
      if (this.prc_id_link) {
        boolean = !this.prc_id_link.includes('https://');
      }
      return this.account.prc_id_link !== null && boolean;
    },
    attachmentName() {
      return (
        this.fileToUpload.name ||
        `<a 
          href='${this.prc_id_link}' 
          target='_blank'> 
          ${this.account.full_name}
          PRC File
        </a>`
      );
    },
    fileTypes() {
      return ['image', 'doc', 'msword', 'pdf'];
    }
  },
  mounted() {
    this.reset();
  },
  methods: {
    // CANCEL CHANGES FROM EDITING
    cancel() {
      this.reset();
    },
    // RESET FORM FROM ORIGINAL DATA
    reset() {
      this.fileToUpload = {};
      $('#attachmentUpload').val(null);
      this.accountKeys.forEach(key => {
        this.$data[key] = this.account[key];
      });
    },
    // UPLOAD PRC FILE ATTACHMENT
    uploadAttachment(e) {
      if (!e.target.files.length) return;
      const file = e.target.files[0];

      if (this.fileIsValid(file.type)) {
        this.fileToUpload = {};
        const reader = new FileReader();

        this.fileToUpload.file = file;
        this.fileToUpload.name = file.name;

        reader.readAsDataURL(file);
        reader.onload = e => {
          this.prc_id_link = e.target.result;
        };
      } else {
        e.preventDefault();
        this.$notify.warning({
          message: 'Invalid File Type.'
        });
      }
    },
    // CHECK FILE VALIDITY
    fileIsValid(fileType) {
      let valid = false;
      this.fileTypes.map(file => {
        valid = valid || fileType.includes(file);
      });
      return valid;
    },
    // REMOVE PRC FILE ATTACHMENT
    removeAttachment() {
      this.prc_id_link = null;
      this.fileToUpload = {};
      $('#attachmentUpload').val(null);
    },
    // UPDATE PROFILE WITH WARNING MODAL
    update() {
      this.$swal({
        text: 'Are you sure you want to update profile ?',
        icon: 'warning',
        buttons: ['Cancel', 'Confirm']
      }).then(next => {
        if (next) {
          this.persist();
        }
      });
    },
    // PERSIST IN UPDATING PROFILE
    async persist() {
      if (this.attachementRemoved) {
        await this.$axios.$delete('/api/v1/account/prc_id');
      }

      if (this.fileToUpload.file) {
        const form = new FormData();
        form.append('photo', this.fileToUpload.file);
        await this.$axios.$post('/api/v1/account/prc_id', form);
      }
      const response = await this.$axios.$put('/api/v1/account', this.$data);
      this.$emit('update', response.meta.user);

      setTimeout(() => {
        this.reset();
        this.$notify.success({
          message: 'Profile updated sucessfully.'
        });
      }, 1000);
    }
  }
};
</script>
