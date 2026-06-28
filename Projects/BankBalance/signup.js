import { 
  auth, 
  createUserWithEmailAndPassword, 
  collection, 
  addDoc, 
  db, 
  provider,
  signInWithPopup,   // Updated to use popup
  getAdditionalUserInfo,
  query,        
  where,        
  getDocs       
} from "./firebaseConfig.js";
import { redirectIfAuthenticated } from "./authGuard.js";

const emailinp = document.getElementById("email");
const passwordinp = document.getElementById("password");
const submitbtn = document.getElementById("submitbtn");
const loadingLayer = document.getElementById("loading-layer"); 
const googleBtn = document.getElementById("google-btn");

// Errors elements 
const emptyError = document.getElementById('err-empty');
const invalidError = document.getElementById("err-invalid");
const passwordError = document.getElementById("err-length");
const emailError = document.getElementById("err-exists");

redirectIfAuthenticated();

const clearErrors = () => {
  emptyError.style.display = "none";
  invalidError.style.display = "none";
  passwordError.style.display = "none";
  emailError.style.display = "none";
};

// Query user document ID from Firestore
const getUserDocId = async (uid) => {
  try {
    const q = query(collection(db, "Users"), where("UID", "==", uid));
    const querySnapshot = await getDocs(q);
    let docId = null;
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });
    return docId;
  } catch (error) {
    console.error("Error fetching user docId:", error);
    return null;
  }
};

// Helper function to add user credentials to Firestore and LocalStorage
const addUserCredential = async (userUID, useremail) => {
  try {
    const docRef = await addDoc(collection(db, "Users"), {
      email: useremail,
      UID: userUID,
      createdAt: new Date()
    });
    
    const userData = {
      docId: docRef.id,
      uid: userUID
    };

    window.localStorage.setItem("userData", JSON.stringify(userData));
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; 
  }
};

// Email and Password Sign Up Flow
const signup = async () => {
  clearErrors();
  
  if (emailinp.value.trim() === "" || passwordinp.value.trim() === "") {
    emptyError.style.display = "block";
    return;
  }
  if (!emailinp.checkValidity()) {
    invalidError.style.display = "block";
    return;
  }
  if (passwordinp.value.trim().length < 8) {
    passwordError.style.display = "block";
    return;
  }

  loadingLayer.classList.add("is-active");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailinp.value, passwordinp.value);
    await addUserCredential(userCredential.user.uid, userCredential.user.email);
    
    loadingLayer.classList.remove("is-active"); 
    emailinp.value = "";
    passwordinp.value = "";
    
    window.location.replace("./Balance.html");
  } catch (error) {
    loadingLayer.classList.remove("is-active");    
    const errorCode = error.code;
    if (errorCode === "auth/email-already-in-use") {
        emailError.style.display = "block";
    } else {
        console.error("Firebase Error:", error.message);
    }
  }
};

submitbtn.addEventListener("click", () => signup());

// Google Authentication Flow via Popup
const GoogleProvider = async () => {
  clearErrors();
  loadingLayer.classList.add("is-active"); 
  
  try {
    const result = await signInWithPopup(auth, provider);
    
    if (result) {
      const user = result.user;
      const details = getAdditionalUserInfo(result);
      
      if (details.isNewUser) {
        // Create Firestore record for new users
        await addUserCredential(user.uid, user.email);
      } else {
        // Fetch existing record for returning users
        const docId = await getUserDocId(user.uid);
        const userData = {
          uid: user.uid,
          docId: docId
        };
        window.localStorage.setItem("userData", JSON.stringify(userData));
      }
      
      loadingLayer.classList.remove("is-active");
      // Redirect seamlessly on completion
      window.location.replace("./Balance.html");
    }
  } catch (error) {
    loadingLayer.classList.remove("is-active");
    console.error("Google Auth Error:", error.code, error.message);
  }
};

googleBtn.addEventListener("click", () => GoogleProvider());