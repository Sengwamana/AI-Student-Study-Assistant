import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Bookmarks = ({ onClose }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studyBookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Delete a bookmark
  const handleDelete = (id) => {
    const updated = bookmarks.filter(b => b.id !== id);
    localStorage.setItem("studyBookmarks", JSON.stringify(updated));
    setBookmarks(updated);
  };

  // Clear all bookmarks
  const clearAllBookmarks = () => {
    if (window.confirm("Are you sure you want to delete all bookmarks?")) {
      localStorage.setItem("studyBookmarks", JSON.stringify([]));
      setBookmarks([]);
    }
  };

  // Copy bookmark text
  const copyBookmark = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Filter bookmarks by search term
  const filteredBookmarks = bookmarks.filter(b => 
    b.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.chatTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Truncate text for preview
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-2xl w-[90%] max-w-[700px] max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <h2 className="m-0 text-xl font-semibold text-text-primary">Saved Bookmarks</h2>
            <span className="bg-gradient-to-br from-amber-400 to-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{bookmarks.length}</span>
          </div>
          <button className="w-9 h-9 rounded-full border-0 bg-gray-100 dark:bg-gray-800 text-text-secondary text-base cursor-pointer transition-all hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 flex items-center justify-center" onClick={onClose}>✕</button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row flex-col">
          <div className="flex-1 flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 transition-all focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/10 w-full">
            <span className="text-sm opacity-60">🔍</span>
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>
          {bookmarks.length > 0 && (
            <button className="flex items-center gap-1.5 py-2.5 px-4 border border-red-200 dark:border-red-900/30 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 text-sm cursor-pointer transition-all hover:bg-red-100 dark:hover:bg-red-900/20 hover:border-red-300 sm:w-auto w-full justify-center" onClick={clearAllBookmarks}>
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              {bookmarks.length === 0 ? (
                <>
                  <span className="text-5xl opacity-40 mb-2">⭐</span>
                  <h3 className="text-lg font-semibold text-text-primary m-0">No Bookmarks Yet</h3>
                  <p className="text-sm text-text-secondary max-w-[280px] m-0">Save helpful AI responses by clicking the "Save" button in chat messages.</p>
                </>
              ) : (
                <>
                  <span className="text-5xl opacity-40 mb-2">🔍</span>
                  <h3 className="text-lg font-semibold text-text-primary m-0">No Results</h3>
                  <p className="text-sm text-text-secondary max-w-[280px] m-0">No bookmarks match "{searchTerm}"</p>
                </>
              )}
            </div>
          ) : (
            filteredBookmarks.map(bookmark => (
              <div 
                key={bookmark.id} 
                className={`bg-surface border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all hover:border-amber-400/30 hover:shadow-sm ${expandedId === bookmark.id ? 'border-amber-400/40' : ''}`}
              >
                <div className="flex items-center justify-between p-3 bg-amber-50/5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link 
                      to={`/dashboard/chats/${bookmark.chatId}`}
                      className="text-[13px] font-medium text-amber-500 hover:text-amber-600 hover:underline decoration-amber-300 underline-offset-2 transition-colors"
                      onClick={onClose}
                    >
                      💬 {bookmark.chatTitle}
                    </Link>
                    <span className="text-xs text-text-muted">{formatDate(bookmark.createdAt)}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-all text-sm flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-500"
                      onClick={() => setExpandedId(expandedId === bookmark.id ? null : bookmark.id)}
                      title={expandedId === bookmark.id ? "Collapse" : "Expand"}
                    >
                      {expandedId === bookmark.id ? '▲' : '▼'}
                    </button>
                    <button 
                      className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-all text-sm flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-500"
                      onClick={() => copyBookmark(bookmark.text)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                    <button 
                      className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-all text-sm flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500"
                      onClick={() => handleDelete(bookmark.id)}
                      title="Delete bookmark"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="p-4 text-sm leading-relaxed text-text-secondary">
                  {expandedId === bookmark.id ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <Markdown remarkPlugins={[remarkGfm]}>{bookmark.text}</Markdown>
                    </div>
                  ) : (
                    <p className="m-0 line-clamp-3">{truncateText(bookmark.text)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
          <div className="text-[13px] text-text-muted">
            💡 Tip: Click on a chat title to go back to the original conversation
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
