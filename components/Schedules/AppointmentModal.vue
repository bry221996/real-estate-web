<template>
  <b-modal 
    ref="appointmentModal" 
    hide-header
    hide-footer
    centered
    @hidden="$emit('close-modal')">
    <!-- MODAL HEADER -->
    <div 
      v-if="appointment"
      class="card" 
      style="letter-spacing: 0.8px;">
      <div 
        :style="`background-color: ${headerBackgroundColor}; color:white`"
        class="card-header d-flex justify-content-between">
        {{ header }}
        <div 
          class="close__modal" 
          @click="close">
          <i 
            class="la la-times" />
        </div>
      </div>

      <!-- MODAL BODY -->
      <div class="card-body">
        <div class="container">
          <div class="row">
            <small class="mr-2 mb-0"><strong>PROPERTY:</strong></small>
            <small class="upperCase mb-0">{{ name }}</small>
          </div>
          <div class="row">
            <small class="mr-2 mb-0"><strong>DATE & TIME:</strong></small>
            <small class="upperCase mb-0">{{ dateTime }}</small>
          </div>
          <div class="row">
            <small class="mr-2 mb-0"><strong>ADDRESS:</strong></small>
            <small class="upperCase mb-0">{{ address }}</small>
          </div>
          <div class="row mt-3">

            <!-- BUSINESS ACCOUNT DETAILS -->
            <div class="col-lg-6 pr-1 pl-1">
              <div class="card p-5 mb-1">
                <div class="container-fluid">
                  <div class="row">
                    <small>
                      <strong>Business Account Details</strong>
                    </small>
                  </div>
                  <div class="row mt-2">
                    <small>
                      <strong>Name : </strong> {{ agent.name }}
                    </small>
                  </div>
                  <div 
                    v-if="! $store.getters.isBusinessAccount" 
                    class="row mt-2">
                    <small>
                      <strong>Contact No : </strong> {{ agent.mobile }}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- CUSTOMER ACCOUNT DETAILS -->
            <div class="col-lg-6 pr-1 pl-1">
              <div class="card p-5 mb-1">
                <div class="container-fluid">
                  <div class="row">
                    <small>
                      <strong>Customer Account Details</strong>
                    </small>
                  </div>
                  <div class="row mt-2">
                    <small>
                      <strong>Name : </strong> {{ customer.name }}
                    </small>
                  </div>
                  <div 
                    v-if="! $store.getters.isBusinessAccount" 
                    class="row mt-2">
                    <small>
                      <strong>Contact No : </strong> {{ customer.mobile }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as moment from 'moment';
export default {
  name: 'AppointmentModal',
  props: {
    appointment: {
      type: Object,
      required: true
    }
  },
  computed: {
    dateTime() {
      return this.appointment
        ? moment(this.appointment.date).format('DD MMM dddd') +
            ' , ' +
            moment(this.appointment.start_time, 'hh:mm').format('LT')
        : '';
    },
    address() {
      return this.appointment.property
        ? `${this.appointment.property.formatted_address}`
        : '';
    },
    name() {
      return this.appointment.property
        ? `${this.appointment.property.name}`
        : '';
    },
    agent() {
      return this.appointment.property
        ? {
            name: this.appointment.property.agent.full_name,
            mobile: this.appointment.property.agent.mobile
          }
        : { name: '', mobile: '' };
    },
    customer() {
      return this.appointment.customer
        ? {
            name: this.appointment.customer.full_name,
            mobile: this.appointment.customer.mobile
          }
        : { name: '', mobile: '' };
    },

    header() {
      let data = this.appointment.status;
      if (data == 'Rejected') {
        data = 'Declined';
      }
      return this.appointment ? `Status: ${data}` : '';
    },

    headerBackgroundColor() {
      return this.appointment
        ? this.statusColor(this.appointment.status_id)
        : 'Yellow';
    }
  },
  methods: {
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
    show() {
      this.$refs.appointmentModal.show();
    },
    close() {
      this.$refs.appointmentModal.hide();
      this.$emit('close-modal');
    }
  }
};
</script>

<style lang="scss" scoped>
.card-body {
  color: #313435;
}
.close__modal {
  height: 1.5rem;
  width: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  &:hover {
    border: 1px solid white;
  }
}
</style>
