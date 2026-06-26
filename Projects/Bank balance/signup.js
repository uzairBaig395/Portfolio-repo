import { auth, createUserWithEmailAndPassword,collection, addDoc,db,GoogleAuthProvider,provider,
signInWithPopup,getAdditionalUserInfo} from "./firebaseConfig.js";
import { redirectIfAuthenticated } from "./authGuard.js";

const emailinp = document.getElementById("email");
const passwordinp = document.getElementById("password");
const submitbtn = document.getElementById("submitbtn");
const loadingLayer = document.getElementById("loading-layer"); 
const googleBtn = document.getElementById("google-btn");
//errors element 
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

const signup = async () => {
  clearErrors();
  
  // Validation checks
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

  // Activate loading overlay
  loadingLayer.classList.add("is-active");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailinp.value, passwordinp.value);
    console.log("Success:", userCredential.user);
    await addUserCredential(userCredential.user.uid, userCredential.user.email);
    loadingLayer.classList.remove("is-active"); 
    emailinp.value = "";
    passwordinp.value = "";
    //change the page
    window.location.replace("./Bank balance.html");

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

//working on adding user credentials to database
const addUserCredential = async (userUID, useremail) => {
  try {
    const docRef = await addDoc(collection(db, "Users"), {
      email: useremail,
      UID: userUID,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
//pushing user UID to localstorage
window.localStorage.setItem("userUID",userUID);    
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; 
  }
};

//working with google 
const GoogleProvider = async () => {
  clearErrors();
  loadingLayer.classList.add("is-active"); 
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Checking if the user is completely new
    const details = getAdditionalUserInfo(result);
    if (details.isNewUser) {
      await addUserCredential(user.uid, user.email);
    }else {
      window.localStorage.setItem("userUID", user.uid);
    }
    loadingLayer.classList.remove("is-active");
    window.location.replace("./Bank balance.html");
  } catch (error) {
    loadingLayer.classList.remove("is-active");
    console.error("Google Auth Error:", error.code, error.message);
  }
};

googleBtn.addEventListener("click", () => GoogleProvider());