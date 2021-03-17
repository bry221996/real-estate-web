<template>
  <div class="card datatable__container">
    <div class="card-body pr-0 pl-0">
      <table
        ref="storeTable"
        :id="id"
        class="datatable__main display responsive cell-border"
        style="width:100%">
        <thead>
          <tr>
            <th
              v-for="(header, index) in columnHeader"
              :key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
import Datatable from '~/plugins/Datatable';

export default {
  name: 'DataTable',
  props: {
    titleText: {
      type: String,
      default: 'TABLE_TITLE'
    },
    titleIcon: {
      type: String,
      default: 'la la-info-circle'
    },
    tableId: {
      type: String,
      default: '#'
    },
    ajaxUrl: {
      type: String,
      default: '/'
    },
    columnHeader: {
      type: Array,
      default: () => []
    },
    columnData: {
      type: Array,
      default: () => []
    },
    columnDefs: {
      type: Array,
      default: () => [{ targets: '_all', searchable: false }]
    },
    menuActions: {
      type: Array,
      default: () => []
    },
    searchable: {
      type: Boolean,
      default: () => false
    },
    orderable: {
      type: Boolean,
      default: () => false
    },
    additionalSearchColumns: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    id() {
      return this.tableId.substring(1, this.tableId.length);
    }
  },
  mounted() {
    const config = {
      id: this.tableId,
      url: this.ajaxUrl,
      columns: this.columnData,
      definitions: this.columnDefs,
      search: this.searchable,
      order: this.orderable,
      additionalSearch: this.additionalSearchColumns,
      token: this.$auth.$storage.getUniversal('_token.password_grant', true)
    };

    Datatable.initialize(config);

    if (this.menuActions.length > 0) {
      this.menuActions.forEach(menu => {
        $(this.tableId).on('click', `.${menu}`, event => {
          this.$emit(menu, event.currentTarget.getAttribute('data-id'));
        });
      });
    }
  },
  methods: {
    refresh() {
      Datatable.refresh(this.tableId);
    }
  }
};
</script>
