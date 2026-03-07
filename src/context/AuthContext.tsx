import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { getUserData } from '../services/firebase/auth';

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    userType: 'student' | 'parent';
    createdAt: Date;
    lastLogin: Date;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                setUser(currentUser);
                if (currentUser) {
                    const userDoc = await getUserData(currentUser.uid);
                    setUserData(userDoc as UserData);
                } else {
                    setUserData(null);
                }
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value: AuthContextType = {
        user,
        userData,
        loading,
        error,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
