import React from "react";
import Calendar from "./Calendar";
import Button from "./Button";

/**
 * 
 * @name BookingActions
 * @description A component that displays the availability of a venue and allows users to book it.
 * @param {string} id - The unique identifier of the venue.
 * @param {Array} bookings - The bookings for the venue.
 * @param {Array} selectedDates - The selected dates for booking.
 * @param {Function} onDateChange - A function to handle date changes.
 * @param {Function} onBookNow - A function to handle the booking process.
 * @returns {JSX.Element} The BookingActions component.
 * 
 */

const BookingActions = ({ id, bookings, selectedDates, onDateChange, onBookNow }) => {
  return (
    <div className="w-[400px] max-md:w-full mx-auto flex flex-col justify-center gap-5">
      <h2 className="text-xl font-medium text-center text-black">Availability</h2>
      <Calendar
        venueId={id}
        bookings={bookings}
        onDateChange={onDateChange}
        selectedDates={selectedDates}
      />
      <Button
        venueId={id}
        className={"max-w-fit mx-auto text-harbour border-4 border-harbour bg-white hover:bg-harbour hover:text-white"}
        text={"Book Now"}
        onClick={onBookNow}
      />
    </div>
  );
};

export default BookingActions;
