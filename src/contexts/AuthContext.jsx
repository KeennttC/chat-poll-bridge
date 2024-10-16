import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ uid: firebaseUser.uid, ...userData });
          await updateDoc(userDocRef, { isOnline: true });
        } else {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, username) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role: 'user',
        isOnline: true
      });
      setUser({ uid: user.uid, username, email, role: 'user', isOnline: true });
      return true;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, 'users', user.uid), { isOnline: true });
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { isOnline: false });
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      logout, 
      register
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;