import "./chatPage.css";
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
    <div className="chatPage">
      {/* Chat Header with Back Button */}
      <div className="chatHeader">
        <button 
          className="backButton" 
          onClick={handleGoBack}
          aria-label="Go back to dashboard with this chat"
        >
          <span className="backIcon">←</span>
          <span className="backText">Back to Dashboard</span>
        </button>
        <div className="chatTitle">
          <span className="chatIcon">💬</span>
          <span>{data?.title || "Study Session"}</span>
        </div>
        <div className="headerActions">
          {/* Export Menu */}
          <div className="exportContainer" ref={exportMenuRef}>
            <button 
              className={`exportButton ${showExportMenu ? 'active' : ''}`}
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!history.length}
              aria-label="Export chat"
            >
              <span>📥</span>
              <span className="exportText">Export</span>
            </button>
            {showExportMenu && (
              <div className="exportMenu">
                <button onClick={copyEntireChat} className="exportOption">
                  <span>📋</span> Copy All
                </button>
                <button onClick={exportAsTxt} className="exportOption">
                  <span>📄</span> Download as TXT
                </button>
                <button onClick={exportAsMarkdown} className="exportOption">
                  <span>📝</span> Download as Markdown
                </button>
              </div>
            )}
          </div>
          <Link to="/dashboard" className="newChatButton" aria-label="Start new study session">
            <span>+ New Session</span>
          </Link>
        </div>
      </div>

      {/* Success notification for copy all */}
      {copiedIndex === "all" && (
        <div className="copyNotification">
          ✓ Entire chat copied to clipboard!
        </div>
      )}

      {/* Bookmark notification */}
      {showBookmarkNotification && (
        <div className="bookmarkNotification">
          ⭐ Message saved to bookmarks!
        </div>
      )}

      {/* Rating thanks notification */}
      {showRatingThanks && (
        <div className="ratingNotification">
          🙏 Thanks for your feedback!
        </div>
      )}

      <div className="wrapper">
        <div className="chat">
          {isPending ? (
            <div className="loadingState">
              <div className="loadingSpinner"></div>
              <span>Loading your study session...</span>
            </div>
          ) : error ? (
            <div className="errorState">
              <span className="errorIcon">⚠️</span>
              <span className="errorText">Something went wrong loading this chat.</span>
              <button className="retryButton" onClick={() => refetch()}>
                Try Again
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="emptyChat">
              <span className="emptyIcon">💡</span>
              <span>Start a conversation below...</span>
            </div>
          ) : (
            history.map((message, i) => (
              <div key={i} className="messageWrapper">
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={
                    message.role === "user" ? "message user" : "message"
                  }
                >
                  <Markdown remarkPlugins={[remarkGfm]}>{message.parts?.[0]?.text || ''}</Markdown>
                </div>
                {message.role === "model" && (
                  <div className="messageActions">
                    <button 
                      className={`actionBtn copyBtn ${copiedIndex === i ? 'copied' : ''}`}
                      onClick={() => handleCopy(message.parts?.[0]?.text || '', i)}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === i ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button 
                      className={`actionBtn bookmarkBtn ${isBookmarked(message) ? 'bookmarked' : ''}`}
                      onClick={() => handleBookmark(message, i)}
                      title={isBookmarked(message) ? "Bookmarked" : "Save to bookmarks"}
                    >
                      {isBookmarked(message) ? '⭐ Saved' : '☆ Save'}
                    </button>
                    <div className="ratingBtns">
                      <button 
                        className={`actionBtn ratingBtn ${getRating(i) === 'helpful' ? 'rated helpful' : ''}`}
                        onClick={() => handleRating(i, 'helpful')}
                        title="Helpful response"
                        disabled={getRating(i) !== undefined}
                      >
                        {getRating(i) === 'helpful' ? '👍 Helpful' : '👍'}
                      </button>
                      <button 
                        className={`actionBtn ratingBtn ${getRating(i) === 'not-helpful' ? 'rated not-helpful' : ''}`}
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
