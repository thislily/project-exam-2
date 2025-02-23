import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import ImageCarousel from "../components/ImageCarousel";
import Calendar from "../components/Calendar";
import Button from "../components/Button";
import { venuesUrl, bookingsUrl, headers } from "../service/api";
import StarRating from "../components/StarRating";
import Breadcrumbs from "../components/Breadcrumbs";
import VenueManagerButton from "../components/VenueManagerButton";
import { useAuth } from "../context/AuthContext";

function VenuePage() {
  const { id } = useParams(); // e.g., /venue/:id
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for booking modal, selected dates, guest count, and confirmation state
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { user, openAuthModal } = useAuth();

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

  // Function to confirm booking via API
  const handleBookingConfirm = async () => {
    try {
      const bookingData = {
        dateFrom: new Date(selectedDates.start).toISOString(),
        dateTo: new Date(selectedDates.end).toISOString(),
        guests: Number(guestCount),
        venueId: id,
      };
      const res = await fetch(bookingsUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) {
        throw new Error("Booking creation failed");
      }
      const data = await res.json();
      console.log("Booking created:", data);
      // Instead of an alert, show confirmation in the modal
      setBookingConfirmed(true);
    } catch (err) {
      alert(err.message);
    }
  };

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

  // Check if the logged-in user has a booking at this venue by comparing customer names
  const userBookings =
    user && bookings
      ? bookings.filter(
          (booking) =>
            booking.customer && booking.customer.name === user.name
        )
      : [];

  return (
    <div className="container font-body bg-gray-100 text-black pt-4">
      <Breadcrumbs overrideLast={name} />
      <header className="text-start pb-4 mx-auto max-w-[1000px] px-2">
        <h1 className="text-3xl font-semibold text-start text-black">
          {name}
          {location &&
            (location.city && location.country
              ? ` in ${location.city}, ${location.country}`
              : location.city
              ? ` in ${location.city}`
              : location.country
              ? ` in ${location.country}`
              : "")}
        </h1>
      </header>
      <div className="mx-auto my-0 bg-white rounded-2xl max-w-[1000px] shadow-md">
        <ImageCarousel images={media} />
        <div className="flex gap-10 px-12 py-10 bg-white rounded-b-xl max-md:flex-col max-md:p-5 max-sm:p-4">
          {/* Left Column */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-black max-sm:text-xl">
              {name}
            </h1>
            {user && userBookings.length > 0 && (
              <div className="my-2 font-semibold text-warning">
                You are booked for these days:{" "}
                {userBookings
                  .map(
                    (booking) =>
                      `${new Date(booking.dateFrom).toLocaleDateString()} - ${new Date(
                        booking.dateTo
                      ).toLocaleDateString()}`
                  )
                  .join(", ")}
              </div>
            )}
            <StarRating rating={rating} />
            <p className="mt-5 text-base leading-7 text-black">
              {description}
            </p>
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
              {location &&
              (location.address || location.city || location.country) ? (
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
          <div className="w-[400px] max-md:w-full mx-auto flex flex-col justify-center gap-5">
            <VenueManagerButton owner={venue.owner} />
            <h2 className="text-xl font-medium text-center text-black">
              Availability
            </h2>
            <Calendar
              venueId={id}
              bookings={bookings}
              onDateChange={(dates) => setSelectedDates(dates)}
            />
            <Button
              venueId={id}
              className={"max-w-fit mx-auto"}
              text={"Book Now"}
              onClick={() => {
                if (!user) {
                  openAuthModal();
                } else {
                  setBookingModalOpen(true);
                  setBookingConfirmed(false);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog
        open={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full relative">
          <button
            onClick={() => setBookingModalOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            X
          </button>
          {bookingConfirmed ? (
            <div>
              <p className="mb-4">Booking confirmed!</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-breeze text-black rounded"
                >
                  Okay
                </button>
              </div>
            </div>
          ) : selectedDates && selectedDates.start && selectedDates.end ? (
            <div>
              <p className="mb-4">
                Do you wish to confirm{" "}
                {new Date(selectedDates.start).toLocaleDateString()} -{" "}
                {new Date(selectedDates.end).toLocaleDateString()} at {name}?
              </p>
              <div className="mb-4">
                <label htmlFor="guestCount" className="block mb-2">
                  Number of Guests:
                </label>
                <input
                  id="guestCount"
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleBookingConfirm}
                  className="px-4 py-2 bg-breeze text-black rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">Please select your dates:</p>
              <Calendar
                venueId={id}
                bookings={bookings}
                onDateChange={(dates) => setSelectedDates(dates)}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default VenuePage;
