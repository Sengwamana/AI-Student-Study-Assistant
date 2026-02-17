import { useEffect, useRef, useState } from "react";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

// Configuration: Use streaming for real-time UX, or non-streaming for stability
const USE_STREAMING = false;

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const { getToken } = useAuth();

  const endRef = useRef(null);
  const formRef = useRef(null);

  const queryClient = useQueryClient();

  // Mutation for updating the chat on the server
  const mutation = useMutation({
    mutationFn: async ({ question: q, answer: a, imgPath }) => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: q || undefined,
          answer: a,
          img: imgPath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: async () => {
      // Wait for the query to refetch before clearing local state
      await queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
      formRef.current?.reset();
      setQuestion("");
      setAnswer("");
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
    },
    onError: (err) => {
      console.error("Failed to update chat:", err);
      setError("An error occurred while saving the chat.");
    },
  });

  // Non-streaming AI request (more stable, better for quota management)
  const generateNonStreaming = async (text, token) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/generate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: text,
        history: data?.history || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate response");
    }

    const result = await response.json();
    return result.response;
  };

  // Streaming AI request (real-time UX)
  const generateStreaming = async (text, token) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/generate/stream`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: text,
        history: data?.history || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate response");
    }

    // Process the SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonData = JSON.parse(line.slice(6));
            if (jsonData.text) {
              accumulatedText += jsonData.text;
              setAnswer(accumulatedText);
            }
            if (jsonData.error) {
              throw new Error(jsonData.error);
            }
          } catch (e) {
            if (e.message && !e.message.includes("JSON")) {
              throw e;
            }
            // Skip invalid JSON lines
          }
        }
      }
    }

    return accumulatedText;
  };

  // Function to add a new message using backend AI service
  const add = async (text, isInitial) => {
    if (!text) {
      console.warn("Empty text cannot be added to the chat.");
      return;
    }

    if (!isInitial) setQuestion(text);
    setIsGenerating(true);
    setError(null);
    setAnswer("");

    try {
      const token = await getToken();
      
      let aiResponse;
      if (USE_STREAMING) {
        aiResponse = await generateStreaming(text, token);
      } else {
        aiResponse = await generateNonStreaming(text, token);
        setAnswer(aiResponse);
      }

      if (aiResponse) {
        // Pass values directly to mutation to avoid stale closure issues
        mutation.mutate({ 
          question: text, 
          answer: aiResponse, 
          imgPath: img.dbData?.filePath 
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Sorry, I encountered an error. Please try again.");
      setAnswer("");
    } finally {
      setIsGenerating(false);
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img]);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value?.trim();
    if (!text || isGenerating) return;

    add(text, false);
  };

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter to submit (when in textarea/input)
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (formRef.current && !isGenerating) {
          const textInput = formRef.current.querySelector('input[name="text"]');
          if (textInput?.value?.trim()) {
            formRef.current.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
          }
        }
      }
      
      // Escape to clear input
      if (e.key === "Escape") {
        const textInput = formRef.current?.querySelector('input[name="text"]');
        if (textInput && document.activeElement === textInput) {
          textInput.value = "";
          textInput.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGenerating]);

  // Add the initial message from history
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1 && data.history[0]?.parts?.[0]?.text) {
        add(data.history[0].parts[0].text, true);
      }
      hasRun.current = true;
    }
  }, [data]);

  return (
    <>
      {/* Add new chat */}
      {img.isLoading && <div className="text-text-muted text-sm p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl text-center animate-fade-in">Loading image...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
          className="rounded-2xl shadow-md mb-4"
        />
      )}
      {question && <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4 text-text-primary self-end animate-fade-in-up">{question}</div>}
      {error && (
        <div className="flex items-center justify-between gap-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl mb-4 border border-red-100 dark:border-red-900/30 animate-fade-in">
          <span>⚠️ {error}</span>
          <button 
            className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 cursor-pointer border-none flex items-center justify-center hover:bg-red-200" 
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
      {answer && (
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl mb-4 text-text-primary leading-relaxed shadow-sm animate-fade-in-up">
          <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
        </div>
      )}
      {isGenerating && !answer && (
        <div className="p-4 text-text-muted italic animate-pulse">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
            Generating response...
          </span>
        </div>
      )}
      <div className="pb-32" ref={endRef}></div>
      <form 
        className="w-[95%] max-w-3xl absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-gray-200 dark:border-gray-700/50 rounded-[3rem] flex items-center gap-2 p-2 pl-6 shadow-2xl transition-all duration-300 animate-slide-up focus-within:shadow-xl focus-within:border-indigo-300 dark:focus-within:border-indigo-700/50 focus-within:ring-4 focus-within:ring-indigo-500/5 z-50 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90" 
        onSubmit={handleSubmit} 
        ref={formRef} 
        role="form" 
        aria-label="Chat input form"
      >
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden aria-hidden="true" />
        <input 
          type="text" 
          name="text" 
          className="flex-1 py-3.5 px-1 border-none outline-none bg-transparent text-text-primary text-[15px] placeholder:text-gray-400"
          placeholder="Ask anything... (Ctrl+Enter to send, Esc to clear)" 
          disabled={isGenerating}
          aria-label="Type your question"
          autoComplete="off"
        />
        <button 
          className="rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-none p-3.5 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden hover:scale-105 hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group mr-1"
          disabled={isGenerating} 
          aria-label={isGenerating ? "Generating response..." : "Send message"}
          type="submit"
        >
          <img src="/arrow.png" alt="Send" className="w-[18px] h-[18px] invert brightness-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
