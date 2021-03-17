<template>
  <page-container>

    <!-- Page Header -->
    <div 
      slot="page-header" 
      class="row justify-content-center">
      <div class="col-12 d-flex justify-content-between">
        <h3 class="page-title">
          Property Details
        </h3>
        <div 
          class="d-flex align-items-center">
          <!-- Publish Button -->
          <button
            v-if="showButtons" 
            class="btn btn-sm btn-success ls-5"
            @click="publish">
            PUBLISH
          </button>
          <!-- Reject Button -->
          <button
            v-if="showButtons" 
            class="btn btn-sm btn-warning ls-5 ml-2"
            @click="showModal">
            REJECT
          </button>
          <!-- Unpublish Button -->
          <button 
            v-if="showUnpublishButton" 
            class="btn btn-sm btn-secondary ls-5 ml-2"
            @click="unpublish">
            UNPUBLISH
          </button>
          <!-- Republish Button -->
          <button 
            v-if="showRepublishButton"
            class="btn btn-sm btn-danger ls-5 ml-2"
            @click="republish">
            REPUBLISH
          </button>
          <!-- Extend Button -->
          <button 
            v-if="showExtendButton"
            class="btn btn-sm btn-warning ls-5 ml-2"
            @click="extend">
            EXTEND
          </button>
          <!-- Sold Button -->
          <button 
            v-if="showSoldButton"
            class="btn btn-sm btn-success ls-5 ml-2"
            @click="sold">
            SOLD OR TENANTED
          </button>
          <h6 
            v-if="isExpired"
            style="font-weight: 900; color: red"
            class="ls-5 ml-2"
            disabled>
            STATUS: EXPIRED
          </h6>
        </div>
      </div>
    </div>
    <div 
      v-if="showExtendButton || showRepublishButton" 
      class="row">
      <div class="col-12 text-right">
        <span>{{ warningLabel }}</span>
      </div>
    </div>

    <!-- Property Rejected Error Message -->
    <div 
      v-if="showRejectComment" 
      class="row">
      <div class="col">
        <span class="badge badge-danger text-wrap">
          Property has been rejected. Lazatu Admin Message :
          <strong>{{ property.comment }}</strong>
        </span>
      </div>
    </div>

    <!-- Property Overview Card -->
    <div class="row justify-content-center mt-3">
      <div class="col-12 d-flex justify-content-between">
        <property-view :property="property"/>
      </div>
    </div>

    <!-- Property Details and History Container -->
    <div class="row justify-content-center mt-3">
      <div class="col-12 d-flex justify-content-between">
        <details-container :property="property"/>
      </div>
    </div>

    <!-- Rejection Message Modal -->
    <b-modal 
      ref="myModalRef" 
      title="REJECT THIS PROPERTY ?"
      hide-footer
      centered 
      header-text-variant="light"
      header-bg-variant="orange"
      @hidden="onHidden">
      <div>
        <form @submit.prevent="reject">
          <div class="form-group">
            <label for="comment">
              Reason for rejecting this property ?
            </label>
            <textarea 
              id="comment" 
              v-model="comment" 
              name="comment"
              rows="5"
              class="form-control"/>
            <span v-if="$v.comment.$error">
              <small
                v-if="!$v.comment.required"
                class="text-danger">
                This field is required
              </small>
              <small
                v-if="!$v.comment.minLength"
                class="text-danger">
                Provide at lease 10 characters
              </small>
            </span>
          </div>
          <button 
            type="submit" 
            class="btn btn-orange btn-block ls-5">
            <strong>
              SUBMIT
            </strong>
          </button>
        </form>
      </div>
    </b-modal>
  </page-container>
</template>

<script>
import * as moment from 'moment';
import PropertyView from '@/components/Properties/PropertyView';
import PageContainer from '@/components/Utils/PageContainer.vue';
import DetailsContainer from '@/components/Properties/DetailsContainer.vue';

const { required, minLength } = require('vuelidate/lib/validators');
export default {
  name: 'Property',

  components: {
    PropertyView,
    DetailsContainer,
    PageContainer
  },

  async asyncData({ params, app }) {
    const property = await app.$axios.$get(
      `/api/v1/properties/${params.id}?include=photos,attachments,features`
    );
    return { property: property.data };
  },

  data() {
    return {
      comment: ''
    };
  },

  computed: {
    showButtons() {
      return (
        !this.$store.getters.isBusinessAccount &&
        this.property.property_status_id == 2
      );
    },

    isExpired() {
      const isExpired = moment(this.property.expired_at).isSameOrBefore(
        moment()
      );

      return (
        !this.$store.getters.isBusinessAccount &&
        isExpired &&
        this.property.property_status_id == 1
      );
    },

    showUnpublishButton() {
      const isExpired = moment(this.property.expired_at).isSameOrBefore(
        moment()
      );

      return (
        !this.$store.getters.isBusinessAccount &&
        !isExpired &&
        this.property.property_status_id == 1
      );
    },

    showRepublishButton() {
      return (
        this.$store.getters.isBusinessAccount &&
        this.property.property_status_id == 1 &&
        moment(this.property.expired_at).isSameOrBefore(moment())
      );
    },

    showRejectComment() {
      return (
        this.property.property_status_id === 3 &&
        this.$store.getters.isBusinessAccount
      );
    },

    showExtendButton() {
      let inDateRange = false;
      let expired = false;
      if (this.property.expired_at) {
        let present = moment();
        let expired_at = moment(
          this.property.expired_at,
          'YYYY-MM-DD hh:mm A'
        ).endOf('day');

        let time_difference = moment(expired_at, 'YYYY-MM-DD hh:mm A').diff(
          present,
          'hours'
        );
        expired = time_difference < 0;
        inDateRange = time_difference <= 24;
      }
      return inDateRange && this.$store.getters.isBusinessAccount && !expired;
    },

    showSoldButton() {
      return (
        this.property.property_status_id === 1 &&
        this.$store.getters.isBusinessAccount &&
        moment(moment()).isBefore(this.property.expired_at)
      );
    },

    warningLabel() {
      let text = '';
      let hourDiff = moment().diff(this.property.expired_at, 'hours');
      let hum = moment.duration(hourDiff, 'hours').humanize();
      if (this.showRepublishButton) {
        text = `Expired ${hum} ago`;
      } else if (this.showExtendButton) {
        text = `Expires in ${hum}`;
      }

      return text;
    },

    sourcePage() {
      return this.$route.query.source_page || 1;
    }
  },

  validations: {
    comment: {
      required,
      minLength: minLength(10)
    }
  },

  methods: {
    async publish() {
      this.$swal({
        text: 'Are you sure you want to publish this property?',
        icon: 'warning',
        buttons: ['Cancel', 'Confirm']
      }).then(willDelete => {
        if (willDelete) {
          this.persistPublish();
        }
      });
    },

    async persistPublish() {
      await this.$axios
        .$put(`/api/v1/properties/${this.$route.params.id}/verify`)
        .then(result => {
          this.$notify.success({
            message: 'Property Published Successfully'
          });
          this.$router.push(`/account/properties?page=${this.sourcePage}`);
        })
        .catch(err => {
          console.err(err);
        });
    },

    showModal() {
      this.$refs.myModalRef.show();
    },

    onHidden(evt) {
      this.comment = '';
    },

    async reject() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.$axios
          .$put(
            `/api/v1/properties/${this.$route.params.id}/reject`,
            this.$data
          )
          .then(result => {
            this.$refs.myModalRef.hide();
            this.$notify.warning({
              message: result.message
            });
            this.$router.push(`/account/properties?page=${this.sourcePage}`);
          })
          .catch(err => {
            console.err(err);
          });
      }
    },

    async unpublish() {
      this.$swal({
        text: 'Are you sure you want to unpublish this property?',
        icon: 'warning',
        buttons: ['Cancel', 'Confirm']
      }).then(willDelete => {
        if (willDelete) {
          this.persistUnpublish();
        }
      });
    },

    async persistUnpublish() {
      await this.$axios
        .$put(`/api/v1/properties/${this.$route.params.id}/unpublish`)
        .then(result => {
          this.$notify.success({
            message: 'Property Unpublished Successfully'
          });
          this.$router.push(`/account/properties?page=${this.sourcePage}`);
        })
        .catch(err => {
          console.err(err);
        });
    },

    async republish() {
      this.$swal({
        text: 'Are you sure you want to republish this property?',
        icon: 'warning',
        buttons: ['Cancel', 'Confirm']
      }).then(willDelete => {
        if (willDelete) {
          this.peristRepublish();
        }
      });
    },

    async peristRepublish() {
      await this.$axios
        .$put(`/api/v1/properties/${this.$route.params.id}/republish`)
        .then(result => {
          this.$notify.success({
            message: 'Property Republished Successfully'
          });
          this.$router.push(`/account/properties?page=${this.sourcePage}`);
        })
        .catch(err => {
          console.err(err);
        });
    },

    async extend() {
      this.$swal({
        text: 'Are you sure you want to extend this property?',
        icon: 'warning',
        buttons: ['Cancel', 'Confirm']
      }).then(willDelete => {
        if (willDelete) {
          this.persistExtend();
        }
      });
    },

    async persistExtend() {
      await this.$axios
        .$put(`/api/v1/properties/${this.$route.params.id}/extend`)
        .then(result => {
          this.$notify.success({
            message: 'Expiration extensded successfully'
          });
          this.$router.push(`/account/properties?page=${this.sourcePage}`);
        })
        .catch(err => {
          console.err(err);
        });
    },

    async sold() {
      this.$swal({
        text: 'Are you sure to mark as sold this property?',
        icon: 'warning',
        buttons: ['Cancel', 'Confirm']
      }).then(willDelete => {
        if (willDelete) {
          this.persistSold();
        }
      });
    },

    async persistSold() {
      await this.$axios
        .$put(`/api/v1/properties/${this.$route.params.id}/sold`)
        .then(result => {
          this.$notify.success({
            message: 'Property set as sold.'
          });
          this.$router.push(`/account/properties?page=${this.sourcePage}`);
        })
        .catch(err => {
          console.err(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  color: #f49a0d !important;
  background-color: transparent;
}

.nav-pills .nav-link {
  color: #090b12 !important;
  font-size: 20px !important;
  margin-bottom: 1.5rem;
}
</style>
