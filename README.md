# Kamalesh D — DevOps Portfolio

A modern, dark-themed personal portfolio site built with a **3-tier architecture**: Next.js frontend, Go backend, and SQLite database.

![Portfolio Hero](https://github.com/user-attachments/assets/cc1213c1-a473-4e03-8123-e3ca61e4ec04)

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────┐
│   Next.js   │────▶│   Go API    │────▶│  SQLite  │
│  Frontend   │     │   Backend   │     │    DB    │
│  (Port 3000)│     │  (Port 8080)│     │          │
└─────────────┘     └─────────────┘     └──────────┘
```

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Go with Gorilla Mux, SQLite3, CORS middleware
- **Database**: SQLite with auto-seeded portfolio data

## Features

- 🎨 **Matte & Glossy Black Theme** — DevOps-inspired dark UI with cyan/purple accents
- 🖥️ **Terminal-Style Elements** — About section styled as a terminal window
- ✨ **Smooth Animations** — Framer Motion scroll-triggered animations throughout
- 📝 **Custom Blog CMS** — Full CRUD blog with markdown rendering
- 📡 **Medium RSS Integration** — Fetches and displays Medium articles via RSS feed
- 🛠️ **Skills Dashboard** — Animated skill bars grouped by category with tech icons
- 💼 **Experience Timeline** — Alternating timeline layout for work history
- 🚀 **Project Showcase** — Glass-morphism cards for featured projects
- 📬 **Contact Form** — Working contact form backed by SQLite storage
- 📱 **Fully Responsive** — Mobile-first design with hamburger navigation

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- npm

### Backend

```bash
cd backend
go mod tidy
go run main.go
```

The API server starts at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

### Environment Variables

| Variable              | Default                        | Description          |
|-----------------------|--------------------------------|----------------------|
| `PORT`                | `8080`                         | Backend API port     |
| `DB_PATH`             | `./portfolio.db`               | SQLite database path |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api`     | Backend API URL      |

## API Endpoints

| Method   | Endpoint            | Description                |
|----------|---------------------|----------------------------|
| `GET`    | `/api/health`       | Health check               |
| `GET`    | `/api/profile`      | Get profile info           |
| `GET`    | `/api/skills`       | List all skills            |
| `GET`    | `/api/experiences`  | List work experiences      |
| `GET`    | `/api/projects`     | List projects              |
| `GET`    | `/api/blog`         | List published blog posts  |
| `GET`    | `/api/blog/:slug`   | Get single blog post       |
| `POST`   | `/api/blog`         | Create blog post           |
| `PUT`    | `/api/blog/:slug`   | Update blog post           |
| `DELETE` | `/api/blog/:slug`   | Delete blog post           |
| `GET`    | `/api/medium`       | Fetch Medium RSS feed      |
| `POST`   | `/api/contact`      | Submit contact message     |

## Tech Stack

**Frontend:** Next.js, TypeScript, Tailwind CSS, Framer Motion, React Icons, React Markdown

**Backend:** Go, Gorilla Mux, go-sqlite3, rs/cors

**Database:** SQLite3
