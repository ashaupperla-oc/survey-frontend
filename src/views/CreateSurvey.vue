<template>
  <div class="test-survey-builder container-fluid">
  <Header staticContent='Welcome to Survey Manufacture' title="" />
  <br/>
    <div class="form-group" style="margin:1vh">
    <input type="text" v-model="surveyName" class="form-control" id="surveyname"  placeholder="Enter Survey Name">
  </div>
    <QuestionsView :questions="questionsList" :readOnly="true" />
    <div v-if="addQuestion">
      <SurveyBuilder :options="sampleQuestion" enduser="false"/>
    </div>
    <div style="display:flex; justify-content:space-evenly; margin:1vh">
      <button  class=" br-25 btn btn-success" v-on:click="addNewQuestion()">Add question</button>
      <br/>
      <button type="button" class=" br-25 btn btn-success" v-on:click="saveQuestionList()">Create Survey</button>
    </div>
  </div>
</template>

<script>
import SurveyBuilder from './SurveyBuilder.vue';
import QuestionsView from './QuestionsView.vue';
import sampleQuestionObj from './survey-builder.json';
import Header from './Header.vue';
import axios from 'axios';
export default {
  name: 'CreateSurvey',
  data() {
    return {
      questionsList: [],
      addQuestion: false,
      surveyName: null,
      questListLength : 0
    };
  },
  mounted() {
    if(localStorage.getItem("token")===null){
      this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
    }
    
    this.emitter.on('add-update-question', q => {
      this.updateQuestionsList(q);
    });
    const userId = localStorage.getItem('userId');
    if(!userId){
        this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}});
    }
  },
  components: { SurveyBuilder, QuestionsView,Header },
  methods: {
    saveQuestionList(){
      console.log(this.questionsList)
    this.questListLength = this.questionsList.length;
      const data = {
        questionsList : this.questionsList,
        userId : localStorage.getItem("userId"),
        surveyName : this.surveyName
      }
      if (this.surveyName==null || this.surveyName===''){
        this.$router.push({name: 'GetMySurvey', params: {id: 'surveynamenull'}}); 
        return;
      }

      let config = {
        headers:{
          'userId' : localStorage.getItem("userId"),
          'token' : localStorage.getItem("token")
        }
      }

      axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/create',data,config)
      .then(res => {
        if(res.data.status == 401){
          this.errorMsg = res.data.error;
          this.message = null;
        }
        else if(res.data.status == 200){
          
          this.message = res.data.msg;
          this.errorMsg = null;
          this.questionsList = [] //since this question list of survey is already submitted, we are resetting it.
        // this.$router.push({name:'GetMySurvey', params:{keyword:'create'})
        this.$forceUpdate();
        
        }
      });
      
      // this.$router.push({name:'GetMySurvey', params:{keyword:'create'})
      this.$forceUpdate();
      if(this.questListLength == 0){
      this.$router.push({name: 'GetSurvey', params: {id: 'noquestions'}});
      }else {
      this.$router.push({name: 'GetSurvey', params: {id: 'created'}});
      }
      this.questionsList = [] //since this question list of survey is already submitted, we are resetting it.
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
      window.console.log('updateQuestionsList from create survey',question, this.addQuestion, this.questionsList);
    },
    addNewQuestion() {
      this.sampleQuestion = JSON.parse(JSON.stringify(sampleQuestionObj));
      this.addQuestion = true;
      this.emitter.on('add-update-question', q => {
        this.updateQuestionsList(q);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add_another_btn {
  font-size: 14px;
  background-color: transparent;
  border-color: #4c8ce4;
  color: #4c8ce4;
  padding: 8px;
  cursor: pointer;
}
.text-center {
  text-align: center;
}
</style>
