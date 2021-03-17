<template>
  <nuxt-child/>
</template>
<script>
export default {
  layout: 'admin',
  head: {
    title: 'Lazatu',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Lazatu Admin'
      }
    ]
  }
};
</script>
