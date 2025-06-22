# LearnLoop - Peer-to-Peer Skill Exchange Platform

Welcome to LearnLoop, a modern platform that enables users to exchange skills with each other in a barter system. Teach what you know, learn what you want—all without monetary transactions. This project is a monorepo containing both the Next.js frontend and the Node.js/Express backend.

## 🚀 Key Features

- **Skill Exchange**: A true barter system for knowledge.
- **Real-Time Messaging**: In-app chat for seamless communication between users.
- **AI-Powered Assistant**: An integrated chatbot to help users navigate the platform.
- **Community-Driven**: Connect with like-minded learners and teachers.
- **Progress Tracking**: Monitor your learning and teaching journey.

## 🛠️ Tech Stack

| Area      | Technology                                    |
|-----------|-----------------------------------------------|
| **Frontend**  | Next.js, React, TypeScript, Tailwind CSS, Zustand |
| **Backend**   | Node.js, Express, TypeScript, MongoDB, Mongoose |
| **Real-Time** | Socket.IO                                     |
| **Database**  | MongoDB Atlas                                 |
| **AI**        | OpenAI API                                    |

---

## 📦 Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
*   [Git](https://git-scm.com/)
*   A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database.

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Set Up the Backend**

    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```

    *   Install dependencies:
        ```bash
        npm install
        ```

    *   Create the environment file. An example file (`.env.example`) is provided. Copy it to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```

    *   Open `backend/.env` and fill in your credentials. It should look like this:
        ```env
        # MongoDB Connection String from your MongoDB Atlas dashboard
        MONGODB_URI="mongodb+srv://..."

        # Port for the backend server
        PORT=5050

        # A long, random, and secret string for JWT
        JWT_SECRET="your-super-secret-jwt-key"

        # Your OpenAI API Key
        OPENAI_API_KEY="sk-..."

        # Environment mode
        NODE_ENV="development"
        ```

3.  **Set Up the Frontend**

    *   Navigate to the frontend directory (from the root):
        ```bash
        cd skillswap
        ```

    *   Install dependencies:
        ```bash
        npm install
        ```

    *   Create the environment file. An example file (`.env.local.example`) is provided. Copy it to a new file named `.env.local`:
        ```bash
        cp .env.local.example .env.local
        ```

    *   Your `skillswap/.env.local` file should point to your backend API URL:
        ```env
        # --- Frontend Environment Variables ---
        NEXT_PUBLIC_API_URL="http://localhost:5050"
        ```

### Running the Application

You need to run both the backend and frontend servers simultaneously in separate terminal windows.

1.  **Start the Backend Server**
    *   In a terminal, navigate to the `backend` directory and run:
        ```bash
        npm run dev
        ```
    *   The backend server should now be running on `http://localhost:5050` (or the port you specified).

2.  **Start the Frontend Server**
    *   In a **new** terminal, navigate to the `skillswap` directory and run:
        ```bash
        npm run dev
        ```
    *   The frontend development server should now be running on `http://localhost:3000`.

3.  **Access the Application**
    *   Open your browser and go to `http://localhost:3000`. You should see the LearnLoop homepage. Congratulations, you're all set up!

---

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change. 