import { getAuth, createUserWithEmailAndPassword,auth,onAuthStateChanged } from "./firebaseConfig.js";
import { requireAuth } from "./auth-guard.js";
// getting elements
const emailinp = document.getElementById("email-inp");
const passwordinp = document.getElementById("password-inp");
const resgister = document.getElementById("sign-up-btn");
const accountsuccess = document.getElementById("box-button-success");
const Loading = document.getElementById("box-btn-load");
//error 
const FillInputsError = document.getElementById("fill-inputs-error");
const emailInpError = document.getElementById("email-error");
const passwordInpError = document.getElementById("password-error");
const emailInUseError = document.getElementById("email-in-use");

requireAuth();

// registration function
const registration = () => {

FillInputsError.style.display = "none"; 
emailInpError.style.display = "none"; 
passwordInpError.style.display = "none";
emailInUseError.style.display = "none";
Loading.style.display = "block"; 
//checking validation
 if (emailinp.value.length < 1 || passwordinp.value.length < 1) {
    Loading.style.display = "none";
    emailInpError.style.display = "none";
    passwordInpError.style.display = "none";
    emailInUseError.style.display = "none";
    FillInputsError.style.display = "block";
    return;
    }
  else if (!emailinp.checkValidity()) { 
    Loading.style.display = "none";
    FillInputsError.style.display = "none";
    passwordInpError.style.display = "none";
    emailInUseError.style.display = "none";
    emailInpError.style.display = "block";
    return;
  }
  else if (passwordinp.value.length < 8) {
    Loading.style.display = "none";
    FillInputsError.style.display = "none";
    emailInpError.style.display = "none";
    emailInUseError.style.display = "none";
    passwordInpError.style.display = "block";
    return; 
  }

    // working on registration
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, emailinp.value, passwordinp.value)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user);
          // restarting everything 
            accountsuccess.style.display = "block";
            emailinp.value = "";
            passwordinp.value = "";
            window.location.replace("./todo.html")
        })
        .catch((error) => {
            Loading.style.display = "none";
            if (error.code === "auth/email-already-in-use") {
            FillInputsError.style.display = "none";
            emailInpError.style.display = "none";
            passwordInpError.style.display = "none";
            emailInUseError.style.display = "block";
            } else {
            console.error(error);
            }
        });
}

resgister.addEventListener("click", () => registration());