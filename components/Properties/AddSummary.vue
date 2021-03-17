<template>
  <div class="container">
    <p class="text-center">SUMMARY</p>
    <property-view
      :property="data"
      :creating="true"/>
    <p class="text-center mt-5">DETAILS</p>
    <hr>
    <details-container 
      :property="data" 
      :is-viewing="false"/>
  </div>
</template>


<script>
import PropertyView from '@/components/Properties/PropertyView';
import DetailsContainer from '@/components/Properties/DetailsContainer.vue';

export default {
  name: 'AddSummary',
  components: {
    PropertyView,
    DetailsContainer
  },
  props: {
    data: {
      default: null,
      type: Object
    },
    isEditing: {
      default: false,
      type: Boolean
    }
  }
};
</script>
