<template>
  <div class="test-survey-builder container-fluid">
  <Header staticContent='Welcome to Survey : ' :title="this.$route.params.url" />
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

    let viewSurveyReq = {
      url: this.$route.params.url
    }

     axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/view',viewSurveyReq)
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
