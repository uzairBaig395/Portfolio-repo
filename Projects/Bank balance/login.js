import { 
  auth, 
  signInWithEmailAndPassword, 
  provider,               
  signInWithPopup,        // Updated to use popup
  getAdditionalUserInfo,  
  db,                     
  collection,             
  addDoc,
  query,        
  where,        
  getDocs       
} from "./firebaseConfig.js";
import { redirectIfAuthenticated } from "./authGuard.js";

redirectIfAuthenticated();

const emailinp = document.getElementById("email");
const passwordinp = document.getElementById("password");
const loginbtn = document.getElementById("loginbtn");
const googleBtn = document.getElementById("googlebtn"); 

const emptyError = document.getElementById("err-empty");
const emailError = document.getElementById("err-invalid");
const passwordError = document.getElementById("err-length");
const notFoundError = document.getElementById("err-notfound");

const loadingLayer = document.getElementById("loading-layer");

const resetErrors = () => {
  emptyError.style.display = "none";
  emailError.style.display = "none";
  passwordError.style.display = "none";
  notFoundError.style.display = "none";
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
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; 
  }
};

// User log in flow (Email/Password)
const userLogIn = () => {
  resetErrors();
  
  if (emailinp.value === "" || passwordinp.value === "") {
    emptyError.style.display = "block";
    return;
  }
  if (!emailinp.checkValidity()) {
    emailError.style.display = "block";
    return;
  }
  if (passwordinp.value.length < 8) {
    passwordError.style.display = "block";
    return;
  }

  loadingLayer.classList.add("is-active");
  
  signInWithEmailAndPassword(auth, emailinp.value, passwordinp.value)
    .then(async (userCredential) => {
      const user = userCredential.user;
      
      const docId = await getUserDocId(user.uid);
      const userData = {
        uid: user.uid,
        docId: docId
      };
      
      window.localStorage.setItem("userData", JSON.stringify(userData));
      loadingLayer.classList.remove("is-active");
      window.location.replace("./Balance.html");
    })
    .catch((error) => {
      loadingLayer.classList.remove("is-active");
      const errorCode = error.code;
      console.error("Login failed:", errorCode, error.message);
      
      if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password" || errorCode === "auth/invalid-credential") {
        notFoundError.style.display = "block";
      }
    });
};

// Google Authentication Flow via Popup
const GoogleLogin = async () => {
  resetErrors();
  loadingLayer.classList.add("is-active"); 
  
  try {
    const result = await signInWithPopup(auth, provider);
    
    if (result) {
      const user = result.user;
      const details = getAdditionalUserInfo(result);
      
      if (details.isNewUser) {
        // Fallback for new users logging in via Google for the first time
        await addUserCredential(user.uid, user.email);
      } else {
        // Fetch existing record details for returning users
        const docId = await getUserDocId(user.uid);
        const userData = {
          uid: user.uid,
          docId: docId
        };
        window.localStorage.setItem("userData", JSON.stringify(userData));
      }
      
      loadingLayer.classList.remove("is-active");
      // Seamlessly redirect to application landing layout
      window.location.replace("./Balance.html");
    }
  } catch (error) {
    loadingLayer.classList.remove("is-active");
    console.error("Google Auth Error:", error.code, error.message);
  }
};

loginbtn.addEventListener("click", () => userLogIn());
googleBtn.addEventListener("click", () => GoogleLogin());