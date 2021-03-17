<template>
  <div 
    id="details-form" 
    class="row justify-content-center">
    
    <div class="col-lg-8 col-md-10 col-sm-10">
      <div 
        v-for="(formInput, index) in formInputs"
        :key="index"
        class="container-fluid">
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
          label-class="col-sm-4 col-md-3 col-lg-4 col-form-label"
          container-class="col-sm-8 col-md-8 col-lg-8 align-self-center"
          @input="inputChanged"/>
      </div>

      <div class="container-fluid mt-3">
        <div class="row">
          <div class="col-lg-4">
            Features
          </div>
          <div class="col-lg-8">
            <div class="row">
              <div 
                v-for="(feature, index) in $store.state.featureOptions"
                :key="index"
                class="col-lg-6 ">
                <div class="form-group form-check">
                  <input 
                    v-model="features"
                    :id="'feature_'+feature.id" 
                    :value="feature.id"
                    type="checkbox" 
                    class="form-check-input">
                  <label 
                    :for="'feature_'+feature.id" 
                    class="form-check-label">   
                    {{ feature.name }}
                  </label>
                </div>
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
  name: 'DetailsForm',
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
      bedroom_count: 0,
      name: '',
      description: '',
      bathroom_count: 0,
      garage_count: 0,
      developer: '',
      price_per_sqm: null,
      furnished_type_id: null,
      occupied: false,
      features: [],
      developerOptions: []
    };
  },
  validations: {
    developer: { required },
    furnished_type_id: { required },
    price_per_sqm: { required },
    form: ['furnished_type_id', 'developer', 'price_per_sqm']
  },
  computed: {
    formInputs: function() {
      return [
        {
          model: 'developer',
          category: 'select',
          label: 'Developer',
          hasError: this.$v.developer.$error,
          default: null,
          validations: [
            {
              isError: !this.$v.developer.required,
              label: 'Developer is required'
            }
          ],
          options: this.developerOptions
        },
        {
          model: 'price_per_sqm',
          label: 'Price Per Sqm',
          type: 'number',
          hasError: this.$v.price_per_sqm.$error,
          validations: [
            {
              isError: !this.$v.price_per_sqm.required,
              label: 'Price Per Sqm is required'
            }
          ]
        },
        {
          model: 'bedroom_count',
          label: 'Bedroom Count',
          category: 'numeric_input',
          default: 0
        },
        {
          model: 'bathroom_count',
          label: 'Bathroom Count',
          category: 'numeric_input',
          default: 0
        },
        {
          model: 'garage_count',
          label: 'Garage Count',
          category: 'numeric_input',
          default: 0
        },
        {
          model: 'furnished_type_id',
          category: 'select',
          label: 'Furnishing Type',
          hasError: this.$v.furnished_type_id.$error,
          validations: [
            {
              isError: !this.$v.furnished_type_id.required,
              label: 'Select Furnishing Type'
            }
          ],
          default: null,
          options: this.$store.state.furnishingTypes
        },
        {
          model: 'occupied',
          label: 'Occupied',
          category: 'select',
          default: 0,
          options: [{ value: 0, text: 'No' }, { value: 1, text: 'Yes' }]
        }
      ];
    }
  },

  mounted() {
    this.checkIfEditingMode();
    this.getDevelorOptions();
  },

  methods: {
    inputChanged(model, value) {
      this.$data[model] = value;
      if (model in this.$v) {
        this.$v[model].$touch();
      }
    },

    calculatePricePerSqm(size) {
      return (this.$store.state.propertyForm.price / size).toFixed(2);
    },

    validate() {
      this.generateName();
      this.$v.form.$touch();
      const isValid = !this.$v.form.$invalid;
      this.$emit('on-validate', this.$data, isValid);
      return isValid;
    },

    generateName() {
      let name = '';
      let description = '';
      let type = this.$store.state.propertyTypes.find(
        type => type.value == this.$store.state.propertyForm.property_type_id
      );

      let offerType = this.$store.state.offerTypes.find(
        type => type.value == this.$store.state.propertyForm.offer_type_id
      );

      name = `${type.short} ${offerType.text} ${this.bedroom_count} BR`;
      description = `${type.text} ${offerType.text} with ${
        this.bedroom_count
      } Bedroom`;

      if (type.value === 2) {
        name = `Office ${offerType.text}`;
        description = `Office ${offerType.text}`;
      }

      if (this.bedroom_count === 0) {
        if (type.value === 1) {
          name = `Studio Type Condo ${offerType.text}`;
          description = `Studio Type Condominuim ${offerType.text}`;
        }
        if (type.value === 3) {
          name = `House And Lot ${offerType.text}`;
          description = name;
        }
      }

      this.name = `${name} in ${this.$store.state.propertyForm.city} City`;
      this.description = `${description} in ${
        this.$store.state.propertyForm.city
      } City`;
    },

    resetForm() {
      this.bedroom_count = 0;
      this.name = '';
      this.description = '';
      this.bathroom_count = 0;
      this.garage_count = 0;
      this.developer = '';
      this.price_per_sqm = null;
      this.floor_size = null;
      this.lot_size = null;
      this.furnished_type_id = null;
      this.occupied = false;
      this.features = [];
    },

    checkIfEditingMode() {
      if (this.isEditing) {
        for (let key in this.$data) {
          let data = this.initialValue[key];

          if (key in this.$refs) {
            this.$refs[key][0].setValue(data);
          }

          if (key === 'features') {
            data = [];
            this.initialValue.features.map(feature => {
              data.push(feature.id);
            });
          }

          this.$data[key] = data;
        }
      }
    },

    setPsqm(value) {
      let psqm = this.calculatePricePerSqm(value);
      this.price_per_sqm = psqm;
      this.$refs['price_per_sqm'][0].setValue(psqm);
    },

    async getDevelorOptions() {
      this.developerOptions = [];
      let { data } = await this.$axios.$get('/api/v1/developers');
      data.forEach(developer => {
        this.developerOptions.push({
          value: developer.name,
          text: developer.name
        });
      });
    }
  }
};
</script>
