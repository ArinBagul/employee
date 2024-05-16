// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi9gmjSHLu1mUdqkAqG1EnquPAQf5YWXI",
  authDomain: "employeepro-157ed.firebaseapp.com",
  projectId: "employeepro-157ed",
  storageBucket: "employeepro-157ed.appspot.com",
  messagingSenderId: "604467014051",
  appId: "1:604467014051:web:9b0d1e43d581afd5009216",
  measurementId: "G-YEKHEMFCKL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);