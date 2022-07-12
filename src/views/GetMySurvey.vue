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
 
  <b-row no-gutters>
    <b-col md="4"  v-for="(survey,index) in surveyList" :key="survey.id">

        <b-card no-body class="overflow-hidden" style="max-width: 540px; margin: 30px;">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-img :src="'https://picsum.photos/400/400/?image='+(survey.id+parseInt(10))" alt="Image" class="rounded-0"></b-card-img>
            </b-col>
            <b-col md="6">
              <a :href="'/survey/'+survey.url">
              <b-row>
              <b-card-body :title="survey.surveyName">
                <b-card-text>
                  Survey id : {{survey.id}} <br/> Url : {{survey.url}}
                </b-card-text>
              </b-card-body>
              </b-row>
              </a>
              <b-row>
                <b-col md="12">
                <button v-if=displaySummary style="visibility:hidden;" >Summary</button>
                <button v-else  class="btn btn-outline-success my-2 my-sm-0" v-on:click='summary(survey.url,survey.surveyName)'>Summary</button>
                <button v-if=displaySummary style="visibility:hidden;" >Delete</button>
                <button v-else-if="survey.userId==userId || userId==1"   class="btn btn-outline-danger my-2 my-sm-0" v-on:click='deleteSurvey(survey.id)'>Delete</button>
                <button v-if='displaySummary' style="visibility:hidden;" >Edit</button>
                <button v-else-if="survey.userId==userId || userId==1"   class="btn btn-outline-danger my-2 my-sm-0" v-on:click='editsurvey(survey.url)'>Edit</button>
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
      displaySummary : localStorage.getItem("token")===null,
      userId : localStorage.getItem("userId")
    };
  },
  mounted() {
    this.emitter.on('selected-question', obj => {
      window.console.log(obj);
      this.selectedQuestion = { id: null };
    });
    this.getAllSurveys()
    this.getAllSurveys();
  },
  components: { QuestionsView,Logout,Header },
  methods: {
    getAllSurveys() {

       axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/viewallsurvey')
      .then(res => {
        this.surveyList = res.data;
      });
    },
    getAllQuestions(url) {
      let viewSurveyReq = {
        url: url
      }

       axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/view',viewSurveyReq)
      .then(res => {
        this.questionsList= [];
        res.data.forEach(element => {
          let question = JSON.parse(JSON.parse(JSON.stringify(element.content)));
          this.questionsList.push(question);
        });
      });
    },
    summary(url,surveyName){
      this.$router.push({name: 'SummaryView', params: {url: url, name: surveyName}});
    },
    editsurvey(url){
      this.$router.push({name: 'EditSurvey', params: {url: url}});
    },
    deleteSurvey(surveyId) {
      let data = {
        id: surveyId
      }
      axios.delete(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/delete/'+surveyId)
      .then((res)=> {
        axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/viewallsurvey')
       .then(res => {
         this.surveyList = res.data;
       });
        reload : surveyId
      })
    }
  },
};
</script>

<style scoped>
a {
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}
</style>
