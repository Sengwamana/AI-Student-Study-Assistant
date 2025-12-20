import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PDFUpload from "../../components/pdfUpload/PDFUpload";
import Flashcards from "../../components/flashcards/Flashcards";

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
    <div className="dashboardPage">
      <div className="studyAssistant">
        {/* Active Chat Context Banner */}
        {activeChatId && (
          <div className="activeChatBanner">
            <div className="bannerContent">
              <span className="bannerIcon">💬</span>
              <div className="bannerText">
                <span className="bannerTitle">Active Session: {activeChatTitle || "Study Session"}</span>
                <span className="bannerSubtitle">
                  {activeChatHistory.length} messages • Summarize, quiz, or continue chatting
                </span>
              </div>
            </div>
            <div className="bannerActions">
              <button 
                className="continueButton" 
                onClick={handleStartChat}
                aria-label="Continue this chat session"
              >
                💬 Continue Chat
              </button>
              <button 
                className="clearButton" 
                onClick={handleClearContext}
                aria-label="Start a fresh session"
              >
                ✕ New Session
              </button>
            </div>
          </div>
        )}

        <div className="inputSection">
          {/* Study Notes Input with Tabs */}
          <div className="formGroup">
            <label>Study Notes:</label>
            
            {/* Tabs */}
            <div className="inputTabs">
              {activeChatId && (
                <button
                  type="button"
                  className={`tab ${inputSource === "chat" ? "active" : ""}`}
                  onClick={() => handleTabChange("chat")}
                >
                  💬 From Chat ({activeChatHistory.length} msgs)
                </button>
              )}
              <button
                type="button"
                className={`tab ${inputSource === "text" ? "active" : ""}`}
                onClick={() => handleTabChange("text")}
              >
                ✏️ Type/Paste Notes
              </button>
              <button
                type="button"
                className={`tab ${inputSource === "pdf" ? "active" : ""}`}
                onClick={() => handleTabChange("pdf")}
              >
                📄 Upload PDF
              </button>
            </div>

            {/* Source Warning */}
            {showSourceWarning && (
              <div className="sourceWarning">
                <span className="warningIcon">⚠️</span>
                <p>You have both PDF and typed notes. Currently using: <strong>{inputSource === "pdf" ? "PDF" : "Typed notes"}</strong></p>
                <div className="sourceOptions">
                  <label>
                    <input
                      type="radio"
                      name="inputSource"
                      value="text"
                      checked={inputSource === "text"}
                      onChange={() => setInputSource("text")}
                    />
                    Use typed notes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="inputSource"
                      value="pdf"
                      checked={inputSource === "pdf"}
                      onChange={() => setInputSource("pdf")}
                    />
                    Use PDF content
                  </label>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <div className="tabContent">
              {inputSource === "chat" ? (
                <div className="chatPreview">
                  <div className="chatPreviewHeader">
                    <span>📝 Chat Content Preview</span>
                    <span className="msgCount">{activeChatHistory.length} messages</span>
                  </div>
                  <div className="chatPreviewContent">
                    {activeChatHistory.slice(0, 6).map((msg, i) => (
                      <div key={i} className={`previewMsg ${msg.role}`}>
                        <span className="msgRole">{msg.role === "user" ? "You" : "AI"}:</span>
                        <span className="msgText">
                          {(msg.parts?.[0]?.text || '').substring(0, 150)}
                          {(msg.parts?.[0]?.text || '').length > 150 && '...'}
                        </span>
                      </div>
                    ))}
                    {activeChatHistory.length > 6 && (
                      <div className="moreMessages">
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
              <div className="pdfLoadedIndicator">
                <span>📑 PDF loaded: {pdfMetadata.fileName}</span>
                <button
                  type="button"
                  className="switchToPdf"
                  onClick={() => setInputSource("pdf")}
                >
                  View PDF
                </button>
              </div>
            )}
          </div>

          {/* Education Level Selector */}
          <div className="formGroup">
            <label htmlFor="educationLevel">Select Education Level:</label>
            <select
              id="educationLevel"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
            >
              {educationLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Question Input */}
          <div className="formGroup">
            <label htmlFor="question">Ask a Question:</label>
            <div className="questionInput">
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
                className={isListening ? "listening" : ""}
              />
              {voiceSupported && (
                <button
                  className={`voiceButton ${isListening ? "listening" : ""}`}
                  onClick={toggleVoiceInput}
                  type="button"
                  title={isListening ? "Stop listening" : "Voice input"}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  {isListening ? "🔴" : "🎤"}
                </button>
              )}
              <button
                className="askButton"
                onClick={handleAsk}
                disabled={isLoading || !userQuestion.trim()}
                aria-label={isLoading ? "Generating answer..." : "Ask your question"}
              >
                {isLoading ? "..." : "Ask"}
              </button>
            </div>
            <span id="questionHint" className="inputHint">
              Press Enter or Ctrl+Enter to ask • 🎤 for voice • Ctrl+N for new session
            </span>
          </div>
        </div>

        {/* AI Response Section */}
        <div className="responseSection" aria-live="polite" aria-atomic="true">
          <div className="responseLabelRow">
            <label>AI Response:</label>
            {aiResponse && (
              <div className="responseActions">
                <button 
                  className={`responseActionBtn ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                  title="Copy response to clipboard"
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button 
                  className="responseActionBtn"
                  onClick={() => handleDownload("txt")}
                  title="Download as TXT"
                >
                  📄 TXT
                </button>
                <button 
                  className="responseActionBtn"
                  onClick={() => handleDownload("md")}
                  title="Download as Markdown"
                >
                  📝 MD
                </button>
                <button 
                  className="responseActionBtn"
                  onClick={handleRegenerate}
                  disabled={isLoading || !lastPrompt}
                  title="Regenerate response"
                >
                  🔄 Regenerate
                </button>
              </div>
            )}
          </div>
          <div className="responseBox">
            {isLoading ? (
              <div className="loading" role="status">
                <span className="spinner" aria-hidden="true"></span>
                <p>Generating response...</p>
              </div>
            ) : error ? (
              <div className="error" role="alert">
                <p>⚠️ {error}</p>
                <button 
                  className="retryButton" 
                  onClick={() => setError(null)}
                  aria-label="Clear error message"
                >
                  Dismiss
                </button>
              </div>
            ) : aiResponse ? (
              <div className="responseContent">
                <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown>
              </div>
            ) : (
              <div className="placeholder">
                <p>Your AI-generated response will appear here...</p>
                <p className="hint">
                  Enter your study notes (type or upload PDF) and ask a question to get started!
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="actionButtons" role="group" aria-label="Study tools">
            <button
              className="secondaryButton"
              onClick={handleSummarize}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label="Summarize your study notes"
            >
              📝 Summarize{activeChatId ? " Chat" : ""}
            </button>
            <button
              className="primaryButton"
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label="Generate quiz from your notes"
            >
              📋 Generate Quiz
            </button>
            <button
              className="flashcardButton"
              onClick={handleGenerateFlashcards}
              disabled={isLoading || isGeneratingFlashcards}
              aria-busy={isGeneratingFlashcards}
              aria-label="Generate flashcards from your notes"
            >
              {isGeneratingFlashcards ? "⏳ Generating..." : "🗂️ Flashcards"}
            </button>
            <button
              className="outlineButton"
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
