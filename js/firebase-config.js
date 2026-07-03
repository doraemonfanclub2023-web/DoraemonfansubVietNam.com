// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBt3G9n5JYu3EsvqJR9IoW2vRAc_Es3-ws",
  authDomain: "doraemon-fansub-vietnam.firebaseapp.com",
  projectId: "doraemon-fansub-vietnam",
  storageBucket: "doraemon-fansub-vietnam.firebasestorage.app",
  messagingSenderId: "380840935390",
  appId: "1:380840935390:web:60fab4722a9fba5053a74f",
  measurementId: "G-0S2Z4XRK0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
