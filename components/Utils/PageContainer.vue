<template>
  <div class="container-fluid">
    <!-- Page Header Slot -->
    <slot name="page-header"/>

    <!-- Page Body Slot -->
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
  props: {
    pageTitle: {
      type: String,
      default: ''
    }
  }
};
</script>
