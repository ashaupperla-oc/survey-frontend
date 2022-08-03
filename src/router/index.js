import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import CreateSurvey from "../views/CreateSurvey.vue";
import GetMySurvey from "../views/GetMySurvey.vue";
import GetSurvey from "../views/GetSurvey.vue";
import QuestionList from "../views/QuestionList.vue";
import SummaryView from "../views/admin/SummaryView.vue";
import AdminList from "../views/admin/AdminList.vue";
import AdminDetail from "../views/admin/AdminDetail.vue";
import EditSurvey from "../views/EditSurvey.vue";
import ProfileDetail from "../views/ProfileDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/",
      name: "homelogin",
      component: GetMySurvey,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/login",
      name: "login",
      component: Login,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/register",
      name: "register",
      component: Register,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/create-survey",
      name: "createSurvey",
      component: CreateSurvey,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/surveys",
      name: "GetSurvey",
      component: GetSurvey,
      meta: {
        reload: true,
      },
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/survey",
      name: "GetMySurvey",
      component: GetMySurvey,
      meta: {
        reload: true,
      },
    },

    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/adminlist",
      name: "AdminList",
      component: AdminList,
      meta: {
        reload: true,
      },
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/admindetail/:id",
      name: "AdminDetail",
      component: AdminDetail,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/profiledetail/:id",
      name: "ProfileDetail",
      component: ProfileDetail,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/survey/:surveyId",
      name: "QuestionList",
      component: QuestionList,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/admin/summary/:surveyId",
      name: "SummaryView",
      component: SummaryView,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/admin/survey/edit/:surveyId",
      name: "EditSurvey",
      component: EditSurvey,
    },
    {
      path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/:catchAll(.*)",
      name: "pnf",
      redirect: (to) => {
        return { path: "http://ec2-18-117-253-229.us-east-2.compute.amazonaws.com/survey-frontend/survey" };
      },
    },
  ],
});

export default router;
