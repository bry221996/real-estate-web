<template>
  <div 
    id="changeLogs" 
    class="container-fluid">
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Updated At</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(history, index) in histories" 
            :key="index">
            <td class="w-25">{{ history.updated_at ? history.updated_at.to : 'Unknown' }}</td>
            <td class="w-75">
              <div class="container-fluid">
                <div 
                  class="row" 
                  v-html="changes(index)"/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import * as moment from 'moment';
export default {
  name: 'ChangeLogs',
  props: {
    property: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      histories: []
    };
  },
  computed: {
    logKeys() {
      let vkeys = [];
      let keys = ['updated_at', 'formatted_address', 'longitude', 'latitude'];
      if (this.property.changes) {
        vkeys = Object.keys(this.property.changes).filter(
          k => !keys.includes(k)
        );
      }
      return vkeys;
    }
  },
  mounted() {
    this.$axios
      .get(`/api/v1/properties/${this.property.id}/changes`)
      .then(res => {
        if (res.data.data.length) {
          this.histories = res.data.data;
        }
      });
  },
  methods: {
    changes(index) {
      let htmlData = '';
      let vkeys = [];
      let keys = [
        'updated_at',
        'formatted_address',
        'longitude',
        'latitude',
        'expired_at',
        'verified_at',
        'verified_by',
        'comment'
      ];

      vkeys = Object.keys(this.histories[index]).filter(k => !keys.includes(k));

      vkeys.map(key => {
        htmlData = htmlData + this.displayHtml(index, key);
      });
      return htmlData;
    },
    displayHtml(index, key) {
      let from = this.histories[index][key].from;
      let to = this.histories[index][key].to;

      let html;
      let keyLabel = key;

      switch (key) {
        case 'property_type_id':
          keyLabel = 'Property Type';
          break;

        case 'occupied':
          if (parseInt(from) == 0) {
            from = 'No';
            to = 'Yes';
          } else {
            from = 'Yes';
            to = 'No';
          }
          break;

        case 'garage_count':
          keyLabel = 'Garage Count';
          break;

        case 'bedroom_count':
          keyLabel = 'Number of Bedrooms';
          break;

        case 'bathroom_count':
          keyLabel = 'Number of Bathrooms';
          break;

        case 'property_status_id':
          keyLabel = 'Status';
          to = this.$store.state.propertyStatuses.find(
            type => type.value === parseInt(to)
          ).text;
          from = this.$store.state.propertyStatuses.find(
            type => type.value === parseInt(from)
          ).text;
          break;

        case 'offer_type_id':
          keyLabel = 'Offer Type';
          if (parseInt(to) === 1) {
            to = 'For Sale';
            from = 'For Rent';
          } else {
            to = 'For Rent';
            from = 'For Sale';
          }
          break;

        case 'price_per_sqm':
          keyLabel = 'Price/m²';
          break;

        case 'furnished_type_id':
          keyLabel = 'Furnishing Type';
          to = this.$store.state.furnishingTypes.find(
            type => type.value === parseInt(to)
          ).text;
          from = this.$store.state.furnishingTypes.find(
            type => type.value === parseInt(from)
          ).text;
          break;
      }

      const advancedKey = ['features', 'attachments', 'photos'];

      if (!advancedKey.includes(key)) {
        html = `
          <div class="col-12 p-0">
            <p class="m-0 p-0">
              Change 
                <strong class="text-capitalize">${keyLabel}</strong>
              from 
                ${from} 
              to 
                ${to}
            </p>
          </div>`;
      }

      if (key === 'features') {
        html = this.featuresChangeDisplay(from, to);
      }

      if (key === 'photos') {
        html = this.photosChangeDisplay(from, to);
      }

      if (key === 'attachments') {
        html = this.attachmentsChange(from, to);
      }

      return html;
    },
    featuresChangeDisplay(from, to) {
      let removedFeatures = this.diffChecker(from, to).removed;
      let addedFeatures = this.diffChecker(from, to).added;
      let html = '';

      addedFeatures.map((feature, index) => {
        if (index === 0) {
          html = `<div class="col-12 p-0">
                    <p class="m-0 p-0">
                      <strong>Added Features</strong>
                    </p>
                  </div>
                  <div class="col-12">
                  <ul>
                    <li>${feature.name}</li>`;
        } else {
          html = `${html} <li>${feature.name}</li>`;
        }

        if (index === addedFeatures.length - 1) {
          html = html + '</ul></div>';
        }
      });

      removedFeatures.map((feature, index) => {
        if (index === 0) {
          html = `${html}
                  <div class="col-12 p-0">
                    <p class="m-0 p-0">
                      <strong>Removed Features</strong>
                    </p>
                  </div>
                  <div class="col-12">
                    <ul><li>${feature.name}</li>`;
        } else {
          html = `${html} <li>${feature.name}</li>`;
        }

        if (index === removedFeatures.length - 1) {
          html = html + '</ul></div>';
        }
      });

      return html;
    },
    diffChecker(from, to) {
      let fromIds = [];
      let toIds = [];
      let removed = [];
      let added = [];

      from.map(x => fromIds.push(x.id));
      to.map(x => toIds.push(x.id));

      from.map(x => {
        if (!toIds.includes(x.id)) {
          removed.push(x);
        }
      });

      to.map(x => {
        if (!fromIds.includes(x.id)) {
          added.push(x);
        }
      });

      return { added, removed };
    },
    photosChangeDisplay(from, to) {
      let removedPhotos = this.diffChecker(from, to).removed;
      let addedPhotos = this.diffChecker(from, to).added;
      let html = '';

      removedPhotos.map((photo, index) => {
        if (index === 0) {
          html = `<div class="col-12 p-0">
                    <p class="m-0 p-0">
                      <strong>Removed Photos</strong>
                    </p>
                  </div>
                  <div class="col-4 col-sm-2 col-md-1 p-2">
                    <a href="${photo.link}" target="_blank">
                      <img class="w-100" src="${photo.link}">
                    </a>
                  </div>`;
        } else {
          html = `${html} 
                  <div class="col-4 col-sm-2 col-md-1 p-0">
                    <a href="${photo.link}" target="_blank">
                      <img class="w-100" src="${photo.link}">
                    </a>
                  </div>`;
        }
      });

      addedPhotos.map((photo, index) => {
        if (index === 0) {
          html = `<div class="col-12">
                    <p class="m-0 p-0">
                      <strong>Added Photos</strong>
                    </p>
                  </div>
                  <div class="col-4 col-sm-2 col-md-1 p-2">
                    <a href="${photo.link}" target="_blank">
                      <img class="w-100" src="${photo.link}">
                    </a>
                  </div>`;
        } else {
          html = `${html} 
                  <div class="col-4 col-sm-2 col-md-1 p-2">
                    <a href="${photo.link}" target="_blank">
                      <img class="w-100" src="${photo.link}">
                    </a>
                  </div>`;
        }
      });

      return html;
    },
    attachmentsChange(from, to) {
      let removedAttachments = this.diffChecker(from, to).removed;
      let addedAttachments = this.diffChecker(from, to).added;
      let html = '';

      addedAttachments.map((attachment, index) => {
        if (index === 0) {
          html = `<div class="col-12 p-0">
                    <p class="m-0 p-0">
                      <strong>Uploaded Attachment/s</strong>
                    </p>
                  </div>
                  <div class="col-2 p-0">
                    <a href="${attachment.link}" target="_blank">
                      <i class="la la-file-pdf-o la-3x"></i>
                    </a>
                  </div>`;
        } else {
          html = `${html} 
                  <div class="col-2 p-0">
                    <a href="${attachment.link}" target="_blank">
                      <i class="la la-file-pdf-o la-3x"></i>
                    </a>
                  </div>`;
        }
      });

      removedAttachments.map((attachment, index) => {
        if (index === 0) {
          html = `<div class="col-12 p-0">
                    <p class="m-0 p-0">
                      <strong>Removed Attachment/s</strong>
                    </p>
                  </div>
                  <div class="col-2 p-0">
                    <a href="${attachment.link}" target="_blank">
                      <i class="la la-file-pdf-o la-3x"></i>
                    </a>
                  </div>`;
        } else {
          html = `${html} 
                  <div class="col-2 p-0">
                    <a href="${attachment.link}" target="_blank">
                      <i class="la la-file-pdf-o la-3x"></i>
                    </a>
                  </div>`;
        }
      });
      return html;
    }
  }
};
</script>
