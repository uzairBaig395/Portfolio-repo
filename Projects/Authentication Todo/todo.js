import { db } from "./firebaseConfig.js";
import { collection, addDoc, deleteDoc,doc, query, updateDoc, auth, signOut, deleteUser, where, onSnapshot 
} from "./firebaseConfig.js";
import { requireGuest } from "./auth-guard.js";

let Todos = [];
const todoinp = document.getElementById("todoinp");
const addbtn = document.getElementById("addbtn");
const child2 = document.getElementById("child2");
const updatebtn = document.getElementById("updatebtn");
const logoutbtn = document.getElementById("logoutbtn");
const accountDeleteBtn = document.getElementById("delete-account-trigger");
const deleteBox = document.getElementById("delete-modal-overlay");
const cancelBtn = document.getElementById("modal-cancel-btn");
const deleteAccountbtn = document.getElementById("modal-delete-btn");

requireGuest();
const userID = JSON.parse(window.localStorage.getItem("userData"));

// Signout 
const usersignout = async () => {
  try {
    await signOut(auth);
    window.localStorage.removeItem("userData"); 
    console.log('success on sign out');
    window.location.replace = "index.html"; 
  } catch (error) {
    console.log('error on sign out => ', error);
  }
}
logoutbtn.addEventListener("click", () => usersignout());

// Working on adding data
addbtn.addEventListener("click", async () => {
  try {
    if (todoinp.value === "") {
      alert("enter todo");
      return;
    }
    child2.innerText = "Loading...";
    const todoObj = {
      Todo: todoinp.value,
      iscomplete: false,
      UID: userID.uid, 
      TodoID: new Date().getTime(),
      createdAt: Date.now()
    };
    const docRef = await addDoc(collection(db, "Todos"), todoObj);
    console.log("Document written with ID:", docRef.id);
    todoinp.value = "";
  } catch (error) {
    console.log("Error => " + error);
  }
});

// Working on getting data 
let getdata = async () => {
  try {
    const q = query(collection(db, "Todos"), where("UID", "==", userID.uid));
    
    // Sets up real-time stream listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      Todos = []; 
      
      querySnapshot.forEach((doc) => {        
        const data = doc.data(); 
        
        Todos = [
          ...Todos,
          {            
            id: doc.id,               
            Todo: data.Todo,          
            iscomplete: data.iscomplete || false,
            UID: data.UID,
            createdAt: data.createdAt
          }
        ];
      });
      
      console.log(Todos);
      renderTodo(); 
    });
  } catch (error) {
    console.error(error);
  }
}
getdata(); 

// Working on DOM layout and rendering
let renderTodo = () => {
  child2.innerHTML = "";
  
  Todos.forEach((num) => {
    let divelm = document.createElement("div");
    divelm.className = "box";

    let textelm = document.createElement("span");
    textelm.className = "box-text";
    textelm.innerText = num.Todo; 
    divelm.appendChild(textelm);

    let actions = document.createElement("div");
    actions.className = "box-actions";

    // Working on deleting 
    let deletebtn = document.createElement("button");
    deletebtn.innerText = "Delete";
    deletebtn.className = "delbtns";
    actions.appendChild(deletebtn);
    deletebtn.onclick = async () => {
      await deleteDoc(doc(db, "Todos", num.id));
    }

    // Working on edit 
    let editbtn = document.createElement("button")
    editbtn.innerText = "Edit";
    editbtn.className = "editbtns";
    actions.appendChild(editbtn);
    editbtn.onclick = () => {
      addbtn.style.display = "none";
      editbtn.style.display = "none";
      deletebtn.style.display = "none";
      updatebtn.style.display = "inline";
      todoinp.value = num.Todo;
      
      // Working on update button
      updatebtn.onclick = async () => {
        if (todoinp.value === "") {
          alert("enter todo");
          return;
        }
        child2.innerText = "Loading...";
        
        await updateDoc(doc(db, "Todos", num.id), {
          Todo: todoinp.value,
          createdAt: Date.now()
        });
        
        addbtn.style.display = "inline";
        editbtn.style.display = "inline";
        deletebtn.style.display = "inline";
        updatebtn.style.display = "none";
        todoinp.value = "";
      }
    }

    // Working on done 
    let donebtn = document.createElement("button");
    let notdonebtn = document.createElement("button");
    donebtn.innerText = "Done";
    donebtn.className = "donebtn";
    actions.appendChild(donebtn);
    notdonebtn.style.display = "none";
    donebtn.onclick = async () => {
      await updateDoc(doc(db, "Todos", num.id), {
        iscomplete: true,
        createdAt: Date.now()
      });
    }

    // Working on not done 
    notdonebtn.innerText = "Not Done";
    notdonebtn.className = "notdonebtn";
    actions.appendChild(notdonebtn);
    notdonebtn.onclick = async () => {
      await updateDoc(doc(db, "Todos", num.id), {
        iscomplete: false,
        createdAt: Date.now()
      });
    }

    if (num.iscomplete === true) {
      divelm.classList.add("completed");
      donebtn.style.display = "none";
      notdonebtn.style.display = "inline";
    }

    divelm.appendChild(actions);
    child2.appendChild(divelm);
  });
}

// Working on account deletion
accountDeleteBtn.onclick = () => {
    deleteBox.style.display = "block";
}  
cancelBtn.onclick = () => {
    deleteBox.style.display = "none";
}
deleteAccountbtn.onclick = async () => {
  try {
    await deleteUserData(); 

    const user = auth.currentUser;
    await deleteUser(user); 

    console.log("User and Firestore data deleted");
    window.localStorage.removeItem("userData");
    window.location.replace = "index.html";
  } catch (error) {
    console.log(error);
    if(error.code === "auth/requires-recent-login") {
      alert("Please login again your Delete token is expired")
    } else {
      alert("An error occured while deleting your account")
    }
  }
};

// Working on deleting user profile data from the database 
const deleteUserData = async () => {
  try {
    const userID = JSON.parse(window.localStorage.getItem("userData"));
    if(userID && userID.docId) {
      await deleteDoc(doc(db, "users", userID.docId));    
    }
  } catch (error) {
    console.log(error);
  }
}