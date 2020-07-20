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
    path: "/events/",
    name: "Events",
    component: () => import("../views/Events"),
    meta: { title: "開催中のイベント" },
    props: true, //Eventsコンポーネントにrouterからpropsを渡すことを許可
  },
  {
    path: "/archive/",
    name: "Archive",
    component: () => import("../views/Archive"),
    meta: { title: "過去のイベント" },
    props: true, //Archiveコンポーネントにrouterからpropsを渡すことを許可
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: () => import("../views/SignIn"),
    meta: { title: "サインイン" },
  },
  {
    path: "/manage-sign-in",
    name: "ManageSignIn",
    component: () => import("../views/ManageSignIn"),
    meta: { title: "管理者サインイン" },
  },
  {
    path: "/management",
    name: "Management",
    component: () => import("../views/Management"),
    meta: { title: "イベント管理" },
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeResolve((to, from, next) => {
  store.commit("onLoadingStateChanged", true);

  //ログイン状態が変更されたときに発火する
  firebase.auth().onAuthStateChanged((user) => {
    if (to.path === "/sign-in") {
      //すでにgoogleサインイン済みならカレンダーページへリダイレクト
      if (user && user.email.indexOf("tohoku.ac.jp") !== -1) {
        setTitle("イベントカレンダー");
        next({ path: "/" });
      } else {
        setTitle(to.meta.title); //タイトルを動的に設定
        next();
      }
    } else if (to.path === "/manage-sign-in") {
      //すでにパスワードサインイン済みなら管理ページへリダイレクト
      if (user && user.email === "root@tohoku.univ.seminer") {
        setTitle("イベント管理");
        next({ path: "/management" });
      } else {
        setTitle(to.meta.title); //タイトルを動的に設定
        next();
      }
    } else if (to.path === "/management") {
      if (user && user.email === "root@tohoku.univ.seminer") {
        setTitle(to.meta.title); //タイトルを動的に設定
        next();
      }
      //パスワードログインしていなかったら'manage-sign-in'にリダイレクトする
      else {
        setTitle("管理者サインイン");
        next({ path: "/manage-sign-in" });
      }
    } else {
      if (user && user.email.indexOf("tohoku.ac.jp") !== -1) {
        setTitle(to.meta.title); //タイトルを動的に設定
        next();
      }
      //Googleアカウントでログインしていなかったら'/sign-in'にリダイレクトする
      else {
        setTitle("サインイン");
        next({ path: "/sign-in" });
      }
    }

    store.commit("onUserStatusChanged", user);
    store.commit("onLoadingStateChanged", false);
  });
});

export default router;
