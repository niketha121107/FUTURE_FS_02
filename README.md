# Mini CRM — Client Lead Management System

A full-stack CRM built to manage client leads generated from website contact forms. Admins can securely log in, manage incoming leads, update their status through a simple sales pipeline, and maintain follow-up notes for every lead.

This project was developed as part of the **Future Interns – Full Stack Development Internship (FUTURE_FS_02)**.

---

## 🚀 Features

### 👥 Public Contact Form

* Public `/contact` page for website visitors
* Create new leads without authentication
* Client-side form validation
* Email format validation
* Loading and success states
* Customer message automatically saved as the lead's first note

### 🔐 Admin Authentication

* JWT Authentication
* bcrypt password hashing
* Protected routes
* Persistent login
* Automatic logout on unauthorized requests (401)

### 📊 Dashboard

* View all leads
* Search by name or email
* Filter by status
* Dashboard statistics

  * Total Leads
  * New Leads
  * Contacted Leads
  * Converted Leads

### ➕ Manual Lead Creation

* Admin can manually add new leads
* Modal-based lead creation form
* Source selection
* Status selection
* Inline validation
* Success notification

### 📋 Lead Management

* View complete lead details
* Update lead status
* Add follow-up notes
* View note timeline
* Delete leads with confirmation

---

## 🛠 Tech Stack

| Layer          | Technology         |
| -------------- | ------------------ |
| Frontend       | React (Vite)       |
| Routing        | React Router       |
| HTTP Client    | Axios              |
| Backend        | Node.js + Express  |
| Database       | MongoDB + Mongoose |
| Authentication | JWT + bcrypt       |
| Styling        | CSS                |

---

## 📁 Project Structure

```text
mini-crm/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint                | Protected | Description        |
| ------ | ----------------------- | --------- | ------------------ |
| POST   | `/api/auth/register`    | No        | Register admin     |
| POST   | `/api/auth/login`       | No        | Login admin        |
| POST   | `/api/leads`            | No        | Create lead        |
| GET    | `/api/leads`            | Yes       | Get all leads      |
| GET    | `/api/leads/:id`        | Yes       | Get lead by ID     |
| PATCH  | `/api/leads/:id/status` | Yes       | Update lead status |
| POST   | `/api/leads/:id/notes`  | Yes       | Add note           |
| DELETE | `/api/leads/:id`        | Yes       | Delete lead        |

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/niketha121107/FUTURE_FS_02.git
cd FUTURE_FS_02
```

---

### Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Application:

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

## 🧪 Testing

Tested successfully using Postman.

* ✅ Register Admin
* ✅ Login
* ✅ JWT Authentication
* ✅ Create Lead
* ✅ Get Leads
* ✅ Get Lead by ID
* ✅ Update Status
* ✅ Add Notes
* ✅ Delete Lead
* ✅ Unauthorized Access Handling

---

## 📸 Features

* Secure Login
* Dashboard Statistics
* Search & Filter
* Add Lead
* Contact Form
* Lead Details
* Status Management
* Notes Timeline
* Delete Lead
* Responsive Design

##Screenshots

<img width="1536" height="693" alt="image" src="https://github.com/user-attachments/assets/1b6e319f-d330-4036-802c-2128d8db3a4a" />
<img width="1536" height="692" alt="image" src="https://github.com/user-attachments/assets/5bed3c3c-01b0-40ff-9826-8c54ad724668" />

---

## 🔒 Security

* Passwords hashed using bcrypt
* JWT-based authentication
* Protected admin routes
* Environment variables for sensitive configuration
* Public access limited to contact form only

---

## 🌟 Future Improvements

* Email notifications
* File attachments
* CSV/Excel export
* Pagination
* Role-based access
* Dashboard charts
* Dark mode

---

## 👩‍💻 Author

**Niketha**

Future Interns – Full Stack Development Internship

Project: **FUTURE_FS_02 – Mini CRM (Client Lead Management System)**
