import Vue from "vue";
import VueRouter from "vue-router";

//view
import Accounts from "../view/Accounts.vue";
import Payments from "../view/Payments.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/accounts",
    name: "Accounts",
    component: Accounts,
  },
  {
    path: "/payments",
    name: "Payments",
    component: Payments,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
