# NotulensiPro - Setup Guide

## Quick Start Guide

### 1. Environment Setup

The `.env.local` file has been created with default values. You can modify it if needed:

```env
APP_NAME=Notulensi Pro
APP_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/notulensi_pro
SESSION_SECRET=your-secret-key-change-this-in-production
STORAGE_MODE=both
```

**Important:** Make sure MongoDB is running before starting the application!

### 2. Start MongoDB

If you have MongoDB installed locally, start it with:

```bash
# Windows
mongod

# Or if MongoDB is installed as a service, it should already be running
```

### 3. Start the Development Server

The server is already running! If you need to restart it:

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 4. Seed Demo Users (Optional)

To create demo user accounts for testing, you can seed the database:

**Option 1: Via Browser**
- Navigate to: `http://localhost:3000/api/seed`

**Option 2: Via Command Line**
```bash
curl -X POST http://localhost:3000/api/seed
```

This will create 3 demo users:
- **Email:** john@example.com - **Password:** password123
- **Email:** jane@example.com - **Password:** password123
- **Email:** admin@example.com - **Password:** admin123

## Features Overview

### 🔐 Authentication System
- Secure JWT-based authentication
- Register new users
- Login/logout functionality
- Protected routes requiring authentication

### 📝 Notes Management
- Create, read, update, delete notes
- Rich text editor for formatting
- Group/categorize notes
- Timeline view of all notes
- User-specific notes (each user only sees their own notes)

### 💾 Hybrid Storage
- **MongoDB Mode:** All notes stored in MongoDB
- **JSON Mode:** All notes stored as JSON files
- **Both Mode (Default):** Notes stored in both MongoDB and JSON files for redundancy

The storage mode can be changed in `.env.local` by modifying `STORAGE_MODE`.

### 🎨 User Interface
- **Landing Page:** Introduction and features overview
- **Dashboard:** Quick overview of your notes
- **Timeline View:** Chronological list of all notes
- **Create/Edit:** Rich text editor for note creation
- **Detail View:** Read individual notes with download option

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB
- **Authentication:** JWT + bcryptjs
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Language:** TypeScript

## Project Structure

```
app/
├── api/                    # API Routes
│   ├── auth/              # Authentication endpoints
│   │   ├── login/
│   │   ├── register/
│   │   ├── logout/
│   │   └── me/
│   ├── notes/             # CRUD operations for notes
│   └── seed/              # Database seeder
├── components/            # React components
├── config/                # Laravel-style configuration
├── constants/             # TypeScript types and constants
├── lib/                   # Utilities (auth, database)
├── models/                # Data models (User, Note)
└── utils/                 # Helper functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Notes (All require authentication)
- `GET /api/notes` - Get all notes for current user
- `POST /api/notes` - Create a new note
- `PUT /api/notes` - Update existing note
- `DELETE /api/notes?id=<noteId>` - Delete a note

### Seeder
- `POST /api/seed` - Seed demo users (can only run once)

## Configuration

All configuration is centralized in `app/config/index.ts` following Laravel's pattern:

```typescript
export const config = {
  app: {
    name: process.env.APP_NAME || "Notulensi Pro",
    url: process.env.APP_URL || "http://localhost:3000",
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017/notulensi_pro",
    },
  },
  session: {
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
  },
  storage: {
    mode: process.env.STORAGE_MODE || "both",
  },
};
```

## Data Models

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string, // bcrypt hashed
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,  // Reference to user
  title: string,
  group: string,
  content: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### MongoDB Connection Error
If you see connection errors:
1. Make sure MongoDB is running: `mongod`
2. Check that the `MONGODB_URI` in `.env.local` is correct
3. Ensure MongoDB is accessible on the specified port (default: 27017)

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
```

### Clear Browser Cache
If you encounter login issues:
1. Clear browser cookies
2. Use incognito/private browsing mode
3. Check browser console for errors

## Production Deployment

Before deploying to production:

1. **Update Environment Variables:**
   - Change `SESSION_SECRET` to a strong random string
   - Update `MONGODB_URI` to your production database
   - Set `APP_URL` to your production domain

2. **Build the Application:**
   ```bash
   npm run build
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

## Next Steps

1. **Register an Account:** Visit http://localhost:3000 and click "Get Started"
2. **Create Your First Note:** Click the "+" button to create a new note
3. **Explore Features:** Try the dashboard, timeline view, and rich text editor
4. **Customize:** Modify the app name, colors, and features to your needs

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review the code comments for implementation details
- Ensure all dependencies are installed: `npm install`

---

**Congratulations!** Your full-stack NotulensiPro application is ready to use! 🎉
