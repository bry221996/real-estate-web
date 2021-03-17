<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col schedule-page__header">
        <h3 class="page-title">
          Schedules
        </h3>
        <div 
          class="btn-group mb-2" 
          role="group" 
          aria-label="Basic example">
          <button 
            :class="selectedView == 'table' ? 'btn-primary' : 'btn-secondary'" 
            type="button"
            class="btn btn-sm no-active-outline"
            @click="onChangeView('table')">
            <i class="la la-table"/>
            Table View
          </button>
          <button 
            :class="selectedView == 'calendar' ? 'btn-primary' : 'btn-secondary'" 
            type="button"
            class="btn btn-sm no-active-outline"
            @click="onChangeView('calendar')">
            <i class="la la-calendar-o"/>
            Calendar View
          </button>
        </div>
      </div>
    </div>
    <div 
      v-if="$store.getters.isBusinessAccount"
      class="row mb-3">
      <div class="col">
        <availability :schedule-type="scheduleType"/>
      </div>
    </div>

    <div 
      v-if="selectedView == 'table'" 
      class="row">
      <table-view @show-details="onShowDetails"/>
    </div>

    <div 
      v-if="selectedView == 'calendar'" 
      class="row appointments">
      <calendar-view 
        :events="temp" 
        @show-details="onShowDetails"/>
    </div>

    <appointment-modal 
      ref="modal" 
      :appointment="selectedAppointment"
      @close-modal="onCloseModal"/>
  </div>
</template>

<script>
import * as moment from 'moment';
import TableView from '@/components/Schedules/TableView.vue';
import CalendarView from '@/components/Schedules/CalendarView.vue';
import AppointmentModal from '@/components/Schedules/AppointmentModal.vue';
import Availability from '@/components/Schedules/Availability.vue';

export default {
  name: 'IndexSchedule',
  async asyncData({ params, app, store }) {
    let appointments = {};
    if (store.getters.isBusinessAccount) {
      appointments = await app.$axios.$get(
        `/api/v1/account/appointments?include=property,property.agent,customer&per_page=1000`
      );
    } else {
      appointments = await app.$axios.$get(
        `/api/v1/appointments?include=property,property.agent,customer&per_page=1000`
      );
    }
    return { temp: appointments.data };
  },
  components: {
    TableView,
    CalendarView,
    AppointmentModal,
    Availability
  },
  props: {
    scheduleType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectedView: 'calendar',
      appointments: [],
      selectedAppointment: {},
      config: {
        displayEventTime: false,
        editable: false,
        eventLimit: true,
        eventLimitText: 'more',
        eventLimitClick: 'day'
      }
    };
  },
  computed: {
    setupDetails() {
      if (this.scheduleType === 0) {
        return 'You havent setup your schedule';
      }
      let setup = this.$store.state.scheduleOptions.find(
        option => option.value === this.scheduleType
      );

      let details = `I'm available during <strong>${
        setup.label
      }</strong>, <strong>${setup.day}</strong> from <strong>${
        setup.hours
      }</strong>`;

      return details;
    },
    pageHeaderClass() {
      return this.$store.getters.isBusinessAccount
        ? 'col d-flex justify-content-center justify-content-sm-end'
        : 'col schedule-page__header';
    }
  },
  methods: {
    onCloseModal() {
      this.selectedAppointment = {};
    },

    onShowDetails(id) {
      this.selectedAppointment = this.temp.find(app => app.id == id);
      this.$refs.modal.show();
    },

    onChangeView(view) {
      this.selectedView = view;
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
  #setupDetails {
    font-size: 80% !important;
  }

  .appointments .col-12 {
    padding: 0px;
  }
}
@media (max-width: 767.98px) {
  #calendar-wrapper {
    margin-top: 20px;
  }
}
@media (min-width: 500px) {
  .schedule-page__header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
