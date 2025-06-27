# 🛒 E-Commerce Backend API

A secure and scalable backend for an e-commerce application built with **Node.js**, **Express**, and **MongoDB**. It supports user authentication, role-based authorization, cart management, product listings, coupon creation, and order placements.

---

## 🚀 Features

- ✅ User Authentication with JWT
- ✅ Role-based Access Control (Admin/Seller/Customer)
- ✅ Protected Routes with Middleware
- ✅ Cart Management
- ✅ Coupon Management
- ✅ Product Listing & Creation
- ✅ Order Placement

---

## 📦 Installation

```bash
git clone https://github.com/Naveen-KumarJ/ecommerce-backend-api.git
cd ecommerce-backend-api
npm install
````

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET_KEY=your_jwt_secret
```

---

## ▶️ Running the Server

```bash
npm start
```

---

## 🧾 API Endpoints

### 👤 User

* `POST /api/v1/user/register`
* `POST /api/v1/user/login`
* `POST /api/v1/user/forgot-password`
* `POST /api/v1/user/reset-password`

### 📦 Product

* `GET /api/v1/product/list`
* `POST /api/v1/product/create` *(Protected: SELLER, ADMIN)*

### 🛒 Cart

* `POST /api/v1/cart/add` *(Protected)*
* `GET /api/v1/cart/` *(Protected)*

### 💸 Coupon

* `POST /api/v1/coupon/create` *(Protected: SELLER, ADMIN)*
* `GET /api/v1/coupon/list`

### 📦 Order

* `POST /api/v1/order/place` *(Protected)*

---

## 🔐 Authentication

Add the token to `Authorization` header in protected routes:

```
Authorization: Bearer <your-token>
```

---

## 🧑‍💻 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **JWT** for auth
* **CORS** enabled
* **RBAC Middleware**

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
