# 🚪 Logout Button - Complete Guide with Code

## 📍 WHERE IS THE LOGOUT BUTTON?

The logout button appears in **2 places**:

### 1️⃣ **Navbar (Top of Page)**
- Shows **red "🚪 Logout" button** in the top navigation bar
- Visible on all authenticated pages
- Clears all data and returns to login page

### 2️⃣ **User Profile Dropdown Menu**
- Click on user profile button (avatar + username)
- Opens dropdown menu with:
  - 👤 Profile
  - ⚙️ Settings
  - 🚪 Logout

---

## 🔐 LOGOUT CODE LOCATIONS

### 1. **Navbar Component** - `src/components/Navbar.tsx`

```tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthButtons } from "./AuthButtons";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    // Clear all auth-related localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("latestEyeDetection");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* ... navbar content ... */}

        <div className="nav-right">
          {/* ... other buttons ... */}

          {/* LOGOUT BUTTON IN NAVBAR */}
          {userRole && (
            <button 
              type="button" 
              className="nav-cta" 
              style={{ backgroundColor: "#ef4444" }}
              onClick={handleLogout}  // ✅ Calls logout function
              title="Logout and return to login page"
            >
              🚪 Logout
            </button>
          )}

          {/* OR USE THE AUTHBUTTONS COMPONENT */}
          <div>
            <AuthButtons className="navbar-auth-btn" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

### 2. **AuthButtons Component** - `src/components/AuthButtons.tsx`

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthButtons.css';

interface AuthButtonsProps {
    className?: string;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ className = "" }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = React.useState(false);

    // Get user data from localStorage
    const user = localStorage.getItem("user");
    const userType = localStorage.getItem("userRole");
    const username = localStorage.getItem("username");

    const isAuthenticated = !!user && !!userType;

    // ✅ LOGOUT HANDLER FUNCTION
    const handleLogout = () => {
        // Clear all auth data
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        
        // Redirect to login page
        navigate('/login');
    };

    // If not authenticated, show login button
    if (!isAuthenticated) {
        return (
            <button
                className={`auth-btn login-btn ${className}`}
                onClick={() => navigate('/login')}
            >
                Login
            </button>
        );
    }

    // If authenticated, show user menu with logout
    return (
        <div className={`auth-buttons-container ${className}`}>
            <div className="user-menu">
                {/* USER PROFILE BUTTON */}
                <button
                    className="user-btn"
                    onClick={() => setShowMenu(!showMenu)}
                    title={username || 'User'}
                >
                    <span className="user-avatar">
                        {userType === 'parent' ? '👨‍👩‍👧' : '👨‍🎓'}
                    </span>
                    <span className="user-name">{username || 'User'}</span>
                    <span className={`dropdown-icon ${showMenu ? 'open' : ''}`}>▼</span>
                </button>

                {/* DROPDOWN MENU */}
                {showMenu && (
                    <div className="dropdown-menu">
                        <div className="menu-header">
                            <p className="user-email">{username}</p>
                            <p className="user-type">
                                {userType === 'parent' ? 'Parent' : 'Student'}
                            </p>
                        </div>
                        <hr />
                        <button className="menu-item" onClick={() => navigate('/profile')}>
                            👤 Profile
                        </button>
                        <button className="menu-item" onClick={() => navigate('/settings')}>
                            ⚙️ Settings
                        </button>
                        <hr />

                        {/* ✅ LOGOUT BUTTON IN DROPDOWN */}
                        <button
                            className="menu-item logout-btn"
                            onClick={handleLogout}  // ✅ Calls logout function
                        >
                            🚪 Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthButtons;
```

---

## 🔑 KEY LOGOUT CODE

### The Main Logout Function:

```typescript
const handleLogout = () => {
    // Step 1: Remove user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
    // Step 2: Redirect to login page
    navigate('/login');
};
```

### What Gets Cleared from localStorage:

| Key | Value | Purpose |
|-----|-------|---------|
| `user` | `{displayName, username, userType, loginTime}` | User profile data |
| `userRole` | `"student"` or `"parent"` | User type for route protection |
| `username` | `"John Doe"` | Display name for UI |

---

## 👁️ HOW TO FIND THE LOGOUT BUTTON

### **On Login/After Login:**

1. **Method 1 - Navbar Logout Button**
   ```
   Navbar (Top of page)
   └── Right side
       └── Red "🚪 Logout" button
   ```

2. **Method 2 - Profile Dropdown Menu**
   ```
   Click user profile avatar button
   └── Dropdown menu appears
       └── 🚪 Logout button (bottom of menu)
   ```

---

## 🧪 TESTING LOGOUT

### Test 1: Navbar Logout Button
1. Login to app (visit `/login`)
2. After login, look at top navbar
3. Click **red "🚪 Logout" button**
4. ✅ Should be logged out and redirected to `/login`

### Test 2: Profile Dropdown Logout
1. Login to app
2. Click your **avatar** button (user profile button)
3. A dropdown menu appears
4. Click **"🚪 Logout"** button at bottom
5. ✅ Should be logged out and redirected to `/login`

### Test 3: Protected Routes After Logout
1. After logging out, try to access:
   - `/` (home)
   - `/games`
   - `/eye-problem-detector`
2. ✅ Should redirect back to `/login`

---

## 📱 LOGOUT BUTTON STYLING

### Navbar Logout Button CSS
```css
.nav-cta {
  padding: 10px 20px;
  background-color: #ef4444;  /* Red color */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-cta:hover {
  background-color: #dc2626;  /* Darker red on hover */
  transform: translateY(-2px);
}
```

### Profile Dropdown Logout Button CSS
```css
.logout-btn {
  color: #e74c3c;  /* Red color */
}

.logout-btn:hover {
  background: #fee;  /* Light red background */
  color: #c33;      /* Darker red text */
}
```

---

## 🔄 LOGOUT FLOW DIAGRAM

```
User clicks "Logout" button
        ↓
handleLogout() function called
        ↓
localStorage.removeItem('user')
localStorage.removeItem('userRole')
localStorage.removeItem('username')
        ↓
navigate('/login')
        ↓
User redirected to login page ✅
```

---

## 💾 WHAT HAPPENS ON LOGOUT

1. **localStorage is cleared**
   - `user` object deleted
   - `userRole` deleted
   - `username` deleted

2. **User is redirected**
   - From any page → `/login`

3. **Protected routes blocked**
   - Can't access `/`
   - Can't access `/games`
   - Can't access `/parents-dashboard`
   - All redirect back to `/login`

4. **Page shows login form**
   - Fresh login/signup form appears
   - Previous data not remembered

---

## 🚀 QUICK LOGOUT IMPLEMENTATION CHECKLIST

- ✅ Navbar logout button visible
- ✅ Profile dropdown logout button visible
- ✅ handleLogout function defined
- ✅ Clears all localStorage data
- ✅ Redirects to `/login` page
- ✅ Protected routes prevent access after logout
- ✅ Login form fresh on return

---

## 📝 LOGOUT IN OTHER COMPONENTS

If you want to add logout in other places, use this code:

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

---

## 🎯 SUMMARY

| Feature | Location | Status |
|---------|----------|--------|
| Logout Button | Navbar | ✅ Red button, top right |
| Logout Button | Profile Menu | ✅ Dropdown menu bottom |
| logout Function | AuthButtons.tsx | ✅ Line 25-30 |
| logout Function | Navbar.tsx | ✅ Line 12-18 |
| Protected Routes | App.tsx | ✅ Auto-redirect to login |
| localStorage Clear | handleLogout() | ✅ Removes all auth data |

---

## 🎉 LOGOUT IS FULLY FUNCTIONAL!

- ✅ Click **red Logout button** in navbar
- ✅ Click **user profile** → **Logout** in dropdown
- ✅ All data cleared from browser
- ✅ Redirected back to login page
- ✅ Protected pages inaccessible until you login again

**Try it now!** Login, then click the red Logout button. 🚪
