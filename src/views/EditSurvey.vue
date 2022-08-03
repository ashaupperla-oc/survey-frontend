<template>
  <div class="test-survey-builder container-fluid">
  <Header staticContent='Welcome to Survey Updates' title="" />
  <br/>
    <QuestionsView :questions="questionsList" :readOnly="true" />
    <div v-if="addQuestion">
      <SurveyBuilder :options="sampleQuestion" enduser="false"/>
    </div>
    <div style="display:flex; justify-content:space-evenly">
      <button  class=" br-25 btn btn-success" v-on:click="addNewQuestion()">Add question</button>
      <br/>
      <button type="button" class=" br-25 btn btn-success" v-on:click="updateQuestionList()">Update Survey</button>
    </div>
  </div>
</template>

<script>
import SurveyBuilder from './SurveyBuilder.vue';
import axios from 'axios';
import QuestionsView from './QuestionsView.vue';
import Header from './Header.vue';
import sampleQuestionObj from './survey-builder.json';

export default {
  name: 'EditSurvey',
  
  data() {
    return {
      surveyList: [],
      questionsList: [],
      addQuestion: false,
      surveyid : this.$route.params.surveyId
    };
  },
  mounted() {
    this.emitter.on('add-update-question', q => {
      this.updateQuestionsList(q);
    });
    let viewSurveyReq = {
      surveyId: this.$route.params.surveyId
    }
    console.log(" viewSurveyReq ", viewSurveyReq)
     axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/'+this.$route.params.surveyId)
    .then(res => {
      this.questionsList= [];
      res.data.forEach(element => {
        let question = JSON.parse((element.content));
        question.qid = element.id;
          this.questionsList.push(question);
      });
    });
  },
  components: { SurveyBuilder,QuestionsView,Header },
  methods : {
    updateQuestionList(){
      const data = {
        questionsList : this.questionsList,
        userId : localStorage.getItem("userId"),
        surveyid: this.surveyid
      }

  let config = {
      headers:{
        'userId' : localStorage.getItem("userId"),
        'token' : localStorage.getItem("token")
      }
    }

      axios.put(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/update',data,config)
      .then(res => {
        if(res.data.status == 401){
          this.errorMsg = res.data.error;
          this.message = null;
        }
        else if(res.data.status == 200){
          this.$router.push('/');
          this.message = res.data.msg;
          this.errorMsg = null;
        }
      });
      this.questionsList = [] //since this question list of survey is already submitted, we are resetting it.
      this.$router.push({name: 'GetMySurvey', params: {id: 'updated'}}); 
    },
    updateQuestionsList(question) {
      const questionIndex = this.questionsList.findIndex(x => x.id === question.id);
      if (questionIndex >= 0) {
        this.questionsList.splice(questionIndex, 1, question);
      } else {
        this.questionsList.push(JSON.parse(JSON.stringify(question)));
      }
      this.addQuestion = false;
      this.emitter.emit('selected-question', null);
      window.console.log(question, this.addQuestion, this.questionsList);
    },
    addNewQuestion() {
      this.sampleQuestion = JSON.parse(JSON.stringify(sampleQuestionObj));
      this.addQuestion = true;
      this.emitter.on('add-update-question', q => {
        this.updateQuestionsList(q);
      });
    },
  }

};
</script>
