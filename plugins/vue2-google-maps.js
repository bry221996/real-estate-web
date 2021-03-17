import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBDwe2zrnGBOB8GoVBWMUQThkze1jEiCPM',
    libraries: 'places'
  }
});
