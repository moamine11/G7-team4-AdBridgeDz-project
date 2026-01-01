# AdBridgeDZ
**Connecting Businesses with Advertising Experts**  

AdBridgeDZ is a modern platform designed to bridge the gap between Algerian companies and professional advertising agencies. Built with the MERN stack, it helps businesses discover, connect with, and work efficiently with verified advertising agencies using advanced search and filtering.


## Core Features

### Platform Features
Landing page includes hero, team, and FAQ sections with multi-account access for companies and agencies, plus secure authentication via JWT, email, password reset, and Google OAuth.

### User Management
Users can manage profiles, while admins oversee role-based access and agency document verification.

### Agency Features
Agencies get a dashboard for managing services, bookings, profiles, and document verifications.

### Company Features
Companies can search, filter, and discover agency services with location-based results and manage campaigns.

### Admin Features
Admins use a Next.js dashboard to manage users, moderate content, track analytics, and protect routes with JWT.

### UI/UX Features
Design is responsive and mobile-first with smooth Framer Motion animations, dark theme, and interactive elements.

### Technical Features
System uses RESTful API with MVC architecture, database seeding, Cloudinary uploads, email notifications, and secure environment setup.

## Technology Stack

### Frontend (Main App)
Next.js + React (TypeScript) with TailwindCSS, Radix UI, Lucide Icons, React Hook Form + Zod, Framer Motion, and the Next.js App Router.

### Frontend (Admin Dashboard)
Vite + React (TypeScript) using React Router, Axios, and Framer Motion for an interactive admin interface.

### Backend
Node.js + Express with MongoDB/Mongoose, JWT authentication, Cloudinary for file uploads, Nodemailer with Google OAuth, and a REST API using MVC architecture.

### Development Tools
npm, ESLint, TypeScript, PostCSS, Autoprefixer, and stateless JWT-based authentication.

---

## Admin Dashboard (Recommended)

- Use the Next.js admin dashboard route: `/admin/dashboard`.
- Admin API is served from the backend under `/api/admin/*` and requires an Admin JWT.

## Note about `admin-dashboard/`

This repo also contains a separate Vite app in `admin-dashboard/`.
If you are standardizing on Next.js for admin, treat the Vite app as deprecated/internal to avoid duplicating features.


## Agile Development Process

- Scrum-inspired workflow with biweekly sprints and sprint reviews  
- Task tracking using Jira boards  
- Daily asynchronous stand-ups  
- Continuous user feedback  
- Adaptive planning based on real user needs


## Testing

The platform has been manually tested to ensure all features work as expected. This includes:
- Database seeding and verification of test data
- API endpoint validation
- UI components and responsiveness across devices
- Multi-account flows for Companies, Agencies, and Admins


## Getting Started

### Prerequisites
- Node.js v18 or higher [conversation_history:1]  
- MongoDB (local or Atlas) [conversation_history:1]  
- Cloudinary account for file uploads [conversation_history:1]  
- Google OAuth credentials (optional) [conversation_history:1]  

### Installation
```bash
# Clone repository
git clone https://github.com/moamine11/G7-team4-AdBridgeDz-project.git
cd G7-team4-AdBridgeDz-project
```


# Main application
```bash
npm install

# Backend
cd backend
npm install

# Admin dashboard (Vite - optional)
cd ../admin-dashboard
npm install
```

# Environment Setup
 ```bash
cd backend
cp .env.example .env.local
# Configure: MONGO_URI, JWT_SECRET, Cloudinary keys, Google Auth
```

# Database Setup
```bash

cd backend
npm run seed:admin
npm run seed:services
npm run seed:user
```

# Running the Application

# Start backend server
```bash
cd backend
npm start
# Start main application (new terminal at project root)
npm run dev
```


### Access Applications
- Main app: http://localhost:3000
- Next.js admin dashboard: http://localhost:3000/admin/dashboard
- Vite admin dashboard (legacy/optional): http://localhost:5173

### Admin Dashboard Notes
- Next.js dashboard: Production-ready and recommended for all admin tasks.
- Vite dashboard: Legacy/optional, for testing or development only.

### Default Admin Access
- Email: 
- Password: 

