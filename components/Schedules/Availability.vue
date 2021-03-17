<template>
  <div class="card card-shadow  availability">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <p class="m-0">
            {{ text }}
            <nuxt-link to="/account/schedules/edit">
              <span class="mb-0 ml-1">Change Availability here.</span>
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Availability',
  props: {
    scheduleType: {
      type: Number,
      default: 0
    }
  },
  computed: {
    text() {
      if (this.scheduleType) {
        const type = this.$store.state.scheduleOptions.find(
          option => option.value === this.scheduleType
        );
        return `I'm available during 
          ${type.label}, 
          ${type.day} from 
          ${type.hours}.`;
      }

      return 'You havent setup your schedule';
    }
  }
};
</script>
