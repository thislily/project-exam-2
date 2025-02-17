import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Calendar({ bookings = [], onDateChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  // Convert bookings (with dateFrom/dateTo) into an array of Date objects to exclude
  useEffect(() => {
    const allBooked = [];

    bookings.forEach((booking) => {
      if (booking.dateFrom && booking.dateTo) {
        const start = new Date(booking.dateFrom);
        const end = new Date(booking.dateTo);

        // Generate all dates in the range
        const current = new Date(start);
        while (current <= end) {
          allBooked.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      }
    });

    setBookedDates(allBooked);
  }, [bookings]);

  // Handle user selecting a date range
  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Bubble up the date range if needed
    if (onDateChange) {
      onDateChange({ start, end });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={new Date()}
        excludeDates={bookedDates}
        className="text-black"
      />
      {/* If both dates selected, show a summary below */}
      {startDate && endDate && (
        <p className="mt-2 text-black">
          You selected: {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default Calendar;

