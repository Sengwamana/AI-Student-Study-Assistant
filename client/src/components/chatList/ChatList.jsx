import { Link, useNavigate, useLocation } from "react-router-dom";
import "./chatList.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// Topic tags configuration
const TOPIC_TAGS = [
  { id: "math", label: "Math", emoji: "🔢", color: "#6366f1" },
  { id: "science", label: "Science", emoji: "🔬", color: "#10b981" },
  { id: "history", label: "History", emoji: "📜", color: "#f59e0b" },
  { id: "language", label: "Language", emoji: "📝", color: "#ec4899" },
  { id: "coding", label: "Coding", emoji: "💻", color: "#8b5cf6" },
  { id: "general", label: "General", emoji: "📚", color: "#64748b" },
];

const ChatList = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatTags, setChatTags] = useState({});
  const [showTagMenu, setShowTagMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [activeFilter, setActiveFilter] = useState(null);
  const editInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const tagButtonRefs = useRef({});

  // Load chat tags from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatTags");
    if (saved) {
      setChatTags(JSON.parse(saved));
    }
  }, []);

  // Close tag menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showTagMenu && !e.target.closest('.tagMenu') && !e.target.closest('.tagBtn')) {
        setShowTagMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTagMenu]);

  // Handle opening tag menu with position
  const handleOpenTagMenu = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (showTagMenu === chatId) {
      setShowTagMenu(null);
      return;
    }
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
    setShowTagMenu(chatId);
  };

  // Save tag for a chat
  const handleSetTag = (chatId, tagId) => {
    const updated = { ...chatTags, [chatId]: tagId };
    localStorage.setItem("chatTags", JSON.stringify(updated));
    setChatTags(updated);
    setShowTagMenu(null);
  };

  // Remove tag from a chat
  const handleRemoveTag = (chatId) => {
    const updated = { ...chatTags };
    delete updated[chatId];
    localStorage.setItem("chatTags", JSON.stringify(updated));
    setChatTags(updated);
    setShowTagMenu(null);
  };

  // Get tag info for a chat
  const getTagInfo = (chatId) => {
    const tagId = chatTags[chatId];
    return TOPIC_TAGS.find(t => t.id === tagId);
  };

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch chats");
      }
      
      const result = await res.json();
      // Ensure we always return an array
      return Array.isArray(result) ? result : [];
    },
    retry: 2,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (chatId) => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete chat");
      }
      return chatId;
    },
    onSuccess: (deletedChatId) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      setDeleteConfirm(null);
      // If we're viewing the deleted chat, navigate to dashboard
      if (location.pathname.includes(deletedChatId)) {
        navigate("/dashboard");
      }
    },
  });

  // Rename mutation
  const renameMutation = useMutation({
    mutationFn: async ({ chatId, title }) => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/title`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        throw new Error("Failed to rename chat");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      setEditingId(null);
      setEditTitle("");
    },
  });

  const handleDeleteClick = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm(chatId);
  };

  const handleConfirmDelete = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutation.mutate(chatId);
  };

  const handleCancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm(null);
  };

  const handleEditClick = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(chat._id);
    setEditTitle(chat.title);
    setDeleteConfirm(null);
  };

  const handleSaveEdit = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    if (editTitle.trim()) {
      renameMutation.mutate({ chatId, title: editTitle.trim() });
    }
  };

  const handleCancelEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
    setEditTitle("");
  };

  const handleEditKeyDown = (e, chatId) => {
    if (e.key === "Enter") {
      handleSaveEdit(e, chatId);
    } else if (e.key === "Escape") {
      handleCancelEdit(e);
    }
  };

  // Safely get chats array
  const chats = Array.isArray(data) ? data : [];
  
  // Filter chats based on search query and active tag filter
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeFilter || chatTags[chat._id] === activeFilter;
    return matchesSearch && matchesTag;
  });

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <nav className="chatList" aria-label="Study sessions navigation">
      <span className="title">STUDY ASSISTANT</span>
      <Link to="/dashboard" aria-label="Start new study session">📚 New Study Session</Link>
      <Link to="/" aria-label="Go to home page">🏠 Home</Link>
      <hr aria-hidden="true" />
      <span className="title">RECENT SESSIONS</span>
      
      {/* Search Input */}
      <div className="searchContainer">
        <span className="searchIcon">🔍</span>
        <input
          ref={searchInputRef}
          type="text"
          className="searchInput"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search study sessions"
        />
        {searchQuery && (
          <button 
            className="clearSearchBtn"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tag Filters */}
      <div className="tagFilters">
        <button 
          className={`tagFilterBtn ${!activeFilter ? 'active' : ''}`}
          onClick={() => setActiveFilter(null)}
        >
          All
        </button>
        {TOPIC_TAGS.map(tag => (
          <button 
            key={tag.id}
            className={`tagFilterBtn ${activeFilter === tag.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(activeFilter === tag.id ? null : tag.id)}
            style={{ '--tag-color': tag.color }}
            title={tag.label}
          >
            {tag.emoji}
          </button>
        ))}
      </div>

      <div className="list" role="list" aria-label="Recent study sessions">
        {isPending ? (
          <div className="loadingChats">
            <span className="loadingDot"></span>
            <span className="loadingDot"></span>
            <span className="loadingDot"></span>
          </div>
        ) : error ? (
          <button className="retryChats" onClick={() => refetch()} aria-label="Retry loading sessions">
            ⚠️ Tap to retry
          </button>
        ) : filteredChats.length === 0 ? (
          <span className="noChats">
            {searchQuery ? `No sessions matching "${searchQuery}"` : "No sessions yet"}
          </span>
        ) : (
          filteredChats.map((chat) => (
            <div key={chat._id} className="chatItem" role="listitem">
              {deleteConfirm === chat._id ? (
                <div className="deleteConfirm">
                  <span>Delete?</span>
                  <button 
                    className="confirmBtn yes"
                    onClick={(e) => handleConfirmDelete(e, chat._id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "..." : "Yes"}
                  </button>
                  <button 
                    className="confirmBtn no"
                    onClick={handleCancelDelete}
                  >
                    No
                  </button>
                </div>
              ) : editingId === chat._id ? (
                <div className="editMode">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, chat._id)}
                    className="editInput"
                    maxLength={100}
                  />
                  <button 
                    className="confirmBtn yes"
                    onClick={(e) => handleSaveEdit(e, chat._id)}
                    disabled={renameMutation.isPending || !editTitle.trim()}
                  >
                    {renameMutation.isPending ? "..." : "✓"}
                  </button>
                  <button 
                    className="confirmBtn no"
                    onClick={handleCancelEdit}
                  >
                    ✗
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to={`/dashboard/chats/${chat._id}`}
                    aria-label={`Open session: ${chat.title}`}
                  >
                    {getTagInfo(chat._id)?.emoji || "📖"} {chat.title}
                    {getTagInfo(chat._id) && (
                      <span 
                        className="chatTagBadge"
                        style={{ background: getTagInfo(chat._id).color }}
                      >
                        {getTagInfo(chat._id).label}
                      </span>
                    )}
                  </Link>
                  <div className="chatActions">
                    <button 
                      className="tagBtn"
                      onClick={(e) => handleOpenTagMenu(e, chat._id)}
                      aria-label="Set topic tag"
                    >
                      🏷️
                    </button>
                    <button 
                      className="editBtn"
                      onClick={(e) => handleEditClick(e, chat)}
                      aria-label={`Rename session: ${chat.title}`}
                    >
                      ✏️
                    </button>
                    <button 
                      className="deleteBtn"
                      onClick={(e) => handleDeleteClick(e, chat._id)}
                      aria-label={`Delete session: ${chat.title}`}
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <hr aria-hidden="true" />
      <div className="upgrade">
        <span className="upgradeIcon" aria-hidden="true">🎓</span>
        <div className="texts">
          <span>Study Smarter</span>
          <span>AI-powered learning assistance</span>
        </div>
      </div>

      {/* Tag Menu Portal */}
      {showTagMenu && createPortal(
        <div 
          className="tagMenuPortal"
          style={{
            position: 'fixed',
            top: menuPosition.top,
            left: menuPosition.left,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
        >
          <div className="tagMenu">
            {TOPIC_TAGS.map(tag => (
              <button
                key={tag.id}
                className={`tagOption ${chatTags[showTagMenu] === tag.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSetTag(showTagMenu, tag.id);
                }}
                style={{ '--tag-color': tag.color }}
              >
                <span className="tagEmoji">{tag.emoji}</span>
                <span className="tagLabel">{tag.label}</span>
              </button>
            ))}
            {chatTags[showTagMenu] && (
              <button
                className="tagOption remove"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveTag(showTagMenu);
                }}
              >
                <span className="tagEmoji">✕</span>
                <span className="tagLabel">Remove Tag</span>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default ChatList;
