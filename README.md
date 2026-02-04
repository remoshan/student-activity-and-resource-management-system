## student-activity-and-resource-management-system

**Full-stack web application for managing campus events, student registrations, and shared resources.**

This project provides a simple, developer-friendly stack using **JavaScript, HTML, and CSS** (with a Node.js/Express API and MongoDB) to help campuses organize events, track student participation, and manage resource availability from a single place.

---

### Visuals

![Events Management](https://github.com/user-attachments/assets/dbfcd108-2dde-4a34-b8e2-a23430b7fc5e)
![Students Management](https://github.com/user-attachments/assets/e1cb63d4-5bf6-4dfc-9a80-4cf551b9c42b)
![Resources Management](https://github.com/user-attachments/assets/a5763a06-6b25-4bdd-b32d-8cd6e3868205)

---

### Features

- **Event Management**: Create, update, list, and cancel campus events.
- **Student Management**: Register students, update profiles, and associate them with events.
- **Resource Management**: Track rooms, equipment, and other assets with availability status.
- **Registrations & Attendance**: Link students to events and record attendance.
- **RESTful API**: JSON-based endpoints for events, students, and resources.
- **Clean Frontend**: HTML/CSS/JavaScript frontend that consumes the backend API.

---

### Getting Started

#### Prerequisites

- **Node.js**: v18 or later
- **npm**: bundled with Node.js
- **MongoDB**: local instance or a remote MongoDB connection string

#### Installation

Clone the repository and install backend dependencies:

```bash
git clone <github.com/remoshan/student-activity-and-resource-management-system>
cd student-activity-and-resource-management-system

cd backend
npm install
```

Configure environment variables for the backend (see the **Configuration** section for details):

```bash
# in backend/.env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/campushub
```

Run MongoDB and start the backend API:

```bash
# Start MongoDB (example)
mongod

# In a separate terminal
cd backend
npm run dev
```

Serve the frontend (choose one option):

```bash
# Option 1: Open directly in the browser
# Open frontend/index.html with your browser

# Option 2: Serve via a simple static server
cd frontend
python -m http.server 8000

# or, using Node's http-server (installed globally or via npx)
npx http-server . -p 8000
```

Then open `http://localhost:8000` in your browser.

---

### Usage

The most common use case is creating and listing events through the API and consuming them from the frontend.

**Example: Create a new event and list all events using JavaScript (browser-side):**

```javascript
// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api';

// Create a new event
async function createEvent() {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Welcome Week Fair',
      date: '2026-02-10',
      location: 'Main Hall',
      description: 'Orientation fair for new students.'
    })
  });

  if (!response.ok) {
    console.error('Failed to create event');
    return;
  }

  const created = await response.json();
  console.log('Created event:', created);
}

// Fetch and display all events
async function loadEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  const events = await response.json();
  console.log('All events:', events);
}

// Example usage
createEvent().then(loadEvents);
```

You can adapt this pattern in `frontend/js/events.js` or similar modules to integrate with your UI.

---

### Configuration

Backend configuration is managed via environment variables (typically in `backend/.env`).

| Variable      | Default                                 | Description                                      | Required |
|--------------|-----------------------------------------|--------------------------------------------------|----------|
| `PORT`       | `3000`                                  | Port on which the backend API listens.          | No       |
| `MONGODB_URI`| `mongodb://localhost:27017/campushub`   | MongoDB connection string for the application.  | Yes      |
| `NODE_ENV`   | `development`                           | Node environment (`development` / `production`). | No       |

If you expose the backend under a different host/port, update any frontend configuration (for example, an `API_BASE_URL` constant in `frontend/js/app.js`) to match.

---

### Contributing

Contributions are welcome. To propose a change:

1. **Fork** the repository on GitHub.
2. **Create a feature branch** from `main` (for example, `feature/add-event-filters`).  
3. **Implement your changes** with clear commits and, where appropriate, tests or examples.
4. **Open a Pull Request** against `main`, describing the change, motivation, and any breaking impacts.
5. Be ready to address review comments and keep the branch up to date with `main` if needed.

---

### License

This project is licensed under the **MIT License**. See the `LICENSE` file in this repository for full details.
