// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsvahYhbSX7sqYPczamw50cc60GMw8yiU",
    authDomain: "e-learning-hub-30a1c.firebaseapp.com",
    projectId: "e-learning-hub-30a1c",
    storageBucket: "e-learning-hub-30a1c.firebasestorage.app",
    messagingSenderId: "588574293988",
    appId: "1:588574293988:web:c8d47d5d484815119211f1",
    measurementId: "G-56XD8FEEB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
