<template>
 <section class="vh-100">
  <div class="container-fluid h-custom vh-100">
    <Header staticContent='Survey Collection' title="" />
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          class="img-fluid" alt="Sample image">
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form>
          
          <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
            <p class="lead fw-normal mb-0 me-3">Register Admin</p>
          </div>

          <div class="divider d-flex align-items-center my-4"/>

          <!-- Email input -->
          <div class="form-outline mb-4">
            <input type="email" id="form3Example3" class="form-control form-control-lg"
              placeholder="Enter a valid email address" v-model="email" name="email"/>
          </div>

          <!-- Password input -->
          <div class="form-outline mb-3">
            <input type="password" id="form3Example4" class="form-control form-control-lg"
              placeholder="Enter password" v-model="password" name="password"/>
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="button" class="btn btn-primary btn-lg"
              style="padding-left: 2.5rem; padding-right: 2.5rem;" @click="register">Register</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import axios from 'axios';
import Header from './Header.vue';

export default {
  name: 'Register',
  data(){
    return {
      email: '',
      password: ''
    }
  },
  components : [Header],
  methods: {
    register(){
      let registerUser = {
        email: this.email,
        password: this.password,
      }
      axios.put(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/register',registerUser);
      this.$forceUpdate();
      this.$router.push({name: 'GetMySurvey',params: {id: 'adminregistered'}}); 
    }
  },
  mounted(){
    if(localStorage.getItem("token")===null){
      this.$router.push({name: 'GetMySurvey', params: {id: 'noteligibletoregister'}}); 
    }
  }
};
</script>
