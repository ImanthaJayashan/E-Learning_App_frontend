import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthButtons.css';

interface AuthButtonsProps {
    className?: string;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ className = "" }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = React.useState(false);

    const user = localStorage.getItem("user");
    const userType = localStorage.getItem("userRole");
    const username = localStorage.getItem("username");

    const isAuthenticated = !!user && !!userType;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/login');
    };

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

    return (
        <div className={`auth-buttons-container ${className}`}>
            <div className="user-menu">
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

                {showMenu && (
                    <div className="dropdown-menu">
                        <div className="menu-header">
                            <p className="user-email">{username}</p>
                            <p className="user-type">{userType === 'parent' ? 'Parent' : 'Student'}</p>
                        </div>
                        <hr />
                        <button className="menu-item" onClick={() => navigate('/profile')}>
                            👤 Profile
                        </button>
                        <button className="menu-item" onClick={() => navigate('/settings')}>
                            ⚙️ Settings
                        </button>
                        <hr />
                        <button
                            className="menu-item logout-btn"
                            onClick={handleLogout}
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
