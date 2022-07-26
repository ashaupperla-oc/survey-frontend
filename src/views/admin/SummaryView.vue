<template>

  <div class="container-fluid">
    <Header staticContent='Summary of Survey : ' :title="surveyName"/>
    <div v-for="question in questions"  :key="question">
      <div v-if="JSON.parse(question.content).type === 'MULTI_CHOICE'">{{multiChoice}}</div>
      <div v-if="JSON.parse(question.content).type === 'SINGLE_CHOICE'">{{singleChoice}}</div>
      <div v-if="JSON.parse(question.content).type === 'BOOLEAN'">{{yesNoEvaluate}}</div>
      <div v-if="JSON.parse(question.content).type === 'TEXT'">{{textEvaluate}}</div>
      <div v-if="JSON.parse(question.content).type === 'SCALE'">{{starratingEvaluate}}</div>
    </div>

    <div v-for="question in textQuestions"  :key="question" style="border:solid; padding:1vh; margin:1vh">
      Question :  {{question[1]}}
      <hr/>
      <div v-for="(textQuestionValue,index) in textQuestionValues"  :key="textQuestionValue" >
      <p v-if="textQuestionValue[0].includes(question[1]) "> {{index+1}}. {{JSON.parse(textQuestionValue[1])}}</p>
      </div>
    </div>
       
    <div v-for="yesnoQuestion in yesnoQuestions"  :key="yesnoQuestion" style="border:solid; padding:1vh; margin:1vh">
      <div v-for="yesno in yesnoCount"  :key="yesno" >
      <p v-if="yesno[0].includes(yesnoQuestion[1])" > {{yesno[0]}} is selected {{yesno[1]}} times</p>
      <p v-else style="padding:0px"></p>
      </div>
    </div> 
    
    <div v-for="selectedChoiceQuestion in selectedChoiceQuestions"  :key="selectedChoiceQuestion" style="border:solid; padding:1vh; margin:1vh">
      <div v-for="selectedChoice in selectedChoices"  :key="selectedChoice" >
      <p v-if="selectedChoice[0].includes(selectedChoiceQuestion[1])"> {{selectedChoice[0]}} is selected {{selectedChoice[1]}} times</p>
      <p v-else style="padding:0px"></p>
      </div>
    </div>
    
    <div v-for="multipleChoiceQuestion in multipleChoiceQuestions"  :key="multipleChoiceQuestion" style="border:solid; padding:1vh; margin:1vh">
      <div v-for="multiSelectedChoice in multiSelectedChoices"  :key="multiSelectedChoice" >
      <p v-if="multiSelectedChoice[0].includes(multipleChoiceQuestion[1])"> {{multiSelectedChoice[0]}} is selected {{multiSelectedChoice[1]}} times</p>
      <p v-else style="padding:0px"></p>
      </div>
    </div>

    <div v-for="ratingChoiceQuestion in ratingChoiceQuestions"  :key="ratingChoiceQuestion" style="border:solid; padding:1vh; margin:1vh">
      <div v-for="ratingSelectedChoice in ratingSelectedChoices"  :key="ratingSelectedChoice" >
      <p v-if="ratingSelectedChoice[0].includes(ratingChoiceQuestion[1])"> {{ratingSelectedChoice[0]}} is selected {{ratingSelectedChoice[1]}} times</p>
      <p v-else style="padding:0px"></p>
      </div>
    </div>
    
    
  </div>
</template>
<script>
  
  import axios from 'axios';
  import Chart from '../Chart.vue';
  import Header from '../Header.vue';

  export default{
    name: 'SummaryView',
    data(){
      return {
        surveyId: this.$route.params.surveyId,
        surveyName: this.$route.params.name,
        questions: null,
        ansData: [],
        aggregation: [],
        multiSelectedChoices : new Map(),
        multipleChoiceQuestions : new Map(),
        multiChoiceQuestionsLabels : [],
        multiChoiceQuestionsDataCount : [],
        ratingSelectedChoices : new Map(),
        ratingChoiceQuestions : new Map(),
        selectedChoices : new Map(),
        selectedChoiceQuestions : new Map(),
        yesnoCount: new Map(),
        yesnoQuestions: new Map(),
        textQuestions : new Map(),
        textQuestionValues : new Map()
      };
    },
    computed: {
      YesNo: function(){
        let boolValue = {
          yes: 0,
          no: 0,
        };
        this.questions.forEach((ques) => {
          if(JSON.parse(ques.content).type === 'BOOLEAN'){
            this.ansData.forEach((ans) => {
              if(ques.id === ans.questionId) {
                if(ans.content.toString() === "\"Yes\"") boolValue.yes++;
                else boolValue.no++;
              }
            });
          }
        });
        return boolValue;
      },
      textEvaluate: function(){
        this.questions.forEach((ques) => {
          if(JSON.parse(ques.content).type === 'TEXT'){
            let questionValue = JSON.parse(ques.content).body+' : ';
            this.textQuestions.set(ques.id,JSON.parse(ques.content).body);

            this.ansData.forEach((ans) => {
              if(ques.id === ans.questionId) {
                this.textQuestionValues.set(questionValue+ans.clientId,ans.content);
              }
            });
          }
        });
      },
      yesNoEvaluate: function(){
        this.questions.forEach((ques) => {
          if(JSON.parse(ques.content).type === 'BOOLEAN'){
            let questionValue = JSON.parse(ques.content).body+' : ';
            this.yesnoCount.set(questionValue + 'yes',0);
            this.yesnoCount.set(questionValue + 'no',0);

            this.yesnoQuestions.set(ques.id,JSON.parse(ques.content).body);
            this.ansData.forEach((ans) => {
              if(ques.id === ans.questionId) {
                if(ans.content.toString() === "\"Yes\""){
                  let count = this.yesnoCount.get(questionValue + 'yes');
                  this.yesnoCount.set(questionValue + 'yes',count+1) ;
                }else{
                  let count = this.yesnoCount.get(questionValue + 'no');
                  this.yesnoCount.set(questionValue + 'no',count+1) ;
                }
              }
            });
          }
        });
      },

      singleChoice: function(){
        
        this.questions.forEach((ques) => {
          if(JSON.parse(ques.content).type === 'SINGLE_CHOICE'){
            let questionValue = JSON.parse(ques.content).body+' : ';
            JSON.parse(ques.content).options.forEach((option) => {
              this.selectedChoices.set(questionValue + option.body,0) ;
            })
            this.selectedChoiceQuestions.set(ques.id,JSON.parse(ques.content).body);
            this.ansData.forEach((ans) => {
              if(ques.id === ans.questionId) {
                let selectedOption = JSON.parse(ans.content);
                if(this.selectedChoices.has(questionValue + selectedOption)){
                  let count = this.selectedChoices.get(questionValue + selectedOption);
                  this.selectedChoices.set(questionValue + selectedOption,count+1) ;
                }else{
                  this.selectedChoices.set(questionValue + selectedOption,1) ;
                }
              }
            });
          }
        });
      },
      multiChoice: function(){

        let multipleChoiceQuestIds = [];
        this.questions.forEach((ques) => {
          if(JSON.parse(ques.content).type === 'MULTI_CHOICE'){
            multipleChoiceQuestIds.push(ques.id);
          }
        });

        this.questions.forEach((ques) => {
          if(JSON.parse(ques.content).type === 'MULTI_CHOICE'){
            let questValue = JSON.parse(ques.content).body+' : ';
            this.multipleChoiceQuestions.set(ques.id,JSON.parse(ques.content).body);
            JSON.parse(ques.content).options.forEach((option) => {
              this.multiSelectedChoices.set(questValue + option.body,0) ;
            })
            this.ansData.forEach((ans) => {
              if(ques.id === ans.questionId) {
                let answerOptions = JSON.parse(ans.content);
                let questOptions = JSON.parse(ques.content).options;
                answerOptions.forEach(answerOption => {
                  let index = answerOption.index;
                  let optionIndex = answerOption.value;
                  let selectedOption = questOptions[optionIndex].body;
                    if(this.multiSelectedChoices.has(questValue + selectedOption)){
                      let count = this.multiSelectedChoices.get(questValue + selectedOption);
                      this.multiSelectedChoices.set(questValue + selectedOption,count+1) ;
                    }else{
                      this.multiSelectedChoices.set(questValue + selectedOption,1) ;
                    }
                });
              }
            });
          }
        });
      },
      starratingEvaluate: function(){

        this.questions.forEach((ques) => {
          if(JSON.parse(ques.content).type === 'SCALE'){
            let questValue = JSON.parse(ques.content).body+' : ';
            let intervals = JSON.parse(ques.content).intervals;
            this.ratingChoiceQuestions.set(ques.id,JSON.parse(ques.content).body);
            let loop_temp_var=1;
            while(loop_temp_var<=intervals){
              this.ratingSelectedChoices.set(questValue + 'star'+loop_temp_var,0);
              loop_temp_var++;
            }
            this.ansData.forEach((ans) => {
              if(ques.id === ans.questionId) {
                let rating = JSON.parse(ans.content);
                let existingRating = this.ratingSelectedChoices.get(questValue + 'star'+rating);
                this.ratingSelectedChoices.set(questValue + 'star'+rating,existingRating+1);
              }
            });
          }
        });
      }
    },
    mounted() {
    if(localStorage.getItem("token")===null){
          this.$router.push({name: 'GetMySurvey', params: {id: 'unauthorized'}}); 
        }
        
      const surveyId = {
        surveyId: this.surveyId
      }

       axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/survey/fechanswers',surveyId)
      .then(res => {
        this.questions = res.data
        this.questions.forEach((element, index) => {
          axios.post(import.meta.env.VITE_SERVER_ENDPOINT+'api/answer/view',{id: element.id}).
          then(data => {
            data.data.forEach((answer) => {
              this.ansData.push(answer);
            })
          });
        });
      });
    },
    components:{ Chart,Header }
  };
</script>
