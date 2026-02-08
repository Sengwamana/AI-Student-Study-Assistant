# AI Study Assistant Project Documentation

## Overview
This project is a fullstack AI-powered study assistant web application. It consists of a React frontend (Vite) and a Node.js/Express backend. Key features include chat-based study sessions, quiz generator, flashcards, bookmarks, study goals, note-taking, streak counter, and more.

## Architecture
- **Frontend:** React 18, Vite, CSS modules
- **Backend:** Node.js, Express
- **Database:** MongoDB (via models in backend/models)
- **API:** RESTful endpoints for chat, user sessions, and study features

## Folder Structure
```
backend/
  index.js
  package.json
  models/
    chat.js
    userChats.js
client/
  index.html
  package.json
  vite.config.js
  public/
    pdf.worker.min.mjs
  src/
    App.jsx
    index.css
    main.jsx
    components/
      bookmarks/
      chatList/
      flashcards/
      newPrompt/
      pdfUpload/
      progressDashboard/
      quizGenerator/
      studyGoals/
      studyNotes/
      studyTimer/
      upload/
    context/
    layouts/
    lib/
    routes/
```

## Features
- **Chat-based Study Sessions**: AI-powered Q&A and note-taking
- **Quiz Generator**: Create quizzes from study material
- **Flashcards**: Generate and review flashcards
- **Bookmarks**: Save important chats and notes
- **Study Goals**: Set and track learning objectives
- **Progress Dashboard**: Visualize study progress
- **Streak Counter**: Track daily study streaks
- **Response Rating**: Rate AI responses
- **PDF Upload**: Import study material

## Setup Instructions
1. Install dependencies in both backend and client folders:
   ```sh
   cd backend && npm install
   cd ../client && npm install
   ```
2. Configure environment variables in backend/.env (API keys, DB URI)
3. Start backend server:
   ```sh
   cd backend && node index.js
   ```
4. Start frontend dev server:
   ```sh
   cd client && npm run dev
   ```

## Deployment Guide
- **Backend:** Deploy to Render.com or Railway.app (free tier)
- **Frontend:** Deploy to Vercel.com or Netlify.com (free tier)
- **Database:** Use MongoDB Atlas (free tier)

## API Endpoints
- `/api/userchats` - Get user chats
- `/api/chats/:id` - Get, update, or delete chat
- `/api/chats/:id/title` - Rename chat

## Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret for authentication
- `VITE_API_URL` (frontend) - Backend API URL

## How to Contribute
- Fork the repository
- Create a feature branch
- Commit changes and open a pull request

## License
MIT

## Contact
For support, open an issue on GitHub or contact the maintainer.

---
*This documentation was auto-generated on December 22, 2025.*
