# BOOKHAVEN

> A calmer, clearer way to run a library.

[![Live portal](https://img.shields.io/badge/Explore%20the%20live%20portal-Bookhaven-2f6b2f?style=for-the-badge&logo=vercel&logoColor=white)](https://book-heaven-beige.vercel.app/login)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**BOOKHAVEN** is an academic library management system designed around the everyday rhythm of a real library: discover a title, locate it on the shelf, issue it to the right member, and bring it home again without losing the story in paperwork. It gives students a welcoming place to explore the collection and gives library teams a focused workspace for catalog, member, and circulation operations.

**[Open Bookhaven](https://book-heaven-beige.vercel.app/login)** · **[Browse the repository](https://github.com/SQUADRON-LEADER/BookHeaven)**

![Bookhaven sign-in experience](screenshot/Screenshot%202026-10-08%20223258.png)

## Why Bookhaven?

Libraries work best when their software feels almost invisible. Bookhaven replaces scattered registers and difficult-to-scan tables with a single, readable workspace. The interface keeps essential details close at hand—availability, shelf locations, borrower limits, dates, and fines—so staff can act confidently while readers spend more time with books.

The project pairs a rich React interface with an Express and MongoDB API. It also includes a polished in-browser management experience with realistic sample data, making the system easy to demonstrate and evaluate without a lengthy setup.

## At a glance

| For readers and staff | What it makes easier |
| --- | --- |
| **A searchable catalog** | Find titles by name, author, ISBN, publication, category, or stock status. |
| **Thoughtful inventory controls** | Add, update, inspect, and remove catalog records with duplicate ISBN protection. |
| **Member records** | Maintain patron profiles, departments, borrowing limits, and circulation history. |
| **Issue and return desk** | Create loans, check availability and limits before issuing, and restore stock on return. |
| **Automatic overdue handling** | Surface late loans and calculate daily fines during check-in. |
| **Role-aware journeys** | Support user, librarian, and administrator access through authentication and protected API routes. |
| **Operational visibility** | See circulation, stock, overdue items, and activity from the dashboard and transaction history. |

## A quick tour

### 1. Enter a library that feels welcoming

The institutional sign-in and registration flow sets a clear starting point for patrons, librarians, and administrators. A quiet library backdrop, accessible form controls, and direct next steps make the first interaction feel intentional rather than transactional.

### 2. Keep the catalog trustworthy

The catalog is built for more than browsing. Staff can filter records, inspect stock and shelf positions, move into issue flows, and edit a book without leaving the context of the collection. Form validation protects core catalog data such as unique ISBNs.

![Catalog inventory with search, filters, stock, and actions](screenshot/Screenshot%202026-10-08%20223852.png)

### 3. Make circulation a conversation, not a calculation

At the circulation desk, Bookhaven checks the selected member, active loans, loan duration, and book availability before a loan is authorized. On return, it surfaces due dates and calculates any overdue amount so the decision is visible and traceable.

### 4. Give every member a useful history

Member profiles keep contact information, department, borrowing allowance, current loans, and past activity in one place. That makes it easier to answer the question libraries hear every day: “What do I have out, and when is it due?”

## Product highlights

- **Catalog management** — Create, edit, view, search, filter, and remove titles while tracking total and available copies.
- **Stock-aware issuing** — Avoid issuing unavailable items and maintain available-copy counts as circulation changes.
- **Borrowing limits** — Validate a member’s current loans against their configured allowance before issuing a book.
- **Fine calculation** — Compute overdue days and charges during returns; the demonstration workspace uses a ₹5/day policy.
- **Member administration** — Register patrons, store institutional details, review loan history, and guard against duplicate member IDs.
- **Clear feedback** — Success, warning, and validation messages keep each action understandable.
- **Responsive, focused UI** — A green academic visual system, readable data tables, dialogs, and keyboard-friendly controls keep dense library work approachable.
- **API foundations** — JWT authentication, bcrypt password hashing, MongoDB/Mongoose persistence, Cloudinary uploads, and Nodemailer-powered password recovery are available in the backend.

## Technology

| Layer | Tools |
| --- | --- |
| Client | React 19, Vite 6, React Router, React Icons, React Hook Form, Axios |
| Interface | Bootstrap / React Bootstrap, custom CSS, React Toastify, Framer Motion, Chart.js |
| Server | Node.js, Express, Mongoose, JWT, bcryptjs, CORS, dotenv |
| Services | MongoDB, Cloudinary, Nodemailer |

## Project structure

```text
BookHeaven/
├── frontend/                 # Vite + React application
│   └── src/
│       ├── components/       # Navigation, footer, notifications, UI helpers
│       ├── context/          # Library state and demo data operations
│       ├── pages/            # Dashboard, catalog, members, circulation, history
│       └── utils/            # API configuration and auth helpers
├── backend/                  # Express + MongoDB API
│   ├── controller/           # User, catalog, librarian, admin, and dashboard logic
│   ├── model/                # Mongoose models
│   ├── routes/               # API route definitions
│   ├── middlewares/          # JWT and role authorization
│   └── utils/                # Cloudinary, caching, configuration, fine calculation
└── screenshot/               # Product walkthrough captures
```

## Run it locally

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB, either local or Atlas, when running the API with persistence

### 1. Clone and install

```bash
git clone https://github.com/SQUADRON-LEADER/BookHeaven.git
cd BookHeaven

cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure the API

Copy the sample configuration and set a MongoDB connection string:

```bash
cd backend
Copy-Item .env.example .env
```

On macOS or Linux, use `cp .env.example .env` instead. Then update `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library_management
```

For the complete account-recovery and image-upload features, also provide the mail and Cloudinary credentials expected by the server:

```env
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
EMAIL_SERVICE=your_email_service
JWT_SECRET=replace_with_a_long_random_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 3. Start both applications

Open two terminals from the project root.

```bash
# Terminal 1 — API
cd backend
npm start
```

```bash
# Terminal 2 — client
cd frontend
npm run dev
```

Vite will print the local client address, normally `http://localhost:5173`. The frontend reads `VITE_BACKEND_URL` when set; otherwise it uses the deployed API URL. To point it to your local server, create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Quality checks

From `frontend/`, run:

```bash
npm run lint
npm run build
```

The build command produces a production bundle in `frontend/dist`.

## API overview

The Express service is organized around a small set of resources:

| Area | Base path | Purpose |
| --- | --- | --- |
| Accounts | `/users` | Registration, login, password recovery, and profile actions |
| Catalog | `/books` | Book records, issue requests, issued items, and return requests |
| Library team | `/librarian` | Issue and return review, plus issued-book records |
| Administration | `/admin` | Administrator authentication and user management |
| Home metrics | `/home` | Dashboard-facing summaries |

Protected endpoints use a JWT bearer token and role middleware. See the route files in `backend/routes/` for the endpoint-level contract.

## Notes for contributors

- Keep user-facing copy simple and library-specific; it is one of the project’s strongest qualities.
- Treat ISBNs and member IDs as durable identifiers. The interface already prevents duplicates in common workflows.
- Keep stock, circulation status, and transaction history in sync when adding new flows.
- Do not commit `.env` files or service credentials. Start from `backend/.env.example`.

## Experience the portal

The best way to understand Bookhaven is to spend a few minutes with it: search the collection, open a title, look at the issue desk, and trace a member’s story through a return. The application is live here:

### [book-heaven-beige.vercel.app/login](https://book-heaven-beige.vercel.app/login)

Books are personal. Library software should leave room for that feeling.
