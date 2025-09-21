import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDb5F3B9skqVZl7FDHudJuwkVj_gM1zguE",
  authDomain: "educational-website-88ddf.firebaseapp.com",
  projectId: "educational-website-88ddf",
  storageBucket: "educational-website-88ddf.appspot.com",
  messagingSenderId: "515268767903",
  appId: "1:515268767903:web:4430f0c635fd046b5df2aa",
  measurementId: "G-44PRZRKF46"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 