<template>
  <b-card
    id="overview_card"
    no-body
    class="shadow p-3 mb-3 bg-white rounded w-100">
    <div class="container-fluid">
      <div class="row">
        <div 
          class="col-lg-3 col-md-3 col-sm-4 col-4 p-0">
          <div class="square">
            <div 
              :style="`background-image: url('${coverPhoto}'); background-size: cover; background-repeat: no-repeat; background-position: center;`"
              class="content"/>
          </div>
        </div>
        <div 
          class="col-lg-9 col-md-9 col-sm-8 col-8">
          <div class="container-fluid p-0 h-100">
            <div class="row h-100">
              <div 
                class="col-lg-9 col-md-9">
                <div class="container-fluid p-0 h-100">
                  <div class="row h-100">
                    <div class="col-lg-7">
                      <h3 class="m-0 overview_card_heading">
                        <strong class="d-none d-sm-block">
                          {{ property.name }}
                        </strong>
                      </h3>  
                      <small class="d-none d-sm-none d-md-block overview_card_subheading">
                        {{ property.formatted_address }}
                      </small>
                      <h5 
                        class="p-0 m-0 overview_card_body"> 
                        <strong>{{ property.price ? '₱ ' + property.price.toLocaleString() : 0 }} </strong>
                      </h5>
                      <small 
                        id="overview_size" 
                        class="d-block d-sm-none">
                        {{ `${size} sqm` }}
                      </small>
                      <small 
                        id="overview_city" 
                        class="d-block d-sm-none">
                        {{ `${property.city}` }}
                      </small>
                    </div>
                    <div class="col-lg-5 d-flex align-items-center justify-content-center overview_show_map"/>
                  </div>
                </div>
              </div>
              
              <div 
                class="col-lg-3 col-md-3">
                <div 
                  class="row p-0 h-100 overview_card_icons">
                  <div class="col-lg-12 col-md-12 col-sm-4 col-4 p-0 justify-content-center d-flex align-items-center">
                    <span>
                      <img
                        class="p-0 icons"
                        src="~/assets/icons/car_icon.svg">
                      {{ `${property.garage_count}` }}
                    </span>
                  </div>
                  <div class="col-lg-12 col-md-12 col-sm-4 col-4 p-0 justify-content-center d-flex align-items-center">
                    <span>
                      <img
                        class="p-0 icons"
                        src="~/assets/icons/bed_icon.svg">
                      {{ `${property.bedroom_count}` }}
                    </span>
                  </div>
                  <div class="col-lg-12 col-md-12 col-sm-4 col-4 p-0 justify-content-center d-flex align-items-center">
                    <span>
                      <img
                        class="p-0 icons"
                        src="~/assets/icons/bath_icon.svg">
                      {{ `${property.bathroom_count}` }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'PropertyView',
  props: {
    property: {
      type: Object,
      default: () => {}
    },
    creating: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    coverPhoto() {
      return this.property.photos && this.property.photos[0]
        ? this.property.photos[0].link
        : 'https://i.ibb.co/QbBxzzB/g-logo.png';
    },
    size() {
      const fSize = parseFloat(this.property.floor_size);
      const lSize = parseFloat(this.property.lot_size);

      return fSize || lSize;
    }
  }
};
</script>

<style lang="scss" scoped>
.icons {
  width: 50%;
  height: 50%;
}

// Extra Large Screen //
@media (min-width: 1200px) {
  .overview_card_heading {
    margin-top: 25px !important;
  }

  .overview_card_subheading {
    margin-top: 25px !important;
    font-size: 15px !important;
  }

  .overview_card_body {
    margin-top: 25px !important;
  }
}

// Large Screen //
@media (min-width: 992px) and (max-width: 1199.98px) {
  .overview_card_heading {
    margin-top: 10px !important;
    font-size: 1.25rem !important;
  }

  .overview_card_subheading {
    margin-top: 25px !important;
    font-size: 15px !important;
  }

  .overview_card_body {
    margin-top: 25px !important;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .overview_card_heading {
    margin-top: 5px !important;
    margin-bottom: 3vw !important;
    font-size: 1rem !important;
  }

  .overview_card_subheading {
    font-size: 13px !important;
  }

  .icons {
    width: 40%;
    height: 40%;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .overview_card_heading {
    font-size: 15px;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }

  .icons {
    width: 30%;
    height: 30%;
  }

  .overview_card_icons {
    font-size: 13px !important;
  }
}

@media (max-width: 575.98px) {
  .overview_card_body {
    font-size: 4vw !important;
  }

  #overview_size {
    margin-top: 2vw !important;
    font-size: 2.8vw !important;
  }

  #overview_city {
    font-size: 2.8vw !important;
  }

  .icons {
    width: 30%;
    height: 30%;
  }

  .overview_card_icons {
    margin-left: 10px !important;
  }
}

@media (max-width: 450px) {
  #overview_size,
  #overview_city {
    font-size: 11px !important;
  }
}
</style>
