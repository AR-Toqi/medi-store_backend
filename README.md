# 🏥 MediStore Backend API

MediStore is a Medicine E-Commerce Backend API built with a role-based system for **Admin**, **Seller**, and **Customer** users.

This backend allows users to:
- Browse and purchase medicines
- Manage cart and orders
- Submit reviews and ratings
- Manage addresses and seller profiles
- Control the entire system through admin access

---

## 🚀 Live Project
**Backend URL:**  
https://medi-store-backend-u9ux.onrender.com/

**GitHub Repository:**  
https://github.com/AR-Toqi/medi-store_backend

---

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth
- **Media Management:** Cloudinary
- **File Uploads:** Multer
- **Deployment:** Render

---

## 🔐 Authentication & Authorization
Authentication in MediStore is handled using **Better Auth**.

- Secure authentication and session management handled by Better Auth
- Role-based access control:
	- **ADMIN** – Full system access
	- **SELLER** – Manage medicines, orders, reviews, and seller profile
	- **CUSTOMER** – Manage cart, orders, reviews, and addresses
- Protected routes require a valid authenticated session
- Role permissions are enforced at the API level
- Session-based security via cookies

---

## 🖼 Media & Asset Management
MediStore uses **Cloudinary** for professional media management (optimization, transformations, and CDNs).

### 📤 How to Upload Files
For routes that support images, you must send your request as `multipart/form-data` (instead of JSON).

| Asset Type | Field Name | Cloudinary Folder |
| :--- | :--- | :--- |
| Medicine Photos | `image` | `medistore/medicines` |
| Shop Logos | `logo` | `medistore/shops` |
| Profile Photos | `image` | `medistore/users` |
| Category Icons | `image` | `medistore/categories` |

### ⚙️ Required Envs
Ensure you have these in your `.env`:
```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

## 📌 API Endpoints

### 🔍 Health & Auth

`POST /api/auth/register`      → Register a new user
`POST /api/auth/login`         → Login (Set cookies)
`POST /api/auth/logout`        → Logout (Clear cookies)
`POST /api/auth/verify-email`  → Verify email with OTP
`GET  /api/me`                 → Get current logged-in user
`PUT  /api/me`                 → Update user profile

### 📂 Categories (Public + Admin)

`GET    /api/categories`        → Get all categories
`POST   /api/categories`        → Create category (Admin/Seller)
`PATCH  /api/categories/:id`    → Update category (Admin)
`DELETE /api/categories/:id`    → Delete category (Admin)

### 💊 Medicines (Public + Seller)

`GET    /api/medicines`                 → Get all medicines (with filters)
`GET    /api/medicines/:medicineId`     → Get single medicine
`POST   /api/medicines`                 → Create medicine (Seller)
`PUT    /api/medicines/:medicineId`     → Update medicine (Seller)
`DELETE /api/medicines/:medicineId`     → Delete medicine (Seller)

### 🛒 Cart (Customer)

`GET    /api/cart`              → Get my cart
`POST   /api/cart`              → Add item to cart
`PUT    /api/cart/:cartItemId`  → Update item quantity
`DELETE /api/cart/:cartItemId`  → Remove item from cart

### 📦 Orders (Customer + Seller + Admin)

`GET    /api/orders/admin/all`        → Get all orders (Admin)
`GET    /api/orders/seller/all`       → Get seller orders (Seller)
`GET    /api/orders/my-orders`        → Get my orders (Customer)
`GET    /api/orders/:orderId`         → Get order details
`POST   /api/orders`                  → Create order (Customer)
`PATCH  /api/orders/:orderId/status`  → Update order status (Seller/Admin)

### ⭐ Reviews (Public + Customer + Seller + Admin)

`GET    /api/reviews/medicine/:medicineId`  → Get medicine reviews
`GET    /api/reviews/seller/all`            → Get seller reviews (Seller)
`POST   /api/reviews`                       → Create review (Customer)
`DELETE /api/reviews/:reviewId`             → Delete review (Admin)

### 🏠 Address (Customer)

`GET    /api/addresses`             → Get my addresses
`GET    /api/addresses/:id`         → Get single address
`POST   /api/addresses`             → Create address
`PUT    /api/addresses/:id`         → Update address
`DELETE /api/addresses/:id`         → Delete address
`PUT    /api/addresses/:id/default` → Set default address

### 🧑‍⚕️ Seller Profile & Dashboard (Seller)

`POST   /api/sellers`           → Become a seller (Create profile)
`GET    /api/seller/profile`    → Get my seller profile
`PATCH  /api/seller/profile`    → Update seller profile
`GET    /api/seller/stats`      → Get dashboard stats
`GET    /api/seller/orders`     → Manage my shop orders
`GET    /api/seller/medicines`  → Manage my medicines

### 🛡 Admin Management

`GET    /api/admin/users`           → View all users
`PATCH  /api/admin/users/:id`       → Ban/Unban/Role Update
`GET    /api/admin/orders`          → View all system orders
`GET    /api/admin/categories`      → Manage categories
`POST   /api/admin/categories`      → Create category

---

## ✅ Features Overview
- Role-based access control (Admin, Seller, Customer)
- Secure authentication & session management via Better Auth
- Seller & customer-specific workflows
- Complete order lifecycle management
- Review and rating system
- Clean, scalable, and maintainable backend architecture

---

## 📌 Project Status
✅ Backend Complete  
🚀 Production Ready  
🌐 Deployed on Render

---

## 👨‍💻 Author
**Abdullah Ragib Toqi**  
GitHub: https://github.com/AR-Toqi
LinkedIn: https://www.linkedin.com/in/abdullah-ragib-toqi-b5154a297/
