<template>
  <div id="edit-property">
    <!-- Form -->
    <form-wizard
      ref="propertyForm"
      title=""
      subtitle=""
      color="gray"
      @on-complete="onUpdate">

      <tab-content 
        :before-change="()=>validateStep('step1')"
        title="Overview"
        icon="ti-settings">
        <hr>
        <overview-form 
          ref="step1"
          :is-editing="true"
          :initial-value="property"
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
          :is-editing="true"
          :initial-value="property"
          @on-validate="mergePartialModels"/>
      </tab-content>

      <tab-content 
        :before-change="()=>validateStep('step3')"
        title="Photos & Attachments"
        icon="ti-image">
        <hr>
        <photos-form 
          ref="step3"
          :is-editing="true"
          :initial-value="property"
          @on-validate="mergePartialModels"/>
      </tab-content>

      <tab-content 
        title="Summary & Status"
        icon="ti-check">
        <hr>
        <add-summary :data="newValue"/>
      </tab-content>

      <button 
        slot="finish"
        :disabled="disableButton" 
        tabindex="-1" 
        type="button" 
        class="wizard-btn" 
        style="background-color: gray; border-color: gray; color: white;">
        Update
      </button>

    </form-wizard>
  </div>
</template>

<script>
import OverviewForm from '@/components/Properties/OverviewForm';
import DetailsForm from '@/components/Properties/DetailsForm';
import PhotosForm from '@/components/Properties/PhotosForm';
import AddSummary from '@/components/Properties/AddSummary';

export default {
  name: 'EditProperty',

  async asyncData({ params, app }) {
    const property = await app.$axios.$get(
      `/api/v1/properties/${params.id}?include=attachments`
    );
    return { property: property.data };
  },
  components: {
    OverviewForm,
    DetailsForm,
    PhotosForm,
    AddSummary
  },
  data() {
    return {
      newValue: {},
      disableButton: false,
      newPhotos: [],
      newAttachments: []
    };
  },

  methods: {
    validateStep(name) {
      const refToValidate = this.$refs[name];
      return refToValidate.validate();
    },

    mergePartialModels(model, isValid, isFiles = false) {
      if (isValid) {
        this.newValue = Object.assign({}, this.newValue, model);
        this.$store.commit('setPropertyForm', this.newValue);
      }
    },
    async onUpdate() {
      this.disableButton = true;
      this.checkNewPhotos();
      this.checkNewAttachments();
      this.updateProperty();
    },

    hasChanges() {
      let formCopy = Object.assign({}, this.$store.state.propertyForm);
      let keys = Object.keys(formCopy);
      let bool = true;

      keys.map(key => {
        if (
          key in this.property &&
          typeof this.property[key] !== 'object' &&
          key !== 'formatted_address'
        ) {
          let x = formCopy[key] == this.property[key];
          bool = bool && x;
        }

        if (key === 'features') {
          if (formCopy.features.length !== this.property.features.length) {
            bool = false;
          }
        }
      });

      return !bool;
    },

    checkNewPhotos() {
      this.$store.state.propertyForm.photos.map(photo => {
        if (photo.photo) {
          this.newPhotos.push(photo);
        }
      });
    },

    checkNewAttachments() {
      this.$store.state.propertyForm.attachments.map(attachment => {
        if (!attachment.id) {
          this.newAttachments.push(attachment);
        }
      });
    },

    async updateProperty() {
      if (this.hasChanges()) {
        await this.$axios.$put(
          `/api/v1/properties/${this.property.id}`,
          this.$store.state.propertyForm
        );
      }

      this.updatePhotos();

      this.updateAttachments();
    },

    async updatePhotos() {
      if (this.$store.state.propertyForm.removedPhoto.length > 0) {
        await this.$axios.$delete(
          `/api/v1/properties/${this.property.id}/photos`,
          {
            params: { ids: this.$store.state.propertyForm.removedPhoto }
          }
        );
      }

      if (this.newPhotos.length > 0) {
        const photosForm = new FormData();

        this.newPhotos.map(obj => {
          photosForm.append('photos[]', obj.photo);
        });

        await this.$axios.$post(
          `/api/v1/properties/${this.property.id}/photos`,
          photosForm
        );
      }
    },

    async updateAttachments() {
      if (this.$store.state.propertyForm.removedAttachment.length > 0) {
        await this.$axios.$delete(
          `/api/v1/properties/${this.property.id}/attachments`,
          { params: { ids: this.$store.state.propertyForm.removedAttachment } }
        );
      }

      if (this.newAttachments.length > 0) {
        const attachmentsForm = new FormData();

        this.newAttachments.map(obj => {
          attachmentsForm.append('attachments[]', obj.file);
        });

        await this.$axios.$post(
          `/api/v1/properties/${this.property.id}/attachments`,
          attachmentsForm
        );
      }

      this.$notify.success({
        message: 'Property Has Been Updated'
      });

      this.resetForm();
    },

    resetForm() {
      this.disableButton = false;
      this.$refs.propertyForm.reset();
      this.$store.commit('resetPropertyForm');
      this.newValue = {};
      this.$refs.step1.resetForm();
      this.$refs.step2.resetForm();
      this.$refs.step3.resetForm();
      this.$router.push('/account/properties');
    },

    populatePsqm(value) {
      this.$refs.step2.setPsqm(value);
    }
  }
};
</script>
