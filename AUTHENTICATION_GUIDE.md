# Firebase Authentication Integration Guide

## Quick Start

Your Firebase authentication system is now ready! Here's everything you need to know:

---

## 🎯 Complete Folder Structure

```
src/
├── services/
│   └── firebase/
│       ├── config.ts              # Firebase initialization
│       └── auth.ts                # Auth functions
├── context/
│   └── AuthContext.tsx            # Global auth state
├── pages/
│   ├── Login.tsx                  # Login/Signup page
│   └── Login.css                  
└── components/
    ├── AuthButtons.tsx            # Logout & user menu dropdown
    └── AuthButtons.css            
```

---

## 🚀 Getting Started (3 Steps)

### Step 1: Set Up Firebase
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Create Firestore database
4. Copy your Firebase config

### Step 2: Add Environment Variables
Create `.env.local` in your project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Install Dependencies
```bash
npm install
```

**Done!** Your app is ready.

---

## 📖 Key Features

### 1. Login Page
**File:** `src/pages/Login.tsx`

- User type selection (Student/Parent)
- Login & Sign Up forms
- Email validation
- Password strength checking
- Auto-redirect to appropriate dashboard

**Route:** `/login`

---

### 2. Auth Context
**File:** `src/context/AuthContext.tsx`

Provides global authentication state:
```tsx
const { user, userData, loading, isAuthenticated, error } = useAuth();

// user: Firebase User object
// userData: { uid, email, displayName, userType, createdAt, lastLogin }
// isAuthenticated: boolean
// loading: boolean
```

---

### 3. Authentication Functions
**File:** `src/services/firebase/auth.ts`

Available functions:

```tsx
// Sign up a new user
await signupUser({
  email: 'student@example.com',
  password: 'Password123',
  displayName: 'John Doe',
  userType: 'student'
});

// Log in
await loginUser({
  email: 'student@example.com',
  password: 'Password123',
  userType: 'student'
});

// Log out
await logoutUser();

// Reset password
await resetPassword('student@example.com');

// Get user data
const userDoc = await getUserData(uid);
```

---

## 💻 Usage Examples

### Check Authentication in Components

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isAuthenticated, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {userData?.displayName}!</div>;
}
```

### Add Logout Button to Navbar

```tsx
// src/components/Navbar.tsx
import { AuthButtons } from './AuthButtons';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>My App</h1>
      <AuthButtons />
    </nav>
  );
}
```

### Create Protected Route

```tsx
// components are already protected in App.tsx
// All routes using <ProtectedRoute> require authentication
```

---

## 🔑 Key Files Explained

### 1. firebase/config.ts
```tsx
// Initializes Firebase with your credentials from environment variables
// Exports: auth, db, app
```

### 2. firebase/auth.ts
```tsx
// All authentication logic:
// - signupUser()
// - loginUser()
// - logoutUser()
// - resetPassword()
// - getUserData()
```

### 3. AuthContext.tsx
```tsx
// <AuthProvider> wraps your app (in App.tsx)
// useAuth() hook provides auth state to any component
```

### 4. Login.tsx
```tsx
// Complete login/signup UI
// Student & Parent user types
// Form validation
// Error handling
```

### 5. AuthButtons.tsx
```tsx
// Reusable component with:
// - User profile dropdown menu
// - Logout button
// - Shows user name and type
// - Responsive design
```

---

## 🎨 Customize Login Page

### Change Colors
Edit `src/pages/Login.css`:
```css
/* Change gradient background */
background: linear-gradient(135deg, #your_color_1 0%, #your_color_2 100%);

/* Change button color */
.submit-btn {
  background: linear-gradient(135deg, #your_color_1 0%, #your_color_2 100%);
}
```

### Change Branding
Edit `src/pages/Login.tsx`:
```tsx
<h1>Your App Name</h1>
<p>Your tagline here</p>
```

### Add Your Logo
```tsx
<img src="/your-logo.png" alt="Logo" className="logo" />
```

---

## 🛒 Firestore Database Schema

Users are stored in Firestore:

```
users/
  {uid}/
    ├── uid: string
    ├── email: string
    ├── displayName: string
    ├── userType: "student" | "parent"
    ├── createdAt: timestamp
    └── lastLogin: timestamp
```

### Add More Fields
Update in `src/services/firebase/auth.ts`:

```tsx
await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  email: email,
  displayName: displayName,
  userType: userType,
  createdAt: new Date(),
  lastLogin: new Date(),
  // Add your custom fields:
  age: 25,
  grade: '10',
  avatar: 'url...',
});
```

---

## 🎯 Common Tasks

### Redirect After Login
The app automatically redirects based on user type:
- **Student** → `/`
- **Parent** → `/parents-dashboard`

Change this in `src/pages/Login.tsx`:
```tsx
if (userType === "student") {
  navigate('/dashboard');  // Change to your path
} else {
  navigate('/parent-panel');  // Change to your path
}
```

### Access User Type in Components
```tsx
const { userData } = useAuth();

if (userData?.userType === 'parent') {
  return <ParentView />;
} else {
  return <StudentView />;
}
```

### Show Different Content by Role
```tsx
function Dashboard() {
  const { userData } = useAuth();

  return (
    <>
      <h1>Dashboard</h1>
      {userData?.userType === 'student' && <StudentDashboard />}
      {userData?.userType === 'parent' && <ParentDashboard />}
    </>
  );
}
```

### Store Additional User Data
```tsx
// During signup or anytime later
const userRef = doc(db, 'users', user.uid);
await setDoc(userRef, {
  age: 25,
  grade: '10',
}, { merge: true });  // merge: true keeps existing data

// Later, retrieve it
const userData = await getUserData(user.uid);
```

---

## 🔒 Security Best Practices

### 1. Environment Variables (Already Done ✓)
Your Firebase credentials are in `.env.local` (not in code)

### 2. Update Firestore Rules
In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
      allow create: if request.auth.uid != null;
    }
  }
}
```

### 3. Enable HTTPS Only
Your app should only run over HTTPS in production

### 4. Validate on Backend
Never trust client-side validation alone

---

## 🧪 Testing

### Test Student Signup
1. Go to `/login`
2. Select "Student"
3. Click "Sign Up"
4. Fill form and submit
5. Should redirect to `/`

### Test Parent Signup
1. Go to `/login`
2. Select "Parent"
3. Click "Sign Up"
4. Fill form and submit
5. Should redirect to `/parents-dashboard`

### Test User Type Validation
1. Sign up as "Student" with email: test@example.com
2. Log out
3. Try logging in as "Parent" with same email
4. Should show error message

### Test Protected Routes
1. Clear browser data (logout)
2. Try visiting any protected route
3. Should redirect to `/login`

---

## 🚨 Troubleshooting

### "firebase is required"
```bash
npm install firebase
npm run dev
```

### "VITE_FIREBASE_API_KEY is not defined"
- Create `.env.local` with Firebase credentials
- Restart dev server

### "Module not found: firebase/auth"
```bash
npm install
npm run dev
```

### "User not created in Firestore"
- Check Firestore database exists
- Check Firestore rules allow writes
- Check browser console for errors

### Login button doesn't work
- Check `.env.local` has correct values
- Open browser console (F12) for error messages
- Verify Firebase project is active

---

## 📱 Mobile Responsiveness

The login page is fully responsive:
- **Desktop**: Side-by-side layout
- **Tablet**: Stacked layout
- **Mobile**: Full screen, optimized

No additional configuration needed!

---

## 🎓 Learn More

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [React Router Docs](https://reactrouter.com/)

---

**Your app is now ready with Firebase authentication!** 🚀

Need help? Check the browser console (F12) for detailed error messages.
