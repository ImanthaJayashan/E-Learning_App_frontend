# Write-Sense Frontend

Small React + Vite frontend for the Write-Sense e-learning project.

## Quick Overview

- **Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Purpose:** Frontend for tutorials and interactive learning experiences

## Prerequisites

- Node.js (recommend 16+ or 18+)
- npm (or use yarn/pnpm)

## Install

```bash
npm install
```

## Available scripts

- `npm run dev` — start development server (Vite)
- `npm run build` — build production assets
- `npm run preview` — locally preview production build

## Architecture Diagram
<img width="1536" height="1024" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/8fef2eef-99d8-4f28-bf4d-923ac2014f6f" />


## Project structure

- index.html
- package.json
- vite.config.ts
- postcss.config.js
- tailwind.config.js
- src/
  - App.tsx
  - main.tsx
  - style.css
  - components/
    - Navbar.tsx
    - PrimaryButton.tsx
  - pages/
    - Landing.tsx
    - Tutorials.tsx
- public/
  - answers/

## Local development

1. Install dependecies: `npm install`
2. Start dev server: `npm run dev`
3. Open the URL shown by Vite (usually http://localhost:5173)

## Building for production

```bash
npm run build
npm run preview
```

## Notes

- The project uses Vite + React plugin; TypeScript types are included in `devDependencies`.
- If you plan to add backend integration, add environment variable handling (example: `.env`) and update fetch endpoints accordingly.

## Next steps (suggestions)

- Add a `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for collaboration.
- Add tests and a CI workflow (GitHub Actions) to run lints/tests on PRs.

---
Generated README by developer assistant.
# 🎨 E-Learning App - Kids Shape Learning Platform

## 📖 Project Overview

An interactive educational web application designed to help young children learn geometric shapes through engaging visual content, animated 3D shapes, and fun games. The platform features a colorful, kid-friendly interface with smooth animations and interactive elements that make learning shapes enjoyable and memorable.

### What is the project?

This is a React-based e-learning application that provides:
- Interactive shape learning modules (Circle, Square, Triangle, Star)
- Educational YouTube video content embedded for each shape
- 3D animated shape visualizations using CSS animations
- Kid-friendly games and activities
- Responsive design optimized for tablets and desktop displays
- Smooth page transitions and playful UI elements

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React SPA)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐      │
│  │   Navbar    │  │   Routing    │  │  Components   │      │
│  │  Component  │  │ (React Router)│  │  (Framer     │      │
│  │             │  │              │  │   Motion)     │      │
│  └─────────────┘  └──────────────┘  └───────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Page Components                          │   │
│  │  - Home                                              │   │
│  │  - EyeProblemDetector (Main Shapes Learning Hub)    │   │
│  │  - CircleShape / SquareShape / TriangleShape / Star │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Styling & Animations                        │   │
│  │  - Tailwind CSS (Utility-first styling)             │   │
│  │  - Framer Motion (Animations & Transitions)         │   │
│  │  - Custom CSS (3D shapes, keyframe animations)      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  External Media  │
                  │  - YouTube API   │
                  │  - Game Embeds   │
                  └──────────────────┘
```

### System Structure

**Frontend Architecture:**
- **UI Layer**: React components with TypeScript for type safety
- **Routing**: React Router DOM for SPA navigation
- **Animation Engine**: Framer Motion for interactive animations
- **Styling**: Tailwind CSS + Custom CSS for responsive design
- **Build Tool**: Vite for fast development and optimized production builds

**Key Pages:**
1. **Home** - Landing page with navigation
2. **EyeProblemDetector** - Main shapes learning hub with video content and shape cards
3. **Shape Detail Pages** - Individual pages for Circle, Square, Triangle, and Star learning

---

## 🛠️ Technologies & Dependencies

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | ^19.1.1 | UI component library |
| **Language** | TypeScript | ~5.9.3 | Type-safe JavaScript |
| **Build Tool** | Vite | ^7.1.7 | Fast build and dev server |
| **Routing** | React Router DOM | ^7.0.2 | Client-side routing |
| **Animation** | Framer Motion | ^12.23.26 | Declarative animations |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS framework |
| **UI Components** | Material-UI | ^7.3.6 | Pre-built React components |
| **Game Engine** | Phaser | ^3.90.0 | 2D game framework |

### Development Dependencies

```json
{
  "Build": "Vite + TypeScript",
  "Linting": "ESLint + TypeScript ESLint",
  "CSS Processing": "PostCSS + Autoprefixer",
  "Type Checking": "TypeScript Compiler",
  "Image Optimization": "Sharp"
}
```

### Full Dependency List

**Production Dependencies:**
- `react` - Core React library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing solution
- `framer-motion` - Animation library
- `@mui/material` - Material-UI components
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- `phaser` - Game development framework

**Development Dependencies:**
- `@vitejs/plugin-react` - Vite React plugin
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `tailwindcss` - Utility CSS framework
- `autoprefixer` & `postcss` - CSS processing
- `sharp` - Image optimization

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd E-Learning_App_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📁 Project Structure

```
E-Learning_App_frontend/
├── src/
│   ├── App.tsx              # Main app component with routes
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── HeroSection.tsx
│   └── pages/               # Page components
│       ├── Home.tsx
│       ├── EyeProblemDetector.tsx
│       ├── CircleShape.tsx
│       ├── SquareShape.tsx
│       ├── TriangleShape.tsx
│       └── StarShape.tsx
├── public/                  # Static assets
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── tsconfig.json           # TypeScript config
```

---

## ✨ Features

- 🎯 **Interactive Shape Learning** - Engaging 3D animated shapes
- 📹 **Video Content** - Embedded educational YouTube videos
- 🎮 **Educational Games** - Interactive learning activities
- 🎨 **Kid-Friendly UI** - Colorful, playful design
- 📱 **Responsive Design** - Works on tablets and desktops
- ⚡ **Fast Performance** - Optimized with Vite
- 🔄 **Smooth Animations** - Powered by Framer Motion

---

## 🎨 Design Highlights

- **3D Shape Animations**: Custom CSS animations for sphere, cube, pyramid, and star
- **Floating Elements**: Animated emoji decorations using Framer Motion
- **Gradient Backgrounds**: Eye-catching colorful gradients
- **Interactive Cards**: Hover effects and click animations
- **Wiggle Animations**: Playful button animations for kids
- **Page Transitions**: Smooth navigation between pages

---

## 🔮 Upcoming Features

- 👨‍👩‍👧 **Parent Dashboard** - Track child's learning progress and activities
- 👁️ **Binocular Vision Therapies** - Specialized exercises for lazy eye treatment

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## � License

This project is licensed under the MIT License.

---

## �👨‍💻 Developed By

SLIIT Research Team

---

**Note**: This is a frontend-only application. Future enhancements may include backend integration for user progress tracking and personalized learning paths.
