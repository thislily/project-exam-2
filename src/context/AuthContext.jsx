// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const openAuthModal = () => {
    console.log("openAuthModal called");
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    console.log("closeAuthModal called");
    setAuthModalOpen(false);
  };

  // When login is successful, update the user state and store user data in localStorage.
  const handleLoginSuccess = (userData) => {
    console.log("Login successful", userData);
    setUser(userData);
    // Save both the access token and user data in localStorage.
    localStorage.setItem("accessToken", userData.accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("Logging out");
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // When the app loads, check localStorage for an access token and user data.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        handleLoginSuccess,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
