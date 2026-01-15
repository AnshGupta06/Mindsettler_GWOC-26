# MindSettler

<div align="center">
<Image src="frontend/public/assets/white-logo.png" alt="Mindsettler Logo" width={100} height={100}  />


[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-mindsettler--bypb.vercel.app-orange?style=for-the-badge)](https://mindsettler-bypb.vercel.app/)
[![License](https://img.shields.io/badge/📄_License-MIT-blue?style=for-the-badge)](./LICENSE)

</div>

---

## 🌟 Overview

**MindSettler** is an online psycho-education and mental well-being platform that helps individuals understand their mental health and navigate life challenges through structured 
online/offline sessions. Built with a modern **Next.js** frontend and a robust **Express.js** backend.

---

## ✨ Key Features

### 🤖 **AI-Powered Chatbot**
- **Personalized Insights**: Leveraging **Gemini AI** to analyze user inputs and offer tailored wellness advice.
- **Resource Recommendation**: Context-aware suggestions for articles, exercises, and professional help.

### 🛡️ **Secure & Private**
- **Authentication**: Enterprise-grade security using **Firebase Auth** for reliable identity management.
- **Role-Based Access**: Distinct portals for Users, Therapists, and Admins.

### 👥 **Community & Connection**
- **Interactive Resources**: Engaging content powered by **Framer Motion** and **GSAP** animations for a calming user experience.
- **Real-time Awareness**: Dynamic educational sections to spread mental health literacy.
- **Contact & Support**: Integrated **EmailJs** and **Brevo** for seamless communication with support teams or professionals.

### ⚡ **Modern Performance**
- **Responsive Design**: Mobile-first architecture using **Tailwind CSS**.
- **Optimized Routing**: Next.js App Router for server-side rendering and fast page loads.
- **Type Safety**: Full **TypeScript** integration across the stack for reliability.

---

## 🚀 Technology Stack

### **Frontend**
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Radix UI Primitives
- **Animations**: Framer Motion 12, GSAP 3
- **State/Forms**: React Hook Form, Zod Validation
- **Icons**: Lucide React

### **Backend**
- **Runtime**: Node.js & Express 5
- **Database**: PostgreSQL (via Prisma ORM)
- **AI Chatbot**: Gemini AI
- **Services**: Firebase Admin (Auth), Brevo & EmailJs (Email) , Supabase ( Database)
- **Security**: Helmet, Rate-Limit, CORS

## 👥 Team FrostByte

Built by a team of developers who love **Coding and Web Development** .
Each member brings unique skills to make MindSettler fast, smart, and reliable.

| 👨‍💻 Developer | 🔗 Profile |
|---------------|-----------|
| **Siddharth Shah** | [GitHub](https://github.com/siddharth251206) |
| **Ansh Gupta** | [GitHub](https://github.com/AnshGupta06) |
| **Suraj Shah** | [GitHub](https://github.com/Suraj31shah) |
| **Pratham Patadiya** | [GitHub](https://github.com/Pratham722007) |


## 🧠 Core Components breakdown

1.  **Frontend (Presentation Layer)**
    *   Built with **Next.js 16**, serving as the primary interaction point.
    *   Handles client-side routing, UI rendering, and state management.
    *   Communicates with the backend APIs securely using JWT tokens managed by Firebase.

2.  **Backend (Application Layer)**
    *   **Express.js** server acting as a RESTful API.
    *   **Middleware**: Handles request validation (Zod), authentication checks (Firebase Admin), and rate limiting.
    *   **AI Service**: A dedicated module integrating `@genkit-ai/google-genai` to process natural language requests and generate wellness insights.

3.  **Database (Persistence Layer)**
    *   **Prisma ORM** provides a type-safe interface to the SQL database.
    *   Manages schemas for Users, Appointments , Admin Notes and Discount Booking.

---



## 🛠️ Installation & Setup

Follow these steps to set up the project locally.

### **Prerequisites**
- Node.js (v18 or higher)
- Supabase Project (Database & API credentials)
- Firebase Project Credentials
- Google Gemini API Key

### **Environment Config**

Create `.env` files in both `frontend` and `backend` directories.

**Frontend (`frontend/.env`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_GEMINI_KEY=your_key
```

**Backend (`backend/.env`)**
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5432/mindsettler"
GEMINI_API_KEY=your_key
FIREBASE_SERVICE_ACCOUNT=path/to/cert.json
RESEND_API_KEY=your_key
```

### **Step-by-Step Installation**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/mindsettler.git
    cd mindsettler
    ```

2.  **Install Dependencies**
    Install packages for both frontend and backend.
    ```bash
    # Install Backend
    cd backend
    npm install

    # Install Frontend
    cd ../frontend
    npm install
    ```

3.  **Database Setup**
    Initialize the Prisma schema.
    ```bash
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    npm run seed
    ```

4.  **Start Development Servers**
    Open two terminal windows:

    **Terminal 1 (Backend)**:
    ```bash
    cd backend
    npm run dev
    ```

    **Terminal 2 (Frontend)**:
    ```bash
    cd frontend
    npm run dev
    ```

5.  **Access the App**
    Visit `http://localhost:3000` to view the application.

---



## 🎨 Design System

**MindSettler** utilizes a carefully curated design language to promote calmness and clarity.

### **Color Palette**
| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#3F2965` | Brand identity, headers, primary actions (Deep Purple) |
| **Accent** | `#DD1764` | Calls to action, highlights, active states (Vibrant Pink) |
| **Soft Pink** | `#F7C6D6` | Background accents, subtle highlights |
| **Soft Purple** | `#C7BEDA` | Secondary elements, borders |
| **Background** | `#FFFFFF` | Clean, distraction-free interface |

### **Typography**
- **Font Family**: `Plus Jakarta Sans`, `Inter`, sans-serif.
- **Scale**: Responsive dynamic scaling (14px base on mobile, 16px on desktop).

### **UI Components**
- **Glassmorphism**: Subtle blur effects for cards and overlays.
- **Rounded Corners**: Generous `0.75rem` radius for a friendly, approachable feel.
- **Animations**: Smooth transitions powered by `Framer Motion` for a seamless flow.

---

## 🚀 Deployment Guide

### **Frontend (Vercel)**
1.  Push your code to **GitHub**.
2.  Import the repository into **Vercel**.
3.  Vercel will auto-detect **Next.js**.
4.  Add Environment Variables (`NEXT_PUBLIC_API_URL`, etc.).
5.  Click **Deploy**.

### **Backend (Render / Railway)**
1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  **Build Command**: `npm install`
4.  **Start Command**: `npm start`
5.  Add Environment Variables (`DATABASE_URL`, `GEMINI_API_KEY`, etc.).



## 🤝 Contributing

We welcome contributions! 

1.  **Fork** the repository.
2.  Create a **Feature Branch** (`git checkout -b feature/NewFeature`).
3.  **Commit** your changes (`git commit -m 'Add NewFeature'`).
4.  **Push** to the branch (`git push origin feature/NewFeature`).
5.  Open a **Pull Request**.

---



## 📂 Project Structure

```text
mindsettler/
├── frontend/                 # Next.js 16 Application
│   ├── app/                 # App Router (Pages & Layouts)
│   ├── components/          # Reusable UI Components
│   ├── lib/                 # Utilities & Libraries
│   ├── public/              # Static Assets (Images, Icons)
│   ├── hooks/               # Custom React Hooks
│   ├── config/              # Configuration Files
│   └── next.config.ts       # Next.js Configuration
├── backend/                  # Express.js Server
│   ├── src/
│   │   ├── controllers/     # Route Controllers
│   │   ├── middleware/      # Auth & Validation Middleware
│   │   ├── routes/          # API Endpoints
│   │   ├── services/        # Business Logic & AI Integration
│   │   └── utils/           # Helper Functions
│   ├── prisma/              # Database Schema & Migrations
│   ├── config/              # Server Configuration
│   └── package.json         # Backend Dependencies
└── README.md                # Project Documentation
```

---


## 🙏 Acknowledgments

### Technologies & Libraries
*   **React Team** for the amazing frontend framework
*   **Google** for Gemini AI technologies
*   **Vercel & Render** for seamless deployment platforms

### Special Thanks
*   Therapists who validated our wellness features
*   Community moderators who keep the platform safe
*   Users who shared their journey with us

---

<div align="center">

**Made with ❤️ by FrostByte**

[![GitHub Stars](https://img.shields.io/github/stars/your-username/sportshub?style=social)](https://github.com/AnshGupta06/Mindsettler_GWOC-26)

</div>