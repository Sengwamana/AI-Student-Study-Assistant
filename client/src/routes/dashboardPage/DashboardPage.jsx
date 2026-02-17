import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PDFUpload from "../../components/pdfUpload/PDFUpload";
import Flashcards from "../../components/flashcards/Flashcards";

const MarkdownComponents = {
  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 pb-2 border-b-2 border-indigo-100 dark:border-indigo-900/30" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-indigo-500 dark:text-indigo-400 mt-6 mb-3" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-lg font-medium text-text-primary mt-4 mb-2 flex items-center gap-2" {...props} />,
  p: ({node, ...props}) => <p className="mb-4 text-text-secondary leading-relaxed" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-text-secondary marker:text-indigo-500" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-text-secondary marker:text-indigo-500 marker:font-bold" {...props} />,
  li: ({node, ...props}) => <li className="pl-1" {...props} />,
  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-r-lg my-4 italic text-text-secondary shadow-sm" {...props} />,
  code: ({node, inline, className, children, ...props}) => {
    return inline ? 
      <code className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-100 dark:border-indigo-900/30" {...props}>{children}</code> :
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono shadow-inner border border-slate-800" {...props}><code className="bg-transparent p-0 border-none" {...props}>{children}</code></pre>
  },
  a: ({node, ...props}) => <a className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2 transition-colors font-medium" {...props} />,
  table: ({node, ...props}) => <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} /></div>,
  thead: ({node, ...props}) => <thead className="bg-gray-50 dark:bg-gray-800/50" {...props} />,
  th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider" {...props} />,
  td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-text-secondary border-t border-gray-100 dark:border-gray-800" {...props} />,
  hr: ({node, ...props}) => <hr className="my-6 border-gray-200 dark:border-gray-800" {...props} />,
  strong: ({node, ...props}) => <strong className="font-bold text-text-primary bg-indigo-50/50 dark:bg-indigo-900/20 px-0.5 rounded" {...props} />,
};

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();

  // Refs for keyboard shortcuts
  const questionInputRef = useRef(null);
  const notesTextareaRef = useRef(null);

  // Get chat context from navigation state (when coming back from chat)
  const chatContext = location.state || null;
  const activeChatId = chatContext?.chatId || null;
  const activeChatTitle = chatContext?.chatTitle || null;
  const activeChatHistory = chatContext?.chatHistory || [];

  // State management
  const [studyNotes, setStudyNotes] = useState("");
  const [educationLevel, setEducationLevel] = useState("Secondary School");
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lastPrompt, setLastPrompt] = useState(null);

  // PDF-related state
  const [inputSource, setInputSource] = useState("text"); // 'text', 'pdf', or 'chat'
  const [extractedText, setExtractedText] = useState("");
  const [pdfMetadata, setPdfMetadata] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [showSourceWarning, setShowSourceWarning] = useState(false);

  // Flashcard state
  const [flashcards, setFlashcards] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  // When chat context is passed, set it as the active source
  useEffect(() => {
    if (activeChatHistory.length > 0) {
      setInputSource("chat");
      // Extract text content from chat history
      const chatContent = activeChatHistory
        .map(msg => msg.parts?.[0]?.text || '')
        .filter(text => text)
        .join('\n\n');
      setStudyNotes(chatContent);
    }
  }, [activeChatId]);

  // Setup voice recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setUserQuestion(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access.');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter to submit question
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (!isLoading && userQuestion.trim()) {
          handleAsk(e);
        }
      }
      
      // Ctrl+N for new session
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        navigate("/dashboard", { replace: true, state: null });
        setInputSource("text");
        setStudyNotes("");
        setUserQuestion("");
        setAiResponse(null);
      }
      
      // Escape to clear focused input
      if (e.key === "Escape") {
        if (document.activeElement === questionInputRef.current) {
          setUserQuestion("");
          questionInputRef.current.blur();
        } else if (document.activeElement === notesTextareaRef.current) {
          notesTextareaRef.current.blur();
        }
      }
      
      // Ctrl+/ to focus question input
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        questionInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, userQuestion, navigate]);

  const educationLevels = [
    "Elementary School",
    "Secondary School",
    "High School",
    "University/College",
    "Graduate Studies",
  ];

  // Get the notes to use based on input source
  const getNotesToUse = () => {
    if (inputSource === "chat" && activeChatHistory.length > 0) {
      return activeChatHistory
        .map(msg => msg.parts?.[0]?.text || '')
        .filter(text => text)
        .join('\n\n');
    }
    if (inputSource === "pdf" && extractedText) {
      return extractedText;
    }
    return studyNotes;
  };

  // Handle PDF text extraction
  const handlePdfTextExtracted = (text, metadata) => {
    setExtractedText(text);
    setPdfMetadata(metadata);
    setPdfError(null);
    setInputSource("pdf");
    
    // Check if user also has typed notes
    if (studyNotes.trim()) {
      setShowSourceWarning(true);
    }
  };

  // Handle PDF error
  const handlePdfError = (errorMessage) => {
    setPdfError(errorMessage);
  };

  // Handle PDF clear
  const handlePdfClear = () => {
    setExtractedText("");
    setPdfMetadata(null);
    setPdfError(null);
    if (studyNotes.trim()) {
      setInputSource("text");
    }
    setShowSourceWarning(false);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setInputSource(tab);
    setShowSourceWarning(false);
  };

  // Mutation for creating a new chat
  const chatMutation = useMutation({
    mutationFn: async (text) => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.text());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  // Copy response to clipboard
  const handleCopy = async () => {
    if (!aiResponse) return;
    try {
      await navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Download response as file
  const handleDownload = (format = "txt") => {
    if (!aiResponse) return;
    
    const date = new Date().toLocaleDateString();
    const question = userQuestion || "Study Response";
    
    let content, mimeType, extension;
    
    if (format === "md") {
      content = `# 📚 AI Study Assistant Response\n\n`;
      content += `> Generated on ${date}\n\n`;
      content += `## Question\n${userQuestion || "N/A"}\n\n`;
      content += `## Education Level\n${educationLevel}\n\n`;
      content += `---\n\n`;
      content += `## Response\n\n${aiResponse}`;
      mimeType = "text/markdown;charset=utf-8";
      extension = "md";
    } else {
      content = `📚 AI Study Assistant Response\n`;
      content += `${"=".repeat(50)}\n`;
      content += `Date: ${date}\n`;
      content += `Education Level: ${educationLevel}\n`;
      content += `Question: ${userQuestion || "N/A"}\n`;
      content += `${"=".repeat(50)}\n\n`;
      content += `Response:\n${"-".repeat(30)}\n${aiResponse}`;
      mimeType = "text/plain;charset=utf-8";
      extension = "txt";
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study_response_${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Regenerate the last response
  const handleRegenerate = async () => {
    if (!lastPrompt) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await callAI(lastPrompt);
      setAiResponse(response);
    } catch (err) {
      setError(err.message || "Failed to regenerate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to call AI API
  const callAI = async (prompt) => {
    const token = await getToken();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chat/generate`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: prompt,
          history: [],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate response");
    }

    const result = await response.json();
    return result.response;
  };

  // Handle Ask button
  const handleAsk = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setIsLoading(true);
    setError(null);

    const notesToUse = getNotesToUse();
    
    // Enhanced prompt with strong prompt engineering principles
    const prompt = `## Context
**Student Level:** ${educationLevel}
**Question:** ${userQuestion}
${notesToUse ? `\n**Study Material Provided:**\n${notesToUse}` : ""}

## Task
Provide a comprehensive educational response tailored to a ${educationLevel} student.

## Required Output Structure

### 📚 Topic Overview
Briefly state the main topic and why it matters.

### 💡 Explanation
Provide a clear, detailed explanation that:
- Uses language appropriate for ${educationLevel} level
- Includes relevant examples and analogies
- Breaks down complex concepts step-by-step
- Connects to real-world applications

### 🔑 Key Takeaways
List 3-5 essential points to remember.

### ❓ Practice Questions
Create 5 questions to test understanding:
1. [Recall question - basic facts]
2. [Understanding question - explain concepts]
3. [Application question - use knowledge]
4. [Analysis question - compare/contrast]
5. [Synthesis question - creative thinking]

### 📖 Study Tips
Provide 2-3 specific suggestions for mastering this topic.`;

    try {
      setLastPrompt(prompt);
      const response = await callAI(prompt);
      setAiResponse(response);
    } catch (err) {
      setError(err.message || "Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Summarize button
  const handleSummarize = async () => {
    const notesToUse = getNotesToUse();
    if (!notesToUse.trim()) {
      setError("Please enter study notes or upload a PDF to summarize.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Enhanced summarization prompt
    const prompt = `## Task: Create a Comprehensive Study Summary

**Target Audience:** ${educationLevel} student
**Content Length:** ${notesToUse.length} characters

## Source Material:
${notesToUse}

## Required Output Structure

### 📋 Executive Summary
Write a 2-3 sentence overview capturing the essence of the material.

### 🎯 Main Concepts
Identify and explain the 3-5 most important concepts:
1. **[Concept 1]:** Brief explanation with significance
2. **[Concept 2]:** Brief explanation with significance
3. **[Concept 3]:** Brief explanation with significance
(Continue as needed)

### 🔗 Key Relationships
Explain how the main concepts connect to each other.

### 📝 Quick Reference Notes
Bullet points of facts, formulas, or definitions worth memorizing.

### 💡 Memory Aids
Provide mnemonics, acronyms, or visualization techniques to remember key points.

### ✅ Understanding Check
3 quick self-test questions to verify comprehension.

Keep language appropriate for ${educationLevel} level. Be thorough but concise.`;

    try {
      setLastPrompt(prompt);
      const response = await callAI(prompt);
      setAiResponse(response);
    } catch (err) {
      setError(err.message || "Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Generate Quiz button
  const handleGenerateQuiz = async () => {
    const notesToUse = getNotesToUse();
    if (!notesToUse.trim() && !aiResponse) {
      setError("Please enter study notes, upload a PDF, or ask a question first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const content = notesToUse || aiResponse;
    
    // Enhanced quiz generation prompt with Bloom's taxonomy
    const prompt = `## Task: Create an Educational Assessment Quiz

**Target Level:** ${educationLevel}
**Question Types:** Multiple choice with varying difficulty

## Source Content:
${content}

## Quiz Design Requirements

Create a **10-question quiz** that tests different cognitive levels (Bloom's Taxonomy):
- 2 questions: **Remember** (recall facts, terms, concepts)
- 2 questions: **Understand** (explain ideas, interpret meaning)
- 2 questions: **Apply** (use knowledge in new situations)
- 2 questions: **Analyze** (examine relationships, compare/contrast)
- 2 questions: **Evaluate/Create** (judge, justify, design)

## Required Output Format

### 📝 Quiz: [Topic Name]
**Difficulty:** Appropriate for ${educationLevel}
**Time Estimate:** 10-15 minutes

---

**Question 1** 🔵 [Remember]
[Clear, unambiguous question text]

A) [Plausible option]
B) [Plausible option]
C) [Plausible option]
D) [Plausible option]

---

[Continue for all 10 questions, marking cognitive level with emoji:
🔵 Remember | 🟢 Understand | 🟡 Apply | 🟠 Analyze | 🔴 Evaluate/Create]

---

### 🔑 Answer Key with Explanations

1. **[Letter]** - [Detailed explanation of why this is correct and why others are wrong]
2. **[Letter]** - [Explanation]
[Continue for all 10]

### 📊 Self-Assessment Guide
- 9-10 correct: Excellent mastery! Ready for advanced topics.
- 7-8 correct: Good understanding. Review highlighted areas.
- 5-6 correct: Developing. Focus on weak areas identified.
- Below 5: Needs review. Revisit the source material.

Make questions challenging but fair. Avoid trick questions. All distractors should be plausible.`;

    try {
      setLastPrompt(prompt);
      const response = await callAI(prompt);
      setAiResponse(response);
    } catch (err) {
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Generate Flashcards
  const handleGenerateFlashcards = async () => {
    const notesToUse = getNotesToUse();
    if (!notesToUse.trim() && !aiResponse) {
      setError("Please enter study notes, upload a PDF, or ask a question first.");
      return;
    }

    setIsGeneratingFlashcards(true);
    setError(null);

    const content = notesToUse || aiResponse;

    const prompt = `## Task: Generate Study Flashcards

**Target Level:** ${educationLevel}

## Source Content:
${content}

## Instructions
Create 10-15 flashcards from the content above. Each flashcard should have a clear question/prompt on the front and a concise answer on the back.

## CRITICAL: Output Format
You MUST respond with ONLY a valid JSON array. Do not include any text before or after the JSON.
Do not include markdown code blocks or any explanation.
Just output the raw JSON array.

The format must be exactly:
[{"front":"Question 1?","back":"Answer 1"},{"front":"Question 2?","back":"Answer 2"}]

Rules for the flashcards:
- Front: Clear, specific question or prompt (keep under 100 characters if possible)
- Back: Concise, accurate answer (key facts only, under 200 characters)
- Cover the most important concepts
- Progress from basic to advanced
- Use simple, clear language appropriate for ${educationLevel}

Remember: Output ONLY the JSON array, nothing else.`;

    try {
      const response = await callAI(prompt);
      
      // Parse the flashcards from response
      let cards;
      try {
        // Try to find JSON array in the response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          cards = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found");
        }
      } catch (parseError) {
        console.error("Failed to parse flashcards:", parseError);
        setError("Failed to parse flashcards. Please try again.");
        setIsGeneratingFlashcards(false);
        return;
      }

      if (Array.isArray(cards) && cards.length > 0) {
        setFlashcards(cards);
        setShowFlashcards(true);
      } else {
        setError("No flashcards generated. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to generate flashcards. Please try again.");
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  // Handle starting a new chat or continuing existing chat
  const handleStartChat = () => {
    // If we have an active chat context, continue that chat
    if (activeChatId) {
      navigate(`/dashboard/chats/${activeChatId}`);
      return;
    }
    // Otherwise create a new chat
    const notesToUse = getNotesToUse();
    const chatTopic = notesToUse || userQuestion || "New Study Session";
    chatMutation.mutate(chatTopic.substring(0, 100));
  };

  // Clear chat context and start fresh
  const handleClearContext = () => {
    navigate("/dashboard", { replace: true, state: null });
    setInputSource("text");
    setStudyNotes("");
    setAiResponse(null);
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      setError("Voice input is not supported in your browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setUserQuestion("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-start p-6 overflow-y-auto bg-surface animate-fade-in transition-colors duration-300 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
      <div className="flex flex-col gap-6 max-w-[860px] w-full mx-auto pb-10">
        {/* Active Chat Context Banner */}
        {activeChatId && (
          <div className="flex items-center justify-between gap-4 p-4 px-5 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl animate-fade-in-down shadow-sm">
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">💬</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-[15px] text-text-primary">Active Session: {activeChatTitle || "Study Session"}</span>
                <span className="text-[13px] text-text-muted">
                  {activeChatHistory.length} messages • Summarize, quiz, or continue chatting
                </span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button 
                className="py-2 px-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 shadow-md shadow-indigo-500/20 hover:-translate-y-px hover:shadow-lg hover:shadow-indigo-500/30 active:translate-y-0 active:shadow-sm"
                onClick={handleStartChat}
                aria-label="Continue this chat session"
              >
                💬 Continue Chat
              </button>
              <button 
                className="py-2 px-3.5 bg-transparent text-text-muted border border-gray-200 dark:border-gray-700 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text-primary"
                onClick={handleClearContext}
                aria-label="Start a fresh session"
              >
                ✕ New Session
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5 bg-surface p-6 rounded-[20px] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up">
          {/* Study Notes Input with Tabs */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-[13px] text-text-secondary tracking-tight">Study Notes:</label>
            
            {/* Tabs */}
            <div className="flex gap-1.5 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-1">
              {activeChatId && (
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 ${inputSource === "chat" ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-text-muted hover:text-text-primary hover:bg-gray-200/50 dark:hover:bg-gray-700/30"}`}
                  onClick={() => handleTabChange("chat")}
                >
                  💬 From Chat ({activeChatHistory.length} msgs)
                </button>
              )}
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 ${inputSource === "text" ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-text-muted hover:text-text-primary hover:bg-gray-200/50 dark:hover:bg-gray-700/30"}`}
                onClick={() => handleTabChange("text")}
              >
                ✏️ Type/Paste Notes
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 ${inputSource === "pdf" ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-text-muted hover:text-text-primary hover:bg-gray-200/50 dark:hover:bg-gray-700/30"}`}
                onClick={() => handleTabChange("pdf")}
              >
                 📄 Upload PDF
              </button>
            </div>

            {/* Source Warning */}
            {showSourceWarning && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs text-amber-700 dark:text-amber-400 animate-fade-in">
                <span className="text-base">⚠️</span>
                <p className="flex-1">You have both PDF and typed notes. Currently using: <strong>{inputSource === "pdf" ? "PDF" : "Typed notes"}</strong></p>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-amber-900 dark:hover:text-amber-200 transition-colors">
                    <input
                      type="radio"
                      name="inputSource"
                      value="text"
                      checked={inputSource === "text"}
                      onChange={() => setInputSource("text")}
                      className="accent-amber-500"
                    />
                    Use typed notes
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-amber-900 dark:hover:text-amber-200 transition-colors">
                    <input
                      type="radio"
                      name="inputSource"
                      value="pdf"
                      checked={inputSource === "pdf"}
                      onChange={() => setInputSource("pdf")}
                      className="accent-amber-500"
                    />
                    Use PDF content
                  </label>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <div className="mt-1">
              {inputSource === "chat" ? (
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center px-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-text-secondary">
                    <span>📝 Chat Content Preview</span>
                    <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px]">
                      {activeChatHistory.length} messages
                    </span>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    {activeChatHistory.slice(0, 6).map((msg, i) => (
                      <div key={i} className={`flex gap-2 text-[13px] leading-relaxed ${msg.role === "user" ? "text-indigo-600 dark:text-indigo-400" : "text-text-secondary"}`}>
                        <span className="font-semibold flex-shrink-0 w-8">{msg.role === "user" ? "You" : "AI"}:</span>
                        <span className="text-text-muted">
                          {(msg.parts?.[0]?.text || '').substring(0, 150)}
                          {(msg.parts?.[0]?.text || '').length > 150 && '...'}
                        </span>
                      </div>
                    ))}
                    {activeChatHistory.length > 6 && (
                      <div className="text-center text-xs text-text-muted py-2 italic bg-black/5 dark:bg-white/5 rounded-lg">
                        +{activeChatHistory.length - 6} more messages
                      </div>
                    )}
                  </div>
                </div>
              ) : inputSource === "text" ? (
                <textarea
                  id="studyNotes"
                  ref={notesTextareaRef}
                  value={studyNotes}
                  onChange={(e) => {
                    setStudyNotes(e.target.value);
                    if (extractedText && e.target.value.trim()) {
                      setShowSourceWarning(true);
                    }
                  }}
                  placeholder="Paste your notes or enter a study topic here..."
                  rows={6}
                  className="w-full p-4 border border-gray-200 dark:border-gray-800 rounded-xl text-[15px] bg-transparent text-text-primary focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[160px] resize-y placeholder:text-text-muted"
                />
              ) : (
                <PDFUpload
                  onTextExtracted={handlePdfTextExtracted}
                  onError={handlePdfError}
                  onClear={handlePdfClear}
                  disabled={isLoading}
                />
              )}
            </div>

            {/* PDF metadata indicator when on text tab but PDF is loaded */}
            {inputSource === "text" && pdfMetadata && (
              <div className="flex items-center justify-between text-xs p-2.5 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30 animate-fade-in">
                <span>📑 PDF loaded: <span className="font-semibold">{pdfMetadata.fileName}</span></span>
                <button
                  type="button"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                  onClick={() => setInputSource("pdf")}
                >
                  View PDF
                </button>
              </div>
            )}
          </div>

          {/* Education Level Selector */}
          <div className="flex flex-col gap-2">
            <label htmlFor="educationLevel" className="font-semibold text-[13px] text-text-secondary tracking-tight">Select Education Level:</label>
            <div className="relative">
              <select
                id="educationLevel"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl text-[15px] bg-transparent text-text-primary cursor-pointer transition-all focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 appearance-none bg-no-repeat pr-10"
              >
                {educationLevels.map((level) => (
                  <option key={level} value={level} className="bg-surface text-text-primary">
                    {level}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Question Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="question" className="font-semibold text-[13px] text-text-secondary tracking-tight">Ask a Question:</label>
            <div className="flex gap-3">
              <input
                type="text"
                id="question"
                ref={questionInputRef}
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder={isListening ? "🎤 Listening..." : 'e.g., "Explain photosynthesis"'}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAsk(e)}
                aria-describedby="questionHint"
                autoComplete="off"
                className={`flex-1 p-3.5 border rounded-xl text-[15px] bg-transparent text-text-primary focus:outline-none focus:ring-4 transition-all disabled:opacity-50 ${isListening ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 animate-pulse" : "border-gray-200 dark:border-gray-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 placeholder:text-text-muted"}`}
              />
              {voiceSupported && (
                <button
                  className={`p-3.5 border rounded-xl text-lg cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center w-[52px] ${isListening ? "bg-red-50 dark:bg-red-900/10 border-red-500 text-red-500 animate-pulse" : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-800"}`}
                  onClick={toggleVoiceInput}
                  type="button"
                  title={isListening ? "Stop listening" : "Voice input"}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  {isListening ? "🔴" : "🎤"}
                </button>
              )}
              <button
                className="py-2.5 px-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all shadow-md shadow-indigo-500/20 hover:-translate-y-px hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:translate-y-0 active:shadow-sm w-24"
                onClick={handleAsk}
                disabled={isLoading || !userQuestion.trim()}
                aria-label={isLoading ? "Generating answer..." : "Ask your question"}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : "Ask"}
              </button>
            </div>
            <span id="questionHint" className="text-xs text-text-muted mt-1 px-1">
              Press Enter or Ctrl+Enter to ask • 🎤 for voice • Ctrl+N for new session
            </span>
          </div>
        </div>

        {/* AI Response Section */}
        <div className="flex flex-col gap-3 bg-surface p-6 rounded-[20px] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up [animation-delay:0.2s]" aria-live="polite" aria-atomic="true">
          <div className="flex items-center justify-between gap-3">
            <label className="font-semibold text-[13px] text-text-secondary tracking-tight">AI Response:</label>
            {aiResponse && (
              <div className="flex gap-2">
                <button 
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg cursor-pointer transition-all disabled:opacity-50 ${copied ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-600' : 'bg-surface border-gray-200 dark:border-gray-800 text-text-secondary hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600'}`}
                  onClick={handleCopy}
                  title="Copy response to clipboard"
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-lg bg-surface text-text-secondary cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 disabled:opacity-50"
                  onClick={() => handleDownload("txt")}
                  title="Download as TXT"
                >
                  📄 TXT
                </button>
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-lg bg-surface text-text-secondary cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 disabled:opacity-50"
                  onClick={() => handleDownload("md")}
                  title="Download as Markdown"
                >
                  📝 MD
                </button>
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-lg bg-surface text-text-secondary cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 disabled:opacity-50"
                  onClick={handleRegenerate}
                  disabled={isLoading || !lastPrompt}
                  title="Regenerate response"
                >
                  🔄 Regenerate
                </button>
              </div>
            )}
          </div>
          <div className="min-h-[300px] max-h-[520px] overflow-y-auto p-6 bg-surface rounded-[18px] border border-gray-200 dark:border-gray-800 shadow-inner transition-colors duration-300 scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-900 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[220px] gap-4.5 text-text-muted text-sm animate-fade-in" role="status">
                <span className="w-9 h-9 border-[3px] border-indigo-500/15 border-t-indigo-500 rounded-full animate-spin" aria-hidden="true"></span>
                <p className="animate-pulse">Generating response...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3.5 text-red-500 p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 text-sm text-center animate-fade-in" role="alert">
                <p>⚠️ {error}</p>
                <button 
                  className="px-4 py-2 bg-surface border border-red-200 dark:border-red-800 rounded-lg text-red-500 text-xs font-medium cursor-pointer transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:-translate-y-px hover:shadow-sm" 
                  onClick={() => setError(null)}
                  aria-label="Clear error message"
                >
                  Dismiss
                </button>
              </div>
            ) : aiResponse ? (
              <div className="text-[15px] leading-relaxed text-text-primary animate-fade-in-up">
                <Markdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{aiResponse}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[220px] text-center text-text-muted text-[15px] gap-3">
                <div className="text-4xl mb-2 animate-float">✨</div>
                <p>Your AI-generated response will appear here...</p>
                <p className="text-[13px] opacity-70 max-w-xs leading-normal">
                  Enter your study notes (type or upload PDF) and ask a question to get started!
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2" role="group" aria-label="Study tools">
            <button
              className="py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary rounded-xl text-[13px] font-semibold cursor-pointer transition-all hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSummarize}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label="Summarize your study notes"
            >
              📝 Summarize{activeChatId ? " Chat" : ""}
            </button>
            <button
              className="py-3 px-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0 rounded-xl text-[13px] font-semibold cursor-pointer transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label="Generate quiz from your notes"
            >
              📋 Generate Quiz
            </button>
            <button
              className="py-3 px-4 bg-gradient-to-br from-teal-500 to-emerald-500 text-white border-0 rounded-xl text-[13px] font-semibold cursor-pointer transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateFlashcards}
              disabled={isLoading || isGeneratingFlashcards}
              aria-busy={isGeneratingFlashcards}
              aria-label="Generate flashcards from your notes"
            >
              {isGeneratingFlashcards ? "⏳ Generating..." : "🗂️ Flashcards"}
            </button>
            <button
              className="py-3 px-4 bg-transparent border border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-xl text-[13px] font-semibold cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:shadow-sm hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleStartChat}
              disabled={isLoading || chatMutation.isPending}
              aria-busy={chatMutation.isPending}
              aria-label={activeChatId ? "Continue this chat session" : "Start an interactive chat session"}
            >
              {chatMutation.isPending ? "Starting..." : activeChatId ? "💬 Continue Chat" : "💬 Start Chat Session"}
            </button>
          </div>
        </div>
      </div>

      {/* Flashcards Modal */}
      {showFlashcards && flashcards.length > 0 && (
        <Flashcards 
          cards={flashcards}
          onClose={() => setShowFlashcards(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
