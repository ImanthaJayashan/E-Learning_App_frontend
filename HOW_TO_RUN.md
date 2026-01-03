# 🎮 How to Run Animal Sound Safari Frontend

## 📋 Project Overview

This is a **React + TypeScript + Vite** application with:

- **Framework**: React 18
- **Build Tool**: Vite (configured on port 8080)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Routing**: React Router
- **UI Library**: Radix UI components

> **⚠️ Important**: This frontend runs on **port 8080** (not the default Vite port 5173). This is configured in `vite.config.ts`.

---

## 🔧 Prerequisites

Before running the frontend, ensure you have:

### Required Software

#### 1. **Node.js (v18 or higher)**

- Download from [nodejs.org](https://nodejs.org/)
- Verify installation:

  ```bash
  node --version
  # Should show: v18.x.x or higher

  npm --version
  # Should show: 9.x.x or higher
  ```

#### 2. **Git** (Optional - for cloning)

- Download from [git-scm.com](https://git-scm.com/)

---

## 📥 Installation Steps

### Step 1: Navigate to Frontend Directory

Open **PowerShell** or **Command Prompt**:

```bash
cd C:\Users\user\OneDrive\Desktop\frontend\animal-sound-safari
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

**What this installs:**

- React & React DOM
- React Router for navigation
- Radix UI components
- Tailwind CSS for styling
- Vite for fast development
- TypeScript support
- And many more dependencies...

**Expected Output:**

```
added 1234 packages, and audited 1235 packages in 30s
```

**Note**: This may take 1-3 minutes depending on your internet speed.

### Step 3: Verify Installation

Check if `node_modules` folder exists:

```bash
Get-ChildItem -Directory node_modules
```

You should see many folders (dependencies installed).

---

## 🚀 Running the Frontend

### Development Mode (Recommended)

Start the development server with hot-reload:

```bash
npm run dev
```

**Expected Output:**

```
  VITE v5.4.19  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.x.x:8080/
  ➜  press h + enter to show help
```

The application will automatically open in your browser at:

```
http://localhost:8080/
```

**Features in Dev Mode:**

- ✅ Hot Module Replacement (instant updates)
- ✅ Fast refresh
- ✅ Source maps for debugging
- ✅ TypeScript checking

### Production Build

To build for production:

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

## 🔗 Connect to Backend APIs

### Important: Start Backend First!

Before running the frontend, make sure both backend services are running:

#### Backend Service 1: Game Logging (Port 5000)

```bash
# In a separate terminal
cd C:\Users\user\OneDrive\Desktop\frontend\backend
py app.py
```

#### Backend Service 2: AI Predictions (Port 5001)

```bash
# In another separate terminal
cd C:\Users\user\OneDrive\Desktop\frontend\backend
py prediction_api.py
```

### API Configuration

The frontend connects to:

- **Game Logging API**: `http://localhost:5000`
- **Prediction API**: `http://localhost:5001`

If you need to change these URLs, update them in your frontend service files.

---

## 📂 Project Structure

```
animal-sound-safari/
├── node_modules/          # Dependencies (auto-generated)
├── public/               # Static assets (if any)
├── src/                  # Source code (managed by Lovable)
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities
│   ├── hooks/           # Custom React hooks
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS config
└── tsconfig.json        # TypeScript config
```

---

## 🎯 Available Scripts

### Development

```bash
npm run dev
```

Starts development server on `http://localhost:8080/`

### Build

```bash
npm run build
```

Creates optimized production build in `dist/`

### Build (Development Mode)

```bash
npm run build:dev
```

Creates development build with source maps

### Preview

```bash
npm run preview
```

Preview production build locally

### Lint

```bash
npm run lint
```

Check code for errors and style issues

---

## 🔍 Verification Checklist

After starting the frontend, verify:

- [ ] Browser opens automatically to `http://localhost:8080/`
- [ ] Page loads without errors
- [ ] Animal Sound Safari game is visible
- [ ] No red errors in browser console (F12)
- [ ] Backend APIs are accessible

### Test Backend Connections

Open browser console (F12) and run:

```javascript
// Test Game Logging API
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then(console.log);

// Test Prediction API
fetch("http://localhost:5001/api/predict/health")
  .then((r) => r.json())
  .then(console.log);
```

Both should return `"status": "healthy"`

---

## 🐛 Troubleshooting

### Problem 1: Port Already in Use

**Error**: `Port 8080 is already in use`

**Solution:**

```bash
# Kill the process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npm run dev -- --port 8081
```

### Problem 2: Dependencies Not Installed

**Error**: `Cannot find module 'react'` or similar

**Solution:**

```bash
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problem 3: Build Errors

**Error**: TypeScript errors during build

**Solution:**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# If errors persist, check tsconfig.json
```

### Problem 4: CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**

- Ensure backend Flask servers have `flask-cors` installed
- Check that backends are running on correct ports (5000 and 5001)
- Verify API URLs in frontend code

### Problem 5: Blank Page

**Error**: Page loads but shows nothing

**Solution:**

1. Check browser console for errors (F12)
2. Verify `index.html` has `<div id="root"></div>`
3. Check that `src/main.tsx` exists
4. Clear browser cache (Ctrl + Shift + Delete)

---

## 🔄 Complete Workflow

### First Time Setup

1. **Install Node.js** (if not already installed)
2. **Navigate to project**:
   ```bash
   cd C:\Users\user\OneDrive\Desktop\frontend\animal-sound-safari
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Every Time You Want to Run

1. **Terminal 1 - Backend Game Logging**:

   ```bash
   cd C:\Users\user\OneDrive\Desktop\frontend\backend
   py app.py
   ```

2. **Terminal 2 - Backend Predictions**:

   ```bash
   cd C:\Users\user\OneDrive\Desktop\frontend\backend
   py prediction_api.py
   ```

3. **Terminal 3 - Frontend**:

   ```bash
   cd C:\Users\user\OneDrive\Desktop\frontend\animal-sound-safari
   npm run dev
   ```

4. **Open Browser**:
   Visit `http://localhost:8080/`

---

## 🛑 How to Stop

### Stop Frontend

In the terminal running `npm run dev`, press:

```
Ctrl + C
```

### Stop Backends

In each backend terminal, press:

```
Ctrl + C
```

---

## 📊 Technology Stack

| Component     | Technology      | Version  |
| ------------- | --------------- | -------- |
| Framework     | React           | 18.3.1   |
| Language      | TypeScript      | 5.8.3    |
| Build Tool    | Vite            | 5.4.19   |
| Styling       | Tailwind CSS    | 3.4.17   |
| UI Components | Radix UI        | Various  |
| Router        | React Router    | 6.30.1   |
| State         | React Query     | 5.83.0   |
| Forms         | React Hook Form | 7.61.1   |
| Animation     | Framer Motion   | 12.23.24 |

---

## 🌐 URLs Reference

### Development URLs

- **Frontend**: http://localhost:8080/
- **Game Backend**: http://localhost:5000/
- **Prediction Backend**: http://localhost:5001/

### API Endpoints

```
# Game Logging
POST   http://localhost:5000/api/log-interaction
GET    http://localhost:5000/api/analytics
GET    http://localhost:5000/api/health

# Predictions
POST   http://localhost:5001/api/predict/record
POST   http://localhost:5001/api/predict/analyze
GET    http://localhost:5001/api/predict/health
```

---

## 🎨 Customization

### Change Port

Run on a different port:

```bash
npm run dev -- --port 3000
```

### Change API URLs

Update API base URLs in your service files:

```javascript
const GAME_API_URL = "http://localhost:5000";
const PREDICTION_API_URL = "http://localhost:5001";
```

---

## 📝 Quick Commands Reference

```bash
# Navigate to frontend
cd C:\Users\user\OneDrive\Desktop\frontend\animal-sound-safari

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for code issues
npm run lint

# Clean install (if problems)
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## ✅ Success Checklist

- [ ] Node.js v18+ installed
- [ ] npm packages installed (node_modules exists)
- [ ] Backend services running (ports 5000 & 5001)
- [ ] Frontend running on http://localhost:8080/
- [ ] Game loads without errors
- [ ] Browser console shows no red errors
- [ ] Can interact with the game
- [ ] Network tab shows successful API calls

---

## 🚢 Deployment

When ready to deploy to production:

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Test the build locally**:

   ```bash
   npm run preview
   ```

3. **Deploy the `dist/` folder** to:

   - Netlify
   - Vercel
   - GitHub Pages
   - Any static hosting service

4. **Update API URLs** for production in your code

---

## 📚 Additional Resources

- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/ui**: https://ui.shadcn.com/

---

## 🆘 Need Help?

1. Check browser console for errors (F12 → Console)
2. Check terminal output for build errors
3. Verify all 3 services are running (2 backends + 1 frontend)
4. Ensure ports 5000, 5001, and 8080 are not blocked
5. Try clearing browser cache and npm cache:
   ```bash
   npm cache clean --force
   ```

---

**Ready to play!** 🎮 Your Animal Sound Safari game should now be running smoothly!
