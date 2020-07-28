import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics"
import "firebase/firestore"
import router from "./router";

// todo: 環境変数に記述する
const firebaseConfig = {
    apiKey: "AIzaSyCi4s17WSq1AP9ZbLfoO15quBXIpFaAHSY",
    authDomain: "univ-seminer-unificate.firebaseapp.com",
    databaseURL: "https://univ-seminer-unificate.firebaseio.com",
    projectId: "univ-seminer-unificate",
    storageBucket: "univ-seminer-unificate.appspot.com",
    messagingSenderId: "1030793997557",
    appId: "1:1030793997557:web:b54826b6ecde22f5fbe9bc",
    measurementId: "G-QKQ5Q6PX0S"
};

export default {
    init() {
        firebase.initializeApp(firebaseConfig);
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then()
            .catch(e => {
                console.log(e)
            })
        firebase.analytics();
    },
    login() {
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.setCustomParameters({
            hd: "tohoku.ac.jp", //このドメインのみでログイン可（dc.tohoku.ac.jpはこれのサブドメインなのでログイン可）
        })

        firebase.auth().signInWithPopup(provider)
            .catch(e => {
                alert(e.message);
                console.log(e)
            })
    },
    manageLogin(password) {
      firebase
        .auth()
        .signInWithEmailAndPassword("root@tohoku.univ.seminer", password)
        .catch((e) => {
          const errorCode = e.code;
          const errorMessage = e.message;
          if (errorCode === "auth/wrong-password") {
            alert("Wrong password...");
          } else {
            alert(errorMessage);
          }
          console.log(e);
        });
    },
    logout() {
        firebase.auth().signOut()
            .catch(e => {
                console.log(e)
                router.push('sign-in').then()
            })
    },
};
