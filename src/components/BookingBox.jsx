import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

/**
 *
 * @name BookingBox
 * @description A component that displays a booking box with customer information.
 * @param {Object} booking - The booking object.
 * @returns {JSX.Element} The BookingBox component.
 * @example
 * <BookingBox booking={booking} />
 */

const BookingBox = ({ booking }) => {
  const customer = booking.customer;
  const bookingDates = `${new Date(
    booking.dateFrom
  ).toLocaleDateString()} - ${new Date(booking.dateTo).toLocaleDateString()}`;

  return (
    <Link
      to={`/profile/${encodeURIComponent(customer.name)}`}
      className="flex gap-4 items-center p-4 bg-white rounded-md shadow-md hover:shadow-lg transition"
      aria-label={`View ${customer.name}'s profile`}
    >
      {customer.avatar && customer.avatar.url ? (
        <img
          src={customer.avatar.url}
          alt={customer.avatar.alt || "User profile"}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <User className="w-12 h-12" />
      )}
      <div className="flex flex-col">
        <div className="font-medium">{customer.name}</div>
        <div className="text-sm text-gray-500">{bookingDates}</div>
      </div>
    </Link>
  );
};

export default BookingBox;
