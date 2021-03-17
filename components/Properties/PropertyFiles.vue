<template>
  <div 
    id="property-files" 
    class="container-fluid">
    <div class="row ml-3 mr-4">
      Photos :
    </div>
    <div class="row ml-3 mr-4">
      <img 
        v-for="(item, index) in galleryPhotos" 
        :key="index" 
        :src="item.src"
        class="preview-img-item" 
        style="height: 100% !important"
        @click="$photoswipe.open(index, galleryPhotos)">
    </div>
    <div 
      v-if="attachments.length > 0" 
      class="row ml-3 mr-3 mt-2 mb-1">
      Attachments :
    </div>
    <div 
      v-if="attachments.length > 0" 
      class="row ml-3 mr-3">
      <div 
        v-for="(collection, index) in attachmentCollection" 
        :key="index" 
        class="btn btn-sm card" 
        v-html="collection"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropertyFiles',
  props: {
    attachments: {
      type: Array,
      default: () => []
    },
    photos: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    galleryPhotos: function() {
      let gallery = [];
      if (this.photos) {
        this.photos.map(photo => {
          gallery.push({
            src: photo.link,
            w: 500,
            h: 300
          });
        });
      }
      return gallery;
    },
    attachmentCollection: function() {
      let collection = [];
      if (this.attachments) {
        this.attachments.map(att => {
          if (att.property_id) {
            collection.push(
              `<a href='${att.link}' target='_blank'><strong> Attachment_${
                att.property_id
              }_${att.id}</strong> </a>`
            );
          } else if (att.name) {
            collection.push(att.name);
          }
        });
      }
      return collection;
    }
  }
};
</script>

<style lang="scss" scoped>
#property-files {
  .square {
    position: relative;
    width: 100%;
  }

  .square:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  .content {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .preview-img-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .preview-img-item {
    margin: 5px;
    max-width: 80px;
    max-height: 80px;
  }
}
@media (max-width: 575.98px) {
  #property-files {
    padding: 0px;
    margin: 0px;
  }
}
</style>
