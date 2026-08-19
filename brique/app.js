const STORAGE_KEY = "brique.entries.v1";

const form = document.querySelector("#entry-form");
const submitButton = document.querySelector("#submit-entry");
const cancelEditButton = document.querySelector("#cancel-edit");
const projectField = document.querySelector("#project");
const noteField = document.querySelector("#note");
const noteCount = document.querySelector("#note-count");
const entryList = document.querySelector("#entry-list");
const entryTemplate = document.querySelector("#entry-template");
const entryCount = document.querySelector("#entry-count");
const emptyState = document.querySelector("#empty-state");
const formStatus = document.querySelector("#form-status");

let entries = loadEntries();
let editingEntryId = null;

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

function updateNoteCount() {
  noteCount.textContent = `${noteField.value.length} / ${noteField.maxLength} caractères`;
}

function resetEditor() {
  editingEntryId = null;
  noteField.value = "";
  submitButton.textContent = "Ajouter au journal";
  cancelEditButton.hidden = true;
  updateNoteCount();
}

function startEditing(entryId) {
  const entry = entries.find((candidate) => candidate.id === entryId);
  if (!entry) {
    return;
  }

  editingEntryId = entry.id;
  projectField.value = entry.project;
  noteField.value = entry.note;
  submitButton.textContent = "Enregistrer les modifications";
  cancelEditButton.hidden = false;
  updateNoteCount();
  noteField.focus();
  formStatus.textContent = "Modification de la brique en cours.";
}

function deleteEntry(entryId) {
  const entry = entries.find((candidate) => candidate.id === entryId);
  if (!entry) {
    return;
  }

  const confirmed = window.confirm(
    `Supprimer cette brique de ${entry.project} ? Cette action est définitive.`,
  );
  if (!confirmed) {
    return;
  }

  entries = entries.filter((candidate) => candidate.id !== entryId);

  if (editingEntryId === entryId) {
    resetEditor();
  }

  saveEntries();
  renderEntries();
  formStatus.textContent = "La brique a été supprimée du journal local.";
}

function togglePinnedEntry(entryId) {
  const entry = entries.find((candidate) => candidate.id === entryId);
  if (!entry) {
    return;
  }

  const isPinned = !entry.pinned;
  entries = entries.map((candidate) =>
    candidate.id === entryId ? { ...candidate, pinned: isPinned } : candidate,
  );

  saveEntries();
  renderEntries();
  formStatus.textContent = isPinned
    ? "La brique a été épinglée dans le journal local."
    : "La brique a été désépinglée du journal local.";
}

function renderEntries() {
  entryList.replaceChildren();

  const displayedEntries = [
    ...entries.filter((entry) => entry.pinned),
    ...entries.filter((entry) => !entry.pinned),
  ];

  for (const entry of displayedEntries) {
    const fragment = entryTemplate.content.cloneNode(true);
    const entryElement = fragment.querySelector(".entry");
    const time = fragment.querySelector(".entry-date");
    const pinButton = fragment.querySelector(".entry-pin");
    const editButton = fragment.querySelector(".entry-edit");
    const deleteButton = fragment.querySelector(".entry-delete");

    fragment.querySelector(".entry-project").textContent = entry.project;
    fragment.querySelector(".entry-note").textContent = entry.note;
    entryElement.classList.toggle("entry-pinned", Boolean(entry.pinned));
    pinButton.textContent = entry.pinned ? "Désépingler" : "Épingler";
    pinButton.setAttribute("aria-pressed", String(Boolean(entry.pinned)));
    pinButton.setAttribute(
      "aria-label",
      `${entry.pinned ? "Désépingler" : "Épingler"} la brique ${entry.project}`,
    );
    pinButton.addEventListener("click", () => togglePinnedEntry(entry.id));
    editButton.setAttribute("aria-label", `Modifier la brique ${entry.project}`);
    editButton.addEventListener("click", () => startEditing(entry.id));
    deleteButton.setAttribute("aria-label", `Supprimer la brique ${entry.project}`);
    deleteButton.addEventListener("click", () => deleteEntry(entry.id));
    time.dateTime = entry.createdAt;
    time.textContent = formatDate(entry.createdAt);
    entryList.append(fragment);
  }

  emptyState.hidden = entries.length > 0;
  entryCount.textContent = `${entries.length} ${entries.length > 1 ? "briques" : "brique"}`;
}

noteField.addEventListener("input", updateNoteCount);

cancelEditButton.addEventListener("click", () => {
  resetEditor();
  noteField.focus();
  formStatus.textContent = "La modification a été annulée.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const note = noteField.value.trim();
  if (!note) {
    noteField.focus();
    return;
  }

  const isEditing = editingEntryId !== null;

  if (isEditing && !entries.some((entry) => entry.id === editingEntryId)) {
    resetEditor();
    noteField.focus();
    formStatus.textContent = "Cette brique n'existe plus dans le journal.";
    return;
  }

  if (isEditing) {
    entries = entries.map((entry) =>
      entry.id === editingEntryId
        ? { ...entry, project: projectField.value, note }
        : entry,
    );
  } else {
    entries.unshift({
      id: crypto.randomUUID(),
      project: projectField.value,
      note,
      createdAt: new Date().toISOString(),
    });
  }

  saveEntries();
  renderEntries();
  resetEditor();
  noteField.focus();
  formStatus.textContent = isEditing
    ? "La brique a été modifiée dans le journal local."
    : "La brique a été ajoutée au journal local.";
});

updateNoteCount();
renderEntries();
