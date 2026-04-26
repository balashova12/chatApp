# Real-Time Chat App
**Note:** This app is currently running locally only and is not deployed.

A full-stack real-time messaging application built with React and Node.js.

## Features

- **Authentication** — Register, login, and email verification with a one-time code
- **Real-time messaging** — Instant chat powered by Socket.io
- **Private chats** — Start a conversation with any registered user
- **Profile settings** — Update your username and profile photo
- **Cloud image storage** — Avatars stored via Cloudinary

## Tech Stack

**Frontend**
- React + Vite
- React Router
- Axios
- Socket.io Client

**Backend**
- Node.js + Express
- PostgreSQL + Prisma ORM
- Socket.io
- JWT Authentication
- Resend (email)
- Cloudinary (image uploads)

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/balashova12/chatApp.git
cd chatapp
```

2. Set up the backend
```bash
cd server
npm install
```

3. Create a `.env` file in the `server/` folder:
```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the backend
```bash
npm run dev
```

6. Set up the frontend
```bash
cd ../client
npm install
npm run dev
```

7. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
chatapp/
├── client/          # React frontend
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # ChatList, ChatWindow
│       ├── context/     # Auth context
│       └── pages/       # Login, Register, Chat, Profile
└── server/          # Node.js backend
    └── src/
        ├── controllers/ # Auth, User, Chat, Message
        ├── middleware/  # JWT auth
        ├── routers/     # API routes
        ├── services/    # Email service
        └── lib/         # Prisma, Cloudinary
```
