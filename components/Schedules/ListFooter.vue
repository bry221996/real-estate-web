<template>
  <div 
    v-if="meta.total"
    class="mt-auto d-flex justify-content-between">
    <span> {{ details }} </span>
    <div class="d-flex">
      <button 
        :disabled="previousDisable"
        type="button" 
        class="btn btn-no-focus btn-sm btn-secondary mr-1"
        @click.prevent="action('prev')">
        Previous
      </button>
      <button 
        :disabled="nextDisabled"
        type="button" 
        class="btn btn-no-focus btn-sm btn-secondary"
        @click.prevent="action('next')">
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListFooter',
  props: {
    id: {
      type: String,
      default: ''
    },
    meta: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    details() {
      return this.meta.total
        ? `Showing ${this.meta.from} to ${this.meta.to} of ${
            this.meta.total
          } entries.`
        : '';
    },
    previousDisable() {
      return this.meta.current_page <= 1;
    },
    nextDisabled() {
      return this.meta.current_page === this.meta.last_page;
    }
  },
  methods: {
    action(type) {
      this.$emit(type, this.id);
    }
  }
};
</script>
