# LearnLoop - Peer-to-Peer Skill Exchange Platform

LearnLoop is a modern MERN-based platform that enables users to exchange skills with each other in a barter system. Teach what you know, learn what you want—all without monetary transactions.

## 🚀 Features
- Skill Exchange (barter system)
- Real-Time Messaging/Video Calling (Socket.IO)
- AI-Powered Assistant (OpenAI)
- Community & Progress Tracking
- Google OAuth & Email/Password Auth
- **Profile Picture Upload & Management (Cloudinary)**
- **File Upload in Chat (Supabase Storage, all file types)**
- **Modern WhatsApp-style Attach Menu in Chat**
- **Email Verification System (with resend, secure tokens, and professional templates)**
- **Protected Routes & Onboarding Guards (email verification and profile completion required)**
- **Password Reset via Email**
- **Improved Auth Flow (OAuth users auto-verified, traditional users must verify email)**
- **Beautiful, branded transactional emails**

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose
- **Real-Time:** Socket.IO
- **AI:** OpenAI API

## 📦 Monorepo Structure
```
/ (root)
  /backend    # Express/Node.js API
  /frontend   # Next.js React app
```

## ⚙️ Environment Variables
See `backend/env.example` and `frontend/env.local.example` for all required variables.

## 🧑‍💻 Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Backend Setup
```bash
cd backend
cp env.example .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
cp env.local.example .env.local
npm install
npm run dev
```

### 4. Access the App
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5050](http://localhost:5050)

## 🌐 Features Overview
- **Authentication:** Email/password & Google OAuth (OAuth users auto-verified, email users must verify)
- **Email Verification:** Secure, branded, with resend and expiry
- **Password Reset:** Secure email-based reset
- **Profile Picture:** Upload, update, and remove (Cloudinary)
- **Skill Management:** Offer & request skills
- **Exchanges:** Propose, track, and complete skill exchanges
- **Messaging:** Real-time chat, file upload (all types), WhatsApp-style attach menu
- **AI Assistant:** Chatbot for help and suggestions
- **Community:** Browse, connect, and learn
- **Onboarding Guards:** Protect routes until email is verified and profile is complete

## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

## 📄 License
MIT 
