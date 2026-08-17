# ConnectHub - Full Stack Social Media App


## Features
- User registration and login
- JWT authentication
- Protected routes
- Create, view, edit and delete posts
- Like/unlike posts
- User profile and profile editing
- Responsive React UI
- MongoDB database
- REST API

## Setup

### Backend
```bash
cd backend
npm install

npm run dev
```


### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 and backend on http://localhost:5000.

## API
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- GET /api/posts
- POST /api/posts
- GET /api/posts/:id
- PUT /api/posts/:id
- DELETE /api/posts/:id
- PUT /api/posts/:id/like
- GET /api/users/me
- PUT /api/users/profile
