<template>
  <div class="profile card card-shadow pl-2 pr-2">
    <div class="card-body">
      <div class="row justify-content-center">
        <div class="col-4">
          <div
            :style="`background-image: url(${data.photo || 'https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png'});`"
            class="ratio img-responsive img-circle m-3"
          />
        </div>
      </div>
      <div 
        v-if="owned"
        class="row justify-content-center mt-1">
        <label 
          for="imageUpload" 
          class="btn btn-sm btn-light mb-2">
          Change Image
        </label>
        <input
          id="imageUpload"
          type="file"
          class="form-control-file d-none"
          accept="image/*"
          @change="onChange">
      </div>
      <div class="row justify-content-center mt-3">
        <h4 class="m-0">
          <strong>{{ data.full_name }}</strong>
        </h4>
      </div>
      <div class="row justify-content-center">
        <span class="text-muted d-block mb-2">
          {{ accountType }}
        </span>
      </div>
      <div class="row justify-content-center">
        <h3 class="m-0">
          <span :class="`badge badge-${status.variant}`">{{ status.text }}</span>
        </h3>
      </div>
      <div 
        v-if="!owned"
        class="container-fluid profile__details mb-4">
        <hr>
        <div class="row">
          <div class="col-6">
            <span class="text-muted">
              Mobile Number
            </span>
            <p>{{ data.mobile }}</p>
          </div>
          <div class="col-6">
            <span class="text-muted">
              Email Address
            </span>
            <p>{{ data.email }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <span class="text-muted">
              Username
            </span>
            <p>{{ data.username }}</p>
          </div>
          <div class="col-6">
            <span class="text-muted">
              Gender
            </span>
            <p>{{ data.gender || '---' }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <span class="text-muted">
              Location
            </span>
            <p>{{ data.location || '---' }}</p>
          </div>
          <div class="col-6">
            <span class="text-muted">
              Marital Status
            </span>
            <p>{{ data.marital_status || '---' }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <span class="text-muted">
              PRC Number
            </span>
            <p>{{ data.prc_registration_number || '---' }}</p>
          </div>
          <div class="col-6">
            <span class="text-muted">
              PRC File
            </span>
            <p>
              <a 
                :href="data.prc_id_link"
                target="_blank">
                {{ data.prc_id_link ? 'View' : '*No file' }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewProfileCard',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    owned: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uploadingPhoto: null
    };
  },
  computed: {
    accountType() {
      if (this.owned && !this.$store.getters.isBusinessAccount) {
        return 'Admin Account';
      }
      return 'Business Account';
    },
    status() {
      if (this.data.business_account_is_verified) {
        return {
          text: 'Verified',
          variant: 'success'
        };
      } else {
        if (this.data.prc_registration_number === null) {
          return {
            text: 'Incomplete',
            variant: 'secondary'
          };
        } else {
          return {
            text: 'Unverified',
            variant: 'warning'
          };
        }
      }
    }
  },
  methods: {
    async onChange(e) {
      if (!e.target.files.length) return;

      const file = e.target.files[0];

      if (this.fileIsValid(file.type)) {
        let THIS = this;
        new ImageCompressor(file, {
          quality: 0.6,
          success(result) {
            const reader = new FileReader();
            THIS.uploadingPhoto = result;

            reader.onload = e => {
              THIS.data.photo = e.target.result;
              THIS.uploadPhoto();
            };
            reader.readAsDataURL(result);
          }
        });
      } else {
        e.preventDefault();
        this.$notify.warning({
          message: 'Invalid File Type.'
        });
      }
    },
    // UPLOAD PHOTO
    async uploadPhoto() {
      const form = new FormData();
      form.append('photo', this.uploadingPhoto);
      const response = await this.$axios.$post('/api/v1/account/photo', form);
      this.data.photo = response.meta.user.photo;
      this.$notify.success({
        message: 'Profile photo changed sucessfully.'
      });
    },
    // CHECK FILE VALIDITY
    fileIsValid(fileType) {
      return fileType.includes('image');
    }
  }
};
</script>
