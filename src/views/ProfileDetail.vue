<template>
  <section class="vh-100">
  <b-alert show variant="success" v-if="$route.params.id === 'registered'">User Registered Successfully</b-alert>

  <div class="container-fluid  vh-100">
    <div style="
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: stretch;
    justify-content: space-around;
    align-items: center;
">
      <div >
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          class="img-fluid" alt="Sample image">
      </div>
      <div >
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
       <div >
        <form>

          <div class="divider d-flex align-items-center my-4"/>

          <!-- Email input -->
          <div class="form-outline mb-4">
            <label for="oldpassword" style="margin:1vh">Old Password</label>
            <input type="text" id="oldpassword" class="form-control form-control-lg"
              placeholder="Enter current password"  v-model="oldpassword" name="oldpassword"/>
          </div>

          <!-- Name input -->
          <div class="form-outline mb-3">
            <label for="newpassword" style="margin:1vh">New Password</label>
            <input type="text" id="newpassword" class="form-control form-control-lg"
              placeholder="Enter new password" v-model="newpassword" name="newpassword"/>
          </div>

          <div class="form-outline mb-3">
            <label for="confirmpassword" style="margin:1vh">Confirm Password</label>
            <input type="text" id="confirmpassword" class="form-control form-control-lg"
              placeholder="Confirm Password" v-model="confirmpassword" name="confirmpassword"/>
          </div>

          <div class="d-flex justify-content-between align-items-center">
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="button" class="btn btn-primary btn-lg"
              style="padding-left: 2.5rem; padding-right: 2.5rem;" @click="updatePasswordDetails">Update Password</button>
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
  name: 'ProfileDetail',
  data(){
    return {
      id: '',
      name: '',
      email: '',
      password: '',
      oldpassword: '',
      newpassword:'',
      confirmpassword:'',

    }
  },
  mounted(){

    if(localStorage.getItem("token")===null){
      this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
    }

    const adminId = this.$route.params.id;
    if(adminId != localStorage.getItem("userId")){
      this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}});
    }

    this.id = this.$route.params.id;

    let config = {
        headers:{
          'userId' : localStorage.getItem("userId"),
          'token' : localStorage.getItem("token")
        }
      }

      axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/'+adminId,config)

    .then(res => {
      this.name = res.data.name;
      this.email = res.data.email;
      this.password = res.data.password
      });
  },
  methods: {
    updateAdminDetail(){
      let updatedAdminDetails = {
        id: this.id,
        email: this.email,
        name: this.name,
      }
      let config = {
        headers:{
          'userId' : localStorage.getItem("userId"),
          'token' : localStorage.getItem("token")
        }
      }

      axios.put(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/update',updatedAdminDetails,config)

      .then(res => {
        if(res.status == 401){
          this.errorMsg = res.data.error;
          this.message = null;
          this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
        }
        else if(res.status == 200){
          this.$router.push({name: 'GetMySurvey'}); 

        }
      });
    },
    updatePasswordDetails(){
      if( this.newpassword !== this.confirmpassword || this.newpassword==='' || this.confirmpassword===''){
        this.$router.push({name: 'GetMySurvey', params: {id: 'IncorrectPasswordDetails'}}); 
        return;
      }else {

      let updatedPasswordDetail = {
        id: this.id,
        newpassword : this.newpassword,
        oldpassword : this.oldpassword
      }

let config = {
        headers:{
          'userId' : localStorage.getItem("userId"),
          'token' : localStorage.getItem("token")
        }
      }

      axios.put(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/updatepassword',updatedPasswordDetail,config)

      .then(res => {
        if(res.status == 401){
          this.errorMsg = res.data.error;
          this.message = null;
          this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
        }
        else if(res.status == 400){
          this.$router.push({name: 'GetMySurvey', params: {id: 'IncorrectPasswordDetails'}}); 
        }
        else if(res.status == 200){
        this.$router.push({name: 'GetMySurvey', params: {id: 'passwordupdatesuccess'}}); 
        }
      });
    }
    }
  }
};
</script>
