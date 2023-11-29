// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxcuXXXKnrVQm769xk37W2_U69HtfBtOc",
  authDomain: "projeto-ia-ae75e.firebaseapp.com",
  projectId: "projeto-ia-ae75e",
  storageBucket: "projeto-ia-ae75e.appspot.com",
  messagingSenderId: "828164059976",
  appId: "1:828164059976:web:5c859b50010d708cee397d",
  measurementId: "G-QR31KBSH9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
export {app, db, analytics}