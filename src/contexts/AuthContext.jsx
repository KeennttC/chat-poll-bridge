import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({ uid: firebaseUser.uid, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const register = async (userData) => {
    const { email, password, username } = userData;
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return false;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), { username, role: 'user' });
      setUser({ uid: user.uid, username, role: 'user' });
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const login = async (email, password) => {
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return false;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const logout = () => signOut(auth);

  const removeUser = async (uid) => {
    if (user?.role === 'admin') {
      await deleteDoc(doc(db, 'users', uid));
    }
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      error,
      login, 
      logout, 
      register, 
      removeUser, 
      resetPassword
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;