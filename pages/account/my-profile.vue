<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-between">
        <h3 class="page-title">My Profile</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-6">
        <view-profile-card 
          :data="data" 
          :owned="true"/>
      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        <edit-profile-card 
          :account="data"
          @update="onAccountUpdate"/>
      </div>
    </div>
  </div>
</template>

<script>
import ViewProfileCard from '@/components/Profile/ViewProfileCard.vue';
import EditProfileCard from '@/components/Profile/EditProfileCard.vue';

export default {
  name: 'MyProfile',
  components: {
    ViewProfileCard,
    EditProfileCard
  },
  async asyncData({ app }) {
    const data = await app.$axios.$get('/api/v1/account?include=roles');
    return { data: data.data };
  },
  methods: {
    onAccountUpdate(user) {
      this.data = user;
    }
  }
};
</script>
