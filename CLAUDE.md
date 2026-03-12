# CLAUDE.md — ThePhoneHub.in (B2C Refurbished Smartphones)

Documentation for AI agents working on ThePhoneHub.in project. This document serves as the primary technical guide for architecture, coding standards, and local development.

## Project Overview
ThePhoneHub.in is a B2C e-commerce platform specializing in certified refurbished, pre-owned, and open-box smartphones. The platform uses a decoupled architecture with a React SPA and a Laravel REST API.

---

## Tech Stack & Architecture
- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Backend**: PHP 8.2, Laravel 11 (API-only mode)
- **Database**: MySQL 8.0 (XAMPP or Laragon)
- **Environment**: Strict local development on `localhost`. 
  - **Do NOT** use Docker, Kubernetes, or any cloud services.
  - **FE URL**: `http://localhost:5173`
  - **BE URL**: `http://localhost:8000`

---

## Folder Structure
- `/frontend`: React.js SPA (Vite dev server)
- `/backend`: PHP Laravel 11 RESTful API

---

## Coding Conventions

### Backend (PHP/Laravel)
- **Standard**: Follow PSR-12 coding standards.
- **API Versioning**: All endpoints must be versioned under `/api/v1/`.
- **Database**: 
  - Use Laravel Migrations exclusively for schema changes.
  - Use Seeders for populating local test data (`php artisan db:seed`).
  - Atomic stock decrements using `DB::transaction`.
- **Auth**: Stateless JWT-based authentication using `tymon/jwt-auth`.
- **Validation**: Strict request validation using Laravel Form Requests or Validator.
- **Security**: 
  - Customer PII encrypted via Laravel `Crypt` (AES-256-CBC).
  - Passwords hashed with `bcrypt` (cost 12).

### Frontend (React/JS)
- **Standard**: Airbnb JavaScript Style Guide + Prettier.
- **State Management**: 
  - Server State: TanStack Query v5 (React Query).
  - Global UI/Auth State: React Context API + `useReducer`.
- **Forms**: React Hook Form + Zod for schema validation.
- **Styling**: Tailwind CSS 3 (Mobile-first approach).
- **SEO**: `react-helmet-async` for dynamic meta tags.
- **Data Fetching**: Axios instances configured with `baseURL: http://localhost:8000/api/v1/`.

---

## Local Development Commands

### Backend Setup & Run
```bash
cd backend
composer install
php artisan migrate --seed
php artisan serve              # Port 8000
php artisan queue:work         # Background jobs
php artisan telescope:install  # Debugging UI at /telescope
```

### Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev                    # Port 5173
```

---

## External Integrations (Local Behavior)
- **Payments**: Razorpay integrated in **Test Mode** only.
- **OTP/SMS**: MSG91/SendGrid mocked locally — all logs go to `backend/storage/logs/laravel.log`.
- **Logistics**: Shiprocket API uses static mocked responses.
- **Pincodes**: Validated against local `pin_codes` MySQL table (pre-seeded).

---

## Troubleshooting & Debugging
- **API Logs**: Check `backend/storage/logs/laravel.log`.
- **DB Queries**: Use Laravel Telescope or Laravel Debugbar.
- **Network Errors**: Ensure CORS is configured in `backend/config/cors.php` to allow `http://localhost:5173`.
