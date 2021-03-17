<template>
  <nuxt-child 
    :schedule-type="schedule" 
    @changedType="changedType"/>
</template>


<script>
export default {
  name: 'Schedules',
  async asyncData({ params, app, store }) {
    if (store.getters.isBusinessAccount) {
      const schedule = await app.$axios.$get(`/api/v1/account/schedules`);
      if (schedule.meta) {
        return { schedule: schedule.meta.schedule_type_id };
      } else {
        return { schedule: 0 };
      }
    } else {
      return { schedule: 0 };
    }
  },
  methods: {
    changedType(id) {
      this.schedule = id;
    }
  }
};
</script>
