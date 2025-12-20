import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./studyNotes.css";

const StudyNotes = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { id: "all", name: "All Notes", icon: "📚" },
    { id: "math", name: "Mathematics", icon: "🔢" },
    { id: "science", name: "Science", icon: "🔬" },
    { id: "history", name: "History", icon: "📜" },
    { id: "language", name: "Language", icon: "📖" },
    { id: "other", name: "Other", icon: "📝" },
  ];

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const saved = localStorage.getItem("studyNotes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  };

  const saveNotes = (updatedNotes) => {
    localStorage.setItem("studyNotes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      category: "other",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setActiveNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (field, value) => {
    if (!activeNote) return;
    
    const updatedNote = {
      ...activeNote,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = notes.map(n => 
      n.id === activeNote.id ? updatedNote : n
    );
    
    saveNotes(updatedNotes);
    setActiveNote(updatedNote);
  };

  const deleteNote = (noteId) => {
    if (!confirm("Delete this note?")) return;
    
    const updatedNotes = notes.filter(n => n.id !== noteId);
    saveNotes(updatedNotes);
    
    if (activeNote?.id === noteId) {
      setActiveNote(null);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[5];
  };

  return (
    <div className="notesOverlay">
      <div className="notesModal">
        {/* Sidebar */}
        <div className="notesSidebar">
          <div className="sidebarHeader">
            <h2>📝 Study Notes</h2>
            <button className="newNoteBtn" onClick={createNewNote}>
              + New
            </button>
          </div>

          {/* Search */}
          <div className="notesSearch">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="notesCategories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`categoryBtn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="categoryCount">
                  {cat.id === "all" 
                    ? notes.length 
                    : notes.filter(n => n.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="notesList">
            {filteredNotes.length === 0 ? (
              <div className="emptyNotes">
                <span>📝</span>
                <p>No notes yet</p>
                <button onClick={createNewNote}>Create your first note</button>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`noteItem ${activeNote?.id === note.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveNote(note);
                    setIsEditing(false);
                    setShowPreview(false);
                  }}
                >
                  <div className="noteItemHeader">
                    <span className="noteCategory">{getCategoryInfo(note.category).icon}</span>
                    <span className="noteTitle">{note.title || "Untitled"}</span>
                  </div>
                  <p className="notePreview">
                    {note.content.substring(0, 60) || "No content..."}
                    {note.content.length > 60 && "..."}
                  </p>
                  <span className="noteDate">{formatDate(note.updatedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="notesContent">
          {activeNote ? (
            <>
              <div className="noteHeader">
                <div className="noteActions">
                  <select
                    value={activeNote.category}
                    onChange={(e) => updateNote("category", e.target.value)}
                    className="categorySelect"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className={`toggleBtn ${showPreview ? "active" : ""}`}
                    onClick={() => setShowPreview(!showPreview)}
                    title="Toggle preview"
                  >
                    👁️ Preview
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={() => deleteNote(activeNote.id)}
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
                <button className="closeMainBtn" onClick={onClose}>✕</button>
              </div>

              <input
                type="text"
                className="noteTitleInput"
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="Note title..."
              />

              <div className="noteBody">
                {showPreview ? (
                  <div className="notePreviewContent markdown">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {activeNote.content || "*No content yet...*"}
                    </Markdown>
                  </div>
                ) : (
                  <textarea
                    className="noteEditor"
                    value={activeNote.content}
                    onChange={(e) => updateNote("content", e.target.value)}
                    placeholder="Write your notes here... Supports Markdown!"
                  />
                )}
              </div>

              <div className="noteFooter">
                <span className="noteInfo">
                  Created: {formatDate(activeNote.createdAt)}
                </span>
                <span className="noteInfo">
                  {activeNote.content.length} characters
                </span>
                <span className="markdownHint">
                  💡 Supports Markdown: **bold**, *italic*, # headers, - lists
                </span>
              </div>
            </>
          ) : (
            <div className="noNoteSelected">
              <span className="noNoteIcon">📝</span>
              <h3>Select a note or create a new one</h3>
              <p>Your notes are saved locally and support Markdown formatting</p>
              <button onClick={createNewNote}>+ Create New Note</button>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button className="mobileCloseBtn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default StudyNotes;
