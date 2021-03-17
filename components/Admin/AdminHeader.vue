<template>
  <!-- eslint-disable max-len -->
  <div class="header-container">
    <ul class="nav-left">
      <li>
        <a
          id="sidebar-toggle"
          class="sidebar-toggle">
          <i class="ti-menu"/>
        </a>
      </li>
    </ul>
    <ul class="nav-right mr-2">
      <li class="dropdown">
        <a
          class="dropdown-toggle no-after peers fxw-nw ai-c lh-1"
          data-toggle="dropdown">
          <div class="peer mR-10">
            <img
              :src="'https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png'"
              class="w-2r bdrs-50p"
              alt="">
          </div>
          <div class="peer">
            <span class="fsz-sm c-grey-900">{{ this.$store.state.auth.user.first_name }}</span>
          </div>
        </a>
        <ul class="dropdown-menu fsz-sm">
          <li>
            <nuxt-link
              class="d-b td-n pY-5 bgcH-grey-100 c-grey-700"
              to="/"
              @click.native="logout">
              <i class="ti-power-off mR-10"/>
              <span>Logout</span>
            </nuxt-link >
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AdminHeader',
  methods: {
    logout() {
      this.$auth.logout();
      this.$notify.info({
        message: 'Logout Successful'
      });
    }
  }
};
</script>
