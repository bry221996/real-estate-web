<template>
  <div id="create-property">
    <!-- Form -->
    <form-wizard
      ref="propertyForm"
      title=""
      subtitle=""
      color="gray"
      @on-complete="onComplete">

      <tab-content 
        :before-change="()=>validateStep('step1')"
        title="Overview"
        icon="ti-settings">
        <hr>
        <overview-form 
          ref="step1"
          @on-validate="mergePartialModels"
          @set-size="populatePsqm"/>
      </tab-content>

      <tab-content 
        :before-change="()=>validateStep('step2')"
        title="Details"
        icon="ti-file">
        <hr>
        <details-form 
          ref="step2"
          @on-validate="mergePartialModels"/>
      </tab-content>

      <tab-content 
        :before-change="()=>validateStep('step3')"
        title="Photos & Attachments"
        icon="ti-image">
        <hr>
        <photos-form 
          ref="step3"
          @on-validate="mergePartialModels"/>
      </tab-content>

      <tab-content 
        title="Summary & Status"
        icon="ti-check">
        <hr>
        <add-summary :data="property"/>
      </tab-content>

      <button 
        slot="finish"
        :disabled="disableButton" 
        tabindex="-1" 
        type="button" 
        class="wizard-btn" 
        style="background-color: gray; border-color: gray; color: white;" 
        v-html="finishButtonDisplay"/>

    </form-wizard>
  </div>
</template>

<script>
import OverviewForm from '@/components/Properties/OverviewForm';
import DetailsForm from '@/components/Properties/DetailsForm';
import PhotosForm from '@/components/Properties/PhotosForm';
import AddSummary from '@/components/Properties/AddSummary';

export default {
  name: 'CreateProperty',
  middleware: 'businessAccount',
  components: {
    OverviewForm,
    DetailsForm,
    PhotosForm,
    AddSummary
  },
  data() {
    return {
      property: {},
      disableButton: false
    };
  },
  computed: {
    finishButtonDisplay() {
      return this.disableButton
        ? "<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>Loading..."
        : 'Finish';
    }
  },
  methods: {
    validateStep(name) {
      const refToValidate = this.$refs[name];
      return refToValidate.validate();
    },

    mergePartialModels(model, isValid, isFiles = false) {
      if (isValid) {
        this.property = Object.assign({}, this.property, model);
      }
      if (!isFiles) {
        this.$store.commit('setPropertyForm', this.property);
      }
    },
    populatePsqm(value) {
      this.$refs.step2.setPsqm(value);
    },
    async onComplete() {
      this.disableButton = true;
      const photosForm = new FormData();

      this.property.photos.map(obj => {
        photosForm.append('photos[]', obj.photo);
      });

      let temp = this.$store.state.propertyForm;
      delete temp.photos;

      let res = await this.$axios
        .$post('/api/v1/properties', temp)
        .catch(err => {
          this.disableButton = false;
        });

      await this.$axios
        .$post(
          '/api/v1/properties/' + res.meta.property.id + '/photos',
          photosForm
        )
        .then(response => {
          if (this.property.attachments.length > 0) {
            this.uploadAttachment(res.meta.property.id);
          }
        })
        .catch(err => {
          this.disableButton = false;
        });

      this.$notify.success({
        message: 'Property Has Been Added'
      });
      this.resetForm();
    },
    async uploadAttachment(id) {
      const attachmentsForm = new FormData();

      this.property.attachments.map(obj => {
        attachmentsForm.append('attachments[]', obj.file);
      });

      await this.$axios.$post(
        '/api/v1/properties/' + id + '/attachments',
        attachmentsForm
      );
    },
    resetForm() {
      this.disableButton = false;
      this.$refs.propertyForm.reset();
      this.$store.commit('resetPropertyForm');
      this.property = {};
      this.$refs.step1.resetForm();
      this.$refs.step2.resetForm();
      this.$refs.step3.resetForm();
      this.$router.push('/account/properties');
    }
  }
};
</script>
