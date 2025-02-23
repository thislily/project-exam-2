import React from "react";
import StarRating from "./StarRating";

/**
 * @name VenueDetails
 * @description The venue details component.
 * @param {Object} props - The props object.
 * @param {Object} props.venue - The venue object.
 * @param {Array} props.userBookings - The user bookings array.
 * @param {Function} props.onEditBooking - The function to run when editing a booking.
 * @returns {JSX.Element} The VenueDetails component.
 *
 */

const VenueDetails = ({ venue, userBookings, onEditBooking }) => {
  const { name, description, price, maxGuests, meta, location } = venue;
  const amenities = [];
  if (meta?.wifi) amenities.push("Free Wi-Fi");
  if (meta?.parking) amenities.push("Parking");
  if (meta?.breakfast) amenities.push("Breakfast included");
  if (meta?.pets) amenities.push("Pets allowed");

  return (
    <div className="flex-1">
      <h1 className="text-2xl font-medium text-black max-sm:text-xl">{name}</h1>
      {userBookings.length > 0 && (
        <div className="my-2">
          <p className="font-semibold text-warning mb-2">Your Bookings:</p>
          {userBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between border p-2 mb-1"
            >
              <span>
                {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
                {new Date(booking.dateTo).toLocaleDateString()}
              </span>
              <button
                onClick={() => onEditBooking(booking)}
                className="px-2 py-1 text-sm bg-harbour text-white rounded"
              >
                Edit Booking
              </button>
            </div>
          ))}
        </div>
      )}
      <StarRating rating={venue.rating} />
      <p className="mt-5 text-base leading-7 text-black">{description}</p>
      <p className="mt-6 text-base font-medium text-black">
        Price: ${price} per night
      </p>
      <p className="mt-6 text-base text-black">Max Guests: {maxGuests}</p>
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
      <div className="mt-9 text-base text-black">
        <h2 className="font-semibold">Location</h2>
        {location && (location.address || location.city || location.country) ? (
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
  );
};

export default VenueDetails;
