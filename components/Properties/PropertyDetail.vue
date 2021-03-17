<template>
  <div 
    id="property-details-wrapper" 
    class="container-fluid">
    <div class="row">
      <div class="col-lg-6 col-12">
        <left-details 
          :details="details" 
          :is-viewing="isViewing"/>
      </div>
      <div class="col-lg-6 col-12">
        <right-details 
          :details="details" 
          :is-viewing="isViewing"/>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 col-12">
        <property-files 
          :photos="details.photos || []" 
          :attachments="details.attachments || []"/>
      </div>
      <div 
        v-if="isViewing" 
        class="col-lg-6 col-12">
        <property-info
          :property="details"/>
      </div>
    </div>
  </div>
</template>

<script>
import LeftDetails from '@/components/Properties/LeftDetails';
import RightDetails from '@/components/Properties/RightDetails';
import PropertyFiles from '@/components/Properties/PropertyFiles';
import PropertyInfo from '@/components/Properties/PropertyInfo';
export default {
  name: 'PropertyDetail',
  components: {
    PropertyFiles,
    LeftDetails,
    RightDetails,
    PropertyInfo
  },
  props: {
    details: {
      type: Object,
      default: () => {}
    },
    isViewing: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
  #property-details-wrapper {
    padding: 0px;
    margin: 0px;
    font-size: 12px;

    .row {
      margin: 0px;

      .col-12 {
        padding: 0px;
        margin: 0px;
      }
    }
  }
}
</style>
