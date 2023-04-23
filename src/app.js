const notesTitle = document.querySelector(".title-of-notes");
const description = document.querySelector(".description");
const buttons = document.querySelector(".buttons");
const mainBox = document.querySelector(".main-box");
const notesDiv = document.querySelector("#notes");
let notes = [];
let binNotes = JSON.parse(localStorage.getItem("binNotes")) || [];
let archiveNotes = JSON.parse(localStorage.getItem("archiveNotes")) || [];
const deleteDiv = document.querySelector(".delete-div");
const archiveDiv = document.querySelector(".archive-div");
const deleteHead = document.querySelector(".del-section h2");
const archiveHead = document.querySelector(".archive-section h2");
const toClear = document.querySelector(".toClear");
const doubleBtn = document.querySelector(".btn");

// function to add notes section
function addNotes() {
  notesDiv.style.display = "flex";

  notesDiv.innerHTML = "";

  let content = "";

  for (let i = 0; i < notes.length; i++) {
    content += `<div class="note-card">
        <div class="top">
          <div class="display-title">
            <textarea id="show-title-${i}" class="show-title">${notes[i].title}</textarea> 
          </div>
          <div class="display-buttons">
            <div class="btn archive-btn">
              <i title="Archive" class="fa-solid fa-file archiveIcon" data-index="${i}"></i>
            </div>
            <div class="btn delete-btn">
              <i title="Delete" class="fa-solid fa-minus deleteIcon"  data-index="${i}"></i>
            </div>
          </div>
        </div>
        <div class="content">
          <textarea id="show-desc-${i}" class="show-desc">${notes[i].description}</textarea>
        </div>
      </div>`;
  }

  notesDiv.innerHTML = content;

  // archive function call
  const archiveIcons = document.querySelectorAll(".archiveIcon");
  archiveIcons.forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const index = parseInt(event.target.dataset.index);
      const archivedNote = notes.splice(index, 1)[0];
      archiveNotes.push(archivedNote);
      localStorage.setItem("archiveNotes", JSON.stringify(archiveNotes));
      localStorage.setItem("notes", JSON.stringify(notes));
      addNotes();
    });
  });

  // delete function
  const deleteIcons = document.querySelectorAll(".deleteIcon");
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const index = parseInt(event.target.dataset.index);
      const deletedNote = notes.splice(index, 1)[0];
      binNotes.push(deletedNote);
      localStorage.setItem("binNotes", JSON.stringify(binNotes));
      localStorage.setItem("notes", JSON.stringify(notes));
      addNotes();
    });
  });

  // update function call for title
  const noteTitles = document.querySelectorAll(".show-title");
  noteTitles.forEach((noteTitle) => {
    noteTitle.addEventListener("input", (event) => {
      const index = event.target.id.split("-")[2];
      const newTitle = event.target.value;
      if (newTitle.trim() !== "") {
        notes[index].title = newTitle;
        localStorage.setItem("notes", JSON.stringify(notes));
      }
    });
  });

  // update function call for description
  const noteDescriptions = document.querySelectorAll(".show-desc");
  noteDescriptions.forEach((noteDesc) => {
    noteDesc.addEventListener("input", (event) => {
      const index = event.target.id.split("-")[2];
      const newDesc = event.target.value;
      if (newDesc.trim() !== "") {
        notes[index].description = newDesc;
        localStorage.setItem("notes", JSON.stringify(notes));
      }
    });
  });
}

// to get item from local storage
if (localStorage.getItem("notes")) {
  notes = JSON.parse(localStorage.getItem("notes"));
  addNotes();
}

// after clicking the main box which is appeared by default on HomePage
description.addEventListener("click", () => {
  notesTitle.style.display = "block";
  buttons.style.display = "flex";
  description.style.height = "300px";

  if (notesTitle.value === "") {
    notesTitle.focus();
  }
});

// function for add and close button
const addCloseBtn = () => {
  notesTitle.style.display = "none";
  buttons.style.display = "none";
  description.style.height = "30px";
  description.style.overflowY = "hidden";
  description.style.marginBottom = "0";
};

// function for validation
const validate = () => {
  const titleError = document.querySelector("#titleError");
  const descError = document.querySelector("#descError");

  if (notesTitle.value === "") {
    titleError.textContent = "*Please enter the title of the notes.";
    return false;
  } else {
    titleError.textContent = "";
  }

  if (description.value === "") {
    descError.textContent = "*Please enter the description.";
    return false;
  } else {
    descError.textContent = "";
  }

  return true;
};

// after clicking the close button
const closeButton = document.querySelector(".close-btn");

closeButton.addEventListener("click", () => {
  addCloseBtn();
});

// after clicking the add note button
const addNoteButton = document.querySelector(".add-note-btn");

addNoteButton.addEventListener("click", () => {
  if (validate()) {
    const newNote = {
      title: notesTitle.value,
      description: description.value,
    };
    notes.push(newNote);
    // to set item in local storage
    localStorage.setItem("notes", JSON.stringify(notes));
    notesTitle.value = "";
    description.value = "";
    addCloseBtn();
    addNotes();
  }
});

// after clicking home button
const homeBtn = document.querySelector("#home");
homeBtn.addEventListener("click", () => {
  location.reload();
});

// delete folder
const deleteLibrary = () => {
  deleteHead.style.display = "block";
  mainBox.style.display = "none";
  notesDiv.style.display = "none";
  archiveHead.style.display = "none";
  archiveDiv.style.display = "none";
  deleteDiv.style.display = "flex";
  toClear.style.display = "flex";

  deleteDiv.innerHTML = "";

  let delContent = "";

  for (let i = 0; i < binNotes.length; i++) {
    if (
      binNotes[i].title !== null &&
      binNotes[i].description !== null &&
      binNotes[i].title !== "" &&
      binNotes[i].description !== ""
    ) {
      delContent += `<div class="note-card">
         <div class="top">
           <div class="display-title">
             <textarea class="show-title" readonly>${binNotes[i].title}</textarea>
           </div>
         </div>
         <div class="content">
           <textarea class="show-desc" readonly>${binNotes[i].description}</textarea>
         </div>
       </div>`;
    }
  }

  deleteDiv.innerHTML = delContent;

  const clearBtn = document.querySelector(".clear-all");

  if (binNotes.length === 0) {
    console.log("gdg");
    deleteHead.textContent = "Bin Folder is Empty!";
    clearBtn.style.display = "none";
  } else {
    clearBtn.style.display = "block";
  }

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("binNotes");
    deleteDiv.remove();
    clearBtn.remove();
    deleteHead.innerHTML = "Empty!";
  });

  toClear.appendChild(clearBtn);
};

// after clicking bin(delete) button at navbar
const binFolder = document.querySelector("#bin");
binFolder.addEventListener("click", () => {
  deleteLibrary();
});

// archive folder
const archiveLibrary = () => {
  archiveHead.style.display = "block";
  mainBox.style.display = "none";
  notesDiv.style.display = "none";
  deleteDiv.style.display = "none";
  deleteHead.style.display = "none";
  archiveDiv.style.display = "flex";
  toClear.style.display = "none";

  archiveDiv.innerHTML = "";

  let archiveContent = "";

  for (let i = 0; i < archiveNotes.length; i++) {
    archiveContent += `<div class="note-card">
          <div class="top">
            <div class="display-title">
              <textarea class="show-title" readonly>${archiveNotes[i].title}</textarea>
            </div>
          </div>
          <div class="content">
            <textarea class="show-desc" readonly>${archiveNotes[i].description}</textarea>
          </div>
          <div>
            <button class="restore" data-index="${i}">Restore</button>
          </div>
        </div>`;
  }

  archiveDiv.innerHTML = archiveContent;

  if (archiveNotes.length === 0) {
    archiveHead.textContent = "Archive Folder is Empty!";
  }

  // restore
  const restoreBtn = document.querySelectorAll(".restore");
  restoreBtn.forEach((restorebtns) => {
    restorebtns.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      const restoredNote = archiveNotes.splice(index, 1)[0];
      notes.push(restoredNote);
      localStorage.setItem("archiveNotes", JSON.stringify(archiveNotes));
      localStorage.setItem("notes", JSON.stringify(notes));
      archiveLibrary();
    });
  });
};

// after clicking archive button at navbar
const archiveFolder = document.querySelector("#archive");
archiveFolder.addEventListener("click", archiveLibrary);

// HAMBURGER
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav");
const header = document.querySelector("#header");
const head = document.querySelector(".head");
const brand = document.querySelector(".name");

function resetStyles() {
  head.style.margin = "0";
  brand.style.marginLeft = "0";
  brand.style.fontWeight = "600";
}

function toggleStyles() {
  if (
    hamburger.classList.contains("active") &&
    navMenu.classList.contains("active")
  ) {
    head.style.margin = "auto";
    brand.style.marginLeft = "2rem";
    brand.style.fontWeight = "400";
  } else {
    resetStyles();
  }
}

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");

  toggleStyles();
});

navMenu.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
  resetStyles();
});

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  if (width > 700) {
    resetStyles();
  } else {
    toggleStyles();
  }
});
