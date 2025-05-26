// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs2YVYS_2MA--Iw1W2LZOieepeq4NaXsU",
  authDomain: "sporelia-plants.firebaseapp.com",
  projectId: "sporelia-plants",
  storageBucket: "sporelia-plants.firebasestorage.app",
  messagingSenderId: "287367137121",
  appId: "1:287367137121:web:c479d8ecfe98e5230be720"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
