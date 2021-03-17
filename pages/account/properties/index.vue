<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-between">
        <h3 class="page-title">Properties</h3>
        <button 
          v-if="showAddPropertyButton"
          class="btn btn-primary mb-3"
          @click="toCreateProperty">
          Add Property
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <no-ssr>
          <data-table
            :table-id="id"
            :ajax-url="url"
            :column-header="header"
            :column-data="columns"
            :column-defs="columnDefinitions"
            :searchable="true"
            :orderable="true"
            :menu-actions="actions"
            :additional-search-columns="additionalSearch"
            @view-property="onViewProperty"
            @edit-property="onEditProperty"/>
        </no-ssr>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/Utils/DataTable.vue';
import * as moment from 'moment';
export default {
  name: 'Properties',
  components: {
    DataTable
  },
  data() {
    return {
      id: '#properties',
      header: [
        'Listing ID',
        'Name',
        'Price',
        'Remaining Days',
        'Hits',
        'Appointments',
        'Fulfilled',
        'Status',
        'Actions'
      ],
      columns: [
        { data: 'listing_id', searchable: true, orderable: false },
        { data: 'name', searchable: true, orderable: false },
        { data: 'price', searchable: false, orderable: false },
        { data: 'expired_at', searchable: false, orderable: true },
        { data: 'hits', searchable: false, orderable: false },
        { data: 'appointment_count', searchable: false, orderable: false },
        {
          data: 'fulfilled_appointment_count',
          searchable: false,
          orderable: false
        },
        { data: 'property_status', searchable: false, orderable: false },
        { data: 'id', searchable: false, orderable: false }
      ],
      additionalSearch: ['building_name']
    };
  },
  computed: {
    showAddPropertyButton() {
      return this.$store.getters.isBusinessAccount;
    },
    url() {
      return this.$store.getters.isBusinessAccount
        ? `${process.env.BASE_URL}/api/v1/account/properties`
        : `${process.env.BASE_URL}/api/v1/properties`;
    },
    actions() {
      let actions = ['view-property'];
      if (this.$store.getters.isBusinessAccount) {
        actions.push('edit-property');
      }
      return actions;
    },
    columnDefinitions() {
      const THIS = this;
      return [
        {
          targets: 1,
          render(e, type, full) {
            if (full.building_name) {
              return `${full.building_name}, ${e}`;
            }
            return e;
          }
        },
        {
          targets: 2,
          render(e) {
            return `₱ ${e.toLocaleString()}`;
          }
        },
        {
          targets: 3,
          render(e) {
            var a = moment(e);
            let remaining = a.diff(moment(), 'days');
            if (remaining < 0) {
              remaining = 0;
            }
            return remaining >= 0 ? remaining : '--';
          }
        },
        {
          targets: -2,
          className: 'text-center',
          render(data, type, full) {
            let variant = '';
            switch (full.property_status_id) {
              case 2:
                variant = 'secondary';
                break;
              case 3:
                variant = 'warning';
                break;
              case 4:
                variant = 'success';
                break;

              default:
                if (moment(full.expired_at).isSameOrBefore(moment())) {
                  data = 'Expired';
                  variant = 'dark';
                } else {
                  variant = 'primary';
                }
                break;
            }
            return `<span class="badge badge-${variant}">${data}</span>`;
          }
        },
        {
          targets: [3, 4, 5, 6],
          className: 'text-center'
        },
        {
          targets: -1,
          className: 'text-center',
          render(e) {
            let html = `
              <div aria-role="group" aria-label="Button group" class="d-flex justify-content-center btn-group-sm btn-group">
                <button 
                  class="btn cur-p btn-light view-property" 
                  data-id="${e}" title="View Property">
                  <i class="la la-eye"></i>
                </button>
            `;

            if (THIS.$store.getters.isBusinessAccount) {
              html = `${html}
                <button 
                  class="btn cur-p btn-light edit-property" 
                  data-id="${e}" title="Edit Property">
                    <i class="la la-edit"></i>
                </button>
              `;
            }

            return `${html}</div>`;
          }
        }
      ];
    }
  },
  methods: {
    onViewProperty(id) {
      this.$router.push(`/account/properties/${id}`);
    },
    onEditProperty(id) {
      this.$router.push(`/account/properties/${id}/edit`);
    },
    toCreateProperty() {
      this.$router.push('/account/properties/create');
    }
  }
};
</script>
