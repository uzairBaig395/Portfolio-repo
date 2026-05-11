import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore to initialize Firestore
import { collection, addDoc, getDocs, deleteDoc, doc , query,  orderBy,setDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9g2cmq0mQx517NBcQMLenbTwtsg9l8u0",
  authDomain: "ecommerce-web-1-ae670.firebaseapp.com",
  projectId: "ecommerce-web-1-ae670",
  storageBucket: "ecommerce-web-1-ae670.firebasestorage.app",
  messagingSenderId: "266350906778",
  appId: "1:266350906778:web:342c543c9d47da7b62fe23",
  measurementId: "G-4LY6ZBP9DF"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app); // Get the Firestore instance

export { db, collection, addDoc, getDocs, deleteDoc, doc , query,  orderBy,setDoc }; // Export the Firestore database instance

