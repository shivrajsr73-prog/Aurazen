import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5GO9ZGIq2Y8wdpw943zJHLnzfzUMcK5g",
  authDomain: "aurawear-a7b4e.firebaseapp.com",
  projectId: "aurawear-a7b4e",
  storageBucket: "aurawear-a7b4e.firebasestorage.app",
  messagingSenderId: "1065436220632",
  appId: "1:1065436220632:web:03816d8ee76d3222391bad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
