const fs = require('node:fs');
const path = require('node:path');

const notesFile = path.join(__dirname, 'notes.json');

function getNotes() {
  const notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
  if (!Array.isArray(notes)) {
    throw new Error('Notes storage must contain a JSON array');
  }
  return notes;
}

function saveNotes(notes) {
  fs.writeFileSync(notesFile, `${JSON.stringify(notes, null, 2)}\n`);
}

function addNote(title, body) {
  const notes = getNotes();
  notes.push({ title, body });
  saveNotes(notes);
}

function getNote(title) {
  return getNotes().find((note) => note.title === title);
}

function removeNote(title) {
  const notes = getNotes();
  const remainingNotes = notes.filter((note) => note.title !== title);
  if (remainingNotes.length === notes.length) return false;
  saveNotes(remainingNotes);
  return true;
}

module.exports = { getNotes, addNote, getNote, removeNote };
