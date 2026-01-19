# CampusHub – Student Activity & Resource Management System

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com/)  
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)](https://www.mongodb.com/)  
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

CampusHub is a **full-stack web application** for managing campus events, student registrations, and resources. Built with **Node.js, Express, MongoDB, Bootstrap, and jQuery**, it demonstrates **modern web development practices**, including RESTful APIs, asynchronous communication, and responsive UI.

---

## 🚀 Features

- **Event Management** – Create, edit, delete, and view campus events  
- **Student Management** – Register students, assign them to events, edit, or remove them  
- **Resource Management** – Track and manage campus resources efficiently  
- **RESTful API** – Clean endpoints with proper HTTP status codes  
- **Responsive UI** – Mobile-first design using Bootstrap components  
- **AJAX Operations** – Real-time updates without page reloads  
- **Professional UI/UX** – Modern dashboard with smooth animations and interactive elements  

---

## 🧰 Technology Stack

**Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), jQuery, Bootstrap Icons  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Tools & Utilities:** Nodemon, dotenv, CORS  

---

## 📁 Project Structure

```
CampusHub/
│
├── backend/
│   ├── models/
│   │   ├── Event.js          # Event model with embedded organizer
│   │   ├── Student.js        # Student model with event references
│   │   └── Resource.js       # Resource model
│   │
│   ├── routes/
│   │   ├── eventRoutes.js    # Event CRUD endpoints
│   │   ├── studentRoutes.js  # Student CRUD endpoints
│   │   └── resourceRoutes.js # Resource CRUD endpoints
│   │
│   ├── server.js             # Express server configuration
│   ├── package.json          # Dependencies and scripts
│   └── .env.example          # Environment variables template
│
├── frontend/
│   ├── css/
│   │   └── styles.css        # Custom styles
│   │
│   ├── js/
│   │   ├── app.js           # Main application logic
│   │   ├── events.js        # Events CRUD operations
│   │   ├── students.js      # Students CRUD operations
│   │   └── resources.js     # Resources CRUD operations
│   │
│   └── index.html           # Main HTML file
│
└── README.md                # Project documentation
```

---

## 🏗️ Architecture

### Client-Server Architecture

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐
│                 │ ◄─────────────────────────► │                 │
│   Frontend      │      JSON Data Exchange    │    Backend      │
│   (Browser)     │                             │   (Express.js)  │
│                 │                             │                 │
│  - HTML/CSS     │                             │  - REST API     │
│  - Bootstrap    │                             │  - Routes       │
│  - jQuery/AJAX  │                             │  - Validation   │
└─────────────────┘                             └────────┬────────┘
                                                        │
                                                        │ Mongoose ODM
                                                        ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │    MongoDB      │
                                                │   (NoSQL DB)    │
                                                │                 │
                                                │  - Events       │
                                                │  - Students     │
                                                │  - Resources    │
                                                └─────────────────┘
```


---

## 🏗️ Architecture

**Client-Server Flow:**

1. User interacts with the frontend (browser)  
2. jQuery AJAX sends HTTP requests to the Express backend  
3. Express routes handle requests and query MongoDB via Mongoose  
4. Backend responds with JSON data  
5. Frontend updates the DOM dynamically without page reloads  

---

## 🌐 API Endpoints

### Events

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | /api/events | Retrieve all events |
| POST   | /api/events | Create new event |
| PUT    | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |

### Students

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | /api/students | Retrieve all students |
| POST   | /api/students | Add new student |
| PUT    | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

### Resources

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | /api/resources | Retrieve all resources |
| POST   | /api/resources | Add new resource |
| PUT    | /api/resources/:id | Update resource |
| DELETE | /api/resources/:id | Delete resource |

### Health Check

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | /api/health | API status |

> ⚡ For full API documentation, see the backend route files.

---

## 💻 Installation

**Prerequisites:** Node.js (v18+), MongoDB

1. **Clone the repository**
`bash
git clone <repository-url>
cd CampusHub`

3. **Install backend dependencies:**
`cd backend
npm install`

4. **Configure environment variables:**
`cp .env.example .env`

4. **Start MongoDB:**
`mongod`

5. **Start backend server:**
`npm run dev`

6. **Serve frontend:**
`npx http-server frontend -p 8000`

7. Open browser at `http://localhost:8000`

---

## 🎨 UI Highlights

- *Responsive Layout* – Mobile-first design using Bootstrap grid
- *Cards & Tables* – Elegant shadows, hover effects, smooth transitions
- *Forms & Modals* – Validations with visual feedback
- *Notifications* – Toast messages for success/error operations
- *Color-coded badges* – Display event types and resource availability

---

## Security Considerations

- Input validation on client & server
- MongoDB injection prevention via Mongoose
- CORS enabled for development
- Production recommendations: Authentication, rate limiting, HTTPS, CSRF protection

---

## Screenshots
<img width="1914" height="917" alt="Events" src="https://github.com/user-attachments/assets/61b22e95-3a9a-4570-a081-8e24f5aeb5ad" />
<img width="1919" height="917" alt="Students" src="https://github.com/user-attachments/assets/70f0d1cf-2061-4b88-b2a8-9d547b1b9deb" />
<img width="1919" height="915" alt="Resources" src="https://github.com/user-attachments/assets/5bf4b7cc-9611-41ab-8b5c-ca937c424cfe" />

## Contact

Created by **Remoshan**  
- Email: [remoshanfrancis123@outlook.com](mailto:remoshanfrancis123@outlook.com)  
- GitHub: [github.com/remoshan](https://github.com/remoshan)  
- LinkedIn: [linkedin.com/in/francis-remoshan](https://www.linkedin.com/in/francis-remoshan)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
