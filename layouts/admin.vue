<template>
  <div id="restricted">
    <div class="sidebar">
      <admin-sidebar/>
    </div>

    <div class="page-container">
      <div class="header navbar">
        <admin-header/>
      </div>

      <main class="main-content bgc-grey-100">
        <div id="mainContent">
          <nuxt/>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import AdminHeader from '@/components/Admin/AdminHeader';
import AdminSidebar from '@/components/Admin/AdminSidebar';

export default {
  components: {
    AdminHeader,
    AdminSidebar
  },
  mounted() {
    $('.sidebar-toggle').on('click', e => {
      $('#restricted').toggleClass('is-collapsed');
      e.preventDefault();
    });

    $('#sidebar-toggle').click(e => {
      e.preventDefault();
      setTimeout(() => {
        window.dispatchEvent(window.EVENT);
      }, 300);
    });

    $('.sidebar-link').on('click', () => {
      if ($('#restricted').hasClass('is-collapsed')) {
        $('#restricted').removeClass('is-collapsed');
      }
    });
  }
};
</script>
