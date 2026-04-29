# TaskFlow – Mini SaaS Task Management System

A production-ready full-stack task management application with secure JWT authentication and multi-user support.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS      |
| Backend    | Node.js, Express.js               |
| Database   | PostgreSQL + Sequelize ORM        |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| Validation | express-validator                 |
| HTTP       | Axios                             |

---

## Features Implemented

### Authentication
- User registration with name, email, password
- Password hashing with bcryptjs (salt rounds: 12)
- JWT-based login (token stored in localStorage)
- Protected routes – redirect to login if unauthenticated
- Token verification on app load via `/api/auth/me`
- Auto-logout on 401 responses

### Task Management (per-user, no global tasks)
- Create tasks with title, description, status, priority, due date
- View only your own tasks (userId foreign key enforced at DB level)
- Update any task field – click status badge to cycle through states
- Delete tasks with confirmation
- Filter by status (pending / in_progress / completed)
- Filter by priority (low / medium / high)
- Sort by created date, due date, or title
- Client-side search by title and description
- Stats dashboard: total, pending, in-progress, completed counts
- Overdue task highlighting

### Backend Architecture
```
backend/
├── config/
│   └── database.js          # Sequelize + PostgreSQL connection
├── controllers/
│   ├── authController.js    # register, login, getMe
│   └── taskController.js    # CRUD operations
├── middleware/
│   ├── auth.js              # JWT protect middleware
│   ├── errorHandler.js      # Central error handler + 404
│   └── validators.js        # express-validator rules
├── models/
│   ├── User.js              # UUID PK, bcrypt hooks, toJSON strips password
│   ├── Task.js              # UUID PK, userId FK, status/priority enums
│   └── index.js             # Associations (User hasMany Tasks)
├── routes/
│   ├── authRoutes.js        # /api/auth/*
│   └── taskRoutes.js        # /api/tasks/* (all protected)
└── server.js                # Express app entry point
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm or yarn

---

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

---

### 2. Set up PostgreSQL Database

Open psql and run:
```sql
CREATE DATABASE taskflow_db;
CREATE USER taskflow_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE taskflow_db TO taskflow_user;
```

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow_db
DB_USER=taskflow_user
DB_PASSWORD=yourpassword
JWT_SECRET=supersecretkey_change_this_min32chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

On first run, Sequelize will **auto-create** the `users` and `tasks` tables.

You should see:
```
✅ PostgreSQL connected successfully.
✅ Database models synced.
🚀 TaskFlow API running on http://localhost:5000
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Route              | Access  | Description         |
|--------|--------------------|---------|---------------------|
| POST   | /api/auth/register | Public  | Create account      |
| POST   | /api/auth/login    | Public  | Login, get JWT      |
| GET    | /api/auth/me       | Private | Get current user    |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Route            | Description              |
|--------|------------------|--------------------------|
| GET    | /api/tasks       | Get all tasks (+ filter) |
| POST   | /api/tasks       | Create task              |
| GET    | /api/tasks/:id   | Get single task          |
| PUT    | /api/tasks/:id   | Update task              |
| DELETE | /api/tasks/:id   | Delete task              |

#### GET /api/tasks Query Params
- `status` – pending | in_progress | completed
- `priority` – low | medium | high
- `sort` – createdAt | updatedAt | due_date | title
- `order` – ASC | DESC

---

## Database Schema

### users
| Column     | Type         | Notes                    |
|------------|--------------|--------------------------|
| id         | UUID (PK)    | Auto-generated           |
| name       | VARCHAR(100) | Required                 |
| email      | VARCHAR(255) | Unique, required         |
| password   | VARCHAR(255) | bcrypt hashed            |
| createdAt  | TIMESTAMP    | Auto                     |
| updatedAt  | TIMESTAMP    | Auto                     |

### tasks
| Column      | Type         | Notes                              |
|-------------|--------------|----------------------------------  |
| id          | UUID (PK)    | Auto-generated                     |
| title       | VARCHAR(200) | Required                           |
| description | TEXT         | Optional                           |
| status      | ENUM         | pending / in_progress / completed  |
| priority    | ENUM         | low / medium / high                |
| due_date    | DATEONLY     | Optional                           |
| userId      | UUID (FK)    | References users.id, CASCADE delete|
| createdAt   | TIMESTAMP    | Auto                               |
| updatedAt   | TIMESTAMP    | Auto                               |

---

## Deployment

### Backend – Railway / Render
1. Push to GitHub
2. Connect repo on Railway or Render
3. Set environment variables (same as `.env`)
4. Deploy

### Frontend – Vercel / Netlify
1. Push frontend folder to GitHub
2. Import project on Vercel
3. Set `VITE_API_URL` if not using proxy
4. Deploy

---

## Security Highlights
- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens expire in 7 days
- All task routes require valid JWT
- Users can only access their own tasks (userId enforced server-side)
- Input validation on all endpoints (express-validator)
- Error messages never leak stack traces in production
- CORS restricted to frontend origin

---

Built by Ram Sanghai
