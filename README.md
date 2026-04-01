<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a45f52b (payment-integrated)
ThePhoneHub.in
Refurbished Smartphone E-Commerce Platform
SOFTWARE REQUIREMENTS SPECIFICATION
Document Type	Software Requirements Specification (SRS)
Standard	IEEE 830-1998 / ISO/IEC 25010
Version	1.0 — Initial Release
Status	Draft for Review
Frontend Stack	HTML5, CSS3, JavaScript (ES6+), React.js 18, Vite 5, Tailwind CSS 3
Backend Stack	PHP 8.2, Laravel 11 (REST API), MySQL 8.0
Local Dev Stack	XAMPP 8.2 or Laragon 6 (no cloud / Docker required)
Prepared For	ThePhoneHub.in — Development Team
Prepared By	Business Analyst / Product Team
Date	February 2026
Confidentiality	Internal / Confidential
 
1. Introduction
1.1 Purpose
This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for ThePhoneHub.in e-commerce platform. It is the authoritative reference for developers, QA engineers, project managers, and all stakeholders. All system changes must be reconciled against this document.

1.2 Scope
ThePhoneHub.in is a B2C e-commerce web platform specialising in certified refurbished, pre-owned, and open-box smartphones and accessories. The entire system is designed to run on a local development machine (XAMPP or Laragon) without any cloud or Docker dependencies during development.
In Scope — Version 1.0:
•	Customer-facing storefront: product catalog, search, cart, checkout, order tracking
•	Backend administration panel: inventory, order management, user management
•	Payment gateway integration for Indian payment methods (Razorpay test mode locally)
•	Warranty management system
•	Notification system: SMS, Email, WhatsApp (logged locally, live in production)
•	Customer support interface

Out of Scope — Version 1.0:
•	Native mobile applications (iOS / Android)
•	AI-powered live chat support
•	Trade-in / buy-back system
•	User-generated reviews
•	EMI calculator integration

1.3 Definitions, Acronyms, and Abbreviations
Term	Definition
SRS	Software Requirements Specification
B2C	Business to Consumer
API	Application Programming Interface
OTP	One-Time Password
PCI-DSS	Payment Card Industry Data Security Standard
SKU	Stock Keeping Unit — unique product variant identifier
CDN	Content Delivery Network
SSL/TLS	Secure Sockets Layer / Transport Layer Security
WCAG	Web Content Accessibility Guidelines
COD	Cash on Delivery
UPI	Unified Payments Interface (India)
GSTIN	Goods and Services Tax Identification Number
EDD	Estimated Delivery Date
AWB	Airway Bill — shipment tracking number
SPA	Single Page Application — React frontend loaded client-side
REST	Representational State Transfer — PHP API architecture style
JWT	JSON Web Token — stateless authentication standard
ORM	Object-Relational Mapper — Laravel Eloquent for MySQL
XAMPP	Cross-platform local dev stack: Apache, MySQL, PHP (no cloud needed)
Laragon	Lightweight local dev environment for Windows (alternative to XAMPP)
Vite	Modern build tool that bundles React, JS, and CSS for the browser
Composer	PHP dependency manager (installs Laravel and PHP packages)
Like New	Device condition: no visible signs of use
Good	Device condition: light wear, fully functional
Open Box	Unsealed in original packaging, never used

1.4 References
•	ThePhoneHub.in — Product Requirement Document (PRD) v1.0
•	IEEE Std 830-1998: Recommended Practice for SRS
•	ISO/IEC 25010:2011 — Systems and Software Quality Requirements
•	RBI Guidelines on Payment Aggregators and Payment Gateways (India)
•	Information Technology Act, 2000 (India)
•	WCAG 2.1 AA — Web Content Accessibility Guidelines

1.5 Document Overview
•	Section 1: Introduction — purpose, scope, definitions
•	Section 2: Overall Description — product perspective, features, constraints
•	Section 3: Functional Requirements — detailed feature specifications
•	Section 4: External Interface Requirements — UI, software, communication interfaces
•	Section 5: Non-Functional Requirements — performance, security, reliability
•	Section 6: System Architecture — local setup guide, component architecture, data flow
•	Section 7: Data Requirements — MySQL tables, retention policy
•	Section 8: Error Handling — HTTP errors, payment errors
•	Section 9: Appendices — user stories, traceability matrix
 
2. Overall Description
2.1 Product Perspective
ThePhoneHub.in is a greenfield standalone platform using a decoupled architecture. The React.js SPA (Vite dev server on localhost:5173) acts as the presentation layer and the PHP 8.2 Laravel 11 RESTful API (php artisan serve on localhost:8000) acts as the application and business logic layer. MySQL 8.0 (bundled in XAMPP / Laragon) is the data layer. The React frontend communicates with the PHP API over HTTP on localhost during development. All external service calls — Razorpay, MSG91, SendGrid, Shiprocket — use test/sandbox keys locally and log to the Laravel log file.

2.2 Product Features Summary
Feature Group	Key Capabilities	Priority
User Authentication	Registration, Login, OTP, JWT sessions, Password Reset	High
Product Catalog	Grid listing, Multi-filter, MySQL FULLTEXT Search, Condition Grading	High
Product Detail Page	Image gallery, Specs, Warranty info, Pincode checker, Variants	High
Shopping Cart	Add/Remove, Persistent cart, Coupon codes, Price summary	High
Checkout	Address, Pincode validation, Razorpay payment, Order confirmation	High
Order Management	Order history, Real-time status timeline, GST Invoice PDF	High
Admin Panel	Inventory CRUD, Order processing, Coupons, Sales reports	High
Warranty Module	Auto-registration on delivery, Claim submission, Status tracking	Medium
Notifications	Email (SMTP/SendGrid), SMS (MSG91), WhatsApp (logged locally)	Medium
Customer Support	FAQ pages, Contact form, Ticket system	Medium
SEO & Marketing	React Helmet meta tags, Sitemap, Coupon codes, Banners	Medium
Analytics	Traffic, Sales funnel, Abandoned cart reports	Low

2.3 User Classes
2.3.1 Guest User
Unauthenticated visitor. Can browse catalog, view products, and add to a localStorage cart. Can checkout by providing email/phone. No order history or saved addresses.
2.3.2 Registered Customer
Authenticated user with MySQL account. Can save up to 5 addresses, view full order history, download GST invoice PDFs, raise warranty claims, and receive notifications. Authentication via PHP-issued JWT in HTTP-only cookies.
2.3.3 Administrator
Platform staff with access to React Admin Dashboard. Backed by protected PHP API routes with role middleware. Manages inventory, orders, coupons, and reports.
2.3.4 Super Administrator
Privileged user with full system access. Can manage user roles, payment gateway config, and raw MySQL reports. Role enforced at PHP API middleware layer.

2.4 Local Operating Environment
Component	Technology / Tool
Frontend Language	HTML5, CSS3, JavaScript (ES6+)
Frontend Framework	React.js 18.x (SPA) — bundled and served by Vite 5.x
Styling	Tailwind CSS 3.x + CSS Modules for component-level styles
Form Handling & Validation	React Hook Form + Zod schema validation
Server State / API Caching	React Query (TanStack Query v5)
Global State (cart/auth)	React Context API + useReducer
SEO / Meta Tags	React Helmet Async
Frontend Dev Server	Vite on http://localhost:5173 with HMR (Hot Module Replacement)
Backend Language	PHP 8.2
Backend Framework	Laravel 11.x — API-only mode (no Blade views, no sessions)
ORM	Laravel Eloquent ORM for all MySQL queries
Authentication	tymon/jwt-auth package for JWT; bcrypt (cost 12) for passwords
Database	MySQL 8.0 — bundled in XAMPP or Laragon
PDF Generation	barryvdh/laravel-dompdf for invoices and packing slips
Queue Driver (local)	database — jobs stored in MySQL jobs table; run: php artisan queue:work
HTTP Client	Guzzle HTTP (bundled with Laravel) for external API calls
Debugging (local)	Laravel Telescope + Laravel Debugbar
Local Web Server	Apache 2.4 (XAMPP) or Nginx (Laragon); Laravel on php artisan serve :8000
Package Manager (FE)	npm 10.x
Package Manager (BE)	Composer 2.x
Local Dev Stack	XAMPP 8.2 (Windows/macOS/Linux) or Laragon 6 (Windows)
Node.js (required)	Node.js 20.x LTS — for Vite and npm packages only
Supported Browsers	Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

2.5 Design and Implementation Constraints
•	The entire platform must run on localhost using XAMPP or Laragon with zero cloud or Docker dependency during development.
•	React frontend (Vite) on localhost:5173; Laravel API on localhost:8000. Laravel CORS middleware configured to allow origin http://localhost:5173.
•	All customer PII encrypted in MySQL using Laravel Crypt facade (AES-256-CBC).
•	GST invoice PDFs generated server-side via barryvdh/laravel-dompdf. No external PDF service required.
•	Product images stored in Laravel storage/app/public and served via php artisan storage:link — no S3 or CDN required locally.
•	Razorpay integrated in test mode locally. No real payments processed during development.
•	All PHP API endpoints versioned under /api/v1/ and auto-documented with Laravel Scribe (php artisan scribe:generate).
•	MySQL schema managed entirely via Laravel migrations — run php artisan migrate to set up the full database in one command.
•	React frontend build output (dist/) is pure static HTML/CSS/JS — deployable to any web host without a Node.js server.

2.6 Assumptions and Dependencies
•	Developer machine has XAMPP 8.2 or Laragon 6 installed (includes PHP 8.2, MySQL 8.0, Composer 2).
•	Node.js 20.x and npm 10.x installed separately for React/Vite frontend development.
•	Razorpay test-mode API keys (key_id, key_secret) available in backend .env file.
•	MSG91 and SendGrid integrations use Laravel log mail driver locally — emails appear in storage/logs/laravel.log.
•	Shiprocket API mocked with hardcoded static responses during local testing.
•	Product images provided by content team at minimum 800x800px resolution.
•	Laravel seeders pre-populate MySQL with realistic dummy data for local testing (php artisan db:seed).
 
3. Functional Requirements
3.1 User Authentication & Account Management
3.1.1 User Registration
PHP Laravel API handles OTP generation (stored in MySQL otp_verifications table), JWT issuance, and bcrypt password hashing. React renders forms with client-side Zod validation.

Req ID	Requirement	Priority
AUTH-001	React registration form with fields: Full Name, Mobile Number, Email, Password, Confirm Password. Zod schema validates client-side before API call.	High
AUTH-002	PHP API generates a 6-digit OTP, stores it in otp_verifications MySQL table with a 10-minute expires_at, and sends via MSG91 (logged locally).	High
AUTH-003	OTP expires after 10 minutes. New OTP can be requested after 60 seconds. PHP deletes old OTP on new request.	High
AUTH-004	PHP Laravel Validator enforces: min 8 chars, 1 uppercase, 1 number, 1 special character. Returns 422 on failure.	High
AUTH-005	PHP returns 409 if email or mobile already exists in users table (unique index at MySQL level).	High
AUTH-006	On successful registration, PHP dispatches a Laravel queued mail job (database queue driver locally) to send a welcome email.	Medium

3.1.2 User Login
Req ID	Requirement	Priority
AUTH-010	PHP API authenticates via email + password or mobile + password. Returns signed JWT access token (15-min expiry) and refresh token (30-day, HTTP-only cookie).	High
AUTH-011	OTP login: React sends mobile, PHP generates OTP, user submits OTP, PHP verifies and issues JWT.	High
AUTH-012	After 5 failed login attempts, PHP locks account for 15 minutes (tracked in login_attempts MySQL table).	High
AUTH-013	React stores JWT access token in memory only (not localStorage). Refresh token in HTTP-only cookie refreshes session silently.	High
AUTH-014	Google OAuth 2.0 social login — Phase 1.5, out of scope for Version 1.0.	Low

3.1.3 Password Recovery
Req ID	Requirement	Priority
AUTH-020	Forgot Password: user submits email or mobile. PHP sends reset link with token stored in password_resets MySQL table.	High
AUTH-021	Reset link valid for 1 hour. PHP deletes token after use or expiry.	High
AUTH-022	On password reset, PHP invalidates all active JWTs for the user by rotating the jwt_secret_key in the users table.	High

3.1.4 User Profile Management
Req ID	Requirement	Priority
AUTH-030	Authenticated users update name, email, profile picture via PATCH /api/v1/profile. Picture stored in storage/app/public/avatars.	High
AUTH-031	Users manage up to 5 delivery addresses via /api/v1/addresses (add, edit, delete, set default). Stored in addresses MySQL table.	High
AUTH-032	My Orders page fetches paginated order list from MySQL orders table via GET /api/v1/orders.	High
AUTH-033	Password change requires current password verification. PHP re-hashes with bcrypt and invalidates all refresh tokens.	High

3.2 Product Catalog
3.2.1 Product Listing
Req ID	Requirement	Priority
CAT-001	React renders product grid: 3 columns desktop (lg:grid-cols-3), 2 tablet (md:grid-cols-2), 1 mobile (grid-cols-1) using Tailwind CSS.	High
CAT-002	Each product card shows: image (Laravel storage URL), brand, model, storage, condition grade badge, discounted price, original MRP, discount %, Add to Cart button.	High
CAT-003	PHP API accepts query params: brand, price_min, price_max, condition, storage, ram, colour. Built as Laravel Eloquent query scopes with MySQL WHERE clauses.	High
CAT-004	PHP API supports sort params: price_asc, price_desc, newest, popularity. Applied as MySQL ORDER BY clauses.	High
CAT-005	PHP API returns total matching count in meta.total response field. React displays Total X results.	Medium
CAT-006	Pagination: 24 products per page via Laravel paginate(24). React shows Load More button calling next page endpoint.	Medium
CAT-007	PHP API marks stock_qty=0 products as out_of_stock. React shows badge and disables Add to Cart button.	High
CAT-008	Admin tags products (Best Seller, Hot Deal, Limited Stock) stored in product_tags table. React overlays badge on product card.	Medium

3.2.2 Product Search
Req ID	Requirement	Priority
SRCH-001	Global React search bar in navbar, present on all pages. Calls GET /api/v1/products/search?q= on input.	High
SRCH-002	PHP performs MySQL FULLTEXT search on brand, model, description columns using MATCH ... AGAINST (IN BOOLEAN MODE).	High
SRCH-003	React debounces input 300ms. Dropdown auto-suggests results after 3+ characters typed.	High
SRCH-004	No results: PHP returns empty array with suggestions from same brand. React displays No results found + suggestions.	Medium
SRCH-005	Search results page supports same filters and pagination as main catalog listing.	Medium
SRCH-006	PHP logs all search queries to search_logs MySQL table (query, user_id, result_count, timestamp).	Low

3.2.3 Product Detail Page (PDP)
Req ID	Requirement	Priority
PDP-001	React renders minimum 4 product images in a CSS carousel with zoom-on-hover. Images fetched from Laravel storage URL paths.	High
PDP-002	PDP displays: model name, brand, SKU, condition grade, colour, storage, RAM, discounted price, MRP, savings, and EDD (from Shiprocket or static locally).	High
PDP-003	Full specs table from PHP API: display, processor, RAM, storage, battery, camera, OS, connectivity, SIM, dimensions, weight.	High
PDP-004	Warranty section shows: 6-month duration, hardware defect coverage, link to warranty claim form.	High
PDP-005	What's in the Box: accessories list from product_accessories MySQL table rendered as a React list.	Medium
PDP-006	Variant selector (storage/colour): React calls GET /api/v1/products/{id}/variants on change and updates price/availability.	High
PDP-007	Pincode checker: user types PIN, React calls GET /api/v1/pincodes/{pin}. PHP queries pin_codes MySQL table and returns EDD and serviceability.	High
PDP-008	Related products: PHP returns 4-8 products from same category. React renders as horizontal scroll carousel.	Medium
PDP-009	React Helmet sets dynamic title, description, OG tags per PDP. JSON-LD structured data added for Google rich results.	Medium

3.3 Shopping Cart
Req ID	Requirement	Priority
CART-001	Authenticated user cart stored in cart_items MySQL table. React syncs on every add/remove via PHP API.	High
CART-002	Guest cart stored in React state and localStorage. Expires after 24 hours via timestamp check on load.	High
CART-003	Add to Cart from listing page and PDP. React updates Context; authenticated users also call POST /api/v1/cart/items.	High
CART-004	Cart page shows: product image, name, condition, storage, unit price, quantity stepper (+/-), line total, remove button.	High
CART-005	Order summary panel: subtotal, Free shipping, coupon discount, GST (18% calculated by PHP), grand total. PHP returns all computed values.	High
CART-006	PHP enforces max qty = 2 per SKU per order. Returns 422 Unprocessable Entity if exceeded. React shows inline error.	High
CART-007	PHP returns stock_qty per SKU. React shows Only X left! warning when stock_qty <= 3.	Medium
CART-008	Coupon code: React calls POST /api/v1/coupons/validate. PHP checks coupons table and returns discount details or error.	High
CART-009	Cart icon in React navbar shows item count badge via cart Context.	High
CART-010	On login, React sends localStorage guest cart to POST /api/v1/cart/merge. PHP merges into MySQL cart_items table.	Medium

3.4 Checkout Process
3.4.1 Delivery Address
Req ID	Requirement	Priority
CHK-001	React multi-step checkout: Step 1 Address, Step 2 Payment, Step 3 Review & Confirm, Step 4 Order Placed.	High
CHK-002	Authenticated users select from saved MySQL addresses or add a new one inline.	High
CHK-003	Address form: Full Name, Mobile, Line1, Line2 (optional), City, State, PIN Code, Country (India default).	High
CHK-004	On PIN blur, React calls GET /api/v1/pincodes/{pin}. PHP queries seeded pin_codes MySQL table and auto-fills City/State.	High
CHK-005	PHP checks serviceable_pincodes table and returns EDD days. React displays expected delivery date.	High
CHK-006	Non-serviceable PIN: React shows inline error. Delivery not available to this area.	Medium

3.4.2 Payment
Req ID	Requirement	Priority
PAY-001	PHP Razorpay SDK creates Razorpay order server-side. React loads Razorpay checkout.js and opens payment modal.	High
PAY-002	Razorpay handles: UPI (GPay, PhonePe, BHIM), Credit/Debit Cards, Net Banking, EMI, COD.	High
PAY-003	COD enabled only for orders below Rs. 15,000 AND PINs in cod_eligible_pincodes MySQL table.	High
PAY-004	React shows PCI-DSS and 256-bit SSL security badges on the payment step.	Medium
PAY-005	On payment failure, PHP retains order in pending status. React shows Retry Payment page with order details.	High
PAY-006	PHP uses Razorpay order UUID as idempotency key to prevent duplicate charges.	High
PAY-007	On payment success, PHP dispatches queued mail and SMS jobs (database driver locally). Notifications sent within 60 seconds.	High

3.4.3 Order Confirmation
Req ID	Requirement	Priority
ORD-001	PHP generates Order ID: TPH-YYYYMMDD-XXXXX (date + zero-padded auto-increment from orders table).	High
ORD-002	React confirmation page: Order ID, items, address, EDD, payment method, amount paid, Download Invoice link.	High
ORD-003	PHP dispatches queued job to email GST invoice PDF (Laravel DomPDF) within 5 minutes.	High
ORD-004	PHP decrements stock_qty atomically: UPDATE products SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ? inside DB::transaction.	High

3.5 Order Management & Tracking
Req ID	Requirement	Priority
TRK-001	My Orders page: React fetches paginated order list from GET /api/v1/orders (authenticated).	High
TRK-002	Each order entry: Order ID, date, items summary, grand total, payment status, delivery status.	High
TRK-003	Order detail page: React renders status timeline (Order Placed, Processing, Shipped, Out for Delivery, Delivered) from order_status_history MySQL table.	High
TRK-004	After shipment creation, PHP stores AWB in orders table. React shows AWB with link to courier tracking page.	High
TRK-005	PHP dispatches SMS/email notification jobs on every order status change (via Laravel model observer).	High
TRK-006	Cancel order: available in Processing status. React calls DELETE /api/v1/orders/{id}. PHP sets status Cancelled, initiates Razorpay refund.	High
TRK-007	Razorpay refund via PHP SDK. PHP logs to refunds table. User notified by email and SMS.	High
TRK-008	Download Invoice: PHP generates PDF on demand via Laravel DomPDF. React provides download link per order.	High

3.6 Warranty Module
Req ID	Requirement	Priority
WAR-001	PHP auto-creates warranty record in warranties MySQL table when order status is set to Delivered. start_date = delivery date, end_date = +6 months.	High
WAR-002	Warranty page: React fetches GET /api/v1/warranties/{orderId} and shows device name, IMEI, purchase date, start/end dates, coverage.	High
WAR-003	Claim form: issue category, description, photo/video upload (PHP validates MIME + size, stores in storage/app/public/claims). POST /api/v1/warranty-claims.	High
WAR-004	PHP sends claim acknowledgement email/SMS with Claim ID within 1 hour via queued job.	High
WAR-005	Covered: hardware defects, screen malfunctions, battery failure below 80%. Not covered: physical/water damage, software issues, screen cracks.	High
WAR-006	Admin can update claim status (Received, Under Review, Approved, Rejected, Resolved) via PATCH /api/v1/admin/warranty-claims/{id}.	High

3.7 Administration Panel
3.7.1 Inventory Management
Req ID	Requirement	Priority
ADM-001	React Admin Dashboard: forms to add/edit/delete products. PHP API CRUD under /api/v1/admin/products with auth + role:admin middleware.	High
ADM-002	Bulk CSV upload: React file picker sends multipart/form-data to PHP. Laravel reads CSV via league/csv, validates rows, bulk-inserts into products table.	Medium
ADM-003	Low stock threshold per SKU stored in products.low_stock_threshold. PHP artisan scheduled command emails admin when stock_qty < threshold.	Medium
ADM-004	Condition grades (Like New, Good, Open Box) in condition_grades lookup table. Admin selects via React dropdown.	High
ADM-005	All product changes logged to inventory_audit_logs MySQL table: admin_id, action, old/new values, timestamp.	Medium

3.7.2 Order Processing
Req ID	Requirement	Priority
ADM-010	Admin Orders: React table with filters (status, date range, payment method, amount). PHP API applies MySQL WHERE from query params.	High
ADM-011	Admin updates order status via PATCH /api/v1/admin/orders/{id}/status. Adds internal notes to order_notes table.	High
ADM-012	PHP generates packing slip HTML and shipping label PDF (DomPDF). React opens in new tab for browser printing.	High
ADM-013	Refunds: Admin clicks Refund in React. PHP calls Razorpay SDK, logs to refunds MySQL table.	High
ADM-014	Daily CSV report: PHP artisan command exports orders CSV. React Admin provides download link.	Medium

3.7.3 Coupon Management
Req ID	Requirement	Priority
CPN-001	Admin creates coupons: React form submits to POST /api/v1/admin/coupons. PHP stores in coupons MySQL table with all parameters.	High
CPN-002	Coupon types: Public (any user), Private (specific user_id in coupons.user_id), First-Order Only (PHP checks if user has prior orders).	Medium
CPN-003	PHP returns 422 if coupon already applied in current session. Checked via order_coupons table.	High
CPN-004	Admin coupon report: React table showing code, total uses, total discount value — from order_coupons JOIN.	Medium

3.8 Notification System
Trigger Event	Email	SMS	WhatsApp
User Registration	Yes	Yes (OTP)	No
Order Placed	Yes	Yes	Yes
Payment Successful	Yes	Yes	No
Payment Failed	Yes	Yes	No
Order Shipped	Yes	Yes (AWB)	Yes
Out for Delivery	No	Yes	Yes
Order Delivered	Yes	Yes	Yes
Order Cancelled	Yes	Yes	No
Refund Initiated	Yes	Yes	No
Warranty Claim Submitted	Yes	Yes	No
Warranty Claim Resolved	Yes	Yes	Yes
Low Stock Alert (Admin)	Yes	No	No
 
4. External Interface Requirements
4.1 User Interface Requirements
•	React 18 SPA styled with Tailwind CSS 3. Mobile-first responsive: sm:640px, md:768px, lg:1024px, xl:1280px breakpoints.
•	Colour palette: Deep Navy (#1A3A5C) for headers, Flame Orange (#E84118) for CTAs, White (#FFFFFF) for backgrounds.
•	Minimum 44x44px touch targets on all interactive elements per WCAG 2.1.
•	React Hook Form + Zod for all forms with real-time inline validation error display.
•	React Router v6 for client-side routing — no full page reloads.
•	React Helmet Async for dynamic meta tags and page titles per route.
•	Tailwind dark: classes used for dark mode support triggered by OS prefers-color-scheme.
•	Navbar sticky (CSS position: sticky / Tailwind sticky top-0) on all pages with cart icon badge.

4.2 Hardware Interfaces
Web-based platform. No hardware integration required. Local developer machine requirements:
•	Minimum 8GB RAM, dual-core CPU, 20GB free disk space
•	XAMPP 8.2 or Laragon 6 installed and running (Apache/MySQL/PHP)
•	Chrome or Firefox browser with DevTools for debugging React and PHP API

4.3 Software Interfaces
System	Interface / Library	Purpose & Local Behaviour
Razorpay	PHP: razorpay/razorpay SDK; JS: checkout.js CDN	Payment processing. Test-mode keys in .env locally. No real charges.
Shiprocket	PHP: Guzzle HTTP client calling Shiprocket REST API	Shipment + AWB. Returns static mocked JSON responses locally.
MSG91	PHP: Guzzle HTTP calling MSG91 REST API	OTP + SMS. Logged to storage/logs/laravel.log locally.
SendGrid / SMTP	Laravel Mail with log driver locally	Transactional emails. Written to laravel.log. Use real SMTP in production.
India Post Pincodes	MySQL pin_codes table (seeded from India Post data)	Pincode lookup. No external API call needed locally.
WhatsApp Business API	PHP: Guzzle HTTP client	Order notifications. Mocked locally — logged to laravel.log.
Google Analytics 4	gtag.js in React public/index.html	Disabled or pointed to test property during local dev.
Meta Pixel	fbq() script in React public/index.html	Disabled during local development.
Cloudflare CDN	DNS proxy (production only)	Not required in local development.

4.4 Communication Interfaces
•	Local: React (localhost:5173) to Laravel API (localhost:8000) over HTTP. Laravel config/cors.php allows origin http://localhost:5173.
•	All API requests use JSON. Laravel API Resources format all responses with consistent data/meta structure.
•	JWT sent in Authorization: Bearer <token> request header. PHP JWT middleware validates on every protected route.
•	Razorpay webhooks: POST /api/v1/webhooks/razorpay. PHP verifies HMAC-SHA256 signature with webhook secret from .env. Use ngrok locally.
•	Email locally via Laravel log driver — check storage/logs/laravel.log. Production uses SendGrid SMTP with SPF/DKIM/DMARC.
•	All Laravel API errors returned as: { success: false, message: string, errors: {} } JSON.
 
5. Non-Functional Requirements
5.1 Performance Requirements
Metric	Target	How to Measure Locally
Page Load Time (LCP)	< 2.5 seconds	Lighthouse tab in Chrome DevTools
Time to First Byte (TTFB)	< 600ms	Chrome DevTools Network tab — first request
First Input Delay (FID)	< 100ms	Chrome DevTools Performance panel
Cumulative Layout Shift (CLS)	< 0.1	Lighthouse CLS audit in Chrome DevTools
Checkout Page Load	< 2 seconds	Manual browser timer or Lighthouse
Search API Response	< 300ms from PHP	Laravel Debugbar query log tab
MySQL Query Time	< 100ms P95	Laravel Debugbar — DB queries panel
Vite HMR Dev Reload	< 500ms	Vite terminal output on file save

5.2 Security Requirements
•	Passwords hashed with PHP bcrypt (password_hash + PASSWORD_BCRYPT) at cost factor 12 via Laravel Hash::make().
•	JWT access tokens expire in 15 minutes. Refresh tokens in HTTP-only, Secure, SameSite=Strict cookies.
•	Laravel CSRF protection enabled. API routes protected by Laravel Sanctum CSRF cookie or custom X-Requested-With header.
•	All MySQL queries via Laravel Eloquent parameterised bindings. No raw SQL string concatenation.
•	File uploads: PHP validates MIME whitelist (jpeg, png, webp, mp4), max 5MB, stored in non-public storage/app/private/claims.
•	Admin routes protected by auth:jwt + role:admin middleware. Super admin routes require role:superadmin.
•	Rate limiting: Laravel throttle middleware — 10 OTP requests per phone/hour, 100 API calls per IP/minute.
•	PHP sets security headers via middleware: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Content-Security-Policy.
•	No card data stored — Razorpay handles all tokenisation. PHP stores only razorpay_order_id and razorpay_payment_id.
•	Customer PII encrypted at rest using Laravel Crypt::encryptString() on sensitive Eloquent model fields.

5.3 Reliability & Availability
Requirement	Target / Local Behaviour
System Uptime (production SLA)	99.5% monthly (excluding scheduled maintenance windows)
Scheduled Maintenance	Sundays 2:00 AM — 4:00 AM IST
Recovery Time Objective (RTO)	< 2 hours on server failure (production)
Recovery Point Objective (RPO)	< 24 hours — daily MySQL dump via mysqldump or phpMyAdmin export
Local DB Backup	Developer exports via: mysqldump -u root thephonehub > backup.sql
Payment Retry (local)	Razorpay test mode — PHP retries order creation up to 2 times on timeout
Error Monitoring (local)	Laravel Telescope UI at http://localhost:8000/telescope + storage/logs/laravel.log
Queue Worker (local)	Run: php artisan queue:work — processes jobs stored in MySQL jobs table

5.4 Usability Requirements
•	Checkout completable in 5 steps / under 3 minutes by a first-time user (tested locally in Chrome).
•	All form error messages in plain English at a Grade 8 reading level.
•	Target System Usability Scale (SUS) score of 75+ / 100 in user testing sessions.
•	Product search accessible from every React page within 1 click (global navbar search bar).
•	WCAG 2.1 Level AA: all images have alt text, colour contrast >= 4.5:1, full keyboard navigation support.

5.5 Scalability Requirements
•	MySQL schema supports 50,000+ product SKUs via indexes on brand, model, price, condition, stock_qty.
•	Laravel API is stateless (JWT). Horizontally scalable behind a load balancer in production without code changes.
•	React build output (dist/) is pure static files — serves from any web host, Nginx, or CDN in production.
•	Laravel queue (database driver locally, Redis in production) handles notification batch sends of 10,000+ messages asynchronously.

5.6 Maintainability
•	PHP follows PSR-12 coding standard. Enforced by PHP_CodeSniffer (composer run lint).
•	React follows Airbnb ESLint rules. Enforced by ESLint + Prettier on file save in VS Code.
•	All MySQL schema changes made via Laravel migrations. Run php artisan migrate to apply all changes.
•	Laravel seeders provide realistic dummy data: php artisan db:seed — no manual SQL inserts needed.
•	Git version control: all migrations, seeders, .env.example, and README committed. .env files in .gitignore.
•	Laravel Telescope installed locally (php artisan telescope:install) for debugging API requests, DB queries, jobs, and mails.
 
6. System Architecture
6.1 High-Level Architecture — Local Development
ThePhoneHub.in uses a decoupled two-app architecture on localhost. The React Vite SPA (port 5173) is the presentation layer. The Laravel PHP API (port 8000, php artisan serve) is the application and business logic layer. MySQL 8.0 (port 3306, bundled in XAMPP/Laragon) is the data layer. All three run side-by-side on the developer's machine. CORS is configured in Laravel to allow cross-origin requests from port 5173 to port 8000.

6.2 Step-by-Step Local Setup Guide
Step	Command / Action	Notes
1	Install XAMPP 8.2 or Laragon 6	Includes PHP 8.2, MySQL 8.0, Apache. Start MySQL and Apache from control panel.
2	Install Node.js 20.x LTS from nodejs.org	Required only for React/Vite. Includes npm 10.x automatically.
3	Install Composer 2.x from getcomposer.org	PHP dependency manager. Required for Laravel packages.
4	git clone <repo-url> && cd thephonehub	Download all project files from Git repository.
5	cd backend && composer install	Installs Laravel 11 and all PHP packages from composer.json.
6	cp .env.example .env	Create local environment config file from template.
7	php artisan key:generate	Generates APP_KEY in .env for Laravel encryption.
8	Edit .env: DB_HOST=127.0.0.1, DB_DATABASE=thephonehub, DB_USERNAME=root, DB_PASSWORD=	Set MySQL connection. Create the database thephonehub in phpMyAdmin first.
9	php artisan migrate	Runs all Laravel migrations — creates every MySQL table automatically.
10	php artisan db:seed	Seeds MySQL with dummy products, users, categories, and pincodes.
11	php artisan storage:link	Creates symlink public/storage -> storage/app/public for image serving.
12	php artisan telescope:install && php artisan migrate	Installs Laravel Telescope for local debugging. Access at /telescope.
13	php artisan serve	Starts Laravel API at http://localhost:8000. Keep terminal open.
14	Open new terminal: cd ../frontend && npm install	Installs React, Vite, Tailwind, and all JS packages from package.json.
15	cp .env.example .env.local	Create React environment config. Set VITE_API_URL=http://localhost:8000
16	npm run dev	Starts Vite dev server at http://localhost:5173 with hot reload.
17	Open new terminal: cd backend && php artisan queue:work	Runs Laravel queue worker to process email/SMS jobs from MySQL jobs table.
18	Open http://localhost:5173 in Chrome browser	Full platform is now running locally. Admin panel at /admin route.

6.3 Component Architecture
Layer	Component	Technology
Presentation	Customer Storefront (SPA)	React 18 + Vite 5 + React Router v6 + Tailwind CSS
Presentation	Admin Dashboard (SPA)	React 18 + Vite 5 + Tailwind CSS (served at /admin route)
Presentation	Forms & Validation	React Hook Form + Zod schema
Presentation	API Data Fetching & Cache	React Query (TanStack Query v5) + Axios HTTP client
Presentation	Global State (cart/auth)	React Context API + useReducer hook
Presentation	SEO / Meta	React Helmet Async
Application	REST API	PHP 8.2 + Laravel 11 — php artisan serve on localhost:8000
Application	Authentication	tymon/jwt-auth JWT tokens + PHP bcrypt
Application	PDF Generation	barryvdh/laravel-dompdf (invoices, packing slips)
Application	Queue System (local)	Laravel Queue — database driver (jobs in MySQL)
Application	Scheduling (local)	Laravel Scheduler — run manually: php artisan schedule:run
Application	CSV Parsing	league/csv for bulk product CSV upload
Application	External HTTP calls	Guzzle HTTP client (bundled with Laravel)
Application	Debugging & Monitoring	Laravel Telescope + Laravel Debugbar
Data	Primary Database	MySQL 8.0 — accessed via phpMyAdmin at http://localhost/phpmyadmin
Data	File Storage (local)	Laravel storage/app/public — served via storage:link symlink

6.4 Data Flow — Order Processing on Localhost
•	Customer adds product: React updates cart Context. If logged in, calls POST /api/v1/cart/items. PHP writes to cart_items MySQL table.
•	Checkout address: React submits form. PHP calls GET /api/v1/pincodes/{pin} and queries seeded pin_codes MySQL table.
•	Payment initiation: PHP Razorpay SDK creates a test order (razorpay_order_id stored in orders table with status=pending). React opens Razorpay modal.
•	Test payment: use Razorpay test card 4111 1111 1111 1111 CVV 123 any future date. Razorpay returns success callback to React.
•	React calls POST /api/v1/orders/{id}/verify with Razorpay payment_id, order_id, signature for server-side HMAC verification.
•	PHP verifies, sets order status=processing, decrements stock_qty atomically, enqueues email/SMS jobs in MySQL jobs table.
•	Queue worker (php artisan queue:work) processes jobs: emails logged to laravel.log, SMS logged to laravel.log.
•	Admin opens localhost:5173/admin, views order, clicks Create Shipment — PHP returns mocked Shiprocket AWB, stores in orders table.
•	PHP dispatches Shipped notification jobs. Queue worker processes them (logged locally).
•	Admin marks order Delivered — PHP auto-creates warranty record in warranties table (start=today, end=today+6months).
 
7. Data Requirements
7.1 MySQL Database Tables
All tables are created by Laravel migrations (php artisan migrate). Prefixed with no prefix by default. Full schema SQL provided in the companion database file.

Table	Key Columns	Purpose & Relationships
users	id, name, email, phone, password, role (customer/admin/superadmin), is_verified, is_locked, created_at	Core user accounts. Role-based access control.
otp_verifications	id, phone, otp_code, expires_at, is_used, created_at	Stores OTPs for registration and OTP login. Purged after 24 hours by scheduler.
login_attempts	id, identifier (email or phone), ip_address, attempted_at, is_successful	Tracks failed logins for account lockout logic (5 fails = 15 min lock).
password_resets	email, token, created_at	Laravel default password reset tokens table.
addresses	id, user_id (FK), name, phone, line1, line2, city, state, pin, is_default, created_at	User saved delivery addresses. Max 5 per user enforced in PHP.
categories	id, name, slug, parent_id (FK self-ref), created_at	Product categories with optional parent for hierarchy.
condition_grades	id, code (A+/A/B/C), label, description	Lookup table for product condition grades.
products	id, sku, category_id (FK), condition_grade_id (FK), brand, model, storage, ram, colour, price, mrp, stock_qty, low_stock_threshold, is_active, description, created_at	Core product/SKU records. FULLTEXT index on brand, model, description.
product_images	id, product_id (FK), image_path, sort_order, is_primary	Image paths in Laravel storage. Served via storage:link symlink.
product_specs	id, product_id (FK), display, processor, battery, camera, os, connectivity, sim_type, dimensions, weight	Technical specifications — one row per product.
product_accessories	id, product_id (FK), item_name	What's in the Box items — multiple rows per product.
product_tags	id, product_id (FK), tag (bestseller / hotdeal / limitedstock)	Promotional badge tags.
product_variants	id, product_id (FK), storage, colour, price, stock_qty	Storage/colour variants for a base product model.
pin_codes	id, pin (unique), city, state, is_serviceable, edd_days	Pre-seeded from India Post data. Queried for pincode validation.
cod_eligible_pincodes	id, pin	PINs eligible for Cash on Delivery.
cart_items	id, user_id (FK), product_id (FK), quantity, created_at	Persistent cart for authenticated users. Guest cart in localStorage.
coupons	id, code (unique), type (percent/flat), value, min_order_value, max_discount, expires_at, usage_limit, used_count, user_id (FK nullable)	Coupon definitions. user_id set for private/single-user coupons.
orders	id, order_number (TPH-YYYYMMDD-XXXXX), user_id (FK), address_id (FK), status, subtotal, discount, gst_amount, grand_total, payment_method, razorpay_order_id, razorpay_payment_id, awb_number, courier, created_at	Master order records.
order_items	id, order_id (FK), product_id (FK), product_name, storage, colour, condition, quantity, unit_price, line_total	Denormalised snapshot of ordered products (preserves product state at time of order).
order_status_history	id, order_id (FK), status, note, changed_by (FK users), created_at	Full audit trail of all order status changes — powers the React timeline.
order_notes	id, order_id (FK), note, added_by (FK users), created_at	Internal admin notes per order.
order_coupons	id, order_id (FK), coupon_id (FK), discount_amount	Applied coupon per order (one-to-one).
payments	id, order_id (FK), gateway (razorpay), razorpay_payment_id, amount, currency, status, gateway_response (JSON), created_at	Payment transaction records.
refunds	id, payment_id (FK), order_id (FK), razorpay_refund_id, amount, type (full/partial), status, initiated_at, completed_at	Refund transaction records.
warranties	id, order_id (FK), product_id (FK), user_id (FK), imei, start_date, end_date, status (active/expired/claimed), created_at	Auto-created when order is marked Delivered.
warranty_claims	id, warranty_id (FK), claim_number, issue_type, description, evidence_paths (JSON), status, resolved_at, created_at	Customer warranty claim submissions.
inventory_audit_logs	id, product_id (FK), admin_id (FK), action, old_stock, new_stock, notes, created_at	Audit trail of all inventory changes by admins.
search_logs	id, user_id (FK nullable), query, result_count, created_at	Analytics log of all search queries.
notification_logs	id, user_id (FK), order_id (FK nullable), channel (email/sms/whatsapp), template, status, sent_at	Delivery log for all notification attempts.
jobs	id, queue, payload, attempts, reserved_at, available_at, created_at	Laravel database queue — queued email/SMS/WhatsApp jobs.
failed_jobs	id, uuid, connection, queue, payload, exception, failed_at	Failed queue jobs — review in Telescope or retry: php artisan queue:retry all

7.2 Data Retention Policy
Data Category	Retention Period	Rationale
Order Records	7 years	GST compliance (India: 6 years + buffer)
Customer PII	3 years post last activity	IT Act 2000 compliance
Payment Logs	7 years	Financial audit requirements
Warranty Records	3 years post warranty expiry	Consumer protection compliance
OTP Records	24 hours — purged by Laravel scheduler	Security — OTPs have no value after 10-minute expiry
Login Attempt Logs	90 days	Security monitoring and IP blocking decisions
Laravel / System Logs	90 days — rotated by Laravel log rotation	Debugging and security monitoring
Notification Logs	1 year	Customer service reference
Search Query Logs	6 months — anonymised after 30 days	Analytics and product planning
Abandoned Cart Data	30 days — purged by Laravel scheduler	Remarketing window
Failed Queue Jobs	30 days — manually reviewed then deleted	Debugging failed notifications
 
8. Error Handling & Exception Management
8.1 HTTP Error Responses
Laravel's app/Exceptions/Handler.php returns all errors as JSON for API routes. React intercepts via an Axios response interceptor and shows toast notifications or inline field errors.

Code	Scenario	User Message (React)	PHP Action
400	Invalid input / bad request	Please check the highlighted fields and try again.	Laravel Validator returns 400 with errors JSON. React Hook Form maps to field errors.
401	JWT expired or missing	Your session expired. Please log in again.	tymon/jwt-auth middleware returns 401. React clears memory token, redirects to /login.
403	Insufficient role	You do not have permission to do this.	Role middleware returns 403. React shows permission denied message.
404	Product or route not found	We could not find what you are looking for.	Laravel returns 404 JSON. React Router renders custom 404 component.
409	Duplicate order or registration	This looks like a duplicate. Please check My Orders.	PHP checks razorpay_order_id uniqueness. Returns 409 to prevent double processing.
422	Pincode not serviceable or validation error	Delivery not available to this PIN code.	Laravel Validator returns 422 with errors. React displays inline error per field.
429	Rate limit exceeded	Too many requests. Please wait 60 seconds and try again.	Laravel throttle middleware returns 429 with Retry-After header.
500	Unexpected PHP/MySQL error	Something went wrong. Check logs for details.	Laravel logs full stack trace to storage/logs/laravel.log. Telescope shows the error.

8.2 Payment Error Handling
Error Type	Handling Strategy
Razorpay Test Timeout	PHP retries Razorpay order creation up to 2 times with 2-second delay. Order remains in pending status in MySQL.
Card Declined (Test)	Razorpay returns error code. PHP maps to user-friendly message. React shows Retry Payment button.
Duplicate Payment	PHP checks razorpay_order_id in payments table before processing. Returns 409 if duplicate found.
Refund Failure	PHP logs to refunds table with status=failed. Admin sees in Dashboard. Can retry via Razorpay Dashboard.
Webhook Not Received (Local)	Use ngrok (ngrok http 8000) to expose localhost:8000 for Razorpay test webhooks. PHP logs all webhook calls in Telescope.
Queue Job Failure	Laravel logs to failed_jobs MySQL table. Retry all: php artisan queue:retry all. View in Telescope.
 
9. Appendices
9.1 Key User Stories
Story ID	As a...	I want to...	So that...
US-001	Guest User	Browse phones by brand and price range	I can find an affordable option without creating an account
US-002	Guest User	Check delivery to my PIN code on the product page	I know if and when I can receive the phone
US-003	Registered Customer	Track my order in real time on a status timeline	I know exactly when my phone will arrive
US-004	Registered Customer	Download my GST invoice as a PDF	I can claim reimbursement from my employer
US-005	Registered Customer	Submit a warranty claim with photo evidence	I do not have to call customer support
US-006	Registered Customer	Cancel my order before it ships	I get a quick refund if I change my mind
US-007	Administrator	Bulk upload new inventory via CSV file	I can add 50 phones at once instead of one by one
US-008	Administrator	View daily sales and revenue reports	I can monitor business performance
US-009	Administrator	Create a coupon code for a festive sale	I can offer targeted discounts and drive conversions

9.2 Requirements Traceability Matrix
Req ID	Requirement Summary	Section	Priority	Status
AUTH-001	React Registration Form + Zod Validation	3.1.1	High	Planned
AUTH-010	Email/Mobile Login + JWT (tymon/jwt-auth)	3.1.2	High	Planned
CAT-001	React Product Grid (Tailwind responsive)	3.2.1	High	Planned
CAT-003	PHP Multi-attribute Filter (Eloquent scopes)	3.2.1	High	Planned
SRCH-002	MySQL FULLTEXT Product Search	3.2.2	High	Planned
PDP-002	Full PDP Content from PHP API	3.2.3	High	Planned
PDP-007	Pincode Checker vs MySQL pin_codes table	3.2.3	High	Planned
CART-006	Max Qty 2 per SKU (PHP enforced, 422)	3.3	High	Planned
CHK-004	PIN auto-fill from MySQL pin_codes	3.4.1	High	Planned
PAY-001	Razorpay PHP SDK + checkout.js (test mode)	3.4.2	High	Planned
PAY-006	Razorpay idempotency key (order UUID)	3.4.2	High	Planned
ORD-001	PHP Order ID Generation (TPH-YYYYMMDD-XXXXX)	3.4.3	High	Planned
ORD-004	Atomic MySQL stock decrement (DB::transaction)	3.4.3	High	Planned
TRK-003	Order Status Timeline (order_status_history table)	3.5	High	Planned
WAR-001	Auto Warranty on Delivery (PHP model observer)	3.6	High	Planned
ADM-002	CSV Bulk Upload (league/csv)	3.7.1	Medium	Planned
ADM-005	Inventory Audit Log MySQL table	3.7.1	Medium	Planned
CPN-001	Coupon CRUD (PHP API + MySQL coupons table)	3.7.3	High	Planned

9.3 Glossary of Condition Grades
Grade	Label	Definition	Visual Criteria
A+	Like New	Device is indistinguishable from new. No scratches or marks.	Zero visible wear on body or screen
A	Excellent	Extremely minor signs of use, invisible from 30cm.	Micro-scratches visible only under direct light
B	Good	Light scratches on body, screen protector recommended. Fully functional.	Light scratches on body; no screen damage
C	Open Box	Unsealed in original packaging. Never used.	Original plastic may be removed; no use marks

9.4 Document Sign-Off
Role	Name	Signature	Date
Product Owner			
Lead Developer			
QA Lead			
Business Stakeholder			

This document is subject to change. All revisions must be approved by the Product Owner and committed to the project Git repository with a version tag.
<<<<<<< HEAD
=======
# thephoneehub
A Refurbished Phone Website
>>>>>>> 2417ca864e24a6d67ecc098717c9e5fa4fe4865f
=======
>>>>>>> a45f52b (payment-integrated)
