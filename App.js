import React, { useState, useEffect } from "react";
import "./App.css";


function NoteForm({ onSubmit, editingNote, setEditingNote }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setDescription(editingNote.description);
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    if (editingNote) {
      onSubmit({ ...editingNote, title, description });
    } else {
      onSubmit({ id: Date.now(), title, description });
    }

    setTitle("");
    setDescription("");
    setEditingNote(null);
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">{editingNote ? "Update" : "Add"} Note</button>
    </form>
  );
}


function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.description}</p>
      <div className="actions">
        <button onClick={() => onEdit(note)}>Edit</button>
        <button onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
}


function NoteList({ notes, onEdit, onDelete }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}


export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [editingNote, setEditingNote] = useState(null);

 
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      } catch (e) {
        console.error("Failed to parse notes from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddOrUpdate = (note) => {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === note.id ? note : n)));
    } else {
      setNotes([note, ...notes]);
    }
    setEditingNote(null);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    setEditingNote(null);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>Notes App</h1>
      <input
        className="search-bar"
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <NoteForm
        onSubmit={handleAddOrUpdate}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
      />
      <NoteList
        notes={filteredNotes}
        onEdit={setEditingNote}
        onDelete={handleDelete}
      />
    </div>
  );
}
