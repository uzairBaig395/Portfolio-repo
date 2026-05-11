  import { db } from "./firebaseConfig.js";
  import { collection, addDoc, getDocs, deleteDoc, doc , query,  orderBy,setDoc} from "./firebaseConfig.js";

  let Todos = [];
  let todoinp = document.getElementById("todoinp");
  let addbtn = document.getElementById("addbtn");
  let child2 = document.getElementById("child2");
  let updatebtn = document.getElementById("updatebtn");

  // working on adding data
  addbtn.addEventListener("click", async () => {
    try {
      if(todoinp.value === "") {
      alert("enter todo");
      return;
      }
      child2.innerText = "Loading..."
      const todoObj = {
        Todo: todoinp.value,
        iscomplete:false,
        createdAt: Date.now()
      };
      const docRef = await addDoc(collection(db, "Todos"), todoObj);
      getdata();
      console.log("Document written with ID:", docRef.id);
      // console.log(Todos);
      todoinp.value = "";
    } catch (error) {
      console.log("Error => " + error);
    }
  });
  //working on getting data 
  let getdata = async() => {
    try {
      child2.innerText = "Loading...";
        const q = query(
      collection(db, "Todos"),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);
      Todos = [];
    querySnapshot.forEach((num)=> {
      // console.log(num.data());
     Todos.push({
     id: num.id,
     ...num.data()
     })
    })
    console.log(Todos);
    renderTodo();
    } catch (error) {
      console.log(error);
    }
  }
  getdata(); 
  //working on DOM
  let renderTodo = ()=> {
  child2.innerHTML = "";
  Todos.forEach((num)=> {
  let divelm = document.createElement("div");
      divelm.className = "box";
      divelm.innerText = num.Todo;
      child2.appendChild(divelm);    
//working on deleting 
let deletebtn = document.createElement("button");
deletebtn.innerText = "Delete";
deletebtn.className = "delbtns";
divelm.appendChild(deletebtn);
deletebtn.onclick = async()=> {
  await deleteDoc(doc(db, "Todos", num.id));
  getdata();
}
//working on edit 
let editbtn = document.createElement("button")
editbtn.innerText = "Edit";
editbtn.className = "editbtns";
divelm.appendChild(editbtn);
editbtn.onclick = ()=> {
  addbtn.style.display = "none";
  editbtn.style.display = "none";
  deletebtn.style.display = "none";
  updatebtn.style.display = "inline";
  todoinp.value = num.Todo;
//working on update button
updatebtn.onclick = async()=> {
  if(todoinp.value === "") {
    alert("enter todo");
    return;
  }
  child2.innerText = "Loading..."
await setDoc(doc(db, "Todos", num.id), {
    Todo: todoinp.value,
    iscomplete:false,
    createdAt: Date.now()
})
getdata();
addbtn.style.display = "inline";
editbtn.style.display = "inline";
deletebtn.style.display = "inline";
updatebtn.style.display = "none";
todoinp.value = "";
}
  }
//working on done 
let donebtn = document.createElement("button");
let notdonebtn = document.createElement("button");
donebtn.innerText = "Done";
donebtn.className = "donebtn"
divelm.appendChild(donebtn);
notdonebtn.style.display = "none";
donebtn.onclick = async()=> {
await setDoc(doc(db, "Todos", num.id), {
    Todo: num.Todo,
    iscomplete:true,
    createdAt: Date.now()
})
donebtn.style.display = "none";
divelm.style.backgroundColor = "lightgreen";
notdonebtn.style.display = "inline";
}
//working on not done 
notdonebtn.innerText = "Not Done";
notdonebtn.className = "notdonebtn";
divelm.appendChild(notdonebtn);
notdonebtn.onclick = async()=> {
 await setDoc(doc(db, "Todos", num.id), {
    Todo: num.Todo,
    iscomplete:false,
    createdAt: Date.now()
})
notdonebtn.style.display = "none";
donebtn.style.display = "inline";
divelm.style.backgroundColor = "rgba(255,255,255,0.08)";
}

if(num.iscomplete === true) {
    divelm.style.backgroundColor = "lightgreen";
    donebtn.style.display = "none";
    notdonebtn.style.display = "inline";
}

}
)}
