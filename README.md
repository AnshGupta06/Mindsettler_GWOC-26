# MindSettler

<div align="center">
<Image src="frontend/public/assets/white-logo.webp" alt="Mindsettler Logo" width={100} height={100}  />

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-mindsettler--bypb.vercel.app-orange?style=for-the-badge)](https://mindsettler-bypb.vercel.app/)
[![License](https://img.shields.io/badge/📄_License-MIT-blue?style=for-the-badge)](./LICENSE)

</div>

---

## 🚀 Performance & Visibility

MindSettler demonstrates real-world visibility and performance beyond a typical academic or prototype project.

- **100/100 Google Lighthouse SEO score**, reflecting strong semantic structure and metadata optimization  
- **200+ organic impressions within the first week of deployment**
- **Approximately 80%+ Click-Through Rate (CTR)**, indicating high relevance in search results
- Ranked **#1 on Google Search** for the keyword *“MindSettler”*
- **Indexed and referenced by Google AI (Search Generative Experience)**, where Google AI uses MindSettler to answer platform-related queries in AI Mode

---

## 🌟 Overview

**MindSettler** is an online psycho-education and mental well-being platform designed to help individuals understand their mental health and navigate life challenges through structured **online and offline therapy sessions**.  

The platform is built using a modern **Next.js** frontend and a robust **Express.js** backend, with a strong focus on scalability, security, and user trust.

---

## ✨ Key Features

### 🤖 AI-Powered Chatbot & Automation
- **Guidance, Not Replacement**: The AI chatbot is explicitly designed **not to replace professional therapy**. It does not attempt to resolve clinical issues or eliminate the need for therapist-led sessions.
- **Context-Aware Interaction**: Powered by **Google Gemini AI**, the chatbot analyzes user inputs across multiple turns to understand intent and context, and to present relevant options available within the platform.
- **Intent Recognition & Escalation**: Identifies user intent such as information-seeking, uncertainty, emotional discomfort, or the need for professional help, and **actively guides users toward booking therapy sessions** when human intervention is appropriate.
- **Decision Support, Not Treatment**: The chatbot helps users articulate concerns and understand next steps, but **does not provide diagnosis, treatment, or therapeutic intervention**.
- **Supplementary Resources Only**: Recommends articles and self-help material strictly as **supporting information**, not as substitutes for therapy.
- **Safety-First AI Logic**: Dedicated AI flows monitor for crisis or self-harm indicators and immediately surface helpline resources and professional support pathways.
> The chatbot acts as a **first-touch companion and decision aid**, guiding users toward awareness and appropriate care — not as an alternative to therapy.

### 🛡️ Secure & Private by Design
- **Enterprise-Grade Authentication**: Implemented using **Firebase Authentication**, supporting secure Email/Password flows and Google Sign-In with JWT-based session verification.
- **Role-Based Access Control (RBAC)**: Clearly defined and enforced access layers for **Users**, **Therapists**, and **Administrators**, ensuring strict data isolation and controlled privilege boundaries.
- **Fraud & Fake Account Prevention**: Integrated **Abstract API** to detect and block disposable or temporary email domains (e.g., temp-mail services) in real time during user registration.
- **Request & Data Protection**: Platform hardening through **Helmet security headers**, **rate limiting**, and **strict CORS policies** to mitigate XSS attacks, abuse, and unauthorized access.
- **Privacy-Centric Design**: Sensitive data such as session details and clinical notes are accessible only to authorized roles, reinforcing user trust and confidentiality.

### 👥 Community, Awareness & Communication
- **Interactive Psycho-Education**: Educational content enhanced with **Framer Motion** and **GSAP** animations to maintain engagement while preserving a calm, non-intrusive user experience.
- **Real-Time Awareness Hub**: Dynamically updated sections focused on mental health literacy, symptoms, coping mechanisms, and evidence-based insights.
- **Seamless Communication**: Integrated **EmailJS** and **Brevo** for reliable transactional communication, including onboarding messages, booking confirmations, and support notifications.

### ⚡ Performance, Reliability & Developer Experience
- **Modern Frontend Architecture**: Built on **Next.js 16 (App Router)** with server-side rendering for fast initial loads and strong SEO performance.
- **Fully Responsive Design**: Mobile-first implementation using **Tailwind CSS**, optimized for mobile, tablet, and desktop layouts.
- **Type-Safe Codebase**: End-to-end **TypeScript** usage across frontend and backend improves maintainability, reduces runtime errors, and enables safer refactoring.
- **Optimized Routing & Transitions**: Efficient page transitions and routing logic ensure a smooth, application-like user experience.

---

## 🚀 Technology Stack

### **Frontend**
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Radix UI Primitives
- **Animations**: Framer Motion 12, GSAP 3
- **State & Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### **Backend**
- **Runtime**: Node.js with Express 5
- **Database**: PostgreSQL (via Prisma ORM)
- **AI Integration**: Gemini AI
- **Services**: Firebase Admin (Authentication), Brevo & EmailJS (Email), Supabase (Database)
- **Security**: Helmet, Rate Limiting, CORS

---

## 👥 Team FrostByte

MindSettler is built by **Team FrostByte**, a group of developers passionate about building reliable, scalable, and user-focused web platforms.

| 👨‍💻 Developer | 🔗 Profile |
|---------------|-----------|
| **Siddharth Sheth** | [GitHub](https://github.com/siddharth251206) |
| **Ansh Gupta** | [GitHub](https://github.com/AnshGupta06) |
| **Suraj Shah** | [GitHub](https://github.com/Suraj31shah) |
| **Pratham Patadiya** | [GitHub](https://github.com/Pratham722007) |

---

## 📈 Process Flow Diagram

```mermaid
graph TB
    subgraph User_Lane ["CLIENT / USER"]
        U1([Enter MindSettler Platform]) --> U2[Interact with AI Companion]
        U2 --> U3{Decide Action}
        U3 -- Learn --> U4[Read Psycho-Education Content]
        U3 -- Heal --> U5[Select Therapy & Time Slot]
        U5 --> U6[Confirm via UPI/Cash]
        U10[Join Session via Meet/Studio] --> U11[Follow Therapeutic Arc]
    end

    subgraph System_Lane ["SYSTEM & AI COMPANION"]
        U2 -.-> S1[AI Guides via Gemini/Genkit]
        S1 -.-> U4
        S1 -.-> U5
        U6 --> S2[Generate Pending Request]
        S2 --> S3[Check Loyalty/Discount Engine]
        S3 --> S4[Notify Admin Dashboard]
        S5[Automate Google Meet/Calendar] --> U10
    end

    subgraph Admin_Lane ["ADMIN / THERAPIST"]
        S4 --> A1[Review Slot & Payment]
        A1 --> A2{Approve Booking?}
        A2 -- Yes --> A3[Confirm Session]
        A2 -- No --> A4[Reject/Reschedule]
        A3 --> S5
        U11 --> A5[Lead Session: Clinical Care]
    end
```


## ⚙️ System Architecture

```mermaid
---
config:
  layout: fixed
---
flowchart TB
 subgraph Client_Layer["USER INTERFACE (FRONTEND)"]
        B["4-Step Booking System"]
        A["Next.js Web App"]
        C["Psycho-Education Awareness Modules"]
        D["User Dashboard: My Sessions"]
        E["AI Wellness Companion"]
  end
 subgraph Logic_Layer["BUSINESS LOGIC"]
        F["Google Genkit + Gemini AI"]
        G["Client Session Manager"]
        H["Smart Discount Manager"]
        Z["Therapy Slot System"]
  end
 subgraph Backend_Layer["ADMIN & DATA (CONTROL PLANE)"]
        J[("PostgreSQL Database")]
        I["Express.js / Node.js Server"]
        K["Admin Dashboard"]
        L["Slot & Client Manager"]
        M["Manual Payment Verification"]
  end
 subgraph Integration_Layer["EXTERNAL SERVICES"]
        N["Firebase Auth"]
        O["Google Meet Links"]
        P["Google Calendar"]
  end
    A --> B & C & D & E
    F -.-> E
    G --> B
    H --> B
    Z --> B
    I --> J & K
    K --> L & M
    N --> I
    O --> I & D
    B --> I
    L --> B
    M --> D
    P --> I
```

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

[![GitHub Stars](https://img.shields.io/github/stars/AnshGupta06/Mindsettler_GWOC-26?style=social)](https://github.com/AnshGupta06/Mindsettler_GWOC-26)

</div>
