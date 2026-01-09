# NotulensiPro - Full-Stack Meeting Notes Management System

A modern, full-stack Next.js application for managing meeting notes with MongoDB integration, user authentication, and hybrid storage support.

## 🚀 Features

- **User Authentication**: Secure login and registration system with JWT
- **MongoDB Integration**: Store notes in MongoDB with automatic backup to JSON files
- **Hybrid Storage**: Support for MongoDB, JSON, or both storage modes
- **Rich Text Editor**: Create beautifully formatted meeting notes
- **User Management**: Each user has their own secure workspace
- **Laravel-style Configuration**: Centralized config management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Fast and responsive user interface

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or a MongoDB connection string)

## 🛠️ Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Copy the example environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:
```env
# App Configuration
APP_NAME=Notulensi Pro
APP_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/notulensi_pro

# Session Secret (change this to a random string in production)
SESSION_SECRET=your-secret-key-change-this-in-production

# Storage Mode: 'mongodb' or 'json' or 'both'
STORAGE_MODE=both
```

## 🎯 Getting Started

1. **Start MongoDB** (if running locally):
```bash
mongod
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser** and navigate to:
```
http://localhost:3000
```

4. **Seed demo users** (optional):
Visit `http://localhost:3000/api/seed` or run:
```bash
curl -X POST http://localhost:3000/api/seed
```

This will create 3 demo users:
- john@example.com / password123
- jane@example.com / password123
- admin@example.com / admin123

## 📁 Project Structure

```
notulensi-pro/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/         # Login endpoint
│   │   │   ├── register/      # Register endpoint
│   │   │   ├── logout/        # Logout endpoint
│   │   │   └── me/            # Get current user endpoint
│   │   ├── notes/             # Notes CRUD endpoints
│   │   └── seed/              # Database seeder
│   ├── components/            # React components
│   │   ├── AuthModal.tsx      # Authentication modal
│   │   ├── DashboardApp.tsx   # Main dashboard application
│   │   ├── LandingPage.tsx    # Landing/intro page
│   │   ├── Navbar.tsx         # Navigation bar
│   │   └── ...                # Other components
│   ├── config/                # Configuration files
│   │   └── index.ts           # Laravel-style config
│   ├── constants/             # Constants and types
│   │   └── index.ts
│   ├── lib/                   # Utilities and libraries
│   │   ├── auth.ts            # Authentication utilities
│   │   └── mongodb.ts         # Database connection
│   ├── models/                # Data models
│   │   └── index.ts           # User and Note models
│   ├── utils/                 # Helper functions
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── data/                      # JSON backup files (auto-generated)
├── public/                    # Static files
├── .env.local                 # Environment variables (create from .env.example)
├── .env.example               # Example environment file
├── package.json
└── README.md
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication with httpOnly cookies for security.

### API Endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

## 📝 Notes API

All notes endpoints require authentication.

- `GET /api/notes` - Get all notes for the current user
- `POST /api/notes` - Create a new note
- `PUT /api/notes` - Update an existing note
- `DELETE /api/notes?id=<noteId>` - Delete a note

## ⚙️ Configuration

The app uses a Laravel-style configuration system located in `app/config/index.ts`. All environment variables are centralized here.

### Storage Modes:

- **mongodb**: Store notes only in MongoDB
- **json**: Store notes only in JSON files
- **both**: Store in both MongoDB and JSON files (recommended)

## 🗄️ Database Schema

### Users Collection:
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string, // hashed with bcrypt
  createdAt: Date,
  updatedAt: Date
}
```

### Notes Collection:
```typescript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to user
  title: string,
  group: string,
  content: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚨 Important Notes

- Change the `SESSION_SECRET` in production to a secure random string
- Update MongoDB URI if using a remote database
- The JSON backup files are stored in the `data/` directory
- First-time users should run the seeder to create demo accounts

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Next.js and MongoDB**
