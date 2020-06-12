import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics"
import store from "./store";
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
    login(domain) {
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.setCustomParameters({
            hd: `${domain}.ac.jp`, //このドメインのみでログイン可（dc.tohoku.ac.jpはこれのサブドメインなのでログイン可）
        })

        firebase.auth().signInWithPopup(provider)
            .then(() => {
                router.push('/').then()
            })
            .catch(e => {
                console.log(e)
                this.errorMessage = e.message
                this.ifError = true
            })
    },
    logout() {
        firebase.auth().signOut()
            .then(() => {
                router.push('sign-in').then()
            })
            .catch(e => {
                console.log(e)
                router.push('sign-in').then()
            })
    },
    onAuth() {
        firebase.auth().onAuthStateChanged(user => {
            user = user ? user : {};
            store.commit('onUserStatusChanged', !!user.uid);
        });
    }
};