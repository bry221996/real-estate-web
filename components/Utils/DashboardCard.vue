<template>
  <div 
    class="card card-shadow card-border-radius cursorPointer" 
    @click="cardClick">
    <div class="card-body">
      <div>
        <div class="row">
          <div class="col-3">
            <div 
              :style="`color: ${iconColor}`"
              class="icon-big text-center">
              <i :class="icon"/>
            </div>
          </div>
          <div class="col-9">
            <div class="numbers">
              <p class="m-0">{{ title }}</p>
              <h2 class="m-0">{{ value }}</h2>
            </div>
          </div>
        </div>
        <div>
          <hr>
          <div class="stats d-flex justify-content-between">
            <p class="m-0"><i :class="subLableIcon"/> {{ subLabel }} </p>
            <p class="m-0"> {{ subValue }} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: '#F49A0D'
    },
    subLabel: {
      type: String,
      default: ''
    },
    subValue: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      default: 1
    },
    route: {
      type: String,
      default: '/'
    },
    subLableIcon: {
      type: String,
      default: ''
    }
  },
  methods: {
    cardClick() {
      this.$router.push(this.route);
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 20px;

  .card-body {
    .icon-big {
      font-size: 3em;
      min-height: 64px;
    }

    .numbers {
      text-align: right;

      p {
        font-size: 0.85rem;
      }
    }

    .stats {
      color: #a9a9a9;
      font-weight: 300;
      font-size: 0.75rem;
    }
  }
}
</style>
