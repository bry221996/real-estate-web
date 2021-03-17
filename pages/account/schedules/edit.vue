<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 class="page-title">Manage Schedule</h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card card-shadow edit-schedule">
          <div class="card-body mr-3 ml-3">
            <div class="row">
              <p class="m-0 setupNote">
                Kindly select your availability for booking appointments
              </p>
            </div>
            <div class="row">
              <p class="m-0 setupNote">
                Note. When selected, the preferred days & time will appear on customer booking page
              </p>
            </div>
            <div class="row mt-3">
              <h4 id="optionTitle">
                PLEASE SELECT ONE
              </h4>
            </div>
            <div class="row mt-1 mb-4">
              <div class="table-responsive">
                <table 
                  id="scheduleOptions" 
                  class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col"/>
                      <th 
                        scope="col" 
                        class="text-sm-center">DAYS</th>
                      <th 
                        scope="col" 
                        class="text-sm-center">TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="option in $store.state.scheduleOptions" 
                      :key="option.value"
                      @click="select(option.value)">
                      <td 
                        class="mt-5 mb-5" 
                        scope="row">
                        <input 
                          :id="`option-${option.value}`" 
                          :value="option.value" 
                          v-model="schedule_type_id" 
                          class="form-check-input pl-2" 
                          type="radio"
                          name="scheduleOptions">
                        {{ option.label }}
                      </td>
                      <td class="text-sm-center">{{ option.day }}</td>
                      <td class="text-sm-center">{{ option.hours }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row mb-3 d-flex justify-content-between">
              <div class="col-lg-3 col-md-3 col-sm-3 col-5">
                <button 
                  id="cancelButton"
                  class="btn btn-primary btn-block"
                  @click="$router.push('/account/schedules')">
                  <strong>
                    BACK
                  </strong>
                </button>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-3 col-5">
                <button 
                  id="submitButton"
                  :disabled="isDisabled" 
                  type="submit"
                  class="btn btn-success btn-block"
                  @click="saveSchedules">
                  <strong>
                    {{ scheduleType ? 'UPDATE' : 'SUBMIT' }}
                  </strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditSchedules',
  props: {
    scheduleType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isDisabled: true,
      schedule_type_id: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.schedule_type_id = this.scheduleType;
    });
  },
  methods: {
    select(value) {
      this.schedule_type_id = value;
      this.isDisabled = this.schedule_type_id === this.scheduleType;
    },
    async saveSchedules() {
      let data = {
        schedule_type_id: this.schedule_type_id
      };

      this.scheduleType
        ? await this.$axios.$put('/api/v1/account/schedules', data)
        : await this.$axios.$post('/api/v1/account/schedules', data);

      this.$emit('changedType', this.schedule_type_id);

      this.$router.push('/account/schedules');
    }
  }
};
</script>

<style scoped>
.edit-schedule {
  color: #313435;
  border-radius: 1rem;
}

#scheduleOptions th,
#scheduleOptions td {
  padding: 1.5rem;
}

@media (max-width: 575.98px) {
  #scheduleOptions th,
  #scheduleOptions td {
    padding: 1rem 1rem;
    font-size: 80%;
  }

  .setupNote,
  #cancelButton,
  #submitButton {
    font-size: 80%;
  }

  #pageTitle,
  #optionTitle {
    font-size: 15px;
  }
}
</style>
