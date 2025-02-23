import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * @name AuthContext
 * @description The context for authentication state.
 * @type {Object}
 * @property {Boolean} isAuthModalOpen - The state of the authentication modal.
 * @property {Function} openAuthModal - A function to open the authentication modal.
 * @property {Function} closeAuthModal - A function to close the authentication modal.
 * @property {Function} handleLoginSuccess - A function to run when login is successful.
 * @property {Object} user - The user object.
 * @property {Function} logout - A function to log the user out.
 * @returns {JSX.Element} The AuthContext component.
 *
 */

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
    // Redirect to the home page after logging out
    window.location.href = "/";
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
