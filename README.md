# E-Commerce App - Setup Guide

## Project Structure

This is a full-stack e-commerce application with:
- **Frontend**: React app with Tailwind CSS
- **Backend**: Node.js/Express server (recommended) or Python/FastAPI
- **Database**: In-memory storage (development only)

## Prerequisites

- Node.js (v16+)
- npm
- Python 3.9+ (if using Python backend)

## Installation

### 1. Install Dependencies

```bash
# Frontend dependencies
npm --prefix frontend install

# Backend dependencies (Node.js)
npm --prefix backend install

# Backend dependencies (Python - optional)
pip install -r backend/requirements.txt
```

### 2. Environment Setup

Frontend `.env.local` is already configured to use `http://localhost:8001`

Backend `.env` is already configured with default settings.

## Running the Project

### Option A: Use Node.js Backend (Recommended)

```bash
# Terminal 1: Start Frontend (port 3000)
npm --prefix frontend start

# Terminal 2: Start Backend (port 8001)
npm --prefix backend start
```

### Option B: Use Python Backend

```bash
# Terminal 1: Start Frontend (port 3000)
npm --prefix frontend start

# Terminal 2: Start Python Backend (port 8001)
cd backend
uvicorn server:app --reload --port 8001
```

## Test Credentials

### Admin Account
- **Email**: admin@kesarkosmetics.com
- **Password**: Admin@123

### Role
- Admin user is automatically created on backend startup

## Features

- ✅ User Authentication (Register/Login/Logout)
- ✅ Product Browsing & Search
- ✅ Shopping Cart
- ✅ Checkout & Orders
- ✅ Order History
- ✅ Password Hashing (bcrypt)
- ✅ Token Expiry (24 hours)
- ✅ CORS Enabled for localhost

## Security Features

- 🔒 Passwords hashed with bcrypt
- 🔒 HTTP-only cookies for authentication tokens
- 🔒 Token expiry after 24 hours
- 🔒 CORS restrictions to localhost only
- 🔒 Protected routes for authenticated users

## Available Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - Get product categories

### Cart
- `GET /api/cart` - View cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details

## Development Notes

- Frontend runs on **port 3000**
- Backend runs on **port 8001**
- All data is stored in memory (not persisted)
- Admin user seeded on server startup
- Recommended to use Node.js backend for better integration

## Troubleshooting

**Port 3000 already in use?**
```bash
PORT=3001 npm --prefix frontend start
```

**Port 8001 already in use?**
```bash
Update backend/server.js PORT variable or use Python backend on different port
```

**Missing dependencies?**
```bash
rm -rf node_modules package-lock.json
npm --prefix frontend install
npm --prefix backend install
```

## Build for Production

```bash
npm --prefix frontend build
```

The build output will be in `frontend/build/`.
