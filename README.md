# Driver Dashboard - Uber Eats Style Admin Panel

A full-stack web application for managing delivery drivers with admin authentication.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: bcrypt

## Features

- ✅ Admin login with email/password
- ✅ Driver list with table (desktop) and card (mobile) views
- ✅ Filter drivers by status: Alle, Active, Onboarding
- ✅ Add new drivers
- ✅ Edit existing drivers
- ✅ Delete drivers
- ✅ Fully responsive UI

## Installation

```bash
npm install
```

## Running the Application

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

Open your browser to `http://localhost:3000`

## Default Login Credentials

- **Email**: admin@example.com
- **Password**: admin123

## Project Structure

```
driver-dashboard/
├── server/
│   ├── index.js          # Express API server
│   └── database.db       # SQLite database (auto-generated)
├── src/
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Login.css
│   │   ├── Dashboard.tsx
│   │   ├── Dashboard.css
│   │   ├── DriverList.tsx
│   │   ├── DriverList.css
│   │   ├── AddDriverModal.tsx
│   │   ├── EditDriverModal.tsx
│   │   └── Modal.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## API Endpoints

- `POST /api/login` - Admin authentication
- `GET /api/drivers` - Get all drivers (with optional status filter)
- `GET /api/drivers/:id` - Get single driver
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

## Driver Status Options

- **Active** - Driver is actively delivering
- **Onboarding** - Driver is in training/onboarding process

## Filter Options

- **Alle** - Shows ALL drivers (no filtering)
- **Active** - Shows only active drivers
- **Onboarding** - Shows only onboarding drivers
