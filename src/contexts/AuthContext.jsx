import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

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

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};