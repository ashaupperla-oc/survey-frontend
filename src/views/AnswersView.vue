<template>
  <div class="row " style="display:flex; ">
<div v-if="enduser" style="    display: flex;    flex-direction: column;    padding: 2vh;">
    <input style="margin: 0.5vh" type="text" name="full_name" v-model="full_name" placeholder="Enter Name" required />

    <input style="margin: 0.5vh" type="email" name="email" v-model="email" placeholder="Enter Email" required />

    <input  style="margin: 0.5vh" type="number" name="phone_no" v-model="phone_no" placeholder="Enter Phone Number" required />
</div>
    <div v-for="(question, index) in questions" :key="index">
      <div v-if="selectedQuestion.id === question.id">
        <SurveyBuilder :options="selectedQuestion"></SurveyBuilder>
      </div>
      <div class="card read-only-question cursor_grab " v-if="selectedQuestion.id !== question.id">
        <div class="row" style="padding:2vh; border-style: solid;">
          <div class="p-0">
            <div class="question-section">
              <p class="question_color" style="font-weight: bold;">Question
                <span class="">{{ index + 1 }}:</span>
              </p>
              <p class="question_body">{{question.body}}</p>
            </div>
            <div class="answer-section">
              <div class="option-section" v-if="question.type === 'BOOLEAN'">
                <div class="" v-for='(option, optionIndex) in question.options' :key="optionIndex">
                  <p class="radio-option">
                    <input type="radio" v-model="answers[index]" :name="'boolean_type'+index" :disabled="readOnly" :value="option.body">
                    <label>{{option.body}}</label>
                  </p>
                </div>
              </div>
              <div class="option-section pad-top20" v-if="question.type === 'SCALE'">
                <StarRating :max-rating="question.intervals" :currentRating="answers[index]" @update:rating ="setRating($event,index)" />
              </div>
              <div class="option-section" v-if="question.type === 'TEXT'">
                <input type="text" class="input-text readonly" placeholder=""  v-model="answers[index]" :readonly="readOnly" />
              </div>
              <div class="option-section" v-if="question.type === 'DATE'">
                <div class="p-0">
                  <input type="text" class="input-text readonly" :placeholder="question.dateFormat" v-model="answers[index]" :readonly="readOnly">
                </div>
              </div>
              <div class="option-section" v-if="question.type === 'NUMBER'">
                <div class="">
                  <input type="number" class="input-text readonly width-90" v-model="answers[index]" placeholder="" :readonly="readOnly">
                  <span v-if="question.hasUnits">{{question.units}}</span>
                </div>
              </div>
              <div class="option-section" v-if="question.type === 'SINGLE_CHOICE'">
                <div v-for='(option, optionIndex) in question.options' :key="optionIndex">
                  <label>
                    <input type="radio" :name="'single'+ index"  v-model="answers[index]" :disabled="readOnly" :value="option.body">&nbsp;{{option.body}}
                  </label>
                  <div class="" v-if="option.imageUrl">
                    <img :src="option.imageUrl" alt="" class="">
                  </div>
                </div>
              </div>
              <div class="option-section" v-if="question.type === 'MULTI_CHOICE'">
                <div v-for='(option, optionIndex) in question.options' :key="optionIndex">

                  <label>
                    <input type="checkbox" :name="'multi'+ index+optionIndex"  v-on:input="updateCheckboxAnswer(option.body,index,optionIndex)" :disabled="readOnly" :value="option.body" >&nbsp;{{option.body}}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!enduser" class="p-0 text-right">
            <button type="button" class="sb-btn-link mr-10 color-orange" v-on:click="editQuestion(question, index)">Edit</button>
            <button type="button" class="sb-btn-link mr-10 color-red" v-on:click="deleteQuestion(question, index)">Delete</button>
          </div>

        </div>

      </div>
    </div>
      <div v-if="enduser" class="p-0 text-right" style="display:flex; margin:1vh">
        <button type="button" class="btn btn-lg btn-success" v-on:click="submitanswer()">Submit</button>
      </div>
      <div v-else class="p-0 text-right" style="display:flex; margin:1vh">
        <button type="button" class="btn btn-lg btn-success" v-on:click="submitanswer()">Update Survey</button>
      </div>

      <div class="container">
        <form id="sendemail" style="margin:1vh; float:right;">
          <input type="text" v-model="to_name" name="to_name" placeholder="Invitee Name" required style="margin:1vh;">
          <br/>
          <input type="email" v-model="to_email" name="to_email" placeholder="Invitee Email" required style="margin:1vh;">
          <br/>
          <textarea required name="to_message" v-model="to_message" cols="30" rows="5" placeholder="Invitee Message" style="margin:1vh;">
          </textarea>
          <br/>
          <button type="submit" class="btn btn-sm btn-success" v-on:click="sendEmail()">Send Invite Via Mail</button>

        </form>
    </div>

  </div>
</template>

<script>
import vueSlider from 'vue-slider-component';
import SurveyBuilder from './SurveyBuilder.vue';
import StarRating from 'vue-star-rating';

import axios from 'axios';
import emailjs from 'emailjs-com';

export default {
  name: 'AnswersView',

  data() {
    return {
      full_name: null,
      email: null,
      phone_no: null,
      selectedQuestion: { id: null },
      name:'',
      answers:[],
      answerCheck:[],
      to_name: '',
      to_email: '',
      to_message: ''
    };
  },
  props: ['questions', 'readOnly','enduser'],
  components: { SurveyBuilder, vueSlider,StarRating },
  mounted() {
    this.emitter.on('selected-question', obj => {
      window.console.log(obj);
      this.selectedQuestion = { id: null };
    });
  },
  methods: {
    setRating(rating,index){
      this.answers[index] = rating;
    },
    editQuestion(question, index) {
      this.selectedQuestion = JSON.parse(JSON.stringify(question));
      this.selectedQuestion.questionNumber = index + 1;
    },
    deleteQuestion(question, index) {
      this.questions.splice(index, 1);
    },
    submitanswer(question){
      const value = [];
      this.questions.forEach((element, index) => {
        if(element.type !== 'MULTI_CHOICE'){
          value.push({
            questionId: element.qid,
            content: this.answers[index],
            full_name: this.full_name,
            email: this.email,
            phone_no: this.phone_no
          });
        }
        else {
          var option = [];
          this.answerCheck.forEach((item, i) => {
            if(item.index === index){
              option.push({index: index, value: item.value.optionIndex});
            }
          });

          value.push({
            questionId: element.qid,
            content: option,
            full_name: this.full_name,
            email: this.email,
            phone_no: this.phone_no
          });
        }
      });

      axios.post(import.meta.env.VITE_SERVER_ENDPOINT+"api/answer/create",value)
    .then(res => {
    });
      this.$router.push({name: 'GetMySurvey', params: {id: 'filledsurvey'}}); 
    },
    updateCheckboxAnswer(body,index,optionIndex){
      const answerCheckBox = {
        body:body,optionIndex:optionIndex
      }
      let found =0;
      this.answerCheck.forEach((element, elementIndex) => {
        if(element.index === index && element.value.optionIndex === optionIndex){
          this.answerCheck.splice(elementIndex, 1);
          found=1;
        }
      });

      if(found==0){
        this.answerCheck.push({
          index: index,
          value: answerCheckBox
        });
      }
    },
    sendEmail(e) {
      try {
        emailjs.sendForm('service_gs7n2yh', 'template_gch4wub','#sendemail','JBffaJ2LoPDTIULjK')
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
          console.log('FAILED...', error);
        });

      } catch(error) {
          console.log({error})
      }
      // Reset form field
      this.to_name = ''
      this.to_email = ''
      this.to_message = ''
    }
  },
};
</script>

<style scoped lang="scss">
$color-primary: #f8f8f8;
$color-secondary: #eaf0f4;
$color-blue: #4c8ce4;
$color-orange: #ff9635;
$color-red: #f06559;
$color-green: #48bf7a;
h1,
h2,
h3 {
  font-weight: 200;
}
.wid300 {
  max-width: 300px !important;
}
.img-style {
  padding-top: 20px;
  height: 300px;
  width: 500px;
  padding-bottom: 20px;
}
.question_body {
  word-break: break-all;
  color: #555;
}
.read-only-question {
  background-color: #fafafa;
}
.icon-style {
  color: #57dd7a;
  font-size: 25px;
  padding-top: 20px;
  background-color: #d6f0de;
  padding: 7px;
  padding-bottom: 3px;
  border-radius: 25px;
}
.font-style {
  color: #57dd7a;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}
.font-style {
  color: #57dd7a;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}
.text-style {
  color: #969090;
  text-align: right;
}
.btn-style {
  margin-top: 10px;
  width: 80px;
  height: 29px;
  margin-bottom: 50px;
}
button {
  cursor: pointer;
}
.custom-btn {
  background: #00baf9;
  color: #fff;
  width: 220px;
}
.pad-top50 {
  padding-top: 50px;
}
.form-control {
  border-radius: 2px;
}
.custom-para {
  padding-bottom: 20px;
  font-size: 20px;
}
.mar-bot20 {
  margin-bottom: 20px;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.readonly {
  background: #f7f7f7;
}
.btn-disabled {
  color: white;
  background-color: #c6c2c2;
  border: #c6c2c2;
}
.text-color {
  color: #888;
}
.survey-name {
  color: #00baf9;
  font-size: 20px;
}
.pad-left50 {
  padding-left: 50px;
}
.branching_section {
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 5px 10px;
  .branching_image {
    max-width: 120px;
    max-height: 120px;
    width: 100%;
    border: 1px solid #ccc;
  }
}
.custom-btn-bg {
  background: linear-gradient(to left, #4b6fe6, #00baf9);
  color: #fff;
}
.mar-bot20 {
  margin-bottom: 20px;
}
.pad-left100 {
  padding-left: 100px;
}
.mar-bot0 {
  margin-bottom: 0px !important;
}
.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 12px;
  margin-bottom: 12px;
}
.question_color,
input {
  color: #555;
  font-size: 16px;
}
p {
  margin: 8px 0;
}
.radio-option {
  margin: 0px;
}
.input-text {
  width: 100%;
  border-radius: 2px;
  outline: none;
  border: 1px solid #ccc;
  height: 35px;
  text-indent: 10px;
}
.DATE-input {
  border-radius: 20px;
  outline: none;
  border: 1px solid #ccc;
  height: 35px;
  text-indent: 10px;
}
.pad-top20 {
  padding-top: 20px;
}
.vertical-vue-slider {
  height: 300px !important;
  width: 4px;
  padding: 11px;
  margin-left: 30px;
}
.horizontal-vue-slider {
  height: 8px;
  width: 100%;
}
.img-size {
  width: 100%;
  height: auto;
  float: none;
  padding: 10px 0 0;
  max-width: 120px;
  max-height: 120px;
}
label {
  font-weight: normal !important;
  word-break: break-all;
  color: #555;
}
.modal-dialog {
  width: 500px !important;
}
.width-90 {
  width: 90% !important;
}
.sb-btn-link {
  border: none;
  background: none;
  padding: 5px;
  color: #f06559;
  font-size: 14px;
  margin-top: 16px;
}
.color-blue {
  color: $color-blue;
}
.color-orange {
  color: $color-orange;
}
.color-red {
  color: $color-red;
}
.color-green {
  color: $color-green;
}
.slidecontainer {
  width: 100%;
}
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}
.slider:hover {
  opacity: 1;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}
.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}
</style>
