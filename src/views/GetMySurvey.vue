<template>
<div class="container-fluid" >
  <Header staticContent='Survey Collection' title="" />
  <br>
  <b-alert show variant="success" v-if="$route.params.id === 'created'">Survey Created Successfully</b-alert>
  <b-alert show variant="success" v-if="$route.params.id === 'filledsurvey'">Survey Filled Successfully</b-alert>
  <b-alert show variant="success" v-if="$route.params.id === 'authorized'">Logged in Successfull</b-alert>
  <b-alert show variant="danger" v-if="$route.params.id === 'unauthorized'">unauthorized login attempt</b-alert>
  <b-alert show variant="success" v-if="$route.params.id === 'loggedout'">Logged out as admin</b-alert>
  <b-alert show variant="danger" v-if="$route.params.id === 'noteligibletoregister'">Only super admin is allowed to register admin</b-alert>  
  <b-alert show variant="danger" v-if="$route.params.id === 'surveynamenull'">Survey Creation Failed Due to no survey name</b-alert>  
  <b-alert show variant="success" v-if="$route.params.id === 'adminregistered'">Admin Registered Successfully</b-alert>  
  <b-alert show variant="danger" v-if="$route.params.id === 'IncorrectPasswordDetails'">Incorrect credential details</b-alert> 
  <b-alert show variant="success" v-if="$route.params.id === 'passwordupdatesuccess'">Credential updated successfully</b-alert> 
 
 <b-row no-gutters v-if="userId==null">
    <b-col md="4"  v-for="(survey,index) in surveyList" :key="survey.id" >

        <b-card no-body class="overflow-hidden" style="max-width: 540px; margin: 30px;">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-img :src="'https://picsum.photos/400/400/?image='+(survey.id+parseInt(10))" alt="Image" class="rounded-0"></b-card-img>
            </b-col>
            <b-col md="6">
              <a :href="publicPath+'/survey/'+survey.id">
              <b-row>
              <b-card-body :title="survey.surveyName">
                <b-card-text>
                  Survey id : {{survey.id}}
                </b-card-text>
              </b-card-body>
              </b-row>
              </a>
            </b-col>
          </b-row>
        </b-card>

    </b-col>
  </b-row>
  <b-row no-gutters v-else-if="userId!=null || userId==1">
    
    <b-col  md="4" v-for="(survey,index) in filteredSurveyList" :key="survey.id">
        <b-card no-body class="overflow-hidden" style="max-width: 540px; margin: 30px;" v-if="survey.userId==userId || userId==1">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-img :src="'https://picsum.photos/400/400/?image='+(survey.id+parseInt(10))" alt="Image" class="rounded-0"></b-card-img>
            </b-col>
            <b-col md="6">
              <a :href="publicPath+'/survey/'+survey.id">
              <b-row>
              <b-card-body :title="survey.surveyName">
                <b-card-text>
                  Survey id : {{survey.id}} <br/> 
                </b-card-text>
              </b-card-body>
              </b-row>
              </a>
              <b-row>
                <b-col md="12">
                
                <button  class="btn btn-outline-success my-2 my-sm-0" v-on:click='summary(survey.id,survey.surveyName)'>Summary</button>
                <button    class="btn btn-outline-danger my-2 my-sm-0" v-on:click='deleteSurvey(survey.id)'>Delete</button>
                <button    class="btn btn-outline-danger my-2 my-sm-0" v-on:click='editsurvey(survey.id)'>Edit</button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>

    </b-col>
    
  </b-row>
   
  
  </div>
</template>

<script>

import axios from 'axios';
import QuestionsView from './QuestionsView.vue';
import Logout from './Logout.vue';
import Header from './Header.vue';

export default {
  name: 'GetMySurvey',
  props :['reload'],
  data() {
    return {
      surveyList: [],
      questionsList: [],
      filteredSurveyList: [],
      displaySummary : localStorage.getItem("token")===null,
      userId : localStorage.getItem("userId")? localStorage.getItem("userId") :null
    };
  },
  mounted() {
    this.getAllSurveys();
    this.emitter.on('selected-question', obj => {
      window.console.log(obj);
      this.selectedQuestion = { id: null };
    });
  },
  components: { QuestionsView,Logout,Header },
  methods: {
    getAllSurveys() {

       axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/')
      .then(res => {
        if(this.userId==1){
          this.filteredSurveyList = res.data;
        }else {
        res.data.forEach(element => {
          
          if(element.userId == this.userId){
            this.filteredSurveyList.push(element)
          }
        });
        }
        this.surveyList = res.data;
      });
    },
    summary(surveyId,surveyName){
      this.$router.push({name: 'SummaryView', params: {surveyId: surveyId, name: surveyName}});
    },
    editsurvey(surveyId){
      this.$router.push({name: 'EditSurvey', params: {surveyId: surveyId}});
    },
    deleteSurvey(surveyId) {
      let data = {
        id: surveyId
      }

      let config = {
      headers:{
        'userId' : localStorage.getItem("userId"),
        'token' : localStorage.getItem("token")
      }
    }

      axios.delete(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/'+surveyId,config)
      .then((res)=> {
        this.getAllSurveys()
      })
    },
  },
};
</script>

<style scoped>
a {
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}
</style>
