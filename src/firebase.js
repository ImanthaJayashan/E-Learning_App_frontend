// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 Your Firebase config (from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAsvahYhbSX7sqYPczamw50cc60GMw8yiU",
    authDomain: "e-learning-hub-30a1c.firebaseapp.com",
    projectId: "e-learning-hub-30a1c",
    storageBucket: "e-learning-hub-30a1c.firebasestorage.app",
    messagingSenderId: "588574293988",
    appId: "1:588574293988:web:c8d47d5d484815119211f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
