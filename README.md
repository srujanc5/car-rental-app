# 🚗 Car Rental Booking App

A full-stack car rental booking application built using **Next.js 15**, **MongoDB**, **Clerk Authentication**, **Tailwind CSS**, and **Shadcn/UI**. This project showcases a modern, user-friendly interface for browsing, booking, and managing car rentals.

---

## ✨ Features

- 🔐 **User Authentication** using [Clerk.dev](https://clerk.dev)
- 🚙 **Browse Cars** with images, prices, and location info
- 📅 **Book a Car** for a specific date range
- 💵 **Dynamic Price Calculation** based on rental duration
- ✅ **Booking Confirmation** and validation
- 📋 **My Bookings Dashboard** to view, cancel, and track status
- 📊 **Status Tags** (Upcoming, Active, Completed, Cancelled)
- 💻 **Responsive Design** – works beautifully on all screen sizes
- 🧠 **Smart API Layer** using Next.js route handlers

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn/UI
- **Backend**: API Routes with MongoDB & Mongoose
- **Authentication**: Clerk
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS + Lucide Icons

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/srujanc5/car-rental-app.git
cd car-rental-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

- Check .env.example file

### 4. Run the script to load car details into db

```bash
node scripts/importCars.mjs
```

### 4. Run the development server

```bash
npm run dev
```
