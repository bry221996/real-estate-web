<template>
  <div
    class="container-fluid fullHeight">
    <div
      class="row fullHeight">
      <div 
        id="auth-layout-background" 
        class="col-lg-6 col-xl-7 col-md-6 p-0 d-flex justify-content-center align-items-center"/>
      <div
        id="auth-form"
        class="col-lg-6 col-xl-5 col-md-6">
        <nuxt/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
};
</script>

<style scoped>
#auth-layout-background {
  background: url('https://i.ibb.co/xM8ZLjp/auth.png') no-repeat right top;
  background-size: cover;
}

@media (max-width: 767.98px) {
  #auth-layout-background {
    display: none;
    height: 0px;
  }
}
</style>
