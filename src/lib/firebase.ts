// lib/firebase.js
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  get,
  runTransaction,
  increment,
  update,
} from "firebase/database";

// Firebase configuration - replace these values with your own
const firebaseConfig = JSON.parse(
  import.meta.env.VITE_FIREBASE_CONFIG || "{}"
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {
  database,
  ref,
  onValue,
  set,
  push,
  get,
  runTransaction,
  increment,
  update,
};
