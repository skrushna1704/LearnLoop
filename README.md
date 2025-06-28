# LearnLoop - Peer-to-Peer Skill Exchange Platform

LearnLoop is a modern MERN-based platform that enables users to exchange skills with each other in a barter system. Teach what you know, learn what you want—all without monetary transactions.

## 🚀 Features
- Skill Exchange (barter system)
- Real-Time Messaging/Video Calling (Socket.IO)
- AI-Powered Assistant (OpenAI)
- Community & Progress Tracking
- Google OAuth & Email/Password Auth

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
- **Authentication:** Email/password & Google OAuth
- **Skill Management:** Offer & request skills
- **Exchanges:** Propose, track, and complete skill exchanges
- **Messaging:** Real-time chat between users
- **AI Assistant:** Chatbot for help and suggestions
- **Community:** Browse, connect, and learn

## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

## 📄 License
MIT 
