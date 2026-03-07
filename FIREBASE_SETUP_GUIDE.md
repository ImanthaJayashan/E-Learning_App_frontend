# Firebase Integration Setup Guide

## Overview
Your E-Learning App has been successfully integrated with Firebase! All authentication and database operations are now using Firebase services instead of localStorage.

## What Was Updated

### 1. **Firebase Configuration File** ✅
- **Location**: `src/config/firebase.ts`
- Contains your Firebase credentials
- Initializes Firebase Authentication and Firestore

### 2. **Authentication Pages Updated**

#### `src/pages/Signup.tsx`
- Uses Firebase `createUserWithEmailAndPassword()` 
- Users now sign up with **email instead of username**
- Password requirements: Minimum 6 characters (Firebase requirement)
- Saves user profile to Firestore `users` collection with:
  - `uid`: Firebase user ID (automatically assigned)
  - `displayName`: Full name
  - `email`: Email address
  - `userType`: "student" (default)
  - `createdAt`: Signup timestamp
  - `updatedAt`: Last update timestamp

#### `src/pages/Login.tsx`
- Uses Firebase `signInWithEmailAndPassword()`
- Users log in with **email** (not username)
- Improved error handling for common Firebase errors:
  - "email-already-in-use" → Suggests using login form
  - "wrong-password" → Shows "Incorrect email or password"
  - "user-not-found" → Shows "No account found"

#### `src/pages/ForgotPassword.tsx`
- Uses Firebase `sendPasswordResetEmail()`
- Sends a reset link to user's email
- User clicks the link in their email to reset password
- No longer stores passwords locally

#### `src/pages/RoleSelection.tsx`
- Updated to save role selection to Firestore using `updateDoc()`
- Stores selected role (child/parent) in user's Firestore document
- Maintains camera access for children as before

## Firestore Database Structure

### Users Collection
```
Collection: users
├── Document: [UID]
│   ├── uid: string (Firebase User ID)
│   ├── displayName: string
│   ├── email: string
│   ├── userType: "student" | "parent"
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

## Next Steps: Configure Firestore Security Rules

1. **Go to Firebase Console**
   - Navigate to https://console.firebase.google.com
   - Select your "E-Learning Hub" project

2. **Open Firestore Database**
   - Left sidebar → Firestore Database
   - Click "Rules" tab

3. **Replace Default Rules** with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to access their own documents
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Add more collections as needed
    match /sessions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Click "Publish"**

## Testing the Integration

### Sign Up Flow
1. Navigate to Signup page
2. Enter email (e.g., user@example.com)
3. Enter full name and password (min 6 chars)
4. Click "Create Account"
5. **Result**: User created in Firebase Auth and profile saved to Firestore

### Login Flow
1. Navigate to Login page
2. Enter email and password
3. Click "Login"
4. **Result**: User logged in, redirected to role selection

### Role Selection
1. Select "I'm a Child" or "I'm a Parent"
2. **Result**: Role saved to user's Firestore document

### Password Reset
1. Navigate to Forgot Password page
2. Enter your registered email
3. Click "Send Reset Link"
4. **Result**: Firebase sends password reset email

## Key Changes from localStorage

| Feature | Before (localStorage) | After (Firebase) |
|---------|----------------------|------------------|
| Authentication | Manual username/password comparison | Firebase Authentication API |
| User Storage | Plain text objects | Firestore database |
| Password Reset | Local password update | Email-based reset link |
| User Lookup | Client-side string matching | Firebase Auth backend |
| Password Security | Plain text | Firebase handles hashing |
| Session Management | localStorage tokens | Firebase auth tokens |

## Environment Variables

Your API Key is already embedded in `src/config/firebase.ts`. In production, consider:

1. Using `.env.local` file:
```
VITE_FIREBASE_API_KEY=AIzaSyAsvahYhbSX7sqYPczamw50cc60GMw8yiU
VITE_FIREBASE_AUTH_DOMAIN=e-learning-hub-30a1c.firebaseapp.com
...
```

2. Update `src/config/firebase.ts` to use environment variables:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  ...
};
```

## Troubleshooting

### "Firebase is not initialized"
- Ensure Firebase config file exists at `src/config/firebase.ts`
- Verify `auth` and `db` are properly exported

### "Missing permission for collection"
- Update Firestore security rules (see above)
- Ensure user is authenticated (`request.auth != null`)

### "Email already in use"
- User already has an account with that email
- User should use Login with correct password or reset password

### "Invalid email"
- Firebase requires valid email format (user@domain.com)
- Check for typos in email address

## Production Checklist

- [ ] Test all auth flows (signup, login, password reset)
- [ ] Enable Firestore backups in Firebase Console
- [ ] Set up Cloud Functions for additional security
- [ ] Enable multi-factor authentication (optional)
- [ ] Configure email templates in Firebase (optional)
- [ ] Set up monitoring and alerts in Firebase
- [ ] Move API key to environment variables
- [ ] Test on different devices and browsers

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Console](https://console.firebase.google.com)

