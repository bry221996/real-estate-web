<template>
  <div 
    v-if="$store.getters.isBusinessAccount"
    id="welcome-message-ba" 
    class="container-fluid">
    <p v-text="`Welcome ${$store.state.auth.user.full_name} !`"/>
    <p>You can start by adding a property or completing your profile to be verified</p>
    <div class="row">
      <div class="col-lg-3 col-6">
        <b-card 
          no-body 
          class="text-center h-100 card-shadow card-border-radius"
          @click="addProperty">
          <p>
            <img
              class="mt-3 ba-dashboard-icons"
              src="~/assets/icons/Compound Path_1.png">
          </p>
          <p class="ls-5">
            <strong>ADD PROPERTY</strong>
          </p>
        </b-card>
      </div>
      <div class="col-lg-3 col-6">
        <b-card 
          no-body 
          class="text-center h-100 card-shadow card-border-radius"
          @click="completeProfile">
          <p>
            <img
              class="mt-3 ba-dashboard-icons"
              src="~/assets/icons/Compound Path_2.png">
          </p>
          <p class="ls-5">
            <strong>COMPLETE PROFILE</strong>
          </p>
        </b-card>
      </div>
    </div>
  </div>
  <div 
    v-else 
    class="container-fluid">
    <div class="row">
      <div 
        v-for="(card, index) in cards"
        :key="index"
        class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
        <dashboard-card
          :value="card.value" 
          :sub-value="card.sub_value" 
          :icon="card.icon"
          :title="card.title"
          :sub-label="card.sub_label"
          :route="card.route"
          :sub-lable-icon="card.sub_lable_icon"
          :icon-color="card.color"/>
      </div>
    </div>
  </div>
</template>


<script>
import DashboardCard from '@/components/Utils/DashboardCard';
export default {
  name: 'AdminDashboard',
  components: {
    DashboardCard
  },
  async asyncData({ params, app, store }) {
    if (!store.getters.isBusinessAccount) {
      const { data } = await app.$axios.$get(`/api/v1/statistics`);
      return data;
    }
  },
  computed: {
    cards() {
      return [
        {
          value: this.customers.total,
          sub_value: this.customers.registered_today,
          icon: 'ti-user',
          title: 'Customers',
          sub_label: 'Registered Today',
          route: '/account/customers',
          sub_lable_icon: 'la la-calendar',
          color: 'rgb(0, 184, 216)'
        },
        {
          value: this.business_accounts.total,
          sub_value: this.business_accounts.verified,
          icon: 'ti-briefcase',
          title: 'Business Accounts',
          sub_label: 'Verified',
          route: '/account/business-accounts',
          sub_lable_icon: 'la la-shield',
          color: 'rgb(23,198,113)'
        },
        {
          value: this.properties.total,
          sub_value: this.properties.published,
          icon: 'ti-agenda',
          title: 'Properties',
          sub_label: 'Published',
          route: '/account/properties',
          sub_lable_icon: 'la la-archive',
          color: 'rgb(255,180,0)'
        },
        {
          value: this.appointments.total,
          sub_value: this.appointments.completed,
          icon: 'ti-calendar',
          title: 'Appointments',
          sub_label: 'Completed',
          route: '/account/schedules',
          sub_lable_icon: 'la la-check-circle',
          color: 'rgb(255,65,105)'
        }
      ];
    }
  },
  methods: {
    addProperty() {
      this.$router.push('/account/properties/create');
    },
    completeProfile() {
      this.$router.push('/account/my-profile');
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
  .ba-dashboard-icons {
    width: 10vw;
  }
}
</style>
