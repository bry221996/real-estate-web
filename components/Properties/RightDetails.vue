<template>
  <div 
    id="right-details" 
    class="container-fluid">
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td class="w-25"> Location: </td>
          <td class="w-75 upperCase">
            <strong>{{ formatted_address }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Unit: </td>
          <td class="w-75 upperCase">
            <strong>{{ unit }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Building: </td>
          <td class="w-75 upperCase">
            <strong>{{ building_name }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Street: </td>
          <td class="w-75 upperCase">
            <strong>{{ street }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Zip Code: </td>
          <td class="w-75 upperCase">
            <strong>{{ zip_code }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> City: </td>
          <td class="w-75 upperCase">
            <strong>{{ city }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Size: </td>
          <td class="w-75 upperCase">
            <strong>{{ size }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Price per sqm: </td>
          <td class="w-75 upperCase">
            <strong>{{ price_per_sqm }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Furnishing: </td>
          <td class="w-75 upperCase">
            <strong>{{ furnished_type }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Occupied: </td>
          <td class="w-75 upperCase">
            <strong>{{ occupied }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RightDetails',
  props: {
    details: {
      type: Object,
      default: () => {}
    },
    isViewing: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    formatted_address: function() {
      return this.details.formatted_address || '';
    },
    unit: function() {
      return this.details.unit || '';
    },
    building_name: function() {
      return this.details.building_name || '';
    },
    street: function() {
      return this.details.street || '';
    },
    zip_code: function() {
      return this.details.zip_code || '';
    },
    city: function() {
      return this.details.city || '';
    },
    size: function() {
      let data =
        parseInt(this.details['floor_size']) ||
        parseInt(this.details['lot_size']);
      return `${data} sqm`;
    },
    price_per_sqm: function() {
      return this.details.price_per_sqm
        ? this.details.price_per_sqm.toLocaleString()
        : '';
    },
    furnished_type: function() {
      if (this.isViewing) {
        return this.details.furnished_type;
      } else {
        return this.details.furnished_type_id
          ? this.$store.state.furnishingTypes.find(
              type => type.value === this.details.furnished_type_id
            ).text
          : null;
      }
    },
    occupied: function() {
      return this.details.occupied ? 'Yes' : 'No';
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
  #right-details {
    padding: 0px;
    margin: 0px;
  }
}
</style>
