import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import Calendar from "../components/Calendar";
import Button from "../components/Button";
import { venuesUrl, headers } from "../service/api";
import StarRating from "../components/StarRating";
import Breadcrumbs from "../components/Breadcrumbs";
import VenueManagerButton from "../components/VenueManagerButton";

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
        const response = await fetch(
          `${venuesUrl}/${id}?_owner=true&_bookings=true`,
          { headers }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }
        const json = await response.json();
        console.log("Fetched Venue Data:", json);
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
    bookings,
  } = venue;

  // Build amenities list from meta
  const amenities = [];
  if (meta?.wifi) amenities.push("Free Wi-Fi");
  if (meta?.parking) amenities.push("Parking");
  if (meta?.breakfast) amenities.push("Breakfast included");
  if (meta?.pets) amenities.push("Pets allowed");

  return (
    <div className="container font-body bg-gray-100 text-black pt-4">
      {/* Pass the venue name to Breadcrumbs to override the last segment */}
      <Breadcrumbs overrideLast={name} />
      <header className="text-start pb-4 mx-auto max-w-[1000px] px-2">
        <h1 className="text-3xl font-semibold text-start text-black">
          {name} {location?.city && `in ${location.city}, ${location.country}`}
        </h1>
      </header>
      <div className="mx-auto my-0 bg-white rounded-2xl max-w-[1000px] shadow-md">
        {/* Carousel: pass media array for images */}
        <ImageCarousel images={media} />

        <div className="flex gap-10 px-12 py-10 bg-white rounded-none max-md:flex-col max-md:p-5 max-sm:p-4">
          {/* Left Column */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-black max-sm:text-xl">
              {name}
            </h1>
            <StarRating rating={rating} />

            <p className="mt-5 text-base leading-7 text-black">
              {description}
            </p>

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
                <ul className="list-disc list-inside">
                  <li>None.</li>
                </ul>
              )}
            </div>

            {/* Location: show available fields or a fallback message */}
            <div className="mt-9 text-base text-black">
              <h2 className="font-semibold">Location</h2>
              {(location && (location.address || location.city || location.country)) ? (
                <>
                  {location.address && <p>{location.address}</p>}
                  {location.city && <p>{location.city}</p>}
                  {location.country && <p>{location.country}</p>}
                </>
              ) : (
                <p>No location provided</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[400px] max-md:w-full">
            <VenueManagerButton owner={venue.owner} />
            <h2 className="mx-0 my-5 text-xl font-medium text-center text-black">
              Availability
            </h2>
            <Calendar venueId={id} bookings={bookings} />
            <Button venueId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenuePage;
