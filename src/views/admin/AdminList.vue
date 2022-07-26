<template>
  <div class="container-fluid">
    <Header staticContent='List Of Admins' title=''/>
    <table class="table table-striped">
      <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Handle</th>
          <th scope="col">Options</th>
        </tr>
      </thead>
      <tbody  v-for="(admin, index) in adminList" :key="index">
        <tr>
          <th scope="row">{{index+1}}</th>
          <td>{{admin.name}}</td>
          <td>{{admin.email}}</td>
          <td>
            <button type="button" class="btn btn-primary btn-md" style="margin:1vh" v-on:click="updateAdmin(admin, index)">Edit</button>
            <button type="button" class="btn btn-danger btn-md" style="margin:1vh" v-on:click="deleteAdmin(admin, index)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

  
  import axios from 'axios';
  import Header from '../Header.vue';

  export default{
    name: 'AdminList',
    
    data(){
      return {
       adminList: [],
      }
    },
    components:{ Header },
    computed: {
      
    },
    mounted() {
    if(localStorage.getItem("token")===null){
      this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
    }

      let config = {
        headers:{
          'userId' : localStorage.getItem("userId"),
          'token' : localStorage.getItem("token")
        }
      }
     axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/',config)
    .then(res => {
      this.adminList= [];
      res.data.forEach(admin => {
       this.adminList.push(admin);
      });
    });
    },
    methods : {
      updateAdmin(admin, index){
        this.$router.push({name: 'AdminDetail', params: {id: admin.id}}); 
      },
      deleteAdmin(admin, index){
         let config = {
        headers:{
          'userId' : localStorage.getItem("userId"),
          'token' : localStorage.getItem("token")
        }
      }
      
      axios.delete(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/'+admin.id,config)
      .then((res)=> {     
           let config = {
        headers:{
          'userId' : localStorage.getItem("userId"),
          'token' : localStorage.getItem("token")
        }
      }               
      axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/admin/',config)

    .then(res => {
      this.adminList= [];
      res.data.forEach(admin => {
       this.adminList.push(admin);
      });
    });
          })
          
      }
    }
  };
</script>
