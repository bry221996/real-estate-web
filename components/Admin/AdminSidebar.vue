<template>
  <div class="sidebar-inner">
    <!-- ### $Sidebar Header ### -->
    <div class="sidebar-logo">
      <div class="peers ai-c fxw-nw">
        <div class="peer peer-greed">
          <nuxt-link
            to="/"
            class="sidebar-link td-n">
            <div class="peers ai-c fxw-nw">
              <div class="peer">
                <div class="logo d-flex align-items-center justify-content-center">
                  <img src="/favicon/favicon-32x32.png">
                </div>
              </div>
              <div class="peer peer-greed">
                <h3 class="lh-1 logo-text mb-1">LAZATU</h3>
                <small class="account_description">{{ brandLabel }}</small>
              </div>
            </div>
          </nuxt-link>
        </div>
        <div class="peer">
          <div class="mobile-toggle sidebar-toggle">
            <a class="td-n">
              <i class="ti-arrow-circle-left"/>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ### $Sidebar Menu ### -->
    <ul class="sidebar-menu scrollable pos-r mT-30">
      <li 
        :class="isVisible('dashboard') ? 'pb-2 pt-2' : ''" 
        class="nav-item active">
        <nuxt-link
          v-show="isVisible('dashboard')"
          to="/account"
          class="sidebar-link"
          exact-active-class="sidebar-link__active">
          <span class="icon-holder">
            <i class="ti-home"/>
          </span>
          <span class="title">Dashboard</span>
        </nuxt-link>
      </li>
      <li 
        :class=" isVisible('my-profile') ? 'pb-2 pt-2' : ''" 
        class="nav-item">
        <nuxt-link
          v-show="isVisible('my-profile')"
          to="/account/my-profile"
          class="sidebar-link"
          exact-active-class="sidebar-link__active">
          <span class="icon-holder">
            <i class="ti-user"/>
          </span>
          <span class="title">My Profile</span>
        </nuxt-link>
      </li>
      <li 
        :class="isVisible('customers') ? 'pb-2 pt-2' : ''" 
        class="nav-item">
        <nuxt-link
          v-show="isVisible('customers')"
          to="/account/customers"
          class="sidebar-link"
          exact-active-class="sidebar-link__active">
          <span class="icon-holder">
            <i class="ti-user"/>
          </span>
          <span class="title">Customers</span>
        </nuxt-link>
      </li>
      <li 
        :class="isVisible('business-accounts') ? 'pb-2 pt-2' : ''" 
        class="nav-item">
        <nuxt-link
          v-show="isVisible('business-accounts')"
          to="/account/business-accounts"
          class="sidebar-link"
          exact-active-class="sidebar-link__active">
          <span class="icon-holder">
            <i class="ti-wallet"/>
          </span>
          <span class="title">Business Accounts</span>
        </nuxt-link>
      </li>
      <li 
        :class=" isVisible('properties') ? 'pb-2 pt-2' : ''" 
        class="nav-item">
        <nuxt-link
          v-show="isVisible('properties')"
          to="/account/properties"
          class="sidebar-link"
          exact-active-class="sidebar-link__active">
          <span class="icon-holder">
            <i class="ti-files"/>
          </span>
          <span
            class="title"
            v-text="label.properties"/>
        </nuxt-link>
      </li>
      <li 
        :class=" isVisible('schedules') ? 'pb-2 pt-2' : ''" 
        class="nav-item">
        <nuxt-link
          v-show="isVisible('schedules')"
          to="/account/schedules"
          class="sidebar-link"
          exact-active-class="sidebar-link__active">
          <span class="icon-holder">
            <i class="ti-calendar"/>
          </span>
          <span
            class="title"
            v-text="label.schedule"/>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'Sidebar',
  data() {
    return {
      activeMenus: ['dashboard', 'properties', 'schedules'],
      label: {
        properties: 'Properties',
        schedule: 'Manage Schedules'
      },
      brandLabel: ''
    };
  },
  mounted() {
    const role = this.$store.state.auth.user.role_id;
    if (this.$store.getters.isSuperAdmin) {
      this.activeMenus.push('business-accounts', 'customers');
      this.brandLabel = 'ADMIN ACCOUNT';
    }
    if (this.$store.getters.isBusinessAccount) {
      this.activeMenus.push('my-profile');
      this.label = {
        properties: 'My Properties',
        schedule: 'My Schedules'
      };
      this.brandLabel = 'BUSINESS ACCOUNT';
    }
    if (this.$store.getters.isLazatuAdmin) {
      this.activeMenus.push('business-accounts', 'customers', 'my-profile');
      this.brandLabel = 'OPERATION ACCOUNT';
    }
  },
  methods: {
    toggle(event) {
      this.$emit('toggle');
    },
    isVisible(menu) {
      return this.activeMenus.includes(menu);
    }
  }
};
</script>
