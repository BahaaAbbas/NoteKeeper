const notesList = document.getElementById("notesList");
const paginationDiv = document.getElementById("pagination");
const searchForm = document.getElementById("searchForm");
const searchQueryInput = document.getElementById("searchQuery");
const noteIdInput = document.getElementById("noteId");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const noteForm = document.getElementById("noteForm");

let currPage = 1;
let limitNotes = 5;
let currentSearch = "";

async function fetchNotes(page = 1, query = "") {
  try {
    let url = `/notes/api?page=${page}&limit=${limitNotes}`;
    if (query) {
      url = `notes/api/search?query=${encodeURIComponent(query)}`;
    }

    const result = await fetch(url);
    const data = await result.json();

    if (Array.isArray(data)) {
      renderNotes(data);
      paginationDiv.innerHTML = "";
    } else {
      renderNotes(data.pageNotes);
      renderPagination(data.page, data.totalNotes, data.limit);
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

function renderNotes(notes) {
  notesList.innerHTML = "";
  if (notes.length === 0) {
    notesList.innerHTML = "<p>No notes found.</p>";
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement("div");
    card.classList.add("note-card");
    card.dataset.id = note._id;

    card.innerHTML = `
      <h2 class="note-title">${note.title}</h2>
      <p class="note-content">${note.content}</p>
      <span class="note-date">${new Date(
        note.creationDate
      ).toLocaleDateString()}</span>
      <div class="note-actions">
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      </div>
    `;

    notesList.appendChild(card);
  });
}

function renderPagination(page, totalNotes, limit) {
  const totalPages = Math.ceil(totalNotes / limit);
  let htmlToAdd = "";

  if (page > 1) {
    htmlToAdd += `<button data-page="${page - 1}">Previous</button>`;
  }
  htmlToAdd += `<span> Page ${page} of ${totalPages} </span>`;

  if (page < totalPages) {
    htmlToAdd += `<button data-page="${page + 1}">Next</button>`;
  }

  paginationDiv.innerHTML = htmlToAdd;
}

// Search notes
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchQueryInput.value.trim();
  currentSearch = query;
  fetchNotes(1, query);
});

paginationDiv.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const page = parseInt(event.target.dataset.page);
    currPage = page;
    fetchNotes(page);
  }
});

notesList.addEventListener("click", (event) => {
  if (event.target.classList.contains("editBtn")) {
    const card = event.target.closest(".note-card");
    noteIdInput.value = card.dataset.id;
    titleInput.value = card.querySelector(".note-title").textContent;
    contentInput.value = card.querySelector(".note-content").textContent;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (event.target.classList.contains("deleteBtn")) {
    const card = event.target.closest(".note-card");
    const id = card.dataset.id;

    if (confirm("Are you sure you want to delete this note?")) {
      fetch(`/notes/api/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          currentSearch ? fetchNotes(1, currentSearch) : fetchNotes(currPage);
        })
        .catch((error) => console.error("Error deleting note:", error));
    }
  }
});

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const noteId = noteIdInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) return alert("Please fill in all fields.");

  try {
    const result = await fetch(`/notes/api${noteId ? `/${noteId}` : ""}`, {
      method: noteId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const data = await result.json();

    if (!result.ok) return alert(data.message || "Error saving note.");

    noteForm.reset();
    noteIdInput.value = "";
    currentSearch ? fetchNotes(1, currentSearch) : fetchNotes(currPage);
  } catch (error) {
    console.error("Error saving note:", error);
  }
});

fetchNotes();
