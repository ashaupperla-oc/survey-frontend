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
  // history: createWebHistory(),
  
  routes: [
    {
      path: "/",
      name: "homelogin",
      component: GetMySurvey,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/create-survey",
      name: "createSurvey",
      component: CreateSurvey,
    },
    {
      path: "/surveys",
      name: "GetSurvey",
      component: GetSurvey,
      meta: {
        reload: true,
      },
    },
    {
      path: "/survey",
      name: "GetMySurvey",
      component: GetMySurvey,
      meta: {
        reload: true,
      },
    },

    {
      path: "/adminlist",
      name: "AdminList",
      component: AdminList,
      meta: {
        reload: true,
      },
    },
    {
      path: "/admindetail/:id",
      name: "AdminDetail",
      component: AdminDetail,
    },
    {
      path: "/profiledetail/:id",
      name: "ProfileDetail",
      component: ProfileDetail,
    },
    {
      path: "/survey/:surveyId",
      name: "QuestionList",
      component: QuestionList,
    },
    {
      path: "/admin/summary/:surveyId",
      name: "SummaryView",
      component: SummaryView,
    },
    {
      path: "/admin/survey/edit/:surveyId",
      name: "EditSurvey",
      component: EditSurvey,
    },
    {
      path: "/:catchAll(.*)",
      name: "pnf",
      redirect: (to) => {
        return { path: "/survey" };
      },
    },
  ],
});

export default router;
