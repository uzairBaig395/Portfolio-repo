import { db, collection, addDoc, getDocs,signOut,auth,query,where} from "./firebaseConfig.js";
import { requireGuest } from "./authGuard.js";

let Total = 0;
const balanceinp = document.getElementById("balance");
const show = document.getElementById("show");
const addbtn = document.getElementById("addbtn");
const subbtn = document.getElementById("subbtn");
const totalbtn = document.getElementById("totalbtn");
const logoutbtn = document.getElementById("logoutbtn");
//Errors
const adderror = document.getElementById("adderror");
const suberror = document.getElementById("suberror");
const amounterror = document.getElementById("amounterror");
let userUID = null;
requireGuest()
userUID = window.localStorage.getItem("userUID")


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
      Balance:newValue,
      UID: userUID,
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
  try {
    Total = 0;
    const q = query(collection(db, "Balance"), where("UID", "==", userUID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      Total += doc.data().Balance;
      console.log(Total);
});

  } catch (error) {
    console.log(error);
  }
};

getData();

//working on amount subtraction

const SubtractAmount = async()=> {
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

// FIX: Added UID to the saved document
const docRef = await addDoc(collection(db, "Balance"), {
    Balance: -newValue,
    UID: userUID,
    createdAt: new Date()
  });

  await getData();
  console.log("Transaction recorded with ID: ", Total);
  ShwoingTotal();
  balanceinp.value = "";
  } catch (error) {
    console.log(error);
  }
}
subbtn.addEventListener("click",SubtractAmount);  

//working on total
const ShwoingTotal = ()=> {
  show.innerText = Total;
}
totalbtn.addEventListener("click",()=> ShwoingTotal());

//working on logout 
const logOut = ()=> {
  signOut(auth).then(() => {
   window.localStorage.removeItem("userUID");
   window.location.replace("./index.html")
  }).catch((error) => { 
    console.log(error);
  });
}
logoutbtn.addEventListener("click",()=> logOut());