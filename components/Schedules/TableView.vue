<template>
  <div class="col">
    <no-ssr>
      <data-table
        :table-id="id"
        :ajax-url="url"
        :column-header="header"
        :column-data="columns"
        :column-defs="columnDefinitions"
        :menu-actions="actions"
        :searchable="true"
        :additional-search-columns="additionalSearch"
        @view-schedule="onViewSchedule"/>
    </no-ssr>
  </div>
</template>

<script>
import DataTable from '@/components/Utils/DataTable.vue';
export default {
  name: 'SchedulesTableView',
  components: {
    DataTable
  },
  data() {
    return {
      id: '#schedules',
      actions: ['view-schedule'],
      additionalSearch: ['address']
    };
  },
  computed: {
    header() {
      return ['Property', 'Address', 'Date', 'Time', 'Status', 'Actions'];
    },
    columns() {
      let columns = [
        { data: 'property', searchable: false },
        { data: 'property', searchable: false },
        { data: 'date', searchable: false },
        { data: 'start_time', searchable: false },
        { data: 'status', searchable: false },
        { data: 'id', searchable: false }
      ];

      return columns;
    },
    url() {
      return this.$store.getters.isBusinessAccount
        ? `${
            process.env.BASE_URL
          }/api/v1/account/appointments?include=property,property.agent,customer`
        : `${
            process.env.BASE_URL
          }/api/v1/appointments?include=property,property.agent,customer`;
    },
    columnDefinitions() {
      const THIS = this;
      return [
        {
          targets: 0,
          render(e) {
            return e.name;
          }
        },
        {
          targets: 1,
          render(e) {
            return e.formatted_address;
          }
        },
        {
          targets: -2,
          className: 'text-center',
          render(data, type, full) {
            if (data == 'Rejected') {
              data = 'declined';
            }
            let variant = '';
            switch (full.status_id) {
              case 1:
                variant = 'primary';
                break;
              case 2:
                variant = 'warning';
                break;
              case 3:
                variant = 'danger';
                break;
              case 4:
                variant = 'dark';
                break;
              case 5:
                variant = 'info';
                break;
              case 6:
                variant = 'success';
                break;
              case 7:
                variant = 'secondary';
                break;
            }
            return `<span class="badge badge-${variant}">${data}</span>`;
          }
        },
        {
          targets: -1,
          className: 'text-center',
          render(e) {
            return `
              <div aria-role="group" aria-label="Button group" class="d-flex justify-content-center btn-group-sm btn-group">
                <button 
                  class="btn cur-p btn-light view-schedule" 
                  data-id="${e}" title="View Schedule">
                  <i class="la la-eye"></i>
                </button>
              </div>
            `;
          }
        }
      ];
    }
  },
  methods: {
    onViewSchedule(id) {
      this.$emit('show-details', id);
    }
  }
};
</script>
