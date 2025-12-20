import "./bookmarks.css";
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
    <div className="bookmarksOverlay" onClick={onClose}>
      <div className="bookmarksModal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bookmarksHeader">
          <div className="headerLeft">
            <span className="bookmarksIcon">⭐</span>
            <h2>Saved Bookmarks</h2>
            <span className="bookmarkCount">{bookmarks.length}</span>
          </div>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        {/* Search & Actions */}
        <div className="bookmarksToolbar">
          <div className="searchBox">
            <span className="searchIcon">🔍</span>
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {bookmarks.length > 0 && (
            <button className="clearAllBtn" onClick={clearAllBookmarks}>
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Bookmarks List */}
        <div className="bookmarksList">
          {filteredBookmarks.length === 0 ? (
            <div className="emptyState">
              {bookmarks.length === 0 ? (
                <>
                  <span className="emptyIcon">⭐</span>
                  <h3>No Bookmarks Yet</h3>
                  <p>Save helpful AI responses by clicking the "Save" button in chat messages.</p>
                </>
              ) : (
                <>
                  <span className="emptyIcon">🔍</span>
                  <h3>No Results</h3>
                  <p>No bookmarks match "{searchTerm}"</p>
                </>
              )}
            </div>
          ) : (
            filteredBookmarks.map(bookmark => (
              <div 
                key={bookmark.id} 
                className={`bookmarkCard ${expandedId === bookmark.id ? 'expanded' : ''}`}
              >
                <div className="bookmarkHeader">
                  <div className="bookmarkMeta">
                    <Link 
                      to={`/dashboard/chats/${bookmark.chatId}`}
                      className="chatLink"
                      onClick={onClose}
                    >
                      💬 {bookmark.chatTitle}
                    </Link>
                    <span className="bookmarkDate">{formatDate(bookmark.createdAt)}</span>
                  </div>
                  <div className="bookmarkActions">
                    <button 
                      className="actionBtn expandBtn"
                      onClick={() => setExpandedId(expandedId === bookmark.id ? null : bookmark.id)}
                      title={expandedId === bookmark.id ? "Collapse" : "Expand"}
                    >
                      {expandedId === bookmark.id ? '▲' : '▼'}
                    </button>
                    <button 
                      className="actionBtn copyBtn"
                      onClick={() => copyBookmark(bookmark.text)}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                    <button 
                      className="actionBtn deleteBtn"
                      onClick={() => handleDelete(bookmark.id)}
                      title="Delete bookmark"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="bookmarkContent">
                  {expandedId === bookmark.id ? (
                    <div className="fullContent">
                      <Markdown remarkPlugins={[remarkGfm]}>{bookmark.text}</Markdown>
                    </div>
                  ) : (
                    <p className="previewContent">{truncateText(bookmark.text)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bookmarksFooter">
          <div className="footerTip">
            💡 Tip: Click on a chat title to go back to the original conversation
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
