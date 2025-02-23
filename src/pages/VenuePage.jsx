import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import Breadcrumbs from "../components/Breadcrumbs";
import { venuesUrl, bookingsUrl, headers } from "../service/api";
import { useAuth } from "../context/AuthContext";
import VenueDetails from "../components/VenueDetails";
import BookingActions from "../components/BookingActions";
import BookingModal from "../components/BookingModal";
import UpdateVenueModal from "../components/UpdateVenueModal";

/**
 *
 * @name VenuePage
 * @description The venue page component.
 * @returns {JSX.Element} The VenuePage component.
 *
 */

const daysBetween = (start, end) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end - start) / msPerDay);
};

function VenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking modal state.
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Update venue modal state.
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    async function fetchVenue() {
      try {
        setLoading(true);
        const response = await fetch(
          `${venuesUrl}/${id}?_owner=true&_bookings=true`,
          { headers }
        );
        if (!response.ok) throw new Error("Failed to fetch venue");
        const json = await response.json();
        setVenue(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVenue();
  }, [id]);

  useEffect(() => {
  if (venue && venue.name) {
    document.title = `${venue.name} | Holidaze`;
  }
}, [venue]);


  const calculateCost = (dateFrom, dateTo) => {
    const nights = daysBetween(new Date(dateFrom), new Date(dateTo));
    return nights * venue.price;
  };

  const newTotalCost =
    selectedDates && selectedDates.start && selectedDates.end
      ? calculateCost(selectedDates.start, selectedDates.end)
      : null;

  let originalCost, newCost, costDiff;
  if (
    editingBooking &&
    selectedDates &&
    selectedDates.start &&
    selectedDates.end
  ) {
    originalCost = calculateCost(
      editingBooking.dateFrom,
      editingBooking.dateTo
    );
    newCost = calculateCost(selectedDates.start, selectedDates.end);
    costDiff = newCost - originalCost;
  }

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
          headers,
          body: JSON.stringify(bookingData),
        });
      } else {
        res = await fetch(bookingsUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(bookingData),
        });
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Booking submission failed: ${errorText}`);
      }
      setBookingConfirmed(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBookingDelete = async () => {
    try {
      const res = await fetch(`${bookingsUrl}/${editingBooking.id}`, {
        method: "DELETE",
        headers,
      });
      if (res.status !== 204) {
        const errorText = await res.text();
        throw new Error(`Booking deletion failed: ${errorText}`);
      }
      setVenue((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((b) => b.id !== editingBooking.id),
      }));
      setBookingConfirmed(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setSelectedDates({ start: booking.dateFrom, end: booking.dateTo });
    setGuestCount(booking.guests);
    setBookingModalOpen(true);
    setBookingConfirmed(false);
    setConfirmDelete(false);
  };

  // Update Venue Handlers
  const handleUpdateVenue = async (updatedData) => {
    try {
      const res = await fetch(`${venuesUrl}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update venue");
      }
      const data = await res.json();
      setVenue(data.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteVenue = async () => {
    try {
      const res = await fetch(`${venuesUrl}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.status !== 204) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete venue");
      }
      // Redirect to the user's profile page after deletion.
      navigate(`/profile/${user.name}`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading venue...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!venue) return <p className="text-center mt-4">No venue data found</p>;

  const userBookings =
    user && venue.bookings
      ? venue.bookings.filter(
          (booking) => booking.customer && booking.customer.name === user.name
        )
      : [];

  const isOwner = venue.owner && user && venue.owner.name === user.name;

  return (
    <div className="container mx-auto p-6">
      <Breadcrumbs overrideLast={venue.name} />
      <header className="text-center pb-4 mx-auto max-w-[1000px] px-2">
        <h1 className="text-3xl font-semibold text-black">
          {venue.name}
          {venue.location &&
            (venue.location.city && venue.location.country
              ? ` in ${venue.location.city}, ${venue.location.country}`
              : venue.location.city
              ? ` in ${venue.location.city}`
              : venue.location.country
              ? ` in ${venue.location.country}`
              : "")}
        </h1>
      </header>
      <div className="mx-auto my-0 bg-white rounded-2xl max-w-[1000px] shadow-md">
        <ImageCarousel images={venue.media} />
        <div className="flex gap-10 px-12 py-10 bg-white rounded-b-xl max-md:flex-col max-md:p-5 max-sm:p-4">
          <VenueDetails
            venue={venue}
            userBookings={userBookings}
            onEditBooking={handleEditBooking}
          />
          <div className="w-[400px] max-md:w-full mx-auto flex flex-col">
            {isOwner ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setUpdateModalOpen(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Manage Venue
                </button>
              </div>
            ) : (
              <BookingActions
                id={id}
                bookings={venue.bookings}
                selectedDates={selectedDates}
                onDateChange={setSelectedDates}
                onBookNow={() => {
                  if (!user) {
                    openAuthModal("Login to book this venue");
                  } else {
                    if (!editingBooking) setGuestCount(1);
                    setBookingModalOpen(true);
                    setBookingConfirmed(false);
                    setConfirmDelete(false);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        id={id}
        bookings={venue.bookings}
        selectedDates={selectedDates}
        onDateChange={setSelectedDates}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        onConfirm={handleBookingConfirm}
        onDelete={handleBookingDelete}
        editingBooking={editingBooking}
        bookingConfirmed={bookingConfirmed}
        confirmDelete={confirmDelete}
        onCancelDelete={() => setConfirmDelete(false)}
        onRequestDelete={() => setConfirmDelete(true)}
        newTotalCost={newTotalCost}
        originalCost={originalCost}
        newCost={newCost}
        costDiff={costDiff}
      />

      {isOwner && (
        <UpdateVenueModal
          isOpen={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          venue={venue}
          onUpdate={handleUpdateVenue}
          onDelete={handleDeleteVenue}
        />
      )}
    </div>
  );
}

export default VenuePage;
