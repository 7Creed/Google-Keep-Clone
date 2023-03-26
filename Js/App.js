// const form = document.querySelector('#form');
const noteTitle = document.querySelector("#note-title");
const noteText = document.querySelector("#note-text");
const formBtns = document.querySelector("#form-buttons");
const closeBtn = document.querySelector("#form-close-button");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalText = document.querySelector(".modal-text");
const modalCloseBtn = document.querySelector(".modal-close-button");
const colorTooltip = document.querySelector("#color-tooltip");
const body = document.body;

class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes") || []);
    // this.notes = [];
    this.title = "";
    this.text = "";
    this.id = "";

    console.log("app works!");
    this.$form = document.querySelector("#form"); //calling the form elements from html
    this.noteTitle = noteTitle;
    this.noteText = noteText;
    this.formBtns = formBtns;
    this.$placeholder = document.querySelector("#placeholder");
    this.$notes = document.querySelector("#notes");
    this.closeBtn = closeBtn;
    this.modal = modal;
    this.modalTitle = modalTitle;
    this.modalText = modalText;
    this.modalCloseBtn = modalCloseBtn;
    this.colorTooltip = colorTooltip;

    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    body.addEventListener("click", (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });
    body.addEventListener("mouseover", (event) => {
      this.openTooltip(event);
    });
    body.addEventListener("mouseout", (event) => {
      this.closeTooltip(event);
    });

    this.colorTooltip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    this.colorTooltip.addEventListener("click", (event) => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
    });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.noteTitle.value;
      const text = this.noteText.value;
      const hasNote = title || text;

      if (hasNote) {
        // add note
        this.addNote({ title, text });
      }
    });

    this.closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      this.closeForm();
      // console.log('close')
    });

    this.modalCloseBtn.addEventListener("click", (event) => {
      this.closeModal(event);
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);

    const title = this.noteTitle.value;
    const text = this.noteText.value;
    const hasNote = title || text;

    if (isFormClicked) {
      // open
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      // close
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add("form-open");
    this.noteTitle.style.display = "block";
    this.formBtns.style.display = "block";
  }
  closeForm() {
    this.$form.classList.remove("form-open");
    this.noteTitle.style.display = "none";
    this.formBtns.style.display = "none";
    this.noteTitle.value = "";
    this.noteText.value = "";
  }
  openModal(event) {
    if (event.target.matches(".toolbar-delete")) return;
    if (event.target.matches(".toolbar-color")) return;

    const match = event.target.closest(".note");
    if (match) {
      this.modal.classList.toggle("open-modal");
      this.modalTitle.value = this.title;
      this.modalText.value = this.text;
    }
  }

  closeModal(event) {
    this.editNote();
    this.modal.classList.toggle("open-modal");
  }

  openTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    // const note = document.querySelectorAll('.note')
    this.id = event.target.dataset.id;
    console.log(event.target);
    const noteCoords = event.target.getBoundingClientRect();
    console.log(noteCoords);
    const horizontal = noteCoords.left + window.scrollX;
    // for (let not of note) {
    //     const newVertical = not.getBoundingClientRect().height + window.scrollY
    //     this.colorTooltip.style.transform = `translate(${horizontal}px, ${newVertical}px)`;
    //     console.log(note);
    // }
    // console.log(this.$notes);
    const vertical = noteCoords.bottom ;
    console.log(vertical, window.scrollY);
    this.colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.colorTooltip.style.display = "flex";
  }

  closeTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.colorTooltip.style.display = "none";
  }

  addNote({ title, text }) {
    const newNote = {
      title,
      text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }

  editNote() {
    const title = this.modalTitle.value;
    const text = this.modalText.value;
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, title, text } : note
    );
    this.render();
  }

  editNoteColor(color) {
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, color } : note
    );
    this.render();
  }

  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches(".toolbar-delete")) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter((note) => note.id !== Number(id));
    this.render();
  }

  selectNote(event) {
    const selNote = event.target.closest(".note");
    if (!selNote) return;
    const [firstNoteTitle, secondNoteText] = selNote.children;
    this.title = firstNoteTitle.innerText;
    this.text = secondNoteText.innerText;
    this.id = selNote.dataset.id;
  }

  render() {
    this.saveNote();
    this.displayNotes();
  }

  saveNote() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? "none" : "flex";

    this.$notes.innerHTML = this.notes
      .map(
        (note) =>
          `
            <div class="note" style="background: ${note.color};" data-id="${
            note.id
          }">
                <div class="${note.title && "note-title"}">
                    ${note.title}
                </div>
                <div class="note-text">
                    ${note.text}
                </div>
                <div class="toolbar-container" style="background-color: re;">
                    <div class="toolbar">
                        
                        <i style="margin-right: 20px;" class="fa-solid fa-palette fa-2xl toolbar-color" data-id="${
                          note.id
                        }"></i>
                          <i style="margin-right: 20px;" class="fa-solid fa-trash fa-2xl toolbar-delete" data-id="${
                            note.id
                          }"></i>
                    </div>
                </div>
            </div>
            `
      )
      .join("");
  }
}

new App();
