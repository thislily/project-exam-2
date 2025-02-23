import React from "react";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

function BookingCard({ booking }) {
  // Make sure venue data is available.
  const venue = booking.venue;
  if (!venue) {
    return (
      <div className="p-4 text-red-500">
        Venue information not available
      </div>
    );
  }

  const imageUrl = venue.media?.[0]?.url || "https://via.placeholder.com/150";
  const imageAlt = venue.media?.[0]?.alt || "Venue image";

  return (
    <Link
      to={`/venue/${venue.id}`}
      className="flex flex-col md:rounded-md w-full md:w-[340px] h-[460px] shadow-md cursor-pointer hover:shadow-lg"
    >
      <div className="flex flex-col pb-7 w-full bg-white md:rounded-md flex-grow">
        {/* Image Container */}
        <div className="flex relative flex-col justify-center px-6 py-28 w-full h-[234px] md:rounded-md aspect-[1.667]">
          <ImageWithFallback
            src={imageUrl}
            alt={imageAlt}
            className="object-cover absolute inset-0 size-full md:rounded-t-md"
          />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-between px-6 mt-2.5 w-full flex-grow">
          <div className="flex-grow">
            {/* Venue Name */}
            <h2 className="self-start text-xl font-bold max-w-full text-zinc-800 break-words hyphens-auto line-clamp-2">
              {venue.name}
            </h2>
            {/* Booking Date Range */}
            <p className="mt-2 text-base leading-7 text-zinc-700 max-w-full break-words hyphens-auto">
              {new Date(booking.dateFrom).toLocaleDateString()} –{" "}
              {new Date(booking.dateTo).toLocaleDateString()}
            </p>
            {/* Guest Count */}
            <p className="mt-1 text-base leading-7 text-zinc-700 max-w-full break-words hyphens-auto">
              Guests: {booking.guests}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BookingCard;
