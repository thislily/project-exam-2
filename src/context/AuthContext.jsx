// AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => {
    console.log("openAuthModal called");
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    console.log("closeAuthModal called");
    setAuthModalOpen(false);
  };

  const handleLoginSuccess = () => {
    console.log("Login successful");
    // You can add more logic here, like updating a global user state.
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        handleLoginSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
