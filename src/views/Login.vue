<template>
  <section class="vh-100">
  <b-alert show variant="success" v-if="$route.params.id === 'registered'">User Registered Successfully</b-alert>

  <div class="container-fluid  vh-100">
    <div class="row d-flex justify-content-center align-items-center vh-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          class="img-fluid" alt="Sample image">
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form>
          <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
            <p class="lead fw-normal mb-0 me-3">Sign in </p>
          </div>

          <div class="divider d-flex align-items-center my-4"/>

          <!-- Email input -->
          <div class="form-outline mb-4">
            <input type="email" id="form3Example3" class="form-control form-control-lg"
              placeholder="Enter a valid email address"  v-model="email" name="email"/>
          </div>

          <!-- Password input -->
          <div class="form-outline mb-3">
            <input type="password" id="form3Example4" class="form-control form-control-lg"
              placeholder="Enter password" v-model="password" name="password"/>
          </div>

          <div class="d-flex justify-content-between align-items-center">
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="button" class="btn btn-primary btn-lg"
              style="padding-left: 2.5rem; padding-right: 2.5rem;" @click="login">Login</button>
            <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <button 
                type="button" class="btn btn-danger btn-sm" @click="register">Register</button></p>
          </div>

        </form>
      </div>
    </div>
  </div>
</section>
</template>


<script>
import axios from 'axios';

export default {
  name: 'Login',
  data(){
    return {
      email: '',
      password: '',
      errorMsg: null,
      message: null
    }
  },
  methods: {
    login(){
      let loginUser = {
        email: this.email,
        password: this.password,
      }

      axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/auth/login',loginUser)
      .then(res => {
        if(res.data.status == 401){
          this.errorMsg = res.data.error;
          this.message = null;
          this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
        }
        else if(res.data.status == 200){
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userId', res.data.userId);
          this.$router.push({name: 'GetMySurvey', params: {id: 'authorized'}}); 
        }
      });
    },
    register(){
      this.$router.push({name: 'register', params: {id: 'authorized'}}); 
    }
  }
};
</script>
