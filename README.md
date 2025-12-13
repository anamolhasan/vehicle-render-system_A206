# Vehicle Rental Management System

**Live Deployment:** 


---

## Project Description

This is a Vehicle Rental Management System built using **Node.js**, **Express**, **PostgreSQL**, and **TypeScript**. The system allows users to register, login, book vehicles, and manage vehicle availability. Admin users can manage vehicles, users, and bookings while regular customers can browse vehicles and create bookings.

---

## Features

- User Authentication (Sign Up & Signin)
- Role-based Access Control (Admin & Customer)
- CRUD operations for Vehicles
- Bookings management:
  - Create bookings
  - Cancel bookings (Customer)
  - Return vehicles (Admin)
  - Auto-return expired bookings
- Validation and error handling for all operations
- Availability status of vehicles
- PostgreSQL Database with relational integrity

---

## Technology Stack

[![Live Deployment](https://img.shields.io/badge/Live-Deployment-blue)](https://vehicles-sh2d0wa51-devanwarul-3537s-projects.vercel.app/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express-black?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/Authentication-JWT-yellow?logo=jsonwebtokens&logoColor=black)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)]()
[![bcryptjs](https://img.shields.io/badge/Library-bcryptjs-orange)]()
[![dotenv](https://img.shields.io/badge/Library-dotenv-green)]()

---

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs
- **Environment Management:** dotenv
- **Deployment:** Vercel (Live URL)

---

## Setup & Usage

### 1. Clone the repository

```bash
git clone 
cd P-A-2
```

### 2. Install dependencies

```bash

npm install
```

### 3. Configure Environment Variables

Create a .env file in the root directory:

env
PORT=5000
CONNECTION_STRING=<PostgreSQL_Connection_String>
SECRET_JWT=<Secret_JWT_Key>

### 4. Run the Project

```bash
npm run dev
The server will start at http://localhost:5000.
```

## API Endpoints

Auth

```
Signup: POST /api/v1/auth/signup (Register new user account)

Signin: POST /api/v1/auth/signin (Login and receive JWT token)
```

Users

```
Get All Users: GET /api/v1/users (Admin View all users in the system)

Update User: PUT /api/v1/users/:id (Admin Update any user's role or details & Customer Update own profile only)

Delete User: DELETE /api/v1/users/:id (Admin Delete user (only if no active bookings exist))
```

Vehicles

```
Create Vehicle: POST /api/v1/vehicles (Admin Add new vehicle with name, type, registration, daily rent price and availability status)

Get All Vehicles: GET /api/v1/vehicles (Public View all vehicles in the system)

Get Single Vehicle: GET /api/v1/vehicles/:id (Public View specific vehicle details)

Update Vehicle: PUT /api/v1/vehicles/:id ( Admin  Update vehicle details, daily rent price or availability status)

Delete Vehicle: DELETE /api/v1/vehicles/:id (Admin Delete vehicle (only if no active bookings exist))
```

Bookings

```
Create Booking: POST /api/v1/bookings ( Customer or Admin ,Admin & Customer Create booking with start/end dates *• Validates vehicle availability *• Calculates total price (daily rate × duration) *• Updates vehicle status to "booked")

Get All Bookings: GET /api/v1/bookings (Role-based, Admin: View all bookings, Customer: View own bookings only)

Update Booking: PUT /api/v1/bookings/:id ( Role-based, Customer: Cancel booking (before start date only) Admin: Mark as "returned" (updates vehicle to "available") System: Auto-mark as "returned" when period ends)

Auto Return Bookings: PUT /api/v1/bookings/auto-return (Admin)
```

Submission

```bsh
GitHub Repo: 

Live Deployment: 
```
