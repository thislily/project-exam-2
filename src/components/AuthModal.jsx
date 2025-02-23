import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { registerUrl, loginUrl, headers } from "../service/api";
import { useAuth } from "../context/AuthContext";

// Default values for registration
const DEFAULT_AVATAR = {
  url: "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg",
  alt: "Default avatar",
};

const DEFAULT_BANNER = {
  url: "https://www.beautylabinternational.com/wp-content/uploads/2020/03/Hero-Banner-Placeholder-Light-1024x480-1.png",
  alt: "Default banner",
};

function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, handleLoginSuccess } = useAuth();
  // Our formData holds extra keys that won't be shown in the UI
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    avatar: { url: "", alt: "" },
    banner: { url: "", alt: "" },
    venueManager: false,
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Holds the new user's name to display the welcome reminder
  const [newUserName, setNewUserName] = useState("");
  

  // Automatically clear the welcome new user reminder after 30 seconds
  useEffect(() => {
    if (newUserName) {
      const timer = setTimeout(() => {
        setNewUserName("");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [newUserName]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let requestBody = {
      email: formData.email,
      password: formData.password,
    };

    if (isRegistering) {
      // Automatically add default bio, avatar, and banner values
      requestBody = {
        ...requestBody,
        name: formData.name,
        bio: "",
        avatar: { url: DEFAULT_AVATAR.url, alt: DEFAULT_AVATAR.alt },
        banner: { url: DEFAULT_BANNER.url, alt: DEFAULT_BANNER.alt },
      };
      if (formData.venueManager) {
        requestBody.venueManager = formData.venueManager;
      }
    }

    const url = isRegistering ? registerUrl : loginUrl;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Authentication failed");
      }

      if (isRegistering) {
        // Registration succeeded but no token is provided,
        // so immediately call the login endpoint:
        const loginResponse = await fetch(loginUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
          throw new Error(loginData.errors?.[0]?.message || "Login failed");
        }
        localStorage.setItem("accessToken", loginData.data.accessToken);
        // Set the new user's name for the welcome reminder
        setNewUserName(formData.name);
        // Pass user data (including avatar info) to the auth context
        handleLoginSuccess(loginData.data);
      } else {
        // Login case
        localStorage.setItem("accessToken", data.data.accessToken);
        handleLoginSuccess(data.data);
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isAuthModalOpen}
        onClose={closeAuthModal}
        className="fixed inset-0 z-50 flex items-center justify-center font-body bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-full max-w-md relative max-h-screen overflow-y-auto">
          <button
            onClick={closeAuthModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-semibold text-center font-heading">
            {isRegistering ? "Register" : "Login"}
          </h2>
          <p className="text-center mt-4">
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 hover:underline"
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-4">
            {isRegistering && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Username"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    name="venueManager"
                    checked={formData.venueManager}
                    onChange={handleInputChange}
                  />
                  Register as a Venue Manager
                </label>
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              type="submit"
              className="w-full p-2 bg-breeze text-black font-heading font-medium rounded"
              disabled={loading}
            >
              {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
            </button>
          </form>
        </div>
      </Dialog>
      {/* Welcome Reminder Box (only appears after successful registration) */}
      {newUserName && (
        <div className="fixed bottom-4 font-heading right-4 border border-gray-300 p-4 rounded-md bg-white shadow-lg z-50">
          <Link to={`/profile/${newUserName}`} className="text-blue-600">
            Welcome {newUserName}, <br />
            Your profile is currently blank. <br />
            Feel free to change it here.
          </Link>
        </div>
      )}
    </>
  );
}

export default AuthModal;
