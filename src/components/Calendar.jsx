import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../custom-calendar.css"; 

/**
 *  
 * @name Calendar
 * @description A calendar component.
 * @param {Object} props - The props object.
 * @param {Array} props.bookings - The array of bookings to exclude.
 * @param {Function} props.onDateChange - The function to run when the date range changes.
 * @param {Object} props.selectedDates - The currently selected date range.
 * @returns {JSX.Element} The Calendar component.
 */

function Calendar({ bookings = [], onDateChange, selectedDates }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  // Update local state when selectedDates prop changes.
  useEffect(() => {
    if (selectedDates) {
      setStartDate(selectedDates.start ? new Date(selectedDates.start) : null);
      setEndDate(selectedDates.end ? new Date(selectedDates.end) : null);
    }
  }, [selectedDates]);

  // Convert bookings into an array of Date objects to exclude.
  useEffect(() => {
    const allBooked = [];
    bookings.forEach((booking) => {
      if (booking.dateFrom && booking.dateTo) {
        const start = new Date(booking.dateFrom);
        const end = new Date(booking.dateTo);
        const current = new Date(start);
        while (current <= end) {
          allBooked.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      }
    });
    setBookedDates(allBooked);
  }, [bookings]);

  // Handle user selecting a date range.
  const handleChange = (dates) => {
    const [start, end] = dates;
    // If no end date, default end to start (one-day booking)
    const finalEnd = end || start;
    setStartDate(start);
    setEndDate(finalEnd);
    if (onDateChange) {
      onDateChange({ start, end: finalEnd });
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
        className="text-black rounded p-2"
        calendarClassName="custom-calendar"
      />
      {startDate && endDate && (
        <p className="mt-2 text-black">
          You selected: {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default Calendar;
