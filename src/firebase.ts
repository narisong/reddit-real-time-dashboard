import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// These values are intended to be used on the client side.
const firebaseConfig = {
  apiKey: "AIzaSyAFjVNcRb3ZOHl5OP2ruuNBzev2b7GX3sc",
  authDomain: "reddit-real-time-dashboard.firebaseapp.com",
  projectId: "reddit-real-time-dashboard",
  storageBucket: "reddit-real-time-dashboard.appspot.com",
  messagingSenderId: "1068359810347",
  appId: "1:1068359810347:web:c376a6434c277d10d5196e",
  measurementId: "G-Q7M13E88ZK",
};

initializeApp(firebaseConfig);

const firestore = getFirestore();

export { firestore };
