import React, { useState, useEffect } from "react";
import ChooseStarRating from "../components/ChooseStarRating";
import ImageGallery from "../components/ImageGallery";
import AmenitiesForm from "../components/AmenitiesForm";
import LocationForm from "../components/LocationForm";
import { venuesUrl, headers } from "../service/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * @name CreateVenuePage
 * @description A page to create a new venue.
 * @returns {JSX.Element} The CreateVenuePage component.
 * 
 */

function CreateVenuePage() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      openAuthModal("Login to create a venue");
    }
  }, [user, openAuthModal]);

  useEffect(() => {
    document.title = "Create Venue | Holidaze";
  }, []);
  

  const [venueData, setVenueData] = useState({
    name: "",
    description: "",
    media: [],
    price: "",
    maxGuests: 1,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Generic handler for inputs.
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name in venueData.meta) {
      setVenueData((prev) => ({
        ...prev,
        meta: { ...prev.meta, [name]: checked },
      }));
    } else if (name in venueData.location) {
      setVenueData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      if (name === "maxGuests") {
        const num = Number(value);
        setVenueData((prev) => ({
          ...prev,
          maxGuests: num > 100 ? 100 : num < 1 ? 1 : num,
        }));
      } else if (name === "price") {
        const num = Number(value);
        setVenueData((prev) => ({
          ...prev,
          price: num > 10000 ? 10000 : num,
        }));
      } else {
        setVenueData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Function to add a new image.
  const handleAddImage = () => {
    if (newImageUrl.trim() === "") return;
    if (venueData.media.length >= 8) {
      setError("You can add a maximum of 8 images.");
      return;
    }
    setVenueData((prev) => ({
      ...prev,
      media: [...prev.media, { url: newImageUrl, alt: newImageAlt || "Venue image" }],
    }));
    setNewImageUrl("");
    setNewImageAlt("");
    setError(null);
  };

  // Function to remove an image from the media array.
  const handleRemoveImage = (indexToRemove) => {
    setVenueData((prev) => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) {
      openAuthModal("Login to create a venue");
      return;
    }

    if (!venueData.name || !venueData.description || !venueData.price || !venueData.maxGuests) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(venuesUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(venueData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create venue");
      }
      const data = await response.json();
      setSuccess(true);
      // Redirect to the new venue's detail page using the id from the response.
      navigate(`/venue/${data.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex flex-col mx-auto max-w-[600px]">
        <div className="flex flex-col items-center px-10 py-10 bg-white rounded-2xl shadow-md">
          <h1 className="mb-1 text-3xl font-medium text-center text-black">
            Create a Venue
          </h1>
          <p className="mb-5 text-sm text-center text-gray-500">*Mandatory field</p>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">Venue created successfully!</p>}

          {/* Name */}
          <div className="mb-4 w-full">
            <label htmlFor="name" className="block mb-1 text-black">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={venueData.name}
              onChange={handleInputChange}
              required
              className="p-2 w-full h-10 rounded-md border border-gray-500"
            />
          </div>

          {/* Description */}
          <div className="mb-4 w-full">
            <label htmlFor="description" className="block mb-1 text-black">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={venueData.description}
              onChange={handleInputChange}
              required
              className="p-2 w-full rounded-md border border-gray-500 resize-none h-24"
            />
          </div>

          {/* Image Gallery Section */}
          <ImageGallery
            media={venueData.media}
            newImageUrl={newImageUrl}
            newImageAlt={newImageAlt}
            onNewImageUrlChange={(e) => setNewImageUrl(e.target.value)}
            onNewImageAltChange={(e) => setNewImageAlt(e.target.value)}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
          />

          {/* Price per Night */}
          <div className="mb-4 w-full">
            <label htmlFor="price" className="block mb-1 text-black">
              Price per Night *
            </label>
            <div className="flex overflow-hidden rounded-md border border-gray-500 w-[127px]">
              <div className="px-2.5 py-2.5 bg-gray-200">$</div>
              <input
                type="number"
                id="price"
                name="price"
                value={venueData.price}
                onChange={handleInputChange}
                required
                className="flex-1 p-2.5 border-none"
                max="10000"
              />
            </div>
          </div>

          {/* Max Guests */}
          <div className="mb-4 w-full">
            <label htmlFor="maxGuests" className="block mb-2 text-black">
              Max Guests *
            </label>
            <div className="flex items-center border border-gray-500 rounded-md">
              <button
                type="button"
                onClick={() =>
                  setVenueData((prev) => ({
                    ...prev,
                    maxGuests: Math.max(1, prev.maxGuests - 1),
                  }))
                }
                className="px-3 py-2"
                aria-label="Decrease guest count"
              >
                -
              </button>
              <input
                type="text"
                id="maxGuests"
                value={venueData.maxGuests}
                readOnly
                className="p-2 w-10 text-center"
                aria-label="Guest count"
              />
              <button
                type="button"
                onClick={() =>
                  setVenueData((prev) => ({
                    ...prev,
                    maxGuests: Math.min(100, prev.maxGuests + 1),
                  }))
                }
                className="px-3 py-2"
                aria-label="Increase guest count"
              >
                +
              </button>
            </div>
          </div>

          {/* Amenities Section */}
          <AmenitiesForm meta={venueData.meta} onChange={handleInputChange} />

          {/* Location Section (without postal code) */}
          <LocationForm locationData={venueData.location} onChange={handleInputChange} />

          {/* Star Rating */}
          <ChooseStarRating
            label="Self Described Star Rating"
            onChange={(rating) =>
              setVenueData((prev) => ({ ...prev, rating }))
            }
          />

          <button
            type="submit"
            className="p-3 mt-6 bg-white hover:bg-sunbeam border-sunbeam border-4 rounded-md text-xl font-semibold"
          >
            {loading ? "Creating..." : "Create Venue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateVenuePage;
