<template>
  <div 
    id="photos-form" 
    class="row justify-content-center">

    <div class="col-lg-8 col-md-10 col-sm-10">
      <div class="form-group row">
        <label class="col-sm-4 col-md-3 col-lg-4 col-form-label">
          Photos
          <p class="m-0">
            <small 
              v-if="!$v.photos.required" 
              class="text-danger">
              Photo is required
            </small>
          </p>
          <p>
            <small 
              v-if="!$v.photos.minLength" 
              class="text-danger">
              Add at least 5 photos
            </small>
          </p>
        </label>
        <div 
          id="photos" 
          class="col-sm-6 col-md-6 col-lg-6 align-self-center">
          <div 
            v-if="photos.length < 1" 
            class="card rectangle">
            <label
              class="m-0"
              for="imageUpload">
              <div 
                class="content d-flex align-items-center justify-content-center"
                style="background-image: url('https://cdn1.iconfinder.com/data/icons/hawcons/32/698394-icon-130-cloud-upload-512.png'); background-size: 50%; background-repeat: no-repeat; background-position: center;" />
            </label>
          </div>
          <div 
            v-else
            class="card rectangle">
            <div 
              :style="`background-image: url('${photos[selectedPhoto].link}'); background-size: cover; background-repeat: no-repeat; background-position: center;`" 
              class="content d-flex align-items-start justify-content-end">
              <button 
                type="button" 
                class="btn btn-danger btn-circle mr-1 mt-1"
                @click="removePhoto">
                <i class="fa fa-times"/>
              </button>
            </div>
          </div>
          <div class="container-fluid p-0 m-0 row">
            <div 
              v-for="(photo, index) in photos"
              :key="index" 
              class="col-2 col-sm-1 col-md-3 col-lg-2 p-2">
              <div 
                class="card square" 
                @click="setSelected(index)">
                <div 
                  :style="`background-image: url('${photo.link}'); background-size: cover; background-repeat: no-repeat; background-position: center;`" 
                  class="content d-flex align-items-center justify-content-center"/>
              </div>
            </div>

            <div 
              v-show="photos.length > 0" 
              class="col-2 col-sm-1 col-md-3 col-lg-2 p-2">
              <div class="card square">
                <label
                  class="m-0"
                  for="imageUpload">
                  <div class="content d-flex align-items-center justify-content-center">
                    <i
                      class="fas fa-plus"
                      style="color: gray"/>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-4 col-md-3 col-lg-4 col-form-label">
          Attachments
        </label>
        <div class="col-sm-6 col-md-6 col-lg-6 align-self-center">
          <div class="container-fluid">
            <div class="row">
              <label
                class="m-0"
                for="attachmentUpload">
                <div class="btn btn-sm card mb-2 mr-2">
                  Add File
                </div>
              </label>
                
              <div 
                v-for="(attachment, index) in attachments" 
                :key="index" 
                class="btn-group mb-2 mr-2"
                role="group" >
                <div 
                  v-if="attachment.link" 
                  class="btn btn-sm card">
                  <a 
                    :href="attachment.link" 
                    target="_blank">
                    {{ attachment.name }}
                  </a>
                </div>
                <div 
                  v-else 
                  class="btn btn-sm card">
                  {{ attachment.name }}
                </div>
                <div 
                  class="btn btn-sm card"
                  @click="removeAttachment(index)">
                  <span>
                    <i class="la la-close"/>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <input
        id="imageUpload"
        type="file"
        class="form-control-file"
        accept="image/*"
        style="display:none"
        multiple
        @change="addPhotos">

      <input
        id="attachmentUpload"
        type="file"
        class="form-control-file"
        accept="image/*,application/pdf"
        style="display:none"
        multiple
        @change="addAttachments">
    </div>
  </div>
</template>

<script>
const { required, minLength } = require('vuelidate/lib/validators');

export default {
  name: 'PhotosForm',
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
      photos: [],
      attachments: [],
      removedPhoto: [],
      removedAttachment: [],
      selectedPhoto: 0
    };
  },
  validations: {
    photos: {
      required,
      minLength: minLength(5)
    },
    form: ['photos']
  },

  mounted() {
    this.checkIfEditingMode();
  },

  methods: {
    addPhotos(e) {
      if (!e.target.files.length) return;

      var photos = e.target.files;

      for (var index = 0; index < photos.length; index++) {
        this.createImage(photos[index]);
      }
    },
    createImage(photo) {
      let THIS = this;
      new ImageCompressor(photo, {
        quality: 0.6,
        success(result) {
          let reader = new FileReader();
          reader.onload = e => {
            let dataURI = e.target.result;
            if (dataURI) {
              THIS.photos.push({ link: dataURI, photo: result });
            }
          };
          reader.readAsDataURL(result);
        }
      });
    },
    getOrientation(file, callback) {
      var reader = new FileReader();

      reader.onload = function(event) {
        var view = new DataView(event.target.result);

        if (view.getUint16(0, false) != 0xffd8) return callback(-2);

        var length = view.byteLength,
          offset = 2;

        while (offset < length) {
          var marker = view.getUint16(offset, false);
          offset += 2;

          if (marker == 0xffe1) {
            if (view.getUint32((offset += 2), false) != 0x45786966) {
              return callback(-1);
            }
            var little = view.getUint16((offset += 6), false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            var tags = view.getUint16(offset, little);
            offset += 2;

            for (var i = 0; i < tags; i++)
              if (view.getUint16(offset + i * 12, little) == 0x0112)
                return callback(view.getUint16(offset + i * 12 + 8, little));
          } else if ((marker & 0xff00) != 0xff00) break;
          else offset += view.getUint16(offset, false);
        }
        return callback(-1);
      };

      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    },

    addAttachments(e) {
      if (!e.target.files.length) return;

      var attachments = e.target.files;

      for (var index = 0; index < attachments.length; index++) {
        this.createAttachment(attachments[index]);
      }
    },

    createAttachment(attachment) {
      let reader = new FileReader();
      reader.onload = e => {
        let dataURI = e.target.result;
        if (dataURI) {
          this.attachments.push({
            file: attachment,
            name: attachment.name
          });
        }
      };
      reader.readAsDataURL(attachment);
    },

    removeAttachment(index) {
      if (this.isEditing && this.attachments[index].id) {
        this.removedAttachment.push(this.attachments[index].id);
      }
      this.attachments.splice(index, 1);
      $('#attachmentUpload').val(null);
    },
    setSelected(i) {
      this.selectedPhoto = i;
    },
    removePhoto() {
      if (this.isEditing && this.photos[this.selectedPhoto].id) {
        this.removedPhoto.push(this.photos[this.selectedPhoto].id);
      }

      this.photos.splice(this.selectedPhoto, 1);

      if (this.photos.length > 0) {
        this.setSelected(0);
      }
      $('#imageUpload').val(null);
    },
    validate() {
      this.$v.form.$touch();
      const isValid = !this.$v.form.$invalid;
      this.$emit('on-validate', this.$data, isValid, false);
      return isValid;
    },
    resetForm() {
      this.photos = [];
      this.attachments = [];
      this.$v.$reset();
    },

    checkIfEditingMode() {
      if (this.isEditing) {
        for (let i of this.initialValue.photos) {
          this.photos.push({ link: i.link, id: i.id });
        }

        for (let i of this.initialValue.attachments) {
          this.attachments.push({
            name: this.initialValue.listing_id + '_' + 'attachment' + i.id,
            link: i.link,
            id: i.id
          });
        }
      }
    }
  }
};
</script>
