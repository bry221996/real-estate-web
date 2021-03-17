var propertyStatus = 'all_property_status';
var status = '';
const DataResource = {
  start(config) {
    const table = $(config.id)
      .on('preXhr.dt', (e, settings, data) => {
        if (data.order.length > 0) {
          let orderingColumn = data.columns[data.order[0].column];
          if (data.order[0].dir === 'asc') {
            data.sort = orderingColumn.data;
          } else {
            data.sort = `-${orderingColumn.data}`;
          }
        }

        if (data.sort === 'listing_id') {
          delete data.sort;
        }

        data.filter = {};

        if (data.draw === 1) {
          status = '';
        }

        if (config.id === '#properties' && status === '') {
          data.scope = propertyStatus;
        }

        if (
          (config.id === '#schedules' || config.id === '#properties') &&
          status !== ''
        ) {
          const field =
            config.id === '#schedules' ? 'status' : 'property_status';
          data.filter[field] = status;
        }

        // <----- DATA FILTERING USED IN SEARCH ----->
        if (data.search.value) {
          data.columns.forEach(column => {
            if (column.searchable) {
              data.filter[column.data] = data.search.value;
            }
          });

          if (config.additionalSearch.length) {
            config.additionalSearch.forEach(column => {
              data.filter[column] = data.search.value;
            });
          }
        }

        // <----- DATA PAGINATION ----->
        if (data.start === 0) {
          data.page = 1;
        } else {
          data.page = data.start / data.length + 1;
        }
        data.per_page = data.length;

        delete data.columns;
      })
      .on('xhr.dt', (e, settings, json, xhr) => {
        json.recordsTotal = json.meta.total;
        json.recordsFiltered = json.meta.total;
      })
      .DataTable({
        asStripeClasses: [],
        ajax: {
          url: config.url,
          dataSrc: 'data',
          async: true,
          beforeSend: function(request) {
            request.setRequestHeader('Authorization', config.token);
          }
        },
        bAutoWidth: false,
        responsive: true,
        processing: true,
        serverSide: true,
        lengthMenu: [5, 10, 15, 20],
        pageLength: 10,
        pagingType: 'numbers',
        language: {
          processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>',
          emptyTable: 'No data available.'
        },
        columns: config.columns,
        columnDefs: config.definitions,
        searching: config.search,
        ordering: config.order
      });
    return table;
  }
};
export default {
  initialize(config) {
    $(document).ready(() => {
      const table = DataResource.start(config);

      $(
        `<div class="pull-right ml-2">
            <select class="form-control property_status">
              <option value="all_property_status" selected="selected">All Status</option>
              <option value="published">Published</option>
              <option value="pending">For Review</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
            </select>
            </div>`
      ).appendTo('#properties_wrapper .dataTables_filter');

      $('select.property_status').change(function() {
        const selected = $(this)
          .children('option:selected')
          .val();
        if (selected !== 'all_property_status') {
          status = selected;
        } else {
          status = '';
        }
        $(config.id)
          .DataTable()
          .ajax.reload();
      });

      $(
        `<div class="pull-right ml-2">
            <select class="form-control appointment_status">
              <option value="" selected="selected">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Declined</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Reschedule">Reschedule</option>
              <option value="Completed">Completed</option>
              <option value="Expired">Expired</option>
            </select>
            </div>`
      ).appendTo('#schedules_wrapper .dataTables_filter');

      $('select.appointment_status').change(function() {
        status = $(this)
          .children('option:selected')
          .val();
        $(config.id)
          .DataTable()
          .ajax.reload();
      });
    });
  },
  refresh(id) {
    $(id)
      .DataTable()
      .ajax.reload();
  },
  destroy(id) {
    $(id)
      .DataTable()
      .destroy();
  }
};
