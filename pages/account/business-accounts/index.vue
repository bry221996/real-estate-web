<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-between">
        <h3 class="page-title">Business Accounts</h3>
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
            :menu-actions="actions"
            @view-profile="onViewProfile"/>
        </no-ssr>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/Utils/DataTable.vue';
import * as moment from 'moment';
export default {
  name: 'BusinessAccounts',
  components: {
    DataTable
  },
  data() {
    return {
      id: '#business-accounts',
      url: `${
        process.env.BASE_URL
      }/api/v1/users?include=roles&filter[roles]=agent,owner`,
      header: ['ID', 'Name', 'Mobile', 'Email', 'Gender', 'Status', 'Actions'],
      columns: [
        { data: 'id' },
        { data: 'full_name' },
        { data: 'mobile' },
        { data: 'email' },
        { data: 'gender' },
        { data: 'business_account_is_verified' },
        { data: 'id' }
      ],
      actions: ['view-profile']
    };
  },
  computed: {
    columnDefinitions() {
      return [
        {
          targets: 3,
          className: 'no-text-transform'
        },
        {
          targets: -1,
          className: 'text-center',
          render(e) {
            return `
              <div aria-role="group" aria-label="Button group" class="d-flex justify-content-center btn-group-sm btn-group">
                <button 
                  class="btn cur-p btn-light view-profile" 
                  data-id="${e}" title="View Profile">
                  <i class="la la-eye"></i>
                </button>
              </div>
            `;
          }
        },
        {
          targets: -2,
          className: 'text-center',
          render(data, type, full) {
            let badge = { text: 'Verified', variant: 'success' };
            if (!data) {
              if (full.prc_registration_number) {
                badge = { text: 'Unverified', variant: 'warning' };
              } else {
                badge = { text: 'Incomplete', variant: 'secondary' };
              }
            }
            return `<span 
                      class="badge badge-${badge.variant}">
                      ${badge.text}
                    </span>`;
          }
        }
      ];
    }
  },
  methods: {
    onViewProfile(id) {
      this.$router.push(`/account/business-accounts/${id}`);
    }
  }
};
</script>
