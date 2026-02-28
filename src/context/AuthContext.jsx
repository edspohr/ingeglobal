import React, { createContext, useState, useContext, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  OPERATOR: "operator",
  GUEST: "guest",
};

export const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch Firestore data
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data(),
            });
          } else {
            // Document doesn't exist yet (should happen during sign up flow)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: ROLES.GUEST,
              status: STATUS.PENDING,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // -------------------------------------------------------------
    // MOCK SUPERADMIN OVERRIDE
    // -------------------------------------------------------------
    if (email === "fernandoibanezr1976@gmail.com" && password === "123456") {
      setUser({
        uid: "mock-superadmin-fernando",
        email: "fernandoibanezr1976@gmail.com",
        displayName: "Fernando Ibañez",
        jobTitle: "Superadmin",
        role: ROLES.ADMIN,
        status: STATUS.ACTIVE,
      });
      return { success: true };
    }
    // -------------------------------------------------------------

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Initial Firestore document creation
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: ROLES.GUEST,
        status: STATUS.PENDING,
        createdAt: serverTimestamp(),
        contractedModules: [],
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);

      return { success: true };
    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Reset Password Error:", error);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (data) => {
    if (!user) return { success: false, error: "No user logged in" };
    try {
      const userRef = doc(db, "users", user.uid);
      // Use setDoc with merge: true to create the document if it doesn't exist
      await setDoc(userRef, data, { merge: true });

      // Update local state partially
      setUser((prev) => ({ ...prev, ...data }));
      return { success: true };
    } catch (error) {
      console.error("Update Profile Error:", error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error) {
      console.error("Google Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateUserProfile,
        loginWithGoogle,
        ROLES,
        STATUS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
