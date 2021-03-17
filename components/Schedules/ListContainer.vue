<template>
  <div class="card card-shadow list-container pl-2 pr-2">
    <tabs
      :tabs="tabs"
      :current-tab="currentTab"
      :wrapper-class="'default-tabs'"
      :tab-class="'default-tabs__item'"
      :tab-active-class="'default-tabs__item_active'"
      :line-class="'default-tabs__active-line'"
      @onClick="handleClick"
    />
    <div class="card-body p-0">
      <div 
        v-if="currentTab === 'request'" 
        class="container-fluid p-4 h-100 d-flex flex-column" >
        <list-item 
          v-for="(appointment, index) in request"
          :data="appointment" 
          :key="index"/>
        <div 
          v-if="request.length < 1" 
          class="card text-center mt-2 mb-2">
          <div class="card-body">
            <small>No Incoming Appointments Yet</small>
          </div>
        </div>
        <!-- Footer Here -->
        <list-footer 
          id="request" 
          :meta="requestMeta"
          @next="onNext" 
          @prev="onPrevious"/>

      </div>
      <div 
        v-if="currentTab === 'fulfilled'" 
        class="container-fluid p-4 h-100 d-flex flex-column" >
        <list-item 
          v-for="(appointment, index) in fulfilled"
          :data="appointment" 
          :key="index"/>
        <div  
          v-if="fulfilled.length < 1" 
          class="card text-center mt-2 mb-2">
          <div class="card-body">
            <small>No Fulfilled Appointment Yet</small>
          </div>
        </div>

        <!-- Footer Here -->
        <list-footer 
          id="fulfilled"
          :meta="fulfilledMeta"
          @next="onNext" 
          @prev="onPrevious"/>
      </div>
    </div>
  </div>
</template>

<script>
import ListItem from '@/components/Schedules/ListItem';
import ListFooter from '@/components/Schedules/ListFooter';
import Tabs from 'vue-tabs-with-active-line';
export default {
  components: {
    Tabs,
    ListItem,
    ListFooter
  },
  data() {
    return {
      tabs: [
        { title: 'Booking Request', value: 'request' },
        { title: 'Fulfilled Appointment', value: 'fulfilled' }
      ],
      currentTab: 'request',
      request: [],
      fulfilled: [],
      requestMeta: {},
      fulfilledMeta: {}
    };
  },
  computed: {
    baseUrl() {
      return `/api/v1/users/${
        this.$route.params.id
      }/appointments?include=property,property.agent,customer&per_page=5`;
    },
    requestUrl() {
      return `${
        this.baseUrl
      }&filter[status]=Pending,Confirmed,Rejected,Cancelled,Reschedule`;
    },
    fulfilledUrl() {
      return `${this.baseUrl}&filter[status]=Completed`;
    }
  },
  mounted() {
    this.getRequestBooking();
    this.getCompletedBooking();
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },

    // Get Booking Request
    async getRequestBooking() {
      await this.$axios.$get(this.requestUrl).then(res => {
        this.request = res.data;
        this.requestMeta = res.meta;
      });
    },

    //Get Fulfilled Booking
    async getCompletedBooking() {
      await this.$axios.$get(this.fulfilledUrl).then(res => {
        this.fulfilled = res.data;
        this.fulfilledMeta = res.meta;
      });
    },

    async onNext(id) {
      const page = this[`${id}Meta`].current_page + 1;

      if (page <= this[`${id}Meta`].last_page) {
        await this.$axios.$get(`${this[`${id}Url`]}&page=${page}`).then(res => {
          this[id] = res.data;
          this[`${id}Meta`] = res.meta;
        });
      }
    },

    async onPrevious(id) {
      const page = this[`${id}Meta`].current_page - 1;

      if (page > 0) {
        await this.$axios.$get(`${this[`${id}Url`]}&page=${page}`).then(res => {
          this[id] = res.data;
          this[`${id}Meta`] = res.meta;
        });
      }
    }
  }
};
</script>
