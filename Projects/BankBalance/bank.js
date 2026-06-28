import { db, collection, addDoc, getDocs, signOut, auth, query, where } from "./firebaseConfig.js";
import { requireGuest } from "./authGuard.js";

let Total = 0;
const balanceinp = document.getElementById("balance");
const show = document.getElementById("show");
const addbtn = document.getElementById("addbtn");
const subbtn = document.getElementById("subbtn");
const totalbtn = document.getElementById("totalbtn");
const logoutbtn = document.getElementById("logoutbtn");

// Errors
const adderror = document.getElementById("adderror");
const suberror = document.getElementById("suberror");
const amounterror = document.getElementById("amounterror");

let userUID = null;

// Run your guard check
requireGuest();

// FIX: Extract the object from localStorage and retrieve the correct 'uid' property
const storedData = window.localStorage.getItem("userData");
if (storedData) {
  const parsedData = JSON.parse(storedData);
  userUID = parsedData.uid; // This targets the 'uid' saved during login/signup
}

const clearErrors = () => {
  adderror.style.display = "none";
  suberror.style.display = "none";
  amounterror.style.display = "none";
};

// Working on adding amount
const add = async () => {
  try {
    const newValue = Number(balanceinp.value);
    clearErrors();
    if (newValue < 500) {
      adderror.style.display = "block";
      return;
    }

    const docRef = await addDoc(collection(db, "Balance"), {
      Balance: newValue,
      UID: userUID, // Will now accurately contain the string UID value
      createdAt: new Date()
    });
    
    console.log("Transaction recorded with ID: ", docRef.id);
    await getData();    
    ShwoingTotal();
    balanceinp.value = "";
  } catch (error) {
    console.log(error);
  }
};

addbtn.addEventListener("click", () => add());

// Working on getting data and summing it up
const getData = async () => {
  if (!userUID) return; // Prevent querying if UID didn't load correctly
  
  try {
    Total = 0;
    const q = query(collection(db, "Balance"), where("UID", "==", userUID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      Total += doc.data().Balance;
    });
    console.log("Total calculated:", Total);
  } catch (error) {
    console.log(error);
  }
};

// Call getData after userUID extraction setup completes
getData();

// Working on amount subtraction
const SubtractAmount = async () => {
  try {
    const newValue = Number(balanceinp.value);
    clearErrors();
    if (newValue < 500) {
      suberror.style.display = "block";
      return;
    }
    else if (newValue > Total) {
      amounterror.style.display = "block";
      return;
    }

    const docRef = await addDoc(collection(db, "Balance"), {
      Balance: -newValue,
      UID: userUID,
      createdAt: new Date()
    });

    await getData();
    console.log("Transaction recorded with ID: ", docRef.id);
    ShwoingTotal();
    balanceinp.value = "";
  } catch (error) {
    console.log(error);
  }
};
subbtn.addEventListener("click", SubtractAmount);  

// Working on total display
const ShwoingTotal = () => {
  show.innerText = Total;
};
totalbtn.addEventListener("click", () => ShwoingTotal());

// Working on logout 
const logOut = () => {
  signOut(auth).then(() => {
    // FIX: Clear the correct 'userData' key matching your login/signup setup
    window.localStorage.removeItem("userData");
    window.location.replace("./index.html");
  }).catch((error) => { 
    console.log(error);
  });
};
logoutbtn.addEventListener("click", () => logOut());