# Javis | Embedded Systems Portfolio & Lab Notebook

A professional, high-performance portfolio and technical blog built for an **Embedded Systems Developer**. This application showcases engineering projects, technical insights, and a personal "Lab Notebook" for documenting IoT and hardware innovations.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.0-FFCA28.svg)

---

## 🚀 Overview

This application is designed to be a "living document" of an engineering journey. It blends a clean, modern aesthetic with technical depth, featuring:
- **Project Showcases**: Distinctive project cards with category tagging.
- **Lab Notebook (Blog)**: A full-featured blog with Markdown support for sharing technical deep-dives.
- **Admin Dashboard**: A secure, password-protected portal for managing content without external authentication overhead.
- **Embedded Focus**: Design language and typography tailored for the engineering community (Monospaced fonts for data, clean sans for UI).

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.react.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Metadata/SEO**: [React Helmet Async](https://github.com/staylor/react-helmet-async)

### Backend & Storage
- **Database**: [Google Firebase Firestore](https://firebase.google.com/products/firestore) for persistent blog data.
- **Hosting**: Deployed on Cloud Run via AI Studio Build.

## 🔐 Admin Access

The application features a dedicated Admin dashboard for content management.

- **URL**: `/admin`
- **Session Logic**: Uses local session storage for persistence.
- **Authentication**: Access is restricted via a hardcoded administrative passcode as per system specifications.

## 📦 Project Structure

```text
├── src/
│   ├── components/       # UI Components (Admin, Blog, Portfolio, etc.)
│   ├── lib/              # Firebase configuration and utilities
│   ├── styles/           # Global Tailwind CSS definitions
│   ├── App.tsx           # Main routing and application layout
│   └── main.tsx          # Application entry point
├── firestore.rules       # Database security configurations
├── metadata.json         # Platform configuration
└── package.json          # Dependency management
```

## 🛠️ Development

To run the project locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📝 License

Designed and developed by **Javis**. This project is part of a professional engineering portfolio.
