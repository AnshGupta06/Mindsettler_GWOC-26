# MindSettler - GWOC'26

![MindSettler Logo](https://via.placeholder.com/800x200?text=MindSettler+Banner)

<div align="center">

### Empowering Mental Wellness with AI & Community

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js_16-black)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Express.js-green)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![AI](https://img.shields.io/badge/AI-Google_Gemini-orange)](https://deepmind.google/technologies/gemini/)

[View Demo](http://localhost:3000) • [Report Bug](https://github.com/yourusername/mindsettler/issues) • [Request Feature](https://github.com/yourusername/mindsettler/issues)

</div>

---

## 🌟 Overview

**MindSettler** is a comprehensive mental wellness platform designed to bridge the gap between professional therapy, self-care, and community support. Built for the **GirlScript Winter of Code (GWOC) 2026**, it leverages advanced AI and a robust tech stack to provide users with a safe, engaging, and personalized environment for their mental health journey.

## 🎯 Mission

To democratize access to mental health resources, providing a safe digital space where users can heal, learn, and grow through AI-driven insights, professional guidance, and community connection.

## ✨ Key Features

### 🤖 AI-Powered Companion
- **GenAI Chatbot**: A compassionate, always-available AI companion powered by **Google Gemini** and **Genkit** to listen and provide immediate support.
- **Personalized Insights**: AI-driven analysis of user mood and progress to suggest relevant content.

### 🛣️ Wellness Journeys
- **Personal Path**: Tailored resources and milestones for individual growth.
- **Workplace Wellness**: Specialized modules for managing work-related stress and burnout.
- **Mental Awareness**: Dedicated section for education and reducing stigma (`/awareness`).

### 📚 Resource Hub
- **Digital Library**: Curated collection of books, academic papers, and articles.
- **Multimedia Content**: Video resources and guided meditations.
- **Buy & Access**: Direct integration for purchasing recommended books (Amazon) or accessing free papers.

### 📅 Professional Booking System
- **Expert Connection**: seamless booking with mental health professionals.
- **Slot Management**: Robust admin dashboard for therapists to manage availability.
- **Session Modes**: Support for both Online (Google Meet) and Offline sessions.

### 🏢 Corporate & Institutional
- **Corporate Programs**: Bespoke solutions for organizations to support their employees.
- **Discount Management**: System for handling corporate or seasonal discounts.

## 🚀 Technology Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap)
- **UI Components**: Radix UI, Lucide React
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: [Express.js 5](https://expressjs.com/)
- **Database**: PostgreSQL (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: Firebase Admin SDK
- **AI Integration**: Google Genkit, Gemini API
- **Scheduled Tasks**: Node-cron

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint

## 📊 System Architecture

The project follows a modern **PERN** stack (PostgreSQL, Express, React/Next.js, Node.js) with a microservices-inspired approach for AI and Authentication.

- **Client**: Next.js application handling UI, routing (`app/`), and client-side logic.
- **Server**: Express.js server providing RESTful APIs (`routes/`, `controllers/`).
- **Database**: Supabase PostgreSQL instance managed via Prisma Schema.
- **Auth**: Firebase Authentication for secure user management.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (or Supabase account)
- Firebase Project
- Google Gemini API Key

### Environment Variables

Create `.env` files in both `frontend` and `backend` directories.

**Frontend (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ...other firebase config
```

**Backend (.env)**
```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_super_secret
```

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/Mindsettler_GWOC-26.git
   cd Mindsettler_GWOC-26
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Run migrations
   npx prisma migrate dev
   # Start server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🧪 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Bookings
- `GET /api/booking/get-slots` - Fetch available slots
- `POST /api/booking` - Book a session
- `GET /api/booking/my-bookings` - User's booking history

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get specific resource details

### AI Features
- `POST /api/ai/chat` - Interact with the AI companion

## 🎨 Design System

**MindSettler** features a "Clean, Professional, yet Dynamic" aesthetic.

- **Colors**: A calming palette of soft purples, whites, and vibrant accent gradients.
- **Typography**: Modern, sans-serif fonts optimized for readability and comfort.
- **Visuals**:
    - **Glassmorphism**: Translucent cards and overlays for depth.
    - **Floating Animations**: Subtle "breathing" motions for a soothing effect.
    - **Interactive Elements**: Responsive hover states and smooth page transitions.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **GirlScript Winter of Code** for the opportunity.
- **Google DeepMind** for Gemini and Genkit technologies.
- All contributors who have helped shape MindSettler.

---

<div align="center">
Made with ❤️ by the MindSettler Team
</div>
