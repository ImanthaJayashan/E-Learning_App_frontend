import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from './config';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export interface LoginCredentials {
    email: string;
    password: string;
    userType: 'student' | 'parent';
}

export interface SignupData extends LoginCredentials {
    displayName: string;
    confirmPassword: string;
}

/**
 * Sign up a new user (Student or Parent)
 */
export const signupUser = async (data: SignupData) => {
    try {
        const { email, password, displayName, userType } = data;

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
            displayName: displayName,
        });

        // Store user type and additional info in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: email,
            displayName: displayName,
            userType: userType,
            createdAt: new Date(),
            lastLogin: new Date(),
        });

        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Sign in an existing user
 */
export const loginUser = async (credentials: LoginCredentials) => {
    try {
        const { email, password } = credentials;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verify user type matches in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.userType !== credentials.userType) {
                // User type mismatch
                await signOut(auth);
                throw new Error(`This account is registered as a ${userData.userType}, not a ${credentials.userType}`);
            }
            // Update last login
            await setDoc(doc(db, 'users', user.uid), { lastLogin: new Date() }, { merge: true });
        } else {
            // User document doesn't exist (shouldn't happen in normal flow)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                userType: credentials.userType,
                createdAt: new Date(),
                lastLogin: new Date(),
            });
        }

        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Sign out the current user
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw error;
    }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        throw error;
    }
};
