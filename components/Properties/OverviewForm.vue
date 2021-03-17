<template>
  <div 
    id="overview-form" 
    class="row justify-content-center">

    <div class="col-lg-8 col-md-10 col-sm-10">
      <div 
        v-for="(formInput, index) in formInputs"
        :key="index"
        class="container-fluid">

        <p v-show="index == 4">
          <no-ssr>
            <GmapMap
              :center="{lat: latitude, lng: longitude}"
              :zoom="15"
              class="form-control"
              map-type-id="terrain"
              style="height: 300px; margin-bottom: 15px">
              <GmapMarker
                :position="{lat: latitude, lng: longitude}"
                :clickable="true"
                :draggable="true"/>
            </GmapMap>
          </no-ssr>
        </p>

        <input-container 
          :ref="formInput.model"
          :model="formInput.model" 
          :default="formInput.default"
          :category="formInput.category"
          :type="formInput.type"
          :placeholder="formInput.placeholder"
          :has-error="formInput.hasError"
          :validations="formInput.validations"
          :options="formInput.options"
          :label="formInput.label"
          :is-disabled="formInput.isDisabled"
          :show="formInput.show"
          label-class="col-sm-4 col-md-3 col-lg-4 col-form-label"
          container-class="col-sm-8 col-md-8 col-lg-8 align-self-center"
          @input="inputChanged"
          @place="placeChanged"/>

      </div>
      <div class="container-fluid">
        <div class="form-group row">
          <label class="col-sm-4 col-md-3 col-lg-4 col-form-label">
            Complete Address
          </label>
          <div class="col-sm-8 col-md-8 col-lg-8 align-self-center">
            <div class="input-group">
              <input 
                :value="formattedAddress" 
                type="text" 
                class="form-control"
                disabled>
              <div class="input-group-append">
                <span 
                  id="formatted_address_icon" 
                  class="input-group-text">
                  <i class="la la-question-circle"/>
                </span>
                <b-popover
                  target="formatted_address_icon"
                  placement="topleft"
                  triggers="hover focus">
                  <b-card 
                    no-body
                    img-src="https://i.ibb.co/zG24X88/1.jpg" 
                    img-alt="Card image"/>
                </b-popover>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid">
        <div class="form-group row">
          <label class="col-sm-4 col-md-3 col-lg-4 col-form-label">
            Formatted Address
          </label>
          <div class="col-sm-8 col-md-8 col-lg-8 align-self-center">
            <div class="input-group">
              <input 
                :value="addressWithoutUnitNumber" 
                type="text" 
                class="form-control"
                disabled>
              <div class="input-group-append">
                <span 
                  id="complete_address_icon" 
                  class="input-group-text">
                  <i class="la la-question-circle"/>
                </span>
                <b-popover
                  target="complete_address_icon"
                  placement="topleft"
                  triggers="hover focus">
                  <b-card 
                    no-body
                    img-src="https://i.ibb.co/fYF8q1M/2.jpg" 
                    img-alt="Card image"/>
                </b-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
const { required, requiredIf } = require('vuelidate/lib/validators');
import InputContainer from '@/components/Utils/InputContainer';
export default {
  name: 'OverviewForm',
  components: {
    InputContainer
  },
  props: {
    initialValue: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      latitude: 14.556586,
      longitude: 121.023415,
      offer_type_id: null,
      price: null,
      property_type_id: null,
      address: '',
      formatted_address: '',
      unit: '',
      building_name: '',
      street: '',
      zip_code: '',
      city: '',
      floor_size: null,
      lot_size: null
    };
  },
  computed: {
    formattedAddress() {
      let text = '';

      if (this.unit) {
        text = `${this.unit} `;
      }

      if (this.addressWithoutUnitNumber) {
        text = `${text}${this.addressWithoutUnitNumber} `;
      }

      return text;
    },
    addressWithoutUnitNumber() {
      let text = '';

      if (this.building_name && this.property_type_id !== 3) {
        text = `${text}${this.building_name} `;
      }

      if (this.street) {
        text = `${text}${this.street}, `;
      }

      if (this.city) {
        text = `${text}${this.city} `;
      }

      if (this.zip_code) {
        text = `${text}${this.zip_code}`;
      }

      return text;
    },
    sizeModel: function() {
      return this.property_type_id < 3 ? 'floor_size' : 'lot_size';
    },
    sizeLabel: function() {
      return this.property_type_id < 3 ? 'Floor Size' : 'Lot Size';
    },
    formInputs: function() {
      return [
        {
          model: 'offer_type_id',
          category: 'radio',
          label: 'Offer Type',
          hasError: this.$v.offer_type_id.$error,
          validations: [
            {
              isError: !this.$v.offer_type_id.required,
              label: 'Select an Account Type'
            }
          ],
          default: null,
          options: [
            { value: 1, text: 'For Sale' },
            { value: 2, text: 'For Rent' }
          ]
        },
        {
          model: 'price',
          hasError: this.$v.price.$error,
          label: 'Price',
          type: 'number',
          validations: [
            {
              isError: !this.$v.price.required,
              label: 'Price is required'
            }
          ]
        },
        {
          model: 'property_type_id',
          category: 'select',
          label: 'Property Type',
          hasError: this.$v.property_type_id.$error,
          validations: [
            {
              isError: !this.$v.property_type_id.required,
              label: 'Select Property Type'
            }
          ],
          default: null,
          isDisabled: this.isEditing,
          options: [
            { value: 1, text: 'Condominium' },
            { value: 2, text: 'Office' },
            { value: 3, text: 'House And Lot' }
          ]
        },
        {
          model: this.sizeModel,
          label: this.sizeLabel,
          hasError: this.$v[this.sizeModel].$error,
          type: 'number',
          validations: [
            {
              isError: !this.$v[this.sizeModel].requiredIf,
              label: 'Size is required'
            }
          ]
        },
        {
          model: 'address',
          category: 'google_map_search',
          label: 'Address',
          hasError: this.$v.address.$error,
          validations: [
            {
              isError: !this.$v.address.required,
              label: 'Address is required'
            }
          ]
        },
        {
          model: 'unit',
          hasError: this.$v.unit.$error,
          label: 'Room/Floor/Unit No.',
          validations: [
            {
              isError: !this.$v.unit.required,
              label: 'Unit No. is required'
            }
          ]
        },
        {
          model: 'building_name',
          label: 'Building Name',
          hasError: this.$v.building_name.$error,
          show: this.property_type_id != 3,
          validations: [
            {
              isError: !this.$v.building_name.requiredIf,
              label: 'Building Name is required'
            }
          ]
        },
        {
          model: 'street',
          hasError: this.$v.street.$error,
          label: 'Street',
          validations: [
            {
              isError: !this.$v.street.required,
              label: 'Street is required'
            }
          ]
        },
        {
          model: 'city',
          hasError: this.$v.city.$error,
          label: 'City',
          validations: [
            {
              isError: !this.$v.city.required,
              label: 'City is required'
            }
          ]
        },
        {
          model: 'zip_code',
          label: 'Zip Code',
          type: 'number'
        }
      ];
    }
  },
  mounted() {
    this.checkIfEditingMode();
  },
  validations: {
    offer_type_id: { required },
    price: { required },
    property_type_id: { required },
    unit: { required },
    street: { required },
    address: { required },
    city: { required },
    building_name: {
      requiredIf: requiredIf(function() {
        return this.property_type_id < 3;
      })
    },
    floor_size: {
      requiredIf: requiredIf(function() {
        return this.property_type_id < 3;
      })
    },
    lot_size: {
      requiredIf: requiredIf(function() {
        return this.property_type_id > 2;
      })
    },
    form: [
      'offer_type_id',
      'property_type_id',
      'unit',
      'price',
      'street',
      'address',
      'city',
      'floor_size',
      'lot_size',
      'building_name'
    ]
  },
  methods: {
    inputChanged(model, value) {
      this.$data[model] = value;
      if (model in this.$v) {
        this.$v[model].$touch();
      }
    },

    checkIfEditingMode() {
      if (this.isEditing) {
        for (let key in this.$data) {
          let data = this.initialValue[key];
          if (key === 'latitude' || key === 'longitude') {
            data = parseFloat(this.initialValue[key]);
          }

          if (key in this.$refs) {
            if (key === 'lot_size' || key === 'floor_size') {
              this.$nextTick(() => {
                if (this.property_type_id < 3) {
                  this.$refs['floor_size'][0].setValue(this.floor_size);
                } else if (this.property_type_id == 3) {
                  this.$refs['lot_size'][0].setValue(this.lot_size);
                }
              });
            } else {
              this.$refs[key][0].setValue(data);
            }
          }

          this.$data[key] = data;
        }
      } else {
        this.getCurrentLocation();
      }
    },

    async getCurrentLocation() {
      await navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    },

    placeChanged(location) {
      for (var property in location) {
        if (location.hasOwnProperty(property)) {
          this.$data[property] = location[property];

          if (property in this.$v && location[property] !== '') {
            this.$v[property].$touch();
          }

          if (property in this.$refs) {
            this.$refs[property][0].setValue(this.$data[property]);
          }
        }
      }

      if (this.zip_code === '') {
        this.setZipCode();
      }
    },

    setZipCode() {
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { latLng: { lat: this.latitude, lng: this.longitude } },
        (res, status) => {
          let lastItem =
            res[0].address_components[res[0].address_components.length - 1];

          if (lastItem.types.includes('postal_code')) {
            this.$refs['zip_code'][0].setValue(lastItem.short_name);
            this.$data['zip_code'] = lastItem.short_name;
          }
        }
      );
    },

    validate() {
      this.concatAddress();
      this.populateSize();
      this.$v.form.$touch();
      const isValid = !this.$v.form.$invalid;
      this.$emit('on-validate', this.$data, isValid);
      this.$emit('set-size', this.floor_size || this.lot_size);
      return isValid;
    },

    populateSize() {
      if (this.property_type_id < 3) {
        this.lot_size = 0;
      } else {
        this.floor_size = 0;
      }
    },

    concatAddress() {
      this.formatted_address = `${this.unit} ${this.building_name} ${
        this.street
      } ${this.city} ${this.zip_code || ''}`;

      if (this.property_type_id === 3) {
        this.formatted_address = `${this.unit} ${this.street} ${
          this.city
        } ${this.zip_code || ''}`;
      }
    },

    resetForm() {
      this.latitude = 14.556586;
      this.longitude = 121.023415;
      this.offer_type_id = null;
      this.price = null;
      this.property_type_id = null;
      this.address = '';
      this.formatted_address = '';
      this.unit = '';
      this.building_name = '';
      this.street = '';
      this.zip_code = '';
      this.city = '';
    }
  }
};
</script>
