<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-between">
        <h3 class="page-title">Account Profile</h3>
        <div v-b-popover.hover="verifyButtonPopoverText">
          <button 
            v-if="!data.business_account_is_verified" 
            :disabled="prcNumberNotUploaded"
            class="btn btn-primary mb-3 ls-5"
            @click="verify">
            Verify
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-6">
        <view-profile-card 
          :data="data" 
          :owned="false"
          class="h-100"/>
      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        <list-container class="h-100"/>
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from 'moment';
import ViewProfileCard from '@/components/Profile/ViewProfileCard.vue';
import ListContainer from '@/components/Schedules/ListContainer';
export default {
  components: {
    ListContainer,
    ViewProfileCard
  },
  async asyncData({ params, app }) {
    const data = await app.$axios.$get(
      `/api/v1/users/${params.id}?include=roles`
    );
    const appointments = await app.$axios.$get(
      `/api/v1/users/${
        params.id
      }/appointments?include=property,property.agent,customer`
    );
    return { data: data.data };
  },
  data() {
    return {
      request: [],
      fulfilled: []
    };
  },
  computed: {
    prcNumberNotUploaded: function() {
      return this.data.prc_registration_number === null;
    },
    verifyButtonPopoverText() {
      return this.prcNumberNotUploaded ? 'Incomplete Profile' : '';
    }
  },
  methods: {
    verify() {
      this.$swal({
        text: 'Are you sure you want to verify this business account?',
        icon: 'warning',
        buttons: ['Cancel', 'Confirm']
      }).then(willDelete => {
        if (willDelete) {
          let businessAccountRole = this.data.roles.find(role => role.id > 3);
          let data = { role_id: businessAccountRole.id };
          this.$axios
            .$post(`/api/v1/users/${this.data.id}/verify`, data)
            .then(result => {
              this.$notify.success({
                message: 'Profile has been verified'
              });
              this.data.business_account_is_verified = true;
            });
        }
      });
    }
  }
};
</script>
