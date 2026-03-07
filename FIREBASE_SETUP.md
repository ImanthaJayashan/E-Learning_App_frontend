# Firebase Authentication Setup Guide

## Overview
I've created a complete Firebase authentication system for your E-Learning App with separate login flows for students and parents. Here's everything that's been set up:

---

## 📁 Folder Structure Created

```
src/
├── services/
│   └── firebase/
│       ├── config.ts          # Firebase initialization
│       └── auth.ts            # Authentication functions
├── context/
│   └── AuthContext.tsx        # Auth state management
└── pages/
    └── Login.tsx              # Login page component
    └── Login.css              # Login styling
```

---

## 📦 Dependencies Added

- **firebase** (v10.9.0) - Firebase SDK for authentication and Firestore

Install dependencies:
```bash
npm install
```

---

## 🔐 Firebase Setup Instructions

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name and complete the setup
4. Wait for the project to be created

### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Click **Email/Password** authentication method
4. Toggle it **ON**
5. Click **Save**

### Step 3: Create Firestore Database
1. Go to **Firestore Database** in Firebase Console
2. Click **Create Database**
3. Choose **Start in test mode** (you can update security rules later)
4. Select a region (e.g., `us-east1`)
5. Click **Create**

### Step 4: Get Your Firebase Configuration
1. In Firebase Console, click the **Settings icon** ⚙️
2. Go to **Project Settings**
3. Scroll to "Your apps" section
4. Click on the Web App (if you don't have one, click **</> Web**)
5. Copy the Firebase configuration object

---

## ⚙️ Environment Configuration

### Create `.env.local` File
Create a `.env.local` file in your project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration from Step 4.

---

## 📝 File Descriptions

### 1. **src/services/firebase/config.ts**
- Initializes Firebase app with your credentials
- Exports `auth` object for authentication
- Exports `db` object for Firestore database
- Reads credentials from environment variables

### 2. **src/services/firebase/auth.ts**
Key functions:
- `signupUser()` - Register new users (student or parent)
- `loginUser()` - Sign in existing users with user type validation
- `logoutUser()` - Sign out the current user
- `resetPassword()` - Send password reset email
- `getUserData()` - Fetch user profile from Firestore

**User Type Validation:**
- Ensures a parent account can't login as a student
- Prevents user type mismatches

### 3. **src/context/AuthContext.tsx**
- Provides authentication state globally
- Tracks current user and user data
- Manages loading and error states
- `useAuth()` hook for accessing auth state in components

### 4. **src/pages/Login.tsx**
Beautiful, responsive login page with:
- **User Type Selection**: Switch between Student and Parent
- **Auth Mode Toggle**: Switch between Login and Sign Up
- **Form Validation**: Email format, password strength, password match
- **Error Handling**: Clear error messages
- **Password Visibility Toggle**: Show/hide password
- **Role-based Navigation**: Directs users to appropriate dashboard
- **Loading States**: Visual feedback during authentication

### 5. **src/pages/Login.css**
- Modern gradient background
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Feature cards for app benefits

---

## 🔄 Updated Files

### src/App.tsx
Changed:
- Added `AuthProvider` wrapper to enable auth context globally
- Integrated `useAuth()` hook in `ProtectedRoute`
- Replaced localStorage-only protection with Firebase auth
- Added `/login` route
- Added loading state to protected routes

### package.json
- Added Firebase dependency: `"firebase": "^10.9.0"`

---

## 🚀 How It Works

### Flow Diagram:
```
User visits app
    ↓
Not authenticated? → Redirected to Login page
    ↓
Select user type (Student/Parent)
    ↓
Login with email & password
    ↓
Firebase validates credentials
    ↓
Firestore checks user type matches
    ↓
✅ Login successful
    ↓
User redirected to appropriate dashboard:
  - Student → Home page
  - Parent → Parents Dashboard
```

---

## 💻 Usage in Components

### Check if User is Logged In
```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {userData?.displayName}</p>
      <p>Role: {userData?.userType}</p>
    </div>
  );
}
```

### Logout
```tsx
import { logoutUser } from '../services/firebase/auth';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## 🔓 Firestore Database Structure

When a user signs up or logs in, their profile is saved in Firestore:

```
collections/
└── users/
    └── {uid}/
        ├── uid: string
        ├── email: string
        ├── displayName: string
        ├── userType: "student" | "parent"
        ├── createdAt: timestamp
        └── lastLogin: timestamp
```

---

## 🛡️ Security Rules (Firestore)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
      allow create: if request.auth.uid != null;
    }
  }
}
```

---

## 🧪 Testing the Authentication

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:5173/login`
3. **Test Sign Up:**
   - Select "Student"
   - Fill in the form
   - Click "Create Account"
4. **Test Login:**
   - Go back to login page
   - Select "Student"
   - Use the email/password you created
   - Click "Login"
5. **Test User Type Validation:**
   - Sign up as "Student"
   - Try logging in as "Parent" with same email
   - Should show error: "This account is registered as a student, not a parent"

---

## 🐛 Troubleshooting

### "Config is not initialized"
- Make sure you have a `.env.local` file with correct Firebase credentials
- Restart the dev server: `npm run dev`

### "Email already in use"
- The email is already registered
- Use a different email or click "Forgot Password?"

### "User type mismatch"
- The account was created as one type but you're trying to log in as another
- Log in with the correct user type

### Login page not showing
- Check that the `/login` route is accessible in App.tsx
- Verify the Login component is properly imported

---

## 📱 Features Summary

✅ Email/Password authentication
✅ Separate login for students and parents
✅ User type validation
✅ Account creation (signup)
✅ Password reset functionality
✅ User profile storage in Firestore
✅ Last login tracking
✅ Auth state management via context
✅ Protected routes
✅ Responsive mobile-friendly design
✅ Beautiful UI with gradient backgrounds
✅ Form validation with error messages
✅ Loading states and feedback

---

## 📚 Next Steps

1. **Add Social Login** (Google, GitHub):
   - Uncomment providers in Firebase config
   - Add social login buttons to Login.tsx

2. **Add Password Reset Page**:
   - Create `src/pages/ResetPassword.tsx`
   - Implement password reset with email verification

3. **Add User Profile Page**:
   - Allow users to update their profile
   - Store additional info (avatar, bio, etc.)

4. **Add Student Progress Tracking**:
   - Store game scores and analytics
   - Create parent dashboard to view child progress

5. **Update Firestore Rules**:
   - Lock down test mode rules for production
   - Add proper access controls

---

## 📞 Support

If you need help:
- Check [Firebase Documentation](https://firebase.google.com/docs)
- Review the [Auth Error Codes](https://firebase.google.com/docs/auth/admin/create-custom-claims)
- Check browser console for detailed error messages

---

**Your authentication system is now ready to use!** 🎉
