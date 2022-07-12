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
            <p class="lead fw-normal mb-0 me-3">Admin Details </p>
          </div>

          <div class="divider d-flex align-items-center my-4"/>

          <!-- Email input -->
          <div class="form-outline mb-4">
            <label for="adminemail" style="margin:1vh">Email address</label>
            <input type="email" id="adminemail" class="form-control form-control-lg"
              placeholder="Enter a valid email address"  v-model="email" name="email"/>
          </div>

          <!-- Name input -->
          <div class="form-outline mb-3">
            <label for="adminname" style="margin:1vh">Admin Name</label>
            <input type="text" id="adminname" class="form-control form-control-lg"
              placeholder="Enter Name" v-model="name" name="name"/>
          </div>

          <div class="d-flex justify-content-between align-items-center">
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="button" class="btn btn-primary btn-lg"
              style="padding-left: 2.5rem; padding-right: 2.5rem;" @click="updateAdminDetail">Update Details</button>
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
  name: 'AdminDetail',
  data(){
    return {
      id: '',
      name: '',
      email: '',

    }
  },
  mounted(){

    if(localStorage.getItem("token")===null){
      this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
    }

    const adminId = this.$route.params.id;
    this.id = this.$route.params.id;
      axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/get/'+adminId)
    .then(res => {
      this.name = res.data.name;
      this.email = res.data.email;
      });
  },
  methods: {
    updateAdminDetail(){
      let updatedAdminDetails = {
        id: this.id,
        email: this.email,
        name: this.name,
      }

      axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/update',updatedAdminDetails)
      .then(res => {
        if(res.status == 401){
          this.errorMsg = res.data.error;
          this.message = null;
          this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
        }
        else if(res.status == 200){
          this.$router.push({name: 'AdminList'}); 
        }
      });
    },
  }
};
</script>
