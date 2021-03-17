<template>
  <div 
    id="left-details" 
    class="container-fluid">
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td class="w-25"> Offer Type: </td>
          <td class="w-75 upperCase">
            <strong>{{ offer_type }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Property Type: </td>
          <td class="w-75 upperCase">
            <strong>{{ property_type }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Name: </td>
          <td class="w-75 upperCase">
            <strong>{{ name }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Description: </td>
          <td class="w-75 upperCase">
            <strong>{{ description }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Price: </td>
          <td class="w-75 upperCase">
            <strong>{{ price }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Bedroom: </td>
          <td class="w-75 upperCase">
            <strong>{{ bedroom_count }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Bathroom: </td>
          <td class="w-75 upperCase">
            <strong>{{ bathroom_count }}</strong>
          </td>
        </tr>
        <tr>
          <td class="w-25"> Parking Slot: </td>
          <td class="w-75 upperCase">
            <strong>{{ garage_count }}</strong>
          </td>
        </tr>
        <tr v-if="features.length > 0">
          <td class="w-25"> Features: </td>
          <td class="w-75 upperCase">
            <div 
              v-for="feature in features" 
              :key="feature">
              <strong> &#10004; {{ feature }}</strong>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LeftDetails',
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
    offer_type: function() {
      if (this.isViewing) {
        return this.details.offer_type;
      } else {
        return this.details.offer_type_id
          ? this.$store.state.offerTypes.find(
              type => type.value === this.details.offer_type_id
            ).text
          : null;
      }
    },
    property_type: function() {
      if (this.isViewing) {
        return this.details.property_type;
      } else {
        return this.details.property_type_id
          ? this.$store.state.propertyTypes.find(
              type => type.value === this.details.property_type_id
            ).text
          : null;
      }
    },
    name: function() {
      return this.details.name || '';
    },
    description: function() {
      return this.details.description || '';
    },
    price: function() {
      return this.details.price ? this.details.price.toLocaleString() : '';
    },
    bedroom_count: function() {
      return this.details.bedroom_count || 0;
    },
    bathroom_count: function() {
      return this.details.bathroom_count || 0;
    },
    garage_count: function() {
      return this.details.garage_count || 0;
    },
    features: function() {
      let temp = [];
      if (this.details.features) {
        if (this.isViewing) {
          this.details.features.map(item => {
            temp.push(item.name);
          });
        } else {
          this.details.features.map(item => {
            let x = this.$store.state.featureOptions.find(
              feature => feature.id === item
            );
            temp.push(x.name);
          });
        }
      }
      return temp;
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
  #left-details {
    padding: 0px;
    margin: 0px;
  }
}
</style>
