import * as $ from 'jquery';

$(document).ready(() => {
  $('.sidebar-link').on('click', () => {
    if ($('#restricted').hasClass('is-collapsed')) {
      $('#restricted').removeClass('is-collapsed');
    }
  });
});
