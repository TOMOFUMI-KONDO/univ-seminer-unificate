import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase/app";
import "firebase/auth";
import { setTitle } from "../mixins";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Calendar",
    component: () => import("../views/Calendar"),
    meta: { title: "イベントカレンダー" },
  },
  {
    path: "/in-session/",
    name: "InSession",
    component: () => import("../views/InSession"),
    meta: { title: "開催中のイベント" },
    props: true, //InSessionコンポーネントにrouterからpropsを渡すことを許可
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: () => import("../views/SignIn"),
    meta: { title: "サインイン" },
  },
  {
    path: "*",
    redirect: "/sign-in",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

//ログインしていなかったら'/sign-in'にリダイレクトする
router.beforeResolve((to, from, next) => {
  store.commit("onLoadingStateChanged", true);

  if (to.path === "/sign-in") {
    setTitle(to.meta.title); //タイトルを動的に設定
    next();
    store.commit("onLoadingStateChanged", false);
  } else {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setTitle(to.meta.title); //タイトルを動的に設定
        next();
        store.commit("onLoadingStateChanged", false);
      } else {
        next({ path: "/sign-in" });
        store.commit("onLoadingStateChanged", false);
      }
    });
  }
});

export default router;
