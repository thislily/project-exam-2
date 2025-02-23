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

// Helper: calculates number of nights between two dates.
const daysBetween = (start, end) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end - start) / msPerDay);
};

function VenuePage() {
  const { id } = useParams(); // e.g., /venue/:id
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Modal & booking state
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  // editingBooking is non-null when updating an existing booking.
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  // State for delete confirmation (for edit mode)
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { user, openAuthModal } = useAuth();

  // Fetch venue data (with owner & bookings)
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

  // Calculate cost given two dates and the venue price.
  const calculateCost = (dateFrom, dateTo) => {
    const nights = daysBetween(new Date(dateFrom), new Date(dateTo));
    return nights * venue.price;
  };

  const newTotalCost =
    selectedDates && selectedDates.start && selectedDates.end
      ? calculateCost(selectedDates.start, selectedDates.end)
      : null;

  let originalCost, newCost, costDiff;
  if (editingBooking && selectedDates && selectedDates.start && selectedDates.end) {
    originalCost = calculateCost(editingBooking.dateFrom, editingBooking.dateTo);
    newCost = calculateCost(selectedDates.start, selectedDates.end);
    costDiff = newCost - originalCost;
  }

  // Updated booking submission: uses POST for new, PUT for editing.
  const handleBookingConfirm = async () => {
    try {
      const bookingData = {
        dateFrom: new Date(selectedDates.start).toISOString(),
        dateTo: new Date(selectedDates.end).toISOString(),
        guests: Number(guestCount),
        venueId: id,
      };
      let res;
      if (editingBooking) {
        res = await fetch(`${bookingsUrl}/${editingBooking.id}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(bookingData),
        });
      } else {
        res = await fetch(bookingsUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(bookingData),
        });
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Booking submission failed: ${errorText}`);
      }
      const data = await res.json();
      console.log("Booking submission result:", data);
      setBookingConfirmed(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle booking deletion (for edit mode)
  const handleBookingDelete = async () => {
    try {
      const res = await fetch(`${bookingsUrl}/${editingBooking.id}`, {
        method: "DELETE",
        headers: headers,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Booking deletion failed: ${errorText}`);
      }
      console.log("Booking deleted");
      setBookingConfirmed(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // Open modal in edit mode.
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setSelectedDates({ start: booking.dateFrom, end: booking.dateTo });
    setGuestCount(booking.guests);
    setBookingModalOpen(true);
    setBookingConfirmed(false);
    setConfirmDelete(false);
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

  const { name: venueName, description, price, maxGuests, rating, media, location, meta, bookings } = venue;
  const amenities = [];
  if (meta?.wifi) amenities.push("Free Wi-Fi");
  if (meta?.parking) amenities.push("Parking");
  if (meta?.breakfast) amenities.push("Breakfast included");
  if (meta?.pets) amenities.push("Pets allowed");

  // Determine if the logged-in user has a booking at this venue by comparing customer names.
  const userBookings =
    user && bookings
      ? bookings.filter(
          (booking) =>
            booking.customer && booking.customer.name === user.name
        )
      : [];

  return (
    <div className="container font-body bg-gray-100 text-black pt-4">
      <Breadcrumbs overrideLast={venueName} />
      <header className="text-start pb-4 mx-auto max-w-[1000px] px-2">
        <h1 className="text-3xl font-semibold text-start text-black">
          {venueName}
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
              {venueName}
            </h1>
            {user && userBookings.length > 0 && (
              <div className="my-2">
                <p className="font-semibold text-warning mb-2">Your Bookings:</p>
                {userBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border p-2 mb-1">
                    <span>
                      {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
                      {new Date(booking.dateTo).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleEditBooking(booking)}
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                    >
                      Edit Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
            <StarRating rating={rating} />
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
              selectedDates={selectedDates}
            />
            <Button
              venueId={id}
              className={"max-w-fit mx-auto"}
              text={"Book Now"}
              onClick={() => {
                if (!user) {
                  openAuthModal();
                } else {
                  if (!editingBooking) {
                    setGuestCount(1);
                  }
                  setBookingModalOpen(true);
                  setBookingConfirmed(false);
                  setConfirmDelete(false);
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
              <p className="mb-4">
                {editingBooking ? "Booking updated!" : "Booking confirmed!"}
              </p>
              {editingBooking && (
                <p className="mb-4">
                  Original Cost: ${originalCost} | New Cost: ${newCost} (
                  {costDiff >= 0 ? "+" : ""}
                  {costDiff})
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-breeze text-black rounded"
                >
                  Okay
                </button>
              </div>
            </div>
          ) : confirmDelete ? (
            <div>
              <p className="mb-4 text-red-600">
                Are you sure you want to delete this booking?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleBookingDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                {editingBooking ? "Edit your booking" : "Confirm your booking"}
              </h3>
              {/* Always show the Calendar */}
              <Calendar
                venueId={id}
                bookings={bookings}
                onDateChange={(dates) => setSelectedDates(dates)}
                selectedDates={selectedDates}
              />
              <div className="mb-4">
                <label htmlFor="guestCount" className="block mb-2">
                  Number of Guests:
                </label>
                <input
                  id="guestCount"
                  type="number"
                  min="1"
                  max={maxGuests}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {selectedDates && selectedDates.start && selectedDates.end && (
                <>
                  {!editingBooking && newTotalCost !== null && (
                    <p className="mb-4">Total Cost: ${newTotalCost}</p>
                  )}
                  {editingBooking && (
                    <p className="mb-4">
                      Original Cost: ${originalCost} | New Cost: ${newCost} (
                      {costDiff >= 0 ? "+" : ""}
                      {costDiff})
                    </p>
                  )}
                </>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleBookingConfirm}
                  className="px-4 py-2 bg-breeze text-black rounded"
                >
                  {editingBooking ? "Update Booking" : "Confirm Booking"}
                </button>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>
                {editingBooking && (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 bg-red-300 text-black rounded"
                  >
                    Delete Booking
                  </button>
                )}
              </div>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default VenuePage;
