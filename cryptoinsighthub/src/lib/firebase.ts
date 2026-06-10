import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Out web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMQyzGZhA4Cj5cX6Nm1yFTuFgFeukofUU",
  authDomain: "cryptoinsighthub-a6687.firebaseapp.com",
  projectId: "cryptoinsighthub-a6687",
  storageBucket: "cryptoinsighthub-a6687.firebasestorage.app",
  messagingSenderId: "172363124115",
  appId: "1:172363124115:web:ead9f059ea04856bad2c66",
  measurementId: "G-7253FWLQH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);