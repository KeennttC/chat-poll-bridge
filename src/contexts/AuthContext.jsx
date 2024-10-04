import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    { username: 'student1', password: 'password123', role: 'student' },
    { username: 'admin1', password: 'adminpass', role: 'admin' },
  ]);

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

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};