import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { profilesUrl, headers } from "../service/api";
import { useAuth } from "../context/AuthContext";

/**
 * 
 * @name EditProfileModal
 * @description A modal for editing a user profile.
 * @param {Object} props - The props object.
 * @param {Boolean} props.isOpen - Whether the modal is open.
 * @param {Function} props.onClose - The function to run when the modal closes.
 * @param {Object} props.profile - The user profile data.
 * @param {Function} props.onProfileUpdate - The function to run when the profile updates.
 * @returns {JSX.Element} The EditProfileModal component.
 * 
 */ 

const EditProfileModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bio: "",
    avatarUrl: "",
    bannerUrl: "",
    upgrade: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill the form with current profile data when modal opens.
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        avatarUrl: profile.avatar?.url || "",
        bannerUrl: profile.banner?.url || "",
        upgrade: false
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        bio: formData.bio,
        avatar: { url: formData.avatarUrl, alt: "User avatar" },
        banner: { url: formData.bannerUrl, alt: "User banner" }
      };
      if (formData.upgrade) {
        payload.venueManager = true;
      }
      const res = await fetch(`${profilesUrl}/${user.name}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }
      const data = await res.json();
      onProfileUpdate(data.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mini live preview component.
  const MiniProfilePreview = () => (
    <div className="mt-6 p-4 border rounded bg-gray-50 font-body">
      <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
      <div className="relative w-full h-[120px] overflow-hidden rounded mb-2">
        <img
          src={formData.bannerUrl || "https://placehold.co/800x200/e8f0ff/e8f0ff"}
          alt="Banner preview"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex items-center gap-4">
        <img
          src={formData.avatarUrl || "https://placehold.co/100x100/f4f4f4/f4f4f4"}
          alt="Avatar preview"
          className="object-cover rounded-full border-2 border-white h-16 w-16"
        />
        <div>
          <h4 className="text-xl font-medium">{profile.name}</h4>
          <p className="text-sm">{formData.bio || "No bio provided."}</p>
          {profile.venueManager || formData.upgrade ? (
            <p className="text-sm text-harbour font-semibold">
              Venue Manager
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full h-auto max-h-screen overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          X
        </button>
        <Dialog.Title className="text-xl font-semibold mb-4">
          Edit Profile for {profile.name}
        </Dialog.Title>
        {error && <p className="text-warning mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Name: {profile.name}</p>
          </div>
          <div>
            <label className="block mb-1">Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Avatar URL:</label>
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Banner URL:</label>
            <input
              type="text"
              name="bannerUrl"
              value={formData.bannerUrl}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          {!profile.venueManager && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="upgrade"
                name="upgrade"
                checked={formData.upgrade}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="upgrade" className="text-sm">
                Upgrade to Manager
              </label>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-breeze text-black rounded"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </div>
        </form>
        <MiniProfilePreview />
      </Dialog.Panel>
    </Dialog>
  );
};

export default EditProfileModal;
