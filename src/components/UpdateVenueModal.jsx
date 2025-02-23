import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

const UpdateVenueModal = ({ isOpen, onClose, venue, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    description: "",
    media: [],
    price: "",
    maxGuests: "",
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (venue) {
      setFormData({
        description: venue.description,
        media: venue.media || [],
        price: venue.price,
        maxGuests: venue.maxGuests,
      });
    }
    setConfirmDelete(false);
  }, [venue, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "maxGuests") {
      const num = Number(value);
      setFormData((prev) => ({
        ...prev,
        maxGuests: num > 100 ? 100 : num < 1 ? 1 : num,
      }));
    } else if (name === "price") {
      const num = Number(value);
      setFormData((prev) => ({
        ...prev,
        price: num > 10000 ? 10000 : num,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() === "") return;
    if (formData.media.length >= 8) {
      alert("You can add a maximum of 8 images.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { url: newImageUrl, alt: newImageAlt || "Venue image" }],
    }));
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  // If confirmDelete is true, show delete confirmation view
  if (confirmDelete) {
    return (
      <Dialog
        open={isOpen}
        onClose={() => { onClose(); setConfirmDelete(false); }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full max-h-screen overflow-y-auto relative">
          <button
            onClick={() => { onClose(); setConfirmDelete(false); }}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            X
          </button>
          <Dialog.Title className="text-xl font-semibold mb-4">
            Delete Venue
          </Dialog.Title>
          <p className="mb-4 text-red-600">
            Are you sure you want to delete this venue? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={async () => { await onDelete(); }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  // Otherwise, show update venue form.
  return (
    <Dialog
      open={isOpen}
      onClose={() => { onClose(); setConfirmDelete(false); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full max-h-screen overflow-y-auto relative">
        <button
          onClick={() => { onClose(); setConfirmDelete(false); }}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          X
        </button>
        <Dialog.Title className="text-xl font-semibold mb-4">
          Manage Venue for {venue.name}
        </Dialog.Title>
        {/* Mini Preview */}
        <div className="border p-4 rounded mb-4 bg-gray-50">
          <h3 className="font-bold text-lg">{venue.name}</h3>
          <p>{formData.description}</p>
          <p className="mt-1">Price: ${formData.price} per night</p>
          <p>Max Guests: {formData.maxGuests}</p>
          {formData.media.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {formData.media.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded resize-none"
              rows="3"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="price" className="block mb-1">
                Price per Night
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                max="10000"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="maxGuests" className="block mb-1">
                Max Guests
              </label>
              <input
                type="number"
                id="maxGuests"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                max="100"
                required
              />
            </div>
          </div>
          {/* New Image Section */}
          <div>
            <div className="mb-4">
              <label htmlFor="newImageUrl" className="block mb-1 text-black">
                New Image URL
              </label>
              <input
                type="text"
                id="newImageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newImageAlt" className="block mb-1 text-black">
                New Image Description
              </label>
              <input
                type="text"
                id="newImageAlt"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleAddImage}
              className="p-3 bg-gray-300 rounded-md mb-4"
            >
              Add Image
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update Venue
            </button>
            <button
              type="button"
              onClick={() => { onClose(); setConfirmDelete(false); }}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-300 text-black rounded"
            >
              Delete Venue
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default UpdateVenueModal;
