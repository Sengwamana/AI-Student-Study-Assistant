import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const StudyNotes = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in p-4" onClick={onClose}>
      <div className="bg-surface rounded-3xl w-full max-w-[1100px] h-[85vh] flex overflow-hidden shadow-2xl border border-white/10 dark:border-white/5 animate-slide-up flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="w-full md:w-[300px] border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-black/20 h-[40vh] md:h-full">
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-text-primary m-0">📝 Study Notes</h2>
            <button className="py-2 px-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105 hover:shadow-md" onClick={createNewNote}>
              + New
            </button>
          </div>

          {/* Search */}
          <div className="p-3">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 text-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
            />
          </div>

          {/* Categories */}
          <div className="p-2 flex gap-1 md:flex-col flex-row overflow-x-auto md:overflow-visible scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`flex items-center gap-2.5 p-2.5 border-0 bg-transparent rounded-lg text-sm text-text-secondary cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 whitespace-nowrap ${selectedCategory === cat.id ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-semibold" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-text-muted md:block hidden">
                  {cat.id === "all" 
                    ? notes.length 
                    : notes.filter(n => n.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10 px-5 text-text-muted flex flex-col items-center">
                <span className="text-4xl mb-3 opacity-50">📝</span>
                <p className="text-sm m-0">No notes yet</p>
                <button className="mt-3 text-indigo-500 hover:underline text-sm font-medium" onClick={createNewNote}>Create your first note</button>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all mb-1.5 border ${
                      activeNote?.id === note.id 
                        ? "bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700" 
                        : "border-transparent hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
                  }`}
                  onClick={() => {
                    setActiveNote(note);
                    setShowPreview(false);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{getCategoryInfo(note.category).icon}</span>
                    <span className="text-sm font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{note.title || "Untitled"}</span>
                  </div>
                  <p className="text-xs text-text-muted m-0 mb-2 line-clamp-2 leading-relaxed">
                    {note.content.substring(0, 60) || "No content..."}
                  </p>
                  <span className="text-[10px] text-text-tertiary block text-right">{formatDate(note.updatedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-surface relative h-[60vh] md:h-full">
          {activeNote ? (
            <>
              <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <select
                    value={activeNote.category}
                    onChange={(e) => updateNote("category", e.target.value)}
                    className="py-1.5 px-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-transparent text-text-secondary cursor-pointer outline-none focus:border-indigo-500"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className={`py-1.5 px-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-xs cursor-pointer transition-all ${
                        showPreview 
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-200 dark:border-indigo-800" 
                            : "text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setShowPreview(!showPreview)}
                    title="Toggle preview"
                  >
                    👁️ Preview
                  </button>
                  <button
                    className="py-1.5 px-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent text-xs cursor-pointer transition-all text-text-secondary hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 hover:border-red-200"
                    onClick={() => deleteNote(activeNote.id)}
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
                <button className="md:block hidden w-8 h-8 rounded-lg border-0 bg-gray-100 dark:bg-gray-800 text-text-muted transition-all hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 cursor-pointer text-sm" onClick={onClose}>✕</button>
                <button className="md:hidden block absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white z-10" onClick={onClose}>✕</button>
              </div>

              <input
                type="text"
                className="p-5 pb-2 border-0 text-2xl font-bold text-text-primary bg-transparent w-full outline-none placeholder:text-text-muted/50"
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="Note title..."
              />

              <div className="flex-1 overflow-hidden flex relative">
                {showPreview ? (
                  <div className="flex-1 p-5 pt-2 overflow-y-auto prose prose-sm dark:prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {activeNote.content || "*No content yet...*"}
                    </Markdown>
                  </div>
                ) : (
                  <textarea
                    className="flex-1 p-5 pt-2 border-0 text-base leading-relaxed resize-none font-inherit text-text-primary bg-transparent outline-none w-full h-full"
                    value={activeNote.content}
                    onChange={(e) => updateNote("content", e.target.value)}
                    placeholder="Write your notes here... Supports Markdown!"
                  />
                )}
              </div>

              <div className="flex items-center gap-4 p-3 border-t border-gray-100 dark:border-gray-800 text-xs text-text-muted bg-gray-50/30 dark:bg-gray-900/30">
                <span>Created: {formatDate(activeNote.createdAt)}</span>
                <span>{activeNote.content.length} chars</span>
                <span className="ml-auto opacity-70 hidden sm:block">💡 Supports Markdown: **bold**, *italic*, # headers, - lists</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-center p-10">
              <span className="text-5xl mb-4 opacity-50">📝</span>
              <h3 className="m-0 mb-2 text-text-primary text-lg">Select a note or create a new one</h3>
              <p className="m-0 mb-5 text-sm">Your notes are saved locally and support Markdown formatting</p>
              <button className="py-2.5 px-5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5" onClick={createNewNote}>+ Create New Note</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyNotes;
