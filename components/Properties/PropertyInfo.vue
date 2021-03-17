<template>
  <div 
    id="property_info" 
    class="container-fluid">
    <table class="table table-borderless">
      <tbody>
        <tr class="W-100">
          <td class="w-25">Listing ID:</td>
          <td class="w-75 upperCase">
            <strong>{{ property.listing_id }}</strong>
          </td>
        </tr>
        <tr 
          v-if="property.expired_at" 
          class="W-100">
          <td class="w-25">Expired At:</td>
          <td class="w-75 upperCase">
            <strong>{{ property.expired_at }}</strong>
          </td>
        </tr>
        <tr class="W-100">
          <td class="w-25">Status:</td>
          <td class="w-75 upperCase">
            <strong>{{ status }}</strong>
          </td>
        </tr>
        <tr 
          v-if="agentName" 
          class="W-100">
          <td class="w-25">Posted By:</td>
          <td class="w-75 upperCase">
            <strong>{{ agentName }}</strong>
          </td>
        </tr>
        <tr class="W-100">
          <td class="w-25">Date Posted:</td>
          <td class="w-75 upperCase">
            <strong>{{ property.created_at }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as moment from 'moment';
export default {
  name: 'PropertyInfo',
  props: {
    property: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      agentName: ''
    };
  },
  computed: {
    status: function() {
      if (this.property.property_status_id > 1) {
        return this.property.property_status;
      }

      if (moment(this.property.expired_at).isSameOrBefore(moment())) {
        return 'expired';
      }
      return this.property.property_status;
    }
  },
  mounted() {
    if (!this.$store.getters.isBusinessAccount) {
      this.$axios
        .$get(`/api/v1/users/${this.property.created_by}?include=roles`)
        .then(res => {
          this.agentName = res.data.full_name;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
  #property_info {
    padding: 0px;
    margin: 0px;
  }
}
</style>
