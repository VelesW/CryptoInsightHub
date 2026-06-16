import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";

// Out web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMQyzGZhA4Cj5cX6Nm1yFTuFgFeukofUU",
  authDomain: "cryptoinsighthub-a6687.firebaseapp.com",
  projectId: "cryptoinsighthub-a6687",
  storageBucket: "cryptoinsighthub-a6687.firebasestorage.app",
  messagingSenderId: "172363124115",
  appId: "1:172363124115:web:ead9f059ea04856bad2c66",
  measurementId: "G-7253FWLQH2"
};

console.log("My API key:", import.meta.env.VITE_FIREBASE_API_KEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const analytics = getAnalytics(app);