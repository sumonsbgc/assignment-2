## Project Name & Live URL

**Project Name:** Vehicle Rental System (Assignment 2)

**Live URL:** [Add your deployed URL here]

## Features & Technology Stack

### Features

- User authentication (Register/Login) with JWT
- Vehicle management (CRUD operations)
- Booking system for vehicles
- Role-based authorization (Admin/Customer)
- Automatic booking status updates via cron jobs

### Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT & bcrypt
- **Cron Jobs:** node-cron npm package

## Setup & Usage Instructions

### Prerequisites

- Node.js (v22+)
- PostgreSQL database

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd assignment-2
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file with your database credentials

   ```env
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_secret_key
   PORT=your_port
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

### API Endpoints

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | /auth/register | Register a new user |
| POST   | /auth/login    | Login user          |
| GET    | /vehicles      | Get all vehicles    |
| POST   | /bookings      | Create a booking    |
| GET    | /users         | Get user profile    |
