<template>
  <div 
    id="shedules-list-item"
    class="card mb-2">
    <div 
      class="card-body p-3 cursorPointer" 
      @click="cardClick">
      <div class="row">
        <div class="col-4 mt-2 mb-2 border-right d-flex flex-column justify-content-center align-items-center date">
          <small> {{ appointmentDate.month }} </small>
          <h4 class="m-0"><strong> {{ appointmentDate.day }} </strong></h4>
          <small> {{ appointmentDate.dayOfWeek }} </small>
        </div>
        <div class="col-8 d-flex flex-column justify-content-center">
          <small class="mb-1 title">
            <strong>
              {{ data && data.property ? data.property.name : '' }} 
            </strong>
          </small>
          <small class="mb-1">
            <i>{{ data && data.property ? data.property.address : '' }}</i>
          </small>
          <div class="d-flex justify-content-between">
            <i class="la la-clock-o">
              <small>{{ time }}</small>
            </i>
            <span 
              :class="`badge badge-${statusColor}`">
              {{ data ? data.status : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <appointment-modal 
      ref="modal" 
      :appointment="data"/>
  </div>
</template>


<script>
import AppointmentModal from '@/components/Schedules/AppointmentModal.vue';
import * as moment from 'moment';
export default {
  name: 'ListItem',
  components: {
    AppointmentModal
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    appointmentDate: function() {
      return this.data
        ? {
            month: moment(this.data.date).format('MMM'),
            day: moment(this.data.date).format('DD'),
            dayOfWeek: moment(this.data.date).format('dddd')
          }
        : { month: '', day: '', dayOfWeek: '' };
    },
    time: function() {
      return this.data ? moment(this.data.start_time, 'hh').format('LT') : '';
    },
    statusColor: function() {
      switch (this.data.status_id) {
        case 1:
          return 'primary';
          break;
        case 2:
          return 'warning';
          break;
        case 3:
          return 'danger';
          break;
        case 4:
          return 'dark';
          break;
        case 5:
          return 'info';
          break;
        case 6:
          return 'success';
          break;
        case 7:
          return 'secondary';
          break;
      }
    }
  },
  methods: {
    cardClick() {
      if (!this.$store.getters.isBusinessAccount) {
        this.$refs.modal.show();
      }
    }
  }
};
</script>
