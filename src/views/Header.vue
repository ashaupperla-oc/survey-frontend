<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light ">
  <div class="collapse navbar-collapse" id="navbarSupportedContent" style="justify-content: start;">
      <button class="btn btn-outline-success my-2 my-sm-0" v-on:click="gotohome()">Home</button>
  </div>

  <div class="collapse navbar-collapse" style="justify-content: center;">
      <h3>{{staticContent}}{{title}}</h3>
      </div>


  <div class="collapse navbar-collapse" id="navbarSupportedContent" style="justify-content: end;">
      <Logout/>
  </div>
</nav>
</template>
<script>
 import Logout from './Logout.vue';
  export default {
      props: ['title','staticContent'],
    data() {
      return { 
        visible: true,
      }
    },
    methods:{
        gotohome : function(){
         this.$router.push({name: 'GetMySurvey'});   
        }
    },
    components : {Logout}
  }
</script>