import { Link, useNavigate, useLocation } from "react-router-dom";
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
      if (showTagMenu && !e.target.closest('.tagMenuPortal') && !e.target.closest('.tagBtn')) {
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
    <nav className="flex flex-col h-full bg-surface p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300 hover:shadow-2xl overflow-visible" aria-label="Study sessions navigation">
      <span className="font-bold text-[10px] mb-2.5 text-gray-400 uppercase tracking-widest pl-2">STUDY ASSISTANT</span>
      <Link 
        to="/dashboard" 
        className="block px-3.5 py-3 rounded-2xl text-text-secondary text-sm font-semibold transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 hover:translate-x-1"
        aria-label="Start new study session"
      >
        📚 New Study Session
      </Link>
      <Link 
        to="/" 
        className="block px-3.5 py-3 rounded-2xl text-text-secondary text-sm font-semibold transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text-primary hover:translate-x-1"
        aria-label="Go to home page"
      >
        🏠 Home
      </Link>
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4"></div>
      
      <span className="font-bold text-[10px] mb-2.5 text-gray-400 uppercase tracking-widest pl-2">RECENT SESSIONS</span>
      
      {/* Search Input */}
      <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-2.5 mb-3 transition-all duration-200 gap-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10">
        <span className="text-xs opacity-50">🔍</span>
        <input
          ref={searchInputRef}
          type="text"
          className="flex-1 border-none bg-transparent text-text-primary text-sm outline-none placeholder:text-gray-400"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search study sessions"
        />
        {searchQuery && (
          <button 
            className="bg-transparent border-none text-gray-400 cursor-pointer p-0.5 text-xs rounded hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center w-5 h-5 transition-colors"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-1.5 mb-3 px-1">
        <button 
          className={`px-2.5 py-1 border rounded-xl text-[11px] font-medium cursor-pointer transition-all duration-200 ${!activeFilter 
            ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none' 
            : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          onClick={() => setActiveFilter(null)}
        >
          All
        </button>
        {TOPIC_TAGS.map(tag => (
          <button 
            key={tag.id}
            className={`px-2.5 py-1 border rounded-xl text-[11px] font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${activeFilter === tag.id 
              ? 'text-white shadow-sm' 
              : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveFilter(activeFilter === tag.id ? null : tag.id)}
            style={{ 
              backgroundColor: activeFilter === tag.id ? tag.color : undefined,
              borderColor: activeFilter === tag.id ? tag.color : undefined
            }}
            title={tag.label}
          >
            <span>{tag.emoji}</span>
            {activeFilter === tag.id && <span>{tag.label}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto gap-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pr-1" role="list" aria-label="Recent study sessions">
        {isPending ? (
          <div className="flex justify-center items-center gap-1.5 p-5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
          </div>
        ) : error ? (
          <button className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-xl text-xs font-medium cursor-pointer transition-all hover:bg-amber-500/20" onClick={() => refetch()} aria-label="Retry loading sessions">
            ⚠️ Tap to retry
          </button>
        ) : filteredChats.length === 0 ? (
          <span className="text-xs text-gray-400 p-4 text-center italic">
            {searchQuery ? `No sessions matching "${searchQuery}"` : "No sessions yet"}
          </span>
        ) : (
          filteredChats.map((chat, index) => (
            <div 
              key={chat._id} 
              className="group flex items-center gap-1 relative p-1 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 animate-fade-in-left"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              role="listitem"
            >
              {deleteConfirm === chat._id ? (
                <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-xl w-full animate-fade-in border border-red-100 dark:border-red-900/30">
                  <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 pl-1">Delete session?</span>
                  <button 
                    className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-red-600 disabled:opacity-50"
                    onClick={(e) => handleConfirmDelete(e, chat._id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "..." : "Yes"}
                  </button>
                  <button 
                    className="px-2.5 py-1 bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={handleCancelDelete}
                  >
                    No
                  </button>
                </div>
              ) : editingId === chat._id ? (
                <div className="flex items-center gap-2 p-1.5 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl w-full animate-fade-in border border-indigo-100 dark:border-indigo-900/30">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, chat._id)}
                    className="flex-1 px-2.5 py-1.5 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs bg-white dark:bg-gray-900 text-text-primary outline-none focus:border-indigo-500 shadow-sm"
                    maxLength={100}
                  />
                  <button 
                    className="p-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-green-600 disabled:opacity-50 flex items-center justify-center w-7 h-7"
                    onClick={(e) => handleSaveEdit(e, chat._id)}
                    disabled={renameMutation.isPending || !editTitle.trim()}
                  >
                    {renameMutation.isPending ? "..." : "✓"}
                  </button>
                  <button 
                    className="p-1.5 bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center w-7 h-7"
                    onClick={handleCancelEdit}
                  >
                    ✗
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to={`/dashboard/chats/${chat._id}`}
                    className="flex-1 flex items-center gap-2 px-2 py-2 rounded-xl text-text-secondary text-sm font-medium transition-all duration-200 relative hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600 hover:shadow-sm group-hover:pl-3 w-full overflow-hidden"
                    aria-label={`Open session: ${chat.title}`}
                  >
                    <span className="text-base flex-shrink-0 opacity-80">{getTagInfo(chat._id)?.emoji || "📖"}</span>
                    <span className="truncate flex-1">{chat.title}</span>
                    {getTagInfo(chat._id) && (
                      <span 
                        className="text-[9px] px-1.5 py-0.5 rounded-full text-white font-semibold flex-shrink-0"
                        style={{ background: getTagInfo(chat._id).color }}
                      >
                        {getTagInfo(chat._id).label}
                      </span>
                    )}
                  </Link>
                  <div className="absolute right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-gray-800/90 p-1 rounded-lg backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-700">
                    <button 
                      className="p-1.5 text-xs text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-all tagBtn"
                      onClick={(e) => handleOpenTagMenu(e, chat._id)}
                      aria-label="Set topic tag"
                    >
                      🏷️
                    </button>
                    <button 
                      className="p-1.5 text-xs text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-all"
                      onClick={(e) => handleEditClick(e, chat)}
                      aria-label={`Rename session: ${chat.title}`}
                    >
                      ✏️
                    </button>
                    <button 
                      className="p-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
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
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4"></div>
      
      <div className="mt-auto flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/20 group">
        <span className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true">🎓</span>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-sm text-text-primary group-hover:text-indigo-600 transition-colors">Study Smarter</span>
          <span className="text-[10px] text-gray-400">AI-powered learning</span>
        </div>
      </div>

      {/* Tag Menu Portal */}
      {showTagMenu && createPortal(
        <div 
          className="tagMenuPortal fixed z-[9999]"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-xl flex flex-col gap-0.5 w-44 animate-fade-in-up relative before:content-[''] before:absolute before:-top-1.5 before:left-1/2 before:-translate-x-1/2 before:w-3 before:h-3 before:bg-white dark:before:bg-gray-800 before:border-l before:border-t before:border-gray-200 dark:before:border-gray-700 before:rotate-45">
            {TOPIC_TAGS.map(tag => (
              <button
                key={tag.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 border-none bg-transparent rounded-xl cursor-pointer transition-all duration-150 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:pl-4 group ${chatTags[showTagMenu] === tag.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSetTag(showTagMenu, tag.id);
                }}
              >
                <span className="text-base w-5 text-center">{tag.emoji}</span>
                <span className={`text-sm font-medium ${chatTags[showTagMenu] === tag.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{tag.label}</span>
              </button>
            ))}
            {chatTags[showTagMenu] && (
              <button
                className="flex items-center gap-2.5 px-3 py-2.5 mt-1 border-t border-gray-100 dark:border-gray-700/50 bg-transparent rounded-xl cursor-pointer transition-all duration-150 text-left hover:bg-red-50 dark:hover:bg-red-900/10 group text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveTag(showTagMenu);
                }}
              >
                <span className="text-base w-5 text-center">✕</span>
                <span className="text-sm font-medium">Remove Tag</span>
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
