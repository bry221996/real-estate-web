<template>
  <div 
    id="calendar-wrapper" 
    class="col">
    <no-ssr>
      <full-calendar 
        ref="scheduleCalendar"
        :events="appointments"
        :config="config"
        :header="{
          left: 'today prev,next',
          center: 'title',
          right: 'month,agendaDay'
        }"
        default-view="month"
        @event-selected="onEventSelected"/>
    </no-ssr>
  </div>
</template>


<script>
export default {
  name: 'SchedulesCalendarView',
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      appointments: [],
      selectedAppointment: {},
      config: {
        displayEventTime: false,
        editable: false,
        eventLimit: true,
        eventLimitText: 'more',
        eventLimitClick: 'day',
        height: 'auto'
      }
    };
  },
  mounted() {
    this.transformEvents();
  },
  methods: {
    // Transform Events receive from Parent Component.
    transformEvents() {
      for (var appointment of this.events) {
        this.appointments.push({
          id: appointment.id,
          title: appointment.property.agent.full_name,
          start: `${appointment.date} ${appointment.start_time}`,
          end: `${appointment.date} ${appointment.end_time}`,
          backgroundColor: this.statusColor(appointment.status_id),
          textColor: 'white !important'
        });
      }
    },
    // Get Status Color based on its status id.
    statusColor(id) {
      switch (id) {
        case 1:
          return '#0069d9';
          break;
        case 2:
          return '#ffc107';
          break;
        case 3:
          return '#dc3545';
          break;
        case 4:
          return '#343a40';
          break;
        case 5:
          return '#138496';
          break;
        case 6:
          return '#28a745';
          break;
        default:
          return '#6c757d';
      }
    },
    // Trigger when an event is selected.
    onEventSelected(event, jsEvent, view) {
      this.$emit('show-details', event.id);
    }
  }
};
</script>
