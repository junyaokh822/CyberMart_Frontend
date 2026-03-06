# CyberMart 🛒

A full-stack e-commerce web application built with React and Node.js, featuring a complete shopping experience from product browsing to order management.

🌐 **Live Demo:** [https://cybermart-frontend.onrender.com](https://cybermart-frontend.onrender.com)

---

## Features

### 🛍️ Shopping

- Browse and search products by name, category, and price
- View detailed product pages with descriptions and customer reviews
- Add products to cart with quantity control
- Wishlist to save products for later

### 👤 User Account

- Register and login with JWT authentication
- View and edit profile information
- Change password securely
- View full order history with order details

### 🛒 Cart & Checkout

- Add, update, and remove cart items
- Checkout with shipping address and payment method selection
- Cancel pending orders

### ⭐ Reviews

- Leave reviews only on purchased and delivered products
- Star rating system with half-star support
- Edit and delete your own reviews

### 🔐 Admin Dashboard

- Manage products (create, edit, delete)
- View and update order statuses
- Filter orders by status

---

## Tech Stack

### Frontend

- **React 19** — UI library
- **React Router v7** — client-side routing
- **Axios** — HTTP requests
- **Vite** — build tool

### Backend

- **Node.js / Express** — REST API server
- **MongoDB / Mongoose** — database
- **JWT** — authentication
- **bcrypt** — password hashing
- **CORS** — cross-origin resource sharing

### Deployment

- **Frontend:** Render Static Site
- **Backend:** Render Web Service
- **Database:** MongoDB Atlas

---

## Getting Started (Local Development)

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/junyaokh822/CyberMart_Frontend
cd CyberMart_Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env.local` file

```env
VITE_API_URL=http://localhost:3000/api
```

> `.env.local` is automatically ignored by Git via the `*.local` rule in `.gitignore`.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> Make sure the backend server is also running locally. See [CyberMart_Backend](https://github.com/junyaokh822/CyberMart_Backend).

---

## Environment Variables

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

---

## Project Structure

```
CyberMart_Frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # Auth context
│   ├── pages/            # Page components
│   │   ├── Admin/        # Admin dashboard
│   │   ├── CartPage/     # Cart & checkout
│   │   ├── HomePage/     # Product listing
│   │   └── ...
│   └── services/         # API calls (api.jsx)
```

---

## License

MIT
