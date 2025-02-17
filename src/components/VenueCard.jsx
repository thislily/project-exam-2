import React from "react";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";
import StarRating from "./StarRating";

function VenueCard({ venue }) {
  if (!venue) {
    return <div>Venue data unavailable</div>;
  }

  // Use the first image if available, otherwise pass null to trigger fallback
  const firstImage = venue.media?.[0]?.url || null;

  return (
    <Link
      to={`/venue/${venue.id}`}
      className="flex flex-col md:rounded-md w-full md:w-[340px] h-[460px] shadow-md cursor-pointer hover:shadow-lg"
    >
      <div className="flex flex-col pb-7 w-full bg-white md:rounded-md flex-grow">
        <div className="flex relative flex-col justify-center px-6 py-28 w-full h-[234px] md:rounded-md aspect-[1.667]">
          <ImageWithFallback
            src={firstImage} // Will use fallback if firstImage is null
            alt={venue.name || "Venue Image"}
            className="object-cover absolute inset-0 size-full md:rounded-t-md"
          />
        </div>

        <div className="flex flex-col justify-between px-6 mt-2.5 w-full flex-grow">
          <div className="flex-grow">
            <h2 className="self-start text-xl font-bold max-w-full text-zinc-800 break-words hyphens-auto line-clamp-2">
              {venue.name}
            </h2>
            <p className="mt-2 text-base leading-7 text-zinc-700 max-w-full break-words hyphens-auto line-clamp-3">
              {venue.description}
            </p>
          </div>

          <div className="flex gap-5 justify-between">
            <StarRating rating={venue.rating} />
            <div className="text-xl font-bold leading-tight text-black">
              ${venue.price} per night
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VenueCard;
