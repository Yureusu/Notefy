import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js"
import { getFirestore, doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBVxbD1x6B70xYY99ukMcGz3ttLYL1Zx9I",
    authDomain: "notefy-5c7c2.firebaseapp.com",
    projectId: "notefy-5c7c2",
    storageBucket: "notefy-5c7c2.firebasestorage.app",
    messagingSenderId: "310779028224",
    appId: "1:310779028224:web:0276eb8a219756850e89e5"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const closeNote = document.getElementById("close-note");
closeNote.addEventListener("click", () => {
    const addPopup = document.getElementById("add-popup");
    addPopup.style.display = "none";
}); 

const addNote = document.getElementById("add-note");
addNote.addEventListener("click", () => {
    const addPopup = document.getElementById("add-popup");
    addPopup.style.display = "flex";
}); 

let noteColor = "#dee4e7";

document.getElementById("save-note").addEventListener("click", async (e) => {
    e.preventDefault();
    try{
        let titleValue = document.getElementById("title-area").value;
        let noteValue = document.getElementById("note-area").value;
        document.querySelectorAll("#note-span").forEach(span => span.remove());
        await addDoc(collection(db, "notes"),{
            title: titleValue,
            note: noteValue,
            color: noteColor,
            createdAt: serverTimestamp()
        });
        document.querySelectorAll("#note-span").forEach(span => span.remove());
        const addPopup = document.getElementById("add-popup");
        addPopup.style.display = "none";
        document.getElementById("addednote-popup").style.display = "flex";
        document.getElementById("close-addedpopup").addEventListener("click", () => {
            const sucedPopup = document.getElementById("addednote-popup");
            sucedPopup.style.display = "none";
        });
    }
    catch(err){
        alert(err.message);
    }
});

const colRef = collection(db, "notes");

onSnapshot(colRef, (snapshot) => {
    let snap = [];
    snapshot.docs.forEach((doc) => {
        snap.push({...doc.data(), id: doc.id, title: doc.data().title, note: doc.data().note})
        console.log(snap);
        renderNote();

        function renderNote() {
            let currentId = doc.id;
            let titleDisplay = doc.data().title;
            let noteDisplay = doc.data().note;
            let displayColor = doc.data().color;

            const noteField = document.getElementById("note-wrapper");
            const noteSpan = document.createElement("span");
            const titleSpan = document.createElement("h1");
            const textSpan = document.createElement("h2");

            titleSpan.textContent = titleDisplay;
            textSpan.textContent = noteDisplay;
            noteSpan.setAttribute("id", "note-span");
            noteSpan.setAttribute("name", currentId);
            noteSpan.style.backgroundColor = displayColor;

            noteSpan.appendChild(titleSpan);
            noteSpan.appendChild(textSpan);
            noteField.appendChild(noteSpan);

            //sort a to z
            let sortAtoz = false;

            function sortSpans() {
                if (sortAtoz == true){
                    let container = document.getElementById("note-wrapper");
                    let spans = Array.from(container.children);
                
                    spans.sort((a, b) => a.textContent.localeCompare(b.textContent));
                
                    spans.forEach(span => container.appendChild(span));
                }
                else{
                    sortAtoz = false;
                }
            }

            sortSpans();

            //

            let idArray = [];
            document.querySelectorAll("#note-span").forEach(element => {
                idArray.push(element.getAttribute("name"));
                //console.log(idArray);
            });  

            let allNotes = document.querySelectorAll("#note-span");

            allNotes.forEach(span => {
                span.addEventListener("click", (event) => {
                    if (event.target.tagName === "SPAN") {
                        const editPopup = document.getElementById("edit-popup");
                        editPopup.style.display = "flex";
                        document.getElementById("close-editnote").addEventListener("click", () => {
                            editPopup.style.display = "none";
                        });

                        let idValue = event.target.getAttribute("name");
                        let currentTitle = event.target.querySelector("h1").textContent;
                        let currentNote = event.target.querySelector("h2").textContent;        
                        
                        console.log("The clicked note has an id: " + idValue + " " + "Title: " + currentTitle + " " + "Note: " + currentNote);      

                        let editTitleValue = document.getElementById("edit-titlearea");
                        editTitleValue.textContent = currentTitle;
                        let editNoteValue = document.getElementById("edit-notearea");
                        editNoteValue.textContent = currentNote; 

                        document.getElementById("edit-save").addEventListener("click", async (e) => {
                            e.preventDefault();

                            const updateTitle = document.getElementById("edit-titlearea").value;
                            const updateNote = document.getElementById("edit-notearea").value;

                            document.querySelectorAll("#note-span").forEach(span => span.remove());

                            updateDocument("notes", idValue, { title: updateTitle, note: updateNote });

                        });

                        document.getElementById("delete-note").addEventListener("click", async (e) => {
                            e.preventDefault();

                            document.querySelectorAll("#note-span").forEach(span => span.remove());
                            
                            deleteDocument("notes", idValue);
                        });

                    }
                    else{
                        console.log("Error!");
                    }
                });
            });
        } 
    });
});

async function updateDocument(docName, docId, newData) {
    try {
        const docRef = doc(db, docName, docId); 
        await updateDoc(docRef, newData);
        //console.log(docName, docId, newData);
        document.getElementById("edit-popup").style.display = "none";
        document.getElementById("successedit-popup").style.display = "flex";
        document.getElementById("close-sucedpopup").addEventListener("click", () => {
            const sucedPopup = document.getElementById("successedit-popup");
            sucedPopup.style.display = "none";
        });
    } 
    catch (error) {
        alert(error.message);
    }
}

async function deleteDocument(docName, docId) {
    try {
        const docRef = doc(db, docName, docId);
        await deleteDoc(docRef); 
        document.getElementById("edit-popup").style.display = "none";
        document.getElementById("successdelete-popup").style.display = "flex";
        document.getElementById("close-sucdelpopup").addEventListener("click", () => {
            const sucdelPopup = document.getElementById("successdelete-popup");
            sucdelPopup.style.display = "none";
        });
    } 
    catch (error) {
        alert(error.message);
    }
}

//switch mode

document.getElementById("dark-mode").addEventListener("click", () => {
    document.getElementById("light-mode").style.display = "block";
    document.getElementById("dark-mode").style.display = "none";
    document.documentElement.style.setProperty('--mode-fcolor', '#dee4e7');
    document.documentElement.style.setProperty('--mode-bcolor', '#37474f');
    document.documentElement.style.setProperty('--mode-wcolor', '#222222');
});

document.getElementById("light-mode").addEventListener("click", () => {
    document.getElementById("dark-mode").style.display = "block";
    document.getElementById("light-mode").style.display = "none";
    document.documentElement.style.setProperty("--mode-fcolor", "#37474f");
    document.documentElement.style.setProperty('--mode-bcolor', '#dee4e7');
    document.documentElement.style.setProperty('--mode-wcolor', '#ffffff');
});

//change color

document.getElementById("change-color").addEventListener("click", () => {
    document.getElementById("color-popup").style.display = "flex";
});
document.getElementById("close-colorpopup").addEventListener("click", () => {
    document.getElementById("color-popup").style.display = "none";
});
document.getElementById("null-note").addEventListener("click", () => {
    document.getElementById("color-popup").style.display = "none";
    document.getElementById("change-color").style.backgroundColor = "none";
    noteColor = "#dee4e7";
});
document.getElementById("red-note").addEventListener("click", () => {
    document.getElementById("color-popup").style.display = "none";
    document.getElementById("change-color").style.backgroundColor = "#FF8A8A";
    noteColor = "#FF8A8A";
});
document.getElementById("green-note").addEventListener("click", () => {
    document.getElementById("color-popup").style.display = "none";
    document.getElementById("change-color").style.backgroundColor = "#C1CFA1";
    noteColor = "#C1CFA1";
});
document.getElementById("blue-note").addEventListener("click", () => {
    document.getElementById("color-popup").style.display = "none";
    document.getElementById("change-color").style.backgroundColor = "#A6AEBF";
    noteColor = "#A6AEBF";
});


