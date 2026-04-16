# MediStore 💊
**"Your Trusted Online Medicine Shop"**

---

## Project Overview

MediStore is a full-stack e-commerce web application for purchasing over-the-counter (OTC) medicines. Customers can browse medicines, add to cart, and place orders. Sellers manage their medicine inventory and fulfill orders. Admins oversee the platform and manage all users and listings.

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Customer** | Users who purchase medicines | Browse, cart, order, track status, leave reviews |
| **Seller** | Medicine vendors/pharmacies | Manage inventory, view orders, update order status |
| **Admin** | Platform moderators | Manage all inventory, users, oversee orders |

> 💡 **Note**: Users select their role during registration Admin accounts should be seeded in the database.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js | App Router, SSR/SSG |
| TypeScript | Type safety |
| Tailwind CSS | Styling (or any CSS framework) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API |
| Postgres + Prisma | Database |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel/Render | Frontend & Backend deployment |


---

## Features

### Public Features
- Browse all available medicines
- Search and filter by category, price, manufacturer
- View medicine details

### Customer Features
- Register and login as customer
- Add medicines to cart
- Place orders with shipping address (Cash on Delivery)
- Track order status
- Leave reviews after ordering
- Manage profile

### Seller Features
- Register and login as seller
- Add, edit, and remove medicines
- Manage stock levels
- View incoming orders
- Update order status

### Admin Features
- View all users (customers and sellers)
- Manage user status (ban/unban)
- View all medicines and orders
- Manage categories

---

## Pages & Routes

> ⚠️ **Note**: These routes are examples. You may add, edit, or remove routes based on your implementation needs.

### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, categories, featured |
| `/shop` | Shop | All medicines with filters |
| `/shop/:id` | Medicine Details | Info, add to cart |
| `/login` | Login | Login form |
| `/register` | Register | Registration form |

### Customer Routes (Private)
| Route | Page | Description |
|-------|------|-------------|
| `/cart` | Cart | View cart items |
| `/checkout` | Checkout | Shipping address |
| `/orders` | My Orders | Order history |
| `/orders/:id` | Order Details | Items, status |
| `/profile` | Profile | Edit info |

### Seller Routes (Private)
| Route | Page | Description |
|-------|------|-------------|
| `/seller/dashboard` | Dashboard | Orders, stats |
| `/seller/medicines` | Inventory | Manage medicines |
| `/seller/orders` | Orders | Update status |

### Admin Routes (Private)
| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Statistics |
| `/admin/users` | Users | Manage users |
| `/admin/orders` | Orders | All orders |
| `/admin/categories` | Categories | Manage categories |

---

## Database Tables

Design your own schema for the following tables:

- **Users** - Store user information and authentication details
- **Categories** - Medicine categories
- **Medicines** - Medicine/product inventory (linked to seller)
- **Orders** - Customer orders with items and status
- **Reviews** - Customer reviews for medicines

> 💡 *Think about what fields each table needs based on the features above.*

---

## API Endpoints

> ⚠️ **Note**: These endpoints are examples. You may add, edit, or remove endpoints based on your implementation needs.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Medicines (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines with filters |
| GET | `/api/medicines/:id` | Get medicine details |
| GET | `/api/categories` | Get all categories |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |

### Seller Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/seller/medicines` | Add medicine |
| PUT | `/api/seller/medicines/:id` | Update medicine |
| DELETE | `/api/seller/medicines/:id` | Remove medicine |
| GET | `/api/seller/orders` | Get seller's orders |
| PATCH | `/api/seller/orders/:id` | Update order status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status |

---

## Flow Diagrams

### 💊 Customer Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Browse Shop │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Add to Cart  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Checkout   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Track Order  │
                              └──────────────┘
```

### 🏪 Seller Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │Add Medicines │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Manage Stock │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ View Orders  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │Update Status │
                              └──────────────┘
```

### 📊 Order Status

```
                              ┌──────────────┐
                              │    PLACED    │
                              └──────────────┘
                               /            \
                              /              \
                        (seller)        (customer)
                        confirms         cancels
                            /                \
                           ▼                  ▼
                   ┌──────────────┐   ┌──────────────┐
                   │  PROCESSING  │   │  CANCELLED   │
                   └──────────────┘   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   SHIPPED    │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  DELIVERED   │
                   └──────────────┘
```

> 💊 **Note**: OTC medicines only (no prescription required)

---