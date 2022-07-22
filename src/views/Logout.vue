<template>
<div name="logoutdiv" class="logoutdiv">
  <button
      id="logout-button" class="btn btn-outline-primary my-2 my-sm-0" style="margin:0.5vh"
      v-on:click="adminListRedirect"
      v-show="isLoggedOut" 
      v-if="userId == 1">
      Admins
    </button>

  <button
      id="logout-button" class="btn btn-outline-primary my-2 my-sm-0" style="margin:0.5vh"
      v-on:click="adminRegisterRedirect"
      v-show="isLoggedOut" 
      v-if="userId == 1">
      Register Admin
    </button>

    <button
      id="logout-button" class="btn btn-outline-success my-2 my-sm-0"  style="margin:0.5vh"
      v-on:click="surveyCreateRedirect"
      v-show="isLoggedOut" >
      Create Survey 
    </button>

    <button
      id="logout-button" class="btn btn-outline-success my-2 my-sm-0"  style="margin:0.5vh"
      v-on:click="profieDetailRedirect"
      v-show="isLoggedOut" >
      Profile Detail
    </button>

    <button
      id="logout-button" class="btn btn-outline-danger my-2 my-sm-0"
      v-on:click="handleLogout"
      v-show="isLoggedOut" style="margin:0.5vh"
    >Log out  
    </button>


    <button
      id="logout-button" class="btn btn-outline-success my-2 my-sm-0"
      @click.prevent="handleLogin"
      v-show="!isLoggedOut"
    >Log in
    </button>
  </div>
</template>

<script>
  export default {
     data() {
    return {
      active: false,
      userId : localStorage.getItem("userId")
    };
  },
    methods: {
      handleLogout() {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        this.active = false;
        this.userId = null;
        this.$router.push({name: 'login'}); 
      },
      handleLogin() {
        this.$router.push({name: 'login'}); 
      },
      surveyCreateRedirect(){
        this.$router.push({name: 'createSurvey'}); 
      },
      adminRegisterRedirect(){
        this.$router.push({name: 'register'}); 
      },
      adminListRedirect(){
      this.$router.push({name: 'AdminList'}); 
      },
       profieDetailRedirect(){
      this.$router.push({name: 'ProfileDetail',params: {id: this.userId}}); 
      }
      
    },
    computed: {
       isLoggedOut() {
         this.active = (localStorage.getItem("userId") !== null)
         return this.active
      },
    },
  };
</script>

<style scoped>
  .logoutdiv {
    display: flex;
  }
</style>