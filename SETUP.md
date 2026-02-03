# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v18+)
- ✅ MongoDB installed and running
- ✅ A code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/campushub
```

### 3. Start MongoDB

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
mongod --dbpath /path/to/data/directory
```

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:3000
```

### 5. Open Frontend

Simply open `frontend/index.html` in your web browser, or use a local server:

**Option 1: Direct File**
- Right-click `frontend/index.html` → Open with → Browser

**Option 2: Local Server (Recommended)**
```bash
# Using Python
cd frontend
python -m http.server 8000

# Using Node.js http-server
npx http-server frontend -p 8000
```

Then visit: `http://localhost:8000`

## Verify Installation

1. Backend API: Visit `http://localhost:3000/api/health`
   - Should return: `{"status":"OK","message":"CampusHub API is running"}`

2. Frontend: Open the application
   - Should see the CampusHub dashboard
   - Try creating an event to test the connection

## Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Check MongoDB logs for errors

**Port 3000 already in use?**
- Change PORT in `.env` to another port (e.g., 3001)
- Update `API_BASE_URL` in `frontend/js/app.js` accordingly

**CORS errors?**
- Ensure backend is running before opening frontend
- Check that API_BASE_URL matches your backend port

## Next Steps

1. Create your first event
2. Add some students
3. Register students to events
4. Add resources and track availability

Happy coding! 🚀
