import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IKImage } from "imagekitio-react";
import { useAuth } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const navigate = useNavigate();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarkNotification, setShowBookmarkNotification] = useState(false);
  const [ratings, setRatings] = useState({});
  const [showRatingThanks, setShowRatingThanks] = useState(false);
  const exportMenuRef = useRef(null);

  const { getToken } = useAuth();

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studyBookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Load ratings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("responseRatings");
    if (saved) {
      setRatings(JSON.parse(saved));
    }
  }, []);

  // Rate a response
  const handleRating = (messageIndex, rating) => {
    const ratingKey = `${chatId}-${messageIndex}`;
    const updatedRatings = { ...ratings, [ratingKey]: rating };
    localStorage.setItem("responseRatings", JSON.stringify(updatedRatings));
    setRatings(updatedRatings);
    
    // Update study stats
    const stats = JSON.parse(localStorage.getItem("studyStats") || "{}");
    stats.totalRatings = (stats.totalRatings || 0) + 1;
    if (rating === "helpful") {
      stats.helpfulRatings = (stats.helpfulRatings || 0) + 1;
    }
    localStorage.setItem("studyStats", JSON.stringify(stats));
    
    setShowRatingThanks(true);
    setTimeout(() => setShowRatingThanks(false), 2000);
  };

  // Get rating for a message
  const getRating = (messageIndex) => {
    const ratingKey = `${chatId}-${messageIndex}`;
    return ratings[ratingKey];
  };

  // Save bookmark
  const handleBookmark = (message, index) => {
    const text = message.parts?.[0]?.text || "";
    const newBookmark = {
      id: Date.now().toString(),
      text: text,
      chatId: chatId,
      chatTitle: data?.title || "Study Session",
      role: message.role,
      createdAt: new Date().toISOString(),
    };
    
    const updatedBookmarks = [newBookmark, ...bookmarks];
    localStorage.setItem("studyBookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
    
    setShowBookmarkNotification(true);
    setTimeout(() => setShowBookmarkNotification(false), 2000);
  };

  // Check if message is bookmarked
  const isBookmarked = (message) => {
    const text = message.parts?.[0]?.text || "";
    return bookmarks.some(b => b.text === text && b.chatId === chatId);
  };

  // Copy text to clipboard
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Export chat as TXT file
  const exportAsTxt = () => {
    if (!data || !history.length) return;
    
    const title = data.title || "Study Session";
    const date = new Date().toLocaleDateString();
    
    let content = `📚 AI Study Assistant - Chat Export\n`;
    content += `${"=".repeat(50)}\n`;
    content += `Title: ${title}\n`;
    content += `Date: ${date}\n`;
    content += `Messages: ${history.length}\n`;
    content += `${"=".repeat(50)}\n\n`;
    
    history.forEach((msg, i) => {
      const role = msg.role === "user" ? "👤 You" : "🤖 AI Assistant";
      const text = msg.parts?.[0]?.text || "";
      content += `${role}:\n${"-".repeat(30)}\n${text}\n\n`;
    });
    
    content += `${"=".repeat(50)}\n`;
    content += `Exported from AI Study Assistant\n`;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export chat as Markdown file
  const exportAsMarkdown = () => {
    if (!data || !history.length) return;
    
    const title = data.title || "Study Session";
    const date = new Date().toLocaleDateString();
    
    let content = `# 📚 ${title}\n\n`;
    content += `> Exported from AI Study Assistant on ${date}\n\n`;
    content += `---\n\n`;
    
    history.forEach((msg, i) => {
      const role = msg.role === "user" ? "## 👤 You" : "## 🤖 AI Assistant";
      const text = msg.parts?.[0]?.text || "";
      content += `${role}\n\n${text}\n\n---\n\n`;
    });
    
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Copy entire chat to clipboard
  const copyEntireChat = async () => {
    if (!data || !history.length) return;
    
    const title = data.title || "Study Session";
    let content = `📚 ${title}\n\n`;
    
    history.forEach((msg) => {
      const role = msg.role === "user" ? "You:" : "AI:";
      const text = msg.parts?.[0]?.text || "";
      content += `${role}\n${text}\n\n`;
    });
    
    try {
      await navigator.clipboard.writeText(content);
      setShowExportMenu(false);
      // Show a brief notification
      setCopiedIndex("all");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Close export menu when clicking outside
  const handleClickOutside = (e) => {
    if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
      setShowExportMenu(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showExportMenu]);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return response.json();
    },
    retry: 2,
  });

  // Safely get history array
  const history = Array.isArray(data?.history) ? data.history : [];

  // Navigate back with chat context so user can summarize/quiz this session
  const handleGoBack = () => {
    navigate("/dashboard", { 
      state: { 
        chatId: chatId,
        chatTitle: data?.title,
        chatHistory: history 
      } 
    });
  };

  return (
    <div className="flex flex-col h-full items-center relative bg-surface animate-fade-in transition-colors duration-300">
      {/* Chat Header with Back Button */}
      <div className="w-full flex items-center justify-between p-4 md:px-7 bg-surface border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 animate-fade-in-down transition-colors duration-300">
        <button 
          className="flex items-center gap-2 py-2.5 px-4.5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-500/15 rounded-xl text-indigo-600 dark:text-indigo-400 text-sm font-medium cursor-pointer transition-all hover:bg-gradient-to-br hover:from-indigo-500 hover:to-violet-600 hover:text-white hover:border-transparent hover:-translate-x-0.5 hover:shadow-lg hover:shadow-indigo-500/25 group"
          onClick={handleGoBack}
          aria-label="Go back to dashboard with this chat"
        >
          <span className="text-base transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          <span className="hidden md:inline">Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2.5 text-base font-semibold text-text-primary">
          <span className="text-xl">💬</span>
          <span className="truncate max-w-[200px] md:max-w-md">{data?.title || "Study Session"}</span>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Export Menu */}
          <div className="relative" ref={exportMenuRef}>
            <button 
              className={`flex items-center gap-1.5 py-2.5 px-4 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-text-primary text-sm font-medium cursor-pointer transition-all hover:bg-surface-secondary hover:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${showExportMenu ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-500/50' : ''}`}
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!history.length}
              aria-label="Export chat"
            >
              <span>📥</span>
              <span className="hidden md:inline">Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-[1000] min-w-[180px] overflow-hidden animate-fade-in-down">
                <button onClick={copyEntireChat} className="flex items-center gap-2.5 w-full p-3 bg-transparent border-0 border-b border-gray-100 dark:border-gray-800 text-text-primary text-sm cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 text-left">
                  <span>📋</span> Copy All
                </button>
                <button onClick={exportAsTxt} className="flex items-center gap-2.5 w-full p-3 bg-transparent border-0 border-b border-gray-100 dark:border-gray-800 text-text-primary text-sm cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 text-left">
                  <span>📄</span> Download as TXT
                </button>
                <button onClick={exportAsMarkdown} className="flex items-center gap-2.5 w-full p-3 bg-transparent border-0 text-text-primary text-sm cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 text-left">
                  <span>📝</span> Download as Markdown
                </button>
              </div>
            )}
          </div>
          <Link 
            to="/dashboard" 
            className="py-2.5 px-4.5 bg-gradient-to-br from-indigo-500 to-violet-600 border-0 rounded-xl text-white text-sm font-medium no-underline cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35"
            aria-label="Start new study session"
          >
            <span>+ <span className="hidden md:inline">New Session</span></span>
          </Link>
        </div>
      </div>

      {/* Success notification for copy all */}
      {copiedIndex === "all" && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/30 z-[1000] animate-slide-down flex items-center gap-2">
          <span>✓</span> Entire chat copied to clipboard!
        </div>
      )}

      {/* Bookmark notification */}
      {showBookmarkNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl text-sm font-medium shadow-lg shadow-amber-500/30 z-[1000] animate-slide-down flex items-center gap-2">
          <span>⭐</span> Message saved to bookmarks!
        </div>
      )}

      {/* Rating thanks notification */}
      {showRatingThanks && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-br from-violet-500 to-violet-600 text-white py-3 px-6 rounded-xl text-sm font-medium shadow-lg shadow-violet-500/30 z-[1000] animate-slide-down flex items-center gap-2">
          <span>🙏</span> Thanks for your feedback!
        </div>
      )}

      <div className="flex-1 overflow-y-auto w-full flex justify-center p-7 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="w-full max-w-[720px] flex flex-col gap-6 pb-10">
          {isPending ? (
            <div className="flex flex-col items-center gap-5 py-20 text-text-muted text-[15px] animate-fade-in">
              <div className="w-10 h-10 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <span>Loading your study session...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="text-5xl">⚠️</span>
              <span className="text-text-muted text-[15px]">Something went wrong loading this chat.</span>
              <button 
                className="py-2.5 px-6 bg-gradient-to-br from-indigo-500 to-violet-600 border-0 rounded-xl text-white text-sm font-medium cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30" 
                onClick={() => refetch()}
              >
                Try Again
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center gap-3.5 py-20 text-center text-text-muted text-[15px] animate-fade-in">
              <span className="text-[52px] opacity-90 animate-float">💡</span>
              <span>Start a conversation below...</span>
            </div>
          ) : (
            history.map((message, i) => (
              <div key={i} className="flex flex-col gap-2 animate-fade-in-up group">
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 self-end mb-2"
                  />
                )}
                <div
                  className={`p-[18px_22px] rounded-[20px] text-[15px] leading-[1.75] shadow-sm transition-all duration-300 ${
                    message.role === "user" 
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white max-w-[85%] self-end rounded-tr-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 prose-headings:text-white prose-a:text-white prose-strong:text-white prose-code:text-white prose-code:bg-white/10" 
                      : "bg-surface border border-gray-200 dark:border-gray-800 rounded-tl-md hover:shadow-md dark:hover:shadow-gray-900/50 prose dark:prose-invert max-w-none"
                  }`}
                >
                  <Markdown remarkPlugins={[remarkGfm]}>{message.parts?.[0]?.text || ''}</Markdown>
                </div>
                {message.role === "model" && (
                  <div className="flex gap-2 pl-1 opacity-0 translate-y-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                    <button 
                      className={`flex items-center gap-1 py-1.5 px-3 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-surface text-text-secondary cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-500/20 hover:text-indigo-600 ${copiedIndex === i ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30 text-emerald-600' : ''}`}
                      onClick={() => handleCopy(message.parts?.[0]?.text || '', i)}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === i ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button 
                      className={`flex items-center gap-1 py-1.5 px-3 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-surface text-text-secondary cursor-pointer transition-all hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:border-amber-500/30 hover:text-amber-600 ${isBookmarked(message) ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500/30 text-amber-600' : ''}`}
                      onClick={() => handleBookmark(message, i)}
                      title={isBookmarked(message) ? "Bookmarked" : "Save to bookmarks"}
                    >
                      {isBookmarked(message) ? '⭐ Saved' : '☆ Save'}
                    </button>
                    <div className="flex gap-1 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                      <button 
                        className={`py-1.5 px-2.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-surface text-text-secondary cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 disabled:cursor-default disabled:opacity-70 ${getRating(i) === 'helpful' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30 text-emerald-600' : ''}`}
                        onClick={() => handleRating(i, 'helpful')}
                        title="Helpful response"
                        disabled={getRating(i) !== undefined}
                      >
                        {getRating(i) === 'helpful' ? '👍 Helpful' : '👍'}
                      </button>
                      <button 
                        className={`py-1.5 px-2.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-surface text-text-secondary cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 disabled:cursor-default disabled:opacity-70 ${getRating(i) === 'not-helpful' ? 'bg-red-50 dark:bg-red-900/10 border-red-500/30 text-red-500' : ''}`}
                        onClick={() => handleRating(i, 'not-helpful')}
                        title="Not helpful"
                        disabled={getRating(i) !== undefined}
                      >
                        {getRating(i) === 'not-helpful' ? '👎 Not Helpful' : '👎'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {data && <NewPrompt data={data}/>}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
