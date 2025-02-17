import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
// import VenueManagerButton from "../components/VenueManager";
import Calendar from "../components/Calendar";
import Button from "../components/Button";
import { venuesUrl, headers } from "../service/api";
import StarRating from "../components/StarRating";

function VenuePage() {
  const { id } = useParams(); // e.g., /venue/:id
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a single venue by ID, including owner and bookings
  useEffect(() => {
    async function fetchVenue() {
      try {
        setLoading(true);
        // Use _owner and _bookings in query string
        const response = await fetch(
          `${venuesUrl}/${id}?_owner=true&_bookings=true`,
          { headers }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }

        const json = await response.json();
        console.log("Fetched Venue Data:", json);
        // The actual venue data is nested in json.data
        setVenue(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-4">Loading venue...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  if (!venue) {
    return <p className="text-center mt-4">No venue data found</p>;
  }

  // Destructure data from venue
  const {
    name,
    description,
    price,
    maxGuests,
    rating,
    media,
    location,
    meta,
    // owner,
    bookings,
  } = venue;

  // For your manager or owner component
  // If your VenueManager expects something else, pass relevant fields

  // Example: build an amenities array from meta
  const amenities = [];
  if (meta?.wifi) amenities.push("Free Wi-Fi");
  if (meta?.parking) amenities.push("Parking");
  if (meta?.breakfast) amenities.push("Breakfast included");
  if (meta?.pets) amenities.push("Pets allowed");

  return (
    <div className="font-body bg-gray-100 text-black mt-16">
      {/* Header with venue name */}
      <header className="text-start py-4 ">
        <h1 className="text-3xl font-semibold text-center text-black">
          {name}
        </h1>
      </header>
    <div className="mx-auto my-0 bg-white rounded-2xl max-w-[1000px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
      {/* Carousel: pass media array for images */}
      <ImageCarousel images={media} />

      <div className="flex gap-10 px-12 py-10 bg-white rounded-none max-md:flex-col max-md:p-5 max-sm:p-4">
        {/* Left Column */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium text-black max-sm:text-xl">
            {name}
          </h1>
          <StarRating rating={rating} />

          <p className="mt-5 text-base leading-7 text-black">{description}</p>

          <p className="mt-6 text-base font-medium text-black">
            Price: ${price} per night
          </p>
          <p className="mt-6 text-base text-black">Max Guests: {maxGuests}</p>

          {/* Amenities */}
          <div className="mt-6 text-base text-black">
            <h2 className="font-semibold">Amenities</h2>
            {amenities.length ? (
              <ul className="list-disc list-inside">
                {amenities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : (
              <p>No amenities listed</p>
            )}
          </div>

          {/* Location */}
          {location && (
            <div className="mt-9 text-base text-black">
              <h2 className="font-semibold">Location</h2>
              {/* Show only if provided */}
              {location.address && <p>{location.address}</p>}
              {location.city && <p>{location.city}</p>}
              {location.country && <p>{location.country}</p>}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-[400px] max-md:w-full">
          {/* If you have a VenueManager component that shows manager details or actions */}
          {/* <VenueManagerButton owner={owner}/> */}

          {/* Bookings = data about existing bookings for the calendar */}
          <h2 className="mx-0 my-5 text-xl font-medium text-center text-black">
            Availability
          </h2>
          <Calendar venueId={id} bookings={bookings} />

          
          {/* Button component with venueId prop */}

          <Button venueId={id} />
        </div>
      </div>
    </div>
    </div>
  );
}

export default VenuePage;
