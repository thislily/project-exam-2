import React from "react";
import Calendar from "./Calendar";
import Button from "./Button";
import VenueManagerButton from "./VenueManagerButton";

const BookingActions = ({ id, bookings, selectedDates, onDateChange, onBookNow }) => {
  return (
    <div className="w-[400px] max-md:w-full mx-auto flex flex-col justify-center gap-5">
      <VenueManagerButton owner={null} />
      <h2 className="text-xl font-medium text-center text-black">Availability</h2>
      <Calendar
        venueId={id}
        bookings={bookings}
        onDateChange={onDateChange}
        selectedDates={selectedDates}
      />
      <Button
        venueId={id}
        className={"max-w-fit mx-auto"}
        text={"Book Now"}
        onClick={onBookNow}
      />
    </div>
  );
};

export default BookingActions;
