import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [resetCodes, setResetCodes] = useState({});

  const register = (userData) => {
    if (users.some(user => user.username === userData.username)) {
      throw new Error('Username already exists');
    }
    setUsers([...users, userData]);
  };

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setUser({ username: user.username, role: user.role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const removeUser = (username) => {
    if (user?.role === 'admin') {
      setUsers(users.filter(u => u.username !== username));
    }
  };

  const generateResetCode = (username) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setResetCodes({ ...resetCodes, [username]: code });
    return code;
  };

  const resetPassword = (username, newPassword, resetCode) => {
    if (resetCodes[username] === resetCode) {
      const userIndex = users.findIndex(u => u.username === username);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
        setUsers(updatedUsers);
        delete resetCodes[username];
        return true;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      register, 
      removeUser, 
      resetPassword, 
      generateResetCode 
    }}>
      {children}
    </AuthContext.Provider>
  );
};