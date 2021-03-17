<template>
  <div 
    id="property-details-container" 
    class="container-fluid card p-0">
    <tabs
      :tabs="tabs"
      :current-tab="currentTab"
      :wrapper-class="'default-tabs'"
      :tab-class="'default-tabs__item'"
      :tab-active-class="'default-tabs__item_active'"
      :line-class="'default-tabs__active-line'"
      @onClick="handleClick"
    />
    <div class="card-body">
      <property-detail 
        v-if="currentTab === 'tab1'" 
        :is-viewing="isViewing"
        :details="property"/>
      <change-logs 
        v-if="currentTab === 'tab2'"
        :property="property"/>
    </div>
  </div>
</template>

<script>
import Tabs from 'vue-tabs-with-active-line';
import PropertyDetail from '@/components/Properties/PropertyDetail';
import ChangeLogs from '@/components/Properties/ChangeLogs';
export default {
  name: 'DetailsContainer',
  components: {
    Tabs,
    PropertyDetail,
    ChangeLogs
  },
  props: {
    property: {
      type: Object,
      default: () => {}
    },
    isViewing: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tabs: [{ title: 'More Details', value: 'tab1' }],
      currentTab: 'tab1'
    };
  },
  mounted() {
    if (!this.$store.getters.isBusinessAccount) {
      this.tabs.push({ title: 'Previous Changes', value: 'tab2' });
    }
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

<style lang="scss">
.default-tabs {
  position: relative;
  margin: 0 auto;
  padding: 0;

  .default-tabs__item {
    display: inline-block;
    margin: 0 5px;
    padding: 10px;
    padding-bottom: 8px;
    font-size: 16px;
    letter-spacing: 0.8px;
    color: gray;
    text-decoration: none;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s;
  }
  .default-tabs__active-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: black;
    transition: transform 0.4s ease, width 0.4s ease;

    &:focus {
      outline: none !important;
    }
  }
}
@media (max-width: 400px) {
  .default-tabs__item {
    font-size: 12px !important;
  }
}
</style>
