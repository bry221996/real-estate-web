<template>
  <div>
    <background-video 
      :sources="['/Architecture-303.mp4']">
      <div class="overlay"/>
      <div class="page-container">
        <nav>
          <a href="/">
            <img 
              class="landing-page-brand" 
              src="~/assets/landing-page/Lazatu-Brand-Logo.png" 
              alt="Lazatu">
          </a>
          <div class="navigation">
            <a 
              id="customersTobusinesses" 
              class="nav-item active" 
              href="#" 
              @click="slide('customersTobusinesses')">
              <span class="nav-for-desktop">For customers</span>
            </a>
            <a 
              id="businessesTocustomers" 
              class="nav-item" 
              href="#" 
              @click="slide('businessesTocustomers')">
              <span class="nav-for-desktop">For Businesses</span>
            </a>
          </div>
        </nav>
        <main>
          <div 
            id="customers" 
            class="content show">
            <div class="article-col center-mobile">
              <h1>For Customers</h1>
              <p>Discover for-sale and rental listings.</p>
              <p>Compare home values and connect with local professionals.</p>                        
              <p>Explore the best places to live and work with Lazatu.</p>
              <div class="badges">
                <a href="https://play.google.com/store/apps/details?id=com.lazatu.app&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                  <img 
                    id="play__store"
                    alt="Get it on Google Play" 
                    src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png">
                </a>
                <a 
                  id="apple_store"
                  href="https://itunes.apple.com/ph/app/lazatu/id1455470534?mt=8"/>
              </div>
            </div>
            <div class="image-col mobile-only">
              <img 
                src="/UpdatedCustomerLanding.png" 
                alt="Lazatu, for customers.">
            </div>
          </div>
          <div 
            id="businesses" 
            class="content">
            <div class="image-col mobile-only">
              <img 
                src="/UpdatedBusinessLanding.png" 
                alt="Lazatu, for businesses.">
            </div>
            <div class="article-col center-mobile">
              <h1>For Businesses</h1>
              <p>Post your property on our Lazatu business website.</p>
              <p>Connect & Meet with buyers via booking platform.</p>                        
              <p>Manage your properties and become our partner.</p>
              <div class="badges">
                <a href="https://play.google.com/store/apps/details?id=com.lazatu.app&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                  <img 
                    id="play__store"
                    alt="Get it on Google Play" 
                    src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png">
                </a>
                <a 
                  id="apple_store"
                  href="https://itunes.apple.com/ph/app/lazatu/id1455470534?mt=8"/>
              </div>
              <nuxt-link 
                to="/register" 
                class="signup-btn">
                SIGNUP NOW!
              </nuxt-link>
            </div>   
          </div>
        </main>
      </div>
    </background-video>
    <footer 
      v-if="showFooter"
      style="background-color: rgba(0,0,0, 0.6); height: 6vh" 
      class="d-flex justify-content-center align-items-center">
      <i 
        v-for="(icon, index) in icons" 
        :key="index" 
        :class="icon.class"
        class="contact_icons"
        @click="open(icon.key)"/>
    </footer>
  </div>
</template>

<script>
import BackgroundVideo from '@/components/Utils/BackgroundVideo.vue';
export default {
  components: {
    BackgroundVideo
  },
  auth: false,
  data() {
    return {
      icons: [
        {
          key: 'messenger',
          class: 'fab fa-facebook-messenger',
          mobileUrl: 'http://m.me/lazatu.lazatu.9',
          webUrl: 'https://www.messenger.com/t/LazatuOfficial'
        },
        {
          key: 'wechat',
          class: 'fab fa-weixin',
          mobileUrl: 'weixin://dl/chat?639959728810',
          webUrl: 'https://web.wechat.com/chat?639959728810'
        },
        {
          key: 'whatsapp',
          class: 'fab fa-whatsapp',
          mobileUrl: 'whatsapp://send?phone=+639998765432',
          webUrl: 'https://web.whatsapp.com/send?phone=+639998765432'
        },
        {
          key: 'privacy-policy',
          class: 'fas fa-user-lock',
          link: '/privacy-policy'
        }
      ],
      showFooter: false
    };
  },
  mounted() {
    this.showFooter = true;
    if (this.$route.query.property) {
      window.location = `lazatu://property/${this.$route.query.property}`;
      setTimeout(() => {
        if (this.$device.isMobileOrTablet) {
          if (this.$device.isIos) {
            window.location =
              'https://itunes.apple.com/ph/app/lazatu/id1455470534?mt=8';
          } else {
            window.location =
              'https://play.google.com/store/apps/details?id=com.lazatu.app';
          }
        }
        this.$router.push('/');
      }, 500);
    }
  },
  methods: {
    slide(id) {
      let showContent = id.split('To')[0];
      let toSlide = document.getElementById(showContent);
      let hideContent = id.split('To')[1];
      let toHide = document.getElementById(hideContent);

      let activeMenu = document.getElementById(id);
      let inactiveMenu = document.getElementById(
        `${hideContent}To${showContent}`
      );

      let isToSlide = toSlide.classList.contains('show');

      if (!isToSlide) {
        activeMenu.classList.add('active');
        inactiveMenu.classList.remove('active');
        toHide.classList.remove('show');
        toSlide.classList.add('show');
      }
    },
    open(key) {
      let icon = this.icons.find(icon => icon.key === key);
      if (icon.link) {
        this.$router.push(icon.link);
      } else {
        window.open(icon.webUrl, '_blank');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contact_icons {
  color: white;
  padding-left: 1.8rem;
  padding-right: 1.8rem;
  font-size: 1.5em;

  &:hover {
    color: #f49a0d;
  }
}

@media (max-width: 575.98px) {
  .contact_icons {
    font-size: 1.2em;
  }
}
</style>
