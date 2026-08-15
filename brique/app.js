const STORAGE_KEY = "brique.entries.v1";

const form = document.querySelector("#entry-form");
const projectField = document.querySelector("#project");
const noteField = document.querySelector("#note");
const entryList = document.querySelector("#entry-list");
const entryTemplate = document.querySelector("#entry-template");
const entryCount = document.querySelector("#entry-count");
const emptyState = document.querySelector("#empty-state");
const formStatus = document.querySelector("#form-status");

let entries = loadEntries();

function loadEntries() {
  try {
    const storedEntries = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(storedEntries) ? storedEntries : [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function renderEntries() {
  entryList.replaceChildren();

  for (const entry of entries) {
    const fragment = entryTemplate.content.cloneNode(true);
    const time = fragment.querySelector(".entry-date");

    fragment.querySelector(".entry-project").textContent = entry.project;
    fragment.querySelector(".entry-note").textContent = entry.note;
    time.dateTime = entry.createdAt;
    time.textContent = formatDate(entry.createdAt);
    entryList.append(fragment);
  }

  emptyState.hidden = entries.length > 0;
  entryCount.textContent = `${entries.length} ${entries.length > 1 ? "briques" : "brique"}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const note = noteField.value.trim();
  if (!note) {
    noteField.focus();
    return;
  }

  entries.unshift({
    id: crypto.randomUUID(),
    project: projectField.value,
    note,
    createdAt: new Date().toISOString(),
  });

  saveEntries();
  renderEntries();
  noteField.value = "";
  noteField.focus();
  formStatus.textContent = "La brique a été ajoutée au journal local.";
});

renderEntries();
