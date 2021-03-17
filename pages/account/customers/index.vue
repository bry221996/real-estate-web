<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-between">
        <h3 class="page-title">Customers</h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <no-ssr>
          <data-table
            :table-id="id"
            :ajax-url="url"
            :column-header="header"
            :column-defs="columnDefinitions"
            :column-data="columns"/>
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
      id: '#customers',
      url: `${
        process.env.BASE_URL
      }/api/v1/users?include=roles&filter[roles]=customer`,
      header: ['ID', 'Name', 'Mobile', 'Email', 'Gender', 'Register At'],
      columns: [
        { data: 'id' },
        { data: 'full_name' },
        { data: 'mobile' },
        { data: 'email' },
        { data: 'gender' },
        { data: 'created_at' }
      ],
      columnDefinitions: [
        {
          targets: 3,
          className: 'no-text-transform'
        }
      ]
    };
  }
};
</script>
