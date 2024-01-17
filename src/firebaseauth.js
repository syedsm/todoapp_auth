// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7RG_k61Iu-e1CqBKr7Em3tck6iO_QJA0",
  authDomain: "to-do-app-24ed8.firebaseapp.com",
  projectId: "to-do-app-24ed8",
  storageBucket: "to-do-app-24ed8.appspot.com",
  messagingSenderId: "473152738333",
  appId: "1:473152738333:web:24372d3d76f412fd27a2f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const db = getDatabase(app);
const  auth = getAuth(app);
export { auth, createUserWithEmailAndPassword,signInWithEmailAndPassword,db };



