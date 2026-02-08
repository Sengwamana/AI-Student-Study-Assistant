import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import NodeCache from "node-cache";
import multer from "multer";
import { createRequire } from "module";

// pdf-parse doesn't support ESM, use createRequire workaround
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment flags
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";
const MOCK_AI = process.env.MOCK_AI === "true";

// System instruction for the AI Study Assistant (Strong Prompt Engineering)
const SYSTEM_INSTRUCTION = `You are an expert AI Study Assistant designed to help students learn effectively. Your core mission is to make complex topics accessible and engaging.

## Your Capabilities:
- Explain concepts at the appropriate education level (Elementary to Graduate)
- Create practice quizzes and exercises
- Summarize study materials into key points
- Answer questions with depth and clarity
- Provide step-by-step problem solving

## Response Guidelines:

### Structure & Formatting:
- Use clear headings with ** for emphasis
- Break down complex information into numbered lists or bullet points
- Include relevant examples, analogies, and real-world applications
- Use markdown formatting for readability

### CRITICAL - NO LATEX OR DOLLAR SIGNS:
NEVER use LaTeX, dollar signs ($), or any math markup. This is absolutely essential.
❌ WRONG: $\\sigma$, $F = ma$, $\\sum F_x = 0$, $E = mc^2$
✅ CORRECT: σ, F = ma, ΣFx = 0, E = mc²

Always use plain text and Unicode symbols:
- Greek letters: α β γ δ ε θ λ μ ρ σ τ φ ω Σ Δ Ω Φ
- Math operators: × ÷ ± ≠ ≤ ≥ ≈ ∞ √ ∑ ∫ ∂ π
- Superscripts: ⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁿ
- Subscripts: ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ₓ ᵢ ₙ
- Arrows: → ← ↔ ↑ ↓ ⇒ ⇐ ⇔
- Other: ° • ★ ✓ ✗ ½ ¼ ¾

Examples of correct formatting:
- Force equation: F = m × a
- Stress formula: σ = F/A
- Energy: E = mc²
- Sum of forces: ΣF = 0
- Pressure: P = ρgh
- Quadratic: ax² + bx + c = 0

### TABLES - Simple Format Only:
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |

Rules for tables:
- Use simple dashes only (no colons like :---)
- Keep tables small (max 4-5 columns)
- Prefer bullet lists over complex tables

### Teaching Approach:
- Start with the big picture, then dive into details
- Use the Feynman technique: explain as if teaching someone new
- Connect new concepts to familiar ideas
- Anticipate follow-up questions and address them proactively

### Quality Standards:
- Be comprehensive but concise - no fluff
- Provide accurate, up-to-date information
- If uncertain, acknowledge limitations
- Include memory aids, mnemonics when helpful
- End with actionable next steps or practice suggestions

### Tone:
- Encouraging and supportive
- Patient and clear
- Enthusiastic about learning
- Professional yet approachable

Remember: Your goal is not just to answer, but to ensure the student truly understands and can apply the knowledge.`;

// Initialize Google Generative AI client (only if not mocking)
let genAI = null;
let geminiModel = null;

if (!MOCK_AI && process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Safety settings to prevent harmful content
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  geminiModel = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
    safetySettings,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
    },
  });
}

// Retry helper with exponential backoff for 429 errors
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err.status === 429 || err.message?.includes("429") || err.message?.includes("quota");
      if (!is429 || attempt === maxRetries - 1) throw err;
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`Rate limited. Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Truncate history to reduce token usage (keep last 10 messages)
const truncateHistory = (history, maxMessages = 10) => {
  if (history.length <= maxMessages) return history;
  return history.slice(-maxMessages);
};

// Initialize cache (TTL: 1 hour, check period: 10 minutes)
const responseCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Rate limiter for AI endpoint (15 requests per minute per user)
// Note: Uses req.auth which is set by clerkMiddleware
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 requests per minute
  message: { error: "Too many requests. Please wait a moment before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use userId from Clerk auth for rate limiting, fallback to IP
    // req.auth() is populated by clerkMiddleware (called as function)
    const auth = req.auth?.();
    return auth?.userId || ipKeyGenerator(req);
  },
  skip: () => MOCK_AI, // Skip rate limiting in mock mode
});

// CORS configuration - allow both www and non-www domains
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://smartlearntoday.tech',
  'https://www.smartlearntoday.tech',
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Increase JSON body size limit for large PDF text content
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Add Clerk middleware BEFORE routes that need auth
app.use(clerkMiddleware());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Middleware to require authentication
const requireAuth = async (req, res, next) => {
  // req.auth() is populated by clerkMiddleware (called as function)
  const auth = req.auth?.();
  if (!auth?.userId) {
    return res.status(401).json({ error: "Unauthenticated" });
  }
  req.userId = auth.userId;
  next();
};

// Configure multer for PDF uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// PDF Text Extraction Endpoint (fallback for client-side issues)
app.post("/api/extract-pdf", requireAuth, upload.single("pdf"), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No PDF file provided",
      });
    }

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "No text found in PDF. This might be a scanned document or image-based PDF.",
      });
    }

    const wordCount = pdfData.text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const extractionTime = Date.now() - startTime;

    res.json({
      success: true,
      text: pdfData.text.trim(),
      metadata: {
        pages: pdfData.numpages,
        wordCount: wordCount,
        charCount: pdfData.text.length,
        fileSize: formatFileSize(req.file.size),
        extractionTimeMs: extractionTime,
      },
    });
  } catch (err) {
    console.error("PDF extraction error:", err);
    
    if (err.message?.includes("Only PDF files")) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file only",
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Could not extract text from PDF. Please try another file or paste notes manually.",
    });
  }
});

// Handle multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size exceeds 10MB limit",
      });
    }
  }
  next(err);
});

// Generate a cache key from the conversation history
const generateCacheKey = (history, message) => {
  const historyStr = history.map(h => `${h.role}:${h.parts[0]?.text || ''}`).join('|');
  return `${historyStr}|user:${message}`.substring(0, 250); // Limit key length
};

// Mock AI response for development
const generateMockResponse = (message) => {
  const mockResponses = [
    `This is a mock response to: "${message.substring(0, 50)}..."`,
    "I'm a development mock response. Set MOCK_AI=false in .env to use real AI.",
    `Mock AI here! You said: "${message.substring(0, 30)}..." - In production, this would be a real Gemini response.`,
  ];
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

// AI Chat Generation Endpoint (Non-streaming - preferred for stability)
app.post("/api/chat/generate", requireAuth, aiRateLimiter, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Check cache first
    const cacheKey = generateCacheKey(history, message);
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse) {
      console.log("Cache hit for message");
      return res.json({ response: cachedResponse, cached: true });
    }

    let aiResponse;

    // Use mock response in development mode
    if (MOCK_AI) {
      console.log("Using mock AI response");
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
      aiResponse = generateMockResponse(message);
    } else if (!geminiModel) {
      return res.status(503).json({ error: "AI service not configured. Set GEMINI_API_KEY in environment." });
    } else {
      // Truncate history to save tokens (free tier optimization)
      const truncatedHistory = truncateHistory(history);
      
      // Use retry with backoff for 429 errors
      aiResponse = await retryWithBackoff(async () => {
        const chat = geminiModel.startChat({
          history: truncatedHistory.map(({ role, parts }) => ({
            role: role === "model" ? "model" : "user",
            parts: [{ text: (parts?.[0]?.text || "").substring(0, 8000) }], // Allow longer context
          })),
        });

        // Use generateContent (non-streaming) for stability
        const result = await chat.sendMessage(message.substring(0, 8000)); // Allow longer input
        const response = await result.response;
        return response.text();
      });
    }

    if (!aiResponse) {
      throw new Error("Empty response from AI");
    }

    // Cache the response
    responseCache.set(cacheKey, aiResponse);

    res.json({ response: aiResponse, cached: false });
  } catch (err) {
    console.error("AI Generation Error:", err);
    
    // Handle specific Gemini errors
    if (err.message?.includes("quota") || err.status === 429) {
      return res.status(429).json({ 
        error: "AI service quota exceeded. Please try again later.",
        retryAfter: 60
      });
    }
    
    if (err.message?.includes("SAFETY")) {
      return res.status(400).json({ 
        error: "Your message was blocked by safety filters. Please rephrase your request." 
      });
    }
    
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

// Streaming AI Chat Generation Endpoint (optional, for real-time UX)
app.post("/api/chat/generate/stream", requireAuth, aiRateLimiter, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Use mock response in development mode
    if (MOCK_AI) {
      const mockResponse = generateMockResponse(message);
      // Simulate streaming by sending chunks
      const words = mockResponse.split(" ");
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    if (!geminiModel) {
      res.write(`data: ${JSON.stringify({ error: "AI service not configured" })}\n\n`);
      res.end();
      return;
    }

    // Start a chat session with truncated history
    const truncatedHistory = truncateHistory(history);
    const chat = geminiModel.startChat({
      history: truncatedHistory.map(({ role, parts }) => ({
        role: role === "model" ? "model" : "user",
        parts: [{ text: (parts?.[0]?.text || "").substring(0, 2000) }],
      })),
    });

    // Use streaming for real-time response
    const result = await chat.sendMessageStream(message.substring(0, 2000));

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("AI Streaming Error:", err);
    
    let errorMessage = "Failed to generate response";
    if (err.message?.includes("quota")) {
      errorMessage = "AI quota exceeded. Please try again later.";
    } else if (err.message?.includes("SAFETY")) {
      errorMessage = "Message blocked by safety filters.";
    }
    
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
});

app.post("/api/chats", requireAuth, async (req, res) => {
  const userId = req.userId;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }

    res.status(201).send(savedChat._id.toString());
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const userChats = await UserChats.find({ userId });

    // Get chats and sort by createdAt (most recent first)
    const chats = userChats[0]?.chats || [];
    const sortedChats = chats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).send(sortedChats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
});

app.get("/api/chats/:id", requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", requireAuth, async (req, res) => {
  const userId = req.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

// DELETE a chat
app.delete("/api/chats/:id", requireAuth, async (req, res) => {
  const userId = req.userId;
  const chatId = req.params.id;

  try {
    // Delete the chat document
    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });
    
    if (!deletedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Remove the chat reference from userChats
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting chat" });
  }
});

// RENAME a chat title
app.patch("/api/chats/:id/title", requireAuth, async (req, res) => {
  const userId = req.userId;
  const chatId = req.params.id;
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTitle = title.trim().substring(0, 100); // Max 100 chars

  try {
    // Update the title in userChats
    const result = await UserChats.updateOne(
      { userId, "chats._id": chatId },
      { $set: { "chats.$.title": newTitle } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json({ message: "Title updated successfully", title: newTitle });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating title" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).json({ error: "Unauthenticated" });
});

// PRODUCTION
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});
