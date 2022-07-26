<template>
  <div class="test-survey-builder container-fluid">
  <Header staticContent='Its Responding Time' title="" />
  <AnswersView :questions="questionsList" :readOnly="false" :enduser="true"/>
  </div>
</template>

<script>

import axios from 'axios';
import AnswersView from './AnswersView.vue';
import Header from './Header.vue';

export default {
  name: 'QuestionList',
  data() {
    return {
      surveyList: [],
      questionsList: [],
    };
  },
  mounted() {
      console.log('this.$route.params',this.$route.params)
    let viewSurveyReq = {
      surveyId: this.$route.params.surveyId
    }
     axios.get(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/'+this.$route.params.surveyId)
    .then(res => {
      this.questionsList= [];
      res.data.forEach(element => {
        let question = JSON.parse(JSON.parse(JSON.stringify(element.content)));
        question.qid = element.id;
          this.questionsList.push(question);
      });
    });
  },

  components: { AnswersView,Header },

};
</script>
