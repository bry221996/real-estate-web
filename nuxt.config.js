require('dotenv').config();
const pkg = require('./package');
import webpack from 'webpack';

module.exports = {
  mode: 'universal',
  env: {
    baseUrl: process.env.BASE_URL || 'https://localhost:3000',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  },
  head: {
    title: 'Lazatu',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'msapplication-TileColor', content: '#603cba' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    script: [
      {
        src: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'
      },
      {
        src:
          'https://cdn.jsdelivr.net/npm/@xkeshi/image-compressor@0.5.3/dist/image-compressor.min.js'
      },
      {
        src: 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js'
      },
      {
        src:
          'https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js'
      }
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.5.0/css/all.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Open+Sans'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://maxcdn.icons8.com/fonts/line-awesome/1.1/css/line-awesome.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Poppins'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png'
      },
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest'
      },
      {
        rel: 'mask-icon',
        href: '/favicon/safari-pinned-tab.svg',
        color: '#5bbad5'
      }
    ]
  },
  loading: { color: '#F49A0D' },
  router: {
    middleware: ['auth']
  },
  css: [
    '@/assets/scss/index.scss',
    '@/assets/main.css',
    'vue-form-wizard/dist/vue-form-wizard.min.css',
    'fullcalendar/dist/fullcalendar.css'
  ],
  plugins: [
    { src: '~/plugins/bootstrap', ssr: false },
    { src: '~/plugins/masonry', ssr: false },
    { src: '~/plugins/utils', ssr: false },
    { src: '~/plugins/sidebar', ssr: false },
    { src: '~/plugins/vue-simple-photoswipe/nuxt', ssr: false },
    { src: '~plugins/vue-full-calendar', ssr: false },
    { src: '~/plugins/vue2-google-maps' },
    { src: '~/plugins/vue-form-wizard' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/input-number', ssr: false },
    { src: '~/plugins/Datatable', ssr: false },
    { src: '~/plugins/vue-swal' }
  ],
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'bootstrap-vue/nuxt',
    'nuxt-izitoast',
    'nuxt-device-detect'
  ],
  axios: {
    baseURL: process.env.BASE_URL
  },
  izitoast: {
    position: 'topRight',
    transitionIn: 'bounceInLeft',
    transitionOut: 'fadeOutRight',
    timeout: 2000
  },
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    },
    strategies: {
      password_grant: {
        _scheme: 'local',
        endpoints: {
          login: {
            url: process.env.BASE_URL + '/oauth/token',
            method: 'POST',
            propertyName: 'access_token'
          },
          logout: {
            url: process.env.BASE_URL + '/api/logout',
            method: 'DELETE'
          },
          user: {
            url: process.env.BASE_URL + '/api/v1/account?include=roles',
            propertyName: 'data'
          }
        }
      }
    }
  },
  build: {
    transpile: [/^vue2-google-maps($|\/)/],
    vendor: ['vue-swal'],
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ],
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};
