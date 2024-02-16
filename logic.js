let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let noteDivs = document.querySelector(".notes");
let arrayOfNotes =[];

getDataFromLocal();

//Making sure the user is already logged in
window.onload = function () {
    const loggedInAdmin = getCookie("loggedInUser");
  
    if (loggedInAdmin) {
      document.getElementById("loggedIn").style.display = "block";
  
      document.getElementById("user").textContent = loggedInAdmin;
  
      document.getElementById("loginForm").style.display = "none";
    }
  };


if (localStorage.getItem("notes")) {
arrayOfNotes = JSON.parse(localStorage.getItem("notes"));
}

//making sure the input isn't empty and empting it afterwards
submit.onclick = function () {
if (input.value !== "") {
    addNote(input.value);
    input.value = "";
}
}

//event listener for the edit and delete buttons (in case of edit it makes a save button)
noteDivs.addEventListener("click", (e) => {
if (e.target.classList.contains("edit")) {
let noteId = e.target.parentElement.getAttribute("note-id");
let noteElement = e.target.parentElement;
let noteTitle = noteElement.firstChild.textContent;

let inputEdit = document.createElement("input");
inputEdit.type = "text";
inputEdit.value = noteTitle;
inputEdit.className = "edit-input";

noteElement.firstChild.replaceWith(inputEdit);

e.target.textContent = "save";
e.target.className = "save";

e.target.removeEventListener("click", handleEdit);
e.target.addEventListener("click", ()=>{handlesave(noteId, noteElement)});}
if (e.target.classList.contains("del")) {
    deleteNote(e.target.parentElement.getAttribute("note-id"));
}
});


//edit button response (editing function)
function handleEdit(e) {
    let noteId = e.target.parentElement.getAttribute("note-id");
    let noteElement = e.target.parentElement;
    let noteTitle = noteElement.firstChild.textContent;

    let inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = noteTitle;
    inputEdit.className = "edit-input";

    noteElement.firstChild.replaceWith(inputEdit);

    e.target.textContent = "save";
    e.target.className = "save";

    e.target.removeEventListener("click", handleEdit);
    e.target.addEventListener("click", ()=>{handlesave(noteId, noteElement)});
}

//save button response (saving function)
function handlesave(noteId, noteElement) {
    let editInput = noteElement.querySelector(".edit-input");
    let newTitle = editInput.value;

    arrayOfNotes.forEach((note)=>{
        if (note.id == noteId) {
            note.title = newTitle;
        }
    });
    addDataToLocal(arrayOfNotes);
    addElements(arrayOfNotes);

    noteElement.firstChild.replaceWith(newTitle);

    let btn = noteElement.querySelector(".save");
    btn.textContent = "edit";
    btn.className = "edit";

    btn.removeEventListener("click", handlesave);
    btn.addEventListener("click", handleEdit);
}

//add note function
function addNote(note) {
    let noteObj = {
        id: Date.now(),
        title: note,
    };
arrayOfNotes.push(noteObj);
addElements(arrayOfNotes);
addDataToLocal(arrayOfNotes);
}

//making the note and the edit & delete buttons
function addElements(eles) {
    noteDivs.innerHTML = "";
    if (Array.isArray(eles)) {
        eles.forEach(function (ele) {
            let div = document.createElement("div");
            div.className = "note";
            div.setAttribute("note-id", ele.id);
            div.appendChild(document.createTextNode(ele.title));
            let delBtn = document.createElement("button");
            delBtn.appendChild(document.createTextNode("Delete"));
            delBtn.className = "del";
            div.appendChild(delBtn);
            let editBtn = document.createElement("button");
            editBtn.className = "edit";
            editBtn.appendChild(document.createTextNode("Edit"));
            div.appendChild(editBtn);
            noteDivs.appendChild(div);
        });
    }
}

//adding data to local storage
function addDataToLocal(arrayOfNotes) {
    localStorage.setItem("notes", JSON.stringify(arrayOfNotes));
}

//getting data from local storage
function getDataFromLocal() {
    let data = localStorage.getItem("notes");
    addElements(JSON.parse(data));
}

//deleting notes
function deleteNote(noteId) {
    arrayOfNotes = arrayOfNotes.filter((ele)=> ele.id != noteId);
    addDataToLocal(arrayOfNotes);
    addElements(arrayOfNotes);
}

//setting a cookie
function setCookie(name, value, dayToLive) {
  const date = new Date();
  date.setTime(date.getTime() + dayToLive * 24 * 60 * 60 * 1000);

  const expires = "expires=" + date.toUTCString();

  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

//getting a specific cookie
function getCookie(name) {
  const decodedCookies = decodeURIComponent(document.cookie);

  const cookiesArray = decodedCookies.split("; ");

  let result = null;

  cookiesArray.forEach((cookie) => {
    if (cookie.indexOf(name) === 0) {
      result = cookie.substring(name.length + 1);
    }
    
  });

  return result;
}

//deleting cookie
function deleteCookie(name) {
  setCookie(name, null, null);
}

//login function (shows hidden if success)
function login() {
  const username = document.getElementById("username").value;

  const password = document.getElementById("password").value;

  if (username === "admin" && password === "123") {
    setCookie("loggedInUser", username, 3);

    document.getElementById("loggedIn").style.display = "block";

    document.getElementById("user").textContent = username;

    document.getElementById("loginForm").style.display = "none";
  } else {

    alert("please enter a valid username or password");
  }
}

//logout function (hides the shown data. returns to login)
function logout() {
  deleteCookie("loggedInUser");

  document.getElementById("loginForm").style.display = "block";

  document.getElementById("loggedIn").style.display = "none";
}