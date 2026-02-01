<div align="center">

# ☁️ Weather Analytics Dashboard

**Real-time weather intelligence platform with smart quota management**

[![Live App](https://img.shields.io/badge/🌐_Live_App-weather--analytic.vercel.app-0ea5e9?style=for-the-badge)](https://weather-analytic.vercel.app)
[![API Status](https://img.shields.io/badge/⚡_API-weather--analytic.onrender.com-10b981?style=for-the-badge)](https://weather-analytic.onrender.com)

<br />

<img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-000?style=flat-square&logo=vercel&logoColor=white" />

---

*A full-stack weather analytics platform that delivers real-time forecasts, interactive visualizations, and enterprise-grade API quota management — built for scale, designed for simplicity.*

</div>

<br />

## 🎯 Overview

Weather Analytics Dashboard is a production-ready platform that transforms raw weather data into actionable insights. It combines a sleek, modern interface with a robust backend system that intelligently manages API resources across users and organizations.

Whether you're tracking daily forecasts, analyzing weather trends through interactive charts, or managing multi-user API consumption — this platform handles it all with a focus on performance, security, and user experience.

<br />

## ✨ Key Features

### 🌤️ Weather Intelligence
- **Real-time conditions** — Current temperature, humidity, wind speed, pressure, UV index, and visibility for any city worldwide
- **Multi-day forecasts** — Detailed 3-day forecasts with high/low temperatures, precipitation chances, and wind conditions
- **Global city search** — Instant autocomplete search across thousands of cities with region and country context, plus browser-based geolocation for automatic current location detection
- **Dynamic theming** — Interface adapts visual gradients based on current weather conditions (sunny, rainy, stormy, snowy)
- **Hourly forecasts** — Scrollable hourly weather breakdown with temperature, conditions, and precipitation data

### 📊 Interactive Analytics
- **Temperature trends** — Hourly temperature and "feels like" charts with smooth area visualizations
- **Precipitation analysis** — Rain and snow probability breakdowns across the day
- **Wind monitoring** — Real-time wind speed tracking with directional data
- **Unit flexibility** — Seamless toggle between Celsius and Fahrenheit across all data points

### ⭐ Personalization
- **Favorite cities** — Save and organize frequently tracked locations for one-click access
- **Custom preferences** — Persistent unit settings and display name customization
- **Personalized greetings** — Context-aware welcome messages based on time of day

### 🔐 Authentication & Security
- **Email/password registration** — Secure account creation with encrypted password storage
- **Google OAuth integration** — One-click sign-in powered by Supabase and Google Cloud
- **Password recovery** — Email-based password reset flow with secure tokenized links
- **JWT session management** — Stateless authentication with automatic token handling

### 📈 Smart Quota Management
- **Sliding window rate limiting** — 24-hour rolling window API usage tracking per user
- **Database-driven configuration** — All quota parameters stored in the database, editable without redeployment
- **Real-time usage monitoring** — Users can track their API consumption with visual progress indicators
- **Intelligent pool allocation** — Project-wide quota pool with configurable caps, assignable limits, and reserved buffers

### 🛡️ Administration Panel
- **User management** — View all registered users with their roles, usage stats, and assigned limits
- **Per-user quota control** — Assign custom daily API limits to individual users
- **System configuration** — Modify project-wide settings (free limits, cap percentages, assignable pools) in real time
- **Computed insights** — Live calculations showing project cap, assignable pool, and reserved buffer values
- **Validation safeguards** — Prevents configuration changes that would conflict with existing user allocations

### ⚡ Performance & UX
- **Intelligent caching** — In-memory cache layer for weather data with configurable TTL to minimize external API calls
- **Response optimization** — All weather endpoints return cache status indicators for transparency
- **Debounced search** — City search uses 300ms debouncing to reduce unnecessary API requests
- **Loading states** — Comprehensive loading indicators and disabled states during async operations prevent duplicate requests
- **Backend-driven feedback** — All user notifications (success messages, errors, warnings) are generated by the backend through standardized API responses, ensuring consistency across the application

<br />

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Frontend (Vercel)          Backend (Render)           │
│   ┌─────────────────┐       ┌─────────────────────┐    │
│   │  React 18        │       │  Node.js / Express   │    │
│   │  Redux Toolkit   │◄─────►│  Sequelize ORM       │    │
│   │  Tailwind CSS    │  API  │  JWT Authentication   │    │
│   │  Recharts        │       │  Quota Engine         │    │
│   └─────────────────┘       └──────────┬────────────┘    │
│                                        │                 │
│                              ┌─────────▼─────────┐      │
│                              │  PostgreSQL        │      │
│                              │  (Supabase)        │      │
│                              └─────────┬─────────┘      │
│                                        │                 │
│                              ┌─────────▼─────────┐      │
│                              │  External Services │      │
│                              │  • WeatherAPI.com  │      │
│                              │  • Google OAuth    │      │
│                              │  • Gmail SMTP      │      │
│                              └───────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

<br />

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 18, Vite | UI framework and build tooling |
| **State Management** | Redux Toolkit | Centralized state with async thunks |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Charts** | Recharts | Interactive weather data visualizations |
| **Backend** | Node.js, Express | RESTful API server |
| **ORM** | Sequelize | Database modeling and query management |
| **Database** | PostgreSQL (Supabase) | Persistent data storage with auth support |
| **Authentication** | JWT, Supabase Auth, Google OAuth 2.0 | Multi-strategy secure authentication |
| **Email** | Gmail OAuth2, Nodemailer | Transactional emails for password recovery |
| **Hosting** | Vercel (Frontend), Render (Backend) | Production deployment infrastructure |
| **Weather Data** | WeatherAPI.com | Real-time and forecast weather data provider |

<br />

## 📁 Project Structure

```
weather-analytics/
│
├── backend/
│   ├── config/              # Database, Supabase, and app constants
│   ├── controllers/         # Request handlers for all endpoints
│   ├── middlewares/          # Auth, rate limiting, quota, and error handling
│   ├── models/              # Sequelize models and associations
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic layer (weather, auth, quota, cache, config)
│   ├── utils/               # Response helpers and utility functions
│   └── server.js            # Application entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (layout, cards, charts, common)
│   │   ├── hooks/           # Custom React hooks (auth, debounce)
│   │   ├── pages/           # Route-level page components
│   │   ├── services/        # API service layer with Axios
│   │   ├── store/           # Redux store and feature slices
│   │   └── utils/           # Constants, helpers, and formatters
│   └── index.html           # Application shell
│
└── README.md
```

<br />

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Authenticate with email and password |
| `POST` | `/api/auth/google` | Authenticate via Google OAuth |
| `GET` | `/api/auth/me` | Retrieve current user profile |
| `POST` | `/api/auth/forgot-password` | Request a password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `POST` | `/api/auth/logout` | End current session |

### Weather
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/weather/current` | Get current weather for a city |
| `GET` | `/api/weather/forecast` | Get multi-day forecast |
| `GET` | `/api/weather/search` | Search cities by name |
| `GET` | `/api/weather/quota` | Check personal API usage |

### Favorites
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/favorites` | List saved favorite cities |
| `POST` | `/api/favorites` | Add a city to favorites |
| `DELETE` | `/api/favorites/:id` | Remove a city from favorites |

### Settings
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/settings` | Retrieve user preferences |
| `PUT` | `/api/settings` | Update display name or unit preference |

### Administration
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/admin/users` | View all users with usage details |
| `GET` | `/api/admin/users/:id/quota` | Get detailed quota info for a specific user |
| `PUT` | `/api/admin/users/:id/limit` | Set a custom daily limit for a user |
| `GET` | `/api/admin/quota-stats` | View project-wide quota statistics |
| `GET` | `/api/admin/quota-pool` | View assignable quota pool status |
| `GET` | `/api/admin/config` | View all system configuration values |
| `PUT` | `/api/admin/config` | Update a system configuration value |

### System
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/health` | API health check and status |

<br />

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **PostgreSQL** database (Supabase recommended)
- **WeatherAPI.com** account for API key
- **Google Cloud Console** project for OAuth credentials
- **Gmail** account configured with OAuth2 for transactional emails

### Environment Configuration

Both the backend and frontend require environment variables to be configured before running. Template files are provided as a reference.

**Backend** — requires database connection string, API keys for weather data, JWT secret, email service credentials, and OAuth configuration.

**Frontend** — requires the backend API URL and Supabase project credentials.

> ⚠️ Never commit environment files to version control. Use platform-specific environment variable settings for production deployments.

### Installation

1. Clone the repository
2. Install dependencies for both backend and frontend
3. Configure environment variables for each service
4. Start the backend server (initializes database tables and seeds default configuration)
5. Start the frontend development server

### Deployment

The platform is designed for modern cloud deployment:

- **Frontend** → Vercel (automatic builds from Git, edge network delivery)
- **Backend** → Render (managed Node.js hosting with auto-deploy)
- **Database** → Supabase (managed PostgreSQL with built-in auth infrastructure)

<br />

## 📊 Quota Management System

The platform implements an intelligent, multi-layered quota management system designed to protect API resources while providing flexibility for administrators.

### How It Works

**Project Level** — A global free limit defines the total API calls available. A configurable cap percentage determines how much of that limit is actually usable, with the remainder serving as a safety buffer.

**Assignable Pool** — From the project cap, a configurable percentage becomes the assignable pool — the total daily limit that can be distributed across all users. This creates a reserved buffer between the assignable pool and the project cap for operational safety.

**User Level** — Each user receives a default daily limit upon registration. Administrators can adjust individual user limits at any time, provided the total assigned limits don't exceed the assignable pool.

**Sliding Window** — Usage is tracked on a rolling 24-hour window rather than a fixed daily reset, providing more natural and fair rate limiting.

### Configuration Parameters

| Parameter | Description |
|:----------|:------------|
| Project Free Limit | Total API calls available to the project |
| Project Cap Percent | Percentage of the free limit that can be used |
| Assignable Percent | Percentage of the cap available for user allocation |
| Default User Limit | Daily limit assigned to new users on registration |
| Cache TTL | Duration for in-memory cache of configuration values |

All parameters are stored in the database and can be modified through the admin panel without requiring redeployment.

<br />

## 🎨 Design Philosophy

The interface follows a **glass-morphism** design language with a dark-first approach, featuring translucent surfaces, subtle backdrop blurs, and gradient accents that respond to weather conditions. Typography pairs **Outfit** (display headings) with **DM Sans** (body text) for a modern, readable aesthetic.

Every interaction is designed to feel responsive — from animated weather cards and smooth chart transitions to context-aware search dropdowns and real-time quota progress bars. All interactive elements feature comprehensive loading states with proper disabled states during async operations, preventing duplicate requests and providing clear visual feedback.

**Centralized Messaging Architecture** — The application implements a backend-driven user feedback system where all notifications (success messages, errors, warnings) are generated by the backend and delivered through standardized API responses. The frontend contains no hardcoded user-facing messages, ensuring consistency, enabling easy localization in the future, and maintaining a single source of truth for all user communications.

<br />

## 🔒 Security Considerations

- All passwords are hashed using bcrypt with configurable salt rounds
- JWT tokens are used for stateless session management
- API endpoints are protected with authentication and role-based access control
- Rate limiting is applied at both the general and authentication endpoint levels
- Input validation is enforced on all endpoints using schema-based validation
- CORS is configured to allow only authorized frontend origins
- Sensitive configuration is stored in environment variables, never in source code

<br />

## 🗺️ Roadmap

- [ ] Multi-language support for global accessibility
- [ ] Push notifications for severe weather alerts
- [ ] Historical weather data analysis and trend comparison
- [ ] Dark/light theme toggle
- [ ] Mobile application (React Native)
- [ ] Export weather reports as PDF
- [ ] Webhook integrations for external services
- [ ] Organization-level team management

<br />

## 👤 Author

**Tarun Vashisth**

Built with passion for clean architecture and thoughtful user experiences.

<br />

---

<div align="center">

*Made with ☁️ and a lot of ☕*

</div>