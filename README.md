# 🛒 Grocery SaaS Management System

A full-stack Grocery Store Management System built using **Node.js, Express, PostgreSQL, and Vanilla JS** with role-based authentication and a modern responsive dashboard UI.

---

## 🚀 Features

### 👨‍💼 Admin
- Add products
- Update products
- Delete products
- View all orders
- Mark orders as Delivered
- Dashboard analytics (Total Products, Orders, Revenue)

### 👩‍💻 Customer
- Register & Login (JWT authentication)
- View available products
- Place order using product name
- Stock auto-updates on order
- View only their own orders
- Cancel placed orders

---

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based authorization (ADMIN / CUSTOMER)
- Protected API routes
- Inventory transaction control using PostgreSQL transactions

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- Bcrypt
- Docker (for database)

### Frontend
- HTML
- CSS (Gradient + Glass UI)
- Vanilla JavaScript
- Responsive design (Mobile Friendly)

---

## 📁 Project Structure

```
Grocery-management-system/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── admin.html
│   ├── customer.html
│   ├── dashboard.js
│   └── dashboard.css
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/Grocery-management-system.git
cd Grocery-management-system
```

---

### 2️⃣ Start PostgreSQL (Docker)

```
docker run --name grocery-postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres123 \
-e POSTGRES_DB=grocery_store \
-p 5432:5432 \
-d postgres
```

---

### 3️⃣ Backend Setup

```
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:3000
```

---

### 4️⃣ Frontend

Open:

```
frontend/login.html
```

in your browser (or use Live Server).

---

## 🗄️ Database Tables

- users (ADMIN / CUSTOMER)
- products
- orders
- order_items

---

## 📊 Order Flow

1. Customer places order
2. System checks stock (transaction)
3. Stock is reduced automatically
4. Order created with status = PLACED
5. Admin marks as DELIVERED
6. Customer sees updated status

---

## 🎨 UI Highlights

- Animated gradient dashboard
- Glassmorphism login
- Responsive layout
- Custom delete modal
- Status badges
- Clean SaaS design

---

## 💡 Future Improvements

- Charts & analytics dashboard
- Product image upload
- Search & pagination
- Stripe payment integration
- Deployment to cloud

---

## 👩‍💻 Author

**Poojashri D**  
IT Student | Full-Stack Developer.
