<template>
  <div
    v-if="show"
    class="form-group row">
    <!-- Label for the Input -->
    <label
      v-if="label"
      :id="model + '__label'"
      :for="model"
      :class="labelClass">
      {{ label }}
    </label>
    
    <div 
      :class="containerClass" 
      :id="model">
      <!-- If input is input tag -->
      <input 
        v-if="category === 'input'"
        :type="type" 
        :placeholder="placeholder" 
        v-model.trim="value"
        :class=" type === 'checkbox' ? '' : 'form__input form-control'" 
        :disabled="isDisabled"
        :min="type === 'number' ? '1' : ''"
        @input="test"
        @keydown="keyDown"
        @mousewheel="mouseWheel">

      <!-- if category is select tag -->
      <select 
        v-else-if="category === 'select'"
        id="account-type"
        v-model.trim="value"
        :disabled="isDisabled"
        name="input"
        class="form-control"
        @change="$emit('input', model, value)">
        <option 
          v-for="(option, index) in options" 
          :key="index" 
          :value="option.value">
          {{ option.text }}
        </option>
      </select>

      <!-- if category is radio tag -->
      <div 
        v-else-if="category === 'radio'">
        <div
          v-for="(option, index) in options" 
          :key="index" 
          class="form-check form-check-inline">
          <input 
            :id="option.value" 
            :value="option.value" 
            v-model.trim="value" 
            class="form-check-input" 
            type="radio"
            name="radio"
            @change="test">

          <label 
            :for="option.value" 
            class="form-check-label">
            {{ option.text }}
          </label>
        </div>
      </div>

      <gmap-autocomplete 
        v-else-if="category === 'google_map_search'"
        :select-first-on-enter="true"
        :value="value"
        class="form-control mb-2"
        @place_changed="setPlace"/>


      <div 
        v-else-if="category === 'input-group'" 
        class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">+63</div>
        </div>
        <input 
          id="inlineFormInputGroupUsername" 
          :placeholder="placeholder" 
          v-model.trim="value"
          :disabled="isDisabled" 
          type="number"
          class="form-control"
          @input="test"
          @keydown="keyDown"
          @mousewheel="mouseWheel">
      </div>

      <div 
        v-else-if="category === 'numeric_input'">
        <no-ssr>
          <number-input 
            v-model.trim="value"
            :min="0"
            :center="true"
            controls
            @change="numericInputChange"/>
        </no-ssr>
      </div>

      <!-- Input Errors Hint -->
      <span v-if="hasError">
        <small 
          v-for="(validation, index) in validations"
          v-show="validation.isError"
          :key="index"
          class="text-danger">
          {{ validation.label }}
        </small>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputContainer',

  props: {
    model: {
      type: String,
      default: ''
    },
    default: {
      type: [String, Number, Boolean],
      default: ''
    },
    category: {
      type: String,
      default: 'input'
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    hasError: {
      type: Boolean,
      default: false
    },
    validations: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    labelClass: {
      type: String,
      default: ''
    },
    containerClass: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      value: ''
    };
  },

  mounted() {
    this.value = this.default;
  },

  methods: {
    test() {
      if (this.model === 'mobile') {
        this.$emit('input', this.model, `63${this.value}`);
      } else {
        this.$emit('input', this.model, this.value);
      }
    },
    // Reset Value of the input model
    resetValue() {
      this.value = this.default;
    },

    numericInputChange(newValue, oldValue) {
      this.$emit('input', this.model, this.value);
    },

    setValue(value) {
      if (this.model === 'mobile') {
        this.value = value.substring(2, value.length);
      } else {
        this.value = value;
      }
    },

    /**
     * Trigger when input in Gmap Autocomplete
     *
     * @param  Object place
     * @return void
     */
    setPlace(place) {
      if (place.geometry) {
        this.$emit('input', this.model, place.formatted_address);
        let location = this.getLocation(place.address_components);
        location.latitude = place.geometry.location.lat();
        location.longitude = place.geometry.location.lng();
        location.building_name = place.name;

        this.$emit('place', location);
      }
    },

    /**
     * Get Location from Place Addess Components of Google Map
     *
     * @param  Array  components
     * @return Object location
     */
    getLocation(components) {
      let location = {};

      let array = [
        { key: 'city', value: 'locality' },
        { key: 'street', value: 'route' },
        { key: 'zip_code', value: 'postal_code' }
      ];

      for (let arr of array) {
        location[arr.key] = this.getFromGmapResult(arr.value, components);
      }

      return location;
    },

    /**
     * Get Specific Result from Google Map
     *
     * @param  String  type
     * @param  Array  result
     * @return String data
     */
    getFromGmapResult(type, result) {
      let data = '';
      for (let [index, value] of result.entries()) {
        if (value.types.includes(type)) {
          data = value.short_name;
          break;
        }
      }
      return data;
    },

    /**
     * Get Zip Code from Coordinates using Geocoder.
     *
     * @param  Double  lat
     * @param  Double  lng
     * @return String zip_code
     */
    getZipCode(lat, lng) {
      var zip_code = '';
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({ latLng: { lat, lng } }, (res, status) => {
        let lastItem =
          res[0].address_components[res[0].address_components.length - 1];

        if (lastItem.types.includes('postal_code')) {
          zip_code = lastItem.short_name;
        }
      });

      return zip_code;
    },
    keyDown(e) {
      if (this.type === 'number') {
        let validChars = [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '.',
          'Backspace'
        ];
        if (!validChars.includes(e.key)) {
          e.preventDefault();
        }
      }
    },
    mouseWheel(e) {
      if (this.type === 'number') {
        e.preventDefault();
      }
    }
  }
};
</script>
