import { getAuth, signInWithEmailAndPassword,auth } from "./firebaseConfig.js";
import { requireAuth } from "./auth-guard.js";

const emailInp = document.getElementById("email-inp");
const passwordInp = document.getElementById("password-inp");
const loginBtn = document.getElementById("login-btn");
//errors
const accountError = document.getElementById("account-error");
const fillInputsError = document.getElementById("fill-inputs-error");
const emailInpError = document.getElementById("email-inp-error");
const passwordInpError = document.getElementById("password-inp-error");

requireAuth();
//working on user login
const userlogin = ()=> {
//checking validation

 if(emailInp.value.length < 1 || passwordInp.value.length < 1 ) {
    emailInpError.style.display = "none";
    accountError.style.display = "none";
    passwordInpError.style.display = "none";
    fillInputsError.style.display = "block";
    return;
 }
 else if (!emailInp.checkValidity()) {
  fillInputsError.style.display = "none";
  accountError.style.display = "none";
  passwordInpError.style.display = "none";
  emailInpError.style.display = "block";
  return;
 }
 else if (passwordInp.value.length < 8) {
  fillInputsError.style.display = "none";
  emailInpError.style.display = "none";
  accountError.style.display = "none";
  passwordInpError.style.display = "block";
    return;
 }

signInWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
  .then((userCredential) => {
    // Signed in 
    fillInputsError.style.display = "none";
    emailInpError.style.display = "none";
    passwordInpError.style.display = "none";
    accountError.style.display = "none";

    const user = userCredential.user;
    console.log(user);
    window.location.replace("./todo.html");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (error.code === "auth/user-not-found" ||error.code === "auth/invalid-credential") {
      fillInputsError.style.display = "none";
      emailInpError.style.display = "none";
      passwordInpError.style.display = "none";  
      accountError.style.display = "block";
    }
  });

}
loginBtn.addEventListener("click",()=>  userlogin());