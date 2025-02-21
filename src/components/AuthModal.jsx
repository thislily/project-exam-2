import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { registerUrl, loginUrl, headers } from "../service/api";
import { useAuth } from "../context/AuthContext"; // Import useAuth

function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, handleLoginSuccess } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    avatar: { url: "", alt: "" },
    banner: { url: "", alt: "" },
    venueManager: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name.includes("avatar") || name.includes("banner")) {
      const [parent, child] = name.split(".");
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      requestBody = { ...requestBody, name: formData.name };
      if (formData.bio) requestBody.bio = formData.bio;
      if (formData.venueManager) requestBody.venueManager = formData.venueManager;
      if (formData.avatar.url.trim()) {
        requestBody.avatar = { url: formData.avatar.url, alt: formData.avatar.alt || "" };
      }
      if (formData.banner.url.trim()) {
        requestBody.banner = { url: formData.banner.url, alt: formData.banner.alt || "" };
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
      } else {
        // Login case
        localStorage.setItem("accessToken", data.data.accessToken);
      }
      handleLoginSuccess();
      closeAuthModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={isAuthModalOpen} onClose={closeAuthModal} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button onClick={closeAuthModal} className="absolute top-2 right-2 text-gray-500 hover:text-black">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center">{isRegistering ? "Register" : "Login"}</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          {isRegistering && (
            <>
              <input type="text" name="name" placeholder="Username" required value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
              <textarea name="bio" placeholder="Bio (optional, max 160 characters)" maxLength={160} value={formData.bio} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
              <input type="url" name="avatar.url" placeholder="Avatar URL (optional)" value={formData.avatar.url} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
              <input type="text" name="avatar.alt" placeholder="Avatar Alt Text (optional, max 120 characters)" maxLength={120} value={formData.avatar.alt} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
              <input type="url" name="banner.url" placeholder="Banner URL (optional)" value={formData.banner.url} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
              <input type="text" name="banner.alt" placeholder="Banner Alt Text (optional, max 120 characters)" maxLength={120} value={formData.banner.alt} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="venueManager" checked={formData.venueManager} onChange={handleInputChange} />
                Register as a Venue Manager
              </label>
            </>
          )}
          <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" />
          <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} className="w-full p-2 border rounded mb-4" />
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center mt-4">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-blue-600 hover:underline">
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </Dialog>
  );
}

export default AuthModal;
