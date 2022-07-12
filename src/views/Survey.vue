<template>
    <h1>Create Survey</h1>
</template>

<script>
import axios from 'axios';


export default {
  name: 'Survey',
  data(){
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    survey(){
      let registerUser = {
        email: this.email,
        password: this.password,
      }
      axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/auth/register',registerUser);
    }
  }
};
</script>
