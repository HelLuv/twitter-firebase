import {getApp, getApps, initializeApp} from "@firebase/app";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApz7ZhwIeRzX2G-YXV5iiM5Ch1gr-RlII",
  authDomain: "twitter-clone-8aa2e.firebaseapp.com",
  projectId: "twitter-clone-8aa2e",
  storageBucket: "twitter-clone-8aa2e.appspot.com",
  messagingSenderId: "986377386876",
  appId: "1:986377386876:web:1578ba58b4803e4a7242f9",
  measurementId: "G-LPWMVVKMP6"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export {db, storage}